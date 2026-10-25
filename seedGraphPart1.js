require('dotenv').config();
const pool = require('./src/config/db');

const courseId = 'd2284cdb-751f-40f0-b7f2-c9ca6c277efe';

const seedData = {
    topic: {
        title: 'Graphs',
        slug: 'graphs',
        description: 'Master graph theory, traversals, shortest paths, MST, and advanced graph algorithms.',
        display_order: 5,
        subtopics: [
            {
                title: 'Theory and Traversals',
                slug: 'theory-and-traversals',
                description: 'Basic introduction to graphs and fundamental traversal techniques.',
                display_order: 0,
                video_url: 'https://www.youtube.com/watch?v=M3_pLsDdeuU',
                problems: [
                    {
                        title: 'Introduction to Graph',
                        slug: 'introduction-to-graph',
                        description: 'Learn the basic terminology, representation, and concepts of graphs.',
                        category: 'interview',
                        difficulty: 'easy',
                        platform_url: 'https://practice.geeksforgeeks.org/problems/print-adjacency-list-1587115620/1',
                        external_link: 'https://www.youtube.com/watch?v=M3_pLsDdeuU',
                        hints: 'Understand adjacency matrix vs adjacency list.',
                        examples: 'Input: V = 5, edges = [[0,1],[0,4],[1,2],[1,3],[1,4],[2,3],[3,4]]\nOutput: Adjacency list representation of the graph.',
                        approach: 'A graph can be represented using an adjacency matrix (a 2D array) or an adjacency list (an array of lists). For sparse graphs, adjacency lists are more space-efficient.',
                        solution_code: `// C++ code to create an adjacency list
#include <iostream>
#include <vector>

using namespace std;

int main() {
    int n = 3, m = 3;
    vector<int> adj[n + 1];
    
    // edge 1-2
    adj[1].push_back(2);
    adj[2].push_back(1);
    
    // edge 2-3
    adj[2].push_back(3);
    adj[3].push_back(2);
    
    // edge 1-3
    adj[1].push_back(3);
    adj[3].push_back(1);
    
    return 0;
}
// Time Complexity: O(E) to build the list
// Space Complexity: O(V + 2E) for undirected graph`,
                        display_order: 0
                    },
                    {
                        title: 'Traversal Techniques',
                        slug: 'traversal-techniques',
                        description: 'Breadth First Search (BFS) and Depth First Search (DFS) traversals.',
                        category: 'interview',
                        difficulty: 'medium',
                        platform_url: 'https://practice.geeksforgeeks.org/problems/bfs-traversal-of-graph/1',
                        external_link: 'https://www.youtube.com/watch?v=-tgVpUgsQ5k',
                        hints: 'Use a queue for BFS and recursion/stack for DFS.',
                        examples: 'Input: V = 5, E = 4, adj = {{1, 2, 3}, {}, {4}, {}, {}}\nOutput: 0 1 2 3 4',
                        approach: 'BFS explores level by level using a queue. DFS explores as deep as possible along each branch before backtracking.',
                        solution_code: `// C++ BFS
#include <bits/stdc++.h>
using namespace std;

class Solution {
  public:
    vector<int> bfsOfGraph(int V, vector<int> adj[]) {
        int vis[V] = {0};
        vis[0] = 1;
        queue<int> q;
        q.push(0);
        vector<int> bfs;
        
        while(!q.empty()) {
            int node = q.front();
            q.pop();
            bfs.push_back(node);
            
            for(auto it : adj[node]) {
                if(!vis[it]) {
                    vis[it] = 1;
                    q.push(it);
                }
            }
        }
        return bfs;
    }
};
// Time Complexity: O(V + E)
// Space Complexity: O(V)`,
                        display_order: 1
                    },
                    {
                        title: 'Connected Components',
                        slug: 'connected-components',
                        description: 'Find the number of connected components in a graph.',
                        category: 'interview',
                        difficulty: 'medium',
                        platform_url: 'https://practice.geeksforgeeks.org/problems/number-of-provinces/1',
                        external_link: 'https://www.youtube.com/watch?v=DFszOidI-OQ',
                        hints: 'Iterate over all nodes and trigger a traversal (BFS/DFS) if a node is unvisited.',
                        examples: 'Input: V = 3, isConnected = [[1,1,0],[1,1,0],[0,0,1]]\nOutput: 2',
                        approach: 'Maintain a visited array. For each unvisited node, increment the component count and run BFS/DFS to visit all nodes in its component.',
                        solution_code: `class Solution {
  private:
    void dfs(int node, vector<int> adjLs[], int vis[]) {
        vis[node] = 1;
        for(auto it : adjLs[node]) {
            if(!vis[it]) {
                dfs(it, adjLs, vis);
            }
        }
    }
  public:
    int numProvinces(vector<vector<int>> adj, int V) {
        vector<int> adjLs[V];
        for(int i = 0; i < V; i++) {
            for(int j = 0; j < V; j++) {
                if(adj[i][j] == 1 && i != j) {
                    adjLs[i].push_back(j);
                    adjLs[j].push_back(i);
                }
            }
        }
        
        int vis[V] = {0};
        int cnt = 0;
        for(int i = 0; i < V; i++) {
            if(!vis[i]) {
                cnt++;
                dfs(i, adjLs, vis);
            }
        }
        return cnt;
    }
};
// Time Complexity: O(V + E)
// Space Complexity: O(V)`,
                        display_order: 2
                    }
                ]
            },
            {
                title: 'Traversal Problems',
                slug: 'traversal-problems',
                description: 'Various problem-solving patterns using Graph traversals.',
                display_order: 1,
                video_url: 'https://www.youtube.com/watch?v=mUNCZXxE274',
                problems: [
                    {
                        title: 'Number of Provinces',
                        slug: 'number-of-provinces',
                        description: 'Find the number of provinces (connected components).',
                        category: 'interview',
                        difficulty: 'medium',
                        platform_url: 'https://leetcode.com/problems/number-of-provinces/',
                        external_link: 'https://www.youtube.com/watch?v=DFszOidI-OQ',
                        hints: 'Similar to counting connected components.',
                        examples: 'Input: isConnected = [[1,1,0],[1,1,0],[0,0,1]]\nOutput: 2',
                        approach: 'Convert adjacency matrix to list if needed, then run DFS/BFS for every unvisited node and count.',
                        solution_code: `class Solution {
public:
    void dfs(int i, vector<vector<int>>& isConnected, vector<bool>& vis) {
        vis[i] = true;
        for (int j = 0; j < isConnected.size(); j++) {
            if (isConnected[i][j] == 1 && !vis[j]) {
                dfs(j, isConnected, vis);
            }
        }
    }
    
    int findCircleNum(vector<vector<int>>& isConnected) {
        int n = isConnected.size();
        vector<bool> vis(n, false);
        int provinces = 0;
        
        for (int i = 0; i < n; i++) {
            if (!vis[i]) {
                provinces++;
                dfs(i, isConnected, vis);
            }
        }
        return provinces;
    }
};
// Time Complexity: O(N^2)
// Space Complexity: O(N)`,
                        display_order: 0
                    },
                    {
                        title: 'Number of Islands',
                        slug: 'number-of-islands',
                        description: 'Count the number of islands in a 2D grid.',
                        category: 'interview',
                        difficulty: 'medium',
                        platform_url: 'https://leetcode.com/problems/number-of-islands/',
                        external_link: 'https://www.youtube.com/watch?v=mUNCZXxE274',
                        hints: 'An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.',
                        examples: 'Input: grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]\nOutput: 3',
                        approach: 'Iterate through the grid. When a "1" is found, increment island count and use DFS/BFS to turn the entire island to "0".',
                        solution_code: `class Solution {
private:
    void dfs(vector<vector<char>>& grid, int r, int c) {
        int nr = grid.size();
        int nc = grid[0].size();
        
        grid[r][c] = '0';
        
        int dRow[] = {-1, 0, 1, 0};
        int dCol[] = {0, 1, 0, -1};
        
        for (int i = 0; i < 4; i++) {
            int nrow = r + dRow[i];
            int ncol = c + dCol[i];
            if (nrow >= 0 && nrow < nr && ncol >= 0 && ncol < nc && grid[nrow][ncol] == '1') {
                dfs(grid, nrow, ncol);
            }
        }
    }
public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty()) return 0;
        int islands = 0;
        for (int i = 0; i < grid.size(); i++) {
            for (int j = 0; j < grid[0].size(); j++) {
                if (grid[i][j] == '1') {
                    islands++;
                    dfs(grid, i, j);
                }
            }
        }
        return islands;
    }
};
// Time Complexity: O(M * N)
// Space Complexity: O(M * N) for recursion stack`,
                        display_order: 1
                    },
                    {
                        title: 'Flood Fill Algorithm',
                        slug: 'flood-fill',
                        description: 'Perform a flood fill on the image starting from given coordinates.',
                        category: 'interview',
                        difficulty: 'easy',
                        platform_url: 'https://leetcode.com/problems/flood-fill/',
                        external_link: 'https://www.youtube.com/watch?v=C-2_uSRli8o',
                        hints: 'Use DFS or BFS to replace the color.',
                        examples: 'Input: image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2\nOutput: [[2,2,2],[2,2,0],[2,0,1]]',
                        approach: 'From the starting pixel, explore 4 directionally. If a pixel has the original color, change it to the new color and recurse.',
                        solution_code: `class Solution {
private:
    void dfs(vector<vector<int>>& image, int r, int c, int color, int initialColor) {
        if (r < 0 || c < 0 || r >= image.size() || c >= image[0].size() || image[r][c] != initialColor) {
            return;
        }
        image[r][c] = color;
        dfs(image, r - 1, c, color, initialColor);
        dfs(image, r + 1, c, color, initialColor);
        dfs(image, r, c - 1, color, initialColor);
        dfs(image, r, c + 1, color, initialColor);
    }
public:
    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {
        int initialColor = image[sr][sc];
        if (initialColor != color) {
            dfs(image, sr, sc, color, initialColor);
        }
        return image;
    }
};
// Time Complexity: O(M * N)
// Space Complexity: O(M * N)`,
                        display_order: 2
                    },
                    {
                        title: 'Number of Enclaves',
                        slug: 'number-of-enclaves',
                        description: 'Count land cells that cannot reach the boundary.',
                        category: 'interview',
                        difficulty: 'medium',
                        platform_url: 'https://leetcode.com/problems/number-of-enclaves/',
                        external_link: 'https://www.youtube.com/watch?v=rxKcepXQgU4',
                        hints: 'Find land cells on the boundary and mark all connected land cells. The remaining land cells are enclaves.',
                        examples: 'Input: grid = [[0,0,0,0],[1,0,1,0],[0,1,1,0],[0,0,0,0]]\nOutput: 3',
                        approach: 'Start a Multi-source BFS/DFS from all land cells located on the grid boundaries. Mark them as visited. Finally, count unvisited land cells.',
                        solution_code: `class Solution {
public:
    int numEnclaves(vector<vector<int>>& grid) {
        int m = grid.size();
        int n = grid[0].size();
        queue<pair<int, int>> q;
        vector<vector<int>> vis(m, vector<int>(n, 0));
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (i == 0 || j == 0 || i == m - 1 || j == n - 1) {
                    if (grid[i][j] == 1) {
                        q.push({i, j});
                        vis[i][j] = 1;
                    }
                }
            }
        }
        
        int dr[] = {-1, 0, 1, 0};
        int dc[] = {0, 1, 0, -1};
        
        while (!q.empty()) {
            auto [r, c] = q.front();
            q.pop();
            
            for (int i = 0; i < 4; i++) {
                int nr = r + dr[i];
                int nc = c + dc[i];
                if (nr >= 0 && nr < m && nc >= 0 && nc < n && !vis[nr][nc] && grid[nr][nc] == 1) {
                    q.push({nr, nc});
                    vis[nr][nc] = 1;
                }
            }
        }
        
        int enclaves = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1 && !vis[i][j]) {
                    enclaves++;
                }
            }
        }
        return enclaves;
    }
};
// Time Complexity: O(M * N)
// Space Complexity: O(M * N)`,
                        display_order: 3
                    },
                    {
                        title: 'Rotten Oranges',
                        slug: 'rotten-oranges',
                        description: 'Find minimum time to rot all oranges.',
                        category: 'interview',
                        difficulty: 'medium',
                        platform_url: 'https://leetcode.com/problems/rotting-oranges/',
                        external_link: 'https://www.youtube.com/watch?v=yf3oUhkvqA0',
                        hints: 'Use Multi-Source BFS.',
                        examples: 'Input: grid = [[2,1,1],[1,1,0],[0,1,1]]\nOutput: 4',
                        approach: 'Push all rotten oranges into a queue with time 0. Perform BFS level by level. Keep track of maximum time and count of fresh oranges converted. Compare with initial fresh count.',
                        solution_code: `class Solution {
public:
    int orangesRotting(vector<vector<int>>& grid) {
        int n = grid.size();
        int m = grid[0].size();
        
        queue<pair<pair<int, int>, int>> q;
        int vis[n][m];
        int cntFresh = 0;
        
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (grid[i][j] == 2) {
                    q.push({{i, j}, 0});
                    vis[i][j] = 2;
                } else {
                    vis[i][j] = 0;
                }
                if (grid[i][j] == 1) cntFresh++;
            }
        }
        
        int tm = 0;
        int drow[] = {-1, 0, 1, 0};
        int dcol[] = {0, 1, 0, -1};
        int cnt = 0;
        
        while (!q.empty()) {
            int r = q.front().first.first;
            int c = q.front().first.second;
            int t = q.front().second;
            tm = max(tm, t);
            q.pop();
            
            for (int i = 0; i < 4; i++) {
                int nrow = r + drow[i];
                int ncol = c + dcol[i];
                
                if (nrow >= 0 && nrow < n && ncol >= 0 && ncol < m &&
                    vis[nrow][ncol] != 2 && grid[nrow][ncol] == 1) {
                    q.push({{nrow, ncol}, t + 1});
                    vis[nrow][ncol] = 2;
                    cnt++;
                }
            }
        }
        
        if (cnt != cntFresh) return -1;
        return tm;
    }
};
// Time Complexity: O(N * M)
// Space Complexity: O(N * M)`,
                        display_order: 4
                    },
                    {
                        title: 'Distance of Nearest Cell Having One',
                        slug: 'distance-of-nearest-cell-having-1',
                        description: 'Find distance of nearest 1 for each 0 in a binary matrix.',
                        category: 'interview',
                        difficulty: 'medium',
                        platform_url: 'https://leetcode.com/problems/01-matrix/',
                        external_link: 'https://www.youtube.com/watch?v=edXdVwkYHF8',
                        hints: 'Use Multi-Source BFS starting from all 1s (or 0s depending on problem statement).',
                        examples: 'Input: mat = [[0,0,0],[0,1,0],[1,1,1]]\nOutput: [[0,0,0],[0,1,0],[1,2,1]]',
                        approach: 'For LC 542 (01 Matrix), find distance to nearest 0. Start a Multi-source BFS from all 0s. The distance to adjacent 1s will be current distance + 1.',
                        solution_code: `class Solution {
public:
    vector<vector<int>> updateMatrix(vector<vector<int>>& mat) {
        int n = mat.size();
        int m = mat[0].size();
        vector<vector<int>> vis(n, vector<int>(m, 0));
        vector<vector<int>> dist(n, vector<int>(m, 0));
        queue<pair<pair<int, int>, int>> q;
        
        for(int i = 0; i < n; i++) {
            for(int j = 0; j < m; j++) {
                if(mat[i][j] == 0) {
                    q.push({{i, j}, 0});
                    vis[i][j] = 1;
                }
            }
        }
        
        int delrow[] = {-1, 0, 1, 0};
        int delcol[] = {0, 1, 0, -1};
        
        while(!q.empty()) {
            int row = q.front().first.first;
            int col = q.front().first.second;
            int steps = q.front().second;
            q.pop();
            dist[row][col] = steps;
            
            for(int i = 0; i < 4; i++) {
                int nrow = row + delrow[i];
                int ncol = col + delcol[i];
                if(nrow >= 0 && nrow < n && ncol >= 0 && ncol < m && !vis[nrow][ncol]) {
                    vis[nrow][ncol] = 1;
                    q.push({{nrow, ncol}, steps + 1});
                }
            }
        }
        return dist;
    }
};
// Time Complexity: O(N * M)
// Space Complexity: O(N * M)`,
                        display_order: 5
                    },
                    {
                        title: 'Surrounded Regions',
                        slug: 'surrounded-regions',
                        description: 'Capture all regions surrounded by X.',
                        category: 'interview',
                        difficulty: 'medium',
                        platform_url: 'https://leetcode.com/problems/surrounded-regions/',
                        external_link: 'https://www.youtube.com/watch?v=BtdgAys4yMk',
                        hints: 'Find Os on the boundary and run DFS to mark them as uncapturable.',
                        examples: 'Input: board = [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]\nOutput: [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]',
                        approach: 'Traverse the boundary. If an \'O\' is found, run DFS and mark all connected \'O\'s. Finally, flip all remaining \'O\'s to \'X\', and restore marked ones to \'O\'.',
                        solution_code: `class Solution {
private:
    void dfs(int row, int col, vector<vector<int>>& vis, vector<vector<char>>& board) {
        vis[row][col] = 1;
        int n = board.size();
        int m = board[0].size();
        int delrow[] = {-1, 0, 1, 0};
        int delcol[] = {0, 1, 0, -1};
        for (int i = 0; i < 4; i++) {
            int nrow = row + delrow[i];
            int ncol = col + delcol[i];
            if (nrow >= 0 && nrow < n && ncol >= 0 && ncol < m && !vis[nrow][ncol] && board[nrow][ncol] == 'O') {
                dfs(nrow, ncol, vis, board);
            }
        }
    }
public:
    void solve(vector<vector<char>>& board) {
        if (board.empty()) return;
        int n = board.size();
        int m = board[0].size();
        vector<vector<int>> vis(n, vector<int>(m, 0));
        
        for (int j = 0; j < m; j++) {
            if (!vis[0][j] && board[0][j] == 'O') dfs(0, j, vis, board);
            if (!vis[n-1][j] && board[n-1][j] == 'O') dfs(n-1, j, vis, board);
        }
        for (int i = 0; i < n; i++) {
            if (!vis[i][0] && board[i][0] == 'O') dfs(i, 0, vis, board);
            if (!vis[i][m-1] && board[i][m-1] == 'O') dfs(i, m-1, vis, board);
        }
        
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (!vis[i][j] && board[i][j] == 'O') {
                    board[i][j] = 'X';
                }
            }
        }
    }
};
// Time Complexity: O(N * M)
// Space Complexity: O(N * M)`,
                        display_order: 6
                    },
                    {
                        title: 'Number of Distinct Islands',
                        slug: 'number-of-distinct-islands',
                        description: 'Find number of distinct islands using shapes.',
                        category: 'interview',
                        difficulty: 'medium',
                        platform_url: 'https://practice.geeksforgeeks.org/problems/number-of-distinct-islands/1',
                        external_link: 'https://www.youtube.com/watch?v=7zmgQSJghpo',
                        hints: 'Use a set to store the shapes of the islands.',
                        examples: 'Input: grid = [[1, 1, 0], [0, 0, 1], [0, 0, 1]]\nOutput: 2',
                        approach: 'Traverse using DFS. To capture the shape, subtract the base starting coordinate from all coordinates of that island. Store these normalized coordinates in a set. The set size is the answer.',
                        solution_code: `class Solution {
  private:
    void dfs(int row, int col, vector<vector<int>>& grid, vector<vector<int>>& vis,
             vector<pair<int, int>>& vec, int row0, int col0) {
        vis[row][col] = 1;
        vec.push_back({row - row0, col - col0});
        int n = grid.size();
        int m = grid[0].size();
        
        int delrow[] = {-1, 0, 1, 0};
        int delcol[] = {0, 1, 0, -1};
        for(int i = 0; i < 4; i++) {
            int nrow = row + delrow[i];
            int ncol = col + delcol[i];
            if(nrow >= 0 && nrow < n && ncol >= 0 && ncol < m && !vis[nrow][ncol] && grid[nrow][ncol] == 1) {
                dfs(nrow, ncol, grid, vis, vec, row0, col0);
            }
        }
    }
  public:
    int countDistinctIslands(vector<vector<int>>& grid) {
        int n = grid.size();
        int m = grid[0].size();
        vector<vector<int>> vis(n, vector<int>(m, 0));
        set<vector<pair<int, int>>> st;
        
        for(int i = 0; i < n; i++) {
            for(int j = 0; j < m; j++) {
                if(!vis[i][j] && grid[i][j] == 1) {
                    vector<pair<int, int>> vec;
                    dfs(i, j, grid, vis, vec, i, j);
                    st.insert(vec);
                }
            }
        }
        return st.size();
    }
};
// Time Complexity: O(N * M * log(N*M))
// Space Complexity: O(N * M)`,
                        display_order: 7
                    }
                ]
            },
            {
                title: 'Cycles',
                slug: 'cycles',
                description: 'Cycle detection algorithms and Topological sort.',
                display_order: 2,
                video_url: 'https://www.youtube.com/watch?v=BPlrALf1LWH',
                problems: [
                    {
                        title: 'Detect a Cycle in an Undirected Graph',
                        slug: 'detect-cycle-in-undirected-graph',
                        description: 'Check if an undirected graph contains any cycle.',
                        category: 'interview',
                        difficulty: 'medium',
                        platform_url: 'https://practice.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1',
                        external_link: 'https://www.youtube.com/watch?v=BPlrALf1LWH',
                        hints: 'Keep track of the parent node during BFS/DFS.',
                        examples: 'Input: V = 5, E = 5, adj = {{1}, {0, 2, 4}, {1, 3}, {2, 4}, {1, 3}}\nOutput: 1 (Cycle exists)',
                        approach: 'During BFS or DFS, if you encounter an adjacent node that is already visited and is not the parent of the current node, a cycle exists.',
                        solution_code: `class Solution {
  private:
    bool detect(int src, vector<int> adj[], int vis[]) {
        vis[src] = 1;
        queue<pair<int, int>> q;
        q.push({src, -1});
        
        while(!q.empty()) {
            int node = q.front().first;
            int parent = q.front().second;
            q.pop();
            
            for(auto adjacentNode : adj[node]) {
                if(!vis[adjacentNode]) {
                    vis[adjacentNode] = 1;
                    q.push({adjacentNode, node});
                } else if (parent != adjacentNode) {
                    return true;
                }
            }
        }
        return false;
    }
  public:
    bool isCycle(int V, vector<int> adj[]) {
        int vis[V] = {0};
        for(int i = 0; i < V; i++) {
            if(!vis[i]) {
                if(detect(i, adj, vis)) return true;
            }
        }
        return false;
    }
};
// Time Complexity: O(V + 2E)
// Space Complexity: O(V)`,
                        display_order: 0
                    },
                    {
                        title: 'Bipartite Graph',
                        slug: 'bipartite-graph',
                        description: 'Check if a graph can be colored using exactly 2 colors.',
                        category: 'interview',
                        difficulty: 'medium',
                        platform_url: 'https://leetcode.com/problems/is-graph-bipartite/',
                        external_link: 'https://www.youtube.com/watch?v=-vu34sct1g8',
                        hints: 'Use graph coloring with BFS or DFS.',
                        examples: 'Input: graph = [[1,2,3],[0,2],[0,1,3],[0,2]]\nOutput: false',
                        approach: 'Use an array to store colors (0 and 1) initialized to -1. Traverse using BFS/DFS, color nodes alternatively. If an adjacent node has the same color, it is not bipartite.',
                        solution_code: `class Solution {
private:
    bool check(int start, int V, vector<vector<int>>& graph, vector<int>& color) {
        queue<int> q;
        q.push(start);
        color[start] = 0;
        
        while(!q.empty()) {
            int node = q.front();
            q.pop();
            
            for(auto it : graph[node]) {
                if(color[it] == -1) {
                    color[it] = !color[node];
                    q.push(it);
                }
                else if (color[it] == color[node]) {
                    return false;
                }
            }
        }
        return true;
    }
public:
    bool isBipartite(vector<vector<int>>& graph) {
        int V = graph.size();
        vector<int> color(V, -1);
        for(int i = 0; i < V; i++) {
            if(color[i] == -1) {
                if(check(i, V, graph, color) == false) {
                    return false;
                }
            }
        }
        return true;
    }
};
// Time Complexity: O(V + E)
// Space Complexity: O(V)`,
                        display_order: 1
                    },
                    {
                        title: 'Topological Sort or Kahns Algorithm',
                        slug: 'topological-sort',
                        description: 'Linear ordering of vertices such that for every directed edge u -> v, vertex u comes before v in the ordering.',
                        category: 'interview',
                        difficulty: 'medium',
                        platform_url: 'https://practice.geeksforgeeks.org/problems/topological-sort/1',
                        external_link: 'https://www.youtube.com/watch?v=73sneFXuTEg',
                        hints: 'Find in-degrees of all nodes. Push nodes with 0 in-degree to a queue.',
                        examples: 'Input: V = 6, E = 6, edges = [[5,2],[5,0],[4,0],[4,1],[2,3],[3,1]]\nOutput: 5 4 2 3 1 0',
                        approach: 'Kahn\'s Algorithm (BFS): Calculate in-degrees. Push 0 in-degree nodes into Queue. Pop and append to answer, then reduce in-degree of neighbors. Repeat until empty.',
                        solution_code: `class Solution {
  public:
    vector<int> topoSort(int V, vector<int> adj[]) {
        int indegree[V] = {0};
        for(int i = 0; i < V; i++) {
            for(auto it : adj[i]) {
                indegree[it]++;
            }
        }
        
        queue<int> q;
        for(int i = 0; i < V; i++) {
            if(indegree[i] == 0) q.push(i);
        }
        
        vector<int> topo;
        while(!q.empty()) {
            int node = q.front();
            q.pop();
            topo.push_back(node);
            
            for(auto it : adj[node]) {
                indegree[it]--;
                if(indegree[it] == 0) q.push(it);
            }
        }
        return topo;
    }
};
// Time Complexity: O(V + E)
// Space Complexity: O(V)`,
                        display_order: 2
                    },
                    {
                        title: 'Detect a Cycle in a Directed Graph',
                        slug: 'detect-cycle-in-directed-graph',
                        description: 'Check if a directed graph contains any cycle.',
                        category: 'interview',
                        difficulty: 'medium',
                        platform_url: 'https://practice.geeksforgeeks.org/problems/detect-cycle-in-a-directed-graph/1',
                        external_link: 'https://www.youtube.com/watch?v=iTBaI90lpDQ',
                        hints: 'Use Kahn\'s algorithm or track path visited during DFS.',
                        examples: 'Input: V = 4, edges = [[0,1], [1,2], [2,3], [3,1]]\nOutput: 1 (Cycle exists)',
                        approach: 'Using Kahn\'s Algorithm: If the topological sort does not contain V elements, it implies there is a cycle because nodes in a cycle never reach 0 in-degree.',
                        solution_code: `class Solution {
  public:
    bool isCyclic(int V, vector<int> adj[]) {
        int indegree[V] = {0};
        for(int i = 0; i < V; i++) {
            for(auto it : adj[i]) {
                indegree[it]++;
            }
        }
        
        queue<int> q;
        for(int i = 0; i < V; i++) {
            if(indegree[i] == 0) q.push(i);
        }
        
        int cnt = 0;
        while(!q.empty()) {
            int node = q.front();
            q.pop();
            cnt++;
            
            for(auto it : adj[node]) {
                indegree[it]--;
                if(indegree[it] == 0) q.push(it);
            }
        }
        
        return (cnt != V);
    }
};
// Time Complexity: O(V + E)
// Space Complexity: O(V)`,
                        display_order: 3
                    }
                ]
            }
        ]
    }
};

async function seed() {
    try {
        console.log('Seeding Graph Data Part 1...');
        
        // 1. Insert Topic
        const topicQuery = `
            INSERT INTO topics (course_id, title, slug, description, display_order)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (course_id, slug) 
            DO UPDATE SET 
                title = EXCLUDED.title, 
                description = EXCLUDED.description, 
                display_order = EXCLUDED.display_order
            RETURNING id;
        `;
        
        const topicResult = await pool.query(topicQuery, [
            courseId,
            seedData.topic.title,
            seedData.topic.slug,
            seedData.topic.description,
            seedData.topic.display_order
        ]);
        
        const topicId = topicResult.rows[0].id;
        console.log(`✅ Topic '${seedData.topic.title}' inserted/updated.`);

        // 2. Insert Subtopics
        for (const sub of seedData.topic.subtopics) {
            const subQuery = `
                INSERT INTO subtopics (topic_id, title, slug, description, video_url, display_order)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (topic_id, slug) 
                DO UPDATE SET 
                    title = EXCLUDED.title, 
                    description = EXCLUDED.description, 
                    video_url = EXCLUDED.video_url, 
                    display_order = EXCLUDED.display_order
                RETURNING id;
            `;
            
            const subResult = await pool.query(subQuery, [
                topicId,
                sub.title,
                sub.slug,
                sub.description,
                sub.video_url,
                sub.display_order
            ]);
            
            const subId = subResult.rows[0].id;
            console.log(`  ✅ Subtopic '${sub.title}' inserted/updated.`);

            // 3. Insert Problems
            for (const prob of sub.problems) {
                const probQuery = `
                    INSERT INTO problems (
                        subtopic_id, title, slug, description, category, 
                        difficulty, platform_url, external_link, hints, 
                        examples, approach, solution_code, display_order
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                    ON CONFLICT (subtopic_id, slug) 
                    DO UPDATE SET 
                        title = EXCLUDED.title, 
                        description = EXCLUDED.description, 
                        category = EXCLUDED.category, 
                        difficulty = EXCLUDED.difficulty, 
                        platform_url = EXCLUDED.platform_url, 
                        external_link = EXCLUDED.external_link, 
                        hints = EXCLUDED.hints, 
                        examples = EXCLUDED.examples, 
                        approach = EXCLUDED.approach, 
                        solution_code = EXCLUDED.solution_code, 
                        display_order = EXCLUDED.display_order
                `;
                
                await pool.query(probQuery, [
                    subId,
                    prob.title,
                    prob.slug,
                    prob.description,
                    prob.category,
                    prob.difficulty,
                    prob.platform_url,
                    prob.external_link,
                    prob.hints,
                    prob.examples,
                    prob.approach,
                    prob.solution_code,
                    prob.display_order
                ]);
                console.log(`    ✅ Problem '${prob.title}' inserted/updated.`);
            }
        }
        
        console.log('🎉 Graph Part 1 Seeding Complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during seeding:', err);
        process.exit(1);
    }
}

seed();
