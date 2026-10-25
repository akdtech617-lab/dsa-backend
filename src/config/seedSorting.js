const { pool } = require('./db');

async function seedSorting() {
  const client = await pool.connect();
  try {
    console.log('Seeding "Learn Important Sorting Techniques" topic...');

    const courseRes = await client.query(`SELECT id FROM courses WHERE slug = 'dsa'`);
    if (courseRes.rows.length === 0) {
      throw new Error('DSA course not found — run the main seed first.');
    }
    const dsaCourseId = courseRes.rows[0].id;

    const topicRes = await client.query(
      `INSERT INTO topics (course_id, title, slug, description, display_order)
       VALUES ($1, 'Learn Important Sorting Techniques', 'learn-sorting-techniques',
         'The core sorting algorithms every DSA roadmap builds on.', 1)
       ON CONFLICT (course_id, slug) DO UPDATE SET title = EXCLUDED.title
       RETURNING id`,
      [dsaCourseId]
    );
    const topicId = topicRes.rows[0].id;

    const sortingPart1Video = 'https://www.youtube.com/watch?v=HGk_ypEuS24';
    const mergeSortVideo = 'https://www.youtube.com/watch?v=ogjf7ORKfd8';
    const quickSortVideo = 'https://www.youtube.com/watch?v=WIrA4YexLRQ';

    const sub1Res = await client.query(
      `INSERT INTO subtopics (topic_id, title, slug, description, display_order)
       VALUES ($1, 'Sorting-I', 'sorting-i', 'The three fundamental O(n²) sorting algorithms.', 0)
       ON CONFLICT (topic_id, slug) DO UPDATE SET title = EXCLUDED.title
       RETURNING id`,
      [topicId]
    );
    const sub1Id = sub1Res.rows[0].id;

    const sorting1Problems = [
      { title: 'Selection Sort', slug: 'selection-sort', difficulty: 'easy',
        description: 'Repeatedly find the minimum element from the unsorted portion of the array and swap it into place, growing the sorted portion one element at a time.',
        examples: 'Input: [5, 3, 8, 1]\nPass 1: [1, 3, 8, 5]\nPass 2: [1, 3, 8, 5]\nPass 3: [1, 3, 5, 8]',
        approach: 'For each position i from the start to the second-to-last element, scan the remaining unsorted portion to find the index of the smallest value, then swap it into position i.',
        solution_code: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        swap(arr[i], arr[minIdx]);
    }
}
// Time: O(n^2)  Space: O(1)`, video_url: sortingPart1Video },
      { title: 'Bubble Sort', slug: 'bubble-sort', difficulty: 'easy',
        description: "Repeatedly compare adjacent elements and swap them if they're in the wrong order — after each full pass, the largest remaining element \"bubbles up\" to its correct position at the end.",
        examples: 'Input: [5, 1, 4, 2]\nAfter pass 1: [1, 4, 2, 5]\nAfter pass 2: [1, 2, 4, 5]',
        approach: 'Loop through the array comparing each adjacent pair, swapping when out of order. Stop early if a pass makes no swaps.',
        solution_code: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}
// Time: O(n^2)  Space: O(1)`, video_url: sortingPart1Video },
      { title: 'Insertion Sorting', slug: 'insertion-sorting', difficulty: 'easy',
        description: "Build the sorted array one element at a time, taking each new element and inserting it into its correct position among the elements already sorted before it.",
        examples: 'Input: [5, 2, 4, 1]\nInsert 2: [2, 5, 4, 1]\nInsert 4: [2, 4, 5, 1]\nInsert 1: [1, 2, 4, 5]',
        approach: 'Starting from the second element, compare it against the elements before it, shifting any larger elements one position to the right, until you find the correct spot.',
        solution_code: `void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}
// Time: O(n^2)  Space: O(1)`, video_url: sortingPart1Video }
    ];

    for (let i = 0; i < sorting1Problems.length; i++) {
      const p = sorting1Problems[i];
      await client.query(
        `INSERT INTO problems
           (subtopic_id, title, slug, description, category, difficulty, examples, approach, solution_code, external_link, display_order)
         VALUES ($1, $2, $3, $4, 'interview', $5, $6, $7, $8, $9, $10)
         ON CONFLICT (subtopic_id, slug) DO NOTHING`,
        [sub1Id, p.title, p.slug, p.description, p.difficulty, p.examples, p.approach, p.solution_code, p.video_url, i + 1]
      );
    }

    const sub2Res = await client.query(
      `INSERT INTO subtopics (topic_id, title, slug, description, display_order)
       VALUES ($1, 'Sorting-II', 'sorting-ii', 'Recursive sorting approaches, plus the two most important O(n log n) algorithms.', 1)
       ON CONFLICT (topic_id, slug) DO UPDATE SET title = EXCLUDED.title
       RETURNING id`,
      [topicId]
    );
    const sub2Id = sub2Res.rows[0].id;

    const sorting2Problems = [
      { title: 'Merge Sorting', slug: 'merge-sorting', difficulty: 'medium',
        description: 'A divide-and-conquer sorting algorithm that splits the array in half, recursively sorts each half, then merges the two sorted halves back together in order.',
        examples: 'Input: [5, 3, 8, 1]\nSplit: [5, 3] and [8, 1]\nSorted halves: [3, 5] and [1, 8]\nMerged: [1, 3, 5, 8]',
        approach: 'Recursively divide the array in half until each piece has a single element. Then repeatedly merge pairs of sorted pieces back together.',
        solution_code: `void merge(vector<int>& arr, int low, int mid, int high) {
    vector<int> temp;
    int left = low, right = mid + 1;
    while (left <= mid && right <= high) {
        if (arr[left] <= arr[right]) temp.push_back(arr[left++]);
        else temp.push_back(arr[right++]);
    }
    while (left <= mid) temp.push_back(arr[left++]);
    while (right <= high) temp.push_back(arr[right++]);
    for (int i = low; i <= high; i++) arr[i] = temp[i - low];
}

void mergeSort(vector<int>& arr, int low, int high) {
    if (low >= high) return;
    int mid = (low + high) / 2;
    mergeSort(arr, low, mid);
    mergeSort(arr, mid + 1, high);
    merge(arr, low, mid, high);
}
// Time: O(n log n)  Space: O(n)`, video_url: mergeSortVideo },
      { title: 'Recursive Bubble Sort', slug: 'recursive-bubble-sort', difficulty: 'easy',
        description: 'The same bubble sort logic, expressed recursively instead of with nested loops.',
        examples: 'Same result as regular bubble sort — this only changes how the passes are structured.',
        approach: 'Base case: if there is only 1 element left, the array is sorted. Otherwise, perform one bubble pass, then recursively call the function on the first n-1 elements.',
        solution_code: `void recursiveBubbleSort(vector<int>& arr, int n) {
    if (n == 1) return;
    for (int i = 0; i < n - 1; i++) {
        if (arr[i] > arr[i + 1]) swap(arr[i], arr[i + 1]);
    }
    recursiveBubbleSort(arr, n - 1);
}
// Time: O(n^2)  Space: O(n) due to recursion stack`, video_url: null },
      { title: 'Recursive Insertion Sort', slug: 'recursive-insertion-sort', difficulty: 'easy',
        description: 'The same insertion sort logic expressed recursively.',
        examples: 'Same result as regular insertion sort — this only changes how the sort is structured.',
        approach: 'Base case: if n is 1 or less, trivially sorted. Otherwise, recursively sort the first n-1 elements first, then insert the last element into its correct position.',
        solution_code: `void recursiveInsertionSort(vector<int>& arr, int n) {
    if (n <= 1) return;
    recursiveInsertionSort(arr, n - 1);

    int last = arr[n - 1];
    int j = n - 2;
    while (j >= 0 && arr[j] > last) {
        arr[j + 1] = arr[j];
        j--;
    }
    arr[j + 1] = last;
}
// Time: O(n^2)  Space: O(n) due to recursion stack`, video_url: null },
      { title: 'Quick Sorting', slug: 'quick-sorting', difficulty: 'easy',
        description: 'A divide-and-conquer algorithm that picks a "pivot" element, partitions the array around it, then recursively sorts each side.',
        examples: 'Input: [5, 3, 8, 1], pivot = 1 (last element)\nAfter partitioning around 1: [1, 5, 3, 8]',
        approach: "Choose a pivot. Rearrange the array so every element smaller than the pivot comes before it and every larger element comes after, placing the pivot in its final sorted position. Recurse on each side.",
        solution_code: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pivotIndex = partition(arr, low, high);
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
}
// Average Time: O(n log n)  Worst case: O(n^2)  Space: O(log n)`, video_url: quickSortVideo }
    ];

    for (let i = 0; i < sorting2Problems.length; i++) {
      const p = sorting2Problems[i];
      await client.query(
        `INSERT INTO problems
           (subtopic_id, title, slug, description, category, difficulty, examples, approach, solution_code, external_link, display_order)
         VALUES ($1, $2, $3, $4, 'interview', $5, $6, $7, $8, $9, $10)
         ON CONFLICT (subtopic_id, slug) DO NOTHING`,
        [sub2Id, p.title, p.slug, p.description, p.difficulty, p.examples, p.approach, p.solution_code, p.video_url, i + 1]
      );
    }

    console.log(`✅ Seeded Sorting-I (${sorting1Problems.length}) and Sorting-II (${sorting2Problems.length})`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
  }
}

seedSorting();
