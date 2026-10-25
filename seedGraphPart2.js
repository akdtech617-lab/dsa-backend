require('dotenv').config();
const db = require('./src/config/db');

const COURSE_ID = 'd2284cdb-751f-40f0-b7f2-c9ca6c277efe';

const subtopicsData = [
  {
    title: "Hard Problems",
    slug: "hard-problems",
    description: "Hard level graph problems focusing on cycle detection, topological sorting, and BFS/DFS variations.",
    video_url: "https://www.youtube.com/watch?v=u8t9uzZlMwk",
    display_order: 3,
    problems: [
      {
        title: "Find Eventual Safe States",
        slug: "find-eventual-safe-states",
        description: "Find all the safe nodes in a directed graph. A node is safe if every possible path starting from that node leads to a terminal node.",
        category: "interview",
        difficulty: "hard",
        platform_url: "https://leetcode.com/problems/find-eventual-safe-states/",
        external_link: "https://www.youtube.com/watch?v=u8t9uzZlMwk",
        hints: "Nodes involved in a cycle or connected to a cycle are not safe.",
        examples: "Input: graph = [[1,2],[2,3],[5],[0],[5],[],[]]\nOutput: [2,4,5,6]",
        approach: "Brute Force: DFS from each node to detect cycles. Optimal: Kahn's algorithm on reversed graph or DFS with 3 states (unvisited, visiting, safe).",
        solution_code: `// C++ Optimal Solution (DFS)
// Time: O(V + E), Space: O(V)
class Solution {
    bool dfs(int node, vector<vector<int>>& graph, vector<int>& state) {
        if (state[node] > 0) return state[node] == 2;
        state[node] = 1;
        for (int neighbor : graph[node]) {
            if (state[neighbor] == 2) continue;
            if (state[neighbor] == 1 || !dfs(neighbor, graph, state)) return false;
        }
        state[node] = 2;
        return true;
    }
public:
    vector<int> eventualSafeNodes(vector<vector<int>>& graph) {
        int n = graph.size();
        vector<int> state(n, 0), ans;
        for (int i = 0; i < n; i++) if (dfs(i, graph, state)) ans.push_back(i);
        return ans;
    }
};`,
        display_order: 1
      },
      {
        title: "Course Schedule I",
        slug: "course-schedule-i",
        description: "Determine if it is possible to finish all courses given prerequisite pairs.",
        category: "interview",
        difficulty: "hard",
        platform_url: "https://leetcode.com/problems/course-schedule/",
        external_link: "https://www.youtube.com/watch?v=WAOfKpxYHR8",
        hints: "This is equivalent to detecting a cycle in a directed graph.",
        examples: "Input: numCourses = 2, prerequisites = [[1,0]]\nOutput: true",
        approach: "Brute Force: Check all permutations. Optimal: Use Kahn's algorithm for topological sort. If the sorted list has fewer elements than numCourses, there's a cycle.",
        solution_code: `// C++ Optimal Solution (Kahn's Algorithm)
// Time: O(V + E), Space: O(V + E)
class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);
        vector<int> indegree(numCourses, 0);
        for (auto& p : prerequisites) {
            adj[p[1]].push_back(p[0]);
            indegree[p[0]]++;
        }
        queue<int> q;
        for (int i = 0; i < numCourses; i++) if (indegree[i] == 0) q.push(i);
        int count = 0;
        while (!q.empty()) {
            int node = q.front(); q.pop();
            count++;
            for (int neighbor : adj[node]) {
                if (--indegree[neighbor] == 0) q.push(neighbor);
            }
        }
        return count == numCourses;
    }
};`,
        display_order: 2
      },
      {
        title: "Course Schedule II",
        slug: "course-schedule-ii",
        description: "Return the ordering of courses you should take to finish all courses.",
        category: "interview",
        difficulty: "hard",
        platform_url: "https://leetcode.com/problems/course-schedule-ii/",
        external_link: "https://www.youtube.com/watch?v=WAOfKpxYHR8",
        hints: "Return the valid topological sorting of the prerequisite graph.",
        examples: "Input: numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]\nOutput: [0,1,2,3] or [0,2,1,3]",
        approach: "Optimal: Use Kahn's algorithm (BFS) or DFS with a stack to generate the topological sort order.",
        solution_code: `// C++ Optimal Solution
// Time: O(V + E), Space: O(V + E)
class Solution {
public:
    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);
        vector<int> indegree(numCourses, 0), order;
        for (auto& p : prerequisites) {
            adj[p[1]].push_back(p[0]);
            indegree[p[0]]++;
        }
        queue<int> q;
        for (int i = 0; i < numCourses; i++) if (indegree[i] == 0) q.push(i);
        while (!q.empty()) {
            int node = q.front(); q.pop();
            order.push_back(node);
            for (int neighbor : adj[node]) {
                if (--indegree[neighbor] == 0) q.push(neighbor);
            }
        }
        return order.size() == numCourses ? order : vector<int>();
    }
};`,
        display_order: 3
      },
      {
        title: "Alien Dictionary",
        slug: "alien-dictionary",
        description: "Given a sorted dictionary of an alien language, find the order of characters.",
        category: "interview",
        difficulty: "hard",
        platform_url: "https://leetcode.com/problems/alien-dictionary/",
        external_link: "https://www.youtube.com/watch?v=U3N_je7tWgw",
        hints: "Compare adjacent words to find directed edges between characters.",
        examples: "Input: words = [\"wrt\",\"wrf\",\"er\",\"ett\",\"rftt\"]\nOutput: \"wertf\"",
        approach: "Build a graph comparing adjacent words. Then find the topological sort of the graph.",
        solution_code: `// C++ Optimal Solution
// Time: O(C), Space: O(1) where C is total length of all words
class Solution {
public:
    string alienOrder(vector<string>& words) {
        unordered_map<char, unordered_set<char>> adj;
        unordered_map<char, int> indegree;
        for(auto& w : words) for(char c : w) indegree[c] = 0;
        for(int i = 0; i < words.size() - 1; i++) {
            string w1 = words[i], w2 = words[i+1];
            if(w1.length() > w2.length() && w1.substr(0, w2.length()) == w2) return "";
            for(int j = 0; j < min(w1.length(), w2.length()); j++) {
                if(w1[j] != w2[j]) {
                    if(!adj[w1[j]].count(w2[j])) {
                        adj[w1[j]].insert(w2[j]);
                        indegree[w2[j]]++;
                    }
                    break;
                }
            }
        }
        queue<char> q;
        for(auto& p : indegree) if(p.second == 0) q.push(p.first);
        string ans = "";
        while(!q.empty()) {
            char c = q.front(); q.pop();
            ans += c;
            for(char next : adj[c]) {
                if(--indegree[next] == 0) q.push(next);
            }
        }
        return ans.length() == indegree.size() ? ans : "";
    }
};`,
        display_order: 4
      },
      {
        title: "Shortest Path in DAG",
        slug: "shortest-path-in-dag",
        description: "Find the shortest path from source to all vertices in a Directed Acyclic Graph.",
        category: "interview",
        difficulty: "medium",
        platform_url: "https://practice.geeksforgeeks.org/problems/shortest-path-in-undirected-graph/1",
        external_link: "https://www.youtube.com/watch?v=ZUFQf628K8U",
        hints: "Topological sort helps to visit nodes in the correct order to update distances.",
        examples: "Input: N = 6, M = 7, edges = [[0,1,2],[0,4,1],[4,5,4],[4,2,2],[1,2,3],[2,3,6],[5,3,1]]\nOutput: [0,2,3,6,1,5]",
        approach: "Find topological sort using DFS. Then relax edges for each node in the sorted order.",
        solution_code: `// C++ Optimal Solution
// Time: O(V + E), Space: O(V + E)
class Solution {
    void topoSort(int node, vector<pair<int, int>> adj[], vector<int>& vis, stack<int>& st) {
        vis[node] = 1;
        for (auto it : adj[node]) {
            if (!vis[it.first]) topoSort(it.first, adj, vis, st);
        }
        st.push(node);
    }
public:
    vector<int> shortestPath(int N, int M, vector<vector<int>>& edges) {
        vector<pair<int, int>> adj[N];
        for (int i = 0; i < M; i++) adj[edges[i][0]].push_back({edges[i][1], edges[i][2]});
        vector<int> vis(N, 0);
        stack<int> st;
        for (int i = 0; i < N; i++) if (!vis[i]) topoSort(i, adj, vis, st);
        vector<int> dist(N, 1e9);
        dist[0] = 0; // source is 0
        while (!st.empty()) {
            int node = st.top(); st.pop();
            if (dist[node] != 1e9) {
                for (auto it : adj[node]) {
                    if (dist[node] + it.second < dist[it.first]) {
                        dist[it.first] = dist[node] + it.second;
                    }
                }
            }
        }
        for(int i = 0; i < N; i++) if(dist[i] == 1e9) dist[i] = -1;
        return dist;
    }
};`,
        display_order: 5
      },
      {
        title: "Shortest Path in Undirected Graph with Unit Weights",
        slug: "shortest-path-in-undirected-graph-with-unit-weights",
        description: "Find the shortest path to all vertices from a source in an unweighted graph.",
        category: "interview",
        difficulty: "medium",
        platform_url: "https://practice.geeksforgeeks.org/problems/shortest-path-in-undirected-graph-having-unit-distance/1",
        external_link: "https://www.youtube.com/watch?v=C4gKdWX9tlY",
        hints: "Use simple BFS, the first time a node is reached it is via the shortest path.",
        examples: "Input: V = 9, edges = [[0,1],[0,3],[3,4],[4,5],[5,6],[1,2],[2,6],[6,7],[7,8],[6,8]], src = 0\nOutput: [0,1,2,1,2,3,3,4,4]",
        approach: "Perform Breadth-First Search (BFS) from the source node and update distances.",
        solution_code: `// C++ Optimal Solution
// Time: O(V + E), Space: O(V + E)
class Solution {
public:
    vector<int> shortestPath(vector<vector<int>>& edges, int N, int M, int src) {
        vector<int> adj[N];
        for(auto it : edges) {
            adj[it[0]].push_back(it[1]);
            adj[it[1]].push_back(it[0]);
        }
        vector<int> dist(N, 1e9);
        dist[src] = 0;
        queue<int> q;
        q.push(src);
        while(!q.empty()) {
            int node = q.front(); q.pop();
            for(auto it : adj[node]) {
                if(dist[node] + 1 < dist[it]) {
                    dist[it] = dist[node] + 1;
                    q.push(it);
                }
            }
        }
        for(int i = 0; i < N; i++) if(dist[i] == 1e9) dist[i] = -1;
        return dist;
    }
};`,
        display_order: 6
      },
      {
        title: "Word Ladder I",
        slug: "word-ladder-i",
        description: "Find the length of the shortest transformation sequence from beginWord to endWord.",
        category: "interview",
        difficulty: "hard",
        platform_url: "https://leetcode.com/problems/word-ladder/",
        external_link: "https://www.youtube.com/watch?v=tRPda0rcf8E",
        hints: "Model the problem as an unweighted graph where edges connect words differing by one character.",
        examples: "Input: beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]\nOutput: 5",
        approach: "Use BFS. At each word, try changing each character to all 26 letters and check if it exists in the set of valid words.",
        solution_code: `// C++ Optimal Solution
// Time: O(N * L^2), Space: O(N) where L is word length, N is number of words
class Solution {
public:
    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
        unordered_set<string> dict(wordList.begin(), wordList.end());
        if (!dict.count(endWord)) return 0;
        queue<string> q;
        q.push(beginWord);
        int steps = 1;
        while (!q.empty()) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                string word = q.front(); q.pop();
                if (word == endWord) return steps;
                for (int j = 0; j < word.size(); j++) {
                    char original = word[j];
                    for (char c = 'a'; c <= 'z'; c++) {
                        word[j] = c;
                        if (dict.count(word)) {
                            dict.erase(word);
                            q.push(word);
                        }
                    }
                    word[j] = original;
                }
            }
            steps++;
        }
        return 0;
    }
};`,
        display_order: 7
      },
      {
        title: "Word Ladder II",
        slug: "word-ladder-ii",
        description: "Find all the shortest transformation sequences from beginWord to endWord.",
        category: "interview",
        difficulty: "hard",
        platform_url: "https://leetcode.com/problems/word-ladder-ii/",
        external_link: "https://www.youtube.com/watch?v=DREutrv2XD0",
        hints: "Use BFS to find the shortest distance to each word, then use DFS to reconstruct the paths.",
        examples: "Input: beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]\nOutput: [[\"hit\",\"hot\",\"dot\",\"dog\",\"cog\"],[\"hit\",\"hot\",\"lot\",\"log\",\"cog\"]]",
        approach: "BFS to establish the minimum levels of each string, followed by DFS from endWord to beginWord to collect all valid shortest paths.",
        solution_code: `// C++ Optimal Solution
// Time: Exponential, Space: O(N)
class Solution {
    unordered_map<string, int> mpp;
    vector<vector<string>> ans;
    string b;
    void dfs(string word, vector<string>& seq) {
        if(word == b) {
            reverse(seq.begin(), seq.end());
            ans.push_back(seq);
            reverse(seq.begin(), seq.end());
            return;
        }
        int steps = mpp[word];
        for(int i = 0; i < word.size(); i++) {
            char original = word[i];
            for(char c = 'a'; c <= 'z'; c++) {
                word[i] = c;
                if(mpp.count(word) && mpp[word] + 1 == steps) {
                    seq.push_back(word);
                    dfs(word, seq);
                    seq.pop_back();
                }
            }
            word[i] = original;
        }
    }
public:
    vector<vector<string>> findLadders(string beginWord, string endWord, vector<string>& wordList) {
        unordered_set<string> st(wordList.begin(), wordList.end());
        queue<string> q;
        b = beginWord;
        q.push(beginWord);
        mpp[beginWord] = 1;
        st.erase(beginWord);
        while(!q.empty()) {
            string word = q.front(); q.pop();
            if(word == endWord) break;
            int steps = mpp[word];
            for(int i = 0; i < word.size(); i++) {
                char original = word[i];
                for(char c = 'a'; c <= 'z'; c++) {
                    word[i] = c;
                    if(st.count(word)) {
                        q.push(word);
                        st.erase(word);
                        mpp[word] = steps + 1;
                    }
                }
                word[i] = original;
            }
        }
        if(mpp.count(endWord)) {
            vector<string> seq;
            seq.push_back(endWord);
            dfs(endWord, seq);
        }
        return ans;
    }
};`,
        display_order: 8
      }
    ]
  },
  {
    title: "Shortest Path Algorithms",
    slug: "shortest-path-algorithms",
    description: "Various shortest path algorithms including Dijkstra, Bellman-Ford, and Floyd-Warshall.",
    video_url: "https://www.youtube.com/watch?v=V6H1qAeB-l4",
    display_order: 4,
    problems: [
      {
        title: "Dijkstra's Algorithm",
        slug: "dijkstras-algorithm",
        description: "Implement Dijkstra's Algorithm to find the shortest path from a source node to all other nodes.",
        category: "interview",
        difficulty: "medium",
        platform_url: "https://practice.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1",
        external_link: "https://www.youtube.com/watch?v=V6H1qAeB-l4",
        hints: "Use a priority queue (min-heap) to greedily pick the node with the shortest current distance.",
        examples: "Input: V = 2, adj = {{{1, 9}}, {{0, 9}}}, S = 0\nOutput: [0, 9]",
        approach: "Maintain a min-heap of {distance, node}. Relax edges continuously. Visited shortest distances are definitive since weights are non-negative.",
        solution_code: `// C++ Optimal Solution
// Time: O(E log V), Space: O(V)
class Solution {
public:
    vector<int> dijkstra(int V, vector<vector<int>> adj[], int S) {
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
        vector<int> dist(V, 1e9);
        dist[S] = 0;
        pq.push({0, S});
        while(!pq.empty()) {
            int dis = pq.top().first;
            int node = pq.top().second;
            pq.pop();
            for(auto it : adj[node]) {
                int edgeWeight = it[1];
                int adjNode = it[0];
                if(dis + edgeWeight < dist[adjNode]) {
                    dist[adjNode] = dis + edgeWeight;
                    pq.push({dist[adjNode], adjNode});
                }
            }
        }
        return dist;
    }
};`,
        display_order: 1
      },
      {
        title: "Print Shortest Path",
        slug: "print-shortest-path",
        description: "Find and print the shortest path from vertex 1 to vertex n in an undirected weighted graph.",
        category: "interview",
        difficulty: "medium",
        platform_url: "https://practice.geeksforgeeks.org/problems/shortest-path-in-weighted-undirected-graph/1",
        external_link: "https://www.youtube.com/watch?v=rp1SMw7HSO8",
        hints: "Modify Dijkstra to keep track of the parent of each node as you update its minimum distance.",
        examples: "Input: n = 5, m = 6, edges = [[1,2,2], [2,5,5], [2,3,4], [1,4,1], [4,3,3], [3,5,1]]\nOutput: [1,4,3,5]",
        approach: "Use a parent array along with Dijkstra's algorithm. Backtrack from destination to source using the parent array.",
        solution_code: `// C++ Optimal Solution
// Time: O(E log V), Space: O(V)
class Solution {
public:
    vector<int> shortestPath(int n, int m, vector<vector<int>>& edges) {
        vector<pair<int, int>> adj[n + 1];
        for (auto it : edges) {
            adj[it[0]].push_back({it[1], it[2]});
            adj[it[1]].push_back({it[0], it[2]});
        }
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
        vector<int> dist(n + 1, 1e9), parent(n + 1);
        for (int i = 1; i <= n; i++) parent[i] = i;
        dist[1] = 0;
        pq.push({0, 1});
        while (!pq.empty()) {
            auto it = pq.top(); pq.pop();
            int node = it.second, dis = it.first;
            for (auto iter : adj[node]) {
                int adjNode = iter.first, edgW = iter.second;
                if (dis + edgW < dist[adjNode]) {
                    dist[adjNode] = dis + edgW;
                    pq.push({dist[adjNode], adjNode});
                    parent[adjNode] = node;
                }
            }
        }
        if (dist[n] == 1e9) return {-1};
        vector<int> path;
        int node = n;
        while (parent[node] != node) {
            path.push_back(node);
            node = parent[node];
        }
        path.push_back(1);
        reverse(path.begin(), path.end());
        return path;
    }
};`,
        display_order: 2
      },
      {
        title: "Shortest Distance in a Binary Maze",
        slug: "shortest-distance-in-a-binary-maze",
        description: "Find the shortest clear path in a matrix of 0s and 1s, where we can move in 8 directions.",
        category: "interview",
        difficulty: "medium",
        platform_url: "https://leetcode.com/problems/shortest-path-in-binary-matrix/",
        external_link: "https://www.youtube.com/watch?v=U5Mw4eyUmw4",
        hints: "Since all edge weights are 1, simple BFS guarantees the shortest path.",
        examples: "Input: grid = [[0,1],[1,0]]\nOutput: 2",
        approach: "Use BFS starting from (0,0). Queue stores {distance, {row, col}}. Skip blocked cells (1s).",
        solution_code: `// C++ Optimal Solution
// Time: O(N^2), Space: O(N^2)
class Solution {
public:
    int shortestPathBinaryMatrix(vector<vector<int>>& grid) {
        int n = grid.size();
        if (grid[0][0] == 1 || grid[n-1][n-1] == 1) return -1;
        queue<pair<int, pair<int, int>>> q;
        vector<vector<int>> dist(n, vector<int>(n, 1e9));
        q.push({1, {0, 0}});
        dist[0][0] = 1;
        int dr[] = {-1, -1, -1, 0, 1, 1, 1, 0};
        int dc[] = {-1, 0, 1, 1, 1, 0, -1, -1};
        while (!q.empty()) {
            auto it = q.front(); q.pop();
            int dis = it.first, r = it.second.first, c = it.second.second;
            if (r == n - 1 && c == n - 1) return dis;
            for (int i = 0; i < 8; i++) {
                int nr = r + dr[i], nc = c + dc[i];
                if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] == 0 && dis + 1 < dist[nr][nc]) {
                    dist[nr][nc] = dis + 1;
                    q.push({dis + 1, {nr, nc}});
                }
            }
        }
        return -1;
    }
};`,
        display_order: 3
      },
      {
        title: "Path with Minimum Effort",
        slug: "path-with-minimum-effort",
        description: "Find a path from top-left to bottom-right that minimizes the maximum absolute difference in heights.",
        category: "interview",
        difficulty: "medium",
        platform_url: "https://leetcode.com/problems/path-with-minimum-effort/",
        external_link: "https://www.youtube.com/watch?v=0ytpZyiZFhA",
        hints: "Use Dijkstra's algorithm. The \"distance\" is the maximum height difference along a path.",
        examples: "Input: heights = [[1,2,2],[3,8,2],[5,3,5]]\nOutput: 2",
        approach: "Use a priority queue for Dijkstra's algorithm. Keep track of the maximum effort required on any path reaching cell (r, c).",
        solution_code: `// C++ Optimal Solution
// Time: O(E log V), Space: O(V)
class Solution {
public:
    int minimumEffortPath(vector<vector<int>>& heights) {
        int n = heights.size(), m = heights[0].size();
        priority_queue<pair<int, pair<int, int>>, vector<pair<int, pair<int, int>>>, greater<>> pq;
        vector<vector<int>> dist(n, vector<int>(m, 1e9));
        dist[0][0] = 0;
        pq.push({0, {0, 0}});
        int dr[] = {-1, 0, 1, 0}, dc[] = {0, 1, 0, -1};
        while (!pq.empty()) {
            auto it = pq.top(); pq.pop();
            int diff = it.first, r = it.second.first, c = it.second.second;
            if (r == n - 1 && c == m - 1) return diff;
            for (int i = 0; i < 4; i++) {
                int nr = r + dr[i], nc = c + dc[i];
                if (nr >= 0 && nc >= 0 && nr < n && nc < m) {
                    int newEffort = max(abs(heights[r][c] - heights[nr][nc]), diff);
                    if (newEffort < dist[nr][nc]) {
                        dist[nr][nc] = newEffort;
                        pq.push({newEffort, {nr, nc}});
                    }
                }
            }
        }
        return 0;
    }
};`,
        display_order: 4
      },
      {
        title: "Cheapest Flight within K Stops",
        slug: "cheapest-flight-within-k-stops",
        description: "Find the cheapest price from src to dst with at most K stops.",
        category: "interview",
        difficulty: "hard",
        platform_url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
        external_link: "https://www.youtube.com/watch?v=9XybHVqTHcQ",
        hints: "Use a queue instead of a priority queue, sorting primarily by stops rather than distance.",
        examples: "Input: n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 1\nOutput: 200",
        approach: "Use BFS where state is {stops, node, cost}. A simple queue is enough since stops increment by 1 at each level.",
        solution_code: `// C++ Optimal Solution
// Time: O(E), Space: O(V + E)
class Solution {
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
        vector<pair<int, int>> adj[n];
        for (auto it : flights) adj[it[0]].push_back({it[1], it[2]});
        queue<pair<int, pair<int, int>>> q; // {stops, {node, cost}}
        q.push({0, {src, 0}});
        vector<int> dist(n, 1e9);
        dist[src] = 0;
        while (!q.empty()) {
            auto it = q.front(); q.pop();
            int stops = it.first, node = it.second.first, cost = it.second.second;
            if (stops > k) continue;
            for (auto iter : adj[node]) {
                int adjNode = iter.first, edgW = iter.second;
                if (cost + edgW < dist[adjNode] && stops <= k) {
                    dist[adjNode] = cost + edgW;
                    q.push({stops + 1, {adjNode, cost + edgW}});
                }
            }
        }
        return dist[dst] == 1e9 ? -1 : dist[dst];
    }
};`,
        display_order: 5
      },
      {
        title: "Minimum Multiplications to Reach End",
        slug: "minimum-multiplications-to-reach-end",
        description: "Given a start number, end number and an array, find minimum multiplications to reach end modulo 100000.",
        category: "interview",
        difficulty: "hard",
        platform_url: "https://practice.geeksforgeeks.org/problems/minimum-multiplications-to-reach-end/1",
        external_link: "https://www.youtube.com/watch?v=_BvEJ3VIDWw",
        hints: "Treat nodes as numbers from 0 to 99999. Use BFS to find the shortest path.",
        examples: "Input: arr = [2, 5, 7], start = 3, end = 30\nOutput: 2 (3*2=6, 6*5=30)",
        approach: "Use BFS. At each node, multiply by all array elements modulo 100000. It's essentially Dijkstra with unit weights.",
        solution_code: `// C++ Optimal Solution
// Time: O(100000 * N), Space: O(100000)
class Solution {
public:
    int minimumMultiplications(vector<int>& arr, int start, int end) {
        if(start == end) return 0;
        queue<pair<int, int>> q;
        vector<int> dist(100000, 1e9);
        dist[start] = 0;
        q.push({start, 0});
        while(!q.empty()) {
            int node = q.front().first;
            int steps = q.front().second;
            q.pop();
            for(auto it : arr) {
                int num = (node * it) % 100000;
                if(steps + 1 < dist[num]) {
                    dist[num] = steps + 1;
                    if(num == end) return steps + 1;
                    q.push({num, steps + 1});
                }
            }
        }
        return -1;
    }
};`,
        display_order: 6
      },
      {
        title: "Number of Ways to Arrive at Destination",
        slug: "number-of-ways-to-arrive-at-destination",
        description: "Find the total number of shortest paths from source to destination in a weighted undirected graph.",
        category: "interview",
        difficulty: "hard",
        platform_url: "https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/",
        external_link: "https://www.youtube.com/watch?v=_-0mx0SmYxA",
        hints: "Maintain an array to count the number of shortest paths ending at each node.",
        examples: "Input: n = 7, roads = [[0,6,7],[0,1,2],[1,2,3],[1,3,3],[6,3,3],[3,5,1],[6,5,1],[2,5,1],[0,4,5],[4,6,2]]\nOutput: 4",
        approach: "Use Dijkstra's algorithm. If we find a strictly shorter path, update count. If we find an equally short path, add the counts.",
        solution_code: `// C++ Optimal Solution
// Time: O(E log V), Space: O(V)
class Solution {
public:
    int countPaths(int n, vector<vector<int>>& roads) {
        vector<pair<int, int>> adj[n];
        for (auto it : roads) {
            adj[it[0]].push_back({it[1], it[2]});
            adj[it[1]].push_back({it[0], it[2]});
        }
        priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<>> pq;
        vector<long long> dist(n, LONG_MAX);
        vector<int> ways(n, 0);
        dist[0] = 0; ways[0] = 1;
        pq.push({0, 0});
        int mod = 1e9 + 7;
        while (!pq.empty()) {
            long long dis = pq.top().first;
            int node = pq.top().second;
            pq.pop();
            for (auto it : adj[node]) {
                int adjNode = it.first;
                long long edgW = it.second;
                if (dis + edgW < dist[adjNode]) {
                    dist[adjNode] = dis + edgW;
                    pq.push({dist[adjNode], adjNode});
                    ways[adjNode] = ways[node];
                } else if (dis + edgW == dist[adjNode]) {
                    ways[adjNode] = (ways[adjNode] + ways[node]) % mod;
                }
            }
        }
        return ways[n - 1] % mod;
    }
};`,
        display_order: 7
      },
      {
        title: "Bellman-Ford Algorithm",
        slug: "bellman-ford-algorithm",
        description: "Find the shortest path to all nodes considering negative edges and detect negative weight cycles.",
        category: "interview",
        difficulty: "hard",
        platform_url: "https://practice.geeksforgeeks.org/problems/distance-from-the-source-bellman-ford-algorithm/0",
        external_link: "https://www.youtube.com/watch?v=0vVofAhAYjc",
        hints: "Relax all edges V-1 times. If distances change on the V-th relaxation, there's a negative cycle.",
        examples: "Input: V = 3, edges = [[0,1,5],[1,0,3],[1,2,-1],[2,0,1]], S = 2\nOutput: [1, 6, 0]",
        approach: "Relax all E edges for V-1 iterations. Run one more time to detect if any distance still reduces.",
        solution_code: `// C++ Optimal Solution
// Time: O(V * E), Space: O(V)
class Solution {
public:
    vector<int> bellman_ford(int V, vector<vector<int>>& edges, int S) {
        vector<int> dist(V, 1e8);
        dist[S] = 0;
        for (int i = 0; i < V - 1; i++) {
            for (auto it : edges) {
                int u = it[0], v = it[1], wt = it[2];
                if (dist[u] != 1e8 && dist[u] + wt < dist[v]) {
                    dist[v] = dist[u] + wt;
                }
            }
        }
        for (auto it : edges) {
            int u = it[0], v = it[1], wt = it[2];
            if (dist[u] != 1e8 && dist[u] + wt < dist[v]) {
                return {-1};
            }
        }
        return dist;
    }
};`,
        display_order: 8
      },
      {
        title: "Floyd-Warshall Algorithm",
        slug: "floyd-warshall-algorithm",
        description: "Find the shortest path between all pairs of vertices in a weighted graph.",
        category: "interview",
        difficulty: "hard",
        platform_url: "https://practice.geeksforgeeks.org/problems/implementing-floyd-warshall2042/1",
        external_link: "https://www.youtube.com/watch?v=YbY8cVwWAvw",
        hints: "Use dynamic programming to evaluate shortest paths considering each vertex as an intermediate node.",
        examples: "Input: matrix = [[0, 25], [-1, 0]]\nOutput: [[0, 25], [-1, 0]] (with -1 indicating no path initially)",
        approach: "Triple nested loop. For every pair (i,j), check if going through intermediate node k provides a shorter path.",
        solution_code: `// C++ Optimal Solution
// Time: O(V^3), Space: O(V^2) for adjacency matrix
class Solution {
public:
    void shortest_distance(vector<vector<int>>& matrix){
        int n = matrix.size();
        for(int i = 0; i < n; i++){
            for(int j = 0; j < n; j++){
                if(matrix[i][j] == -1) matrix[i][j] = 1e9;
                if(i == j) matrix[i][j] = 0;
            }
        }
        for(int k = 0; k < n; k++){
            for(int i = 0; i < n; i++){
                for(int j = 0; j < n; j++){
                    if(matrix[i][k] < 1e9 && matrix[k][j] < 1e9)
                        matrix[i][j] = min(matrix[i][j], matrix[i][k] + matrix[k][j]);
                }
            }
        }
        for(int i = 0; i < n; i++){
            for(int j = 0; j < n; j++){
                if(matrix[i][j] >= 1e9) matrix[i][j] = -1;
            }
        }
    }
};`,
        display_order: 9
      },
      {
        title: "Find the City with the Smallest Number of Neighbors",
        slug: "find-the-city-with-the-smallest-number-of-neighbors",
        description: "Find the city with the fewest reachable cities within a distance threshold. Return largest ID if tied.",
        category: "interview",
        difficulty: "hard",
        platform_url: "https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/",
        external_link: "https://www.youtube.com/watch?v=PwMVbPwMtds",
        hints: "You need all-pairs shortest paths. Use Floyd-Warshall or run Dijkstra from each node.",
        examples: "Input: n = 4, edges = [[0,1,3],[1,2,1],[1,3,4],[2,3,1]], distanceThreshold = 4\nOutput: 3",
        approach: "Apply Floyd-Warshall to find all-pairs shortest distances. Then count reachable nodes for each city and pick the minimum.",
        solution_code: `// C++ Optimal Solution
// Time: O(V^3), Space: O(V^2)
class Solution {
public:
    int findTheCity(int n, vector<vector<int>>& edges, int distanceThreshold) {
        vector<vector<int>> dist(n, vector<int>(n, INT_MAX / 2));
        for(int i = 0; i < n; i++) dist[i][i] = 0;
        for(auto& edge : edges) {
            dist[edge[0]][edge[1]] = edge[2];
            dist[edge[1]][edge[0]] = edge[2];
        }
        for(int k = 0; k < n; k++) {
            for(int i = 0; i < n; i++) {
                for(int j = 0; j < n; j++) {
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
        int minCnt = n, city = -1;
        for(int i = 0; i < n; i++) {
            int cnt = 0;
            for(int j = 0; j < n; j++) {
                if(dist[i][j] <= distanceThreshold) cnt++;
            }
            if(cnt <= minCnt) {
                minCnt = cnt;
                city = i;
            }
        }
        return city;
    }
};`,
        display_order: 10
      },
      {
        title: "Network Delay Time",
        slug: "network-delay-time",
        description: "Find the minimum time it takes for a signal sent from node K to reach all other nodes.",
        category: "interview",
        difficulty: "medium",
        platform_url: "https://leetcode.com/problems/network-delay-time/",
        external_link: "https://www.youtube.com/watch?v=qmZjIGkrBjE",
        hints: "Use Dijkstra's algorithm to find the longest shortest-path from the source.",
        examples: "Input: times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2\nOutput: 2",
        approach: "Dijkstra's shortest path from K. The answer is the maximum distance to any node. If any node is unreachable, return -1.",
        solution_code: `// C++ Optimal Solution
// Time: O(E log V), Space: O(V + E)
class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        vector<pair<int, int>> adj[n + 1];
        for (auto& t : times) adj[t[0]].push_back({t[1], t[2]});
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
        vector<int> dist(n + 1, 1e9);
        dist[k] = 0;
        pq.push({0, k});
        while (!pq.empty()) {
            int d = pq.top().first, node = pq.top().second;
            pq.pop();
            if(d > dist[node]) continue;
            for (auto& edge : adj[node]) {
                int nxt = edge.first, w = edge.second;
                if (d + w < dist[nxt]) {
                    dist[nxt] = d + w;
                    pq.push({dist[nxt], nxt});
                }
            }
        }
        int ans = 0;
        for (int i = 1; i <= n; i++) {
            if (dist[i] == 1e9) return -1;
            ans = max(ans, dist[i]);
        }
        return ans;
    }
};`,
        display_order: 11
      },
      {
        title: "Swim in Rising Water",
        slug: "swim-in-rising-water",
        description: "Find the minimum time to reach the bottom-right square from top-left, where water rises over time.",
        category: "interview",
        difficulty: "hard",
        platform_url: "https://leetcode.com/problems/swim-in-rising-water/",
        external_link: "https://www.youtube.com/watch?v=amvrKlMLuGY",
        hints: "Use a priority queue (Dijkstra) or Binary Search + BFS/DFS.",
        examples: "Input: grid = [[0,2],[1,3]]\nOutput: 3",
        approach: "Use Dijkstra's algorithm. The cost to move to an adjacent cell is the maximum of the current path's max height and the adjacent cell's height.",
        solution_code: `// C++ Optimal Solution
// Time: O(N^2 log N), Space: O(N^2)
class Solution {
public:
    int swimInWater(vector<vector<int>>& grid) {
        int n = grid.size();
        priority_queue<pair<int, pair<int, int>>, vector<pair<int, pair<int, int>>>, greater<>> pq;
        vector<vector<int>> dist(n, vector<int>(n, 1e9));
        pq.push({grid[0][0], {0, 0}});
        dist[0][0] = grid[0][0];
        int dr[] = {-1, 0, 1, 0}, dc[] = {0, 1, 0, -1};
        while (!pq.empty()) {
            auto it = pq.top(); pq.pop();
            int t = it.first, r = it.second.first, c = it.second.second;
            if (r == n - 1 && c == n - 1) return t;
            for (int i = 0; i < 4; i++) {
                int nr = r + dr[i], nc = c + dc[i];
                if (nr >= 0 && nc >= 0 && nr < n && nc < n) {
                    int newTime = max(t, grid[nr][nc]);
                    if (newTime < dist[nr][nc]) {
                        dist[nr][nc] = newTime;
                        pq.push({newTime, {nr, nc}});
                    }
                }
            }
        }
        return 0;
    }
};`,
        display_order: 12
      }
    ]
  }
];

async function seedGraphPart2() {
  try {
    const res = await db.query(
      "SELECT id FROM topics WHERE slug = $1 AND course_id = $2",
      ['graphs', COURSE_ID]
    );

    if (res.rows.length === 0) {
      console.error('Topic "graphs" not found for the given course_id.');
      process.exit(1);
    }

    const topicId = res.rows[0].id;

    for (const subtopic of subtopicsData) {
      const subtopicQuery = `
        INSERT INTO subtopics (id, topic_id, title, slug, description, video_url, display_order)
        VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6)
        ON CONFLICT (topic_id, slug) DO UPDATE 
        SET title = EXCLUDED.title, 
            description = EXCLUDED.description, 
            video_url = EXCLUDED.video_url, 
            display_order = EXCLUDED.display_order
        RETURNING id;
      `;
      const subtopicRes = await db.query(subtopicQuery, [
        topicId,
        subtopic.title,
        subtopic.slug,
        subtopic.description,
        subtopic.video_url,
        subtopic.display_order
      ]);

      const subtopicId = subtopicRes.rows[0].id;

      for (const problem of subtopic.problems) {
        const problemQuery = `
          INSERT INTO problems (id, subtopic_id, title, slug, description, category, difficulty, platform_url, external_link, hints, examples, approach, solution_code, display_order)
          VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          ON CONFLICT (subtopic_id, slug) DO UPDATE 
          SET title = EXCLUDED.title,
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
        await db.query(problemQuery, [
          subtopicId,
          problem.title,
          problem.slug,
          problem.description,
          problem.category,
          problem.difficulty,
          problem.platform_url,
          problem.external_link,
          problem.hints,
          problem.examples,
          problem.approach,
          problem.solution_code,
          problem.display_order
        ]);
      }
      console.log(`Successfully seeded subtopic: ${subtopic.title}`);
    }

    console.log('Graph problems part 2 successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedGraphPart2();
