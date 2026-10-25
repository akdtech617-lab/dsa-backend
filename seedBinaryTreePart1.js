require('dotenv').config();
const db = require('./src/config/db');

async function seedBinaryTreesPart1() {
  try {
    console.log('Starting seed for Binary Trees Part 1...');
    const courseId = 'd2284cdb-751f-40f0-b7f2-c9ca6c277efe';

    // Insert Topic
    const topicQuery = `
      INSERT INTO topics (course_id, title, slug, description, display_order)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (course_id, slug) DO UPDATE 
      SET title = EXCLUDED.title, 
          description = EXCLUDED.description, 
          display_order = EXCLUDED.display_order
      RETURNING id;
    `;
    const topicRes = await db.query(topicQuery, [
      courseId,
      'Binary Trees',
      'binary-trees',
      'Master binary tree representations, depth-first and breadth-first traversals, and core tree interview problems.',
      3
    ]);
    const topicId = topicRes.rows[0].id;
    console.log(`Topic "Binary Trees" inserted/updated with ID: ${topicId}`);

    // Insert Subtopics
    const subtopics = [
      { title: 'Theory/Traversals', slug: 'theory-traversals', display_order: 0, video_url: null },
      { title: 'Medium Problems', slug: 'medium-problems', display_order: 1, video_url: null }
    ];

    const subtopicIds = {};
    for (const st of subtopics) {
      const stQuery = `
        INSERT INTO subtopics (topic_id, title, slug, description, display_order, video_url)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (topic_id, slug) DO UPDATE 
        SET title = EXCLUDED.title, 
            display_order = EXCLUDED.display_order,
            video_url = EXCLUDED.video_url
        RETURNING id;
      `;
      const stRes = await db.query(stQuery, [
        topicId,
        st.title,
        st.slug,
        "Master " + st.title,
        st.display_order,
        st.video_url
      ]);
      subtopicIds[st.slug] = stRes.rows[0].id;
      console.log(`Subtopic "${st.title}" inserted/updated with ID: ${stRes.rows[0].id}`);
    }

    // Insert Problems
    const problems = [
      // Subtopic 1: Theory/Traversals
      {
        subtopic_slug: 'theory-traversals',
        title: 'Introduction',
        slug: 'introduction',
        category: 'interview',
        difficulty: 'easy',
        platform_url: 'https://practice.geeksforgeeks.org/problems/binary-tree-representation/1',
        external_link: 'https://www.youtube.com/watch?v=ctCpP03SmQg',
        display_order: 0,
        description: "Understand the basic representation of a Binary Tree in C++ and its core properties. A tree consists of nodes where each node contains a value, a left pointer, and a right pointer.",
        examples: "Input: Array representing level order = [1, 2, 3]\nOutput: A tree with root 1, left child 2, right child 3.",
        approach: "To construct a basic binary tree node, we define a struct or class in C++ with an integer data field, and two pointers (left and right) initialized to NULL.",
        solution_code: `struct Node {
    int data;
    Node* left;
    Node* right;
    
    Node(int val) {
        data = val;
        left = right = NULL;
    }
};

class Solution {
public:
    void create_tree(node* root, vector<int> &vec) {
        // Time Complexity: O(N) where N is number of nodes
        // Space Complexity: O(N) for queue
        if (vec.empty()) return;
        queue<node*> q;
        q.push(root);
        int i = 1;
        while (!q.empty() && i < vec.size()) {
            node* curr = q.front();
            q.pop();
            if (i < vec.size()) {
                curr->left = newNode(vec[i++]);
                q.push(curr->left);
            }
            if (i < vec.size()) {
                curr->right = newNode(vec[i++]);
                q.push(curr->right);
            }
        }
    }
};`
      },
      {
        subtopic_slug: 'theory-traversals',
        title: 'Inorder Traversal',
        slug: 'inorder-traversal',
        category: 'interview',
        difficulty: 'easy',
        platform_url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/',
        external_link: 'https://www.youtube.com/watch?v=Z_NEgB8dWio',
        display_order: 1,
        description: "Given the root of a binary tree, return the inorder traversal of its nodes' values. Inorder traversal visits the left subtree, then the root, then the right subtree.",
        examples: "Input: root = [1,null,2,3]\nOutput: [1,3,2]",
        approach: "We can use recursion or an iterative approach with a stack. In recursion, we call the function on the left child, add the root's value to the result, and then call the function on the right child.",
        solution_code: `class Solution {
public:
    void inorder(TreeNode* root, vector<int>& res) {
        if (!root) return;
        inorder(root->left, res);
        res.push_back(root->val);
        inorder(root->right, res);
    }
    vector<int> inorderTraversal(TreeNode* root) {
        // Time Complexity: O(N)
        // Space Complexity: O(N) for recursion stack
        vector<int> res;
        inorder(root, res);
        return res;
    }
};`
      },
      {
        subtopic_slug: 'theory-traversals',
        title: 'Preorder Traversal',
        slug: 'preorder-traversal',
        category: 'interview',
        difficulty: 'easy',
        platform_url: 'https://leetcode.com/problems/binary-tree-preorder-traversal/',
        external_link: 'https://www.youtube.com/watch?v=RlUhorGQ368',
        display_order: 2,
        description: "Given the root of a binary tree, return the preorder traversal of its nodes' values. Preorder traversal visits the root, then the left subtree, then the right subtree.",
        examples: "Input: root = [1,null,2,3]\nOutput: [1,2,3]",
        approach: "Using recursion, first add the root's value, then traverse the left subtree, and finally traverse the right subtree.",
        solution_code: `class Solution {
public:
    void preorder(TreeNode* root, vector<int>& res) {
        if (!root) return;
        res.push_back(root->val);
        preorder(root->left, res);
        preorder(root->right, res);
    }
    vector<int> preorderTraversal(TreeNode* root) {
        // Time Complexity: O(N)
        // Space Complexity: O(N) auxiliary stack space
        vector<int> res;
        preorder(root, res);
        return res;
    }
};`
      },
      {
        subtopic_slug: 'theory-traversals',
        title: 'Postorder Traversal',
        slug: 'postorder-traversal',
        category: 'interview',
        difficulty: 'easy',
        platform_url: 'https://leetcode.com/problems/binary-tree-postorder-traversal/',
        external_link: 'https://www.youtube.com/watch?v=COQOU6klsBg',
        display_order: 3,
        description: "Given the root of a binary tree, return the postorder traversal of its nodes' values. Postorder traversal visits the left subtree, the right subtree, and then the root.",
        examples: "Input: root = [1,null,2,3]\nOutput: [3,2,1]",
        approach: "Recursively traverse the left subtree, then the right subtree, and lastly append the root's value to the result array.",
        solution_code: `class Solution {
public:
    void postorder(TreeNode* root, vector<int>& res) {
        if (!root) return;
        postorder(root->left, res);
        postorder(root->right, res);
        res.push_back(root->val);
    }
    vector<int> postorderTraversal(TreeNode* root) {
        // Time Complexity: O(N)
        // Space Complexity: O(N) auxiliary stack space
        vector<int> res;
        postorder(root, res);
        return res;
    }
};`
      },
      {
        subtopic_slug: 'theory-traversals',
        title: 'Level Order Traversal',
        slug: 'level-order-traversal',
        category: 'interview',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
        external_link: 'https://www.youtube.com/watch?v=EoAsWbO7sqg',
        display_order: 4,
        description: "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
        examples: "Input: root = [3,9,20,null,null,15,7]\nOutput: [[3],[9,20],[15,7]]",
        approach: "Use a queue to keep track of nodes at the current level. Process all nodes in the queue (which represents one level), add their children to the queue, and store the level's values.",
        solution_code: `class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        // Time Complexity: O(N)
        // Space Complexity: O(N) for queue
        vector<vector<int>> ans;
        if (!root) return ans;
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            int size = q.size();
            vector<int> level;
            for (int i = 0; i < size; i++) {
                TreeNode* node = q.front();
                q.pop();
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
                level.push_back(node->val);
            }
            ans.push_back(level);
        }
        return ans;
    }
};`
      },
      {
        subtopic_slug: 'theory-traversals',
        title: 'Pre, Post, Inorder in one traversal',
        slug: 'all-traversals',
        category: 'interview',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/all-traversals/1',
        external_link: 'https://www.youtube.com/watch?v=ySp2epYvgTE',
        display_order: 5,
        description: "Perform Preorder, Inorder, and Postorder traversals of a binary tree in a single pass using a stack.",
        examples: "Input: root = [1, 2, 3]\nOutput: Pre: [1, 2, 3], In: [2, 1, 3], Post: [2, 3, 1]",
        approach: "Use a stack storing pairs of (Node, Integer). The integer represents the state (1 = Preorder, 2 = Inorder, 3 = Postorder). Depending on the state, add to the respective list and transition states, pushing left or right children as needed.",
        solution_code: `vector<vector<int>> getTreeTraversal(TreeNode *root){
    // Time Complexity: O(N)
    // Space Complexity: O(N)
    vector<int> pre, in, post;
    if (root == NULL) return {in, pre, post};
    stack<pair<TreeNode*, int>> st;
    st.push({root, 1});
    while (!st.empty()) {
        auto it = st.top();
        st.pop();
        if (it.second == 1) {
            pre.push_back(it.first->data);
            it.second++;
            st.push(it);
            if (it.first->left != NULL) {
                st.push({it.first->left, 1});
            }
        }
        else if (it.second == 2) {
            in.push_back(it.first->data);
            it.second++;
            st.push(it);
            if (it.first->right != NULL) {
                st.push({it.first->right, 1});
            }
        }
        else {
            post.push_back(it.first->data);
        }
    }
    return {in, pre, post};
}`
      },
      
      // Subtopic 2: Medium Problems
      {
        subtopic_slug: 'medium-problems',
        title: 'Maximum Depth in BT',
        slug: 'maximum-depth-in-bt',
        category: 'interview',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
        external_link: 'https://www.youtube.com/watch?v=eD3tm246go4',
        display_order: 0,
        description: "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
        examples: "Input: root = [3,9,20,null,null,15,7]\nOutput: 3",
        approach: "Recursively find the maximum depth of the left subtree and the right subtree, then return 1 + the maximum of the two.",
        solution_code: `class Solution {
public:
    int maxDepth(TreeNode* root) {
        // Time Complexity: O(N)
        // Space Complexity: O(H) where H is the height of the tree
        if (root == NULL) return 0;
        int lh = maxDepth(root->left);
        int rh = maxDepth(root->right);
        return 1 + max(lh, rh);
    }
};`
      },
      {
        subtopic_slug: 'medium-problems',
        title: 'Check if two trees are identical or not',
        slug: 'check-if-two-trees-are-identical',
        category: 'interview',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/same-tree/',
        external_link: 'https://www.youtube.com/watch?v=BhuvF_-PWS0',
        display_order: 1,
        description: "Given the roots of two binary trees p and q, write a function to check if they are the same or not. Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.",
        examples: "Input: p = [1,2,3], q = [1,2,3]\nOutput: true\n\nInput: p = [1,2], q = [1,null,2]\nOutput: false",
        approach: "Use a simple recursive DFS approach. Check if current nodes are equal, then recursively check left and right subtrees.",
        solution_code: `class Solution {
public:
    bool isSameTree(TreeNode* p, TreeNode* q) {
        // Time Complexity: O(N)
        // Space Complexity: O(H) auxiliary space
        if (p == NULL || q == NULL) {
            return (p == q);
        }
        return (p->val == q->val) 
            && isSameTree(p->left, q->left) 
            && isSameTree(p->right, q->right);
    }
};`
      },
      {
        subtopic_slug: 'medium-problems',
        title: 'Check for balanced binary tree',
        slug: 'check-for-balanced-binary-tree',
        category: 'interview',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/balanced-binary-tree/',
        external_link: 'https://www.youtube.com/watch?v=Yt50cF6996w',
        display_order: 2,
        description: "Given a binary tree, determine if it is height-balanced. A height-balanced binary tree is defined as a binary tree in which the left and right subtrees of every node differ in height by no more than 1.",
        examples: "Input: root = [3,9,20,null,null,15,7]\nOutput: true",
        approach: "Modify the height function. If at any node the absolute difference in heights of left and right subtrees is greater than 1, return -1 indicating it's unbalanced. Otherwise, return the height.",
        solution_code: `class Solution {
public:
    int dfsHeight(TreeNode *root) {
        if (root == NULL) return 0;
        
        int leftHeight = dfsHeight(root->left);
        if (leftHeight == -1) return -1;
        
        int rightHeight = dfsHeight(root->right);
        if (rightHeight == -1) return -1;
        
        if (abs(leftHeight - rightHeight) > 1) return -1;
        return max(leftHeight, rightHeight) + 1;
    }
    bool isBalanced(TreeNode* root) {
        // Time Complexity: O(N)
        // Space Complexity: O(H)
        return dfsHeight(root) != -1;
    }
};`
      },
      {
        subtopic_slug: 'medium-problems',
        title: 'Diameter of Binary Tree',
        slug: 'diameter-of-binary-tree',
        category: 'interview',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/diameter-of-binary-tree/',
        external_link: 'https://www.youtube.com/watch?v=Rezetez59Nk',
        display_order: 3,
        description: "The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root.",
        examples: "Input: root = [1,2,3,4,5]\nOutput: 3\nExplanation: 3 is the length of the path [4,2,1,3] or [5,2,1,3].",
        approach: "Calculate the height of left and right subtrees for every node. The longest path passing through a node is left_height + right_height. We keep updating a global maximum with this value while computing heights.",
        solution_code: `class Solution {
public:
    int height(TreeNode* node, int& diameter) {
        if (!node) return 0;
        int lh = height(node->left, diameter);
        int rh = height(node->right, diameter);
        diameter = max(diameter, lh + rh);
        return 1 + max(lh, rh);
    }
    int diameterOfBinaryTree(TreeNode* root) {
        // Time Complexity: O(N)
        // Space Complexity: O(H)
        int diameter = 0;
        height(root, diameter);
        return diameter;
    }
};`
      },
      {
        subtopic_slug: 'medium-problems',
        title: 'Maximum path sum',
        slug: 'maximum-path-sum',
        category: 'interview',
        difficulty: 'hard',
        platform_url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/',
        external_link: 'https://www.youtube.com/watch?v=WszrfSwMz58',
        display_order: 4,
        description: "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. Find the maximum path sum of any non-empty path.",
        examples: "Input: root = [-10,9,20,null,null,15,7]\nOutput: 42\nExplanation: The optimal path is 15 -> 20 -> 7 with a path sum of 15 + 20 + 7 = 42.",
        approach: "Recursively compute the max path sum from the left and right children. Ignore negative sums by treating them as 0. The max path through the current node is node.val + leftMax + rightMax. Update the global max with this value and return node.val + max(leftMax, rightMax).",
        solution_code: `class Solution {
public:
    int maxPathDown(TreeNode* node, int& maxi) {
        if (node == NULL) return 0;
        int left = max(0, maxPathDown(node->left, maxi));
        int right = max(0, maxPathDown(node->right, maxi));
        maxi = max(maxi, left + right + node->val);
        return max(left, right) + node->val;
    }
    int maxPathSum(TreeNode* root) {
        // Time Complexity: O(N)
        // Space Complexity: O(H)
        int maxi = INT_MIN;
        maxPathDown(root, maxi);
        return maxi;
    }
};`
      },
      {
        subtopic_slug: 'medium-problems',
        title: 'Check for symmetrical BTs',
        slug: 'check-for-symmetrical-bts',
        category: 'interview',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/symmetric-tree/',
        external_link: 'https://www.youtube.com/watch?v=nKggNAiEpBE',
        display_order: 5,
        description: "Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).",
        examples: "Input: root = [1,2,2,3,4,4,3]\nOutput: true",
        approach: "Write a helper function that takes two nodes. They are symmetric if their values are equal, the left child of the first is a mirror of the right child of the second, and vice versa.",
        solution_code: `class Solution {
public:
    bool isSymmetricHelp(TreeNode* left, TreeNode* right) {
        if (left == NULL || right == NULL) return left == right;
        if (left->val != right->val) return false;
        return isSymmetricHelp(left->left, right->right) 
            && isSymmetricHelp(left->right, right->left);
    }
    bool isSymmetric(TreeNode* root) {
        // Time Complexity: O(N)
        // Space Complexity: O(H)
        return root == NULL || isSymmetricHelp(root->left, root->right);
    }
};`
      },
      {
        subtopic_slug: 'medium-problems',
        title: 'Children Sum Property in Binary Tree',
        slug: 'children-sum-property',
        category: 'interview',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/children-sum-parent/1',
        external_link: 'https://www.youtube.com/watch?v=fnmisPM6cVo',
        display_order: 6,
        description: "Given a binary tree, check whether every node's value is equal to the sum of its left and right children's values. For leaf nodes, this condition is considered true.",
        examples: "Input: root = [10, 4, 6, null, null, 3, 3]\nOutput: 1",
        approach: "Recursively traverse the tree. If both children are null, return true. Otherwise, sum the left and right children values and check if it equals the current node's value. Then recursively verify both children.",
        solution_code: `class Solution {
public:
    int isSumProperty(Node *root) {
        // Time Complexity: O(N)
        // Space Complexity: O(H)
        if (root == NULL || (root->left == NULL && root->right == NULL)) return 1;
        
        int sum = 0;
        if (root->left) sum += root->left->data;
        if (root->right) sum += root->right->data;
        
        if (root->data == sum && isSumProperty(root->left) && isSumProperty(root->right)) {
            return 1;
        }
        return 0;
    }
};`
      }
    ];

    for (const prob of problems) {
      const subtopicId = subtopicIds[prob.subtopic_slug];
      
      const probQuery = `
        INSERT INTO problems (
          subtopic_id, title, slug, category, difficulty, 
          platform_url, external_link, description, examples, 
          approach, solution_code, display_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (subtopic_id, slug) DO UPDATE 
        SET title = EXCLUDED.title,
            category = EXCLUDED.category,
            difficulty = EXCLUDED.difficulty,
            platform_url = EXCLUDED.platform_url,
            external_link = EXCLUDED.external_link,
            description = EXCLUDED.description,
            examples = EXCLUDED.examples,
            approach = EXCLUDED.approach,
            solution_code = EXCLUDED.solution_code,
            display_order = EXCLUDED.display_order
        RETURNING id;
      `;

      const probRes = await db.query(probQuery, [
        subtopicId,
        prob.title,
        prob.slug,
        prob.category,
        prob.difficulty,
        prob.platform_url,
        prob.external_link,
        prob.description,
        prob.examples,
        prob.approach,
        prob.solution_code,
        prob.display_order
      ]);

      console.log(`Problem "${prob.title}" inserted/updated with ID: ${probRes.rows[0].id}`);
    }

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding binary trees part 1:', error);
    process.exit(1);
  }
}

seedBinaryTreesPart1();
