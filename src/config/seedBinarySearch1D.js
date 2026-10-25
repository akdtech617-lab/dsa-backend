const { pool } = require('./db');

async function seedBinarySearch1D() {
  const client = await pool.connect();
  try {
    console.log('Seeding "Binary Search" topic and "BS on 1D Arrays" subtopic...');

    const courseRes = await client.query(`SELECT id FROM courses WHERE slug = 'dsa'`);
    if (courseRes.rows.length === 0) throw new Error('DSA course not found — run the main seed first.');
    const dsaCourseId = courseRes.rows[0].id;

    const topicRes = await client.query(
      `INSERT INTO topics (course_id, title, slug, description, display_order)
       VALUES ($1, 'Binary Search [1D, 2D Arrays, Search Space]', 'binary-search',
         'Master the halving-the-search-space pattern across arrays, matrices, and answer spaces.', 3)
       ON CONFLICT (course_id, slug) DO UPDATE SET title = EXCLUDED.title
       RETURNING id`,
      [dsaCourseId]
    );
    const topicId = topicRes.rows[0].id;

    const subRes = await client.query(
      `INSERT INTO subtopics (topic_id, title, slug, description, display_order)
       VALUES ($1, 'BS on 1D Arrays', 'bs-1d-arrays', 'Binary search fundamentals on plain sorted and rotated arrays.', 0)
       ON CONFLICT (topic_id, slug) DO UPDATE SET title = EXCLUDED.title
       RETURNING id`,
      [topicId]
    );
    const subId = subRes.rows[0].id;

    const bs1 = 'https://www.youtube.com/watch?v=MHf6awe89xw';
    const bs2 = 'https://www.youtube.com/watch?v=6zhGS79oQ4k';
    const bs3 = 'https://www.youtube.com/watch?v=hjR1IYVx9lY';
    const bs4 = 'https://www.youtube.com/watch?v=5qGrJbHhqFs';
    const bs5 = 'https://www.youtube.com/watch?v=w2G2W8l__pc';
    const bs6 = 'https://www.youtube.com/watch?v=nhEMDKMB44g';
    const bs7 = 'https://www.youtube.com/watch?v=jtSiWTPLwd0';
    const bs8 = 'https://www.youtube.com/watch?v=AZOmHuHadxQ';
    const bs9 = 'https://www.youtube.com/watch?v=cXxmbemS6XM';

    const problems = [
      { title: 'Search X in sorted array', slug: 'search-x-sorted-array', difficulty: 'easy',
        description: 'Given a sorted array and a target value X, find its index using binary search. Return -1 if not found.',
        examples: 'Input: [1, 3, 5, 7, 9], target = 7\nOutput: 3',
        approach: 'Keep low and high pointers. Check the middle element and narrow toward the target each time.',
        solution_code: `int searchX(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}
// Time: O(log n)  Space: O(1)`, video_url: bs1, platform_url: 'https://leetcode.com/problems/binary-search/' },
      { title: 'Lower Bound', slug: 'lower-bound', difficulty: 'easy',
        description: 'Find the index of the first element in a sorted array that is greater than or equal to a given value.',
        examples: 'Input: [1, 2, 2, 3, 5], target = 2\nOutput: 1',
        approach: 'Binary search for the leftmost position where arr[mid] >= target.',
        solution_code: `int lowerBound(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1, ans = arr.size();
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] >= target) { ans = mid; high = mid - 1; }
        else low = mid + 1;
    }
    return ans;
}
// Time: O(log n)  Space: O(1)`, video_url: bs2, platform_url: null },
      { title: 'Upper Bound', slug: 'upper-bound', difficulty: 'easy',
        description: 'Find the index of the first element in a sorted array that is strictly greater than a given value.',
        examples: 'Input: [1, 2, 2, 3, 5], target = 2\nOutput: 3',
        approach: 'Same as Lower Bound but condition changes to strictly >.',
        solution_code: `int upperBound(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1, ans = arr.size();
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] > target) { ans = mid; high = mid - 1; }
        else low = mid + 1;
    }
    return ans;
}
// Time: O(log n)  Space: O(1)`, video_url: bs2, platform_url: null },
      { title: 'Search insert position', slug: 'search-insert-position', difficulty: 'easy',
        description: 'Given a sorted array and a target value, return the index where the target is found, or where it would be inserted.',
        examples: 'Input: [1, 3, 5, 6], target = 5\nOutput: 2\n\nInput: [1, 3, 5, 6], target = 2\nOutput: 1',
        approach: "This is exactly the Lower Bound problem.",
        solution_code: `int searchInsert(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1, ans = arr.size();
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] >= target) { ans = mid; high = mid - 1; }
        else low = mid + 1;
    }
    return ans;
}
// Time: O(log n)  Space: O(1)`, video_url: bs2, platform_url: 'https://leetcode.com/problems/search-insert-position/' },
      { title: 'Floor and Ceil in Sorted Array', slug: 'floor-ceil-sorted-array', difficulty: 'easy',
        description: 'Given a sorted array and a target value, find the floor (largest element <= target) and ceil (smallest element >= target).',
        examples: 'Input: [1, 2, 8, 10, 11, 12], target = 5\nOutput: floor = 2, ceil = 8',
        approach: 'Ceil is the Lower Bound value. Floor uses a similar search tracking the rightmost <= target.',
        solution_code: `pair<int,int> getFloorCeil(vector<int>& arr, int target) {
    int low, high, floor = -1, ceil = -1;

    low = 0; high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] <= target) { floor = arr[mid]; low = mid + 1; }
        else high = mid - 1;
    }

    low = 0; high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] >= target) { ceil = arr[mid]; high = mid - 1; }
        else low = mid + 1;
    }

    return {floor, ceil};
}
// Time: O(log n)  Space: O(1)`, video_url: bs2, platform_url: null },
      { title: 'First and last occurrence', slug: 'first-last-occurrence', difficulty: 'easy',
        description: 'Given a sorted array with possible duplicates, find the first and last index at which a given target value appears.',
        examples: 'Input: [5, 7, 7, 8, 8, 10], target = 8\nOutput: first = 3, last = 4',
        approach: 'Two binary searches: one biased left after a match, one biased right after a match.',
        solution_code: `int findFirst(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1, first = -1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) { first = mid; high = mid - 1; }
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return first;
}

int findLast(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1, last = -1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) { last = mid; low = mid + 1; }
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return last;
}
// Time: O(log n) each  Space: O(1)`, video_url: bs3, platform_url: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/' },
      { title: 'Count Occurrences in a Sorted Array', slug: 'count-occurrences-sorted-array', difficulty: 'easy',
        description: 'Given a sorted array, count how many times a target value appears.',
        examples: 'Input: [5, 7, 7, 8, 8, 8, 10], target = 8\nOutput: 3',
        approach: 'Find first and last occurrence; count is (last - first + 1).',
        solution_code: `int countOccurrences(vector<int>& arr, int target) {
    int first = findFirst(arr, target);
    if (first == -1) return 0;
    int last = findLast(arr, target);
    return last - first + 1;
}
// Time: O(log n)  Space: O(1)`, video_url: bs3, platform_url: null },
      { title: 'Search in rotated sorted array-I', slug: 'search-rotated-sorted-array-1', difficulty: 'medium',
        description: 'Given a sorted array that has been rotated at an unknown pivot, and containing no duplicates, search for a target value.',
        examples: 'Input: [4, 5, 6, 7, 0, 1, 2], target = 0\nOutput: 4',
        approach: "At least one half is always sorted; check which and whether target falls within its range.",
        solution_code: `int searchRotated(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;

        if (arr[low] <= arr[mid]) {
            if (arr[low] <= target && target < arr[mid]) high = mid - 1;
            else low = mid + 1;
        } else {
            if (arr[mid] < target && target <= arr[high]) low = mid + 1;
            else high = mid - 1;
        }
    }
    return -1;
}
// Time: O(log n)  Space: O(1)`, video_url: bs4, platform_url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
      { title: 'Search in rotated sorted array-II', slug: 'search-rotated-sorted-array-2', difficulty: 'medium',
        description: 'The same problem as above, but the rotated array may now contain duplicate values.',
        examples: 'Input: [2, 5, 6, 0, 0, 1, 2], target = 0\nOutput: true',
        approach: "Handle the ambiguous case when arr[low] == arr[mid] == arr[high] by shrinking from both ends.",
        solution_code: `bool searchRotatedWithDuplicates(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return true;

        if (arr[low] == arr[mid] && arr[mid] == arr[high]) {
            low++; high--;
            continue;
        }

        if (arr[low] <= arr[mid]) {
            if (arr[low] <= target && target < arr[mid]) high = mid - 1;
            else low = mid + 1;
        } else {
            if (arr[mid] < target && target <= arr[high]) low = mid + 1;
            else high = mid - 1;
        }
    }
    return false;
}
// Time: O(log n) average, O(n) worst case  Space: O(1)`, video_url: bs5, platform_url: 'https://leetcode.com/problems/search-in-rotated-sorted-array-ii/' },
      { title: 'Find minimum in Rotated Sorted Array', slug: 'find-minimum-rotated-sorted-array', difficulty: 'easy',
        description: 'Given a rotated sorted array with no duplicates, find the minimum element.',
        examples: 'Input: [4, 5, 6, 7, 0, 1, 2]\nOutput: 0',
        approach: 'Check which half is sorted; the minimum lies in the unsorted half.',
        solution_code: `int findMin(vector<int>& arr) {
    int low = 0, high = arr.size() - 1, ans = INT_MAX;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[low] <= arr[mid]) {
            ans = min(ans, arr[low]);
            low = mid + 1;
        } else {
            ans = min(ans, arr[mid]);
            high = mid - 1;
        }
    }
    return ans;
}
// Time: O(log n)  Space: O(1)`, video_url: bs6, platform_url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
      { title: 'Find out how many times the array is rotated', slug: 'find-rotation-count', difficulty: 'easy',
        description: 'Given a rotated sorted array, find how many times it has been rotated.',
        examples: 'Input: [4, 5, 6, 7, 0, 1, 2]\nOutput: 4',
        approach: 'Same as finding the minimum, but return its INDEX instead of value.',
        solution_code: `int findRotationCount(vector<int>& arr) {
    int low = 0, high = arr.size() - 1;
    int minVal = INT_MAX, minIdx = 0;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[low] <= arr[mid]) {
            if (arr[low] < minVal) { minVal = arr[low]; minIdx = low; }
            low = mid + 1;
        } else {
            if (arr[mid] < minVal) { minVal = arr[mid]; minIdx = mid; }
            high = mid - 1;
        }
    }
    return minIdx;
}
// Time: O(log n)  Space: O(1)`, video_url: bs7, platform_url: null },
      { title: 'Single element in a Sorted Array', slug: 'single-element-sorted-array', difficulty: 'medium',
        description: 'Given a sorted array where every element appears exactly twice except for one element that appears once, find that single element.',
        examples: 'Input: [1, 1, 2, 3, 3, 4, 4, 8, 8]\nOutput: 2',
        approach: "Binary search on even/odd index pairing that shifts after the single element.",
        solution_code: `int singleNonDuplicate(vector<int>& arr) {
    int low = 0, high = arr.size() - 2;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        mid -= (mid % 2);
        if (arr[mid] == arr[mid + 1]) low = mid + 2;
        else high = mid - 1;
    }
    return arr[low];
}
// Time: O(log n)  Space: O(1)`, video_url: bs8, platform_url: 'https://leetcode.com/problems/single-element-in-a-sorted-array/' },
      { title: 'Find peak element', slug: 'find-peak-element', difficulty: 'medium',
        description: 'Find any "peak" element in an array — one that is strictly greater than both of its neighbors.',
        examples: 'Input: [1, 2, 3, 1]\nOutput: index 2 (value 3)',
        approach: 'Move toward the side with the larger neighbor — a peak always exists there.',
        solution_code: `int findPeakElement(vector<int>& arr) {
    int low = 0, high = arr.size() - 1;
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] < arr[mid + 1]) low = mid + 1;
        else high = mid;
    }
    return low;
}
// Time: O(log n)  Space: O(1)`, video_url: bs9, platform_url: 'https://leetcode.com/problems/find-peak-element/' }
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

    console.log(`✅ Seeded ${problems.length} problems under "BS on 1D Arrays"`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
  }
}

seedBinarySearch1D();
