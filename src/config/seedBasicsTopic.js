const { pool } = require('./db');

async function seedBasicsTopic() {
  const client = await pool.connect();
  try {
    console.log('Seeding "Learn the basics" topic...');

    const courseRes = await client.query(`SELECT id FROM courses WHERE slug = 'dsa'`);
    if (courseRes.rows.length === 0) {
      throw new Error('DSA course not found — run the main seed first.');
    }
    const dsaCourseId = courseRes.rows[0].id;

    const topicRes = await client.query(
      `INSERT INTO topics (course_id, title, slug, description, display_order)
       VALUES ($1, 'Learn the basics', 'learn-the-basics', 'The absolute fundamentals before diving into DSA.', 0)
       ON CONFLICT (course_id, slug) DO UPDATE SET title = EXCLUDED.title
       RETURNING id`,
      [dsaCourseId]
    );
    const topicId = topicRes.rows[0].id;

    const subtopicRes = await client.query(
      `INSERT INTO subtopics (topic_id, title, slug, description, display_order)
       VALUES ($1, 'Things to Know in C++/Java/Python or any language', 'things-to-know',
         'Core language fundamentals every beginner needs before learning DSA.', 0)
       ON CONFLICT (topic_id, slug) DO UPDATE SET title = EXCLUDED.title
       RETURNING id`,
      [topicId]
    );
    const subtopicId = subtopicRes.rows[0].id;

    const problems = [
      { title: 'Input Output', slug: 'input-output', description: 'Learn how a program reads input from the user and prints output back to the screen — the very first thing every program needs to do. In C++ this is done with cin (input) and cout (output); in Java with Scanner and System.out.println; in Python with input() and print().', video_url: 'https://www.youtube.com/watch?v=OmyS0wQpCAc' },
      { title: 'Cpp Basics', slug: 'cpp-basics', description: 'An overview of C++ program structure: the #include directives, the main() function every program starts from, semicolons, curly braces, and how the compiler turns your code into a running program.', video_url: 'https://www.youtube.com/watch?v=-TkoO8Z07hI' },
      { title: 'If ElseIf', slug: 'if-elseif', description: 'Conditional logic lets a program make decisions. An if statement runs code only when a condition is true; else if checks another condition when the first is false; else catches everything else. This is the foundation of all decision-making in code.', video_url: 'https://www.youtube.com/live/ljEZlKU5XT4' },
      { title: 'Switch Case', slug: 'switch-case', description: 'A switch statement is a cleaner alternative to a long chain of if/else if checks when you are comparing one variable against several fixed values. Each case handles one possible value, and break stops it from falling through to the next case.', video_url: 'https://www.youtube.com/watch?v=VKlSWvSS7JI' },
      { title: 'What are arrays, strings?', slug: 'arrays-strings-intro', description: 'An array is a collection of values of the same type stored under a single name, accessed by index (starting at 0). A string is essentially an array of characters, with extra built-in operations for working with text. Both are the building blocks for almost every DSA topic that follows.', video_url: 'https://www.youtube.com/watch?v=-TkoO8Z07hI' },
      { title: 'For loops', slug: 'for-loops', description: 'A for loop repeats a block of code a specific number of times, using three parts: where to start, the condition to keep going, and how to move forward each time. It is the go-to loop whenever you already know roughly how many times you need to repeat something.', video_url: 'https://www.youtube.com/watch?v=TK7fjq28ma8' },
      { title: 'While loops', slug: 'while-loops', description: 'A while loop repeats a block of code for as long as a condition stays true, without needing to know in advance how many times it will run. This makes it ideal for situations like "keep asking until valid input is given."', video_url: 'https://www.youtube.com/watch?v=qx8Hl_YpcLo' },
      { title: 'Functions (Pass by Reference and Value)', slug: 'functions-pass-by-reference-value', description: 'A function is a reusable block of code. When you pass a variable "by value," the function gets a copy — changes inside it do not affect the original. When you pass it "by reference," the function works directly on the original variable, so changes do persist after the function ends.', video_url: 'https://www.youtube.com/watch?v=-TkoO8Z07hI' },
      { title: 'Theory with examples', slug: 'theory-with-examples', description: 'A wrap-up of everything covered in this subtopic — input/output, conditionals, loops, and functions — reinforced with small worked examples that combine multiple concepts together.', video_url: null }
    ];

    for (let i = 0; i < problems.length; i++) {
      const p = problems[i];
      await client.query(
        `INSERT INTO problems (subtopic_id, title, slug, description, category, difficulty, external_link, display_order)
         VALUES ($1, $2, $3, $4, 'interview', 'easy', $5, $6)
         ON CONFLICT (subtopic_id, slug) DO NOTHING`,
        [subtopicId, p.title, p.slug, p.description, p.video_url, i + 1]
      );
    }

    console.log(`✅ Seeded ${problems.length} problems under "Things to Know..."`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
  }
}

seedBasicsTopic();
