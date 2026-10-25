const { pool } = require('./db');

async function seedBasicHashing() {
  const client = await pool.connect();
  try {
    console.log('Seeding "Learn Basic Hashing" subtopic...');

    const topicRes = await client.query(`SELECT id FROM topics WHERE slug = 'learn-the-basics'`);
    if (topicRes.rows.length === 0) {
      throw new Error('"Learn the basics" topic not found — run seed:basics first.');
    }
    const topicId = topicRes.rows[0].id;

    const subtopicRes = await client.query(
      `INSERT INTO subtopics (topic_id, title, slug, description, display_order)
       VALUES ($1, 'Learn Basic Hashing', 'learn-basic-hashing',
         'A technique for storing and instantly looking up data by key — the foundation behind fast lookups in maps and sets.', 3)
       ON CONFLICT (topic_id, slug) DO UPDATE SET title = EXCLUDED.title
       RETURNING id`,
      [topicId]
    );
    const subtopicId = subtopicRes.rows[0].id;

    const hashingVideo = 'https://www.youtube.com/watch?v=KEs5UyBJ39g';

    const problems = [
      {
        title: 'Basic Hashing', slug: 'basic-hashing',
        description: "Hashing is a technique for storing and quickly retrieving data using a key, typically by mapping keys to array indices with a hash function. It's the foundation behind near-constant-time lookups in maps and sets.",
        examples: 'Storing how many times each number from 0-12 appears:\nhash[5]++ increments the stored count for the value 5.',
        approach: 'When values fall in a small, known range, a plain array can act as a direct hash table. For a wider or unpredictable range, use a hash map (like unordered_map in C++), which computes an index internally via a hash function and handles any collisions automatically.',
        solution_code: `int hashArr[13] = {0};
for (int x : arr) {
    hashArr[x]++;
}`,
        video_url: hashingVideo, platform_url: null
      },
      {
        title: 'Counting Frequencies of Array Elements', slug: 'counting-frequencies-array',
        description: 'Count how many times each element appears in an array.',
        examples: 'Input: [1, 2, 2, 3, 3, 3]\nOutput: 1 → 1 time, 2 → 2 times, 3 → 3 times',
        approach: 'Use a hash map where each key is an array element and the value is its running count. Loop through the array once, incrementing the count for the current element each time.',
        solution_code: `unordered_map<int, int> freq;
for (int x : arr) {
    freq[x]++;
}`,
        video_url: null, platform_url: null
      },
      {
        title: 'Highest Occurring Element in an Array', slug: 'highest-occurring-element',
        description: "Find the element that appears the most times in an array. If there's a tie between multiple elements, return the smallest one among them.",
        examples: 'Input: [1, 3, 2, 3, 2]\nOutput: 2 (both 2 and 3 occur twice, and 2 is the smaller of the two)',
        approach: 'First build a frequency map exactly as in the previous problem. Then scan through that map once, tracking the highest frequency seen so far and its element.',
        solution_code: `int highestOccurring(vector<int>& arr) {
    unordered_map<int, int> freq;
    for (int x : arr) freq[x]++;

    int maxFreq = 0, ans = arr[0];
    for (auto& [num, count] : freq) {
        if (count > maxFreq || (count == maxFreq && num < ans)) {
            maxFreq = count;
            ans = num;
        }
    }
    return ans;
}`,
        video_url: null, platform_url: null
      }
    ];

    for (let i = 0; i < problems.length; i++) {
      const p = problems[i];
      await client.query(
        `INSERT INTO problems
           (subtopic_id, title, slug, description, category, difficulty, examples, approach, solution_code, external_link, platform_url, display_order)
         VALUES ($1, $2, $3, $4, 'interview', 'easy', $5, $6, $7, $8, $9, $10)
         ON CONFLICT (subtopic_id, slug) DO NOTHING`,
        [subtopicId, p.title, p.slug, p.description, p.examples, p.approach, p.solution_code, p.video_url, p.platform_url, i + 1]
      );
    }

    console.log(`✅ Seeded ${problems.length} problems under "Learn Basic Hashing"`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
  }
}

seedBasicHashing();
