const { pool } = require('./db');

async function seedHardArrayProblems() {
  const client = await pool.connect();
  try {
    console.log('Seeding "Hard" array problems subtopic...');

    const topicRes = await client.query(`SELECT id FROM topics WHERE slug = 'solve-problems-on-arrays'`);
    if (topicRes.rows.length === 0) throw new Error('"Solve Problems on Arrays" topic not found — run seed:arrays first.');
    const topicId = topicRes.rows[0].id;

    const hardRes = await client.query(
      `INSERT INTO subtopics (topic_id, title, slug, description, display_order)
       VALUES ($1, 'Hard', 'hard-array-problems', 'The trickiest array problems — combining multiple techniques at once.', 2)
       ON CONFLICT (topic_id, slug) DO UPDATE SET title = EXCLUDED.title
       RETURNING id`,
      [topicId]
    );
    const hardId = hardRes.rows[0].id;

    const pascalVideo = 'https://www.youtube.com/watch?v=6FLvhQjZqvM';
    const majorityIIVideo = 'https://www.youtube.com/watch?v=yDbkQd9t2ig';
    const threeSumVideo = 'https://www.youtube.com/watch?v=DhFh8Kw7ymk';
    const fourSumVideo = 'https://www.youtube.com/watch?v=eD95WRfh81c';
    const mergeIntervalsVideo = 'https://www.youtube.com/watch?v=IexN60k62jo';
    const mergeSortedArraysVideo = 'https://m.youtube.com/live/n7uwj04E0I4';

    const problems = [
      { title: "Pascal's Triangle I", slug: 'pascals-triangle-1', difficulty: 'easy',
        description: "Generate the first N rows of Pascal's Triangle, where each number is the sum of the two numbers directly above it.",
        examples: 'Input: numRows = 5\nOutput:\n[1]\n[1,1]\n[1,2,1]\n[1,3,3,1]\n[1,4,6,4,1]',
        approach: 'Each row starts and ends with 1. Every other value equals the sum of the two values above it.',
        solution_code: `vector<vector<int>> generate(int numRows) {
    vector<vector<int>> triangle;
    for (int i = 0; i < numRows; i++) {
        vector<int> row(i + 1, 1);
        for (int j = 1; j < i; j++) {
            row[j] = triangle[i - 1][j - 1] + triangle[i - 1][j];
        }
        triangle.push_back(row);
    }
    return triangle;
}
// Time: O(numRows^2)  Space: O(numRows^2)`, video_url: pascalVideo, platform_url: 'https://leetcode.com/problems/pascals-triangle/' },
      { title: 'Majority Element-II', slug: 'majority-element-2', difficulty: 'hard',
        description: 'Given an array, find all elements that appear more than ⌊n / 3⌋ times. There can be at most 2 such elements.',
        examples: 'Input: [1, 2, 2, 3, 2, 1, 1]\nOutput: [1, 2]',
        approach: "Extended Boyer-Moore's Voting Algorithm with two candidates and two counts, then verify by counting actual occurrences.",
        solution_code: `vector<int> majorityElementII(vector<int>& nums) {
    int cnt1 = 0, cnt2 = 0;
    int el1 = INT_MIN, el2 = INT_MIN;

    for (int x : nums) {
        if (cnt1 == 0 && el2 != x) { cnt1 = 1; el1 = x; }
        else if (cnt2 == 0 && el1 != x) { cnt2 = 1; el2 = x; }
        else if (x == el1) cnt1++;
        else if (x == el2) cnt2++;
        else { cnt1--; cnt2--; }
    }

    cnt1 = 0; cnt2 = 0;
    for (int x : nums) {
        if (x == el1) cnt1++;
        else if (x == el2) cnt2++;
    }

    vector<int> result;
    int n = nums.size();
    if (cnt1 > n / 3) result.push_back(el1);
    if (cnt2 > n / 3) result.push_back(el2);
    return result;
}
// Time: O(n)  Space: O(1)`, video_url: majorityIIVideo, platform_url: 'https://leetcode.com/problems/majority-element-ii/' },
      { title: '3 Sum', slug: '3-sum', difficulty: 'medium',
        description: 'Find all unique triplets in an array that sum to zero.',
        examples: 'Input: [-1, 0, 1, 2, -1, -4]\nOutput: [[-1,-1,2], [-1,0,1]]',
        approach: 'Sort first. Fix one element, use two pointers for the rest. Skip duplicates.',
        solution_code: `vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> result;
    int n = nums.size();

    for (int i = 0; i < n - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int left = i + 1, right = n - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (sum < 0) left++;
            else if (sum > 0) right--;
            else {
                result.push_back({nums[i], nums[left], nums[right]});
                while (left < right && nums[left] == nums[left + 1]) left++;
                while (left < right && nums[right] == nums[right - 1]) right--;
                left++; right--;
            }
        }
    }
    return result;
}
// Time: O(n^2)  Space: O(1) excluding output`, video_url: threeSumVideo, platform_url: 'https://leetcode.com/problems/3sum/' },
      { title: '4 Sum', slug: '4-sum', difficulty: 'medium',
        description: 'Find all unique quadruplets in an array that sum to a given target value.',
        examples: 'Input: [1, 0, -1, 0, -2, 2], target = 0\nOutput: [[-2,-1,1,2], [-2,0,0,2], [-1,0,0,1]]',
        approach: 'Sort, fix first two elements with nested loops, two-pointer for the rest.',
        solution_code: `vector<vector<int>> fourSum(vector<int>& nums, int target) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> result;
    int n = nums.size();

    for (int i = 0; i < n - 3; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        for (int j = i + 1; j < n - 2; j++) {
            if (j > i + 1 && nums[j] == nums[j - 1]) continue;
            long long left = j + 1, right = n - 1;
            while (left < right) {
                long long sum = (long long)nums[i] + nums[j] + nums[left] + nums[right];
                if (sum < target) left++;
                else if (sum > target) right--;
                else {
                    result.push_back({nums[i], nums[j], (int)nums[left], (int)nums[right]});
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++; right--;
                }
            }
        }
    }
    return result;
}
// Time: O(n^3)  Space: O(1) excluding output`, video_url: fourSumVideo, platform_url: 'https://leetcode.com/problems/4sum/' },
      { title: 'Largest Subarray with Sum 0', slug: 'largest-subarray-sum-0', difficulty: 'medium',
        description: 'Find the length of the longest contiguous subarray whose elements sum to exactly 0.',
        examples: 'Input: [15, -2, 2, -8, 1, 7, 10, 23]\nOutput: 5 (subarray [-2, 2, -8, 1, 7])',
        approach: 'Prefix sum with a hash map of {prefix sum → earliest index}. Repeated sums mean a zero-sum subarray between them.',
        solution_code: `int maxLenZeroSum(vector<int>& arr) {
    unordered_map<int, int> firstIndex;
    int sum = 0, maxLen = 0;
    for (int i = 0; i < arr.size(); i++) {
        sum += arr[i];
        if (sum == 0) maxLen = i + 1;
        else if (firstIndex.count(sum)) maxLen = max(maxLen, i - firstIndex[sum]);
        else firstIndex[sum] = i;
    }
    return maxLen;
}
// Time: O(n)  Space: O(n)`, video_url: null, platform_url: null },
      { title: 'Count subarrays with given xor K', slug: 'count-subarrays-xor-k', difficulty: 'hard',
        description: 'Given an array and a value K, count how many contiguous subarrays have a bitwise XOR of exactly K.',
        examples: 'Input: [4, 2, 2, 6, 4], k = 6\nOutput: 4',
        approach: 'Running prefix XOR with a hash map counting occurrences. Check how many times (currentXor XOR k) appeared before.',
        solution_code: `int countSubarraysXorK(vector<int>& arr, int k) {
    unordered_map<int, int> xorCount;
    xorCount[0] = 1;
    int currentXor = 0, count = 0;
    for (int x : arr) {
        currentXor ^= x;
        int needed = currentXor ^ k;
        if (xorCount.count(needed)) count += xorCount[needed];
        xorCount[currentXor]++;
    }
    return count;
}
// Time: O(n)  Space: O(n)`, video_url: null, platform_url: null },
      { title: 'Merge Overlapping Subintervals', slug: 'merge-overlapping-subintervals', difficulty: 'medium',
        description: 'Given a list of intervals, merge all overlapping intervals into a minimal set of non-overlapping intervals.',
        examples: 'Input: [[1,3], [2,6], [8,10], [15,18]]\nOutput: [[1,6], [8,10], [15,18]]',
        approach: "Sort by start value. Walk through, extending a current interval or closing it and starting a new one.",
        solution_code: `vector<vector<int>> mergeIntervals(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> merged;
    for (auto& interval : intervals) {
        if (merged.empty() || merged.back()[1] < interval[0]) {
            merged.push_back(interval);
        } else {
            merged.back()[1] = max(merged.back()[1], interval[1]);
        }
    }
    return merged;
}
// Time: O(n log n)  Space: O(n)`, video_url: mergeIntervalsVideo, platform_url: 'https://leetcode.com/problems/merge-intervals/' },
      { title: 'Merge two sorted arrays without extra space', slug: 'merge-two-sorted-arrays-no-extra-space', difficulty: 'medium',
        description: 'Given two sorted arrays, merge them into sorted order in-place, without using any extra array for storage.',
        examples: 'Input: arr1 = [1, 4, 7, 8, 10], arr2 = [2, 3, 9]\nOutput: arr1 = [1, 2, 3, 4, 7], arr2 = [8, 9, 10]',
        approach: "Use the gap method (Shell sort style): compare elements a gap apart, shrinking the gap each pass.",
        solution_code: `void mergeNoExtraSpace(vector<int>& arr1, vector<int>& arr2) {
    int n = arr1.size(), m = arr2.size();
    int gap = ceil((n + m) / 2.0);

    while (gap > 0) {
        int left = 0, right = left + gap;
        while (right < n + m) {
            int leftVal = (left < n) ? arr1[left] : arr2[left - n];
            int rightVal = (right < n) ? arr1[right] : arr2[right - n];
            if (leftVal > rightVal) {
                if (left < n && right < n) swap(arr1[left], arr1[right]);
                else if (left < n && right >= n) swap(arr1[left], arr2[right - n]);
                else swap(arr2[left - n], arr2[right - n]);
            }
            left++; right++;
        }
        if (gap == 1) break;
        gap = ceil(gap / 2.0);
    }
}
// Time: O((n+m) log(n+m))  Space: O(1)`, video_url: mergeSortedArraysVideo, platform_url: 'https://leetcode.com/problems/merge-sorted-array/' },
      { title: 'Find the repeating and missing number', slug: 'find-repeating-missing-number', difficulty: 'hard',
        description: 'An array of size N contains numbers from 1 to N, but one number is missing and another appears twice. Find both numbers.',
        examples: 'Input: [3, 1, 2, 5, 3]\nOutput: repeating = 3, missing = 4',
        approach: "Use sum and sum-of-squares equations to solve for both values algebraically.",
        solution_code: `pair<int,int> findRepeatingMissing(vector<int>& arr) {
    long long n = arr.size();
    long long Sn = n * (n + 1) / 2;
    long long S2n = n * (n + 1) * (2 * n + 1) / 6;

    long long S = 0, S2 = 0;
    for (int x : arr) {
        S += x;
        S2 += (long long)x * x;
    }

    long long diff = S - Sn;
    long long sumMissingRepeating = (S2 - S2n) / diff;
    long long repeating = (sumMissingRepeating - diff) / 2;
    long long missing = repeating + diff;

    return {(int)repeating, (int)missing};
}
// Time: O(n)  Space: O(1)`, video_url: null, platform_url: null },
      { title: 'Count Inversions', slug: 'count-inversions', difficulty: 'hard',
        description: 'Count the number of pairs (i, j) in an array where i < j but arr[i] > arr[j].',
        examples: 'Input: [2, 4, 1, 3, 5]\nOutput: 3',
        approach: 'Modify merge sort: when merging, if a right-half element is placed before a left-half element, the remaining left elements all form inversions with it.',
        solution_code: `int mergeAndCount(vector<int>& arr, int low, int mid, int high) {
    vector<int> temp;
    int left = low, right = mid + 1, count = 0;
    while (left <= mid && right <= high) {
        if (arr[left] <= arr[right]) temp.push_back(arr[left++]);
        else {
            temp.push_back(arr[right++]);
            count += (mid - left + 1);
        }
    }
    while (left <= mid) temp.push_back(arr[left++]);
    while (right <= high) temp.push_back(arr[right++]);
    for (int i = low; i <= high; i++) arr[i] = temp[i - low];
    return count;
}

int countInversions(vector<int>& arr, int low, int high) {
    int count = 0;
    if (low < high) {
        int mid = (low + high) / 2;
        count += countInversions(arr, low, mid);
        count += countInversions(arr, mid + 1, high);
        count += mergeAndCount(arr, low, mid, high);
    }
    return count;
}
// Time: O(n log n)  Space: O(n)`, video_url: null, platform_url: null },
      { title: 'Reverse Pairs', slug: 'reverse-pairs', difficulty: 'hard',
        description: 'Count the number of pairs (i, j) where i < j and arr[i] > 2 * arr[j].',
        examples: 'Input: [1, 3, 2, 3, 1]\nOutput: 2',
        approach: 'Modify merge sort with a separate pointer sweep before merging to count valid pairs across sorted halves.',
        solution_code: `int countAndMerge(vector<int>& arr, int low, int mid, int high) {
    int count = 0, right = mid + 1;
    for (int i = low; i <= mid; i++) {
        while (right <= high && arr[i] > 2LL * arr[right]) right++;
        count += (right - (mid + 1));
    }

    vector<int> temp;
    int left = low; right = mid + 1;
    while (left <= mid && right <= high) {
        if (arr[left] <= arr[right]) temp.push_back(arr[left++]);
        else temp.push_back(arr[right++]);
    }
    while (left <= mid) temp.push_back(arr[left++]);
    while (right <= high) temp.push_back(arr[right++]);
    for (int i = low; i <= high; i++) arr[i] = temp[i - low];
    return count;
}

int reversePairs(vector<int>& arr, int low, int high) {
    if (low >= high) return 0;
    int mid = (low + high) / 2;
    int count = reversePairs(arr, low, mid) + reversePairs(arr, mid + 1, high);
    count += countAndMerge(arr, low, mid, high);
    return count;
}
// Time: O(n log n)  Space: O(n)`, video_url: null, platform_url: 'https://leetcode.com/problems/reverse-pairs/' },
      { title: 'Maximum Product Subarray in an Array', slug: 'maximum-product-subarray', difficulty: 'hard',
        description: 'Find the contiguous subarray with the largest product.',
        examples: 'Input: [2, 3, -2, 4]\nOutput: 6 (subarray [2, 3])',
        approach: "Track both max and min product ending at the current position, since multiplying by a negative can flip a very negative product into the new max.",
        solution_code: `int maxProduct(vector<int>& nums) {
    int result = nums[0], maxProd = nums[0], minProd = nums[0];
    for (int i = 1; i < nums.size(); i++) {
        int curr = nums[i];
        if (curr < 0) swap(maxProd, minProd);
        maxProd = max(curr, maxProd * curr);
        minProd = min(curr, minProd * curr);
        result = max(result, maxProd);
    }
    return result;
}
// Time: O(n)  Space: O(1)`, video_url: null, platform_url: 'https://leetcode.com/problems/maximum-product-subarray/' }
    ];

    for (let i = 0; i < problems.length; i++) {
      const p = problems[i];
      await client.query(
        `INSERT INTO problems
           (subtopic_id, title, slug, description, category, difficulty, examples, approach, solution_code, external_link, platform_url, display_order)
         VALUES ($1, $2, $3, $4, 'interview', $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (subtopic_id, slug) DO NOTHING`,
        [hardId, p.title, p.slug, p.description, p.difficulty, p.examples, p.approach, p.solution_code, p.video_url, p.platform_url, i + 1]
      );
    }

    console.log(`✅ Seeded ${problems.length} Hard array problems`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
  }
}

seedHardArrayProblems();
