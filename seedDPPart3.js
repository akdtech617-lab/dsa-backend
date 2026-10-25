require('dotenv').config();
const db = require('./src/config/db');

async function seedDPPart3() {
  try {
    console.log('Starting seed for Dynamic Programming Part 3...');
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

    // Subtopic 8: DP on strings (11 problems)
    const sub8Id = await insertSubtopic('DP on strings', 'dp-on-strings', 7);
    const s8Problems = [
      {
        title: 'Longest common subsequence',
        slug: 'longest-common-subsequence',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/longest-common-subsequence/',
        external_link: 'https://www.youtube.com/watch?v=NPZn9jBrX8U',
        description: 'Given two strings text1 and text2, return the length of their longest common subsequence.',
        examples: 'Input: text1 = "abcde", text2 = "ace"\nOutput: 3\nExplanation: LCS is "ace".',
        approach: 'If text1[i] == text2[j], dp[i][j] = 1 + dp[i-1][j-1]. Otherwise dp[i][j] = max(dp[i-1][j], dp[i][j-1]). Optimize to 1D array.',
        solution_code: `int longestCommonSubsequence(string text1, string text2) {\n    int m = text1.size(), n = text2.size();\n    vector<int> prev(n + 1, 0);\n    for (int i = 1; i <= m; i++) {\n        vector<int> curr(n + 1, 0);\n        for (int j = 1; j <= n; j++) {\n            if (text1[i - 1] == text2[j - 1]) curr[j] = 1 + prev[j - 1];\n            else curr[j] = max(prev[j], curr[j - 1]);\n        }\n        prev = curr;\n    }\n    return prev[n];\n}\n// Time: O(m * n)  Space: O(n)`,
        display_order: 0
      },
      {
        title: 'Longest common substring',
        slug: 'longest-common-substring',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/longest-common-substring1449/1',
        external_link: 'https://www.youtube.com/watch?v=_wP9mWN45nQ',
        description: 'Given two strings S1 and S2, find the length of the longest common substring (contiguous characters).',
        examples: 'Input: S1 = "ABCDGH", S2 = "ACDGHR"\nOutput: 4\nExplanation: "CDGH".',
        approach: 'If S1[i] == S2[j], dp[i][j] = 1 + dp[i-1][j-1]. If they do not match, dp[i][j] = 0 (since substring must be contiguous). Track global max.',
        solution_code: `int longestCommonSubstr(string S1, string S2, int n, int m) {\n    vector<int> prev(m + 1, 0);\n    int ans = 0;\n    for (int i = 1; i <= n; i++) {\n        vector<int> curr(m + 1, 0);\n        for (int j = 1; j <= m; j++) {\n            if (S1[i - 1] == S2[j - 1]) {\n                curr[j] = 1 + prev[j - 1];\n                ans = max(ans, curr[j]);\n            }\n        }\n        prev = curr;\n    }\n    return ans;\n}\n// Time: O(n * m)  Space: O(m)`,
        display_order: 1
      },
      {
        title: 'Longest palindromic subsequence',
        slug: 'longest-palindromic-subsequence',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/longest-palindromic-subsequence/',
        external_link: 'https://www.youtube.com/watch?v=6i_T5kkfv4A',
        description: 'Given a string s, find the longest palindromic subsequence length in s.',
        examples: 'Input: s = "bbbab"\nOutput: 4\nExplanation: "bbbb".',
        approach: 'LPS(s) is equivalent to LCS(s, reverse(s)). Reverse s and compute the longest common subsequence.',
        solution_code: `int longestPalindromeSubseq(string s) {\n    string t = s;\n    reverse(t.begin(), t.end());\n    int n = s.size();\n    vector<int> prev(n + 1, 0);\n    for (int i = 1; i <= n; i++) {\n        vector<int> curr(n + 1, 0);\n        for (int j = 1; j <= n; j++) {\n            if (s[i - 1] == t[j - 1]) curr[j] = 1 + prev[j - 1];\n            else curr[j] = max(prev[j], curr[j - 1]);\n        }\n        prev = curr;\n    }\n    return prev[n];\n}\n// Time: O(n^2)  Space: O(n)`,
        display_order: 2
      },
      {
        title: 'Minimum insertions to make string palindrome',
        slug: 'minimum-insertion-steps-to-make-a-string-palindrome',
        difficulty: 'hard',
        platform_url: 'https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/',
        external_link: 'https://www.youtube.com/watch?v=xPBLEj41rFU',
        description: 'Given a string s, return the minimum number of steps to make s palindrome by inserting characters.',
        examples: 'Input: s = "zzazz"\nOutput: 0\nInput: s = "mbadm"\nOutput: 2',
        approach: 'Keep the longest palindromic subsequence intact. The characters not part of LPS must be duplicated. Result = n - LPS(s).',
        solution_code: `int minInsertions(string s) {\n    string t = s;\n    reverse(t.begin(), t.end());\n    int n = s.size();\n    vector<int> prev(n + 1, 0);\n    for (int i = 1; i <= n; i++) {\n        vector<int> curr(n + 1, 0);\n        for (int j = 1; j <= n; j++) {\n            if (s[i - 1] == t[j - 1]) curr[j] = 1 + prev[j - 1];\n            else curr[j] = max(prev[j], curr[j - 1]);\n        }\n        prev = curr;\n    }\n    return n - prev[n];\n}\n// Time: O(n^2)  Space: O(n)`,
        display_order: 3
      },
      {
        title: 'Minimum insertions or deletions to convert string A to B',
        slug: 'delete-operation-for-two-strings',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/delete-operation-for-two-strings/',
        external_link: 'https://www.youtube.com/watch?v=yMnHDeET320',
        description: 'Find minimum number of deletions/insertions to convert string word1 to string word2.',
        examples: 'Input: word1 = "sea", word2 = "eat"\nOutput: 2\nExplanation: Delete \'s\' from "sea", insert \'t\' -> "eat".',
        approach: 'LCS characters are kept. Remaining in word1 are deleted (m - lcs). Missing from word2 are inserted (n - lcs). Total = m + n - 2*lcs.',
        solution_code: `int minDistance(string word1, string word2) {\n    int m = word1.size(), n = word2.size();\n    vector<int> prev(n + 1, 0);\n    for (int i = 1; i <= m; i++) {\n        vector<int> curr(n + 1, 0);\n        for (int j = 1; j <= n; j++) {\n            if (word1[i - 1] == word2[j - 1]) curr[j] = 1 + prev[j - 1];\n            else curr[j] = max(prev[j], curr[j - 1]);\n        }\n        prev = curr;\n    }\n    return m + n - 2 * prev[n];\n}\n// Time: O(m * n)  Space: O(n)`,
        display_order: 4
      },
      {
        title: 'Shortest common supersequence',
        slug: 'shortest-common-supersequence',
        difficulty: 'hard',
        platform_url: 'https://leetcode.com/problems/shortest-common-supersequence/',
        external_link: 'https://www.youtube.com/watch?v=xElxAuBVCsI',
        description: 'Given two strings str1 and str2, return the shortest string that has both str1 and str2 as subsequences.',
        examples: 'Input: str1 = "abac", str2 = "cab"\nOutput: "cabac"',
        approach: 'Build full LCS DP table. Backtrack from (m, n): if str1[i-1] == str2[j-1], add once and move diagonally; else take larger direction and add the skipped character.',
        solution_code: `string shortestCommonSupersequence(string str1, string str2) {\n    int m = str1.size(), n = str2.size();\n    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));\n    for (int i = 1; i <= m; i++) {\n        for (int j = 1; j <= n; j++) {\n            if (str1[i - 1] == str2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];\n            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);\n        }\n    }\n    int i = m, j = n;\n    string ans = "";\n    while (i > 0 && j > 0) {\n        if (str1[i - 1] == str2[j - 1]) { ans += str1[i - 1]; i--; j--; }\n        else if (dp[i - 1][j] > dp[i][j - 1]) { ans += str1[i - 1]; i--; }\n        else { ans += str2[j - 1]; j--; }\n    }\n    while (i > 0) { ans += str1[i - 1]; i--; }\n    while (j > 0) { ans += str2[j - 1]; j--; }\n    reverse(ans.begin(), ans.end());\n    return ans;\n}\n// Time: O(m * n)  Space: O(m * n)`,
        display_order: 5
      },
      {
        title: 'Distinct subsequences',
        slug: 'distinct-subsequences',
        difficulty: 'hard',
        platform_url: 'https://leetcode.com/problems/distinct-subsequences/',
        external_link: 'https://www.youtube.com/watch?v=nVG7eTiD2bY',
        description: 'Given two strings s and t, return the number of distinct subsequences of s which equals t.',
        examples: 'Input: s = "rabbbit", t = "rabbit"\nOutput: 3',
        approach: 'dp[j] = dp[j] + (s[i] == t[j] ? dp[j-1] : 0). Use a 1D array updated in reverse to handle 64-bit integer counts.',
        solution_code: `int numDistinct(string s, string t) {\n    int m = s.size(), n = t.size();\n    vector<double> dp(n + 1, 0);\n    dp[0] = 1;\n    for (int i = 1; i <= m; i++) {\n        for (int j = n; j >= 1; j--) {\n            if (s[i - 1] == t[j - 1]) dp[j] += dp[j - 1];\n        }\n    }\n    return (int)dp[n];\n}\n// Time: O(m * n)  Space: O(n)`,
        display_order: 6
      },
      {
        title: 'Edit distance',
        slug: 'edit-distance',
        difficulty: 'hard',
        platform_url: 'https://leetcode.com/problems/edit-distance/',
        external_link: 'https://www.youtube.com/watch?v=fJaKO8FbDdo',
        description: 'Given two strings word1 and word2, return the minimum operations (insert, delete, replace) required to convert word1 to word2.',
        examples: 'Input: word1 = "horse", word2 = "ros"\nOutput: 3\nExplanation: horse -> rorse -> rose -> ros.',
        approach: 'If word1[i-1] == word2[j-1], dp[i][j] = dp[i-1][j-1]. Else dp[i][j] = 1 + min({dp[i-1][j] (delete), dp[i][j-1] (insert), dp[i-1][j-1] (replace)}).',
        solution_code: `int minDistance(string word1, string word2) {\n    int m = word1.size(), n = word2.size();\n    vector<int> prev(n + 1);\n    iota(prev.begin(), prev.end(), 0);\n    for (int i = 1; i <= m; i++) {\n        vector<int> curr(n + 1);\n        curr[0] = i;\n        for (int j = 1; j <= n; j++) {\n            if (word1[i - 1] == word2[j - 1]) curr[j] = prev[j - 1];\n            else curr[j] = 1 + min({prev[j], curr[j - 1], prev[j - 1]});\n        }\n        prev = curr;\n    }\n    return prev[n];\n}\n// Time: O(m * n)  Space: O(n)`,
        display_order: 7
      },
      {
        title: 'Wildcard matching',
        slug: 'wildcard-matching',
        difficulty: 'hard',
        platform_url: 'https://leetcode.com/problems/wildcard-matching/',
        external_link: 'https://www.youtube.com/watch?v=ZmlQ3vgAOMo',
        description: 'Implement wildcard pattern matching with support for \'?\' (single char) and \'*\' (any sequence of chars including empty).',
        examples: 'Input: s = "aa", p = "*"\nOutput: true',
        approach: 'If p[j-1] == \'*\' dp[i][j] = dp[i-1][j] (match 1+ chars) || dp[i][j-1] (match 0 chars). If match or \'?\', dp[i][j] = dp[i-1][j-1].',
        solution_code: `bool isMatch(string s, string p) {\n    int m = s.size(), n = p.size();\n    vector<bool> prev(n + 1, false);\n    prev[0] = true;\n    for (int j = 1; j <= n && p[j - 1] == '*'; j++) prev[j] = true;\n    for (int i = 1; i <= m; i++) {\n        vector<bool> curr(n + 1, false);\n        for (int j = 1; j <= n; j++) {\n            if (p[j - 1] == '*') curr[j] = prev[j] || curr[j - 1];\n            else if (p[j - 1] == '?' || s[i - 1] == p[j - 1]) curr[j] = prev[j - 1];\n        }\n        prev = curr;\n    }\n    return prev[n];\n}\n// Time: O(m * n)  Space: O(n)`,
        display_order: 8
      },
      {
        title: 'Word Break',
        slug: 'word-break',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/word-break/',
        external_link: 'https://www.youtube.com/watch?v=2Naa33DOwLg',
        description: 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of dictionary words.',
        examples: 'Input: s = "leetcode", wordDict = ["leet","code"]\nOutput: true',
        approach: 'dp[i] represents if s[0..i-1] can be segmented. For each i, check all j < i: if dp[j] is true and s[j..i-1] is in wordSet, dp[i] = true.',
        solution_code: `bool wordBreak(string s, vector<string>& wordDict) {\n    unordered_set<string> dict(wordDict.begin(), wordDict.end());\n    int n = s.size();\n    vector<bool> dp(n + 1, false);\n    dp[0] = true;\n    for (int i = 1; i <= n; i++) {\n        for (int j = 0; j < i; j++) {\n            if (dp[j] && dict.count(s.substr(j, i - j))) {\n                dp[i] = true;\n                break;\n            }\n        }\n    }\n    return dp[n];\n}\n// Time: O(n^2)  Space: O(n)`,
        display_order: 9
      },
      {
        title: 'Count Palindromic Subsequences',
        slug: 'count-palindromic-subsequences',
        difficulty: 'hard',
        platform_url: 'https://practice.geeksforgeeks.org/problems/count-palindromic-subsequences/1',
        external_link: 'https://www.youtube.com/watch?v=vlbA8oBluTB',
        description: 'Given a string str of length N, count all distinct or total palindromic subsequences modulo 10^9+7.',
        examples: 'Input: str = "abcd"\nOutput: 4\nExplanation: "a", "b", "c", "d".',
        approach: 'If str[i] == str[j], dp[i][j] = 1 + dp[i+1][j] + dp[i][j-1]. If str[i] != str[j], dp[i][j] = dp[i+1][j] + dp[i][j-1] - dp[i+1][j-1].',
        solution_code: `long long int countPS(string str) {\n    int n = str.size();\n    long long int mod = 1e9 + 7;\n    vector<vector<long long int>> dp(n, vector<long long int>(n, 0));\n    for (int i = 0; i < n; i++) dp[i][i] = 1;\n    for (int len = 2; len <= n; len++) {\n        for (int i = 0; i <= n - len; i++) {\n            int j = i + len - 1;\n            if (str[i] == str[j]) dp[i][j] = (1 + dp[i + 1][j] + dp[i][j - 1]) % mod;\n            else dp[i][j] = (dp[i + 1][j] + dp[i][j - 1] - dp[i + 1][j - 1] + mod) % mod;\n        }\n    }\n    return dp[0][n - 1];\n}\n// Time: O(n^2)  Space: O(n^2)`,
        display_order: 10
      }
    ];
    for (const p of s8Problems) await insertProblem(sub8Id, p);

    // Subtopic 9: MCM DP (6 problems)
    const sub9Id = await insertSubtopic('MCM DP', 'mcm-dp', 8);
    const s9Problems = [
      {
        title: 'Matrix chain multiplication',
        slug: 'matrix-chain-multiplication',
        difficulty: 'hard',
        platform_url: 'https://practice.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1',
        external_link: 'https://www.youtube.com/watch?v=vRVfmbCFW7Y',
        description: 'Given an array p[] of dimensions, find the minimum number of multiplications needed to multiply the chain of matrices.',
        examples: 'Input: p[] = [40, 20, 30, 10, 30]\nOutput: 26000',
        approach: 'Partition at k between i and j: dp[i][j] = min(dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j]) for all k in [i, j-1].',
        solution_code: `int matrixMultiplication(int N, int arr[]) {\n    vector<vector<int>> dp(N, vector<int>(N, 0));\n    for (int len = 2; len < N; len++) {\n        for (int i = 1; i < N - len + 1; i++) {\n            int j = i + len - 1;\n            dp[i][j] = INT_MAX;\n            for (int k = i; k < j; k++) {\n                int cost = dp[i][k] + dp[k + 1][j] + arr[i - 1] * arr[k] * arr[j];\n                dp[i][j] = min(dp[i][j], cost);\n            }\n        }\n    }\n    return dp[1][N - 1];\n}\n// Time: O(N^3)  Space: O(N^2)`,
        display_order: 0
      },
      {
        title: 'Burst balloons',
        slug: 'burst-balloons',
        difficulty: 'hard',
        platform_url: 'https://leetcode.com/problems/burst-balloons/',
        external_link: 'https://www.youtube.com/watch?v=Yz4LlDSlkns',
        description: 'You are given n balloons, indexed from 0 to n - 1. Each balloon is painted with a number on it represented by an array nums. Burst all balloons to maximize coins.',
        examples: 'Input: nums = [3,1,5,8]\nOutput: 167',
        approach: 'Think inversely: choose balloon k to burst LAST in range (i, j). Coins = nums[i-1]*nums[k]*nums[j+1] + dp[i][k-1] + dp[k+1][j].',
        solution_code: `int maxCoins(vector<int>& nums) {\n    int n = nums.size();\n    vector<int> a(n + 2, 1);\n    for (int i = 0; i < n; i++) a[i + 1] = nums[i];\n    vector<vector<int>> dp(n + 2, vector<int>(n + 2, 0));\n    for (int len = 1; len <= n; len++) {\n        for (int i = 1; i <= n - len + 1; i++) {\n            int j = i + len - 1;\n            for (int k = i; k <= j; k++) {\n                int coins = a[i - 1] * a[k] * a[j + 1] + dp[i][k - 1] + dp[k + 1][j];\n                dp[i][j] = max(dp[i][j], coins);\n            }\n        }\n    }\n    return dp[1][n];\n}\n// Time: O(n^3)  Space: O(n^2)`,
        display_order: 1
      },
      {
        title: 'Palindrome partitioning II',
        slug: 'palindrome-partitioning-ii',
        difficulty: 'hard',
        platform_url: 'https://leetcode.com/problems/palindrome-partitioning-ii/',
        external_link: 'https://www.youtube.com/watch?v=_Hrr0b4nh80',
        description: 'Given a string s, partition s such that every substring of the partition is a palindrome. Return the minimum cuts needed.',
        examples: 'Input: s = "aab"\nOutput: 1\nExplanation: "aa" | "b".',
        approach: '1D MCM pattern: dp[i] is min cuts for s[i..n-1]. Try all j from i to n-1: if s[i..j] is a palindrome, dp[i] = min(dp[i], 1 + dp[j+1]).',
        solution_code: `int minCut(string s) {\n    int n = s.size();\n    vector<int> dp(n + 1, 0);\n    vector<vector<bool>> isPal(n, vector<bool>(n, false));\n    for (int i = n - 1; i >= 0; i--) {\n        for (int j = i; j < n; j++) {\n            if (s[i] == s[j] && (j - i <= 2 || isPal[i + 1][j - 1])) {\n                isPal[i][j] = true;\n            }\n        }\n    }\n    for (int i = n - 1; i >= 0; i--) {\n        int minCuts = INT_MAX;\n        for (int j = i; j < n; j++) {\n            if (isPal[i][j]) {\n                minCuts = min(minCuts, 1 + dp[j + 1]);\n            }\n        }\n        dp[i] = minCuts;\n    }\n    return dp[0] - 1;\n}\n// Time: O(n^2)  Space: O(n^2)`,
        display_order: 2
      },
      {
        title: 'Partition Array for Maximum Sum',
        slug: 'partition-array-for-maximum-sum',
        difficulty: 'hard',
        platform_url: 'https://leetcode.com/problems/partition-array-for-maximum-sum/',
        external_link: 'https://www.youtube.com/watch?v=PhWWJmaKfMc',
        description: 'Partition array into (contiguous) subarrays of length at most k. After partitioning, each subarray has their values changed to become maximum value of that subarray.',
        examples: 'Input: arr = [1,15,7,9,2,5,10], k = 3\nOutput: 84\nExplanation: [15,15,15,9,10,10,10].',
        approach: 'dp[i] = max(dp[i], maxVal * len + dp[i + len]) for len from 1 to k. Compute backwards from n-1 to 0.',
        solution_code: `int maxSumAfterPartitioning(vector<int>& arr, int k) {\n    int n = arr.size();\n    vector<int> dp(n + 1, 0);\n    for (int i = n - 1; i >= 0; i--) {\n        int curMax = 0, ans = 0;\n        for (int len = 1; len <= k && i + len <= n; len++) {\n            curMax = max(curMax, arr[i + len - 1]);\n            ans = max(ans, curMax * len + dp[i + len]);\n        }\n        dp[i] = ans;\n    }\n    return dp[0];\n}\n// Time: O(n * k)  Space: O(n)`,
        display_order: 3
      },
      {
        title: 'Minimum cost to cut the stick',
        slug: 'minimum-cost-to-cut-a-stick',
        difficulty: 'hard',
        platform_url: 'https://leetcode.com/problems/minimum-cost-to-cut-a-stick/',
        external_link: 'https://www.youtube.com/watch?v=xwomavsC86c',
        description: 'Given a wooden stick of length n and an array cuts, find minimum total cost of all cuts. The cost of one cut is length of stick being cut.',
        examples: 'Input: n = 7, cuts = [1,3,4,5]\nOutput: 16',
        approach: 'Sort cuts and add 0 and n to boundaries. dp[i][j] = (cuts[j] - cuts[i]) + min(dp[i][k] + dp[k][j]) for all cuts k strictly between i and j.',
        solution_code: `int minCost(int n, vector<int>& cuts) {\n    cuts.push_back(0);\n    cuts.push_back(n);\n    sort(cuts.begin(), cuts.end());\n    int c = cuts.size();\n    vector<vector<int>> dp(c, vector<int>(c, 0));\n    for (int len = 2; len < c; len++) {\n        for (int i = 0; i < c - len; i++) {\n            int j = i + len;\n            dp[i][j] = INT_MAX;\n            for (int k = i + 1; k < j; k++) {\n                dp[i][j] = min(dp[i][j], cuts[j] - cuts[i] + dp[i][k] + dp[k][j]);\n            }\n        }\n    }\n    return dp[0][c - 1];\n}\n// Time: O(c^3)  Space: O(c^2)`,
        display_order: 4
      },
      {
        title: 'Different ways to evaluate a boolean expression',
        slug: 'boolean-evaluation',
        difficulty: 'hard',
        platform_url: 'https://practice.geeksforgeeks.org/problems/boolean-parenthesization5611/1',
        external_link: 'https://www.youtube.com/watch?v=MM7fXjsRKA4',
        description: 'Given a boolean expression with operators (&, |, ^) and operands (T, F), find the number of ways to parenthesize the expression so that it evaluates to true.',
        examples: 'Input: S = "T|T&F^T"\nOutput: 4\nExplanation: 4 ways to place parentheses to evaluate to true.',
        approach: 'Partition at each boolean operator k between i and j. Compute both trueWays and falseWays from left and right sub-expressions, then combine based on operator type.',
        solution_code: `int countWays(int N, string S) {\n    int mod = 1003;\n    vector<vector<vector<long long>>> dp(N, vector<vector<long long>>(N, vector<long long>(2, 0)));\n    for (int i = 0; i < N; i += 2) {\n        dp[i][i][1] = (S[i] == 'T');\n        dp[i][i][0] = (S[i] == 'F');\n    }\n    for (int len = 3; len <= N; len += 2) {\n        for (int i = 0; i <= N - len; i += 2) {\n            int j = i + len - 1;\n            for (int k = i + 1; k < j; k += 2) {\n                long long lT = dp[i][k - 1][1], lF = dp[i][k - 1][0];\n                long long rT = dp[k + 1][j][1], rF = dp[k + 1][j][0];\n                if (S[k] == '&') {\n                    dp[i][j][1] = (dp[i][j][1] + lT * rT) % mod;\n                    dp[i][j][0] = (dp[i][j][0] + lF * rT + lT * rF + lF * rF) % mod;\n                } else if (S[k] == '|') {\n                    dp[i][j][1] = (dp[i][j][1] + lT * rT + lF * rT + lT * rF) % mod;\n                    dp[i][j][0] = (dp[i][j][0] + lF * rF) % mod;\n                } else if (S[k] == '^') {\n                    dp[i][j][1] = (dp[i][j][1] + lT * rF + lF * rT) % mod;\n                    dp[i][j][0] = (dp[i][j][0] + lT * rT + lF * rF) % mod;\n                }\n            }\n        }\n    }\n    return dp[0][N - 1][1];\n}\n// Time: O(N^3)  Space: O(N^2)`,
        display_order: 5
      }
    ];
    for (const p of s9Problems) await insertProblem(sub9Id, p);

    console.log('Part 3 Completed: 17 problems inserted/updated across Subtopics 8 and 9!');
    process.exit(0);
  } catch (err) {
    console.error('Error in seedDPPart3:', err);
    process.exit(1);
  }
}

seedDPPart3();
