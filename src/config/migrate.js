const fs = require('fs');
const path = require('path');
const { pool } = require('./db');

async function migrate() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log('Running migrations...');
    await pool.query(schema);
    console.log('✅ Migration complete. All tables created (or already existed).');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
