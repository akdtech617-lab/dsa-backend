require('dotenv').config();
const db = require('./src/config/db');

const COURSE_ID = 'd2284cdb-751f-40f0-b7f2-c9ca6c277efe';

async function seedGraphPart3() {
  try {
    const { rows: topicRows } = await db.query(
      `SELECT id FROM topics WHERE slug = $1 AND course_id = $2`,
      ['graphs', COURSE_ID]
    );

    if (topicRows.length === 0) {
      console.error('Topic "graphs" not found for the given course ID.');
      process.exit(1);
    }
    const topicId = topicRows[0].id;

    // Minimum Spanning Tree
    const subtopic6Result = await db.query(
      `INSERT INTO subtopics (id, topic_id, title, slug, description, video_url, display_order)
       VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6)
       ON CONFLICT (topic_id, slug) DO UPDATE 
       SET title = EXCLUDED.title, description = EXCLUDED.description, display_order = EXCLUDED.display_order
       RETURNING id`,
      [
        topicId,
        'Minimum Spanning Tree',
        'minimum-spanning-tree',
        'Learn the theory and implementation of Minimum Spanning Trees and Disjoint Set.',
        'https://www.youtube.com/watch?v=aMqCGXPRZsk',
        5
      ]
    );
    const subtopic6Id = subtopic6Result.rows[0].id;

    // Hard Problems II
    const subtopic7Result = await db.query(
      `INSERT INTO subtopics (id, topic_id, title, slug, description, video_url, display_order)
       VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6)
       ON CONFLICT (topic_id, slug) DO UPDATE 
       SET title = EXCLUDED.title, description = EXCLUDED.description, display_order = EXCLUDED.display_order
       RETURNING id`,
      [
        topicId,
        'Hard Problems II',
        'hard-problems-ii',
        'Solve advanced problems utilizing disjoint sets and complex graph traversals.',
        'https://www.youtube.com/watch?v=XMsnj1kXtvY',
        6
      ]
    );
    const subtopic7Id = subtopic7Result.rows[0].id;

    // Additional Algorithms
    const subtopic8Result = await db.query(
      `INSERT INTO subtopics (id, topic_id, title, slug, description, video_url, display_order)
       VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6)
       ON CONFLICT (topic_id, slug) DO UPDATE 
       SET title = EXCLUDED.title, description = EXCLUDED.description, display_order = EXCLUDED.display_order
       RETURNING id`,
      [
        topicId,
        'Additional Algorithms',
        'additional-algorithms',
        'Learn algorithm for Strongly Connected Components, Bridges, and Articulation Points.',
        'https://www.youtube.com/watch?v=V8qIqJxCioo',
        7
      ]
    );
    const subtopic8Id = subtopic8Result.rows[0].id;

    // Subtopic 6 Problems
    const s6Problems = [
      {
        title: 'MST Theory',
        slug: 'mst-theory',
        description: "Understand the concept of a Minimum Spanning Tree and Prim's/Kruskal's basics.",
        category: 'interview',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/minimum-spanning-tree/1',
        external_link: 'https://www.youtube.com/watch?v=mJcZjjKzeqk',
        hints: 'Think about greedily picking the smallest edge that connects a new vertex.',
        examples: 'Input: Graph edges with weights\nOutput: Total weight of MST',
        approach: "Understand that an MST connects all vertices without cycles and with minimum possible total edge weight. Prim's algorithm grows the tree one vertex at a time, while Kruskal's algorithm grows the tree one edge at a time.",
        solution_code: `// Conceptual - refer to actual implementation problems
// Time Complexity: O(E log V)
// Space Complexity: O(V + E)`,
        display_order: 0
      },
      {
        title: 'Disjoint Set (Union-Find)',
        slug: 'disjoint-set-union-find',
        description: 'Implement a Disjoint Set data structure with union by rank and path compression.',
        category: 'interview',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/disjoint-set-union-find/1',
        external_link: 'https://www.youtube.com/watch?v=aBxjDBC4M1U',
        hints: 'Use an array for parent pointers and another for rank or size.',
        examples: 'Input: union(1, 2), find(2)nOutput: 1',
        approach: 'Use union by rank to keep the tree flat and path compression to make future queries faster.',
        solution_code: `class DisjointSet {
    vector<int> parent, size;
public:
    DisjointSet(int n) {
        parent.resize(n + 1);
        size.resize(n + 1, 1);
        for (int i = 0; i <= n; i++) parent[i] = i;
    }

    int findUPar(int node) {
        if (node == parent[node]) return node;
        return parent[node] = findUPar(parent[node]); // path compression
    }

    void unionBySize(int u, int v) {
        int ulp_u = findUPar(u);
        int ulp_v = findUPar(v);
        if (ulp_u == ulp_v) return;
        if (size[ulp_u] < size[ulp_v]) {
            parent[ulp_u] = ulp_v;
            size[ulp_v] += size[ulp_u];
        } else {
            parent[ulp_v] = ulp_u;
            size[ulp_u] += size[ulp_v];
        }
    }
};
// Time Complexity: O(4 * alpha) ~ O(1)
// Space Complexity: O(N)`,
        display_order: 1
      },
      {
        title: 'Find the MST Weight',
        slug: 'find-the-mst-weight',
        description: 'Find the weight of the Minimum Spanning Tree of a given graph.',
        category: 'interview',
        difficulty: 'medium',
        platform_url: 'https://practice.geeksforgeeks.org/problems/minimum-spanning-tree/1',
        external_link: 'https://www.youtube.com/watch?v=mJcZjjKzeqk',
        hints: "Use Prim's or Kruskal's algorithm.",
        examples: 'Input: V = 3, E = 3, edges = [[0,1,5],[1,2,3],[0,2,1]]nOutput: 4',
        approach: "Using Prim's: Use a min-heap to keep track of minimum weight edges. Mark visited nodes. Add weight if node is unvisited. Using Kruskal's: Sort edges by weight and use Disjoint Set to avoid cycles.",
        solution_code: `class Solution {
public:
    int spanningTree(int V, vector<vector<int>> adj[]) {
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
        vector<int> vis(V, 0);
        pq.push({0, 0}); // {weight, node}
        int sum = 0;
        
        while(!pq.empty()) {
            auto it = pq.top();
            pq.pop();
            int wt = it.first;
            int node = it.second;
            
            if(vis[node]) continue;
            vis[node] = 1;
            sum += wt;
            
            for(auto it : adj[node]) {
                int adjNode = it[0];
                int edW = it[1];
                if(!vis[adjNode]) {
                    pq.push({edW, adjNode});
                }
            }
        }
        return sum;
    }
};
// Time Complexity: O(E log E)
// Space Complexity: O(E + V)`,
        display_order: 2
      }
    ];

    for (const p of s6Problems) {
      await db.query(
        `INSERT INTO problems (
          id, subtopic_id, title, slug, description, category, difficulty,
          platform_url, external_link, hints, examples, approach, solution_code, display_order
        ) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (subtopic_id, slug) DO UPDATE
        SET title = EXCLUDED.title, description = EXCLUDED.description, 
            difficulty = EXCLUDED.difficulty, platform_url = EXCLUDED.platform_url,
            external_link = EXCLUDED.external_link, approach = EXCLUDED.approach,
            solution_code = EXCLUDED.solution_code, display_order = EXCLUDED.display_order`,
        [
          subtopic6Id, p.title, p.slug, p.description, p.category, p.difficulty,
          p.platform_url, p.external_link, p.hints, p.examples, p.approach, p.solution_code, p.display_order
        ]
      );
    }

    // Subtopic 7 Problems
    const s7Problems = [
      {
        title: 'Number of Operations to Make Network Connected',
        slug: 'number-of-operations-to-make-network-connected',
        description: 'Find the minimum number of edges to move to connect all computers.',
        category: 'interview',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/number-of-operations-to-make-network-connected/',
        external_link: 'https://www.youtube.com/watch?v=FYrl7iz9_ZU',
        hints: 'You need at least n - 1 edges to connect n computers.',
        examples: 'Input: n = 4, connections = [[0,1],[0,2],[1,2]]nOutput: 1',
        approach: 'Count redundant edges using Disjoint Set. Count number of components. If redundant edges >= components - 1, return components - 1, else -1.',
        solution_code: `class DisjointSet {
    vector<int> parent, size;
public:
    DisjointSet(int n) {
        parent.resize(n + 1);
        size.resize(n + 1, 1);
        for (int i = 0; i <= n; i++) parent[i] = i;
    }
    int findUPar(int node) {
        if (node == parent[node]) return node;
        return parent[node] = findUPar(parent[node]);
    }
    void unionBySize(int u, int v) {
        int ulp_u = findUPar(u);
        int ulp_v = findUPar(v);
        if (ulp_u == ulp_v) return;
        if (size[ulp_u] < size[ulp_v]) {
            parent[ulp_u] = ulp_v;
            size[ulp_v] += size[ulp_u];
        } else {
            parent[ulp_v] = ulp_u;
            size[ulp_u] += size[ulp_v];
        }
    }
};

class Solution {
public:
    int makeConnected(int n, vector<vector<int>>& connections) {
        DisjointSet ds(n);
        int extraEdges = 0;
        for (auto it : connections) {
            int u = it[0];
            int v = it[1];
            if (ds.findUPar(u) == ds.findUPar(v)) {
                extraEdges++;
            } else {
                ds.unionBySize(u, v);
            }
        }
        int components = 0;
        for (int i = 0; i < n; i++) {
            if (ds.parent[i] == i) components++;
        }
        int ans = components - 1;
        if (extraEdges >= ans) return ans;
        return -1;
    }
};
// Time Complexity: O(E)
// Space Complexity: O(V)`,
        display_order: 0
      },
      {
        title: 'Accounts Merge',
        slug: 'accounts-merge',
        description: 'Merge accounts that belong to the same person based on common emails.',
        category: 'interview',
        difficulty: 'medium',
        platform_url: 'https://leetcode.com/problems/accounts-merge/',
        external_link: 'https://www.youtube.com/watch?v=FMwpt_aQOEw',
        hints: 'Use Disjoint Set on the indices of the accounts.',
        examples: 'Input: accounts = [["John","johnsmith@mail.com","john_newyork@mail.com"],["John","johnsmith@mail.com","john00@mail.com"]]nOutput: [["John","john00@mail.com","john_newyork@mail.com","johnsmith@mail.com"]]',
        approach: 'Map each email to an account index. If an email is already mapped, union its current account index with the previous one. Then collect all emails for each account index (its ultimate parent) and sort them.',
        solution_code: `class Solution {
public:
    vector<vector<string>> accountsMerge(vector<vector<string>>& accounts) {
        int n = accounts.size();
        DisjointSet ds(n); // Assume DisjointSet class is available
        unordered_map<string, int> mapMailNode;
        for (int i = 0; i < n; i++) {
            for (int j = 1; j < accounts[i].size(); j++) {
                string mail = accounts[i][j];
                if (mapMailNode.find(mail) == mapMailNode.end()) {
                    mapMailNode[mail] = i;
                } else {
                    ds.unionBySize(i, mapMailNode[mail]);
                }
            }
        }
        
        vector<string> mergedMail[n];
        for (auto it : mapMailNode) {
            string mail = it.first;
            int node = ds.findUPar(it.second);
            mergedMail[node].push_back(mail);
        }
        
        vector<vector<string>> ans;
        for (int i = 0; i < n; i++) {
            if (mergedMail[i].size() == 0) continue;
            sort(mergedMail[i].begin(), mergedMail[i].end());
            vector<string> temp;
            temp.push_back(accounts[i][0]);
            for (auto it : mergedMail[i]) {
                temp.push_back(it);
            }
            ans.push_back(temp);
        }
        return ans;
    }
};
// Time Complexity: O(N * E log E)
// Space Complexity: O(N * E)`,
        display_order: 1
      },
      {
        title: 'Number of Islands II',
        slug: 'number-of-islands-ii',
        description: 'Count the number of islands after each land addition.',
        category: 'interview',
        difficulty: 'hard',
        platform_url: 'https://practice.geeksforgeeks.org/problems/number-of-islands/1',
        external_link: 'https://www.youtube.com/watch?v=Rn6B-Q4SNyA',
        hints: 'Use Disjoint Set to track connected components of land dynamically.',
        examples: 'Input: m = 3, n = 3, positions = [[0,0],[0,1],[1,2],[2,1]]nOutput: [1,1,2,3]',
        approach: 'Treat 2D grid as 1D array. Maintain number of islands. For each operation, add a cell, increment count. Check 4 directions. If a neighbor is land, union them and decrement count if they were in different sets.',
        solution_code: `class Solution {
public:
    vector<int> numOfIslands(int n, int m, vector<vector<int>> &operators) {
        DisjointSet ds(n * m);
        int vis[n][m];
        memset(vis, 0, sizeof vis);
        int cnt = 0;
        vector<int> ans;
        int dr[] = {-1, 0, 1, 0};
        int dc[] = {0, 1, 0, -1};
        
        for (auto it : operators) {
            int row = it[0];
            int col = it[1];
            if (vis[row][col] == 1) {
                ans.push_back(cnt);
                continue;
            }
            vis[row][col] = 1;
            cnt++;
            
            for (int ind = 0; ind < 4; ind++) {
                int adjr = row + dr[ind];
                int adjc = col + dc[ind];
                if (adjr >= 0 && adjr < n && adjc >= 0 && adjc < m) {
                    if (vis[adjr][adjc] == 1) {
                        int nodeNo = row * m + col;
                        int adjNodeNo = adjr * m + adjc;
                        if (ds.findUPar(nodeNo) != ds.findUPar(adjNodeNo)) {
                            cnt--;
                            ds.unionBySize(nodeNo, adjNodeNo);
                        }
                    }
                }
            }
            ans.push_back(cnt);
        }
        return ans;
    }
};
// Time Complexity: O(Q * 4)
// Space Complexity: O(N * M)`,
        display_order: 2
      },
      {
        title: 'Making a Large Island',
        slug: 'making-a-large-island',
        description: 'Find the maximum size of an island after changing at most one 0 to 1.',
        category: 'interview',
        difficulty: 'hard',
        platform_url: 'https://leetcode.com/problems/making-a-large-island/',
        external_link: 'https://www.youtube.com/watch?v=lgiz0Oup6gM',
        hints: 'Precompute island sizes using Disjoint Set. Then try flipping each 0 and sum adjacent unique island sizes.',
        examples: 'Input: grid = [[1,0],[0,1]]nOutput: 3',
        approach: 'Connect all 1s using DSU. Record size of each component. Iterate through each 0, find adjacent unique components, sum their sizes + 1 (for the flipped 0). Keep track of the maximum.',
        solution_code: `class Solution {
public:
    int largestIsland(vector<vector<int>>& grid) {
        int n = grid.size();
        DisjointSet ds(n * n);
        
        int dr[] = {-1, 0, 1, 0};
        int dc[] = {0, -1, 0, 1};
        
        // step 1: connect components
        for(int row = 0; row < n; row++){
            for(int col = 0; col < n; col++){
                if(grid[row][col] == 0) continue;
                for(int ind = 0; ind < 4; ind++){
                    int newr = row + dr[ind];
                    int newc = col + dc[ind];
                    if(newr >= 0 && newr < n && newc >= 0 && newc < n && grid[newr][newc] == 1){
                        int nodeNo = row * n + col;
                        int adjNodeNo = newr * n + newc;
                        ds.unionBySize(nodeNo, adjNodeNo);
                    }
                }
            }
        }
        
        // step 2: try flipping 0 to 1
        int mx = 0;
        for(int row = 0; row < n; row++){
            for(int col = 0; col < n; col++){
                if(grid[row][col] == 1) continue;
                set<int> components;
                for(int ind = 0; ind < 4; ind++){
                    int newr = row + dr[ind];
                    int newc = col + dc[ind];
                    if(newr >= 0 && newr < n && newc >= 0 && newc < n && grid[newr][newc] == 1){
                        components.insert(ds.findUPar(newr * n + newc));
                    }
                }
                int sizeTotal = 0;
                for(auto it : components){
                    sizeTotal += ds.size[it];
                }
                mx = max(mx, sizeTotal + 1);
            }
        }
        for(int cellNo = 0; cellNo < n * n; cellNo++){
            mx = max(mx, ds.size[ds.findUPar(cellNo)]);
        }
        return mx;
    }
};
// Time Complexity: O(N^2)
// Space Complexity: O(N^2)`,
        display_order: 3
      },
      {
        title: 'Most Stones Removed with Same Row or Column',
        slug: 'most-stones-removed-with-same-row-or-column',
        description: 'Find max number of stones that can be removed. A stone can be removed if it shares row/col with another stone.',
        category: 'interview',
        difficulty: 'hard',
        platform_url: 'https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/',
        external_link: 'https://www.youtube.com/watch?v=OwMNX8SPavM',
        hints: 'Think of this as connecting rows and columns.',
        examples: 'Input: stones = [[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]]nOutput: 5',
        approach: 'Treat each stone as an edge connecting its row and column. The answer is total stones - number of connected components. Use DSU to connect row with col + max_rows.',
        solution_code: `class Solution {
public:
    int removeStones(vector<vector<int>>& stones) {
        int maxRow = 0, maxCol = 0;
        for (auto it : stones) {
            maxRow = max(maxRow, it[0]);
            maxCol = max(maxCol, it[1]);
        }
        
        DisjointSet ds(maxRow + maxCol + 1);
        unordered_map<int, int> stoneNodes;
        
        for (auto it : stones) {
            int nodeRow = it[0];
            int nodeCol = it[1] + maxRow + 1;
            ds.unionBySize(nodeRow, nodeCol);
            stoneNodes[nodeRow] = 1;
            stoneNodes[nodeCol] = 1;
        }
        
        int cnt = 0;
        for (auto it : stoneNodes) {
            if (ds.findUPar(it.first) == it.first) {
                cnt++;
            }
        }
        return stones.size() - cnt;
    }
};
// Time Complexity: O(N)
// Space Complexity: O(maxRow + maxCol)`,
        display_order: 4
      }
    ];

    for (const p of s7Problems) {
      await db.query(
        `INSERT INTO problems (
          id, subtopic_id, title, slug, description, category, difficulty,
          platform_url, external_link, hints, examples, approach, solution_code, display_order
        ) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (subtopic_id, slug) DO UPDATE
        SET title = EXCLUDED.title, description = EXCLUDED.description, 
            difficulty = EXCLUDED.difficulty, platform_url = EXCLUDED.platform_url,
            external_link = EXCLUDED.external_link, approach = EXCLUDED.approach,
            solution_code = EXCLUDED.solution_code, display_order = EXCLUDED.display_order`,
        [
          subtopic7Id, p.title, p.slug, p.description, p.category, p.difficulty,
          p.platform_url, p.external_link, p.hints, p.examples, p.approach, p.solution_code, p.display_order
        ]
      );
    }

    // Subtopic 8 Problems
    const s8Problems = [
      {
        title: "Kosaraju's Algorithm",
        slug: 'kosarajus-algorithm',
        description: 'Find all strongly connected components in a directed graph.',
        category: 'interview',
        difficulty: 'hard',
        platform_url: 'https://practice.geeksforgeeks.org/problems/strongly-connected-components-kosarajus-algo/1',
        external_link: 'https://www.youtube.com/watch?v=R6uoSjZ2imo',
        hints: 'Use DFS to sort nodes by finishing time, then reverse edges and do DFS again.',
        examples: 'Input: Directed GraphnOutput: Number of SCCs',
        approach: '1. Sort nodes based on finishing time (Topological Sort). 2. Transpose the graph (reverse edges). 3. Perform DFS in the order of finishing times to find SCCs.',
        solution_code: `class Solution
{
private:
    void dfs(int node, vector<int> &vis, vector<vector<int>>& adj, stack<int> &st) {
        vis[node] = 1;
        for (auto it : adj[node]) {
            if (!vis[it]) {
                dfs(it, vis, adj, st);
            }
        }
        st.push(node);
    }
    
    void dfs3(int node, vector<int> &vis, vector<int> adjT[]) {
        vis[node] = 1;
        for (auto it : adjT[node]) {
            if (!vis[it]) {
                dfs3(it, vis, adjT);
            }
        }
    }
public:
    int kosaraju(int V, vector<vector<int>>& adj) {
        vector<int> vis(V, 0);
        stack<int> st;
        for (int i = 0; i < V; i++) {
            if (!vis[i]) {
                dfs(i, vis, adj, st);
            }
        }
        
        vector<int> adjT[V];
        for (int i = 0; i < V; i++) {
            vis[i] = 0;
            for (auto it : adj[i]) {
                adjT[it].push_back(i);
            }
        }
        
        int scc = 0;
        while (!st.empty()) {
            int node = st.top();
            st.pop();
            if (!vis[node]) {
                scc++;
                dfs3(node, vis, adjT);
            }
        }
        return scc;
    }
};
// Time Complexity: O(V + E)
// Space Complexity: O(V + E)`,
        display_order: 0
      },
      {
        title: 'Bridges in Graph',
        slug: 'bridges-in-graph',
        description: 'Find all critical connections (bridges) in an undirected graph.',
        category: 'interview',
        difficulty: 'hard',
        platform_url: 'https://leetcode.com/problems/critical-connections-in-a-network/',
        external_link: 'https://www.youtube.com/watch?v=qrAub5z8FeA',
        hints: "Use Tarjan's algorithm with discovery times and lowest reachable times.",
        examples: 'Input: n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]nOutput: [[1,3]]',
        approach: "Maintain time of insertion (tin) and lowest time of insertion (low). A backedge (low[it] <= tin[node]) means it's part of a cycle. An edge is a bridge if low[it] > tin[node].",
        solution_code: `class Solution {
private:
    int timer = 1;
    void dfs(int node, int parent, vector<int> &vis, vector<int> adj[], int tin[], int low[], vector<vector<int>> &bridges) {
        vis[node] = 1;
        tin[node] = low[node] = timer++;
        for (auto it : adj[node]) {
            if (it == parent) continue;
            if (!vis[it]) {
                dfs(it, node, vis, adj, tin, low, bridges);
                low[node] = min(low[node], low[it]);
                if (low[it] > tin[node]) {
                    bridges.push_back({it, node});
                }
            } else {
                low[node] = min(low[node], low[it]);
            }
        }
    }
public:
    vector<vector<int>> criticalConnections(int n, vector<vector<int>>& connections) {
        vector<int> adj[n];
        for (auto it : connections) {
            adj[it[0]].push_back(it[1]);
            adj[it[1]].push_back(it[0]);
        }
        vector<int> vis(n, 0);
        int tin[n];
        int low[n];
        vector<vector<int>> bridges;
        dfs(0, -1, vis, adj, tin, low, bridges);
        return bridges;
    }
};
// Time Complexity: O(V + E)
// Space Complexity: O(V + E)`,
        display_order: 1
      },
      {
        title: 'Articulation Points in Graph',
        slug: 'articulation-points-in-graph',
        description: 'Find all articulation points in an undirected graph.',
        category: 'interview',
        difficulty: 'hard',
        platform_url: 'https://practice.geeksforgeeks.org/problems/articulation-point-1/1',
        external_link: 'https://www.youtube.com/watch?v=j1QDfU21iZk',
        hints: 'Similar to bridges, but for vertices. Keep track of individual children from the root of DFS.',
        examples: 'Input: V = 5, E = 5, edges = [[0,1],[1,4],[2,4],[2,3],[3,4]]nOutput: [1, 4]',
        approach: "Use Tarjan's concept of tin and low. A node is an articulation point if it has a child with low >= tin of node, and it is not root. If root has >1 child in DFS tree, it is also an AP.",
        solution_code: `class Solution {
private:
    int timer = 1;
    void dfs(int node, int parent, vector<int> &vis, int tin[], int low[], vector<int> &mark, vector<int> adj[]) {
        vis[node] = 1;
        tin[node] = low[node] = timer++;
        int child = 0;
        for (auto it : adj[node]) {
            if (it == parent) continue;
            if (!vis[it]) {
                dfs(it, node, vis, tin, low, mark, adj);
                low[node] = min(low[node], low[it]);
                if (low[it] >= tin[node] && parent != -1) {
                    mark[node] = 1;
                }
                child++;
            } else {
                low[node] = min(low[node], tin[it]);
            }
        }
        if (child > 1 && parent == -1) {
            mark[node] = 1;
        }
    }
public:
    vector<int> articulationPoints(int V, vector<int>adj[]) {
        vector<int> vis(V, 0);
        int tin[V];
        int low[V];
        vector<int> mark(V, 0);
        for (int i = 0; i < V; i++) {
            if (!vis[i]) {
                dfs(i, -1, vis, tin, low, mark, adj);
            }
        }
        vector<int> ans;
        for (int i = 0; i < V; i++) {
            if (mark[i] == 1) ans.push_back(i);
        }
        if (ans.size() == 0) return {-1};
        return ans;
    }
};
// Time Complexity: O(V + E)
// Space Complexity: O(V)`,
        display_order: 2
      }
    ];

    for (const p of s8Problems) {
      await db.query(
        `INSERT INTO problems (
          id, subtopic_id, title, slug, description, category, difficulty,
          platform_url, external_link, hints, examples, approach, solution_code, display_order
        ) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (subtopic_id, slug) DO UPDATE
        SET title = EXCLUDED.title, description = EXCLUDED.description, 
            difficulty = EXCLUDED.difficulty, platform_url = EXCLUDED.platform_url,
            external_link = EXCLUDED.external_link, approach = EXCLUDED.approach,
            solution_code = EXCLUDED.solution_code, display_order = EXCLUDED.display_order`,
        [
          subtopic8Id, p.title, p.slug, p.description, p.category, p.difficulty,
          p.platform_url, p.external_link, p.hints, p.examples, p.approach, p.solution_code, p.display_order
        ]
      );
    }

    console.log('Successfully seeded Graph Part 3 problems!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Graph Part 3 data:', error);
    process.exit(1);
  }
}

seedGraphPart3();
