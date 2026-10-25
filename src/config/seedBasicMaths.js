const { pool } = require('./db');

async function seedBasicMaths() {
  const client = await pool.connect();
  try {
    console.log('Seeding "Basic Maths" subtopic...');

    const topicRes = await client.query(`SELECT id FROM topics WHERE slug = 'learn-the-basics'`);
    if (topicRes.rows.length === 0) {
      throw new Error('"Learn the basics" topic not found — run seed:basics first.');
    }
    const topicId = topicRes.rows[0].id;

    const subtopicRes = await client.query(
      `INSERT INTO subtopics (topic_id, title, slug, description, display_order)
       VALUES ($1, 'Basic Maths', 'basic-maths',
         'Digit manipulation and number theory basics that show up constantly in DSA problems.', 1)
       ON CONFLICT (topic_id, slug) DO UPDATE SET title = EXCLUDED.title
       RETURNING id`,
      [topicId]
    );
    const subtopicId = subtopicRes.rows[0].id;

    const basicMathsVideo = 'https://www.youtube.com/watch?v=1xNbjMdbjug';
    const primeDivisorsVideo = 'https://www.youtube.com/watch?v=FcsUvBywY1U';

    const problems = [
      {
        title: 'Count all Digits of a Number', slug: 'count-digits',
        description: 'Given an integer, count how many digits it has.',
        examples: 'Input: n = 1234\nOutput: 4\n\nInput: n = 7\nOutput: 1',
        approach: 'Repeatedly divide the number by 10, counting each division, until it becomes 0. Each division removes one digit from the end.',
        solution_code: `int countDigits(int n) {
    if (n == 0) return 1;
    n = abs(n);
    int count = 0;
    while (n > 0) {
        n /= 10;
        count++;
    }
    return count;
}`,
        video_url: basicMathsVideo, platform_url: null
      },
      {
        title: 'Reverse a number', slug: 'reverse-a-number',
        description: 'Reverse the digits of a given integer.',
        examples: 'Input: n = 1234\nOutput: 4321\n\nInput: n = -120\nOutput: -21',
        approach: 'Extract the last digit using n % 10, build up the reversed number by multiplying the running result by 10 and adding that digit, then remove the last digit with n / 10. Repeat until n becomes 0. Handle negative numbers by working with the absolute value and re-applying the sign at the end.',
        solution_code: `long reverseNumber(int n) {
    long reversed = 0;
    bool neg = n < 0;
    n = abs(n);
    while (n > 0) {
        reversed = reversed * 10 + n % 10;
        n /= 10;
    }
    return neg ? -reversed : reversed;
}`,
        video_url: basicMathsVideo, platform_url: 'https://leetcode.com/problems/reverse-integer/'
      },
      {
        title: 'Palindrome Number', slug: 'palindrome-number',
        description: 'Check whether a given integer reads the same forwards and backwards.',
        examples: 'Input: n = 121\nOutput: true\n\nInput: n = 123\nOutput: false\n\nInput: n = -121\nOutput: false (negative numbers are never palindromes)',
        approach: 'Reverse the number using the same digit-extraction technique as "Reverse a number," then compare the reversed value to the original. Negative numbers are automatically not palindromes because of the minus sign.',
        solution_code: `bool isPalindrome(int n) {
    if (n < 0) return false;
    int original = n, reversed = 0, temp = n;
    while (temp > 0) {
        reversed = reversed * 10 + temp % 10;
        temp /= 10;
    }
    return original == reversed;
}`,
        video_url: basicMathsVideo, platform_url: 'https://leetcode.com/problems/palindrome-number/'
      },
      {
        title: 'GCD of Two Numbers', slug: 'gcd-of-two-numbers',
        description: 'Find the Greatest Common Divisor (GCD) of two integers — the largest number that divides both of them exactly.',
        examples: 'Input: a = 20, b = 28\nOutput: 4\n\nInput: a = 17, b = 5\nOutput: 1',
        approach: "Use Euclid's algorithm: repeatedly replace the pair (a, b) with (b, a % b) until b becomes 0 — at that point, a holds the GCD.",
        solution_code: `int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}`,
        video_url: basicMathsVideo, platform_url: null
      },
      {
        title: 'Check if the Number is Armstrong', slug: 'armstrong-number',
        description: 'An Armstrong number equals the sum of its own digits, each raised to the power of the total number of digits. For example, 153 = 1³ + 5³ + 3³.',
        examples: 'Input: n = 153\nOutput: true (1^3 + 5^3 + 3^3 = 153)\n\nInput: n = 154\nOutput: false',
        approach: 'First count how many digits the number has. Then extract each digit, raise it to that power, and sum the results. If the sum equals the original number, it is an Armstrong number.',
        solution_code: `bool isArmstrong(int n) {
    int original = n, digits = 0, temp = n;
    while (temp > 0) { digits++; temp /= 10; }

    int sum = 0;
    temp = n;
    while (temp > 0) {
        int d = temp % 10;
        sum += pow(d, digits);
        temp /= 10;
    }
    return sum == original;
}`,
        video_url: basicMathsVideo, platform_url: 'https://www.geeksforgeeks.org/problems/armstrong-numbers2727/1'
      },
      {
        title: 'Print all Divisors', slug: 'print-all-divisors',
        description: 'Find every number that divides a given integer exactly, with no remainder.',
        examples: 'Input: n = 36\nOutput: 1, 2, 3, 4, 6, 9, 12, 18, 36',
        approach: 'Instead of checking every number from 1 to n (O(n)), only check up to √n. If i divides n, then both i and n / i are divisors — this finds every divisor pair in O(√n) time.',
        solution_code: `vector<int> getDivisors(int n) {
    vector<int> divisors;
    for (int i = 1; i * i <= n; i++) {
        if (n % i == 0) {
            divisors.push_back(i);
            if (i != n / i) divisors.push_back(n / i);
        }
    }
    return divisors;
}`,
        video_url: primeDivisorsVideo, platform_url: null
      },
      {
        title: 'Check for Prime Number', slug: 'check-prime-number',
        description: 'A prime number is a number greater than 1 that has no positive divisors other than 1 and itself.',
        examples: 'Input: n = 7\nOutput: true\n\nInput: n = 15\nOutput: false (divisible by 3 and 5)',
        approach: 'Just like with divisors, you only need to check for factors up to √n. If nothing in that range divides n evenly, it is prime.',
        solution_code: `bool isPrime(int n) {
    if (n <= 1) return false;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}`,
        video_url: primeDivisorsVideo, platform_url: null
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

    console.log(`✅ Seeded ${problems.length} problems under "Basic Maths"`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
  }
}

seedBasicMaths();
