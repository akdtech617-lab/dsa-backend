const { v4: uuidv4 } = require('uuid');

// ── Curated High-Speed Duel Problems Pool ─────────────────────────────
// Each problem has clean starter 'boilerplates' (NO solution revealed)
// and working 'referenceSolutions' (preserved for bot play and post-match review).
const DUEL_PROBLEMS = [
  {
    "id": "two-sum",
    "title": "Two Sum Target Finder",
    "topic": "arrays",
    "topicLabel": "Arrays & Hashing",
    "difficulty": "Easy",
    "description": "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`.\n\nOutput the 0-based indices separated by a space (smaller index first). You may assume that each input would have exactly one solution.\n\n### Input Format\n- Line 1: Space-separated integers representing the array\n- Line 2: The integer target\n\n### Output Format\n- Two space-separated indices: `index1 index2`",
    "boilerplates": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int x;\n    vector<int> nums;\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        while (ss >> x) nums.push_back(x);\n    }\n    int target;\n    cin >> target;\n\n    // TODO: Write your algorithm here to find two numbers that sum to target\n    // Print the two 0-based indices separated by a space (smaller index first)\n    \n    return 0;\n}",
      "python": "import sys\n\nlines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]\nnums = list(map(int, lines[0].split()))\ntarget = int(lines[1])\n\n# TODO: Write your algorithm here to find two numbers that sum to target\n# Print the two 0-based indices separated by a space (smaller index first)\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line = sc.nextLine();\n        String[] parts = line.trim().split(\"\\\\s+\");\n        int[] nums = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);\n        int target = sc.nextInt();\n\n        // TODO: Write your algorithm here to find two numbers that sum to target\n        // Print the two 0-based indices separated by a space (smaller index first)\n        \n    }\n}"
    },
    "referenceSolutions": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int x;\n    vector<int> nums;\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        while (ss >> x) nums.push_back(x);\n    }\n    int target;\n    cin >> target;\n\n    // Write your solution here:\n    for (int i = 0; i < (int)nums.size(); i++) {\n        for (int j = i + 1; j < (int)nums.size(); j++) {\n            if (nums[i] + nums[j] == target) {\n                cout << i << \" \" << j << \"\\n\";\n                return 0;\n            }\n        }\n    }\n    return 0;\n}",
      "python": "import sys\n\nlines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]\nnums = list(map(int, lines[0].split()))\ntarget = int(lines[1])\n\n# Write your solution here:\nseen = {}\nfor i, num in enumerate(nums):\n    diff = target - num\n    if diff in seen:\n        print(f\"{seen[diff]} {i}\")\n        break\n    seen[num] = i\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line = sc.nextLine();\n        String[] parts = line.trim().split(\"\\\\s+\");\n        int[] nums = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);\n        int target = sc.nextInt();\n\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) {\n                System.out.println(map.get(comp) + \" \" + i);\n                return;\n            }\n            map.put(nums[i], i);\n        }\n    }\n}"
    },
    "testcases": [
      {
        "stdin": "2 7 11 15\n9",
        "expectedOutput": "0 1",
        "label": "Sample 1"
      },
      {
        "stdin": "3 2 4\n6",
        "expectedOutput": "1 2",
        "label": "Sample 2"
      },
      {
        "stdin": "3 3\n6",
        "expectedOutput": "0 1",
        "label": "Hidden 1"
      },
      {
        "stdin": "1 5 8 10 14 20\n24",
        "expectedOutput": "1 4",
        "label": "Hidden 2"
      }
    ]
  },
  {
    "id": "contains-duplicate",
    "title": "Contains Duplicate",
    "topic": "arrays",
    "topicLabel": "Arrays & Hashing",
    "difficulty": "Easy",
    "description": "Given an integer array `nums`, print `true` if any value appears at least twice in the array, and print `false` if every element is distinct.\n\n### Input Format\n- Space-separated integers on a single line\n\n### Output Format\n- `true` or `false`",
    "boilerplates": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int x;\n    vector<int> nums;\n    while (cin >> x) nums.push_back(x);\n\n    // TODO: Print \"true\" if any value appears at least twice, else \"false\"\n\n    return 0;\n}",
      "python": "import sys\n\nnums = list(map(int, sys.stdin.read().split()))\n\n# TODO: Print \"true\" if any value appears at least twice, else \"false\"\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<Integer> nums = new ArrayList<>();\n        while (sc.hasNextInt()) nums.add(sc.nextInt());\n\n        // TODO: Print \"true\" if any value appears at least twice, else \"false\"\n\n    }\n}"
    },
    "referenceSolutions": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int x;\n    vector<int> nums;\n    while (cin >> x) nums.push_back(x);\n\n    unordered_set<int> seen;\n    for (int n : nums) {\n        if (seen.count(n)) {\n            cout << \"true\\n\";\n            return 0;\n        }\n        seen.insert(n);\n    }\n    cout << \"false\\n\";\n    return 0;\n}",
      "python": "import sys\n\nnums = list(map(int, sys.stdin.read().split()))\nprint(\"true\" if len(nums) != len(set(nums)) else \"false\")\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Set<Integer> set = new HashSet<>();\n        while (sc.hasNextInt()) {\n            int num = sc.nextInt();\n            if (!set.add(num)) {\n                System.out.println(\"true\");\n                return;\n            }\n        }\n        System.out.println(\"false\");\n    }\n}"
    },
    "testcases": [
      {
        "stdin": "1 2 3 1",
        "expectedOutput": "true",
        "label": "Sample 1"
      },
      {
        "stdin": "1 2 3 4",
        "expectedOutput": "false",
        "label": "Sample 2"
      },
      {
        "stdin": "1 1 1 3 3 4 3 2 4 2",
        "expectedOutput": "true",
        "label": "Hidden 1"
      },
      {
        "stdin": "10 20 30 40 50",
        "expectedOutput": "false",
        "label": "Hidden 2"
      }
    ]
  },
  {
    "id": "max-subarray",
    "title": "Maximum Subarray Sum",
    "topic": "arrays",
    "topicLabel": "Arrays & Hashing",
    "difficulty": "Medium",
    "description": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum. (Kadane's Algorithm)\n\n### Input Format\n- Space-separated integers on a single line\n\n### Output Format\n- Single integer representing the maximum subarray sum",
    "boilerplates": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int x;\n    vector<int> nums;\n    while (cin >> x) nums.push_back(x);\n\n    // TODO: Find the contiguous subarray with the largest sum and print it\n\n    return 0;\n}",
      "python": "import sys\n\nnums = list(map(int, sys.stdin.read().split()))\n\n# TODO: Find the contiguous subarray with the largest sum and print it\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<Integer> nums = new ArrayList<>();\n        while (sc.hasNextInt()) nums.add(sc.nextInt());\n\n        // TODO: Find the contiguous subarray with the largest sum and print it\n\n    }\n}"
    },
    "referenceSolutions": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int x;\n    vector<int> nums;\n    while (cin >> x) nums.push_back(x);\n\n    // Write your Kadane's Algorithm here:\n    long long maxSum = nums[0];\n    long long current = nums[0];\n    for (size_t i = 1; i < nums.size(); i++) {\n        current = max((long long)nums[i], current + nums[i]);\n        maxSum = max(maxSum, current);\n    }\n    cout << maxSum << \"\\n\";\n    return 0;\n}",
      "python": "import sys\n\nnums = list(map(int, sys.stdin.read().split()))\nif not nums:\n    print(0)\n    sys.exit(0)\n\n# Write your solution here:\ncurrent = max_sum = nums[0]\nfor x in nums[1:]:\n    current = max(x, current + x)\n    max_sum = max(max_sum, current)\nprint(max_sum)\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<Integer> list = new ArrayList<>();\n        while (sc.hasNextInt()) list.add(sc.nextInt());\n\n        long current = list.get(0);\n        long max = list.get(0);\n        for (int i = 1; i < list.size(); i++) {\n            current = Math.max((long)list.get(i), current + list.get(i));\n            max = Math.max(max, current);\n        }\n        System.out.println(max);\n    }\n}"
    },
    "testcases": [
      {
        "stdin": "-2 1 -3 4 -1 2 1 -5 4",
        "expectedOutput": "6",
        "label": "Sample 1"
      },
      {
        "stdin": "1",
        "expectedOutput": "1",
        "label": "Sample 2"
      },
      {
        "stdin": "5 4 -1 7 8",
        "expectedOutput": "23",
        "label": "Hidden 1"
      },
      {
        "stdin": "-5 -2 -8 -1",
        "expectedOutput": "-1",
        "label": "Hidden 2 (All negative)"
      }
    ]
  },
  {
    "id": "trapping-rain-water",
    "title": "Trapping Rain Water",
    "topic": "arrays",
    "topicLabel": "Arrays & Hashing",
    "difficulty": "Hard",
    "description": "Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.\n\n### Input Format\n- Space-separated non-negative integers\n\n### Output Format\n- Single integer representing total trapped water units",
    "boilerplates": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int x;\n    vector<int> height;\n    while (cin >> x) height.push_back(x);\n\n    // TODO: Compute how much water the elevation map can trap after raining and print it\n\n    return 0;\n}",
      "python": "import sys\n\nheight = list(map(int, sys.stdin.read().split()))\n\n# TODO: Compute how much water the elevation map can trap after raining and print it\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<Integer> height = new ArrayList<>();\n        while (sc.hasNextInt()) height.add(sc.nextInt());\n\n        // TODO: Compute how much water the elevation map can trap after raining and print it\n\n    }\n}"
    },
    "referenceSolutions": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int x;\n    vector<int> h;\n    while (cin >> x) h.push_back(x);\n    if (h.size() < 3) { cout << 0 << \"\\n\"; return 0; }\n\n    int l = 0, r = h.size() - 1;\n    int maxL = h[l], maxR = h[r];\n    long long water = 0;\n    while (l < r) {\n        if (maxL <= maxR) {\n            l++;\n            maxL = max(maxL, h[l]);\n            water += maxL - h[l];\n        } else {\n            r--;\n            maxR = max(maxR, h[r]);\n            water += maxR - h[r];\n        }\n    }\n    cout << water << \"\\n\";\n    return 0;\n}",
      "python": "import sys\n\nh = list(map(int, sys.stdin.read().split()))\nif len(h) < 3:\n    print(0)\n    sys.exit(0)\n\nl, r = 0, len(h) - 1\nmax_l, max_r = h[l], h[r]\nwater = 0\nwhile l < r:\n    if max_l <= max_r:\n        l += 1\n        max_l = max(max_l, h[l])\n        water += max_l - h[l]\n    else:\n        r -= 1\n        max_r = max(max_r, h[r])\n        water += max_r - h[r]\nprint(water)\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<Integer> h = new ArrayList<>();\n        while (sc.hasNextInt()) h.add(sc.nextInt());\n        if (h.size() < 3) { System.out.println(0); return; }\n\n        int l = 0, r = h.size() - 1;\n        int maxL = h.get(l), maxR = h.get(r);\n        long water = 0;\n        while (l < r) {\n            if (maxL <= maxR) {\n                l++;\n                maxL = Math.max(maxL, h.get(l));\n                water += maxL - h.get(l);\n            } else {\n                r--;\n                maxR = Math.max(maxR, h.get(r));\n                water += maxR - h.get(r);\n            }\n        }\n        System.out.println(water);\n    }\n}"
    },
    "testcases": [
      {
        "stdin": "0 1 0 2 1 0 1 3 2 1 2 1",
        "expectedOutput": "6",
        "label": "Sample 1"
      },
      {
        "stdin": "4 2 0 3 2 5",
        "expectedOutput": "9",
        "label": "Sample 2"
      },
      {
        "stdin": "3 0 2 0 4",
        "expectedOutput": "7",
        "label": "Hidden 1"
      },
      {
        "stdin": "1 2 3 4 5",
        "expectedOutput": "0",
        "label": "Hidden 2"
      }
    ]
  },
  {
    "id": "valid-palindrome",
    "title": "Valid Palindrome Number",
    "topic": "strings",
    "topicLabel": "Strings",
    "difficulty": "Easy",
    "description": "Given an integer `x`, print `true` if `x` is a palindrome, and `false` otherwise. Negative numbers are not palindromes.\n\n### Input Format\n- Single integer `x`\n\n### Output Format\n- `true` or `false`",
    "boilerplates": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    if (cin >> s) {\n        // TODO: Print \"true\" if s reads the same backward as forward, else \"false\"\n        \n    }\n    return 0;\n}",
      "python": "import sys\n\ns = sys.stdin.read().strip()\n\n# TODO: Print \"true\" if s reads the same backward as forward, else \"false\"\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            String s = sc.next();\n            // TODO: Print \"true\" if s reads the same backward as forward, else \"false\"\n            \n        }\n    }\n}"
    },
    "referenceSolutions": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long x;\n    if (!(cin >> x)) return 0;\n    if (x < 0) {\n        cout << \"false\\n\";\n        return 0;\n    }\n    string s = to_string(x);\n    string r = s;\n    reverse(r.begin(), r.end());\n    cout << (s == r ? \"true\" : \"false\") << \"\\n\";\n    return 0;\n}",
      "python": "import sys\n\nval = sys.stdin.read().strip()\nif not val:\n    sys.exit(0)\nx = int(val)\nif x < 0:\n    print(\"false\")\nelse:\n    s = str(x)\n    print(\"true\" if s == s[::-1] else \"false\")\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) return;\n        long x = sc.nextLong();\n        if (x < 0) {\n            System.out.println(\"false\");\n            return;\n        }\n        String s = Long.toString(x);\n        String rev = new StringBuilder(s).reverse().toString();\n        System.out.println(s.equals(rev) ? \"true\" : \"false\");\n    }\n}"
    },
    "testcases": [
      {
        "stdin": "121",
        "expectedOutput": "true",
        "label": "Sample 1"
      },
      {
        "stdin": "-121",
        "expectedOutput": "false",
        "label": "Sample 2"
      },
      {
        "stdin": "10",
        "expectedOutput": "false",
        "label": "Sample 3"
      },
      {
        "stdin": "123454321",
        "expectedOutput": "true",
        "label": "Hidden 1"
      }
    ]
  },
  {
    "id": "valid-parentheses",
    "title": "Valid Parentheses",
    "topic": "strings",
    "topicLabel": "Strings",
    "difficulty": "Easy",
    "description": "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\nOpen brackets must be closed by the same type of brackets in the correct order.\n\n### Input Format\n- A single string on line 1\n\n### Output Format\n- `true` or `false`",
    "boilerplates": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    if (cin >> s) {\n        // TODO: Print \"true\" if the brackets '()[]{}' in s are valid and balanced, else \"false\"\n        \n    }\n    return 0;\n}",
      "python": "import sys\n\ns = sys.stdin.read().strip()\n\n# TODO: Print \"true\" if the brackets '()[]{}' in s are valid and balanced, else \"false\"\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            String s = sc.next();\n            // TODO: Print \"true\" if the brackets '()[]{}' in s are valid and balanced, else \"false\"\n            \n        }\n    }\n}"
    },
    "referenceSolutions": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    if (!(cin >> s)) { cout << \"true\\n\"; return 0; }\n    stack<char> st;\n    for (char c : s) {\n        if (c == '(' || c == '{' || c == '[') st.push(c);\n        else {\n            if (st.empty()) { cout << \"false\\n\"; return 0; }\n            char top = st.top();\n            st.pop();\n            if ((c == ')' && top != '(') || (c == '}' && top != '{') || (c == ']' && top != '[')) {\n                cout << \"false\\n\";\n                return 0;\n            }\n        }\n    }\n    cout << (st.empty() ? \"true\" : \"false\") << \"\\n\";\n    return 0;\n}",
      "python": "import sys\n\ns = sys.stdin.read().strip()\nst = []\nmapping = {')': '(', '}': '{', ']': '['}\nvalid = True\nfor c in s:\n    if c in mapping.values():\n        st.append(c)\n    elif c in mapping:\n        if not st or st.pop() != mapping[c]:\n            valid = False\n            break\nprint(\"true\" if valid and not st else \"false\")\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) { System.out.println(\"true\"); return; }\n        String s = sc.next();\n        Deque<Character> st = new ArrayDeque<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(' || c == '{' || c == '[') st.push(c);\n            else {\n                if (st.isEmpty()) { System.out.println(\"false\"); return; }\n                char top = st.pop();\n                if ((c == ')' && top != '(') || (c == '}' && top != '{') || (c == ']' && top != '[')) {\n                    System.out.println(\"false\");\n                    return;\n                }\n            }\n        }\n        System.out.println(st.isEmpty() ? \"true\" : \"false\");\n    }\n}"
    },
    "testcases": [
      {
        "stdin": "()[]{}",
        "expectedOutput": "true",
        "label": "Sample 1"
      },
      {
        "stdin": "(]",
        "expectedOutput": "false",
        "label": "Sample 2"
      },
      {
        "stdin": "([)]",
        "expectedOutput": "false",
        "label": "Sample 3"
      },
      {
        "stdin": "{[()]}",
        "expectedOutput": "true",
        "label": "Hidden 1"
      }
    ]
  },
  {
    "id": "reverse-words",
    "title": "Reverse Words in a String",
    "topic": "strings",
    "topicLabel": "Strings",
    "difficulty": "Medium",
    "description": "Given an input string of words separated by spaces, reverse the order of the words. Return a string of the words in reverse order concatenated by a single space.\n\n### Input Format\n- A single line of text with multiple words\n\n### Output Format\n- Words printed in reverse order separated by a single space",
    "boilerplates": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        // TODO: Reverse the order of words in the string and print them separated by single spaces\n        \n    }\n    return 0;\n}",
      "python": "import sys\n\nline = sys.stdin.read().strip()\n\n# TODO: Reverse the order of words in the string and print them separated by single spaces\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextLine()) {\n            String line = sc.nextLine();\n            // TODO: Reverse the order of words in the string and print them separated by single spaces\n            \n        }\n    }\n}"
    },
    "referenceSolutions": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string line;\n    if (!getline(cin, line)) return 0;\n    stringstream ss(line);\n    string word;\n    vector<string> words;\n    while (ss >> word) words.push_back(word);\n    reverse(words.begin(), words.end());\n    for (size_t i = 0; i < words.size(); i++) {\n        cout << words[i] << (i + 1 == words.size() ? \"\" : \" \");\n    }\n    cout << \"\\n\";\n    return 0;\n}",
      "python": "import sys\n\nline = sys.stdin.read().strip()\nwords = line.split()\nprint(\" \".join(reversed(words)))\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLine()) return;\n        String line = sc.nextLine().trim();\n        String[] words = line.split(\"\\\\s+\");\n        List<String> list = Arrays.asList(words);\n        Collections.reverse(list);\n        System.out.println(String.join(\" \", list));\n    }\n}"
    },
    "testcases": [
      {
        "stdin": "the sky is blue",
        "expectedOutput": "blue is sky the",
        "label": "Sample 1"
      },
      {
        "stdin": "  hello world  ",
        "expectedOutput": "world hello",
        "label": "Sample 2"
      },
      {
        "stdin": "a good   example",
        "expectedOutput": "example good a",
        "label": "Hidden 1"
      },
      {
        "stdin": "DSAverse arena battle",
        "expectedOutput": "battle arena DSAverse",
        "label": "Hidden 2"
      }
    ]
  },
  {
    "id": "binary-search",
    "title": "Binary Search Target",
    "topic": "binary-search",
    "topicLabel": "Binary Search",
    "difficulty": "Easy",
    "description": "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, return its 0-based index. Otherwise, return `-1`.\n\n### Input Format\n- Line 1: Space-separated sorted integers\n- Line 2: The integer target\n\n### Output Format\n- Single integer representing index or `-1`",
    "boilerplates": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int x;\n    vector<int> nums;\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        while (ss >> x) nums.push_back(x);\n    }\n    int target;\n    cin >> target;\n\n    // TODO: Search target in sorted array nums in O(log n). Print 0-based index or -1\n    \n    return 0;\n}",
      "python": "import sys\n\nlines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]\nnums = list(map(int, lines[0].split()))\ntarget = int(lines[1])\n\n# TODO: Search target in sorted array nums in O(log n). Print 0-based index or -1\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line = sc.nextLine();\n        String[] parts = line.trim().split(\"\\\\s+\");\n        int[] nums = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);\n        int target = sc.nextInt();\n\n        // TODO: Search target in sorted array nums in O(log n). Print 0-based index or -1\n\n    }\n}"
    },
    "referenceSolutions": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int x;\n    vector<int> nums;\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        while (ss >> x) nums.push_back(x);\n    }\n    int target;\n    cin >> target;\n\n    int l = 0, r = nums.size() - 1;\n    int ans = -1;\n    while (l <= r) {\n        int mid = l + (r - l) / 2;\n        if (nums[mid] == target) { ans = mid; break; }\n        else if (nums[mid] < target) l = mid + 1;\n        else r = mid - 1;\n    }\n    cout << ans << \"\\n\";\n    return 0;\n}",
      "python": "import sys\n\nlines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]\nnums = list(map(int, lines[0].split()))\ntarget = int(lines[1])\n\nl, r = 0, len(nums) - 1\nans = -1\nwhile l <= r:\n    mid = (l + r) // 2\n    if nums[mid] == target:\n        ans = mid\n        break\n    elif nums[mid] < target:\n        l = mid + 1\n    else:\n        r = mid - 1\nprint(ans)\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line = sc.nextLine();\n        String[] parts = line.trim().split(\"\\\\s+\");\n        int[] nums = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);\n        int target = sc.nextInt();\n\n        int l = 0, r = nums.length - 1;\n        int ans = -1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) { ans = mid; break; }\n            else if (nums[mid] < target) l = mid + 1;\n            else r = mid - 1;\n        }\n        System.out.println(ans);\n    }\n}"
    },
    "testcases": [
      {
        "stdin": "-1 0 3 5 9 12\n9",
        "expectedOutput": "4",
        "label": "Sample 1"
      },
      {
        "stdin": "-1 0 3 5 9 12\n2",
        "expectedOutput": "-1",
        "label": "Sample 2"
      },
      {
        "stdin": "5\n5",
        "expectedOutput": "0",
        "label": "Hidden 1"
      },
      {
        "stdin": "2 4 6 8 10 12 14 16\n14",
        "expectedOutput": "6",
        "label": "Hidden 2"
      }
    ]
  },
  {
    "id": "search-rotated-array",
    "title": "Search in Rotated Sorted Array",
    "topic": "binary-search",
    "topicLabel": "Binary Search",
    "difficulty": "Medium",
    "description": "There is an integer array `nums` sorted in ascending order (with distinct values) that has been rotated at an unknown pivot index.\nGiven the rotated array `nums` and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\n### Input Format\n- Line 1: Space-separated integers representing the rotated array\n- Line 2: The integer target\n\n### Output Format\n- Single integer representing 0-based index or `-1`",
    "boilerplates": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int x;\n    vector<int> nums;\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        while (ss >> x) nums.push_back(x);\n    }\n    int target;\n    cin >> target;\n\n    // TODO: Search target in rotated sorted array in O(log n). Print index or -1\n    \n    return 0;\n}",
      "python": "import sys\n\nlines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]\nnums = list(map(int, lines[0].split()))\ntarget = int(lines[1])\n\n# TODO: Search target in rotated sorted array in O(log n). Print index or -1\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line = sc.nextLine();\n        String[] parts = line.trim().split(\"\\\\s+\");\n        int[] nums = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);\n        int target = sc.nextInt();\n\n        // TODO: Search target in rotated sorted array in O(log n). Print index or -1\n\n    }\n}"
    },
    "referenceSolutions": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int x;\n    vector<int> nums;\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        while (ss >> x) nums.push_back(x);\n    }\n    int target;\n    cin >> target;\n\n    int l = 0, r = nums.size() - 1;\n    while (l <= r) {\n        int mid = l + (r - l) / 2;\n        if (nums[mid] == target) {\n            cout << mid << \"\\n\";\n            return 0;\n        }\n        if (nums[l] <= nums[mid]) {\n            if (nums[l] <= target && target < nums[mid]) r = mid - 1;\n            else l = mid + 1;\n        } else {\n            if (nums[mid] < target && target <= nums[r]) l = mid + 1;\n            else r = mid - 1;\n        }\n    }\n    cout << -1 << \"\\n\";\n    return 0;\n}",
      "python": "import sys\n\nlines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]\nnums = list(map(int, lines[0].split()))\ntarget = int(lines[1])\n\nl, r = 0, len(nums) - 1\nans = -1\nwhile l <= r:\n    mid = (l + r) // 2\n    if nums[mid] == target:\n        ans = mid\n        break\n    if nums[l] <= nums[mid]:\n        if nums[l] <= target < nums[mid]:\n            r = mid - 1\n        else:\n            l = mid + 1\n    else:\n        if nums[mid] < target <= nums[r]:\n            l = mid + 1\n        else:\n            r = mid - 1\nprint(ans)\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line = sc.nextLine();\n        String[] parts = line.trim().split(\"\\\\s+\");\n        int[] nums = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);\n        int target = sc.nextInt();\n\n        int l = 0, r = nums.length - 1;\n        int ans = -1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) { ans = mid; break; }\n            if (nums[l] <= nums[mid]) {\n                if (nums[l] <= target && target < nums[mid]) r = mid - 1;\n                else l = mid + 1;\n            } else {\n                if (nums[mid] < target && target <= nums[r]) l = mid + 1;\n                else r = mid - 1;\n            }\n        }\n        System.out.println(ans);\n    }\n}"
    },
    "testcases": [
      {
        "stdin": "4 5 6 7 0 1 2\n0",
        "expectedOutput": "4",
        "label": "Sample 1"
      },
      {
        "stdin": "4 5 6 7 0 1 2\n3",
        "expectedOutput": "-1",
        "label": "Sample 2"
      },
      {
        "stdin": "1\n0",
        "expectedOutput": "-1",
        "label": "Sample 3"
      },
      {
        "stdin": "6 7 8 1 2 3 4 5\n8",
        "expectedOutput": "2",
        "label": "Hidden 1"
      }
    ]
  },
  {
    "id": "climbing-stairs",
    "title": "Climbing Stairs",
    "topic": "dp",
    "topicLabel": "Dynamic Programming",
    "difficulty": "Easy",
    "description": "You are climbing a staircase. It takes `n` steps to reach the top.\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?\n\n### Input Format\n- Single integer `n`\n\n### Output Format\n- Single integer representing total distinct ways",
    "boilerplates": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        // TODO: Compute distinct ways to climb n stairs taking 1 or 2 steps\n        // Print the result\n        \n    }\n    return 0;\n}",
      "python": "import sys\n\nn = int(sys.stdin.read().strip())\n\n# TODO: Compute distinct ways to climb n stairs taking 1 or 2 steps\n# Print the result\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int n = sc.nextInt();\n            // TODO: Compute distinct ways to climb n stairs taking 1 or 2 steps\n            // Print the result\n            \n        }\n    }\n}"
    },
    "referenceSolutions": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    if (n <= 2) { cout << n << \"\\n\"; return 0; }\n    long long a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        long long c = a + b;\n        a = b;\n        b = c;\n    }\n    cout << b << \"\\n\";\n    return 0;\n}",
      "python": "import sys\n\nn = int(sys.stdin.read().strip())\nif n <= 2:\n    print(n)\nelse:\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    print(b)\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        if (n <= 2) { System.out.println(n); return; }\n        long a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            long c = a + b;\n            a = b;\n            b = c;\n        }\n        System.out.println(b);\n    }\n}"
    },
    "testcases": [
      {
        "stdin": "2",
        "expectedOutput": "2",
        "label": "Sample 1"
      },
      {
        "stdin": "3",
        "expectedOutput": "3",
        "label": "Sample 2"
      },
      {
        "stdin": "5",
        "expectedOutput": "8",
        "label": "Hidden 1"
      },
      {
        "stdin": "10",
        "expectedOutput": "89",
        "label": "Hidden 2"
      }
    ]
  },
  {
    "id": "coin-change",
    "title": "Minimum Coin Change",
    "topic": "dp",
    "topicLabel": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\n### Input Format\n- Line 1: Space-separated coin denominations\n- Line 2: Target amount\n\n### Output Format\n- Fewest coins needed or `-1`",
    "boilerplates": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int x;\n    vector<int> coins;\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        while (ss >> x) coins.push_back(x);\n    }\n    int amount;\n    cin >> amount;\n\n    // TODO: Print the fewest coins needed to make up amount, or -1 if impossible\n    \n    return 0;\n}",
      "python": "import sys\n\nlines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]\ncoins = list(map(int, lines[0].split()))\namount = int(lines[1])\n\n# TODO: Print the fewest coins needed to make up amount, or -1 if impossible\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line = sc.nextLine();\n        String[] parts = line.trim().split(\"\\\\s+\");\n        int[] coins = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) coins[i] = Integer.parseInt(parts[i]);\n        int amount = sc.nextInt();\n\n        // TODO: Print the fewest coins needed to make up amount, or -1 if impossible\n\n    }\n}"
    },
    "referenceSolutions": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int x;\n    vector<int> coins;\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        while (ss >> x) coins.push_back(x);\n    }\n    int amount;\n    cin >> amount;\n\n    vector<int> dp(amount + 1, 1e9);\n    dp[0] = 0;\n    for (int i = 1; i <= amount; i++) {\n        for (int c : coins) {\n            if (i >= c && dp[i - c] != 1e9) {\n                dp[i] = min(dp[i], dp[i - c] + 1);\n            }\n        }\n    }\n    cout << (dp[amount] == 1e9 ? -1 : dp[amount]) << \"\\n\";\n    return 0;\n}",
      "python": "import sys\n\nlines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]\ncoins = list(map(int, lines[0].split()))\namount = int(lines[1])\n\ndp = [float('inf')] * (amount + 1)\ndp[0] = 0\nfor i in range(1, amount + 1):\n    for c in coins:\n        if i >= c:\n            dp[i] = min(dp[i], dp[i - c] + 1)\nprint(-1 if dp[amount] == float('inf') else dp[amount])\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line = sc.nextLine();\n        String[] parts = line.trim().split(\"\\\\s+\");\n        int[] coins = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) coins[i] = Integer.parseInt(parts[i]);\n        int amount = sc.nextInt();\n\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, 1000000000);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; i++) {\n            for (int c : coins) {\n                if (i >= c && dp[i - c] != 1000000000) {\n                    dp[i] = Math.min(dp[i], dp[i - c] + 1);\n                }\n            }\n        }\n        System.out.println(dp[amount] == 1000000000 ? -1 : dp[amount]);\n    }\n}"
    },
    "testcases": [
      {
        "stdin": "1 2 5\n11",
        "expectedOutput": "3",
        "label": "Sample 1"
      },
      {
        "stdin": "2\n3",
        "expectedOutput": "-1",
        "label": "Sample 2"
      },
      {
        "stdin": "1\n0",
        "expectedOutput": "0",
        "label": "Sample 3"
      },
      {
        "stdin": "1 5 10 25\n30",
        "expectedOutput": "2",
        "label": "Hidden 1"
      }
    ]
  },
  {
    "id": "longest-increasing-subsequence",
    "title": "Longest Increasing Subsequence",
    "topic": "dp",
    "topicLabel": "Dynamic Programming",
    "difficulty": "Hard",
    "description": "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.\n\n### Input Format\n- Space-separated integers on a single line\n\n### Output Format\n- Single integer representing length of the LIS",
    "boilerplates": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int x;\n    vector<int> nums;\n    while (cin >> x) nums.push_back(x);\n\n    // TODO: Find length of the longest strictly increasing subsequence and print it\n    \n    return 0;\n}",
      "python": "import sys\n\nnums = list(map(int, sys.stdin.read().split()))\n\n# TODO: Find length of the longest strictly increasing subsequence and print it\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<Integer> nums = new ArrayList<>();\n        while (sc.hasNextInt()) nums.add(sc.nextInt());\n\n        // TODO: Find length of the longest strictly increasing subsequence and print it\n\n    }\n}"
    },
    "referenceSolutions": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int x;\n    vector<int> nums;\n    while (cin >> x) nums.push_back(x);\n    if (nums.empty()) { cout << 0 << \"\\n\"; return 0; }\n\n    vector<int> tails;\n    for (int n : nums) {\n        auto it = lower_bound(tails.begin(), tails.end(), n);\n        if (it == tails.end()) tails.push_back(n);\n        else *it = n;\n    }\n    cout << tails.size() << \"\\n\";\n    return 0;\n}",
      "python": "import sys\nimport bisect\n\nnums = list(map(int, sys.stdin.read().split()))\nif not nums:\n    print(0)\n    sys.exit(0)\n\ntails = []\nfor n in nums:\n    idx = bisect.bisect_left(tails, n)\n    if idx == len(tails):\n        tails.append(n)\n    else:\n        tails[idx] = n\n\nprint(len(tails))\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<Integer> nums = new ArrayList<>();\n        while (sc.hasNextInt()) nums.add(sc.nextInt());\n        if (nums.isEmpty()) { System.out.println(0); return; }\n\n        List<Integer> tails = new ArrayList<>();\n        for (int n : nums) {\n            int idx = Collections.binarySearch(tails, n);\n            if (idx < 0) idx = -(idx + 1);\n            if (idx == tails.size()) tails.add(n);\n            else tails.set(idx, n);\n        }\n        System.out.println(tails.size());\n    }\n}"
    },
    "testcases": [
      {
        "stdin": "10 9 2 5 3 7 101 18",
        "expectedOutput": "4",
        "label": "Sample 1"
      },
      {
        "stdin": "0 1 0 3 2 3",
        "expectedOutput": "4",
        "label": "Sample 2"
      },
      {
        "stdin": "7 7 7 7 7 7 7",
        "expectedOutput": "1",
        "label": "Sample 3"
      },
      {
        "stdin": "1 3 6 7 9 4 10 5 6",
        "expectedOutput": "6",
        "label": "Hidden 1"
      }
    ]
  },
  {
    "id": "invert-tree-level",
    "title": "Invert Tree Level Order",
    "topic": "trees",
    "topicLabel": "Trees & Traversal",
    "difficulty": "Medium",
    "description": "Given a binary tree represented as level-order space-separated integers where `-1` represents null, invert the tree (mirror left and right subtrees) and print the inverted tree in level-order.\n\n### Input Format\n- Space-separated integers representing the binary tree level-order\n\n### Output Format\n- Space-separated integers representing inverted level-order",
    "boilerplates": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nstruct Node {\n    int val;\n    Node* left;\n    Node* right;\n    Node(int v) : val(v), left(nullptr), right(nullptr) {}\n};\n\nNode* buildTree(const vector<int>& nums) {\n    if (nums.empty() || nums[0] == -1) return nullptr;\n    Node* root = new Node(nums[0]);\n    queue<Node*> q;\n    q.push(root);\n    size_t i = 1;\n    while (!q.empty() && i < nums.size()) {\n        Node* curr = q.front();\n        q.pop();\n        if (i < nums.size() && nums[i] != -1) {\n            curr->left = new Node(nums[i]);\n            q.push(curr->left);\n        }\n        i++;\n        if (i < nums.size() && nums[i] != -1) {\n            curr->right = new Node(nums[i]);\n            q.push(curr->right);\n        }\n        i++;\n    }\n    return root;\n}\n\n// TODO: Invert the binary tree rooted at root\nvoid invertTree(Node* root) {\n    // Write your inversion logic here\n}\n\nint main() {\n    int x;\n    vector<int> nums;\n    while (cin >> x) nums.push_back(x);\n    if (nums.empty() || nums[0] == -1) return 0;\n    Node* root = buildTree(nums);\n    invertTree(root);\n\n    // Print inverted level order\n    vector<int> out;\n    queue<Node*> q;\n    q.push(root);\n    while (!q.empty()) {\n        Node* curr = q.front();\n        q.pop();\n        if (curr) {\n            out.push_back(curr->val);\n            q.push(curr->left);\n            q.push(curr->right);\n        } else {\n            out.push_back(-1);\n        }\n    }\n    while (!out.empty() && out.back() == -1) out.pop_back();\n    for (size_t k = 0; k < out.size(); k++) {\n        cout << out[k] << (k + 1 == out.size() ? \"\" : \" \");\n    }\n    cout << \"\\n\";\n    return 0;\n}",
      "python": "import sys\n\nnums = list(map(int, sys.stdin.read().split()))\nif not nums or nums[0] == -1:\n    sys.exit(0)\n\nclass Node:\n    def __init__(self, val):\n        self.val = val\n        self.left = None\n        self.right = None\n\nroot = Node(nums[0])\nq = [root]\ni = 1\nwhile q and i < len(nums):\n    curr = q.pop(0)\n    if i < len(nums) and nums[i] != -1:\n        curr.left = Node(nums[i])\n        q.append(curr.left)\n    i += 1\n    if i < len(nums) and nums[i] != -1:\n        curr.right = Node(nums[i])\n        q.append(curr.right)\n    i += 1\n\n# TODO: Invert the binary tree rooted at node\ndef invert_tree(node):\n    # Write your inversion logic here\n    pass\n\ninvert_tree(root)\n\nout = []\nq = [root]\nwhile q:\n    curr = q.pop(0)\n    if curr:\n        out.append(curr.val)\n        q.append(curr.left)\n        q.append(curr.right)\n    else:\n        out.append(-1)\n\nwhile out and out[-1] == -1:\n    out.pop()\n\nprint(\" \".join(map(str, out)))\n",
      "java": "import java.util.*;\n\npublic class Main {\n    static class Node {\n        int val;\n        Node left, right;\n        Node(int v) { val = v; }\n    }\n\n    // TODO: Invert the binary tree rooted at node\n    static void invertTree(Node root) {\n        // Write your inversion logic here\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<Integer> nums = new ArrayList<>();\n        while (sc.hasNextInt()) nums.add(sc.nextInt());\n        if (nums.isEmpty() || nums.get(0) == -1) return;\n\n        Node root = new Node(nums.get(0));\n        Queue<Node> q = new LinkedList<>();\n        q.add(root);\n        int i = 1;\n        while (!q.isEmpty() && i < nums.size()) {\n            Node curr = q.poll();\n            if (i < nums.size() && nums.get(i) != -1) {\n                curr.left = new Node(nums.get(i));\n                q.add(curr.left);\n            }\n            i++;\n            if (i < nums.size() && nums.get(i) != -1) {\n                curr.right = new Node(nums.get(i));\n                q.add(curr.right);\n            }\n            i++;\n        }\n\n        invertTree(root);\n\n        List<Integer> out = new ArrayList<>();\n        q.add(root);\n        while (!q.isEmpty()) {\n            Node curr = q.poll();\n            if (curr != null) {\n                out.add(curr.val);\n                q.add(curr.left);\n                q.add(curr.right);\n            } else {\n                out.add(-1);\n            }\n        }\n        while (!out.isEmpty() && out.get(out.size() - 1) == -1) {\n            out.remove(out.size() - 1);\n        }\n        for (int k = 0; k < out.size(); k++) {\n            System.out.print(out.get(k) + (k + 1 == out.size() ? \"\" : \" \"));\n        }\n        System.out.println();\n    }\n}"
    },
    "referenceSolutions": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nstruct Node {\n    int val;\n    Node* left;\n    Node* right;\n    Node(int v) : val(v), left(nullptr), right(nullptr) {}\n};\n\nNode* buildTree(const vector<int>& nums) {\n    if (nums.empty() || nums[0] == -1) return nullptr;\n    Node* root = new Node(nums[0]);\n    queue<Node*> q;\n    q.push(root);\n    size_t i = 1;\n    while (!q.empty() && i < nums.size()) {\n        Node* curr = q.front();\n        q.pop();\n        if (i < nums.size() && nums[i] != -1) {\n            curr->left = new Node(nums[i]);\n            q.push(curr->left);\n        }\n        i++;\n        if (i < nums.size() && nums[i] != -1) {\n            curr->right = new Node(nums[i]);\n            q.push(curr->right);\n        }\n        i++;\n    }\n    return root;\n}\n\nvoid invertTree(Node* root) {\n    if (!root) return;\n    swap(root->left, root->right);\n    invertTree(root->left);\n    invertTree(root->right);\n}\n\nint main() {\n    int x;\n    vector<int> nums;\n    while (cin >> x) nums.push_back(x);\n    Node* root = buildTree(nums);\n    invertTree(root);\n\n    if (!root) return 0;\n    queue<Node*> q;\n    q.push(root);\n    vector<int> out;\n    while (!q.empty()) {\n        Node* curr = q.front();\n        q.pop();\n        if (curr) {\n            out.push_back(curr->val);\n            q.push(curr->left);\n            q.push(curr->right);\n        } else {\n            out.push_back(-1);\n        }\n    }\n    while (!out.empty() && out.back() == -1) out.pop_back();\n    for (size_t k = 0; k < out.size(); k++) {\n        cout << out[k] << (k + 1 == out.size() ? \"\" : \" \");\n    }\n    cout << \"\\n\";\n    return 0;\n}",
      "python": "import sys\n\nnums = list(map(int, sys.stdin.read().split()))\nif not nums or nums[0] == -1:\n    sys.exit(0)\n\nclass Node:\n    def __init__(self, val):\n        self.val = val\n        self.left = None\n        self.right = None\n\nroot = Node(nums[0])\nq = [root]\ni = 1\nwhile q and i < len(nums):\n    curr = q.pop(0)\n    if i < len(nums) and nums[i] != -1:\n        curr.left = Node(nums[i])\n        q.append(curr.left)\n    i += 1\n    if i < len(nums) and nums[i] != -1:\n        curr.right = Node(nums[i])\n        q.append(curr.right)\n    i += 1\n\ndef invert(node):\n    if not node: return\n    node.left, node.right = node.right, node.left\n    invert(node.left)\n    invert(node.right)\n\ninvert(root)\n\nout = []\nq = [root]\nwhile q:\n    curr = q.pop(0)\n    if curr:\n        out.append(curr.val)\n        q.append(curr.left)\n        q.append(curr.right)\n    else:\n        out.append(-1)\n\nwhile out and out[-1] == -1:\n    out.pop()\n\nprint(\" \".join(map(str, out)))\n",
      "java": "import java.util.*;\n\npublic class Main {\n    static class Node {\n        int val;\n        Node left, right;\n        Node(int v) { val = v; }\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<Integer> nums = new ArrayList<>();\n        while (sc.hasNextInt()) nums.add(sc.nextInt());\n        if (nums.isEmpty() || nums.get(0) == -1) return;\n\n        Node root = new Node(nums.get(0));\n        Queue<Node> q = new LinkedList<>();\n        q.add(root);\n        int i = 1;\n        while (!q.isEmpty() && i < nums.size()) {\n            Node curr = q.poll();\n            if (i < nums.size() && nums.get(i) != -1) {\n                curr.left = new Node(nums.get(i));\n                q.add(curr.left);\n            }\n            i++;\n            if (i < nums.size() && nums.get(i) != -1) {\n                curr.right = new Node(nums.get(i));\n                q.add(curr.right);\n            }\n            i++;\n        }\n\n        invert(root);\n\n        List<Integer> out = new ArrayList<>();\n        q.add(root);\n        while (!q.isEmpty()) {\n            Node curr = q.poll();\n            if (curr != null) {\n                out.add(curr.val);\n                q.add(curr.left);\n                q.add(curr.right);\n            } else {\n                out.add(-1);\n            }\n        }\n        while (!out.isEmpty() && out.get(out.size() - 1) == -1) {\n            out.remove(out.size() - 1);\n        }\n        for (int k = 0; k < out.size(); k++) {\n            System.out.print(out.get(k) + (k + 1 == out.size() ? \"\" : \" \"));\n        }\n        System.out.println();\n    }\n\n    static void invert(Node n) {\n        if (n == null) return;\n        Node tmp = n.left;\n        n.left = n.right;\n        n.right = tmp;\n        invert(n.left);\n        invert(n.right);\n    }\n}"
    },
    "testcases": [
      {
        "stdin": "4 2 7 1 3 6 9",
        "expectedOutput": "4 7 2 9 6 3 1",
        "label": "Sample 1"
      },
      {
        "stdin": "2 1 3",
        "expectedOutput": "2 3 1",
        "label": "Sample 2"
      },
      {
        "stdin": "1",
        "expectedOutput": "1",
        "label": "Hidden 1"
      }
    ]
  },
  {
    "id": "max-depth-tree",
    "title": "Maximum Depth of Binary Tree",
    "topic": "trees",
    "topicLabel": "Trees & Traversal",
    "difficulty": "Easy",
    "description": "Given a binary tree represented as level-order space-separated integers where `-1` represents null, return its maximum depth.\nA binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.\n\n### Input Format\n- Space-separated integers representing the binary tree level-order\n\n### Output Format\n- Single integer representing the max depth",
    "boilerplates": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nstruct Node {\n    int val;\n    Node* left;\n    Node* right;\n    Node(int v) : val(v), left(nullptr), right(nullptr) {}\n};\n\nNode* buildTree(const vector<int>& nums) {\n    if (nums.empty() || nums[0] == -1) return nullptr;\n    Node* root = new Node(nums[0]);\n    queue<Node*> q;\n    q.push(root);\n    size_t i = 1;\n    while (!q.empty() && i < nums.size()) {\n        Node* curr = q.front();\n        q.pop();\n        if (i < nums.size() && nums[i] != -1) {\n            curr->left = new Node(nums[i]);\n            q.push(curr->left);\n        }\n        i++;\n        if (i < nums.size() && nums[i] != -1) {\n            curr->right = new Node(nums[i]);\n            q.push(curr->right);\n        }\n        i++;\n    }\n    return root;\n}\n\n// TODO: Return the maximum depth of the binary tree\nint maxDepth(Node* root) {\n    return 0;\n}\n\nint main() {\n    int x;\n    vector<int> nums;\n    while (cin >> x) nums.push_back(x);\n    Node* root = buildTree(nums);\n    cout << maxDepth(root) << \"\\n\";\n    return 0;\n}",
      "python": "import sys\n\nnums = list(map(int, sys.stdin.read().split()))\nif not nums or nums[0] == -1:\n    print(0)\n    sys.exit(0)\n\nclass Node:\n    def __init__(self, val):\n        self.val = val\n        self.left = None\n        self.right = None\n\nroot = Node(nums[0])\nq = [root]\ni = 1\nwhile q and i < len(nums):\n    curr = q.pop(0)\n    if i < len(nums) and nums[i] != -1:\n        curr.left = Node(nums[i])\n        q.append(curr.left)\n    i += 1\n    if i < len(nums) and nums[i] != -1:\n        curr.right = Node(nums[i])\n        q.append(curr.right)\n    i += 1\n\n# TODO: Return the maximum depth of the binary tree\ndef max_depth(node):\n    return 0\n\nprint(max_depth(root))\n",
      "java": "import java.util.*;\n\npublic class Main {\n    static class Node {\n        int val;\n        Node left, right;\n        Node(int v) { val = v; }\n    }\n\n    // TODO: Return the maximum depth of the binary tree\n    static int maxDepth(Node root) {\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<Integer> nums = new ArrayList<>();\n        while (sc.hasNextInt()) nums.add(sc.nextInt());\n        if (nums.isEmpty() || nums.get(0) == -1) {\n            System.out.println(0);\n            return;\n        }\n\n        Node root = new Node(nums.get(0));\n        Queue<Node> q = new LinkedList<>();\n        q.add(root);\n        int i = 1;\n        while (!q.isEmpty() && i < nums.size()) {\n            Node curr = q.poll();\n            if (i < nums.size() && nums.get(i) != -1) {\n                curr.left = new Node(nums.get(i));\n                q.add(curr.left);\n            }\n            i++;\n            if (i < nums.size() && nums.get(i) != -1) {\n                curr.right = new Node(nums.get(i));\n                q.add(curr.right);\n            }\n            i++;\n        }\n\n        System.out.println(maxDepth(root));\n    }\n}"
    },
    "referenceSolutions": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nstruct Node {\n    int val;\n    Node* left;\n    Node* right;\n    Node(int v) : val(v), left(nullptr), right(nullptr) {}\n};\n\nNode* buildTree(const vector<int>& nums) {\n    if (nums.empty() || nums[0] == -1) return nullptr;\n    Node* root = new Node(nums[0]);\n    queue<Node*> q;\n    q.push(root);\n    size_t i = 1;\n    while (!q.empty() && i < nums.size()) {\n        Node* curr = q.front();\n        q.pop();\n        if (i < nums.size() && nums[i] != -1) {\n            curr->left = new Node(nums[i]);\n            q.push(curr->left);\n        }\n        i++;\n        if (i < nums.size() && nums[i] != -1) {\n            curr->right = new Node(nums[i]);\n            q.push(curr->right);\n        }\n        i++;\n    }\n    return root;\n}\n\nint maxDepth(Node* root) {\n    if (!root) return 0;\n    return 1 + max(maxDepth(root->left), maxDepth(root->right));\n}\n\nint main() {\n    int x;\n    vector<int> nums;\n    while (cin >> x) nums.push_back(x);\n    Node* root = buildTree(nums);\n    cout << maxDepth(root) << \"\\n\";\n    return 0;\n}",
      "python": "import sys\n\nnums = list(map(int, sys.stdin.read().split()))\nif not nums or nums[0] == -1:\n    print(0)\n    sys.exit(0)\n\nclass Node:\n    def __init__(self, val):\n        self.val = val\n        self.left = None\n        self.right = None\n\nroot = Node(nums[0])\nq = [root]\ni = 1\nwhile q and i < len(nums):\n    curr = q.pop(0)\n    if i < len(nums) and nums[i] != -1:\n        curr.left = Node(nums[i])\n        q.append(curr.left)\n    i += 1\n    if i < len(nums) and nums[i] != -1:\n        curr.right = Node(nums[i])\n        q.append(curr.right)\n    i += 1\n\ndef max_depth(node):\n    if not node:\n        return 0\n    return 1 + max(max_depth(node.left), max_depth(node.right))\n\nprint(max_depth(root))\n",
      "java": "import java.util.*;\n\npublic class Main {\n    static class Node {\n        int val;\n        Node left, right;\n        Node(int v) { val = v; }\n    }\n\n    static int maxDepth(Node root) {\n        if (root == null) return 0;\n        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<Integer> nums = new ArrayList<>();\n        while (sc.hasNextInt()) nums.add(sc.nextInt());\n        if (nums.isEmpty() || nums.get(0) == -1) {\n            System.out.println(0);\n            return;\n        }\n\n        Node root = new Node(nums.get(0));\n        Queue<Node> q = new LinkedList<>();\n        q.add(root);\n        int i = 1;\n        while (!q.isEmpty() && i < nums.size()) {\n            Node curr = q.poll();\n            if (i < nums.size() && nums.get(i) != -1) {\n                curr.left = new Node(nums.get(i));\n                q.add(curr.left);\n            }\n            i++;\n            if (i < nums.size() && nums.get(i) != -1) {\n                curr.right = new Node(nums.get(i));\n                q.add(curr.right);\n            }\n            i++;\n        }\n\n        System.out.println(maxDepth(root));\n    }\n}"
    },
    "testcases": [
      {
        "stdin": "3 9 20 -1 -1 15 7",
        "expectedOutput": "3",
        "label": "Sample 1"
      },
      {
        "stdin": "1 -1 2",
        "expectedOutput": "2",
        "label": "Sample 2"
      },
      {
        "stdin": "1",
        "expectedOutput": "1",
        "label": "Sample 3"
      },
      {
        "stdin": "1 2 3 4 5 -1 -1",
        "expectedOutput": "3",
        "label": "Hidden 1"
      }
    ]
  }
];

// ── In-Memory State ───────────────────────────────────────────────────
let waitingQueue = [];               // [{ socketId, userId, username, rating, difficulty, topic, timeoutId }]
const activeMatches = new Map();     // matchId => matchData
const friendRooms = new Map();       // roomCode => { socketId, userId, username, avatar, rating, difficulty, topic, disconnectTimer }

function getFilteredProblem(preferredDifficulty = 'any', preferredTopic = 'all') {
  let filtered = DUEL_PROBLEMS;

  // 1. Filter by topic if requested
  if (preferredTopic && preferredTopic !== 'all') {
    const topicMatches = filtered.filter(p => p.topic.toLowerCase() === preferredTopic.toLowerCase());
    if (topicMatches.length > 0) {
      filtered = topicMatches;
    }
  }

  // 2. Filter by difficulty if requested
  if (preferredDifficulty && preferredDifficulty !== 'any') {
    const diffMatches = filtered.filter(p => p.difficulty.toLowerCase() === preferredDifficulty.toLowerCase());
    if (diffMatches.length > 0) {
      filtered = diffMatches;
    }
  }

  const index = Math.floor(Math.random() * filtered.length);
  return filtered[index];
}

function setupDuelSockets(io) {
  io.on('connection', (socket) => {

    // ── 1. Quick Matchmaking Queue ──
    socket.on('duel:join_queue', (userData) => {
      // Remove any existing queue entries for this socket
      waitingQueue = waitingQueue.filter((p) => p.socketId !== socket.id);

      const player = {
        socketId: socket.id,
        userId: userData?.userId || `guest_${socket.id.slice(0, 5)}`,
        username: userData?.username || `Coder_${socket.id.slice(0, 4)}`,
        avatar: userData?.avatar || '⚔️',
        rating: userData?.rating || 1200,
        difficulty: userData?.difficulty || 'any',
        topic: userData?.topic || 'all',
      };

      // Check if someone in queue has compatible preferences
      const oppIdx = waitingQueue.findIndex((p) => {
        const diffMatch = player.difficulty === 'any' || p.difficulty === 'any' || player.difficulty === p.difficulty;
        const topicMatch = player.topic === 'all' || p.topic === 'all' || player.topic === p.topic;
        return diffMatch && topicMatch;
      });

      if (oppIdx !== -1) {
        const opponent = waitingQueue.splice(oppIdx, 1)[0];
        clearTimeout(opponent.timeoutId);

        const chosenDiff = player.difficulty !== 'any' ? player.difficulty : opponent.difficulty;
        const chosenTopic = player.topic !== 'all' ? player.topic : opponent.topic;

        // Create Human vs Human Match
        createMatch(io, player, opponent, false, chosenDiff, chosenTopic);
      } else {
        // Wait in queue; if no human joins within 7 seconds, match with AI Practice Bot
        const timeoutId = setTimeout(() => {
          const idx = waitingQueue.findIndex((p) => p.socketId === socket.id);
          if (idx !== -1) {
            waitingQueue.splice(idx, 1);
            // Spawn Bot Opponent with user's selected difficulty & topic
            const botOpponent = {
              socketId: `bot_${uuidv4().slice(0, 6)}`,
              userId: 'bot_ai',
              username: 'AlgoBot 🤖',
              avatar: '🤖',
              rating: Math.floor(player.rating + (Math.random() * 60 - 30)),
              isBot: true,
            };
            createMatch(io, player, botOpponent, true, player.difficulty, player.topic);
          }
        }, 7000);

        player.timeoutId = timeoutId;
        waitingQueue.push(player);
        socket.emit('duel:queue_waiting', { position: waitingQueue.length });
      }
    });

    socket.on('duel:leave_queue', () => {
      const idx = waitingQueue.findIndex((p) => p.socketId === socket.id);
      if (idx !== -1) {
        clearTimeout(waitingQueue[idx].timeoutId);
        waitingQueue.splice(idx, 1);
      }
      socket.emit('duel:queue_left');
    });

    // ── 2. Private Room for Friends (Custom Code, Reconnect Tolerant) ──
    socket.on('duel:create_room', (userData) => {
      // Generate clean, unambiguous 6-character room code
      const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
      let roomCode = '';
      for (let i = 0; i < 6; i++) {
        roomCode += chars[Math.floor(Math.random() * chars.length)];
      }

      const host = {
        socketId: socket.id,
        userId: userData?.userId || `guest_${socket.id.slice(0, 5)}`,
        username: userData?.username || 'HostCoder',
        avatar: userData?.avatar || '👑',
        rating: userData?.rating || 1200,
        difficulty: userData?.difficulty || 'any',
        topic: userData?.topic || 'all',
        disconnectTimer: null,
      };

      friendRooms.set(roomCode, host);
      socket.join(roomCode);
      socket.emit('duel:room_created', {
        roomCode,
        difficulty: host.difficulty,
        topic: host.topic,
      });
    });

    // Reconnect host if tab was switched or network briefly dropped
    socket.on('duel:reconnect_host', ({ roomCode, userId }) => {
      if (!roomCode) return;
      const cleanCode = roomCode.trim().toUpperCase();
      const room = friendRooms.get(cleanCode);
      if (room && (room.userId === userId || !userId)) {
        if (room.disconnectTimer) {
          clearTimeout(room.disconnectTimer);
          room.disconnectTimer = null;
        }
        room.socketId = socket.id;
        socket.join(cleanCode);
        socket.emit('duel:room_reconnected', { roomCode: cleanCode });
      }
    });

    socket.on('duel:leave_room', ({ roomCode }) => {
      if (!roomCode) return;
      const cleanCode = roomCode.trim().toUpperCase();
      const room = friendRooms.get(cleanCode);
      if (room && (room.socketId === socket.id || room.userId === socket.userId)) {
        if (room.disconnectTimer) clearTimeout(room.disconnectTimer);
        friendRooms.delete(cleanCode);
        socket.leave(cleanCode);
        socket.emit('duel:room_left');
      }
    });

    socket.on('duel:join_room', ({ roomCode, userData }) => {
      const cleanCode = (roomCode || '').trim().toUpperCase();
      const room = friendRooms.get(cleanCode);
      if (!room) {
        socket.emit('duel:room_error', { error: 'Room code not found or expired. Please check the code.' });
        return;
      }

      if (room.socketId === socket.id) {
        socket.emit('duel:room_error', { error: 'You cannot duel yourself in the same room!' });
        return;
      }

      if (room.disconnectTimer) {
        clearTimeout(room.disconnectTimer);
        room.disconnectTimer = null;
      }

      const challenger = {
        socketId: socket.id,
        userId: userData?.userId || `guest_${socket.id.slice(0, 5)}`,
        username: userData?.username || 'Challenger',
        avatar: userData?.avatar || '⚔️',
        rating: userData?.rating || 1200,
      };

      // Ensure room is removed from available listings so nobody else joins
      friendRooms.delete(cleanCode);

      // Start match with cleanCode passed for multi-cast delivery
      createMatch(io, room, challenger, false, room.difficulty, room.topic, cleanCode);
    });

    // ── 3. Live Test Progress Reporting ──
    socket.on('duel:report_progress', ({ matchId, senderId, passed, total, status }) => {
      const match = activeMatches.get(matchId);
      if (!match || match.ended) return;

      const isPlayer1 = match.player1.socketId === socket.id || (senderId && match.player1.userId === senderId);
      const targetSocket = isPlayer1 ? match.player2.socketId : match.player1.socketId;

      if (!match.isBotMatch || isPlayer1) {
        io.to(targetSocket).emit('duel:opponent_progress', {
          passed,
          total,
          status,
          senderId: isPlayer1 ? match.player1.userId : match.player2.userId,
          timestamp: Date.now(),
        });
      }
    });

    // ── 4. Solution Submission & Winner Evaluation ──
    socket.on('duel:submit_solution', ({ matchId, senderId, passed, total, code, language, timeTakenSec }) => {
      const match = activeMatches.get(matchId);
      if (!match || match.ended) return;

      if (passed === total && total > 0) {
        match.ended = true;
        if (match.botInterval) clearInterval(match.botInterval);

        const isPlayer1 = match.player1.socketId === socket.id || (senderId && match.player1.userId === senderId);
        const winner = isPlayer1 ? match.player1 : match.player2;
        const loser = isPlayer1 ? match.player2 : match.player1;

        const endPayload = {
          winnerId: winner.userId,
          winnerName: winner.username,
          loserId: loser.userId,
          loserName: loser.username,
          timeTakenSec: timeTakenSec || Math.floor((Date.now() - match.startTime) / 1000),
          winningCode: code,
          language: language || 'cpp',
          ratingDelta: 25,
          reason: `${winner.username} passed all ${total} testcases first!`
        };

        // Notify both players and the room
        io.to(match.player1.socketId).emit('duel:match_ended', endPayload);
        if (!match.isBotMatch && match.player2.socketId) {
          io.to(match.player2.socketId).emit('duel:match_ended', endPayload);
        }
        io.to(match.roomId).emit('duel:match_ended', endPayload);
      }
    });

    // ── 5. Disconnect Cleanup ──
    socket.on('disconnect', () => {
      // Remove from matchmaking queue
      const idx = waitingQueue.findIndex((p) => p.socketId === socket.id);
      if (idx !== -1) {
        clearTimeout(waitingQueue[idx].timeoutId);
        waitingQueue.splice(idx, 1);
      }

      // If host of a private room disconnected, give 90s grace period for mobile app/tab switching
      for (const [code, r] of friendRooms.entries()) {
        if (r.socketId === socket.id) {
          r.disconnectTimer = setTimeout(() => {
            friendRooms.delete(code);
          }, 90000);
        }
      }

      // If active match, notify opponent of forfeit
      for (const [matchId, match] of activeMatches.entries()) {
        if (!match.ended && (match.player1.socketId === socket.id || match.player2.socketId === socket.id)) {
          match.ended = true;
          if (match.botInterval) clearInterval(match.botInterval);

          const isPlayer1 = match.player1.socketId === socket.id;
          const winner = isPlayer1 ? match.player2 : match.player1;
          const loser = isPlayer1 ? match.player1 : match.player2;

          const forfeitPayload = {
            winnerId: winner.userId,
            winnerName: winner.username,
            loserId: loser.userId,
            loserName: loser.username,
            reason: `${loser.username} disconnected. Victory by forfeit!`,
            ratingDelta: 20
          };

          io.to(winner.socketId).emit('duel:match_ended', forfeitPayload);
          io.to(match.roomId).emit('duel:match_ended', forfeitPayload);
        }
      }
    });
  });
}

function createMatch(io, player1, player2, isBotMatch, preferredDifficulty = 'any', preferredTopic = 'all', privateRoomCode = null) {
  const matchId = `match_${uuidv4()}`;
  const roomId = `room_${matchId}`;
  const problem = getFilteredProblem(preferredDifficulty, preferredTopic);

  const matchData = {
    matchId,
    roomId,
    player1,
    player2,
    problem,
    startTime: Date.now(),
    durationSeconds: 15 * 60, // 15 mins
    isBotMatch,
    ended: false,
    botInterval: null,
  };

  activeMatches.set(matchId, matchData);

  const s1 = io.sockets.sockets.get(player1.socketId);
  if (s1) s1.join(roomId);

  let s2 = null;
  if (!isBotMatch) {
    s2 = io.sockets.sockets.get(player2.socketId);
    if (s2) s2.join(roomId);
  }

  const matchPayload = {
    matchId,
    player1: { userId: player1.userId, username: player1.username, avatar: player1.avatar, rating: player1.rating },
    player2: { userId: player2.userId, username: player2.username, avatar: player2.avatar, rating: player2.rating, isBot: player2.isBot },
    problem: {
      id: problem.id,
      title: problem.title,
      topic: problem.topic,
      topicLabel: problem.topicLabel,
      difficulty: problem.difficulty,
      description: problem.description,
      boilerplates: problem.boilerplates, // Starter code ONLY (no solution!)
      referenceSolutions: problem.referenceSolutions, // Complete working solution for post-match review
      testcases: problem.testcases.map(t => ({ stdin: t.stdin, expectedOutput: t.expectedOutput, label: t.label })),
    },
    durationSeconds: 15 * 60,
  };

  // MULTI-CAST DELIVERY:
  // 1. Directly to Player 1's socket
  io.to(player1.socketId).emit('duel:match_found', matchPayload);

  // 2. Directly to Player 2's socket (if human)
  if (!isBotMatch && player2.socketId) {
    io.to(player2.socketId).emit('duel:match_found', matchPayload);
  }

  // 3. To private room code (which host socket joined upon room creation)
  if (privateRoomCode) {
    io.to(privateRoomCode).emit('duel:match_found', matchPayload);
  }

  // 4. To the dedicated match room
  io.to(roomId).emit('duel:match_found', matchPayload);

  // If this is a bot match, simulate bot activity over time
  if (isBotMatch) {
    simulateBotBehavior(io, matchData);
  }
}

function simulateBotBehavior(io, match) {
  const total = match.problem.testcases.length;
  let botPassed = 0;
  let elapsed = 0;

  match.botInterval = setInterval(() => {
    if (match.ended) {
      clearInterval(match.botInterval);
      return;
    }

    elapsed += 5;

    if (elapsed === 15) {
      io.to(match.player1.socketId).emit('duel:opponent_progress', {
        passed: 0,
        total,
        status: 'Writing algorithm logic...',
        timestamp: Date.now()
      });
    }

    if (elapsed === 35 && botPassed < 1) {
      botPassed = 1;
      io.to(match.player1.socketId).emit('duel:opponent_progress', {
        passed: 1,
        total,
        status: `Passed 1/${total} testcases`,
        timestamp: Date.now()
      });
    }

    if (elapsed === 65 && botPassed < 2) {
      botPassed = 2;
      io.to(match.player1.socketId).emit('duel:opponent_progress', {
        passed: 2,
        total,
        status: `Passed 2/${total} testcases`,
        timestamp: Date.now()
      });
    }

    if (elapsed === 110 && botPassed < 3) {
      botPassed = 3;
      io.to(match.player1.socketId).emit('duel:opponent_progress', {
        passed: 3,
        total,
        status: `Passed 3/${total} testcases`,
        timestamp: Date.now()
      });
    }

    // Bot finishes around 3 minutes (180s)
    if (elapsed >= 180 && !match.ended) {
      match.ended = true;
      clearInterval(match.botInterval);

      const winningCode = match.problem.referenceSolutions?.python || match.problem.referenceSolutions?.cpp || '';

      const botEndPayload = {
        winnerId: match.player2.userId,
        winnerName: match.player2.username,
        loserId: match.player1.userId,
        loserName: match.player1.username,
        timeTakenSec: elapsed,
        winningCode,
        language: 'python',
        ratingDelta: 15,
        reason: 'AlgoBot 🤖 passed all testcases!'
      };

      io.to(match.player1.socketId).emit('duel:match_ended', botEndPayload);
      io.to(match.roomId).emit('duel:match_ended', botEndPayload);
    }
  }, 5000);
}

module.exports = { setupDuelSockets, DUEL_PROBLEMS };
