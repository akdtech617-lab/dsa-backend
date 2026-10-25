const bcrypt = require('bcryptjs');
const { pool } = require('./db');

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Seeding database...');

    const adminPasswordHash = await bcrypt.hash('Admin@12345', 12);
    await client.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ('Admin User', 'admin@example.com', $1, 'admin')
       ON CONFLICT (email) DO NOTHING`,
      [adminPasswordHash]
    );

    await client.query(
      `INSERT INTO courses (title, slug, description, icon, is_active, display_order)
       VALUES
        ('Data Structures & Algorithms', 'dsa', 'Master DSA through an immersive, hands-on roadmap.', 'brain-circuit', true, 1),
        ('System Design', 'system-design', 'Coming soon — learn to design scalable systems.', 'network', false, 2),
        ('Object-Oriented Programming', 'oop', 'Coming soon — core OOP principles and design patterns.', 'boxes', false, 3),
        ('Operating Systems', 'os', 'Coming soon — processes, memory, concurrency.', 'cpu', false, 4)
       ON CONFLICT (slug) DO NOTHING`
    );

    const dsaCourseRes = await client.query(`SELECT id FROM courses WHERE slug = 'dsa'`);
    const dsaCourseId = dsaCourseRes.rows[0].id;

    const arraysTopicRes = await client.query(
      `INSERT INTO topics (course_id, title, slug, description, display_order)
       VALUES ($1, 'Arrays', 'arrays', 'The foundation of most data structures.', 1)
       ON CONFLICT (course_id, slug) DO NOTHING RETURNING id`,
      [dsaCourseId]
    );

    let arraysTopicId;
    if (arraysTopicRes.rows.length > 0) {
      arraysTopicId = arraysTopicRes.rows[0].id;
    } else {
      const existing = await client.query(
        `SELECT id FROM topics WHERE course_id = $1 AND slug = 'arrays'`,
        [dsaCourseId]
      );
      arraysTopicId = existing.rows[0].id;
    }

    const subtopicRes = await client.query(
      `INSERT INTO subtopics (topic_id, title, slug, description, content, display_order)
       VALUES ($1, 'Two Pointer Technique', 'two-pointer-technique',
         'A common pattern for solving array problems in O(n).',
         '## Two Pointer Technique\n\nThe two-pointer technique uses two indices moving through a data structure to solve problems in linear time.',
         1)
       ON CONFLICT (topic_id, slug) DO NOTHING RETURNING id`,
      [arraysTopicId]
    );

    let subtopicId;
    if (subtopicRes.rows.length > 0) {
      subtopicId = subtopicRes.rows[0].id;
    } else {
      const existing = await client.query(
        `SELECT id FROM subtopics WHERE topic_id = $1 AND slug = 'two-pointer-technique'`,
        [arraysTopicId]
      );
      subtopicId = existing.rows[0].id;
    }

    await client.query(
      `INSERT INTO problems (subtopic_id, title, slug, description, category, difficulty, hints, display_order)
       VALUES
        ($1, 'Two Sum', 'two-sum',
         'Given an array of integers and a target, return indices of the two numbers that add up to the target.',
         'interview', 'easy',
         'Try a hash map to store numbers you have already seen.', 1),
        ($1, 'Container With Most Water', 'container-with-most-water',
         'Given n non-negative integers representing heights, find two lines that together with the x-axis form a container holding the most water.',
         'interview', 'medium',
         'Start with the widest container and move the shorter pointer inward.', 2)
       ON CONFLICT (subtopic_id, slug) DO NOTHING`,
      [subtopicId]
    );

    console.log('✅ Seed complete!');
    console.log('   Admin login: admin@example.com / Admin@12345');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
  }
}

seed();
