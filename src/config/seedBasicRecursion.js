const { pool } = require('./db');

async function seedBasicRecursion() {
  const client = await pool.connect();
  try {
    console.log('Seeding "Learn Basic Recursion" subtopic...');

    const topicRes = await client.query(`SELECT id FROM topics WHERE slug = 'learn-the-basics'`);
    if (topicRes.rows.length === 0) {
      throw new Error('"Learn the basics" topic not found — run seed:basics first.');
    }
    const topicId = topicRes.rows[0].id;

    const subtopicRes = await client.query(
      `INSERT INTO subtopics (topic_id, title, slug, description, display_order)
       VALUES ($1, 'Learn Basic Recursion', 'learn-basic-recursion',
         'Understand how a function calling itself can solve problems — the foundation for many advanced DSA topics.', 2)
       ON CONFLICT (topic_id, slug) DO UPDATE SET title = EXCLUDED.title
       RETURNING id`,
      [topicId]
    );
    const subtopicId = subtopicRes.rows[0].id;

    const introVideo = 'https://www.youtube.com/watch?v=yVdKa8dnKiE';
    const problemsVideo = 'https://www.youtube.com/watch?v=un6PLygfXrA';
    const functionalVideo = 'https://www.youtube.com/watch?v=twuC1F6gLI8';
    const multipleCallsVideo = 'https://www.youtube.com/watch?v=kvRjNm4rVBE';

    const problems = [
      { title: 'Understand recursion by print something N times', slug: 'understand-recursion-print-n-times',
        description: 'Learn what recursion actually is: a function that calls itself to solve a smaller version of the same problem, stopping once it reaches a case simple enough to answer directly (the base case).',
        examples: 'printNTimes(5) →\nHello\nHello\nHello\nHello\nHello',
        approach: 'Give the function a counter. If the counter has already reached N, stop — this is the base case. Otherwise, do the action once, then call the function again with the counter increased by 1.',
        solution_code: `void printNTimes(int i, int n) {
    if (i > n) return;
    cout << "Hello" << endl;
    printNTimes(i + 1, n);
}`, video_url: introVideo, platform_url: null },
      { title: 'Print name N times using recursion', slug: 'print-name-n-times',
        description: 'Print your own name N times using recursion instead of a loop, reinforcing the base case + recursive call pattern from the previous problem.',
        examples: 'printName(3, "Amit") →\nAmit\nAmit\nAmit',
        approach: 'Identical structure to the previous problem — stop once the counter exceeds N, otherwise print the name and recurse with the counter incremented.',
        solution_code: `void printName(int i, int n, string name) {
    if (i > n) return;
    cout << name << endl;
    printName(i + 1, n, name);
}`, video_url: problemsVideo, platform_url: null },
      { title: 'Print 1 to N using Recursion', slug: 'print-1-to-n',
        description: 'Print the numbers from 1 up to N, in increasing order, using recursion.',
        examples: 'Input: n = 5\nOutput: 1 2 3 4 5',
        approach: 'Print the current number first, then make the recursive call with the number increased by 1.',
        solution_code: `void printOneToN(int i, int n) {
    if (i > n) return;
    cout << i << " ";
    printOneToN(i + 1, n);
}`, video_url: problemsVideo, platform_url: null },
      { title: 'Print N to 1 using Recursion', slug: 'print-n-to-1',
        description: 'Print the numbers from N down to 1, in decreasing order, using recursion.',
        examples: 'Input: n = 5\nOutput: 5 4 3 2 1',
        approach: 'Start the counter at N and decrease it by 1 each call, printing the current value before recursing.',
        solution_code: `void printNToOne(int i) {
    if (i < 1) return;
    cout << i << " ";
    printNToOne(i - 1);
}`, video_url: problemsVideo, platform_url: null },
      { title: 'Sum of First N Numbers', slug: 'sum-of-first-n-numbers',
        description: 'Calculate 1 + 2 + 3 + ... + N using recursion, instead of a loop or the closed-form formula.',
        examples: 'Input: n = 5\nOutput: 15 (1+2+3+4+5)',
        approach: 'The sum up to n equals n plus the sum up to n-1. The base case is sum(0) = 0.',
        solution_code: `int sumOfN(int n) {
    if (n == 0) return 0;
    return n + sumOfN(n - 1);
}`, video_url: problemsVideo, platform_url: null },
      { title: 'Factorial of a given number', slug: 'factorial-of-a-number',
        description: 'Calculate N! = N × (N-1) × (N-2) × ... × 1 using recursion.',
        examples: 'Input: n = 5\nOutput: 120 (5×4×3×2×1)',
        approach: 'factorial(n) equals n multiplied by factorial(n-1). The base case is factorial(0) = factorial(1) = 1.',
        solution_code: `long long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`, video_url: problemsVideo, platform_url: null },
      { title: 'Reverse an array', slug: 'reverse-an-array-recursion',
        description: 'Reverse the elements of an array in place, using recursion instead of a loop.',
        examples: 'Input: [1, 2, 3, 4, 5]\nOutput: [5, 4, 3, 2, 1]',
        approach: 'Swap the elements at the two ends of the array, then recursively reverse the inner portion by moving the left pointer forward and the right pointer backward.',
        solution_code: `void reverseArray(vector<int>& arr, int left, int right) {
    if (left >= right) return;
    swap(arr[left], arr[right]);
    reverseArray(arr, left + 1, right - 1);
}`, video_url: functionalVideo, platform_url: null },
      { title: 'Check if String is Palindrome or Not', slug: 'check-string-palindrome-recursion',
        description: 'Check whether a string reads the same forwards and backwards, using recursion.',
        examples: 'Input: "madam"\nOutput: true\n\nInput: "hello"\nOutput: false',
        approach: 'Compare the first and last characters. If they differ, it is not a palindrome. If they match, recursively check the inner substring by moving both ends inward.',
        solution_code: `bool isPalindrome(string &s, int left, int right) {
    if (left >= right) return true;
    if (s[left] != s[right]) return false;
    return isPalindrome(s, left + 1, right - 1);
}`, video_url: functionalVideo, platform_url: 'https://leetcode.com/problems/valid-palindrome/' },
      { title: 'Fibonacci Number', slug: 'fibonacci-number',
        description: 'The Fibonacci sequence starts 0, 1, 1, 2, 3, 5, 8, ... where each number is the sum of the two numbers before it. Find the Nth number in this sequence using recursion.',
        examples: 'Input: n = 5\nOutput: 5 (sequence: 0, 1, 1, 2, 3, 5)',
        approach: 'fib(n) equals fib(n-1) + fib(n-2) — this is called "multiple recursion". The base cases are fib(0) = 0 and fib(1) = 1.',
        solution_code: `int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`, video_url: multipleCallsVideo, platform_url: 'https://leetcode.com/problems/fibonacci-number/' }
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

    console.log(`✅ Seeded ${problems.length} problems under "Learn Basic Recursion"`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
  }
}

seedBasicRecursion();
