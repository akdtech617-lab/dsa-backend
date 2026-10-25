const { pool } = require('./db');

async function seedMediumArrayProblems() {
  const client = await pool.connect();
  try {
    console.log('Fixing subtopic placement and seeding real "Medium" content...');

    const topicRes = await client.query(`SELECT id FROM topics WHERE slug = 'solve-problems-on-arrays'`);
    if (topicRes.rows.length === 0) throw new Error('"Solve Problems on Arrays" topic not found — run seed:arrays first.');
    const topicId = topicRes.rows[0].id;

    const easyRes = await client.query(`SELECT id FROM subtopics WHERE topic_id = $1 AND slug = 'easy-array-problems'`, [topicId]);
    const mediumRes = await client.query(`SELECT id FROM subtopics WHERE topic_id = $1 AND slug = 'medium-array-problems'`, [topicId]);
    if (easyRes.rows.length === 0 || mediumRes.rows.length === 0) throw new Error('Easy/Medium subtopics not found — run seed:arrays first.');
    const easyId = easyRes.rows[0].id;
    const mediumId = mediumRes.rows[0].id;

    const misplacedSlugs = ['find-number-appears-once', 'longest-subarray-sum-k-positives', 'longest-subarray-sum-k'];
    for (const slug of misplacedSlugs) {
      await client.query(`UPDATE problems SET subtopic_id = $1 WHERE subtopic_id = $2 AND slug = $3`, [easyId, mediumId, slug]);
    }
    console.log('Relocated 3 problems from Medium back to Easy.');

    const majorityElementVideo = 'https://www.youtube.com/watch?v=nP_ns3uSh80';

    const mediumProblems = [
      { title: 'Two Sum', slug: 'two-sum-arrays', difficulty: 'easy',
        description: 'Given an array of integers and a target value, return the indices of the two numbers that add up to the target.',
        examples: 'Input: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1] (2 + 7 = 9)',
        approach: 'Use a hash map to store each number and its index as you go. For each element, check if (target - currentNumber) already exists in the map.',
        solution_code: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement)) return {seen[complement], i};
        seen[nums[i]] = i;
    }
    return {};
}
// Time: O(n)  Space: O(n)`, video_url: null, platform_url: 'https://leetcode.com/problems/two-sum/' },
      { title: "Sort an array of 0's 1's and 2's", slug: 'sort-array-0s-1s-2s', difficulty: 'medium',
        description: 'Given an array containing only 0s, 1s, and 2s, sort it in-place in a single pass, without using a sorting algorithm.',
        examples: 'Input: [2, 0, 1, 2, 1, 0]\nOutput: [0, 0, 1, 1, 2, 2]',
        approach: "Dutch National Flag algorithm with three pointers: low, mid, and high.",
        solution_code: `void sortColors(vector<int>& arr) {
    int low = 0, mid = 0, high = arr.size() - 1;
    while (mid <= high) {
        if (arr[mid] == 0) {
            swap(arr[low], arr[mid]);
            low++; mid++;
        } else if (arr[mid] == 1) {
            mid++;
        } else {
            swap(arr[mid], arr[high]);
            high--;
        }
    }
}
// Time: O(n)  Space: O(1)`, video_url: null, platform_url: 'https://leetcode.com/problems/sort-colors/' },
      { title: 'Majority Element-I', slug: 'majority-element-1', difficulty: 'easy',
        description: 'Given an array, find the element that appears more than ⌊n / 2⌋ times (the majority element). You may assume it always exists.',
        examples: 'Input: [2, 2, 1, 1, 1, 2, 2]\nOutput: 2',
        approach: "Boyer-Moore's Voting Algorithm: keep a candidate and a count.",
        solution_code: `int majorityElement(vector<int>& nums) {
    int count = 0, candidate = 0;
    for (int x : nums) {
        if (count == 0) candidate = x;
        count += (x == candidate) ? 1 : -1;
    }
    return candidate;
}
// Time: O(n)  Space: O(1)`, video_url: majorityElementVideo, platform_url: 'https://leetcode.com/problems/majority-element/' },
      { title: "Kadane's Algorithm", slug: 'kadanes-algorithm', difficulty: 'medium',
        description: 'Find the contiguous subarray (containing at least one number) with the largest sum, and return that sum.',
        examples: 'Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]\nOutput: 6 (subarray [4, -1, 2, 1])',
        approach: "Keep a running sum. If it drops below 0, reset to 0. Track the maximum running sum seen.",
        solution_code: `int maxSubArray(vector<int>& nums) {
    int maxSum = INT_MIN, sum = 0;
    for (int x : nums) {
        sum += x;
        maxSum = max(maxSum, sum);
        if (sum < 0) sum = 0;
    }
    return maxSum;
}
// Time: O(n)  Space: O(1)`, video_url: null, platform_url: 'https://leetcode.com/problems/maximum-subarray/' },
      { title: 'Print subarray with maximum subarray sum (extended version of above problem)', slug: 'print-max-subarray', difficulty: 'medium',
        description: "The same problem as Kadane's Algorithm, but also identify and return the actual subarray.",
        examples: 'Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]\nOutput: [4, -1, 2, 1] (sum = 6)',
        approach: "Run Kadane's algorithm, additionally track the start index whenever the running sum resets to 0.",
        solution_code: `vector<int> printMaxSubarray(vector<int>& nums) {
    int maxSum = INT_MIN, sum = 0, start = 0, bestStart = 0, bestEnd = 0;
    for (int i = 0; i < nums.size(); i++) {
        if (sum == 0) start = i;
        sum += nums[i];
        if (sum > maxSum) {
            maxSum = sum;
            bestStart = start;
            bestEnd = i;
        }
        if (sum < 0) sum = 0;
    }
    return vector<int>(nums.begin() + bestStart, nums.begin() + bestEnd + 1);
}
// Time: O(n)  Space: O(1) excluding output`, video_url: null, platform_url: null },
      { title: 'Stock Buy and Sell', slug: 'stock-buy-and-sell', difficulty: 'medium',
        description: 'Given an array of stock prices by day, find the maximum profit from buying on one day and selling on a later day.',
        examples: 'Input: [7, 1, 5, 3, 6, 4]\nOutput: 5 (buy at 1, sell at 6)',
        approach: 'Track the minimum price seen so far. At each day, compute profit if sold today.',
        solution_code: `int maxProfit(vector<int>& prices) {
    int minPrice = INT_MAX, maxProfit = 0;
    for (int price : prices) {
        minPrice = min(minPrice, price);
        maxProfit = max(maxProfit, price - minPrice);
    }
    return maxProfit;
}
// Time: O(n)  Space: O(1)`, video_url: null, platform_url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
      { title: 'Rearrange array elements by sign', slug: 'rearrange-array-by-sign', difficulty: 'medium',
        description: 'Given an array with an equal number of positive and negative integers, rearrange it so positive and negative numbers alternate, starting with a positive number.',
        examples: 'Input: [3, 1, -2, -5, 2, -4]\nOutput: [3, -2, 1, -5, 2, -4]',
        approach: 'Two separate pointers for positive and negative index positions, advancing by 2 each.',
        solution_code: `vector<int> rearrangeBySign(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n);
    int posIdx = 0, negIdx = 1;
    for (int x : nums) {
        if (x > 0) { result[posIdx] = x; posIdx += 2; }
        else { result[negIdx] = x; negIdx += 2; }
    }
    return result;
}
// Time: O(n)  Space: O(n)`, video_url: null, platform_url: 'https://leetcode.com/problems/rearrange-array-elements-by-sign/' },
      { title: 'Next Permutation', slug: 'next-permutation', difficulty: 'medium',
        description: 'Rearrange numbers into the lexicographically next greater permutation. If none exists, rearrange into ascending order.',
        examples: 'Input: [1, 2, 3]\nOutput: [1, 3, 2]\n\nInput: [3, 2, 1]\nOutput: [1, 2, 3]',
        approach: "Find the first index from the right where nums[i] < nums[i+1], swap with the smallest greater value to its right, then reverse everything after.",
        solution_code: `void nextPermutation(vector<int>& nums) {
    int n = nums.size(), i = n - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) i--;
    if (i >= 0) {
        int j = n - 1;
        while (nums[j] <= nums[i]) j--;
        swap(nums[i], nums[j]);
    }
    reverse(nums.begin() + i + 1, nums.end());
}
// Time: O(n)  Space: O(1)`, video_url: null, platform_url: 'https://leetcode.com/problems/next-permutation/' },
      { title: 'Leaders in an Array', slug: 'leaders-in-array', difficulty: 'medium',
        description: 'An element is a "leader" if it is strictly greater than every element to its right. Find all the leaders in an array.',
        examples: 'Input: [4, 7, 1, 0]\nOutput: [7, 1, 0]',
        approach: 'Scan from right to left, keeping track of the maximum value seen so far.',
        solution_code: `vector<int> leaders(vector<int>& arr) {
    vector<int> result;
    int maxFromRight = INT_MIN;
    for (int i = arr.size() - 1; i >= 0; i--) {
        if (arr[i] > maxFromRight) {
            result.push_back(arr[i]);
            maxFromRight = arr[i];
        }
    }
    reverse(result.begin(), result.end());
    return result;
}
// Time: O(n)  Space: O(n)`, video_url: null, platform_url: null },
      { title: 'Longest Consecutive Sequence in an Array', slug: 'longest-consecutive-sequence', difficulty: 'medium',
        description: 'Given an unsorted array, find the length of the longest sequence of consecutive integers.',
        examples: 'Input: [100, 4, 200, 1, 3, 2]\nOutput: 4 (the sequence 1, 2, 3, 4)',
        approach: 'Put every number into a hash set. Only start counting from numbers where (number - 1) is NOT in the set.',
        solution_code: `int longestConsecutive(vector<int>& nums) {
    unordered_set<int> numSet(nums.begin(), nums.end());
    int longest = 0;
    for (int x : numSet) {
        if (!numSet.count(x - 1)) {
            int length = 1;
            while (numSet.count(x + length)) length++;
            longest = max(longest, length);
        }
    }
    return longest;
}
// Time: O(n)  Space: O(n)`, video_url: null, platform_url: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
      { title: 'Set Matrix Zeroes', slug: 'set-matrix-zeroes', difficulty: 'medium',
        description: 'Given a matrix, if an element is 0, set its entire row and column to 0, in-place.',
        examples: 'Input: [[1,1,1],[1,0,1],[1,1,1]]\nOutput: [[1,0,1],[0,0,0],[1,0,1]]',
        approach: 'Use the first row and first column of the matrix itself as markers.',
        solution_code: `void setZeroes(vector<vector<int>>& matrix) {
    int rows = matrix.size(), cols = matrix[0].size();
    bool firstRowZero = false, firstColZero = false;

    for (int i = 0; i < rows; i++) if (matrix[i][0] == 0) firstColZero = true;
    for (int j = 0; j < cols; j++) if (matrix[0][j] == 0) firstRowZero = true;

    for (int i = 1; i < rows; i++)
        for (int j = 1; j < cols; j++)
            if (matrix[i][j] == 0) { matrix[i][0] = 0; matrix[0][j] = 0; }

    for (int i = 1; i < rows; i++)
        for (int j = 1; j < cols; j++)
            if (matrix[i][0] == 0 || matrix[0][j] == 0) matrix[i][j] = 0;

    if (firstRowZero) for (int j = 0; j < cols; j++) matrix[0][j] = 0;
    if (firstColZero) for (int i = 0; i < rows; i++) matrix[i][0] = 0;
}
// Time: O(rows * cols)  Space: O(1)`, video_url: null, platform_url: 'https://leetcode.com/problems/set-matrix-zeroes/' },
      { title: 'Rotate matrix by 90 degrees', slug: 'rotate-matrix-90', difficulty: 'medium',
        description: 'Rotate an N x N matrix 90 degrees clockwise, in-place.',
        examples: 'Input: [[1,2,3],[4,5,6],[7,8,9]]\nOutput: [[7,4,1],[8,5,2],[9,6,3]]',
        approach: 'Transpose the matrix, then reverse each row.',
        solution_code: `void rotate(vector<vector<int>>& matrix) {
    int n = matrix.size();
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            swap(matrix[i][j], matrix[j][i]);

    for (auto& row : matrix)
        reverse(row.begin(), row.end());
}
// Time: O(n^2)  Space: O(1)`, video_url: null, platform_url: 'https://leetcode.com/problems/rotate-image/' },
      { title: 'Print the matrix in spiral manner', slug: 'spiral-matrix', difficulty: 'medium',
        description: 'Given a matrix, return all its elements in spiral order.',
        examples: 'Input: [[1,2,3],[4,5,6],[7,8,9]]\nOutput: [1, 2, 3, 6, 9, 8, 7, 4, 5]',
        approach: 'Keep four boundaries: top, bottom, left, right. Traverse and shrink each boundary inward.',
        solution_code: `vector<int> spiralOrder(vector<vector<int>>& matrix) {
    vector<int> result;
    int top = 0, bottom = matrix.size() - 1;
    int left = 0, right = matrix[0].size() - 1;

    while (top <= bottom && left <= right) {
        for (int j = left; j <= right; j++) result.push_back(matrix[top][j]);
        top++;
        for (int i = top; i <= bottom; i++) result.push_back(matrix[i][right]);
        right--;
        if (top <= bottom) {
            for (int j = right; j >= left; j--) result.push_back(matrix[bottom][j]);
            bottom--;
        }
        if (left <= right) {
            for (int i = bottom; i >= top; i--) result.push_back(matrix[i][left]);
            left++;
        }
    }
    return result;
}
// Time: O(rows * cols)  Space: O(1) excluding output`, video_url: null, platform_url: 'https://leetcode.com/problems/spiral-matrix/' },
      { title: 'Count subarrays with given sum', slug: 'count-subarrays-given-sum', difficulty: 'medium',
        description: 'Given an array and a target sum K, count how many contiguous subarrays sum exactly to K.',
        examples: 'Input: [1, 1, 1], k = 2\nOutput: 2',
        approach: 'Running prefix sum with a hash map counting occurrences. Check how many times (currentSum - k) appeared before.',
        solution_code: `int subarraySum(vector<int>& nums, int k) {
    unordered_map<int, int> prefixCount;
    prefixCount[0] = 1;
    int sum = 0, count = 0;
    for (int x : nums) {
        sum += x;
        if (prefixCount.count(sum - k)) count += prefixCount[sum - k];
        prefixCount[sum]++;
    }
    return count;
}
// Time: O(n)  Space: O(n)`, video_url: null, platform_url: 'https://leetcode.com/problems/subarray-sum-equals-k/' }
    ];

    for (let i = 0; i < mediumProblems.length; i++) {
      const p = mediumProblems[i];
      await client.query(
        `INSERT INTO problems
           (subtopic_id, title, slug, description, category, difficulty, examples, approach, solution_code, external_link, platform_url, display_order)
         VALUES ($1, $2, $3, $4, 'interview', $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (subtopic_id, slug) DO NOTHING`,
        [mediumId, p.title, p.slug, p.description, p.difficulty, p.examples, p.approach, p.solution_code, p.video_url, p.platform_url, i + 1]
      );
    }

    console.log(`✅ Seeded ${mediumProblems.length} real Medium problems`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
  }
}

seedMediumArrayProblems();
