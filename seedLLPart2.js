require('dotenv').config();
const db = require('./src/config/db');

async function seedLLPart2() {
  try {
    console.log('Seeding Linked-List Part 2...');
    const courseId = 'd2284cdb-751f-40f0-b7f2-c9ca6c277efe';

    const topicQuery = await db.query(
      `SELECT id FROM topics WHERE slug IN ('linked-lists', 'linked-list') AND course_id = $1 LIMIT 1;`,
      [courseId]
    );

    if (topicQuery.rows.length === 0) {
      throw new Error('Topic "linked-lists" not found. Run Part 1 first!');
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

    // Subtopic 3: Logic Building (5 problems)
    const sub3Id = await insertSubtopic('Logic Building', 'logic-building', 2);
    const s3Problems = [
      {
        title: 'Add two numbers in Linked List',
        slug: 'add-two-numbers',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/add-two-numbers/',
        external_link: 'https://www.youtube.com/watch?v=XmRrGzR6UdE',
        description: 'Add two numbers represented by linked lists with digits stored in reverse order.',
        examples: 'Input: l1 = [2,4,3], l2 = [5,6,4]\nOutput: [7,0,8]\nExplanation: 342 + 465 = 807.',
        approach: 'Iterate through both lists simultaneously maintaining a carry. Sum digit values plus carry, create a new node with sum % 10, and update carry = sum / 10.',
        solution_code: `ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {\n    ListNode dummy(0);\n    ListNode* curr = &dummy;\n    int carry = 0;\n    while (l1 || l2 || carry) {\n        int sum = carry;\n        if (l1) { sum += l1->val; l1 = l1->next; }\n        if (l2) { sum += l2->val; l2 = l2->next; }\n        carry = sum / 10;\n        curr->next = new ListNode(sum % 10);\n        curr = curr->next;\n    }\n    return dummy.next;\n}\n// Time: O(max(N, M))  Space: O(max(N, M))`,
        display_order: 0
      },
      {
        title: 'Segregate odd and even nodes in Linked List',
        slug: 'odd-even-linked-list',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/odd-even-linked-list/',
        external_link: 'https://www.youtube.com/watch?v=qf6hmPQU5HQ',
        description: 'Group all nodes with odd indices together followed by nodes with even indices.',
        examples: 'Input: 1 -> 2 -> 3 -> 4 -> 5\nOutput: 1 -> 3 -> 5 -> 2 -> 4',
        approach: 'Maintain two pointers odd and even, and save evenHead. Iterate re-linking odd->next = even->next and even->next = even->next->next, then link odd->next = evenHead.',
        solution_code: `ListNode* oddEvenList(ListNode* head) {\n    if (!head || !head->next) return head;\n    ListNode* odd = head;\n    ListNode* even = head->next;\n    ListNode* evenHead = even;\n    while (even && even->next) {\n        odd->next = even->next;\n        odd = odd->next;\n        even->next = odd->next;\n        even = even->next;\n    }\n    odd->next = evenHead;\n    return head;\n}\n// Time: O(N)  Space: O(1)`,
        display_order: 1
      },
      {
        title: "Sort a Linked List of 0's 1's and 2's",
        slug: 'sort-a-linked-list-of-0s-1s-and-2s',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/given-a-linked-list-of-0s-1s-and-2s-sort-it/1',
        external_link: 'https://www.youtube.com/watch?v=gRII7LhdJWc',
        description: 'Sort a linked list of 0s, 1s and 2s by changing pointers in a single pass.',
        examples: 'Input: 1 -> 2 -> 2 -> 1 -> 2 -> 0 -> 2 -> 2\nOutput: 0 -> 1 -> 1 -> 2 -> 2 -> 2 -> 2 -> 2',
        approach: 'Use three dummy heads for 0, 1, and 2. Traverse the list, appending each node to its corresponding dummy list, then link zero->one->two.',
        solution_code: `Node* segregate(Node* head) {\n    Node* zeroD = new Node(0);\n    Node* oneD = new Node(0);\n    Node* twoD = new Node(0);\n    Node *zero = zeroD, *one = oneD, *two = twoD;\n    Node* curr = head;\n    while (curr) {\n        if (curr->data == 0) { zero->next = curr; zero = zero->next; }\n        else if (curr->data == 1) { one->next = curr; one = one->next; }\n        else { two->next = curr; two = two->next; }\n        curr = curr->next;\n    }\n    zero->next = (oneD->next) ? (oneD->next) : (twoD->next);\n    one->next = twoD->next;\n    two->next = nullptr;\n    head = zeroD->next;\n    delete zeroD; delete oneD; delete twoD;\n    return head;\n}\n// Time: O(N)  Space: O(1)`,
        display_order: 2
      },
      {
        title: 'Remove Nth node from the back of the LL',
        slug: 'remove-nth-node-from-end-of-list',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
        external_link: 'https://www.youtube.com/watch?v=3kMKYQ2w5Nk',
        description: 'Given the head of a linked list, remove the nth node from the end of the list and return its head.',
        examples: 'Input: head = [1,2,3,4,5], n = 2\nOutput: [1,2,3,5]',
        approach: 'Use fast and slow pointers. Move fast n steps ahead. Then move fast and slow together until fast reaches the end; slow is now right before the target node.',
        solution_code: `ListNode* removeNthFromEnd(ListNode* head, int n) {\n    ListNode dummy(0, head);\n    ListNode* fast = &dummy;\n    ListNode* slow = &dummy;\n    for (int i = 0; i < n; i++) fast = fast->next;\n    while (fast->next) {\n        fast = fast->next;\n        slow = slow->next;\n    }\n    ListNode* toDel = slow->next;\n    slow->next = slow->next->next;\n    delete toDel;\n    return dummy.next;\n}\n// Time: O(N)  Space: O(1)`,
        display_order: 3
      },
      {
        title: 'Reverse a LL',
        slug: 'reverse-linked-list',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/reverse-linked-list/',
        external_link: 'https://www.youtube.com/watch?v=D2vI2DNJGd8',
        description: 'Reverse a singly linked list iteratively and return the new head.',
        examples: 'Input: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]',
        approach: 'Maintain prev, curr, and next pointers. In each iteration, save next = curr->next, reverse curr->next = prev, move prev = curr, and curr = next.',
        solution_code: `ListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;\n    ListNode* curr = head;\n    while (curr) {\n        ListNode* nextNode = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = nextNode;\n    }\n    return prev;\n}\n// Time: O(N)  Space: O(1)`,
        display_order: 4
      }
    ];
    for (const p of s3Problems) {
      await insertProblem(sub3Id, p);
      console.log(`Inserted problem: ${p.title}`);
    }

    // Subtopic 4: FAQs (Medium) (8 problems)
    const sub4Id = await insertSubtopic('FAQs (Medium)', 'faqs-medium', 3);
    const s4Problems = [
      {
        title: 'Add one to a number represented by LL',
        slug: 'add-one-to-a-number-represented-by-ll',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/add-1-to-a-number-represented-as-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=aXQWhbMWNTo',
        description: 'A number is represented in linked list with most significant digit at head. Add 1 to it.',
        examples: 'Input: 4 -> 5 -> 6\nOutput: 4 -> 5 -> 7',
        approach: 'Reverse the list, add 1 with carry propagation, reverse it back. Alternatively, use recursion backtracking with carry.',
        solution_code: `int addHelper(Node* temp) {\n    if (!temp) return 1;\n    int carry = addHelper(temp->next);\n    temp->data += carry;\n    if (temp->data < 10) return 0;\n    temp->data = 0;\n    return 1;\n}\nNode* addOne(Node* head) {\n    int carry = addHelper(head);\n    if (carry == 1) {\n        Node* newNode = new Node(1);\n        newNode->next = head;\n        head = newNode;\n    }\n    return head;\n}\n// Time: O(N)  Space: O(N) auxiliary for recursion`,
        display_order: 0
      },
      {
        title: 'Find Middle of Linked List',
        slug: 'middle-of-the-linked-list',
        difficulty: 'easy',
        platform_url: 'https://leetcode.com/problems/middle-of-the-linked-list/',
        external_link: 'https://www.youtube.com/watch?v=7LjQ57RqgEc',
        description: 'Find and return the middle node of a singly linked list in a single pass.',
        examples: 'Input: [1,2,3,4,5]\nOutput: Node 3\nInput: [1,2,3,4,5,6]\nOutput: Node 4',
        approach: 'Use Tortoise and Hare algorithm: slow moves 1 step, fast moves 2 steps. When fast reaches end, slow is at the middle.',
        solution_code: `ListNode* middleNode(ListNode* head) {\n    ListNode* slow = head;\n    ListNode* fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n    return slow;\n}\n// Time: O(N)  Space: O(1)`,
        display_order: 1
      },
      {
        title: 'Delete the middle node in LL',
        slug: 'delete-the-middle-node-of-a-linked-list',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/',
        external_link: 'https://www.youtube.com/watch?v=ePpV-_pfOeI',
        description: 'Delete the middle node of a linked list and return the head.',
        examples: 'Input: head = [1,3,4,7,1,2,6]\nOutput: [1,3,4,1,2,6]',
        approach: 'Find the node before the middle using slow and fast pointers. Update slow->next = slow->next->next and delete the target.',
        solution_code: `ListNode* deleteMiddle(ListNode* head) {\n    if (!head || !head->next) return nullptr;\n    ListNode* slow = head;\n    ListNode* fast = head;\n    ListNode* prev = nullptr;\n    while (fast && fast->next) {\n        prev = slow;\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n    prev->next = slow->next;\n    delete slow;\n    return head;\n}\n// Time: O(N)  Space: O(1)`,
        display_order: 2
      },
      {
        title: 'Check if LL is palindrome or not',
        slug: 'palindrome-linked-list',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/palindrome-linked-list/',
        external_link: 'https://www.youtube.com/watch?v=lRY_G-u_8jk',
        description: 'Given the head of a singly linked list, return true if it is a palindrome or false otherwise.',
        examples: 'Input: head = [1,2,2,1]\nOutput: true\nInput: head = [1,2]\nOutput: false',
        approach: 'Find middle with slow/fast pointers. Reverse the second half of the list. Compare the first and second halves node by node.',
        solution_code: `bool isPalindrome(ListNode* head) {\n    if (!head || !head->next) return true;\n    ListNode *slow = head, *fast = head;\n    while (fast->next && fast->next->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n    ListNode* prev = nullptr;\n    ListNode* curr = slow->next;\n    while (curr) {\n        ListNode* next = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = next;\n    }\n    ListNode* p1 = head;\n    ListNode* p2 = prev;\n    while (p2) {\n        if (p1->val != p2->val) return false;\n        p1 = p1->next;\n        p2 = p2->next;\n    }\n    return true;\n}\n// Time: O(N)  Space: O(1)`,
        display_order: 3
      },
      {
        title: 'Find the intersection point of Y LL',
        slug: 'intersection-of-two-linked-lists',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/intersection-of-two-linked-lists/',
        external_link: 'https://www.youtube.com/watch?v=0DODP_gk3GNm',
        description: 'Given the heads of two singly linked lists, return the node at which the two lists intersect.',
        examples: 'Input: intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5]\nOutput: Intersected at 8',
        approach: 'Use two pointers pA and pB. When either reaches the end, reset it to the head of the other list. They will meet at the intersection point or null after at most 2 passes.',
        solution_code: `ListNode* getIntersectionNode(ListNode* headA, ListNode* headB) {\n    if (!headA || !headB) return nullptr;\n    ListNode* a = headA;\n    ListNode* b = headB;\n    while (a != b) {\n        a = a ? a->next : headB;\n        b = b ? b->next : headA;\n    }\n    return a;\n}\n// Time: O(N + M)  Space: O(1)`,
        display_order: 4
      },
      {
        title: 'Detect a loop in LL',
        slug: 'linked-list-cycle',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/linked-list-cycle/',
        external_link: 'https://www.youtube.com/watch?v=wiOo4DC5GGA',
        description: 'Determine if the linked list has a cycle using Floyd Cycle-Finding Algorithm.',
        examples: 'Input: head = [3,2,0,-4], pos = 1\nOutput: true',
        approach: 'Use slow and fast pointers. Advance slow by 1 step and fast by 2 steps. If slow == fast at any point, a cycle exists.',
        solution_code: `bool hasCycle(ListNode* head) {\n    ListNode* slow = head;\n    ListNode* fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n    return false;\n}\n// Time: O(N)  Space: O(1)`,
        display_order: 5
      },
      {
        title: 'Find the starting point in LL',
        slug: 'linked-list-cycle-ii',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/linked-list-cycle-ii/',
        external_link: 'https://www.youtube.com/watch?v=2Kd0KKmmHFc',
        description: 'Given the head of a linked list, return the node where the cycle begins.',
        examples: 'Input: head = [3,2,0,-4], pos = 1\nOutput: Node with value 2',
        approach: 'Detect intersection with slow and fast. Once they meet, reset slow to head. Advance both 1 step at a time; they meet at the cycle entry.',
        solution_code: `ListNode* detectCycle(ListNode* head) {\n    ListNode *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) {\n            slow = head;\n            while (slow != fast) {\n                slow = slow->next;\n                fast = fast->next;\n            }\n            return slow;\n        }\n    }\n    return nullptr;\n}\n// Time: O(N)  Space: O(1)`,
        display_order: 6
      },
      {
        title: 'Length of loop in LL',
        slug: 'length-of-loop-in-ll',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/find-length-of-loop/1',
        external_link: 'https://www.youtube.com/watch?v=I4g1qbd30QY',
        description: 'Find the number of nodes present in the cycle of a linked list.',
        examples: 'Input: 1 -> 2 -> 3 -> 4 -> 5 -> 2 (cycle)\nOutput: 4',
        approach: 'When slow and fast meet, keep slow stationary and advance fast by 1 counting steps until fast meets slow again.',
        solution_code: `int countNodesinLoop(Node* head) {\n    Node *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) {\n            int count = 1;\n            fast = fast->next;\n            while (slow != fast) {\n                count++;\n                fast = fast->next;\n            }\n            return count;\n        }\n    }\n    return 0;\n}\n// Time: O(N)  Space: O(1)`,
        display_order: 7
      }
    ];
    for (const p of s4Problems) {
      await insertProblem(sub4Id, p);
      console.log(`Inserted problem: ${p.title}`);
    }

    // Subtopic 5: FAQs (Hard) (6 problems)
    const sub5Id = await insertSubtopic('FAQs (Hard)', 'faqs-hard', 4);
    const s5Problems = [
      {
        title: 'Reverse LL in group of given size K',
        slug: 'reverse-nodes-in-k-group',
        difficulty: 'hard',
        platform_url: 'https://leetcode.com/problems/reverse-nodes-in-k-group/',
        external_link: 'https://www.youtube.com/watch?v=Of0HPkk3JgI',
        description: 'Reverse the nodes of a linked list k at a time and return its modified list.',
        examples: 'Input: head = [1,2,3,4,5], k = 2\nOutput: [2,1,4,3,5]',
        approach: 'Find the Kth node for each group. Reverse the segment of K nodes, link prevGroup->next to Kth node, and connect reversed tail to the next group.',
        solution_code: `ListNode* getKth(ListNode* curr, int k) {\n    while (curr && k > 0) {\n        curr = curr->next;\n        k--;\n    }\n    return curr;\n}\nListNode* reverseKGroup(ListNode* head, int k) {\n    ListNode dummy(0, head);\n    ListNode* prevGroup = &dummy;\n    while (true) {\n        ListNode* kth = getKth(prevGroup, k);\n        if (!kth) break;\n        ListNode* nextGroup = kth->next;\n        ListNode* prev = kth->next;\n        ListNode* curr = prevGroup->next;\n        while (curr != nextGroup) {\n            ListNode* tmp = curr->next;\n            curr->next = prev;\n            prev = curr;\n            curr = tmp;\n        }\n        ListNode* tmp = prevGroup->next;\n        prevGroup->next = kth;\n        prevGroup = tmp;\n    }\n    return dummy.next;\n}\n// Time: O(N)  Space: O(1)`,
        display_order: 0
      },
      {
        title: 'Rotate a LL',
        slug: 'rotate-list',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/rotate-list/',
        external_link: 'https://www.youtube.com/watch?v=uT7YI7X2Rt8',
        description: 'Given the head of a linked list, rotate the list to the right by k places.',
        examples: 'Input: head = [1,2,3,4,5], k = 2\nOutput: [4,5,1,2,3]',
        approach: 'Connect the tail to head to form a circle. Compute length L. Effective rotation is k % L. Find the (L - (k % L))th node, break the circle and return the new head.',
        solution_code: `ListNode* rotateRight(ListNode* head, int k) {\n    if (!head || !head->next || k == 0) return head;\n    int len = 1;\n    ListNode* tail = head;\n    while (tail->next) { tail = tail->next; len++; }\n    tail->next = head;\n    k = k % len;\n    int steps = len - k;\n    while (steps--) tail = tail->next;\n    head = tail->next;\n    tail->next = nullptr;\n    return head;\n}\n// Time: O(N)  Space: O(1)`,
        display_order: 1
      },
      {
        title: 'Merge two Sorted Lists',
        slug: 'merge-two-sorted-lists',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/merge-two-sorted-lists/',
        external_link: 'https://www.youtube.com/watch?v=jXu-H7XuClE',
        description: 'Merge two sorted linked lists and return it as a sorted list.',
        examples: 'Input: list1 = [1,2,4], list2 = [1,3,4]\nOutput: [1,1,2,3,4,4]',
        approach: 'Use a dummy node and a tail pointer. Compare list1->val and list2->val, attach the smaller node to tail, and advance pointers.',
        solution_code: `ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n    ListNode dummy(0);\n    ListNode* tail = &dummy;\n    while (l1 && l2) {\n        if (l1->val <= l2->val) {\n            tail->next = l1;\n            l1 = l1->next;\n        } else {\n            tail->next = l2;\n            l2 = l2->next;\n        }\n        tail = tail->next;\n    }\n    tail->next = l1 ? l1 : l2;\n    return dummy.next;\n}\n// Time: O(N + M)  Space: O(1)`,
        display_order: 2
      },
      {
        title: 'Flattening of LL',
        slug: 'flattening-a-linked-list',
        difficulty: 'hard',
        platform_url: 'https://practice.geeksforgeeks.org/problems/flattening-a-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=ysytSSXpAI0',
        description: 'Flatten a 2D linked list where each node has next and bottom pointers into a single sorted list.',
        examples: 'Input: 5 -> 10 -> 19 -> 28 with bottom pointers\nOutput: 5 -> 7 -> 8 -> 10 -> 19 -> 20 -> 22 -> 28',
        approach: 'Recursively flatten the rest of the list (root->next) and then merge the current vertical list with the flattened list using the bottom pointer.',
        solution_code: `Node* mergeTwo(Node* a, Node* b) {\n    Node* res = new Node(0);\n    Node* temp = res;\n    while (a && b) {\n        if (a->data < b->data) {\n            temp->bottom = a;\n            temp = a;\n            a = a->bottom;\n        } else {\n            temp->bottom = b;\n            temp = b;\n            b = b->bottom;\n        }\n    }\n    temp->bottom = a ? a : b;\n    return res->bottom;\n}\nNode* flatten(Node* root) {\n    if (!root || !root->next) return root;\n    root->next = flatten(root->next);\n    root = mergeTwo(root, root->next);\n    return root;\n}\n// Time: O(total nodes)  Space: O(1)`,
        display_order: 3
      },
      {
        title: 'Sort LL',
        slug: 'sort-list',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/sort-list/',
        external_link: 'https://www.youtube.com/watch?v=8ocB7a_c-Cc',
        description: 'Given the head of a linked list, return the list after sorting it in O(n log n) time.',
        examples: 'Input: head = [4,2,1,3]\nOutput: [1,2,3,4]',
        approach: 'Use Merge Sort: split list into two halves using fast and slow pointers, recursively sort both halves, and merge the sorted lists.',
        solution_code: `ListNode* sortList(ListNode* head) {\n    if (!head || !head->next) return head;\n    ListNode *slow = head, *fast = head, *prev = nullptr;\n    while (fast && fast->next) {\n        prev = slow;\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n    prev->next = nullptr;\n    ListNode* l1 = sortList(head);\n    ListNode* l2 = sortList(slow);\n    return mergeTwoLists(l1, l2);\n}\n// Time: O(N log N)  Space: O(log N)`,
        display_order: 4
      },
      {
        title: 'Clone a LL with random and next pointer',
        slug: 'copy-list-with-random-pointer',
        difficulty: 'hard',
        platform_url: 'https://leetcode.com/problems/copy-list-with-random-pointer/',
        external_link: 'https://www.youtube.com/watch?v=q570bKdrnlw',
        description: 'Construct a deep copy of a linked list where each node contains an additional random pointer in O(1) extra space.',
        examples: 'Input: head = [[7,null],[13,0],[11,4],[10,2],[1,0]]\nOutput: Deep copy of identical structure',
        approach: '1. Insert cloned nodes interleaved: curr->next = clone, clone->next = next. 2. Set clone->random = curr->random->next. 3. Separate original and clone lists.',
        solution_code: `Node* copyRandomList(Node* head) {\n    if (!head) return nullptr;\n    Node* curr = head;\n    while (curr) {\n        Node* copy = new Node(curr->val);\n        copy->next = curr->next;\n        curr->next = copy;\n        curr = copy->next;\n    }\n    curr = head;\n    while (curr) {\n        if (curr->random) curr->next->random = curr->random->next;\n        curr = curr->next->next;\n    }\n    Node* dummy = new Node(0);\n    Node* copyCurr = dummy;\n    curr = head;\n    while (curr) {\n        copyCurr->next = curr->next;\n        copyCurr = copyCurr->next;\n        curr->next = curr->next->next;\n        curr = curr->next;\n    }\n    return dummy->next;\n}\n// Time: O(N)  Space: O(1)`,
        display_order: 5
      }
    ];
    for (const p of s5Problems) {
      await insertProblem(sub5Id, p);
      console.log(`Inserted problem: ${p.title}`);
    }

    // Subtopic 6: FAQS (DLL) (3 problems)
    const sub6Id = await insertSubtopic('FAQS (DLL)', 'faqs-dll', 5);
    const s6Problems = [
      {
        title: 'Delete all occurrences of a key in DLL',
        slug: 'delete-all-occurrences-of-a-key-in-dll',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/delete-all-occurrences-of-a-given-key-in-a-doubly-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=Mh0NH_PKAqc',
        description: 'Given a doubly linked list and a key x, delete all nodes with value equal to x.',
        examples: 'Input: 2 <-> 2 <-> 10 <-> 8 <-> 4 <-> 2 <-> 5 <-> 2, x = 2\nOutput: 10 <-> 8 <-> 4 <-> 5',
        approach: 'Traverse DLL. If curr->data == x, unlink curr by updating curr->prev->next and curr->next->prev, and advance curr.',
        solution_code: `void deleteAllOccurrences(Node** head_ref, int x) {\n    Node* curr = *head_ref;\n    while (curr) {\n        if (curr->data == x) {\n            if (curr == *head_ref) *head_ref = curr->next;\n            if (curr->next) curr->next->prev = curr->prev;\n            if (curr->prev) curr->prev->next = curr->next;\n            Node* toDel = curr;\n            curr = curr->next;\n            delete toDel;\n        } else {\n            curr = curr->next;\n        }\n    }\n}\n// Time: O(N)  Space: O(1)`,
        display_order: 0
      },
      {
        title: 'Remove duplicates from sorted DLL',
        slug: 'remove-duplicates-from-sorted-dll',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/remove-duplicates-from-a-sorted-doubly-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=YJKVTnOJXSY',
        description: 'Given a sorted doubly linked list of distinct and duplicate values, remove duplicates in-place.',
        examples: 'Input: 1 <-> 1 <-> 1 <-> 2 <-> 3 <-> 3 <-> 4\nOutput: 1 <-> 2 <-> 3 <-> 4',
        approach: 'Traverse list. If curr->data == nextNode->data, bypass nextNode by updating pointers and delete nextNode. Otherwise advance curr.',
        solution_code: `Node* removeDuplicates(Node* head) {\n    Node* curr = head;\n    while (curr && curr->next) {\n        if (curr->data == curr->next->data) {\n            Node* nextNode = curr->next;\n            curr->next = nextNode->next;\n            if (nextNode->next) nextNode->next->prev = curr;\n            delete nextNode;\n        } else {\n            curr = curr->next;\n        }\n    }\n    return head;\n}\n// Time: O(N)  Space: O(1)`,
        display_order: 1
      },
      {
        title: 'Find Pairs with Given Sum in Doubly Linked List',
        slug: 'find-pairs-with-given-sum-in-doubly-linked-list',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/find-pairs-with-given-sum-in-doubly-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=YitR4dQuddE',
        description: 'Find all pairs in a sorted doubly linked list whose sum is equal to a given value target.',
        examples: 'Input: 1 <-> 2 <-> 4 <-> 5 <-> 6 <-> 8 <-> 9, target = 7\nOutput: (1, 6), (2, 5)',
        approach: 'Use two pointers: left = head, right = tail. If left->data + right->data == target, record pair and advance both. If sum < target, left = left->next, else right = right->prev.',
        solution_code: `vector<pair<int, int>> findPairsWithGivenSum(Node* head, int target) {\n    vector<pair<int, int>> ans;\n    if (!head) return ans;\n    Node* left = head;\n    Node* right = head;\n    while (right->next) right = right->next;\n    while (left->data < right->data) {\n        int sum = left->data + right->data;\n        if (sum == target) {\n            ans.push_back({left->data, right->data});\n            left = left->next;\n            right = right->prev;\n        } else if (sum < target) {\n            left = left->next;\n        } else {\n            right = right->prev;\n        }\n    }\n    return ans;\n}\n// Time: O(N)  Space: O(1)`,
        display_order: 2
      }
    ];
    for (const p of s6Problems) {
      await insertProblem(sub6Id, p);
      console.log(`Inserted problem: ${p.title}`);
    }

    console.log('Linked-List Part 2 Seeding Complete (22 problems)!');
    process.exit(0);
  } catch (err) {
    console.error('Error in seedLLPart2:', err);
    process.exit(1);
  }
}

seedLLPart2();
