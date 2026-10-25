require('dotenv').config();
const db = require('./src/config/db');

async function seedLLPart1() {
  try {
    console.log('Seeding Linked-List Part 1...');
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
        'Linked-List',
        'linked-lists',
        'Master singly and doubly linked list fundamentals, pointer manipulations, and interview patterns.',
        2
      ]
    );
    const topicId = topicRes.rows[0].id;
    console.log(`Topic Linked-List ready (ID: ${topicId})`);

    // Helper to insert subtopic
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

    // Helper to insert problem
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

    // Subtopic 1: Fundamentals (Single LL)
    const sub1Id = await insertSubtopic('Fundamentals (Single LL)', 'fundamentals-single-ll', 0);

    const s1Problems = [
      {
        title: 'Introduction to Singly LinkedList',
        slug: 'introduction-to-singly-linkedlist',
        difficulty: 'easy',
        platform_url: 'https://practice.geeksforgeeks.org/problems/introduction-to-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=Nq7ok-OyEpg',
        description: 'Understand the Node structure in C++ and how a singly linked list is represented in memory.',
        examples: 'Input: arr = [1, 2, 3, 4, 5]\nOutput: 1 -> 2 -> 3 -> 4 -> 5',
        approach: 'Create a Node class or struct with data and a next pointer. Allocate nodes dynamically and link each node to the next.',
        solution_code: `struct Node {\n    int data;\n    Node* next;\n    Node(int val) : data(val), next(nullptr) {}\n};\n// Time: O(1) per node  Space: O(1)`,
        display_order: 0
      },
      {
        title: 'Traversal in Linked List',
        slug: 'traversal-in-linked-list',
        difficulty: 'easy',
        platform_url: 'https://practice.geeksforgeeks.org/problems/count-nodes-of-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=Nq7ok-OyEpg',
        description: 'Traverse through all elements of a singly linked list from head to null.',
        examples: 'Input: 1 -> 2 -> 3 -> null\nOutput: 1 2 3',
        approach: 'Start with a temporary pointer at head. While temp != nullptr, process temp->data and move temp = temp->next.',
        solution_code: `void printList(Node* head) {\n    Node* temp = head;\n    while (temp != nullptr) {\n        cout << temp->data << " ";\n        temp = temp->next;\n    }\n}\n// Time: O(n)  Space: O(1)`,
        display_order: 1
      },
      {
        title: 'Deletion in Linked List',
        slug: 'deletion-in-linked-list',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/delete-a-node-in-single-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=VaECK03Dz-g',
        description: 'Learn the general pattern for deleting a node from a singly linked list and freeing memory.',
        examples: 'Input: 1 -> 2 -> 3 -> 4, delete 3\nOutput: 1 -> 2 -> 4',
        approach: 'Find the node before the target node, adjust its next pointer to bypass the target, and delete the target node.',
        solution_code: `Node* deleteNode(Node* head, int x) {\n    if (!head) return nullptr;\n    if (head->data == x) {\n        Node* temp = head;\n        head = head->next;\n        delete temp;\n        return head;\n    }\n    Node* curr = head;\n    while (curr->next && curr->next->data != x) curr = curr->next;\n    if (curr->next) {\n        Node* temp = curr->next;\n        curr->next = curr->next->next;\n        delete temp;\n    }\n    return head;\n}\n// Time: O(n)  Space: O(1)`,
        display_order: 2
      },
      {
        title: 'Insertion in Linked List',
        slug: 'insertion-in-linked-list',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/linked-list-insertion/1',
        external_link: 'https://www.youtube.com/watch?v=VaECK03Dz-g',
        description: 'Understand the general concepts of allocating new nodes and updating pointers for insertion.',
        examples: 'Input: Insert 10 into 1 -> 2\nOutput: 10 -> 1 -> 2 or 1 -> 2 -> 10',
        approach: 'Allocate a new node with given value. Adjust pointers depending on whether inserting at head, tail, or middle.',
        solution_code: `Node* insertAtEnd(Node* head, int x) {\n    Node* newNode = new Node(x);\n    if (!head) return newNode;\n    Node* temp = head;\n    while (temp->next) temp = temp->next;\n    temp->next = newNode;\n    return head;\n}\n// Time: O(n)  Space: O(1)`,
        display_order: 3
      },
      {
        title: 'Deletion of the head of LL',
        slug: 'deletion-of-the-head-of-ll',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/delete-a-node-in-single-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=VaECK03Dz-g',
        description: 'Delete the first (head) node of a singly linked list in O(1) time.',
        examples: 'Input: 10 -> 20 -> 30\nOutput: 20 -> 30',
        approach: 'Store head in a temp pointer, advance head = head->next, and delete temp.',
        solution_code: `Node* deleteHead(Node* head) {\n    if (!head) return nullptr;\n    Node* temp = head;\n    head = head->next;\n    delete temp;\n    return head;\n}\n// Time: O(1)  Space: O(1)`,
        display_order: 4
      },
      {
        title: 'Deletion of the tail of Linked List',
        slug: 'deletion-of-the-tail-of-linked-list',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/delete-a-node-in-single-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=VaECK03Dz-g',
        description: 'Delete the last node (tail) of a singly linked list.',
        examples: 'Input: 1 -> 2 -> 3 -> null\nOutput: 1 -> 2 -> null',
        approach: 'Traverse until temp->next->next is null. Delete temp->next and set temp->next = nullptr.',
        solution_code: `Node* deleteTail(Node* head) {\n    if (!head || !head->next) { delete head; return nullptr; }\n    Node* temp = head;\n    while (temp->next->next) temp = temp->next;\n    delete temp->next;\n    temp->next = nullptr;\n    return head;\n}\n// Time: O(n)  Space: O(1)`,
        display_order: 5
      },
      {
        title: 'Deletion of the Kth element of Linked List',
        slug: 'deletion-of-the-kth-element-of-linked-list',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/delete-a-node-in-single-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=VaECK03Dz-g',
        description: 'Delete the node at the 1-based index K in a singly linked list.',
        examples: 'Input: 1 -> 2 -> 3 -> 4, K = 3\nOutput: 1 -> 2 -> 4',
        approach: 'Count positions until reaching K-1. Re-link the K-1 node to K+1 and free the Kth node.',
        solution_code: `Node* deleteKth(Node* head, int k) {\n    if (!head) return nullptr;\n    if (k == 1) {\n        Node* temp = head;\n        head = head->next;\n        delete temp;\n        return head;\n    }\n    Node* temp = head;\n    for (int i = 1; i < k - 1 && temp; i++) temp = temp->next;\n    if (temp && temp->next) {\n        Node* toDel = temp->next;\n        temp->next = temp->next->next;\n        delete toDel;\n    }\n    return head;\n}\n// Time: O(k)  Space: O(1)`,
        display_order: 6
      },
      {
        title: 'Delete the element with value X',
        slug: 'delete-the-element-with-value-x',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/remove-linked-list-elements/',
        external_link: 'https://www.youtube.com/watch?v=VaECK03Dz-g',
        description: 'Delete all nodes that have value X from the linked list.',
        examples: 'Input: head = [1,2,6,3,4,5,6], val = 6\nOutput: [1,2,3,4,5]',
        approach: 'Use a dummy node pointing to head to handle deletions at the front easily. Traverse with curr and remove matching nodes.',
        solution_code: `ListNode* removeElements(ListNode* head, int val) {\n    ListNode dummy(0, head);\n    ListNode* curr = &dummy;\n    while (curr->next) {\n        if (curr->next->val == val) {\n            ListNode* temp = curr->next;\n            curr->next = curr->next->next;\n            delete temp;\n        } else {\n            curr = curr->next;\n        }\n    }\n    return dummy.next;\n}\n// Time: O(n)  Space: O(1)`,
        display_order: 7
      },
      {
        title: 'Insertion at the head of Linked List',
        slug: 'insertion-at-the-head-of-linked-list',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/linked-list-insertion-at-beginning/1',
        external_link: 'https://www.youtube.com/watch?v=VaECK03Dz-g',
        description: 'Insert a new node before the existing head of a singly linked list in O(1) time.',
        examples: 'Input: 2 -> 3, insert 1 at head\nOutput: 1 -> 2 -> 3',
        approach: 'Create a new node with data. Set newNode->next = head, then return newNode as the new head.',
        solution_code: `Node* insertAtHead(Node* head, int val) {\n    Node* newNode = new Node(val);\n    newNode->next = head;\n    return newNode;\n}\n// Time: O(1)  Space: O(1)`,
        display_order: 8
      },
      {
        title: 'Insertion at the tail of Linked List',
        slug: 'insertion-at-the-tail-of-linked-list',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/linked-list-insertion-at-end/1',
        external_link: 'https://www.youtube.com/watch?v=VaECK03Dz-g',
        description: 'Append a new node to the end of a singly linked list.',
        examples: 'Input: 1 -> 2, insert 3 at tail\nOutput: 1 -> 2 -> 3',
        approach: 'Traverse to the last node (where next is null), then set last->next = newNode.',
        solution_code: `Node* insertAtTail(Node* head, int val) {\n    Node* newNode = new Node(val);\n    if (!head) return newNode;\n    Node* temp = head;\n    while (temp->next) temp = temp->next;\n    temp->next = newNode;\n    return head;\n}\n// Time: O(n)  Space: O(1)`,
        display_order: 9
      },
      {
        title: 'Insertion at the Kth position of Linked List',
        slug: 'insertion-at-the-kth-position-of-linked-list',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/insert-in-middle-of-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=VaECK03Dz-g',
        description: 'Insert a new node at the specified 1-based position K.',
        examples: 'Input: 1 -> 3, insert 2 at position 2\nOutput: 1 -> 2 -> 3',
        approach: 'Traverse to position K-1. Point newNode->next to temp->next, then temp->next = newNode.',
        solution_code: `Node* insertAtK(Node* head, int val, int k) {\n    if (k == 1) {\n        Node* n = new Node(val);\n        n->next = head;\n        return n;\n    }\n    Node* temp = head;\n    for (int i = 1; i < k - 1 && temp; i++) temp = temp->next;\n    if (temp) {\n        Node* n = new Node(val);\n        n->next = temp->next;\n        temp->next = n;\n    }\n    return head;\n}\n// Time: O(k)  Space: O(1)`,
        display_order: 10
      },
      {
        title: 'Insertion before the value X in Linked List',
        slug: 'insertion-before-the-value-x-in-linked-list',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/linked-list-insertion/1',
        external_link: 'https://www.youtube.com/watch?v=VaECK03Dz-g',
        description: 'Insert a new element immediately before the first occurrence of node with value X.',
        examples: 'Input: 1 -> 3 -> 4, insert 2 before 3\nOutput: 1 -> 2 -> 3 -> 4',
        approach: 'Check if head has value X; if so, insert at head. Otherwise traverse until temp->next->data == X and insert.',
        solution_code: `Node* insertBeforeX(Node* head, int val, int x) {\n    if (!head) return nullptr;\n    if (head->data == x) {\n        Node* n = new Node(val);\n        n->next = head;\n        return n;\n    }\n    Node* temp = head;\n    while (temp->next && temp->next->data != x) temp = temp->next;\n    if (temp->next) {\n        Node* n = new Node(val);\n        n->next = temp->next;\n        temp->next = n;\n    }\n    return head;\n}\n// Time: O(n)  Space: O(1)`,
        display_order: 11
      },
      {
        title: 'Find the length of the Linked List',
        slug: 'find-the-length-of-the-linked-list',
        difficulty: 'easy',
        platform_url: 'https://practice.geeksforgeeks.org/problems/count-nodes-of-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=Nq7ok-OyEpg',
        description: 'Count the total number of nodes in a given singly linked list.',
        examples: 'Input: 1 -> 2 -> 3 -> 4 -> 5\nOutput: 5',
        approach: 'Initialize count = 0. Iterate through the linked list with a temp pointer, incrementing count at each node until temp is null.',
        solution_code: `int getCount(Node* head) {\n    int count = 0;\n    Node* temp = head;\n    while (temp) {\n        count++;\n        temp = temp->next;\n    }\n    return count;\n}\n// Time: O(n)  Space: O(1)`,
        display_order: 12
      },
      {
        title: 'Search in Linked List',
        slug: 'search-in-linked-list',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/search-in-linked-list-1664434326/1',
        external_link: 'https://www.youtube.com/watch?v=Nq7ok-OyEpg',
        description: 'Determine if a given target element is present in the singly linked list.',
        examples: 'Input: 1 -> 2 -> 3 -> 4, key = 3\nOutput: true',
        approach: 'Traverse node by node. If temp->data == key, return true. If reached end (null), return false.',
        solution_code: `bool searchKey(Node* head, int key) {\n    Node* temp = head;\n    while (temp) {\n        if (temp->data == key) return true;\n        temp = temp->next;\n    }\n    return false;\n}\n// Time: O(n)  Space: O(1)`,
        display_order: 13
      }
    ];

    for (const p of s1Problems) {
      await insertProblem(sub1Id, p);
      console.log(`Inserted problem: ${p.title}`);
    }

    // Subtopic 2: Fundamentals (Doubly LL)
    const sub2Id = await insertSubtopic('Fundamentals (Doubly LL)', 'fundamentals-doubly-ll', 1);

    const s2Problems = [
      {
        title: 'Introduction to Doubly LL',
        slug: 'introduction-to-doubly-ll',
        difficulty: 'easy',
        platform_url: 'https://practice.geeksforgeeks.org/problems/introduction-to-doubly-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=0eKMU10uEDI',
        description: 'Learn the Doubly Linked List node representation having both prev and next pointers.',
        examples: 'Input: arr = [1, 2, 3]\nOutput: null <- 1 <-> 2 <-> 3 -> null',
        approach: 'Define a Node with data, Node* next, and Node* prev. Construct bidirectional connections between adjacent nodes.',
        solution_code: `struct Node {\n    int data;\n    Node* prev;\n    Node* next;\n    Node(int val) : data(val), prev(nullptr), next(nullptr) {}\n};\n// Time: O(1)  Space: O(1)`,
        display_order: 0
      },
      {
        title: 'Deletion in Doubly LL',
        slug: 'deletion-in-doubly-ll',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/delete-node-in-doubly-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=Mhlx78m5v6Q',
        description: 'Understand how to safely unhook both prev and next pointers when deleting from a DLL.',
        examples: 'Input: 1 <-> 2 <-> 3, delete 2\nOutput: 1 <-> 3',
        approach: 'Update node->prev->next = node->next and node->next->prev = node->prev, handling edge cases for head and tail.',
        solution_code: `Node* deleteNode(Node* head, Node* del) {\n    if (!head || !del) return nullptr;\n    if (head == del) head = del->next;\n    if (del->next) del->next->prev = del->prev;\n    if (del->prev) del->prev->next = del->next;\n    delete del;\n    return head;\n}\n// Time: O(1)  Space: O(1)`,
        display_order: 1
      },
      {
        title: 'Insertion in DLL',
        slug: 'insertion-in-dll',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/insert-a-node-in-doubly-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=Mhlx78m5v6Q',
        description: 'General insertion pattern in a Doubly Linked List adjusting 4 pointers.',
        examples: 'Input: Insert 4 after position 2 in 1 <-> 2 <-> 3\nOutput: 1 <-> 2 <-> 4 <-> 3',
        approach: 'Allocate new node. Set its next and prev, and update adjacent nodes pointers accordingly.',
        solution_code: `void insertAfter(Node* prevNode, int val) {\n    if (!prevNode) return;\n    Node* n = new Node(val);\n    n->next = prevNode->next;\n    n->prev = prevNode;\n    if (prevNode->next) prevNode->next->prev = n;\n    prevNode->next = n;\n}\n// Time: O(1)  Space: O(1)`,
        display_order: 2
      },
      {
        title: 'Convert Array to Doubly Linked List',
        slug: 'convert-array-to-doubly-linked-list',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/introduction-to-doubly-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=0eKMU10uEDI',
        description: 'Given an array of integers, construct and return the head of a doubly linked list.',
        examples: 'Input: arr = [1, 2, 3, 4]\nOutput: 1 <-> 2 <-> 3 <-> 4',
        approach: 'Create head with arr[0]. Iterate through the rest of the array, linking each new node back to prev and prev forward to curr.',
        solution_code: `Node* constructDLL(vector<int>& arr) {\n    if (arr.empty()) return nullptr;\n    Node* head = new Node(arr[0]);\n    Node* prev = head;\n    for (size_t i = 1; i < arr.size(); i++) {\n        Node* curr = new Node(arr[i]);\n        curr->prev = prev;\n        prev->next = curr;\n        prev = curr;\n    }\n    return head;\n}\n// Time: O(n)  Space: O(n)`,
        display_order: 3
      },
      {
        title: 'Delete Tail of Doubly Linked List',
        slug: 'delete-tail-of-doubly-linked-list',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/delete-node-in-doubly-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=Mhlx78m5v6Q',
        description: 'Remove the last node from a Doubly Linked List and update the second-to-last node next pointer.',
        examples: 'Input: 1 <-> 2 <-> 3 -> null\nOutput: 1 <-> 2 -> null',
        approach: 'Traverse to the tail. Set tail->prev->next = nullptr and delete the tail node.',
        solution_code: `Node* deleteTail(Node* head) {\n    if (!head || !head->next) { delete head; return nullptr; }\n    Node* tail = head;\n    while (tail->next) tail = tail->next;\n    tail->prev->next = nullptr;\n    delete tail;\n    return head;\n}\n// Time: O(n)  Space: O(1)`,
        display_order: 4
      },
      {
        title: 'Delete Kth Element of Doubly Linked List',
        slug: 'delete-kth-element-of-doubly-linked-list',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/delete-node-in-doubly-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=Mhlx78m5v6Q',
        description: 'Delete the node at 1-based index K in a Doubly Linked List.',
        examples: 'Input: 1 <-> 2 <-> 3 <-> 4, K = 2\nOutput: 1 <-> 3 <-> 4',
        approach: 'Traverse to the Kth node. Adjust both its predecessor and successor pointers to bypass it, then free memory.',
        solution_code: `Node* deleteKthNode(Node* head, int k) {\n    if (!head) return nullptr;\n    Node* curr = head;\n    for (int i = 1; i < k && curr; i++) curr = curr->next;\n    if (!curr) return head;\n    if (curr == head) head = head->next;\n    if (curr->prev) curr->prev->next = curr->next;\n    if (curr->next) curr->next->prev = curr->prev;\n    delete curr;\n    return head;\n}\n// Time: O(k)  Space: O(1)`,
        display_order: 5
      },
      {
        title: 'Removing given node in Doubly Linked List',
        slug: 'removing-given-node-in-doubly-linked-list',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/delete-node-in-doubly-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=Mhlx78m5v6Q',
        description: 'Delete a given pointer to a node in a Doubly Linked List without traversing from head.',
        examples: 'Input: Given pointer to node with value 3 in 1 <-> 2 <-> 3 <-> 4\nOutput: 1 <-> 2 <-> 4',
        approach: 'Since it is a DLL, access node->prev and node->next directly. Update node->prev->next and node->next->prev, then delete node.',
        solution_code: `void deleteNodeDirect(Node* node) {\n    if (!node) return;\n    if (node->prev) node->prev->next = node->next;\n    if (node->next) node->next->prev = node->prev;\n    delete node;\n}\n// Time: O(1)  Space: O(1)`,
        display_order: 6
      },
      {
        title: 'Insert node before head in Doubly Linked List',
        slug: 'insert-node-before-head-in-doubly-linked-list',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/insert-a-node-in-doubly-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=Mhlx78m5v6Q',
        description: 'Insert a new node before the head of a Doubly Linked List in O(1) time.',
        examples: 'Input: 2 <-> 3, insert 1 before head\nOutput: 1 <-> 2 <-> 3',
        approach: 'Create newNode. Set newNode->next = head and head->prev = newNode. Return newNode as the new head.',
        solution_code: `Node* insertBeforeHead(Node* head, int val) {\n    Node* n = new Node(val);\n    n->next = head;\n    if (head) head->prev = n;\n    return n;\n}\n// Time: O(1)  Space: O(1)`,
        display_order: 7
      },
      {
        title: 'Insert node before tail in Doubly Linked List',
        slug: 'insert-node-before-tail-in-doubly-linked-list',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/insert-a-node-in-doubly-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=Mhlx78m5v6Q',
        description: 'Insert a new node immediately before the tail of a Doubly Linked List.',
        examples: 'Input: 1 <-> 3, insert 2 before tail 3\nOutput: 1 <-> 2 <-> 3',
        approach: 'Find the tail node. Insert newNode between tail->prev and tail, updating four pointers.',
        solution_code: `Node* insertBeforeTail(Node* head, int val) {\n    if (!head || !head->next) return insertBeforeHead(head, val);\n    Node* tail = head;\n    while (tail->next) tail = tail->next;\n    Node* prevNode = tail->prev;\n    Node* n = new Node(val);\n    n->next = tail;\n    n->prev = prevNode;\n    prevNode->next = n;\n    tail->prev = n;\n    return head;\n}\n// Time: O(n)  Space: O(1)`,
        display_order: 8
      },
      {
        title: 'Insert node before (kth node) in Doubly Linked List',
        slug: 'insert-node-before-kth-node-in-doubly-linked-list',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/insert-a-node-in-doubly-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=Mhlx78m5v6Q',
        description: 'Insert a new node before the Kth position in a Doubly Linked List.',
        examples: 'Input: 1 <-> 3 <-> 4, insert 2 before 2nd node\nOutput: 1 <-> 2 <-> 3 <-> 4',
        approach: 'Traverse to the Kth node. If K == 1, insert before head. Otherwise, splice newNode between (K-1)th and Kth nodes.',
        solution_code: `Node* insertBeforeKth(Node* head, int val, int k) {\n    if (k == 1) return insertBeforeHead(head, val);\n    Node* curr = head;\n    for (int i = 1; i < k && curr; i++) curr = curr->next;\n    if (!curr) return head;\n    Node* prevNode = curr->prev;\n    Node* n = new Node(val);\n    n->next = curr;\n    n->prev = prevNode;\n    prevNode->next = n;\n    curr->prev = n;\n    return head;\n}\n// Time: O(k)  Space: O(1)`,
        display_order: 9
      },
      {
        title: 'Insert before given node in Doubly Linked List',
        slug: 'insert-before-given-node-in-doubly-linked-list',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/insert-a-node-in-doubly-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=Mhlx78m5v6Q',
        description: 'Given a pointer to a node, insert a new element immediately before it in O(1) time.',
        examples: 'Input: Given pointer to node 3 in 1 <-> 3, insert 2 before it\nOutput: 1 <-> 2 <-> 3',
        approach: 'Node* prev = node->prev. Link newNode with prev and node in O(1).',
        solution_code: `void insertBeforeNode(Node* node, int val) {\n    if (!node) return;\n    Node* prevNode = node->prev;\n    Node* n = new Node(val);\n    n->next = node;\n    n->prev = prevNode;\n    node->prev = n;\n    if (prevNode) prevNode->next = n;\n}\n// Time: O(1)  Space: O(1)`,
        display_order: 10
      },
      {
        title: 'Delete head of Doubly Linked List',
        slug: 'delete-head-of-doubly-linked-list',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/delete-node-in-doubly-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=Mhlx78m5v6Q',
        description: 'Delete the first node of a Doubly Linked List in O(1) time.',
        examples: 'Input: 1 <-> 2 <-> 3\nOutput: 2 <-> 3',
        approach: 'Advance head = head->next. If head is not null, set head->prev = nullptr. Delete the old head.',
        solution_code: `Node* deleteHeadDLL(Node* head) {\n    if (!head || !head->next) { delete head; return nullptr; }\n    Node* temp = head;\n    head = head->next;\n    head->prev = nullptr;\n    delete temp;\n    return head;\n}\n// Time: O(1)  Space: O(1)`,
        display_order: 11
      },
      {
        title: 'Reverse a Doubly Linked List',
        slug: 'reverse-a-doubly-linked-list',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/reverse-a-doubly-linked-list/1',
        external_link: 'https://www.youtube.com/watch?v=u3WUW2qe6ww',
        description: 'Reverse the direction of all prev and next pointers in a Doubly Linked List.',
        examples: 'Input: 1 <-> 2 <-> 3 <-> 4\nOutput: 4 <-> 3 <-> 2 <-> 1',
        approach: 'Iterate through all nodes, swapping each node prev and next pointers. The last node visited becomes the new head.',
        solution_code: `Node* reverseDLL(Node* head) {\n    if (!head || !head->next) return head;\n    Node* curr = head;\n    Node* last = nullptr;\n    while (curr) {\n        last = curr->prev;\n        curr->prev = curr->next;\n        curr->next = last;\n        curr = curr->prev;\n    }\n    return last ? last->prev : head;\n}\n// Time: O(n)  Space: O(1)`,
        display_order: 12
      }
    ];

    for (const p of s2Problems) {
      await insertProblem(sub2Id, p);
      console.log(`Inserted problem: ${p.title}`);
    }

    console.log('Linked-List Part 1 Seeding Complete (27 problems)!');
    process.exit(0);
  } catch (err) {
    console.error('Error in seedLLPart1:', err);
    process.exit(1);
  }
}

seedLLPart1();
