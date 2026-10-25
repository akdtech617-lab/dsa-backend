require('dotenv').config();
const db = require('./src/config/db');

async function seedDPPart2() {
  try {
    console.log('Starting seed for Dynamic Programming Part 2...');
    const courseId = 'd2284cdb-751f-40f0-b7f2-c9ca6c277efe';

    const topicQuery = await db.query(
      `SELECT id FROM topics WHERE slug = 'dynamic-programming' AND course_id = $1 LIMIT 1;`,
      [courseId]
    );

    if (topicQuery.rows.length === 0) {
      throw new Error('Topic "dynamic-programming" not found. Run Part 1 first!');
    }
    const topicId = topicQuery.rows[0].id;

    async function insertSubtopic(title, slug, displayOrder) {
      const res = await db.query(
        `INSERT INTO subtopics (topic_id, title, slug, description, display_order, video_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (topic_id, slug) DO UPDATE
         SET title = EXCLUDED.title, display_order = EXCLUDED.display_order, video_url = NULL
         RETURNING id;`,
        [topicId, title, slug, `Master ${title}`, displayOrder, null]
      );
      return res.rows[0].id;
    }

    async function insertProblem(subtopicId, p) {
      await db.query(
        `INSERT INTO problems (
          subtopic_id, title, slug, category, difficulty,
          platform_url, external_link, description, examples, approach, solution_code, display_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (subtopic_id, slug) DO UPDATE
        SET title = EXCLUDED.title, category = EXCLUDED.category, difficulty = EXCLUDED.difficulty,
            platform_url = EXCLUDED.platform_url, external_link = EXCLUDED.external_link,
            description = EXCLUDED.description, examples = EXCLUDED.examples,
            approach = EXCLUDED.approach, solution_code = EXCLUDED.solution_code,
            display_order = EXCLUDED.display_order;`,
        [
          subtopicId, p.title, p.slug, 'interview', p.difficulty,
          p.platform_url, p.external_link, p.description, p.examples,
          p.approach, p.solution_code, p.display_order
        ]
      );
    }

    // Subtopic 6: DP on subsequences (11 problems)
    const sub6Id = await insertSubtopic('DP on subsequences', 'dp-on-subsequences', 5);
    const s6Problems = [
      {
        title: 'Subset sum equals to target',
        slug: 'subset-sum-equals-to-target',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/subset-sum-problem-1611555638/1',
        external_link: 'https://www.youtube.com/watch?v=fWX9xDmIzRI',
        description: 'Given an array of non-negative integers and a target sum, determine if there is a subset whose sum equals target.',
        examples: 'Input: arr = [3, 34, 4, 12, 5, 2], target = 9\nOutput: true\nExplanation: Subset (4 + 5 = 9).',
        approach: 'dp[target] = dp[target] || dp[target - arr[i]]. Maintain boolean vector of size target+1 updated backwards.',
        solution_code: `bool isSubsetSum(vector<int>& arr, int target) {\n    vector<bool> dp(target + 1, false);\n    dp[0] = true;\n    for (int num : arr) {\n        for (int t = target; t >= num; t--) {\n            dp[t] = dp[t] || dp[t - num];\n        }\n    }\n    return dp[target];\n}\n// Time: O(n * target)  Space: O(target)`,
        display_order: 0
      },
      {
        title: 'Partition equal subset sum',
        slug: 'partition-equal-subset-sum',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/partition-equal-subset-sum/',
        external_link: 'https://www.youtube.com/watch?v=7win33Go3Bg',
        description: 'Determine if an array can be partitioned into two subsets such that the sum of elements in both subsets is equal.',
        examples: 'Input: nums = [1,5,11,5]\nOutput: true\nExplanation: [1, 5, 5] and [11].',
        approach: 'If totalSum is odd, return false. Otherwise, find if a subset with sum equal to totalSum / 2 exists.',
        solution_code: `bool canPartition(vector<int>& nums) {\n    int sum = accumulate(nums.begin(), nums.end(), 0);\n    if (sum % 2 != 0) return false;\n    int target = sum / 2;\n    vector<bool> dp(target + 1, false);\n    dp[0] = true;\n    for (int x : nums) {\n        for (int t = target; t >= x; t--) {\n            dp[t] = dp[t] || dp[t - x];\n        }\n    }\n    return dp[target];\n}\n// Time: O(n * sum)  Space: O(sum)`,
        display_order: 1
      },
      {
        title: 'Partition a set into two subsets with minimum absolute sum difference',
        slug: 'partition-array-into-two-arrays-to-minimize-sum-difference',
        difficulty: 'hard',
        platform_url: 'https://practice.geeksforgeeks.org/problems/minimum-sum-partition3317/1',
        external_link: 'https://www.youtube.com/watch?v=GS_OqZb2CWc',
        description: 'Partition array into two subsets such that the absolute difference of their sums is minimized.',
        examples: 'Input: arr = [1, 6, 11, 5]\nOutput: 1\nExplanation: Subsets [1, 5, 6] (sum 12) and [11] (sum 11), diff = 1.',
        approach: 'Compute subset sum reachability up to totalSum / 2 using 0/1 knapsack DP. The min difference is min(totalSum - 2*s) for all achievable s.',
        solution_code: `int minDifference(int arr[], int n) {\n    int totalSum = 0;\n    for (int i = 0; i < n; i++) totalSum += arr[i];\n    vector<bool> dp(totalSum / 2 + 1, false);\n    dp[0] = true;\n    for (int i = 0; i < n; i++) {\n        for (int t = totalSum / 2; t >= arr[i]; t--) {\n            dp[t] = dp[t] || dp[t - arr[i]];\n        }\n    }\n    for (int s = totalSum / 2; s >= 0; s--) {\n        if (dp[s]) return totalSum - 2 * s;\n    }\n    return 0;\n}\n// Time: O(n * totalSum)  Space: O(totalSum)`,
        display_order: 2
      },
      {
        title: 'Count subsets with sum K',
        slug: 'count-subsets-with-sum-k',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/perfect-sum-problem5633/1',
        external_link: 'https://www.youtube.com/watch?v=fWX9xDmIzRI',
        description: 'Given an array of integers and a sum target, count all possible subsets whose sum equals target.',
        examples: 'Input: arr = [5, 2, 3, 10, 6, 8], sum = 10\nOutput: 3',
        approach: 'dp[s] += dp[s - num]. Iterate backwards to avoid reusing elements. Handle zeros by accounting for 2^zero_count configurations.',
        solution_code: `int perfectSum(int arr[], int n, int sum) {\n    int mod = 1e9 + 7;\n    vector<int> dp(sum + 1, 0);\n    dp[0] = 1;\n    for (int i = 0; i < n; i++) {\n        for (int s = sum; s >= arr[i]; s--) {\n            dp[s] = (dp[s] + dp[s - arr[i]]) % mod;\n        }\n    }\n    return dp[sum];\n}\n// Time: O(n * sum)  Space: O(sum)`,
        display_order: 3
      },
      {
        title: 'Count partitions with given difference',
        slug: 'count-partitions-with-given-difference',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/partitions-with-given-difference/1',
        external_link: 'https://www.youtube.com/watch?v=zoilC1kOrMe',
        description: 'Count number of partitions of array into two subsets S1 and S2 such that S1 >= S2 and S1 - S2 = d.',
        examples: 'Input: n = 4, d = 3, arr = [5, 2, 6, 4]\nOutput: 1',
        approach: 'S1 - S2 = d and S1 + S2 = totalSum => S1 = (totalSum + d) / 2. Reduce to finding number of subsets with sum S1.',
        solution_code: `int countPartitions(int n, int d, vector<int>& arr) {\n    int totalSum = accumulate(arr.begin(), arr.end(), 0);\n    if (totalSum - d < 0 || (totalSum - d) % 2 != 0) return 0;\n    int target = (totalSum - d) / 2;\n    int mod = 1e9 + 7;\n    vector<int> dp(target + 1, 0);\n    dp[0] = 1;\n    for (int x : arr) {\n        for (int t = target; t >= x; t--) {\n            dp[t] = (dp[t] + dp[t - x]) % mod;\n        }\n    }\n    return dp[target];\n}\n// Time: O(n * target)  Space: O(target)`,
        display_order: 4
      },
      {
        title: '0 and 1 Knapsack',
        slug: '0-1-knapsack-problem',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1',
        external_link: 'https://www.youtube.com/watch?v=GqOmJwNTPEh',
        description: 'Given weights and values of N items, put them in a knapsack of capacity W to get maximum total value. Each item can be picked at most once.',
        examples: 'Input: W = 4, val = [1, 2, 3], wt = [4, 5, 1]\nOutput: 3',
        approach: 'dp[w] = max(dp[w], val[i] + dp[w - wt[i]]). Traverse weights from W down to wt[i] to ensure each item is chosen at most once.',
        solution_code: `int knapSack(int W, int wt[], int val[], int n) {\n    vector<int> dp(W + 1, 0);\n    for (int i = 0; i < n; i++) {\n        for (int w = W; w >= wt[i]; w--) {\n            dp[w] = max(dp[w], val[i] + dp[w - wt[i]]);\n        }\n    }\n    return dp[W];\n}\n// Time: O(n * W)  Space: O(W)`,
        display_order: 5
      },
      {
        title: 'Minimum coins',
        slug: 'coin-change',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/coin-change/',
        external_link: 'https://www.youtube.com/watch?v=myPeWb3Y68A',
        description: 'Find the fewest number of coins that you need to make up a given amount. If impossible, return -1. You have an infinite number of each coin.',
        examples: 'Input: coins = [1,2,5], amount = 11\nOutput: 3\nExplanation: 11 = 5 + 5 + 1.',
        approach: 'Unbounded knapsack: dp[a] = min(dp[a], 1 + dp[a - c]). Iterate forwards from c to amount for each coin c.',
        solution_code: `int coinChange(vector<int>& coins, int amount) {\n    vector<int> dp(amount + 1, amount + 1);\n    dp[0] = 0;\n    for (int c : coins) {\n        for (int a = c; a <= amount; a++) {\n            dp[a] = min(dp[a], 1 + dp[a - c]);\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}\n// Time: O(n * amount)  Space: O(amount)`,
        display_order: 6
      },
      {
        title: 'Target sum',
        slug: 'target-sum',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/target-sum/',
        external_link: 'https://www.youtube.com/watch?v=b3GD82PEUMC',
        description: 'Assign + or - signs to each integer in nums so that the overall expression evaluates to target. Return the number of different expressions.',
        examples: 'Input: nums = [1,1,1,1,1], target = 3\nOutput: 5',
        approach: 'Equivalent to partitioning array into positive and negative sets: P - N = target and P + N = totalSum => P = (totalSum + target) / 2.',
        solution_code: `int findTargetSumWays(vector<int>& nums, int target) {\n    int sum = accumulate(nums.begin(), nums.end(), 0);\n    if (sum < abs(target) || (sum + target) % 2 != 0) return 0;\n    int s1 = (sum + target) / 2;\n    vector<int> dp(s1 + 1, 0);\n    dp[0] = 1;\n    for (int x : nums) {\n        for (int s = s1; s >= x; s--) {\n            dp[s] += dp[s - x];\n        }\n    }\n    return dp[s1];\n}\n// Time: O(n * s1)  Space: O(s1)`,
        display_order: 7
      },
      {
        title: 'Coin change II',
        slug: 'coin-change-ii',
        difficulty: 'hard',
        platform_url: 'https://leetcode.com/problems/coin-change-ii/',
        external_link: 'https://www.youtube.com/watch?v=HgyouEi60fc',
        description: 'Return the number of combinations that make up the amount. You may assume you have an infinite number of each kind of coin.',
        examples: 'Input: amount = 5, coins = [1,2,5]\nOutput: 4\nExplanation: 5, 2+2+1, 2+1+1+1, 1+1+1+1+1.',
        approach: 'Loop over coins on the outer loop and amounts on the inner loop: dp[a] += dp[a - c]. Outer loop avoids counting permutations.',
        solution_code: `int change(int amount, vector<int>& coins) {\n    vector<uint64_t> dp(amount + 1, 0);\n    dp[0] = 1;\n    for (int c : coins) {\n        for (int a = c; a <= amount; a++) {\n            dp[a] += dp[a - c];\n        }\n    }\n    return dp[amount];\n}\n// Time: O(n * amount)  Space: O(amount)`,
        display_order: 8
      },
      {
        title: 'Unbounded knapsack',
        slug: 'unbounded-knapsack',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/knapsack-with-duplicate-items4201/1',
        external_link: 'https://www.youtube.com/watch?v=OgvOZ6OrJoY',
        description: 'Given knapsack capacity W and items with weights and values, find maximum value when items can be selected any number of times.',
        examples: 'Input: N = 2, W = 3, val = [1, 1], wt = [2, 1]\nOutput: 3',
        approach: 'Iterate capacity forwards from wt[i] to W: dp[w] = max(dp[w], val[i] + dp[w - wt[i]]). Forward iteration allows reuse.',
        solution_code: `int knapSack(int N, int W, int val[], int wt[]) {\n    vector<int> dp(W + 1, 0);\n    for (int i = 0; i < N; i++) {\n        for (int w = wt[i]; w <= W; w++) {\n            dp[w] = max(dp[w], val[i] + dp[w - wt[i]]);\n        }\n    }\n    return dp[W];\n}\n// Time: O(N * W)  Space: O(W)`,
        display_order: 9
      },
      {
        title: 'Rod cutting problem',
        slug: 'rod-cutting',
        difficulty: 'hard',
        platform_url: 'https://practice.geeksforgeeks.org/problems/rod-cutting0840/1',
        external_link: 'https://www.youtube.com/watch?v=mO8XnMJac6U',
        description: 'Given a rod of length N and prices for pieces of length 1 to N, find the maximum value obtainable by cutting up the rod.',
        examples: 'Input: N = 8, price = [1, 5, 8, 9, 10, 17, 17, 20]\nOutput: 22',
        approach: 'Unbounded knapsack: length of piece is weight, price is value. dp[len] = max(dp[len], price[i] + dp[len - (i + 1)]).',
        solution_code: `int cutRod(int price[], int n) {\n    vector<int> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        int len = i + 1;\n        for (int j = len; j <= n; j++) {\n            dp[j] = max(dp[j], price[i] + dp[j - len]);\n        }\n    }\n    return dp[n];\n}\n// Time: O(n^2)  Space: O(n)`,
        display_order: 10
      }
    ];
    for (const p of s6Problems) await insertProblem(sub6Id, p);

    // Subtopic 7: LIS (6 problems)
    const sub7Id = await insertSubtopic('LIS', 'lis', 6);
    const s7Problems = [
      {
        title: 'Longest Increasing Subsequence',
        slug: 'longest-increasing-subsequence',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/longest-increasing-subsequence/',
        external_link: 'https://www.youtube.com/watch?v=ekcwMsSIzVc',
        description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence in O(n log n) time.',
        examples: 'Input: nums = [10,9,2,5,3,7,101,18]\nOutput: 4\nExplanation: [2, 3, 7, 101].',
        approach: 'Binary Search (Patience Sorting): Maintain a vector tails. For each num, use std::lower_bound to find its position and replace/extend.',
        solution_code: `int lengthOfLIS(vector<int>& nums) {\n    vector<int> tails;\n    for (int x : nums) {\n        auto it = lower_bound(tails.begin(), tails.end(), x);\n        if (it == tails.end()) tails.push_back(x);\n        else *it = x;\n    }\n    return tails.size();\n}\n// Time: O(n log n)  Space: O(n)`,
        display_order: 0
      },
      {
        title: 'Print Longest Increasing Subsequence',
        slug: 'printing-longest-increasing-subsequence',
        difficulty: 'hard',
        platform_url: 'https://practice.geeksforgeeks.org/problems/printing-longest-increasing-subsequence/1',
        external_link: 'https://www.youtube.com/watch?v=IFfYfonAFGc',
        description: 'Find and print the actual elements forming the Longest Increasing Subsequence.',
        examples: 'Input: arr = [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15]\nOutput: 0 4 6 9 13 15',
        approach: 'Maintain dp[i] and parent[i] pointers. After identifying the max index, backtrack using parent pointers and reverse the resulting list.',
        solution_code: `vector<int> longestIncreasingSubsequence(int n, vector<int>& arr) {\n    vector<int> dp(n, 1), parent(n);\n    int maxLen = 1, lastIdx = 0;\n    for (int i = 0; i < n; i++) {\n        parent[i] = i;\n        for (int prev = 0; prev < i; prev++) {\n            if (arr[prev] < arr[i] && 1 + dp[prev] > dp[i]) {\n                dp[i] = 1 + dp[prev];\n                parent[i] = prev;\n            }\n        }\n        if (dp[i] > maxLen) { maxLen = dp[i]; lastIdx = i; }\n    }\n    vector<int> lis;\n    lis.push_back(arr[lastIdx]);\n    while (parent[lastIdx] != lastIdx) {\n        lastIdx = parent[lastIdx];\n        lis.push_back(arr[lastIdx]);\n    }\n    reverse(lis.begin(), lis.end());\n    return lis;\n}\n// Time: O(n^2)  Space: O(n)`,
        display_order: 1
      },
      {
        title: 'Largest Divisible Subset',
        slug: 'largest-divisible-subset',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/largest-divisible-subset/',
        external_link: 'https://www.youtube.com/watch?v=gDuZwBW9VvM',
        description: 'Find the largest subset where every pair of elements satisfies answer[i] % answer[j] == 0 or answer[j] % answer[i] == 0.',
        examples: 'Input: nums = [1,2,3]\nOutput: [1,2] or [1,3]',
        approach: 'Sort nums ascending. If nums[i] % nums[j] == 0, and nums[j] divides all prior elements, then nums[i] can extend the subset. Follow LIS pattern.',
        solution_code: `vector<int> largestDivisibleSubset(vector<int>& nums) {\n    int n = nums.size();\n    sort(nums.begin(), nums.end());\n    vector<int> dp(n, 1), parent(n);\n    int maxLen = 1, lastIdx = 0;\n    for (int i = 0; i < n; i++) {\n        parent[i] = i;\n        for (int j = 0; j < i; j++) {\n            if (nums[i] % nums[j] == 0 && 1 + dp[j] > dp[i]) {\n                dp[i] = 1 + dp[j];\n                parent[i] = j;\n            }\n        }\n        if (dp[i] > maxLen) { maxLen = dp[i]; lastIdx = i; }\n    }\n    vector<int> ans;\n    while (parent[lastIdx] != lastIdx) {\n        ans.push_back(nums[lastIdx]);\n        lastIdx = parent[lastIdx];\n    }\n    ans.push_back(nums[lastIdx]);\n    return ans;\n}\n// Time: O(n^2)  Space: O(n)`,
        display_order: 2
      },
      {
        title: 'Longest String Chain',
        slug: 'longest-string-chain',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/longest-string-chain/',
        external_link: 'https://www.youtube.com/watch?v=YY8iBaYcc4g',
        description: 'WordA is a predecessor of wordB if we can insert one letter into wordA to make it equal to wordB. Return length of longest word chain.',
        examples: 'Input: words = ["a","b","ba","bca","bda","bdca"]\nOutput: 4\nExplanation: "a" -> "ba" -> "bda" -> "bdca".',
        approach: 'Sort words by length. For each word, generate all n predecessors by removing one character at a time. dp[word] = 1 + max(dp[prev]).',
        solution_code: `int longestStrChain(vector<string>& words) {\n    sort(words.begin(), words.end(), [](const string& a, const string& b) {\n        return a.length() < b.length();\n    });\n    unordered_map<string, int> dp;\n    int res = 1;\n    for (const string& w : words) {\n        dp[w] = 1;\n        for (size_t i = 0; i < w.length(); i++) {\n            string pred = w.substr(0, i) + w.substr(i + 1);\n            if (dp.count(pred)) {\n                dp[w] = max(dp[w], dp[pred] + 1);\n            }\n        }\n        res = max(res, dp[w]);\n    }\n    return res;\n}\n// Time: O(n * L^2)  Space: O(n)`,
        display_order: 3
      },
      {
        title: 'Longest Bitonic Subsequence',
        slug: 'longest-bitonic-subsequence',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/longest-bitonic-subsequence0824/1',
        external_link: 'https://www.youtube.com/watch?v=y4vN0WNdLJg',
        description: 'A subsequence is bitonic if it is first strictly increasing and then strictly decreasing. Return the length of the longest bitonic subsequence.',
        examples: 'Input: nums = [1, 2, 5, 3, 2]\nOutput: 5\nExplanation: 1 < 2 < 5 > 3 > 2.',
        approach: 'Compute LIS from left to right in dp1. Compute LIS from right to left (LDS) in dp2. Result is max(dp1[i] + dp2[i] - 1) over all i.',
        solution_code: `int LongestBitonicSequence(int n, vector<int>& nums) {\n    vector<int> dp1(n, 1), dp2(n, 1);\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < i; j++) {\n            if (nums[j] < nums[i]) dp1[i] = max(dp1[i], 1 + dp1[j]);\n        }\n    }\n    for (int i = n - 1; i >= 0; i--) {\n        for (int j = n - 1; j > i; j--) {\n            if (nums[j] < nums[i]) dp2[i] = max(dp2[i], 1 + dp2[j]);\n        }\n    }\n    int maxi = 0;\n    for (int i = 0; i < n; i++) {\n        maxi = max(maxi, dp1[i] + dp2[i] - 1);\n    }\n    return maxi;\n}\n// Time: O(n^2)  Space: O(n)`,
        display_order: 4
      },
      {
        title: 'Number of Longest Increasing Subsequences',
        slug: 'number-of-longest-increasing-subsequence',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/number-of-longest-increasing-subsequence/',
        external_link: 'https://www.youtube.com/watch?v=cKVl1v9SiXY',
        description: 'Given an integer array nums, return the number of longest increasing subsequences.',
        examples: 'Input: nums = [1,3,5,4,7]\nOutput: 2\nExplanation: Two LIS [1, 3, 4, 7] and [1, 3, 5, 7].',
        approach: 'Maintain dp[i] (length of LIS ending at i) and count[i] (number of LIS ending at i). Update count[i] when 1+dp[j] == dp[i] or 1+dp[j] > dp[i].',
        solution_code: `int findNumberOfLIS(vector<int>& nums) {\n    int n = nums.size();\n    vector<int> dp(n, 1), cnt(n, 1);\n    int maxLen = 1;\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < i; j++) {\n            if (nums[j] < nums[i]) {\n                if (dp[j] + 1 > dp[i]) {\n                    dp[i] = dp[j] + 1;\n                    cnt[i] = cnt[j];\n                } else if (dp[j] + 1 == dp[i]) {\n                    cnt[i] += cnt[j];\n                }\n            }\n        }\n        maxLen = max(maxLen, dp[i]);\n    }\n    int ans = 0;\n    for (int i = 0; i < n; i++) {\n        if (dp[i] == maxLen) ans += cnt[i];\n    }\n    return ans;\n}\n// Time: O(n^2)  Space: O(n)`,
        display_order: 5
      }
    ];
    for (const p of s7Problems) await insertProblem(sub7Id, p);

    console.log('Part 2 Completed: 17 problems inserted/updated across Subtopics 6 and 7!');
    process.exit(0);
  } catch (err) {
    console.error('Error in seedDPPart2:', err);
    process.exit(1);
  }
}

seedDPPart2();
