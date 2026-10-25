const requireDotenv = require('dotenv');
requireDotenv.config();
const pool = require('./src/config/db');

const seedBinaryTreePart2 = async () => {
    console.log('Starting seed script for Binary Trees Part 2...');
    try {
        const courseId = 'd2284cdb-751f-40f0-b7f2-c9ca6c277efe';
        
        // Find topic
        const topicQuery = await pool.query(
            `SELECT id FROM topics WHERE slug IN ('binary-trees', 'trees') AND course_id = $1 LIMIT 1`,
            [courseId]
        );
        
        if (topicQuery.rows.length === 0) {
            throw new Error('Topic "binary-trees" or "trees" not found. Please ensure the topic exists.');
        }
        const topicId = topicQuery.rows[0].id;
        
        // Subtopics to insert
        const subtopics = [
            {
                title: 'FAQs',
                slug: 'faqs',
                description: 'Frequently asked medium to hard interview questions on Binary Trees.',
                video_url: null,
                display_order: 2
            },
            {
                title: 'Construction Problems',
                slug: 'construction-problems',
                description: 'Constructing Binary Trees from given traversal arrays.',
                video_url: null,
                display_order: 3
            },
            {
                title: 'Traversal in Constant Space',
                slug: 'traversal-in-constant-space',
                description: 'Morris Traversals for O(1) space complexity.',
                video_url: null,
                display_order: 4
            }
        ];
        
        const subtopicIds = {};
        for (const st of subtopics) {
            const res = await pool.query(
                `INSERT INTO subtopics (id, topic_id, title, slug, description, video_url, display_order)
                 VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6)
                 ON CONFLICT (topic_id, slug) DO UPDATE 
                 SET title = EXCLUDED.title,
                     description = EXCLUDED.description,
                     video_url = EXCLUDED.video_url,
                     display_order = EXCLUDED.display_order
                 RETURNING id`,
                [topicId, st.title, st.slug, st.description, st.video_url, st.display_order]
            );
            subtopicIds[st.slug] = res.rows[0].id;
            console.log(`Upserted subtopic: ${st.title}`);
        }
        
        const problems = [
            // FAQs
            {
                subtopic_slug: 'faqs',
                title: 'Zig Zag or Spiral Traversal',
                slug: 'binary-tree-zigzag-level-order-traversal',
                category: 'interview',
                difficulty: 'medium',
                platform_url: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/',
                external_link: 'https://www.youtube.com/watch?v=3OXWEdlIG64',
                description: `Given the root of a binary tree, return the zigzag level order traversal of its nodes' values. (i.e., from left to right, then right to left for the next level and alternate between).`,
                examples: `Input: root = [3,9,20,null,null,15,7]
Output: [[3],[20,9],[15,7]]

Input: root = [1]
Output: [[1]]`,
                approach: `Use Level Order Traversal (BFS) with a queue. Maintain a flag 'leftToRight' to track the direction of insertion for the current level. For each level, determine the size, create an array, and place nodes either from front-to-back or back-to-front based on the flag. Toggle the flag after each level.`,
                solution_code: `class Solution {
public:
    vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
        vector<vector<int>> result;
        if (!root) return result;
        
        queue<TreeNode*> q;
        q.push(root);
        bool leftToRight = true;
        
        while (!q.empty()) {
            int size = q.size();
            vector<int> row(size);
            
            for (int i = 0; i < size; i++) {
                TreeNode* node = q.front();
                q.pop();
                
                int index = leftToRight ? i : (size - 1 - i);
                row[index] = node->val;
                
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
            
            leftToRight = !leftToRight;
            result.push_back(row);
        }
        
        return result;
    }
};
// Time Complexity: O(N)
// Space Complexity: O(N)`,
                display_order: 0
            },
            {
                subtopic_slug: 'faqs',
                title: 'Boundary Traversal',
                slug: 'boundary-traversal',
                category: 'interview',
                difficulty: 'medium',
                platform_url: 'https://practice.geeksforgeeks.org/problems/boundary-traversal-of-binary-tree/1',
                external_link: 'https://www.youtube.com/watch?v=0ca1nvR0be4',
                description: `Given a Binary Tree, find its Boundary Traversal. The traversal should be in the following order: Left boundary nodes, Leaf nodes, and Reverse right boundary nodes.`,
                examples: `Input:
        1 
      /   \\
     2     3  
    / \\   / \\ 
   4   5 6   7
      / \\
     8   9
Output: 1 2 4 8 9 6 7 3`,
                approach: `Divide the problem into 3 parts:
1. Traverse the left boundary excluding leaf nodes.
2. Traverse all leaf nodes.
3. Traverse the right boundary excluding leaf nodes, then reverse it before adding to the result.
Concatenate all three results.`,
                solution_code: `class Solution {
    bool isLeaf(Node* root) {
        return !root->left && !root->right;
    }
    
    void addLeftBoundary(Node* root, vector<int>& res) {
        Node* curr = root->left;
        while (curr) {
            if (!isLeaf(curr)) res.push_back(curr->data);
            if (curr->left) curr = curr->left;
            else curr = curr->right;
        }
    }
    
    void addRightBoundary(Node* root, vector<int>& res) {
        Node* curr = root->right;
        vector<int> temp;
        while (curr) {
            if (!isLeaf(curr)) temp.push_back(curr->data);
            if (curr->right) curr = curr->right;
            else curr = curr->left;
        }
        for (int i = temp.size() - 1; i >= 0; --i) {
            res.push_back(temp[i]);
        }
    }
    
    void addLeaves(Node* root, vector<int>& res) {
        if (isLeaf(root)) {
            res.push_back(root->data);
            return;
        }
        if (root->left) addLeaves(root->left, res);
        if (root->right) addLeaves(root->right, res);
    }
    
public:
    vector <int> boundary(Node *root) {
        vector<int> res;
        if (!root) return res;
        
        if (!isLeaf(root)) res.push_back(root->data);
        
        addLeftBoundary(root, res);
        addLeaves(root, res);
        addRightBoundary(root, res);
        
        return res;
    }
};
// Time Complexity: O(N)
// Space Complexity: O(H) for recursion stack`,
                display_order: 1
            },
            {
                subtopic_slug: 'faqs',
                title: 'Vertical Order Traversal',
                slug: 'vertical-order-traversal',
                category: 'interview',
                difficulty: 'hard',
                platform_url: 'https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/',
                external_link: 'https://www.youtube.com/watch?v=q_a6lpb36Q8',
                description: `Calculate the vertical order traversal of the binary tree. For each node at position (row, col), its left and right children will be at positions (row + 1, col - 1) and (row + 1, col + 1). Sort by column, then row, then value.`,
                examples: `Input: root = [3,9,20,null,null,15,7]
Output: [[9],[3,15],[20],[7]]`,
                approach: `Use a queue for BFS traversal storing {node, {row, col}}. Use a map of maps/multisets: map<col, map<row, multiset<int>>> to automatically keep the elements sorted by column, then row, then value. Finally, iterate over the map to build the result.`,
                solution_code: `class Solution {
public:
    vector<vector<int>> verticalTraversal(TreeNode* root) {
        map<int, map<int, multiset<int>>> nodes;
        queue<pair<TreeNode*, pair<int, int>>> q; // {node, {x, y}}
        
        if (root) q.push({root, {0, 0}});
        
        while (!q.empty()) {
            auto p = q.front();
            q.pop();
            TreeNode* node = p.first;
            int x = p.second.first; // col
            int y = p.second.second; // row
            
            nodes[x][y].insert(node->val);
            
            if (node->left) q.push({node->left, {x - 1, y + 1}});
            if (node->right) q.push({node->right, {x + 1, y + 1}});
        }
        
        vector<vector<int>> ans;
        for (auto p : nodes) {
            vector<int> col;
            for (auto q : p.second) {
                col.insert(col.end(), q.second.begin(), q.second.end());
            }
            ans.push_back(col);
        }
        
        return ans;
    }
};
// Time Complexity: O(N * logN * logN * logN)
// Space Complexity: O(N)`,
                display_order: 2
            },
            {
                subtopic_slug: 'faqs',
                title: 'Top View of BT',
                slug: 'top-view-of-bt',
                category: 'interview',
                difficulty: 'medium',
                platform_url: 'https://practice.geeksforgeeks.org/problems/top-view-of-binary-tree/1',
                external_link: 'https://www.youtube.com/watch?v=Et9OCDNvJ78',
                description: `Given below is a binary tree. The task is to print the top view of the binary tree. Top view of a binary tree is the set of nodes visible when the tree is viewed from the top.`,
                examples: `Input:
      1
    /   \\
   2     3
Output: 2 1 3`,
                approach: `Use level order traversal (BFS) with a queue storing {node, line}. Maintain a map of line to node data. For the top view, if a line doesn't exist in the map, insert the node data. Since it's BFS, the first node encountered at a horizontal line will be the top-most node.`,
                solution_code: `class Solution
{
    public:
    vector<int> topView(Node *root)
    {
        vector<int> ans;
        if(root == NULL) return ans;
        
        map<int, int> mpp; // line -> node_val
        queue<pair<Node*, int>> q; // {node, line}
        
        q.push({root, 0});
        while(!q.empty()) {
            auto it = q.front();
            q.pop();
            Node* node = it.first;
            int line = it.second;
            
            if(mpp.find(line) == mpp.end()) {
                mpp[line] = node->data;
            }
            
            if(node->left) q.push({node->left, line - 1});
            if(node->right) q.push({node->right, line + 1});
        }
        
        for(auto it : mpp) {
            ans.push_back(it.second);
        }
        return ans;
    }
};
// Time Complexity: O(N logN)
// Space Complexity: O(N)`,
                display_order: 3
            },
            {
                subtopic_slug: 'faqs',
                title: 'Bottom view of BT',
                slug: 'bottom-view-of-bt',
                category: 'interview',
                difficulty: 'medium',
                platform_url: 'https://practice.geeksforgeeks.org/problems/bottom-view-of-binary-tree/1',
                external_link: 'https://www.youtube.com/watch?v=0FtVY6I4pB8',
                description: `Given a binary tree, print the bottom view from left to right. A node is included in bottom view if it can be seen when we look at the tree from bottom.`,
                examples: `Input:
       1
     /   \\
    2     3
   / \\   / \\
  4   5 6   7
Output: 4 2 6 3 7`,
                approach: `Use level order traversal (BFS) with a queue tracking horizontal distance. Maintain a map of line -> node val. Continually update the map for each horizontal line; since it's BFS, the last updated value for a line will be the bottom-most node.`,
                solution_code: `class Solution {
  public:
    vector <int> bottomView(Node *root) {
        vector<int> ans;
        if(root == NULL) return ans;
        
        map<int, int> mpp;
        queue<pair<Node*, int>> q;
        
        q.push({root, 0});
        while(!q.empty()) {
            auto it = q.front();
            q.pop();
            Node* node = it.first;
            int line = it.second;
            
            // Always overwrite to keep the bottom-most node
            mpp[line] = node->data;
            
            if(node->left) q.push({node->left, line - 1});
            if(node->right) q.push({node->right, line + 1});
        }
        
        for(auto it : mpp) {
            ans.push_back(it.second);
        }
        return ans;
    }
};
// Time Complexity: O(N logN)
// Space Complexity: O(N)`,
                display_order: 4
            },
            {
                subtopic_slug: 'faqs',
                title: 'Right/Left View of BT',
                slug: 'binary-tree-right-side-view',
                category: 'interview',
                difficulty: 'medium',
                platform_url: 'https://leetcode.com/problems/binary-tree-right-side-view/',
                external_link: 'https://www.youtube.com/watch?v=KV4mRzTjlAk',
                description: `Given the root of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.`,
                examples: `Input: root = [1,2,3,null,5,null,4]
Output: [1,3,4]`,
                approach: `Perform a modified pre-order traversal where we visit the Right node before the Left node (Root -> Right -> Left). Maintain a level variable. If the level matches the size of the result data structure, add the node's value.`,
                solution_code: `class Solution {
public:
    void recursion(TreeNode* root, int level, vector<int>& res) {
        if (!root) return;
        if (res.size() == level) res.push_back(root->val);
        
        recursion(root->right, level + 1, res);
        recursion(root->left, level + 1, res);
    }
    
    vector<int> rightSideView(TreeNode* root) {
        vector<int> res;
        recursion(root, 0, res);
        return res;
    }
};
// Time Complexity: O(N)
// Space Complexity: O(H)`,
                display_order: 5
            },
            {
                subtopic_slug: 'faqs',
                title: 'Print root to leaf path in BT',
                slug: 'binary-tree-paths',
                category: 'interview',
                difficulty: 'medium',
                platform_url: 'https://leetcode.com/problems/binary-tree-paths/',
                external_link: 'https://www.youtube.com/watch?v=fmflMqVOC7k',
                description: `Given the root of a binary tree, return all root-to-leaf paths in any order. A leaf is a node with no children.`,
                examples: `Input: root = [1,2,3,null,5]
Output: ["1->2->5","1->3"]`,
                approach: `Use DFS. Keep appending the current node's value to a string. If we reach a leaf node, push the string into the answer array. Otherwise, recursively call for left and right children, appending "->" before passing the string.`,
                solution_code: `class Solution {
public:
    void dfs(TreeNode* root, string path, vector<string>& paths) {
        if (!root) return;
        path += to_string(root->val);
        if (!root->left && !root->right) {
            paths.push_back(path);
            return;
        }
        if (root->left) dfs(root->left, path + "->", paths);
        if (root->right) dfs(root->right, path + "->", paths);
    }
    
    vector<string> binaryTreePaths(TreeNode* root) {
        vector<string> paths;
        if (root) dfs(root, "", paths);
        return paths;
    }
};
// Time Complexity: O(N)
// Space Complexity: O(H) for stack + O(N * H) for paths strings`,
                display_order: 6
            },
            {
                subtopic_slug: 'faqs',
                title: 'LCA in BT',
                slug: 'lowest-common-ancestor-of-a-binary-tree',
                category: 'interview',
                difficulty: 'hard',
                platform_url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/',
                external_link: 'https://www.youtube.com/watch?v=_-QHfMDde90',
                description: `Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.`,
                examples: `Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
Output: 3`,
                approach: `Traverse the tree recursively. If current node is null, p, or q, return the current node. Recurse for left and right. If both left and right return a valid node, the current node is the LCA. Otherwise, return the non-null node.`,
                solution_code: `class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if (!root || root == p || root == q) return root;
        
        TreeNode* left = lowestCommonAncestor(root->left, p, q);
        TreeNode* right = lowestCommonAncestor(root->right, p, q);
        
        if (left && right) return root;
        
        return left ? left : right;
    }
};
// Time Complexity: O(N)
// Space Complexity: O(H)`,
                display_order: 7
            },
            {
                subtopic_slug: 'faqs',
                title: 'Maximum Width of BT',
                slug: 'maximum-width-of-binary-tree',
                category: 'interview',
                difficulty: 'hard',
                platform_url: 'https://leetcode.com/problems/maximum-width-of-binary-tree/',
                external_link: 'https://www.youtube.com/watch?v=ZbybYvcVLks',
                description: `Given the root of a binary tree, return the maximum width of the given tree. The width of one level is defined as the length between the end-nodes (the leftmost and rightmost non-null nodes), where the null nodes between the end-nodes that would be present in a complete binary tree extending down to that level are also counted into the length calculation.`,
                examples: `Input: root = [1,3,2,5,3,null,9]
Output: 4
Explanation: The maximum width exists in the third level with length 4 (5,3,null,9).`,
                approach: `Level order traversal where we assign indices to nodes like in a segment tree: 2*i for left child and 2*i+1 for right child. Width of level = (last index) - (first index) + 1. To prevent integer overflow, normalize the index by subtracting the first index of that level.`,
                solution_code: `class Solution {
public:
    int widthOfBinaryTree(TreeNode* root) {
        if (!root) return 0;
        int ans = 0;
        queue<pair<TreeNode*, long long>> q;
        q.push({root, 0});
        
        while (!q.empty()) {
            int size = q.size();
            long long mmin = q.front().second;
            long long first, last;
            for (int i = 0; i < size; i++) {
                long long cur_id = q.front().second - mmin;
                TreeNode* node = q.front().first;
                q.pop();
                if (i == 0) first = cur_id;
                if (i == size - 1) last = cur_id;
                if (node->left)
                    q.push({node->left, cur_id * 2 + 1});
                if (node->right)
                    q.push({node->right, cur_id * 2 + 2});
            }
            ans = max(ans, (int)(last - first + 1));
        }
        return ans;
    }
};
// Time Complexity: O(N)
// Space Complexity: O(N)`,
                display_order: 8
            },
            {
                subtopic_slug: 'faqs',
                title: 'Print all nodes at a distance of K in BT',
                slug: 'all-nodes-distance-k-in-binary-tree',
                category: 'interview',
                difficulty: 'hard',
                platform_url: 'https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/',
                external_link: 'https://www.youtube.com/watch?v=i9ORlEy6EsI',
                description: `Given the root of a binary tree, the value of a target node target, and an integer k, return an array of the values of all nodes that have a distance k from the target node.`,
                examples: `Input: root = [3,5,1,6,2,0,8,null,null,7,4], target = 5, k = 2
Output: [7,4,1]`,
                approach: `First, perform a traversal to map each node to its parent pointer. Then perform BFS starting from the target node, spreading out to left child, right child, and parent. Use a visited set to avoid going backwards. After K steps, all nodes in the queue are at distance K.`,
                solution_code: `class Solution {
    void markParents(TreeNode* root, unordered_map<TreeNode*, TreeNode*>& parent_track, TreeNode* target) {
        queue<TreeNode*> q;
        q.push(root);
        while(!q.empty()) { 
            TreeNode* current = q.front(); 
            q.pop();
            if(current->left) {
                parent_track[current->left] = current;
                q.push(current->left);
            }
            if(current->right) {
                parent_track[current->right] = current;
                q.push(current->right);
            }
        }
    }
public:
    vector<int> distanceK(TreeNode* root, TreeNode* target, int k) {
        unordered_map<TreeNode*, TreeNode*> parent_track;
        markParents(root, parent_track, target); 
        
        unordered_map<TreeNode*, bool> visited;
        queue<TreeNode*> q;
        q.push(target);
        visited[target] = true;
        int curr_level = 0;
        
        while(!q.empty()) {
            int size = q.size();
            if(curr_level++ == k) break;
            for(int i = 0; i < size; i++) {
                TreeNode* current = q.front(); q.pop();
                if(current->left && !visited[current->left]) {
                    q.push(current->left);
                    visited[current->left] = true;
                }
                if(current->right && !visited[current->right]) {
                    q.push(current->right);
                    visited[current->right] = true;
                }
                if(parent_track[current] && !visited[parent_track[current]]) {
                    q.push(parent_track[current]);
                    visited[parent_track[current]] = true;
                }
            }
        }
        vector<int> result;
        while(!q.empty()) {
            result.push_back(q.front()->val);
            q.pop();
        }
        return result;
    }
};
// Time Complexity: O(N)
// Space Complexity: O(N)`,
                display_order: 9
            },
            {
                subtopic_slug: 'faqs',
                title: 'Minimum time taken to burn the BT from a given Node',
                slug: 'burning-tree',
                category: 'interview',
                difficulty: 'hard',
                platform_url: 'https://practice.geeksforgeeks.org/problems/burning-tree/1',
                external_link: 'https://www.youtube.com/watch?v=2r5wLmQfD6g',
                description: `Given a binary tree and a target node. Find the minimum time required to burn the complete binary tree if the target is set on fire. It is known that in 1 second all nodes connected to a given node get burned.`,
                examples: `Input:      
          1
        /   \\
      2      3
    /  \\      \\
   4    5      6
       / \\      \\
      7   8      9
                   \\
                   10
Target Node = 8
Output: 7`,
                approach: `Similar to Distance K problem, track parent pointers. First locate the target node and populate parent pointers. Then perform a BFS from the target node, incrementing time for each level processed until all reachable nodes (children + parents) are burned.`,
                solution_code: `class Solution {
  public:
    Node* bfsToMapParents(Node* root, unordered_map<Node*, Node*>& mpp, int start) {
        queue<Node*> q;
        q.push(root);
        Node* res;
        while(!q.empty()) {
            Node* node = q.front();
            if(node->data == start) res = node;
            q.pop();
            if(node->left) {
                mpp[node->left] = node;
                q.push(node->left);
            }
            if(node->right) {
                mpp[node->right] = node;
                q.push(node->right);
            }
        }
        return res;
    }
    
    int minTime(Node* root, int target) {
        unordered_map<Node*, Node*> mpp;
        Node* start = bfsToMapParents(root, mpp, target);
        
        unordered_map<Node*, int> vis;
        queue<Node*> q;
        q.push(start);
        vis[start] = 1;
        
        int maxi = 0;
        while(!q.empty()) {
            int sz = q.size();
            int fl = 0;
            for(int i = 0; i < sz; i++) {
                auto node = q.front();
                q.pop();
                if(node->left && !vis[node->left]) {
                    fl = 1;
                    vis[node->left] = 1;
                    q.push(node->left);
                }
                if(node->right && !vis[node->right]) {
                    fl = 1;
                    vis[node->right] = 1;
                    q.push(node->right);
                }
                if(mpp[node] && !vis[mpp[node]]) {
                    fl = 1;
                    vis[mpp[node]] = 1;
                    q.push(mpp[node]);
                }
            }
            if(fl) maxi++;
        }
        return maxi;
    }
};
// Time Complexity: O(N)
// Space Complexity: O(N)`,
                display_order: 10
            },
            {
                subtopic_slug: 'faqs',
                title: 'Count total nodes in a complete BT',
                slug: 'count-complete-tree-nodes',
                category: 'interview',
                difficulty: 'medium',
                platform_url: 'https://leetcode.com/problems/count-complete-tree-nodes/',
                external_link: 'https://www.youtube.com/watch?v=u-yWemKGWO0',
                description: `Given the root of a complete binary tree, return the number of the nodes in the tree. The tree guarantees complete property.`,
                examples: `Input: root = [1,2,3,4,5,6]
Output: 6`,
                approach: `Instead of counting nodes one by one O(N), we can leverage the complete BT property. If left boundary height == right boundary height, the subtree is perfectly complete and nodes = 2^h - 1. Otherwise, return 1 + countNodes(left) + countNodes(right).`,
                solution_code: `class Solution {
public:
    int countNodes(TreeNode* root) {
        if(!root) return 0;
        
        int hl = 0, hr = 0;
        TreeNode *l = root, *r = root;
        
        while(l) { hl++; l = l->left; }
        while(r) { hr++; r = r->right; }
        
        if(hl == hr) return (1 << hl) - 1;
        
        return 1 + countNodes(root->left) + countNodes(root->right);
    }
};
// Time Complexity: O(logN * logN)
// Space Complexity: O(logN)`,
                display_order: 11
            },
            {
                subtopic_slug: 'faqs',
                title: 'Flatten Binary Tree to Linked List',
                slug: 'flatten-binary-tree-to-linked-list',
                category: 'interview',
                difficulty: 'hard',
                platform_url: 'https://leetcode.com/problems/flatten-binary-tree-to-linked-list/',
                external_link: 'https://www.youtube.com/watch?v=sWf7k1x9XR4',
                description: `Given the root of a binary tree, flatten the tree into a "linked list". The "linked list" should use the same TreeNode class where the right child pointer points to the next node in the list and the left child pointer is always null. The "linked list" should be in the same order as a pre-order traversal of the binary tree.`,
                examples: `Input: root = [1,2,5,3,4,null,6]
Output: [1,null,2,null,3,null,4,null,5,null,6]`,
                approach: `Optimal Approach (Morris Traversal): For every node, if it has a left child, find the rightmost node of its left subtree. Connect this rightmost node to the current node's right child, then move the current node's left child to its right and make left null.`,
                solution_code: `class Solution {
public:
    void flatten(TreeNode* root) {
        TreeNode* curr = root;
        while (curr) {
            if (curr->left) {
                TreeNode* prev = curr->left;
                while (prev->right) {
                    prev = prev->right;
                }
                prev->right = curr->right;
                curr->right = curr->left;
                curr->left = NULL;
            }
            curr = curr->right;
        }
    }
};
// Time Complexity: O(N)
// Space Complexity: O(1)`,
                display_order: 12
            },
            
            // Construction Problems
            {
                subtopic_slug: 'construction-problems',
                title: 'Requirements needed to construct a unique BT',
                slug: 'unique-binary-tree-requirements',
                category: 'interview',
                difficulty: 'medium',
                platform_url: 'https://practice.geeksforgeeks.org/problems/unique-binary-tree-requirements/1',
                external_link: 'https://www.youtube.com/watch?v=9GMECGQgWrQ',
                description: `Geek wants to know the traversals required to construct a unique binary tree. Given two integers a and b representing traversals, return true if we can construct a unique tree from those traversals. (1: Preorder, 2: Inorder, 3: Postorder).`,
                examples: `Input: a = 1, b = 2
Output: 1 (True)
Explanation: Preorder and Inorder can construct a unique tree.`,
                approach: `To construct a unique binary tree, one traversal must definitely be the Inorder traversal. The other traversal can be either Preorder or Postorder. Thus, if one is 2 (Inorder) and the other is either 1 or 3, it's possible.`,
                solution_code: `class Solution
{
public:
    bool isPossible(int a, int b)
    {
        if((a == 2 && b == 1) || (a == 1 && b == 2) || (a == 2 && b == 3) || (a == 3 && b == 2)) {
            return true;
        }
        return false;
    }
};
// Time Complexity: O(1)
// Space Complexity: O(1)`,
                display_order: 0
            },
            {
                subtopic_slug: 'construction-problems',
                title: 'Construct a BT from Preorder and Inorder',
                slug: 'construct-binary-tree-from-preorder-and-inorder-traversal',
                category: 'interview',
                difficulty: 'medium',
                platform_url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/',
                external_link: 'https://www.youtube.com/watch?v=aZNaLr964g8',
                description: `Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.`,
                examples: `Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
Output: [3,9,20,null,null,15,7]`,
                approach: `The first element in preorder is always the root. Find this root in inorder array to divide the tree into left and right subtrees. Recursively build left and right subtrees. Map the inorder values to their indices for O(1) lookups.`,
                solution_code: `class Solution {
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        unordered_map<int, int> inMap;
        for (int i = 0; i < inorder.size(); i++) {
            inMap[inorder[i]] = i;
        }
        return build(preorder, 0, preorder.size() - 1, inorder, 0, inorder.size() - 1, inMap);
    }
    
    TreeNode* build(vector<int>& preorder, int preStart, int preEnd, 
                    vector<int>& inorder, int inStart, int inEnd, unordered_map<int, int>& inMap) {
        if (preStart > preEnd || inStart > inEnd) return NULL;
        
        TreeNode* root = new TreeNode(preorder[preStart]);
        int inRoot = inMap[root->val];
        int numsLeft = inRoot - inStart;
        
        root->left = build(preorder, preStart + 1, preStart + numsLeft, 
                           inorder, inStart, inRoot - 1, inMap);
        root->right = build(preorder, preStart + numsLeft + 1, preEnd, 
                            inorder, inRoot + 1, inEnd, inMap);
        
        return root;
    }
};
// Time Complexity: O(N)
// Space Complexity: O(N)`,
                display_order: 1
            },
            {
                subtopic_slug: 'construction-problems',
                title: 'Construct a BT from Postorder and Inorder',
                slug: 'construct-binary-tree-from-inorder-and-postorder-traversal',
                category: 'interview',
                difficulty: 'medium',
                platform_url: 'https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/',
                external_link: 'https://www.youtube.com/watch?v=LgLRTaEMRVc',
                description: `Given two integer arrays inorder and postorder where inorder is the inorder traversal of a binary tree and postorder is the postorder traversal of the same tree, construct and return the binary tree.`,
                examples: `Input: inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]
Output: [3,9,20,null,null,15,7]`,
                approach: `The last element in postorder is the root. Find it in inorder array to divide subtrees. Recursively build subtrees. Notice that in postorder, root is at the end, so right subtree follows left subtree. Map inorder elements to index for O(1) lookups.`,
                solution_code: `class Solution {
public:
    TreeNode* buildTree(vector<int>& inorder, vector<int>& postorder) {
        if (inorder.size() != postorder.size()) return NULL;
        unordered_map<int, int> inMap;
        for (int i = 0; i < inorder.size(); ++i)
            inMap[inorder[i]] = i;
        return build(inorder, 0, inorder.size() - 1, 
                     postorder, 0, postorder.size() - 1, inMap);
    }
    
    TreeNode* build(vector<int>& inorder, int inStart, int inEnd, 
                    vector<int>& postorder, int postStart, int postEnd, 
                    unordered_map<int, int>& inMap) {
        if (inStart > inEnd || postStart > postEnd) return NULL;
        
        TreeNode* root = new TreeNode(postorder[postEnd]);
        int inRoot = inMap[root->val];
        int numsLeft = inRoot - inStart;
        
        root->left = build(inorder, inStart, inRoot - 1, 
                           postorder, postStart, postStart + numsLeft - 1, inMap);
        root->right = build(inorder, inRoot + 1, inEnd, 
                            postorder, postStart + numsLeft, postEnd - 1, inMap);
        
        return root;
    }
};
// Time Complexity: O(N)
// Space Complexity: O(N)`,
                display_order: 2
            },
            {
                subtopic_slug: 'construction-problems',
                title: 'Serialize and De-serialize BT',
                slug: 'serialize-and-deserialize-binary-tree',
                category: 'interview',
                difficulty: 'hard',
                platform_url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
                external_link: 'https://www.youtube.com/watch?v=-YbXySKJsX8',
                description: `Design an algorithm to serialize and deserialize a binary tree. Serialization is the process of translating a data structure or object state into a format that can be stored or transmitted.`,
                examples: `Input: root = [1,2,3,null,null,4,5]
Output: [1,2,3,null,null,4,5] (as String serialization format)`,
                approach: `Use Level Order Traversal (BFS) and strings for both operations. During serialization, push null nodes as '#' string separated by commas. During deserialization, use stringstream and a queue to recreate the tree level by level.`,
                solution_code: `class Codec {
public:
    string serialize(TreeNode* root) {
        if (!root) return "";
        
        string s = "";
        queue<TreeNode*> q;
        q.push(root);
        
        while (!q.empty()) {
            TreeNode* curNode = q.front();
            q.pop();
            
            if (curNode == NULL) s.append("#,");
            else s.append(to_string(curNode->val) + ",");
            
            if (curNode != NULL) {
                q.push(curNode->left);
                q.push(curNode->right);
            }
        }
        return s;
    }

    TreeNode* deserialize(string data) {
        if (data.empty()) return NULL;
        
        stringstream s(data);
        string str;
        getline(s, str, ',');
        
        TreeNode* root = new TreeNode(stoi(str));
        queue<TreeNode*> q;
        q.push(root);
        
        while (!q.empty()) {
            TreeNode* node = q.front();
            q.pop();
            
            getline(s, str, ',');
            if (str == "#") {
                node->left = NULL;
            } else {
                TreeNode* leftNode = new TreeNode(stoi(str));
                node->left = leftNode;
                q.push(leftNode);
            }
            
            getline(s, str, ',');
            if (str == "#") {
                node->right = NULL;
            } else {
                TreeNode* rightNode = new TreeNode(stoi(str));
                node->right = rightNode;
                q.push(rightNode);
            }
        }
        return root;
    }
};
// Time Complexity: O(N)
// Space Complexity: O(N)`,
                display_order: 3
            },
            
            // Traversal in Constant Space
            {
                subtopic_slug: 'traversal-in-constant-space',
                title: 'Morris Inorder Traversal',
                slug: 'binary-tree-inorder-traversal',
                category: 'interview',
                difficulty: 'hard',
                platform_url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/',
                external_link: 'https://www.youtube.com/watch?v=80Zug6D1_h4',
                description: `Given the root of a binary tree, return the inorder traversal of its nodes' values. Implement it without using recursion or an explicit stack.`,
                examples: `Input: root = [1,null,2,3]
Output: [1,3,2]`,
                approach: `Morris Traversal uses threaded binary trees to achieve O(1) space. If left child is null, print current and move right. If not, find inorder predecessor. If predecessor's right is null, point it to current (create thread), move left. If predecessor's right is current (thread exists), revert thread, print current, move right.`,
                solution_code: `class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> inorder;
        TreeNode* curr = root;
        
        while (curr != NULL) {
            if (curr->left == NULL) {
                inorder.push_back(curr->val);
                curr = curr->right;
            } else {
                TreeNode* prev = curr->left;
                while (prev->right != NULL && prev->right != curr) {
                    prev = prev->right;
                }
                
                if (prev->right == NULL) {
                    prev->right = curr;
                    curr = curr->left;
                } else {
                    prev->right = NULL;
                    inorder.push_back(curr->val);
                    curr = curr->right;
                }
            }
        }
        
        return inorder;
    }
};
// Time Complexity: O(N)
// Space Complexity: O(1)`,
                display_order: 0
            },
            {
                subtopic_slug: 'traversal-in-constant-space',
                title: 'Morris Preorder Traversal',
                slug: 'binary-tree-preorder-traversal',
                category: 'interview',
                difficulty: 'hard',
                platform_url: 'https://leetcode.com/problems/binary-tree-preorder-traversal/',
                external_link: 'https://www.youtube.com/watch?v=80Zug6D1_h4',
                description: `Given the root of a binary tree, return the preorder traversal of its nodes' values. Implement it using Morris Traversal with O(1) extra space.`,
                examples: `Input: root = [1,null,2,3]
Output: [1,2,3]`,
                approach: `Morris Traversal for preorder is similar to inorder. The key difference is we add the node to our result BEFORE creating the thread (going down the left subtree). If thread already exists, just remove it and move right.`,
                solution_code: `class Solution {
public:
    vector<int> preorderTraversal(TreeNode* root) {
        vector<int> preorder;
        TreeNode* curr = root;
        
        while (curr != NULL) {
            if (curr->left == NULL) {
                preorder.push_back(curr->val);
                curr = curr->right;
            } else {
                TreeNode* prev = curr->left;
                while (prev->right != NULL && prev->right != curr) {
                    prev = prev->right;
                }
                
                if (prev->right == NULL) {
                    prev->right = curr;
                    preorder.push_back(curr->val);
                    curr = curr->left;
                } else {
                    prev->right = NULL;
                    curr = curr->right;
                }
            }
        }
        
        return preorder;
    }
};
// Time Complexity: O(N)
// Space Complexity: O(1)`,
                display_order: 1
            }
        ];
        
        for (const problem of problems) {
            const subtopicId = subtopicIds[problem.subtopic_slug];
            
            await pool.query(
                `INSERT INTO problems (
                    id, subtopic_id, title, slug, category, difficulty, 
                    platform_url, external_link, description, 
                    examples, approach, solution_code, display_order
                ) VALUES (
                    uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
                ) ON CONFLICT (subtopic_id, slug) DO UPDATE 
                SET title = EXCLUDED.title,
                    subtopic_id = EXCLUDED.subtopic_id,
                    category = EXCLUDED.category,
                    difficulty = EXCLUDED.difficulty,
                    platform_url = EXCLUDED.platform_url,
                    external_link = EXCLUDED.external_link,
                    description = EXCLUDED.description,
                    examples = EXCLUDED.examples,
                    approach = EXCLUDED.approach,
                    solution_code = EXCLUDED.solution_code,
                    display_order = EXCLUDED.display_order`,
                [
                    subtopicId, problem.title, problem.slug, problem.category,
                    problem.difficulty, problem.platform_url, problem.external_link,
                    problem.description, problem.examples, problem.approach,
                    problem.solution_code, problem.display_order
                ]
            );
            console.log(`Upserted problem: ${problem.title}`);
        }
        
        console.log('Binary Trees Part 2 seed completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding Binary Trees Part 2:', error);
        process.exit(1);
    }
};

seedBinaryTreePart2();
