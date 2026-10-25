// One-off content seed: "Binary Search" -> "BS on 2D Arrays" subtopic -> 5 problems.
// Safe to re-run: uses ON CONFLICT DO NOTHING.
const { pool } = require('./db');

async function seedBinarySearch2D() {
  const client = await pool.connect();
  try {
    console.log('Seeding "BS on 2D Arrays" subtopic...');

    const topicRes = await client.query(`SELECT id FROM topics WHERE slug = 'binary-search'`);
    if (topicRes.rows.length === 0) {
      throw new Error('"Binary Search" topic not found — run seed:binary-search first.');
    }
    const topicId = topicRes.rows[0].id;

    const subRes = await client.query(
      `INSERT INTO subtopics (topic_id, title, slug, description, display_order)
       VALUES ($1, $2, 'bs-2d-arrays', 'Extending binary search to matrices — rows, columns, and both at once.', 1)
       ON CONFLICT (topic_id, slug) DO UPDATE SET title = EXCLUDED.title
       RETURNING id`,
      [topicId, "BS on 2D Array's"]
    );
    const subId = subRes.rows[0].id;

    // Confirmed real Striver videos (BS-23, BS-24, BS-25, Matrix Median lecture)
    const maxOnesRowVideo = 'https://www.youtube.com/watch?v=SCz-1TtYxDI';
    const search2DVideo = 'https://www.youtube.com/watch?v=JXU4Akft7yk';
    const search2DIIVideo = 'https://www.youtube.com/watch?v=9ZbB397jU4k';
    const matrixMedianVideo = 'https://www.youtube.com/watch?v=63fPPOdIr2c';
    // Real video covering this exact problem, but could not confirm it's specifically
    // from Striver/Take U Forward's own channel — flagged for the user to double check.
    const peakElement2DVideo = 'https://www.youtube.com/watch?v=03cTQaVgzPs';

    const problems = [
      {
        title: "Find row with maximum 1's",
        slug: 'find-row-max-ones',
        difficulty: 'easy',
        description: 'Given a binary matrix where each row is sorted (all 0s before all 1s), find the row that contains the maximum number of 1s.',
        examples: 'Input: [[0,0,1,1], [0,1,1,1], [0,0,0,1]]\nOutput: row 1 (has three 1s)',
        approach: "Since each row is sorted, use binary search per row to find the first index where a 1 appears — the count of 1s in that row is (rowLength - firstOneIndex). Track the row with the maximum count across all rows.",
        solution_code: `int lowerBoundOne(vector<int>& row) {
    int low = 0, high = row.size() - 1, ans = row.size();
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (row[mid] == 1) { ans = mid; high = mid - 1; }
        else low = mid + 1;
    }
    return ans;
}

int rowWithMaxOnes(vector<vector<int>>& matrix) {
    int maxCount = 0, rowIndex = -1;
    for (int i = 0; i < matrix.size(); i++) {
        int firstOne = lowerBoundOne(matrix[i]);
        int count = matrix[i].size() - firstOne;
        if (count > maxCount) { maxCount = count; rowIndex = i; }
    }
    return rowIndex;
}
// Time: O(rows * log(cols))  Space: O(1)`,
        video_url: maxOnesRowVideo,
        platform_url: 'https://www.geeksforgeeks.org/problems/row-with-max-1s0023/1'
      },
      {
        title: 'Search in a 2D Matrix',
        slug: 'search-2d-matrix',
        difficulty: 'medium',
        description: 'Given an m x n matrix where each row is sorted left to right, and the first element of each row is greater than the last element of the previous row, search for a target value.',
        examples: 'Input: [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3\nOutput: true',
        approach: 'Because of how the matrix is structured, it behaves exactly like one long sorted 1D array. Treat the index as a single number from 0 to (rows*cols - 1), convert it to (row, col) using division and modulo, and run standard binary search.',
        solution_code: `bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int n = matrix.size(), m = matrix[0].size();
    int low = 0, high = n * m - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        int row = mid / m, col = mid % m;
        if (matrix[row][col] == target) return true;
        else if (matrix[row][col] < target) low = mid + 1;
        else high = mid - 1;
    }
    return false;
}
// Time: O(log(rows * cols))  Space: O(1)`,
        video_url: search2DVideo,
        platform_url: 'https://leetcode.com/problems/search-a-2d-matrix/'
      },
      {
        title: 'Search in 2D matrix - II',
        slug: 'search-2d-matrix-2',
        difficulty: 'medium',
        description: 'Given a matrix where every row is sorted left to right and every column is sorted top to bottom (but rows are NOT necessarily continuous from one to the next), search for a target value.',
        examples: 'Input: [[1,4,7,11],[2,5,8,12],[3,6,9,16]], target = 5\nOutput: true',
        approach: 'Start at the top-right corner. If the current value equals the target, done. If it\'s larger than the target, move left (eliminating that column). If it\'s smaller, move down (eliminating that row). This "staircase" traversal covers the whole matrix in linear time.',
        solution_code: `bool searchMatrixII(vector<vector<int>>& matrix, int target) {
    int row = 0, col = matrix[0].size() - 1;
    while (row < matrix.size() && col >= 0) {
        if (matrix[row][col] == target) return true;
        else if (matrix[row][col] > target) col--;
        else row++;
    }
    return false;
}
// Time: O(rows + cols)  Space: O(1)`,
        video_url: search2DIIVideo,
        platform_url: 'https://leetcode.com/problems/search-a-2d-matrix-ii/'
      },
      {
        title: 'Find Peak Element - II',
        slug: 'find-peak-element-2d',
        difficulty: 'medium',
        description: 'Given a 2D matrix, find a "peak" element — one that is greater than or equal to all four of its direct neighbors (up, down, left, right). Out-of-bounds neighbors count as -infinity.',
        examples: 'Input: [[10,20,15],[21,30,14],[7,16,32]]\nOutput: (1,1) with value 30, or (2,2) with value 32 — either is valid',
        approach: 'Binary search on columns. For the middle column, find the row with the maximum value in that column. Compare that value to its left and right neighbors — if it beats both, it is a peak; otherwise, move the search toward whichever neighboring column is larger.',
        solution_code: `int findMaxInColumn(vector<vector<int>>& mat, int col) {
    int maxRow = 0;
    for (int i = 0; i < mat.size(); i++) {
        if (mat[i][col] > mat[maxRow][col]) maxRow = i;
    }
    return maxRow;
}

pair<int,int> findPeakGrid(vector<vector<int>>& mat) {
    int low = 0, high = mat[0].size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        int maxRow = findMaxInColumn(mat, mid);

        int left = (mid - 1 >= 0) ? mat[maxRow][mid - 1] : -1;
        int right = (mid + 1 < mat[0].size()) ? mat[maxRow][mid + 1] : -1;

        if (mat[maxRow][mid] > left && mat[maxRow][mid] > right) return {maxRow, mid};
        else if (left > mat[maxRow][mid]) high = mid - 1;
        else low = mid + 1;
    }
    return {-1, -1};
}
// Time: O(rows * log(cols))  Space: O(1)`,
        video_url: peakElement2DVideo,
        platform_url: 'https://leetcode.com/problems/find-a-peak-element-ii/'
      },
      {
        title: 'Matrix Median',
        slug: 'matrix-median',
        difficulty: 'medium',
        description: 'Given a matrix where every row is individually sorted, and the matrix has an odd total number of elements, find the median value.',
        examples: 'Input: [[1,3,5],[2,6,9],[3,6,9]]\nOutput: 5',
        approach: 'Binary search on the VALUE range (from the smallest to largest possible matrix value), not on indices. For a candidate value, count how many elements in the matrix are <= it (using binary search per row, since rows are sorted). The smallest value where this count reaches at least (total elements / 2 + 1) is the median.',
        solution_code: `int countLessEqual(vector<int>& row, int x) {
    int low = 0, high = row.size() - 1, count = row.size();
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (row[mid] <= x) low = mid + 1;
        else { count = mid; high = mid - 1; }
    }
    return count;
}

int matrixMedian(vector<vector<int>>& matrix) {
    int low = INT_MAX, high = INT_MIN;
    int n = matrix.size(), m = matrix[0].size();
    for (auto& row : matrix) {
        low = min(low, row[0]);
        high = max(high, row[m - 1]);
    }

    int desired = (n * m) / 2;
    while (low < high) {
        int mid = low + (high - low) / 2;
        int count = 0;
        for (auto& row : matrix) count += countLessEqual(row, mid);
        if (count <= desired) low = mid + 1;
        else high = mid;
    }
    return low;
}
// Time: O(rows * log(cols) * log(valueRange))  Space: O(1)`,
        video_url: matrixMedianVideo,
        platform_url: 'https://www.geeksforgeeks.org/problems/median-in-a-row-wise-sorted-matrix1527/1'
      }
    ];

    for (let i = 0; i < problems.length; i++) {
      const p = problems[i];
      await client.query(
        `INSERT INTO problems
           (subtopic_id, title, slug, description, category, difficulty, examples, approach, solution_code, external_link, platform_url, display_order)
         VALUES ($1, $2, $3, $4, 'interview', $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (subtopic_id, slug) DO NOTHING`,
        [subId, p.title, p.slug, p.description, p.difficulty, p.examples, p.approach, p.solution_code, p.video_url, p.platform_url, i + 1]
      );
    }

    console.log(`✅ Seeded ${problems.length} problems under "BS on 2D Array's"`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
  }
}

seedBinarySearch2D();
