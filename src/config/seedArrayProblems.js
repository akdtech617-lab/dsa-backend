const { pool } = require('./db');

async function seedArrayProblems() {
  const client = await pool.connect();
  try {
    console.log('Seeding "Solve Problems on Arrays" topic...');

    const courseRes = await client.query(`SELECT id FROM courses WHERE slug = 'dsa'`);
    if (courseRes.rows.length === 0) throw new Error('DSA course not found — run the main seed first.');
    const dsaCourseId = courseRes.rows[0].id;

    const topicRes = await client.query(
      `INSERT INTO topics (course_id, title, slug, description, display_order)
       VALUES ($1, 'Solve Problems on Arrays [Easy -> Medium -> Hard]', 'solve-problems-on-arrays',
         'Apply everything from the basics section to real array problems, ordered by difficulty.', 2)
       ON CONFLICT (course_id, slug) DO UPDATE SET title = EXCLUDED.title
       RETURNING id`,
      [dsaCourseId]
    );
    const topicId = topicRes.rows[0].id;

    const arraysIntroVideo = 'https://www.youtube.com/watch?v=37E9ckMDdTk';
    const arraysPart2Video = 'https://www.youtube.com/watch?v=wvcQg43_V8U';

    const easyRes = await client.query(
      `INSERT INTO subtopics (topic_id, title, slug, description, display_order)
       VALUES ($1, 'Easy', 'easy-array-problems', 'Foundational array problems to build pattern recognition.', 0)
       ON CONFLICT (topic_id, slug) DO UPDATE SET title = EXCLUDED.title
       RETURNING id`,
      [topicId]
    );
    const easyId = easyRes.rows[0].id;

    const easyProblems = [
      { title: 'Largest Element', slug: 'largest-element',
        description: 'Find the largest element in an array.',
        examples: 'Input: [2, 5, 1, 8, 3]\nOutput: 8',
        approach: 'Keep a running "max" variable. Scan through the array once, updating max whenever a bigger value is found.',
        solution_code: `int largestElement(vector<int>& arr) {
    int maxVal = arr[0];
    for (int x : arr) maxVal = max(maxVal, x);
    return maxVal;
}
// Time: O(n)  Space: O(1)`, video_url: arraysIntroVideo, platform_url: null },
      { title: 'Second Largest Element', slug: 'second-largest-element',
        description: "Find the second-largest distinct element in an array, without sorting it.",
        examples: 'Input: [2, 5, 1, 8, 3]\nOutput: 5',
        approach: 'Track "largest" and "secondLargest". If current beats largest, shift old largest into secondLargest first. Otherwise if it beats secondLargest, update it.',
        solution_code: `int secondLargest(vector<int>& arr) {
    int largest = INT_MIN, secondLargest = INT_MIN;
    for (int x : arr) {
        if (x > largest) {
            secondLargest = largest;
            largest = x;
        } else if (x > secondLargest && x != largest) {
            secondLargest = x;
        }
    }
    return secondLargest;
}
// Time: O(n)  Space: O(1)`, video_url: arraysIntroVideo, platform_url: null },
      { title: 'Check if the Array is Sorted II', slug: 'check-array-sorted-ii',
        description: 'Check whether an array is sorted in non-decreasing order, or sorted and then rotated some number of positions.',
        examples: 'Input: [3, 4, 5, 1, 2]\nOutput: true\n\nInput: [2, 1, 3, 4]\nOutput: false',
        approach: 'Count how many times an element is smaller than the one before it, wrapping around from last to first. At most one such drop means sorted-and-rotated.',
        solution_code: `bool checkSortedRotated(vector<int>& nums) {
    int n = nums.size(), drops = 0;
    for (int i = 1; i < n; i++) {
        if (nums[i - 1] > nums[i]) drops++;
    }
    if (nums[n - 1] > nums[0]) drops++;
    return drops <= 1;
}
// Time: O(n)  Space: O(1)`, video_url: null, platform_url: 'https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/' },
      { title: 'Remove duplicates from Sorted array', slug: 'remove-duplicates-sorted-array',
        description: 'Given a sorted array, remove duplicates in-place so each unique element appears only once, and return the count of unique elements.',
        examples: 'Input: [1, 1, 2, 2, 3]\nOutput: 3, array becomes [1, 2, 3, ...]',
        approach: 'Two pointers: i tracks last confirmed-unique position, j scans forward. Whenever arr[j] differs from arr[i], increment i and copy.',
        solution_code: `int removeDuplicates(vector<int>& arr) {
    int i = 0;
    for (int j = 1; j < arr.size(); j++) {
        if (arr[j] != arr[i]) {
            i++;
            arr[i] = arr[j];
        }
    }
    return i + 1;
}
// Time: O(n)  Space: O(1)`, video_url: arraysIntroVideo, platform_url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/' },
      { title: 'Left Rotate Array by One', slug: 'left-rotate-array-by-one',
        description: 'Shift every element of an array one position to the left, moving the first element to the end.',
        examples: 'Input: [1, 2, 3, 4, 5]\nOutput: [2, 3, 4, 5, 1]',
        approach: 'Save the first element, shift every other element one position left, then place the saved value at the very end.',
        solution_code: `void leftRotateByOne(vector<int>& arr) {
    int n = arr.size();
    int first = arr[0];
    for (int i = 0; i < n - 1; i++) arr[i] = arr[i + 1];
    arr[n - 1] = first;
}
// Time: O(n)  Space: O(1)`, video_url: arraysPart2Video, platform_url: 'https://leetcode.com/problems/rotate-array/' },
      { title: 'Left Rotate Array by K Places', slug: 'left-rotate-array-by-k',
        description: 'Shift every element of an array K positions to the left, wrapping the first K elements around to the end.',
        examples: 'Input: [1, 2, 3, 4, 5], k = 2\nOutput: [3, 4, 5, 1, 2]',
        approach: "Reduce k to k % n. Reverse the first k elements, reverse the remaining n-k, then reverse the whole array.",
        solution_code: `void leftRotateByK(vector<int>& arr, int k) {
    int n = arr.size();
    k = k % n;
    reverse(arr.begin(), arr.begin() + k);
    reverse(arr.begin() + k, arr.end());
    reverse(arr.begin(), arr.end());
}
// Time: O(n)  Space: O(1)`, video_url: arraysPart2Video, platform_url: 'https://leetcode.com/problems/rotate-array/' },
      { title: 'Move Zeros to End', slug: 'move-zeros-to-end',
        description: 'Move all zeros in an array to the end, while keeping the relative order of the non-zero elements the same.',
        examples: 'Input: [0, 1, 0, 3, 12]\nOutput: [1, 3, 12, 0, 0]',
        approach: 'Two pointers: j finds the next non-zero element, i marks where it should go. Swap and advance i.',
        solution_code: `void moveZerosToEnd(vector<int>& arr) {
    int i = 0;
    for (int j = 0; j < arr.size(); j++) {
        if (arr[j] != 0) {
            swap(arr[i], arr[j]);
            i++;
        }
    }
}
// Time: O(n)  Space: O(1)`, video_url: arraysPart2Video, platform_url: 'https://leetcode.com/problems/move-zeroes/' },
      { title: 'Linear Search', slug: 'linear-search',
        description: 'Search for a target value in an array by checking each element one at a time, from start to end.',
        examples: 'Input: [5, 3, 8, 1], target = 8\nOutput: index 2',
        approach: 'Loop through the array, comparing each element to the target. Return the index on a match; return -1 if not found.',
        solution_code: `int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}
// Time: O(n)  Space: O(1)`, video_url: arraysPart2Video, platform_url: null },
      { title: 'Union of two sorted arrays', slug: 'union-two-sorted-arrays',
        description: 'Given two sorted arrays, find their union — every distinct value present in either array, in sorted order.',
        examples: 'Input: [1, 2, 3], [2, 3, 4, 5]\nOutput: [1, 2, 3, 4, 5]',
        approach: 'Two pointers, one per array. Advance whichever has the smaller value, adding it if not a duplicate of the last added value.',
        solution_code: `vector<int> findUnion(vector<int>& a, vector<int>& b) {
    int i = 0, j = 0;
    vector<int> result;
    while (i < a.size() && j < b.size()) {
        if (a[i] <= b[j]) {
            if (result.empty() || result.back() != a[i]) result.push_back(a[i]);
            i++;
        } else {
            if (result.empty() || result.back() != b[j]) result.push_back(b[j]);
            j++;
        }
    }
    while (i < a.size()) { if (result.back() != a[i]) result.push_back(a[i]); i++; }
    while (j < b.size()) { if (result.back() != b[j]) result.push_back(b[j]); j++; }
    return result;
}
// Time: O(n + m)  Space: O(n + m)`, video_url: arraysPart2Video, platform_url: null },
      { title: 'Find missing number', slug: 'find-missing-number',
        description: 'Given an array containing N-1 distinct numbers from the range [0, N], find the one missing number.',
        examples: 'Input: [3, 0, 1], N = 3\nOutput: 2',
        approach: 'The sum of all numbers from 0 to N is N*(N+1)/2. Subtract the actual sum of the array from that expected total.',
        solution_code: `int findMissingNumber(vector<int>& arr, int n) {
    int expectedSum = n * (n + 1) / 2;
    int actualSum = 0;
    for (int x : arr) actualSum += x;
    return expectedSum - actualSum;
}
// Time: O(n)  Space: O(1)`, video_url: null, platform_url: null },
      { title: 'Maximum Consecutive Ones', slug: 'maximum-consecutive-ones',
        description: 'Given a binary array (containing only 0s and 1s), find the maximum number of consecutive 1s.',
        examples: 'Input: [1, 1, 0, 1, 1, 1]\nOutput: 3',
        approach: 'Running counter of the current streak of 1s, reset to 0 on a 0, track the max seen.',
        solution_code: `int maxConsecutiveOnes(vector<int>& arr) {
    int count = 0, maxCount = 0;
    for (int x : arr) {
        count = (x == 1) ? count + 1 : 0;
        maxCount = max(maxCount, count);
    }
    return maxCount;
}
// Time: O(n)  Space: O(1)`, video_url: null, platform_url: 'https://leetcode.com/problems/max-consecutive-ones/' }
    ];

    for (let i = 0; i < easyProblems.length; i++) {
      const p = easyProblems[i];
      await client.query(
        `INSERT INTO problems
           (subtopic_id, title, slug, description, category, difficulty, examples, approach, solution_code, external_link, platform_url, display_order)
         VALUES ($1, $2, $3, $4, 'interview', 'easy', $5, $6, $7, $8, $9, $10)
         ON CONFLICT (subtopic_id, slug) DO NOTHING`,
        [easyId, p.title, p.slug, p.description, p.examples, p.approach, p.solution_code, p.video_url, p.platform_url, i + 1]
      );
    }

    const mediumRes = await client.query(
      `INSERT INTO subtopics (topic_id, title, slug, description, display_order)
       VALUES ($1, 'Medium', 'medium-array-problems', 'Array problems that build on hashing and prefix-sum ideas.', 1)
       ON CONFLICT (topic_id, slug) DO UPDATE SET title = EXCLUDED.title
       RETURNING id`,
      [topicId]
    );
    const mediumId = mediumRes.rows[0].id;

    const mediumProblems = [
      { title: 'Find the number that appears once, and other numbers twice.', slug: 'find-number-appears-once',
        description: 'Given an array where every number appears exactly twice except for one number that appears only once, find that number.',
        examples: 'Input: [4, 1, 2, 1, 2]\nOutput: 4',
        approach: 'XOR every element together — pairs cancel out, leaving only the single number.',
        solution_code: `int singleNumber(vector<int>& arr) {
    int result = 0;
    for (int x : arr) result ^= x;
    return result;
}
// Time: O(n)  Space: O(1)`, video_url: null, platform_url: 'https://leetcode.com/problems/single-number/' },
      { title: 'Longest subarray with given sum K(positives)', slug: 'longest-subarray-sum-k-positives',
        description: 'Given an array of positive integers, find the length of the longest contiguous subarray whose elements sum to exactly K.',
        examples: 'Input: [1, 2, 3, 1, 1, 1, 1], k = 3\nOutput: 3 (subarray [1,1,1] or [3])',
        approach: "Sliding window: expand right, shrink from left when sum exceeds K, update best length when sum equals K.",
        solution_code: `int longestSubarraySumK(vector<int>& arr, int k) {
    int left = 0, sum = 0, maxLen = 0;
    for (int right = 0; right < arr.size(); right++) {
        sum += arr[right];
        while (sum > k) {
            sum -= arr[left];
            left++;
        }
        if (sum == k) maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}
// Time: O(n)  Space: O(1)`, video_url: null, platform_url: 'https://practice.geeksforgeeks.org/problems/longest-sub-array-with-sum-k0809/1' },
      { title: 'Longest subarray with sum K', slug: 'longest-subarray-sum-k',
        description: 'The same problem, but the array can contain negative numbers too — find the length of the longest contiguous subarray summing to exactly K.',
        examples: 'Input: [10, 5, 2, 7, 1, 9], k = 15\nOutput: 4 (subarray [5,2,7,1])',
        approach: 'Use prefix sums with a hash map of {prefix sum → earliest index}. Check if (currentSum - k) has been seen before.',
        solution_code: `int longestSubarraySumKGeneral(vector<int>& arr, int k) {
    unordered_map<int, int> firstIndex;
    int sum = 0, maxLen = 0;
    for (int i = 0; i < arr.size(); i++) {
        sum += arr[i];
        if (sum == k) maxLen = max(maxLen, i + 1);
        if (firstIndex.find(sum - k) != firstIndex.end()) {
            maxLen = max(maxLen, i - firstIndex[sum - k]);
        }
        if (firstIndex.find(sum) == firstIndex.end()) firstIndex[sum] = i;
    }
    return maxLen;
}
// Time: O(n)  Space: O(n)`, video_url: null, platform_url: 'https://practice.geeksforgeeks.org/problems/longest-sub-array-with-sum-k0809/1' }
    ];

    for (let i = 0; i < mediumProblems.length; i++) {
      const p = mediumProblems[i];
      await client.query(
        `INSERT INTO problems
           (subtopic_id, title, slug, description, category, difficulty, examples, approach, solution_code, external_link, platform_url, display_order)
         VALUES ($1, $2, $3, $4, 'interview', 'medium', $5, $6, $7, $8, $9, $10)
         ON CONFLICT (subtopic_id, slug) DO NOTHING`,
        [mediumId, p.title, p.slug, p.description, p.examples, p.approach, p.solution_code, p.video_url, p.platform_url, i + 1]
      );
    }

    console.log(`✅ Seeded Easy (${easyProblems.length}) and Medium (${mediumProblems.length}) array problems`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
  }
}

seedArrayProblems();
