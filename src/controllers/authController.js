const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function sanitizeUser(user) {
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'student')
       RETURNING *`,
      [name, email.toLowerCase(), passwordHash]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    res.status(201).json({ user: sanitizeUser(user), token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Something went wrong while creating your account.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    const user = result.rows[0];

    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    res.json({ user: sanitizeUser(user), token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Something went wrong while logging in.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ user: sanitizeUser(result.rows[0]) });
  } catch (err) {
    console.error('GetMe error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { credential, profile } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Missing Google credential.' });
    }

    let googleId, email, name, picture;

    // Check if real Google Client ID is configured and credential is a real JWT
    if (process.env.GOOGLE_CLIENT_ID && !credential.startsWith('demo_google_')) {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      const payload = ticket.getPayload();
      googleId = payload.sub;
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
    } else {
      // Testing/preview mode when GOOGLE_CLIENT_ID is not configured or demo token is used
      if (profile && profile.email) {
        email = profile.email.toLowerCase().trim();
        name = profile.name || email.split('@')[0];
        picture = profile.picture || 'https://lh3.googleusercontent.com/a/default-user';
        googleId = profile.sub || `google_demo_${Buffer.from(email).toString('hex').slice(0, 16)}`;
      } else {
        return res.status(501).json({
          error: 'Google OAuth Client ID is not configured in backend/.env yet.'
        });
      }
    }

    if (!email) {
      return res.status(400).json({ error: 'Google account has no email associated.' });
    }

    let result = await db.query('SELECT * FROM users WHERE google_id = $1 OR email = $2', [googleId, email.toLowerCase()]);
    let user = result.rows[0];

    if (user) {
      if (!user.google_id) {
        await db.query('UPDATE users SET google_id = $1, avatar_url = COALESCE(avatar_url, $2) WHERE id = $3', [googleId, picture, user.id]);
        user.google_id = googleId;
      }
    } else {
      const insertResult = await db.query(
        `INSERT INTO users (name, email, google_id, avatar_url, role)
         VALUES ($1, $2, $3, $4, 'student') RETURNING *`,
        [name || email.split('@')[0], email.toLowerCase(), googleId, picture]
      );
      user = insertResult.rows[0];
    }

    const token = generateToken(user);
    res.json({ user: sanitizeUser(user), token });
  } catch (err) {
    console.error('Google auth error:', err.message);
    res.status(401).json({ error: 'Google sign-in failed. Please try again.' });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || phone.trim().length < 8) {
      return res.status(400).json({ error: 'A valid phone number is required (include country code, e.g. +1... or +91...).' });
    }

    const cleanPhone = phone.trim();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Delete any old codes for this phone
    await db.query(`DELETE FROM otp_codes WHERE phone = $1`, [cleanPhone]);

    // Save hash into database
    await db.query(
      `INSERT INTO otp_codes (phone, code_hash, expires_at) VALUES ($1, $2, $3)`,
      [cleanPhone, codeHash, expiresAt]
    );

    console.log(`[AUTH] 📱 Generated OTP for ${cleanPhone}: ${code}`);

    // If paid TEXTBELT_KEY is provided, attempt real SMS delivery
    const textbeltKey = process.env.TEXTBELT_KEY;
    if (textbeltKey && textbeltKey.trim() && textbeltKey !== 'textbelt') {
      try {
        const smsResponse = await fetch('https://textbelt.com/text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: cleanPhone,
            message: `Your DSA Verse verification code is ${code}. It expires in 5 minutes.`,
            key: textbeltKey
          })
        });
        const smsResult = await smsResponse.json();
        if (smsResult.success) {
          return res.json({ message: 'Verification code sent to your phone via SMS.', phone: cleanPhone });
        }
        console.warn('Textbelt failed, falling back to instant verification:', smsResult);
      } catch (smsErr) {
        console.warn('SMS delivery network error:', smsErr.message);
      }
    }

    // Default & Development Mode: Return demoCode so the user can verify immediately
    res.json({
      message: 'Verification code generated.',
      phone: cleanPhone,
      demoCode: code,
      isDemo: true
    });
  } catch (err) {
    console.error('sendOtp error:', err);
    res.status(500).json({ error: 'Failed to generate verification code.' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { phone, code, name } = req.body;
    if (!phone || !code) {
      return res.status(400).json({ error: 'Phone number and verification code are required.' });
    }

    const cleanPhone = phone.trim();
    const cleanCode = code.trim();

    const result = await db.query(
      `SELECT * FROM otp_codes WHERE phone = $1 ORDER BY created_at DESC LIMIT 1`,
      [cleanPhone]
    );
    const otpRecord = result.rows[0];

    if (!otpRecord) {
      return res.status(400).json({ error: 'No active verification code found for this number. Please request a new code.' });
    }
    if (new Date(otpRecord.expires_at) < new Date()) {
      return res.status(400).json({ error: 'This verification code has expired. Please request a new code.' });
    }
    if (otpRecord.attempts >= 5) {
      return res.status(429).json({ error: 'Too many incorrect attempts. Please request a new code.' });
    }

    const isMatch = await bcrypt.compare(cleanCode, otpRecord.code_hash);
    if (!isMatch) {
      await db.query('UPDATE otp_codes SET attempts = attempts + 1 WHERE id = $1', [otpRecord.id]);
      return res.status(400).json({ error: 'Incorrect verification code. Please check and try again.' });
    }

    await db.query('DELETE FROM otp_codes WHERE phone = $1', [cleanPhone]);

    let userResult = await db.query('SELECT * FROM users WHERE phone = $1', [cleanPhone]);
    let user = userResult.rows[0];

    if (!user) {
      const sanitizedDigits = cleanPhone.replace(/[^0-9]/g, '');
      const defaultEmail = `${sanitizedDigits}@phone.dsaverse.local`;
      const displayName = name && name.trim() ? name.trim() : `User ${cleanPhone.slice(-4)}`;
      const insertResult = await db.query(
        `INSERT INTO users (name, email, phone, role)
         VALUES ($1, $2, $3, 'student') RETURNING *`,
        [displayName, defaultEmail, cleanPhone]
      );
      user = insertResult.rows[0];
    }

    const token = generateToken(user);
    res.json({ user: sanitizeUser(user), token });
  } catch (err) {
    console.error('verifyOtp error:', err);
    res.status(500).json({ error: 'Failed to verify code.' });
  }
};
