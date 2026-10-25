require('dotenv').config();
const db = require('./src/config/db');

async function seedDPPart1() {
  try {
    console.log('Starting seed for Dynamic Programming Part 1...');
    const courseId = 'd2284cdb-751f-40f0-b7f2-c9ca6c277efe';

    // 1. Topic
    const topicRes = await db.query(
      `INSERT INTO topics (course_id, title, slug, description, display_order)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (course_id, slug) DO UPDATE
       SET title = EXCLUDED.title, description = EXCLUDED.description, display_order = EXCLUDED.display_order
       RETURNING id;`,
      [
        courseId,
        'Dynamic Programming',
        'dynamic-programming',
        'Master recursion with memoization, iterative tabulation, state space optimization, and classic DP patterns.',
        4
      ]
    );
    const topicId = topicRes.rows[0].id;
    console.log(`Topic ready with ID: ${topicId}`);

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

    // Subtopic 1: Introduction (1 problem)
    const sub1Id = await insertSubtopic('Introduction', 'introduction', 0);
    await insertProblem(sub1Id, {
      title: 'Introduction to DP',
      slug: 'introduction-to-dp',
      difficulty: 'easy',
      platform_url: 'https://practice.geeksforgeeks.org/problems/introduction-to-dp/1',
      external_link: 'https://www.youtube.com/watch?v=tyB0ztf0DNY',
      description: 'Understand what Dynamic Programming is: Overlapping Subproblems and Optimal Substructure. Learn Top-down (Memoization) vs Bottom-up (Tabulation).',
      examples: 'Input: n = 5\nOutput: 5\nExplanation: Fibonacci(5) using memoization.',
      approach: 'Identify subproblem overlaps. Store computed results in a lookup table (memo table) to avoid redundant recursive calls. Convert to iterative bottom-up array when possible.',
      solution_code: `long long int topDown(int n) {\n    vector<long long int> dp(n + 1, -1);\n    auto fib = [&](auto& self, int i) -> long long int {\n        if (i <= 1) return i;\n        if (dp[i] != -1) return dp[i];\n        return dp[i] = (self(self, i - 1) + self(self, i - 2)) % 1000000007;\n    };\n    return fib(fib, n);\n}\n// Time: O(n)  Space: O(n)`,
      display_order: 0
    });

    // Subtopic 2: 1D DP (5 problems)
    const sub2Id = await insertSubtopic('1D DP', '1d-dp', 1);
    const s2Problems = [
      {
        title: 'Climbing stairs',
        slug: 'climbing-stairs',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/climbing-stairs/',
        external_link: 'https://www.youtube.com/watch?v=mLfjzJsN8us',
        description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you reach the top?',
        examples: 'Input: n = 3\nOutput: 3\nExplanation: (1+1+1), (1+2), (2+1).',
        approach: 'Let dp[i] = dp[i-1] + dp[i-2]. To reach step i, you either stepped from i-1 or i-2. Optimize space to two variables.',
        solution_code: `int climbStairs(int n) {\n    if (n <= 2) return n;\n    int prev2 = 1, prev1 = 2;\n    for (int i = 3; i <= n; i++) {\n        int curr = prev1 + prev2;\n        prev2 = prev1;\n        prev1 = curr;\n    }\n    return prev1;\n}\n// Time: O(n)  Space: O(1)`,
        display_order: 0
      },
      {
        title: 'Frog Jump',
        slug: 'frog-jump',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/geek-jump/1',
        external_link: 'https://www.youtube.com/watch?v=EgG3jsGoPvQ',
        description: 'A frog can jump either 1 or 2 steps forward. The energy lost on jumping from step i to j is |height[i] - height[j]|. Find minimum total energy.',
        examples: 'Input: height = [10, 20, 30, 10]\nOutput: 20',
        approach: 'dp[i] = min(dp[i-1] + |h[i]-h[i-1]|, dp[i-2] + |h[i]-h[i-2]|). Can be optimized to O(1) space with prev1 and prev2.',
        solution_code: `int minimumEnergy(vector<int>& height, int n) {\n    int prev2 = 0, prev1 = 0;\n    for (int i = 1; i < n; i++) {\n        int jumpOne = prev1 + abs(height[i] - height[i - 1]);\n        int jumpTwo = INT_MAX;\n        if (i > 1) jumpTwo = prev2 + abs(height[i] - height[i - 2]);\n        int curr = min(jumpOne, jumpTwo);\n        prev2 = prev1;\n        prev1 = curr;\n    }\n    return prev1;\n}\n// Time: O(n)  Space: O(1)`,
        display_order: 1
      },
      {
        title: 'Frog jump with K distances',
        slug: 'frog-jump-with-k-distances',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/minimal-cost/1',
        external_link: 'https://www.youtube.com/watch?v=Kmh36G9hEio',
        description: 'The frog can jump up to K steps forward at a time. Find the minimum cost to reach the N-1th stone.',
        examples: 'Input: height = [10, 30, 40, 50, 20], k = 3\nOutput: 30',
        approach: 'For each stone i, try all jumps j from 1 to k: dp[i] = min(dp[i - j] + |h[i] - h[i-j]|).',
        solution_code: `int minimizeCost(vector<int>& height, int n, int k) {\n    vector<int> dp(n, INT_MAX);\n    dp[0] = 0;\n    for (int i = 0; i < n; i++) {\n        for (int j = 1; j <= k && i + j < n; j++) {\n            dp[i + j] = min(dp[i + j], dp[i] + abs(height[i + j] - height[i]));\n        }\n    }\n    return dp[n - 1];\n}\n// Time: O(n * k)  Space: O(n)`,
        display_order: 2
      },
      {
        title: 'Maximum sum of non adjacent elements',
        slug: 'maximum-sum-of-non-adjacent-elements',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/max-sum-without-adjacents2430/1',
        external_link: 'https://www.youtube.com/watch?v=GrMBrJNk_NY',
        description: 'Find the maximum sum of a subsequence such that no two elements are adjacent in the original array.',
        examples: 'Input: arr = [2, 1, 4, 9]\nOutput: 11\nExplanation: Pick 2 and 9.',
        approach: 'At each index i, either pick arr[i] + dp[i-2], or not pick dp[i-1]. dp[i] = max(pick, notPick). Space can be optimized to O(1).',
        solution_code: `int findMaxSum(vector<int>& arr, int n) {\n    int prev2 = 0, prev1 = arr[0];\n    for (int i = 1; i < n; i++) {\n        int pick = arr[i] + (i > 1 ? prev2 : 0);\n        int notPick = prev1;\n        int curr = max(pick, notPick);\n        prev2 = prev1;\n        prev1 = curr;\n    }\n    return prev1;\n}\n// Time: O(n)  Space: O(1)`,
        display_order: 3
      },
      {
        title: 'House robber',
        slug: 'house-robber-ii',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/house-robber-ii/',
        external_link: 'https://www.youtube.com/watch?v=3WaxQMELSkw',
        description: 'All houses at this place are arranged in a circle. You cannot rob two adjacent houses. Find max amount you can rob without alerting police.',
        examples: 'Input: nums = [2,3,2]\nOutput: 3\nExplanation: Rob house 2 (money = 3).',
        approach: 'Since house 0 and house n-1 are adjacent, answer is max(rob(nums[0..n-2]), rob(nums[1..n-1])). Each subproblem is solved with House Robber I.',
        solution_code: `int robLinear(vector<int>& nums, int l, int r) {\n    int prev2 = 0, prev1 = 0;\n    for (int i = l; i <= r; i++) {\n        int pick = nums[i] + prev2;\n        int notPick = prev1;\n        int curr = max(pick, notPick);\n        prev2 = prev1;\n        prev1 = curr;\n    }\n    return prev1;\n}\nint rob(vector<int>& nums) {\n    int n = nums.size();\n    if (n == 1) return nums[0];\n    return max(robLinear(nums, 0, n - 2), robLinear(nums, 1, n - 1));\n}\n// Time: O(n)  Space: O(1)`,
        display_order: 4
      }
    ];
    for (const p of s2Problems) await insertProblem(sub2Id, p);

    // Subtopic 3: 2D DP (1 problem)
    const sub3Id = await insertSubtopic('2D DP', '2d-dp', 2);
    await insertProblem(sub3Id, {
      title: "Ninja's training",
      slug: 'ninjas-training',
      difficulty: 'medium',
      platform_url: 'https://practice.geeksforgeeks.org/problems/geeks-training/1',
      external_link: 'https://www.youtube.com/watch?v=AE39gJYuRog',
      description: 'A ninja has N days to train on 3 activities. He cannot perform the same activity on two consecutive days. Find maximum merit points.',
      examples: 'Input: points = [[10, 40, 70], [20, 50, 80], [30, 60, 90]]\nOutput: 210',
      approach: 'dp[day][lastTask] = max(points[day][task] + dp[day-1][task]) for task != lastTask. Optimize space to a 1D array of size 4.',
      solution_code: `int maximumPoints(vector<vector<int>>& points, int n) {\n    vector<int> prev(4, 0);\n    prev[0] = max(points[0][1], points[0][2]);\n    prev[1] = max(points[0][0], points[0][2]);\n    prev[2] = max(points[0][0], points[0][1]);\n    prev[3] = max({points[0][0], points[0][1], points[0][2]});\n    for (int day = 1; day < n; day++) {\n        vector<int> curr(4, 0);\n        for (int last = 0; last < 4; last++) {\n            for (int task = 0; task < 3; task++) {\n                if (task != last) {\n                    curr[last] = max(curr[last], points[day][task] + prev[task]);\n                }\n            }\n        }\n        prev = curr;\n    }\n    return prev[3];\n}\n// Time: O(n)  Space: O(1)`,
      display_order: 0
    });

    // Subtopic 4: DP on grids (6 problems)
    const sub4Id = await insertSubtopic('DP on grids', 'dp-on-grids', 3);
    const s4Problems = [
      {
        title: 'Grid unique paths',
        slug: 'unique-paths',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/unique-paths/',
        external_link: 'https://www.youtube.com/watch?v=sdE0A2Oxofw',
        description: 'A robot is at top-left of an m x n grid. It can only move either down or right. Find total unique paths to bottom-right corner.',
        examples: 'Input: m = 3, n = 7\nOutput: 28',
        approach: 'dp[i][j] = dp[i-1][j] + dp[i][j-1]. State space can be compressed to a single row prev of size n.',
        solution_code: `int uniquePaths(int m, int n) {\n    vector<int> prev(n, 1);\n    for (int i = 1; i < m; i++) {\n        vector<int> curr(n, 1);\n        for (int j = 1; j < n; j++) {\n            curr[j] = curr[j - 1] + prev[j];\n        }\n        prev = curr;\n    }\n    return prev[n - 1];\n}\n// Time: O(m * n)  Space: O(n)`,
        display_order: 0
      },
      {
        title: 'Unique paths II',
        slug: 'unique-paths-ii',
        difficulty: 'hard',
        platform_url: 'https://leetcode.com/problems/unique-paths-ii/',
        external_link: 'https://www.youtube.com/watch?v=TmhpgXScLyY',
        description: 'An obstacle and empty space is marked as 1 or 0 respectively in grid. Find unique paths from top-left to bottom-right avoiding obstacles.',
        examples: 'Input: obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]\nOutput: 2',
        approach: 'If obstacleGrid[i][j] == 1, dp[i][j] = 0. Otherwise dp[i][j] = dp[i-1][j] + dp[i][j-1]. Optimize with 1D array.',
        solution_code: `int uniquePathsWithObstacles(vector<vector<int>>& grid) {\n    int m = grid.size(), n = grid[0].size();\n    vector<long long> prev(n, 0);\n    for (int i = 0; i < m; i++) {\n        vector<long long> curr(n, 0);\n        for (int j = 0; j < n; j++) {\n            if (grid[i][j] == 1) curr[j] = 0;\n            else if (i == 0 && j == 0) curr[j] = 1;\n            else {\n                long long up = (i > 0) ? prev[j] : 0;\n                long long left = (j > 0) ? curr[j - 1] : 0;\n                curr[j] = up + left;\n            }\n        }\n        prev = curr;\n    }\n    return prev[n - 1];\n}\n// Time: O(m * n)  Space: O(n)`,
        display_order: 1
      },
      {
        title: 'Minimum Falling Path Sum',
        slug: 'minimum-falling-path-sum',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/minimum-falling-path-sum/',
        external_link: 'https://www.youtube.com/watch?v=N_aJ5qQbYA0',
        description: 'Find minimum falling path sum from any element in first row to any element in last row, moving to (row+1, col-1), (row+1, col), or (row+1, col+1).',
        examples: 'Input: matrix = [[2,1,3],[6,5,4],[7,8,9]]\nOutput: 13',
        approach: 'dp[i][j] = matrix[i][j] + min({dp[i-1][j-1], dp[i-1][j], dp[i-1][j+1]}). Optimize using previous row array.',
        solution_code: `int minFallingPathSum(vector<vector<int>>& matrix) {\n    int n = matrix.size();\n    vector<int> prev = matrix[0];\n    for (int i = 1; i < n; i++) {\n        vector<int> curr(n);\n        for (int j = 0; j < n; j++) {\n            int up = prev[j];\n            int leftDiag = (j > 0) ? prev[j - 1] : 1e9;\n            int rightDiag = (j < n - 1) ? prev[j + 1] : 1e9;\n            curr[j] = matrix[i][j] + min({up, leftDiag, rightDiag});\n        }\n        prev = curr;\n    }\n    return *min_element(prev.begin(), prev.end());\n}\n// Time: O(n^2)  Space: O(n)`,
        display_order: 2
      },
      {
        title: 'Triangle',
        slug: 'triangle',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/triangle/',
        external_link: 'https://www.youtube.com/watch?v=SrP-PiLSYC0',
        description: 'Given a triangle array, return the minimum path sum from top to bottom. For each step, you may move to an adjacent number on the row below.',
        examples: 'Input: triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]\nOutput: 11\nExplanation: 2 -> 3 -> 5 -> 1 = 11.',
        approach: 'Bottom-up DP: dp[j] = triangle[i][j] + min(dp[j], dp[j+1]). Starting from last row working upwards eliminates edge boundary checks.',
        solution_code: `int minimumTotal(vector<vector<int>>& triangle) {\n    int n = triangle.size();\n    vector<int> dp = triangle[n - 1];\n    for (int i = n - 2; i >= 0; i--) {\n        for (int j = 0; j <= i; j++) {\n            dp[j] = triangle[i][j] + min(dp[j], dp[j + 1]);\n        }\n    }\n    return dp[0];\n}\n// Time: O(n^2)  Space: O(n)`,
        display_order: 3
      },
      {
        title: 'Cherry pickup II',
        slug: 'cherry-pickup-ii',
        difficulty: 'hard',
        platform_url: 'https://leetcode.com/problems/cherry-pickup-ii/',
        external_link: 'https://www.youtube.com/watch?v=QGfn7JeXK54',
        description: 'Two robots start at top-left and top-right of a grid. Both move downwards row by row picking cherries. Find maximum cherries collected.',
        examples: 'Input: grid = [[3,1,1],[2,5,1],[1,5,5],[2,1,1]]\nOutput: 24',
        approach: '3D DP: dp[i][j1][j2] represents row i, robot 1 at col j1, robot 2 at col j2. Try all 9 combinations of moves (-1, 0, +1) for both robots.',
        solution_code: `int cherryPickup(vector<vector<int>>& grid) {\n    int r = grid.size(), c = grid[0].size();\n    vector<vector<int>> prev(c, vector<int>(c, -1));\n    for (int j1 = 0; j1 < c; j1++) {\n        for (int j2 = 0; j2 < c; j2++) {\n            prev[j1][j2] = (j1 == j2) ? grid[r - 1][j1] : grid[r - 1][j1] + grid[r - 1][j2];\n        }\n    }\n    for (int i = r - 2; i >= 0; i--) {\n        vector<vector<int>> curr(c, vector<int>(c, -1));\n        for (int j1 = 0; j1 < c; j1++) {\n            for (int j2 = 0; j2 < c; j2++) {\n                int maxi = -1e9;\n                for (int dj1 = -1; dj1 <= 1; dj1++) {\n                    for (int dj2 = -1; dj2 <= 1; dj2++) {\n                        int nj1 = j1 + dj1, nj2 = j2 + dj2;\n                        if (nj1 >= 0 && nj1 < c && nj2 >= 0 && nj2 < c) {\n                            int val = (j1 == j2) ? grid[i][j1] : grid[i][j1] + grid[i][j2];\n                            val += prev[nj1][nj2];\n                            maxi = max(maxi, val);\n                        }\n                    }\n                }\n                curr[j1][j2] = maxi;\n            }\n        }\n        prev = curr;\n    }\n    return prev[0][c - 1];\n}\n// Time: O(r * c^2 * 9)  Space: O(c^2)`,
        display_order: 4
      },
      {
        title: 'Count Square Submatrices with All Ones(DP-56)',
        slug: 'count-square-submatrices-with-all-ones',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/count-square-submatrices-with-all-ones/',
        external_link: 'https://www.youtube.com/watch?v=auS1JpYUqEc',
        description: 'Given an m x n matrix of ones and zeros, return how many square submatrices have all ones.',
        examples: 'Input: matrix = [[0,1,1,1],[1,1,1,1],[0,1,1,1]]\nOutput: 15',
        approach: 'dp[i][j] stores the size of the largest square submatrix with bottom-right corner at (i, j). dp[i][j] = 1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]}). Sum all dp[i][j].',
        solution_code: `int countSquares(vector<vector<int>>& matrix) {\n    int m = matrix.size(), n = matrix[0].size();\n    vector<vector<int>> dp(m, vector<int>(n, 0));\n    int total = 0;\n    for (int i = 0; i < m; i++) {\n        for (int j = 0; j < n; j++) {\n            if (matrix[i][j] == 1) {\n                if (i == 0 || j == 0) dp[i][j] = 1;\n                else dp[i][j] = 1 + min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});\n                total += dp[i][j];\n            }\n        }\n    }\n    return total;\n}\n// Time: O(m * n)  Space: O(m * n)`,
        display_order: 5
      }
    ];
    for (const p of s4Problems) await insertProblem(sub4Id, p);

    // Subtopic 5: DP on stocks (6 problems)
    const sub5Id = await insertSubtopic('DP on stocks', 'dp-on-stocks', 4);
    const s5Problems = [
      {
        title: 'Best time to buy and sell stock',
        slug: 'best-time-to-buy-and-sell-stock',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
        external_link: 'https://www.youtube.com/watch?v=excAOvwF_Wk',
        description: 'Find maximum profit you can achieve from choosing a single day to buy one stock and choosing a different day in the future to sell.',
        examples: 'Input: prices = [7,1,5,3,6,4]\nOutput: 5\nExplanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6).',
        approach: 'Keep track of minimum price seen so far. Profit on day i is prices[i] - minPrice. Maximize over all days.',
        solution_code: `int maxProfit(vector<int>& prices) {\n    int minPrice = INT_MAX, maxProfit = 0;\n    for (int p : prices) {\n        minPrice = min(minPrice, p);\n        maxProfit = max(maxProfit, p - minPrice);\n    }\n    return maxProfit;\n}\n// Time: O(n)  Space: O(1)`,
        display_order: 0
      },
      {
        title: 'Best time to buy and sell stock II',
        slug: 'best-time-to-buy-and-sell-stock-ii',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/',
        external_link: 'https://www.youtube.com/watch?v=nGJmxkUJQGs',
        description: 'You may buy and sell stock as many times as you like. You cannot engage in multiple transactions simultaneously. Find max profit.',
        examples: 'Input: prices = [7,1,5,3,6,4]\nOutput: 7\nExplanation: Buy day 2 (1), sell day 3 (5), buy day 4 (3), sell day 5 (6).',
        approach: 'Maintain buy and sell states: buy[i] = max(buy[i-1], sell[i-1] - prices[i]), sell[i] = max(sell[i-1], buy[i-1] + prices[i]).',
        solution_code: `int maxProfit(vector<int>& prices) {\n    int buy = -prices[0], sell = 0;\n    for (size_t i = 1; i < prices.size(); i++) {\n        int nextBuy = max(buy, sell - prices[i]);\n        int nextSell = max(sell, buy + prices[i]);\n        buy = nextBuy;\n        sell = nextSell;\n    }\n    return sell;\n}\n// Time: O(n)  Space: O(1)`,
        display_order: 1
      },
      {
        title: 'Best time to buy and sell stock III',
        slug: 'best-time-to-buy-and-sell-stock-iii',
        difficulty: 'hard',
        platform_url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/',
        external_link: 'https://www.youtube.com/watch?v=-uQGzhYj8BQ',
        description: 'Find maximum profit you can achieve with at most two transactions.',
        examples: 'Input: prices = [3,3,5,0,0,3,1,4]\nOutput: 6\nExplanation: Buy day 4 (0), sell day 6 (3), buy day 7 (1), sell day 8 (4).',
        approach: 'Maintain 4 states: buy1, sell1, buy2, sell2. buy1 = max(buy1, -p), sell1 = max(sell1, buy1 + p), buy2 = max(buy2, sell1 - p), sell2 = max(sell2, buy2 + p).',
        solution_code: `int maxProfit(vector<int>& prices) {\n    int buy1 = INT_MIN, sell1 = 0, buy2 = INT_MIN, sell2 = 0;\n    for (int p : prices) {\n        buy1 = max(buy1, -p);\n        sell1 = max(sell1, buy1 + p);\n        buy2 = max(buy2, sell1 - p);\n        sell2 = max(sell2, buy2 + p);\n    }\n    return sell2;\n}\n// Time: O(n)  Space: O(1)`,
        display_order: 2
      },
      {
        title: 'Best time to buy and sell stock IV',
        slug: 'best-time-to-buy-and-sell-stock-iv',
        difficulty: 'hard',
        platform_url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/',
        external_link: 'https://www.youtube.com/watch?v=IV13PRRUMVI',
        description: 'Find maximum profit with at most k transactions.',
        examples: 'Input: k = 2, prices = [3,2,6,5,0,3]\nOutput: 7',
        approach: 'Maintain arrays buy[k+1] and sell[k+1]. For each transaction t from 1 to k, buy[t] = max(buy[t], sell[t-1] - p), sell[t] = max(sell[t], buy[t] + p).',
        solution_code: `int maxProfit(int k, vector<int>& prices) {\n    if (prices.empty() || k == 0) return 0;\n    vector<int> buy(k + 1, INT_MIN), sell(k + 1, 0);\n    for (int p : prices) {\n        for (int t = 1; t <= k; t++) {\n            buy[t] = max(buy[t], sell[t - 1] - p);\n            sell[t] = max(sell[t], buy[t] + p);\n        }\n    }\n    return sell[k];\n}\n// Time: O(n * k)  Space: O(k)`,
        display_order: 3
      },
      {
        title: 'Best time to buy and sell stock with transaction fees',
        slug: 'best-time-to-buy-and-sell-stock-with-transaction-fee',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/',
        external_link: 'https://www.youtube.com/watch?v=k4eK-vEmnKg',
        description: 'You may complete as many transactions as you like, but you must pay a transaction fee for each transaction.',
        examples: 'Input: prices = [1,3,2,8,4,9], fee = 2\nOutput: 8',
        approach: 'Subtract fee upon selling: buy[i] = max(buy[i-1], sell[i-1] - prices[i]), sell[i] = max(sell[i-1], buy[i-1] + prices[i] - fee).',
        solution_code: `int maxProfit(vector<int>& prices, int fee) {\n    int buy = -prices[0], sell = 0;\n    for (size_t i = 1; i < prices.size(); i++) {\n        buy = max(buy, sell - prices[i]);\n        sell = max(sell, buy + prices[i] - fee);\n    }\n    return sell;\n}\n// Time: O(n)  Space: O(1)`,
        display_order: 4
      },
      {
        title: 'Best Time to Buy and Sell Stock with Cooldown',
        slug: 'best-time-to-buy-and-sell-stock-with-cooldown',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/',
        external_link: 'https://www.youtube.com/watch?v=IGIe46xw3YY',
        description: 'After you sell your stock, you cannot buy stock on the next day (i.e., 1 day cooldown). Find max profit.',
        examples: 'Input: prices = [1,2,3,0,2]\nOutput: 3\nExplanation: [buy, sell, cooldown, buy, sell]',
        approach: 'States: buy, sell, and prevSell (cooldown state). buy[i] = max(buy[i-1], prevSell - p). sell[i] = max(sell[i-1], buy[i-1] + p). prevSell = sell[i-1].',
        solution_code: `int maxProfit(vector<int>& prices) {\n    int buy = -prices[0], sell = 0, prevSell = 0;\n    for (size_t i = 1; i < prices.size(); i++) {\n        int nextBuy = max(buy, prevSell - prices[i]);\n        int nextSell = max(sell, buy + prices[i]);\n        prevSell = sell;\n        buy = nextBuy;\n        sell = nextSell;\n    }\n    return sell;\n}\n// Time: O(n)  Space: O(1)`,
        display_order: 5
      }
    ];
    for (const p of s5Problems) await insertProblem(sub5Id, p);

    console.log('Part 1 Completed: 19 problems inserted/updated across 5 subtopics!');
    process.exit(0);
  } catch (err) {
    console.error('Error in seedDPPart1:', err);
    process.exit(1);
  }
}

seedDPPart1();
