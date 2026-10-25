const { v4: uuidv4 } = require('uuid');

// ── Curated High-Speed Duel Problems Pool ─────────────────────────────
const DUEL_PROBLEMS = [
  // ── 1. Arrays & Hashing ──
  {
    id: 'two-sum',
    title: 'Two Sum Target Finder',
    topic: 'arrays',
    topicLabel: 'Arrays & Hashing',
    difficulty: 'Easy',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.

Output the 0-based indices separated by a space (smaller index first). You may assume that each input would have exactly one solution.

### Input Format
- Line 1: Space-separated integers representing the array
- Line 2: The integer target

### Output Format
- Two space-separated indices: \`index1 index2\``,
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int x;
    vector<int> nums;
    string line;
    if (getline(cin, line)) {
        stringstream ss(line);
        while (ss >> x) nums.push_back(x);
    }
    int target;
    cin >> target;

    // Write your solution here:
    for (int i = 0; i < (int)nums.size(); i++) {
        for (int j = i + 1; j < (int)nums.size(); j++) {
            if (nums[i] + nums[j] == target) {
                cout << i << " " << j << "\\n";
                return 0;
            }
        }
    }
    return 0;
}`,
      python: `import sys

lines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]
nums = list(map(int, lines[0].split()))
target = int(lines[1])

# Write your solution here:
seen = {}
for i, num in enumerate(nums):
    diff = target - num
    if diff in seen:
        print(f"{seen[diff]} {i}")
        break
    seen[num] = i
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine();
        String[] parts = line.trim().split("\\\\s+");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);
        int target = sc.nextInt();

        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int comp = target - nums[i];
            if (map.containsKey(comp)) {
                System.out.println(map.get(comp) + " " + i);
                return;
            }
            map.put(nums[i], i);
        }
    }
}`
    },
    testcases: [
      { stdin: "2 7 11 15\n9", expectedOutput: "0 1", label: "Sample 1" },
      { stdin: "3 2 4\n6", expectedOutput: "1 2", label: "Sample 2" },
      { stdin: "3 3\n6", expectedOutput: "0 1", label: "Hidden 1" },
      { stdin: "1 5 8 10 14 20\n24", expectedOutput: "1 4", label: "Hidden 2" },
    ]
  },
  {
    id: 'contains-duplicate',
    title: 'Contains Duplicate',
    topic: 'arrays',
    topicLabel: 'Arrays & Hashing',
    difficulty: 'Easy',
    description: `Given an integer array \`nums\`, print \`true\` if any value appears at least twice in the array, and print \`false\` if every element is distinct.

### Input Format
- Space-separated integers on a single line

### Output Format
- \`true\` or \`false\``,
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int x;
    vector<int> nums;
    while (cin >> x) nums.push_back(x);

    unordered_set<int> seen;
    for (int n : nums) {
        if (seen.count(n)) {
            cout << "true\\n";
            return 0;
        }
        seen.insert(n);
    }
    cout << "false\\n";
    return 0;
}`,
      python: `import sys

nums = list(map(int, sys.stdin.read().split()))
print("true" if len(nums) != len(set(nums)) else "false")
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Set<Integer> set = new HashSet<>();
        while (sc.hasNextInt()) {
            int num = sc.nextInt();
            if (!set.add(num)) {
                System.out.println("true");
                return;
            }
        }
        System.out.println("false");
    }
}`
    },
    testcases: [
      { stdin: "1 2 3 1", expectedOutput: "true", label: "Sample 1" },
      { stdin: "1 2 3 4", expectedOutput: "false", label: "Sample 2" },
      { stdin: "1 1 1 3 3 4 3 2 4 2", expectedOutput: "true", label: "Hidden 1" },
      { stdin: "10 20 30 40 50", expectedOutput: "false", label: "Hidden 2" },
    ]
  },
  {
    id: 'max-subarray',
    title: 'Maximum Subarray Sum',
    topic: 'arrays',
    topicLabel: 'Arrays & Hashing',
    difficulty: 'Medium',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum. (Kadane's Algorithm)

### Input Format
- Space-separated integers on a single line

### Output Format
- Single integer representing the maximum subarray sum`,
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int x;
    vector<int> nums;
    while (cin >> x) nums.push_back(x);

    // Write your Kadane's Algorithm here:
    long long maxSum = nums[0];
    long long current = nums[0];
    for (size_t i = 1; i < nums.size(); i++) {
        current = max((long long)nums[i], current + nums[i]);
        maxSum = max(maxSum, current);
    }
    cout << maxSum << "\\n";
    return 0;
}`,
      python: `import sys

nums = list(map(int, sys.stdin.read().split()))
if not nums:
    print(0)
    sys.exit(0)

# Write your solution here:
current = max_sum = nums[0]
for x in nums[1:]:
    current = max(x, current + x)
    max_sum = max(max_sum, current)
print(max_sum)
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();
        while (sc.hasNextInt()) list.add(sc.nextInt());

        long current = list.get(0);
        long max = list.get(0);
        for (int i = 1; i < list.size(); i++) {
            current = Math.max((long)list.get(i), current + list.get(i));
            max = Math.max(max, current);
        }
        System.out.println(max);
    }
}`
    },
    testcases: [
      { stdin: "-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6", label: "Sample 1" },
      { stdin: "1", expectedOutput: "1", label: "Sample 2" },
      { stdin: "5 4 -1 7 8", expectedOutput: "23", label: "Hidden 1" },
      { stdin: "-5 -2 -8 -1", expectedOutput: "-1", label: "Hidden 2 (All negative)" },
    ]
  },
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    topic: 'arrays',
    topicLabel: 'Arrays & Hashing',
    difficulty: 'Hard',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.

### Input Format
- Space-separated non-negative integers

### Output Format
- Single integer representing total trapped water units`,
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int x;
    vector<int> h;
    while (cin >> x) h.push_back(x);
    if (h.size() < 3) { cout << 0 << "\\n"; return 0; }

    int l = 0, r = h.size() - 1;
    int maxL = h[l], maxR = h[r];
    long long water = 0;
    while (l < r) {
        if (maxL <= maxR) {
            l++;
            maxL = max(maxL, h[l]);
            water += maxL - h[l];
        } else {
            r--;
            maxR = max(maxR, h[r]);
            water += maxR - h[r];
        }
    }
    cout << water << "\\n";
    return 0;
}`,
      python: `import sys

h = list(map(int, sys.stdin.read().split()))
if len(h) < 3:
    print(0)
    sys.exit(0)

l, r = 0, len(h) - 1
max_l, max_r = h[l], h[r]
water = 0
while l < r:
    if max_l <= max_r:
        l += 1
        max_l = max(max_l, h[l])
        water += max_l - h[l]
    else:
        r -= 1
        max_r = max(max_r, h[r])
        water += max_r - h[r]
print(water)
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> h = new ArrayList<>();
        while (sc.hasNextInt()) h.add(sc.nextInt());
        if (h.size() < 3) { System.out.println(0); return; }

        int l = 0, r = h.size() - 1;
        int maxL = h.get(l), maxR = h.get(r);
        long water = 0;
        while (l < r) {
            if (maxL <= maxR) {
                l++;
                maxL = Math.max(maxL, h.get(l));
                water += maxL - h.get(l);
            } else {
                r--;
                maxR = Math.max(maxR, h.get(r));
                water += maxR - h.get(r);
            }
        }
        System.out.println(water);
    }
}`
    },
    testcases: [
      { stdin: "0 1 0 2 1 0 1 3 2 1 2 1", expectedOutput: "6", label: "Sample 1" },
      { stdin: "4 2 0 3 2 5", expectedOutput: "9", label: "Sample 2" },
      { stdin: "3 0 2 0 4", expectedOutput: "7", label: "Hidden 1" },
      { stdin: "1 2 3 4 5", expectedOutput: "0", label: "Hidden 2" },
    ]
  },

  // ── 2. Strings ──
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome Number',
    topic: 'strings',
    topicLabel: 'Strings',
    difficulty: 'Easy',
    description: `Given an integer \`x\`, print \`true\` if \`x\` is a palindrome, and \`false\` otherwise. Negative numbers are not palindromes.

### Input Format
- Single integer \`x\`

### Output Format
- \`true\` or \`false\``,
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    long long x;
    if (!(cin >> x)) return 0;
    if (x < 0) {
        cout << "false\\n";
        return 0;
    }
    string s = to_string(x);
    string r = s;
    reverse(r.begin(), r.end());
    cout << (s == r ? "true" : "false") << "\\n";
    return 0;
}`,
      python: `import sys

val = sys.stdin.read().strip()
if not val:
    sys.exit(0)
x = int(val)
if x < 0:
    print("false")
else:
    s = str(x)
    print("true" if s == s[::-1] else "false")
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLong()) return;
        long x = sc.nextLong();
        if (x < 0) {
            System.out.println("false");
            return;
        }
        String s = Long.toString(x);
        String rev = new StringBuilder(s).reverse().toString();
        System.out.println(s.equals(rev) ? "true" : "false");
    }
}`
    },
    testcases: [
      { stdin: "121", expectedOutput: "true", label: "Sample 1" },
      { stdin: "-121", expectedOutput: "false", label: "Sample 2" },
      { stdin: "10", expectedOutput: "false", label: "Sample 3" },
      { stdin: "123454321", expectedOutput: "true", label: "Hidden 1" },
    ]
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    topic: 'strings',
    topicLabel: 'Strings',
    difficulty: 'Easy',
    description: `Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
Open brackets must be closed by the same type of brackets in the correct order.

### Input Format
- A single string on line 1

### Output Format
- \`true\` or \`false\``,
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    if (!(cin >> s)) { cout << "true\\n"; return 0; }
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') st.push(c);
        else {
            if (st.empty()) { cout << "false\\n"; return 0; }
            char top = st.top();
            st.pop();
            if ((c == ')' && top != '(') || (c == '}' && top != '{') || (c == ']' && top != '[')) {
                cout << "false\\n";
                return 0;
            }
        }
    }
    cout << (st.empty() ? "true" : "false") << "\\n";
    return 0;
}`,
      python: `import sys

s = sys.stdin.read().strip()
st = []
mapping = {')': '(', '}': '{', ']': '['}
valid = True
for c in s:
    if c in mapping.values():
        st.append(c)
    elif c in mapping:
        if not st or st.pop() != mapping[c]:
            valid = False
            break
print("true" if valid and not st else "false")
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) { System.out.println("true"); return; }
        String s = sc.next();
        Deque<Character> st = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '{' || c == '[') st.push(c);
            else {
                if (st.isEmpty()) { System.out.println("false"); return; }
                char top = st.pop();
                if ((c == ')' && top != '(') || (c == '}' && top != '{') || (c == ']' && top != '[')) {
                    System.out.println("false");
                    return;
                }
            }
        }
        System.out.println(st.isEmpty() ? "true" : "false");
    }
}`
    },
    testcases: [
      { stdin: "()[]{}", expectedOutput: "true", label: "Sample 1" },
      { stdin: "(]", expectedOutput: "false", label: "Sample 2" },
      { stdin: "([)]", expectedOutput: "false", label: "Sample 3" },
      { stdin: "{[()]}", expectedOutput: "true", label: "Hidden 1" },
    ]
  },
  {
    id: 'reverse-words',
    title: 'Reverse Words in a String',
    topic: 'strings',
    topicLabel: 'Strings',
    difficulty: 'Medium',
    description: `Given an input string of words separated by spaces, reverse the order of the words. Return a string of the words in reverse order concatenated by a single space.

### Input Format
- A single line of text with multiple words

### Output Format
- Words printed in reverse order separated by a single space`,
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string line;
    if (!getline(cin, line)) return 0;
    stringstream ss(line);
    string word;
    vector<string> words;
    while (ss >> word) words.push_back(word);
    reverse(words.begin(), words.end());
    for (size_t i = 0; i < words.size(); i++) {
        cout << words[i] << (i + 1 == words.size() ? "" : " ");
    }
    cout << "\\n";
    return 0;
}`,
      python: `import sys

line = sys.stdin.read().strip()
words = line.split()
print(" ".join(reversed(words)))
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String line = sc.nextLine().trim();
        String[] words = line.split("\\\\s+");
        List<String> list = Arrays.asList(words);
        Collections.reverse(list);
        System.out.println(String.join(" ", list));
    }
}`
    },
    testcases: [
      { stdin: "the sky is blue", expectedOutput: "blue is sky the", label: "Sample 1" },
      { stdin: "  hello world  ", expectedOutput: "world hello", label: "Sample 2" },
      { stdin: "a good   example", expectedOutput: "example good a", label: "Hidden 1" },
      { stdin: "DSAverse arena battle", expectedOutput: "battle arena DSAverse", label: "Hidden 2" },
    ]
  },

  // ── 3. Binary Search ──
  {
    id: 'binary-search',
    title: 'Binary Search Target',
    topic: 'binary-search',
    topicLabel: 'Binary Search',
    difficulty: 'Easy',
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, return its 0-based index. Otherwise, return \`-1\`.

### Input Format
- Line 1: Space-separated sorted integers
- Line 2: The integer target

### Output Format
- Single integer representing index or \`-1\``,
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int x;
    vector<int> nums;
    string line;
    if (getline(cin, line)) {
        stringstream ss(line);
        while (ss >> x) nums.push_back(x);
    }
    int target;
    cin >> target;

    int l = 0, r = nums.size() - 1;
    int ans = -1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (nums[mid] == target) { ans = mid; break; }
        else if (nums[mid] < target) l = mid + 1;
        else r = mid - 1;
    }
    cout << ans << "\\n";
    return 0;
}`,
      python: `import sys

lines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]
nums = list(map(int, lines[0].split()))
target = int(lines[1])

l, r = 0, len(nums) - 1
ans = -1
while l <= r:
    mid = (l + r) // 2
    if nums[mid] == target:
        ans = mid
        break
    elif nums[mid] < target:
        l = mid + 1
    else:
        r = mid - 1
print(ans)
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine();
        String[] parts = line.trim().split("\\\\s+");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);
        int target = sc.nextInt();

        int l = 0, r = nums.length - 1;
        int ans = -1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) { ans = mid; break; }
            else if (nums[mid] < target) l = mid + 1;
            else r = mid - 1;
        }
        System.out.println(ans);
    }
}`
    },
    testcases: [
      { stdin: "-1 0 3 5 9 12\n9", expectedOutput: "4", label: "Sample 1" },
      { stdin: "-1 0 3 5 9 12\n2", expectedOutput: "-1", label: "Sample 2" },
      { stdin: "5\n5", expectedOutput: "0", label: "Hidden 1" },
      { stdin: "2 4 6 8 10 12 14 16\n14", expectedOutput: "6", label: "Hidden 2" },
    ]
  },
  {
    id: 'search-rotated-array',
    title: 'Search in Rotated Sorted Array',
    topic: 'binary-search',
    topicLabel: 'Binary Search',
    difficulty: 'Medium',
    description: `There is an integer array \`nums\` sorted in ascending order (with distinct values) that has been rotated at an unknown pivot index.
Given the rotated array \`nums\` and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`.

### Input Format
- Line 1: Space-separated integers representing the rotated array
- Line 2: The integer target

### Output Format
- Single integer representing 0-based index or \`-1\``,
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int x;
    vector<int> nums;
    string line;
    if (getline(cin, line)) {
        stringstream ss(line);
        while (ss >> x) nums.push_back(x);
    }
    int target;
    cin >> target;

    int l = 0, r = nums.size() - 1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (nums[mid] == target) {
            cout << mid << "\\n";
            return 0;
        }
        if (nums[l] <= nums[mid]) {
            if (nums[l] <= target && target < nums[mid]) r = mid - 1;
            else l = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[r]) l = mid + 1;
            else r = mid - 1;
        }
    }
    cout << -1 << "\\n";
    return 0;
}`,
      python: `import sys

lines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]
nums = list(map(int, lines[0].split()))
target = int(lines[1])

l, r = 0, len(nums) - 1
ans = -1
while l <= r:
    mid = (l + r) // 2
    if nums[mid] == target:
        ans = mid
        break
    if nums[l] <= nums[mid]:
        if nums[l] <= target < nums[mid]:
            r = mid - 1
        else:
            l = mid + 1
    else:
        if nums[mid] < target <= nums[r]:
            l = mid + 1
        else:
            r = mid - 1
print(ans)
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine();
        String[] parts = line.trim().split("\\\\s+");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);
        int target = sc.nextInt();

        int l = 0, r = nums.length - 1;
        int ans = -1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) { ans = mid; break; }
            if (nums[l] <= nums[mid]) {
                if (nums[l] <= target && target < nums[mid]) r = mid - 1;
                else l = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[r]) l = mid + 1;
                else r = mid - 1;
            }
        }
        System.out.println(ans);
    }
}`
    },
    testcases: [
      { stdin: "4 5 6 7 0 1 2\n0", expectedOutput: "4", label: "Sample 1" },
      { stdin: "4 5 6 7 0 1 2\n3", expectedOutput: "-1", label: "Sample 2" },
      { stdin: "1\n0", expectedOutput: "-1", label: "Sample 3" },
      { stdin: "6 7 8 1 2 3 4 5\n8", expectedOutput: "2", label: "Hidden 1" },
    ]
  },

  // ── 4. Dynamic Programming ──
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    topic: 'dp',
    topicLabel: 'Dynamic Programming',
    difficulty: 'Easy',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.
Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?

### Input Format
- Single integer \`n\`

### Output Format
- Single integer representing total distinct ways`,
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    if (n <= 2) { cout << n << "\\n"; return 0; }
    long long a = 1, b = 2;
    for (int i = 3; i <= n; i++) {
        long long c = a + b;
        a = b;
        b = c;
    }
    cout << b << "\\n";
    return 0;
}`,
      python: `import sys

n = int(sys.stdin.read().strip())
if n <= 2:
    print(n)
else:
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    print(b)
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n <= 2) { System.out.println(n); return; }
        long a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            long c = a + b;
            a = b;
            b = c;
        }
        System.out.println(b);
    }
}`
    },
    testcases: [
      { stdin: "2", expectedOutput: "2", label: "Sample 1" },
      { stdin: "3", expectedOutput: "3", label: "Sample 2" },
      { stdin: "5", expectedOutput: "8", label: "Hidden 1" },
      { stdin: "10", expectedOutput: "89", label: "Hidden 2" },
    ]
  },
  {
    id: 'coin-change',
    title: 'Minimum Coin Change',
    topic: 'dp',
    topicLabel: 'Dynamic Programming',
    difficulty: 'Medium',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.
Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

### Input Format
- Line 1: Space-separated coin denominations
- Line 2: Target amount

### Output Format
- Fewest coins needed or \`-1\``,
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int x;
    vector<int> coins;
    string line;
    if (getline(cin, line)) {
        stringstream ss(line);
        while (ss >> x) coins.push_back(x);
    }
    int amount;
    cin >> amount;

    vector<int> dp(amount + 1, 1e9);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int c : coins) {
            if (i >= c && dp[i - c] != 1e9) {
                dp[i] = min(dp[i], dp[i - c] + 1);
            }
        }
    }
    cout << (dp[amount] == 1e9 ? -1 : dp[amount]) << "\\n";
    return 0;
}`,
      python: `import sys

lines = [l.strip() for l in sys.stdin.read().split('\\n') if l.strip()]
coins = list(map(int, lines[0].split()))
amount = int(lines[1])

dp = [float('inf')] * (amount + 1)
dp[0] = 0
for i in range(1, amount + 1):
    for c in coins:
        if i >= c:
            dp[i] = min(dp[i], dp[i - c] + 1)
print(-1 if dp[amount] == float('inf') else dp[amount])
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine();
        String[] parts = line.trim().split("\\\\s+");
        int[] coins = new int[parts.length];
        for (int i = 0; i < parts.length; i++) coins[i] = Integer.parseInt(parts[i]);
        int amount = sc.nextInt();

        int[] dp = new int[amount + 1];
        Arrays.fill(dp, 1000000000);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int c : coins) {
                if (i >= c && dp[i - c] != 1000000000) {
                    dp[i] = Math.min(dp[i], dp[i - c] + 1);
                }
            }
        }
        System.out.println(dp[amount] == 1000000000 ? -1 : dp[amount]);
    }
}`
    },
    testcases: [
      { stdin: "1 2 5\n11", expectedOutput: "3", label: "Sample 1" },
      { stdin: "2\n3", expectedOutput: "-1", label: "Sample 2" },
      { stdin: "1\n0", expectedOutput: "0", label: "Sample 3" },
      { stdin: "1 5 10 25\n30", expectedOutput: "2", label: "Hidden 1" },
    ]
  },
  {
    id: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    topic: 'dp',
    topicLabel: 'Dynamic Programming',
    difficulty: 'Hard',
    description: `Given an integer array \`nums\`, return the length of the longest strictly increasing subsequence.

### Input Format
- Space-separated integers on a single line

### Output Format
- Single integer representing length of the LIS`,
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int x;
    vector<int> nums;
    while (cin >> x) nums.push_back(x);
    if (nums.empty()) { cout << 0 << "\\n"; return 0; }

    vector<int> tails;
    for (int n : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), n);
        if (it == tails.end()) tails.push_back(n);
        else *it = n;
    }
    cout << tails.size() << "\\n";
    return 0;
}`,
      python: `import sys
import bisect

nums = list(map(int, sys.stdin.read().split()))
if not nums:
    print(0)
    sys.exit(0)

tails = []
for n in nums:
    idx = bisect.bisect_left(tails, n)
    if idx == len(tails):
        tails.append(n)
    else:
        tails[idx] = n

print(len(tails))
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> nums = new ArrayList<>();
        while (sc.hasNextInt()) nums.add(sc.nextInt());
        if (nums.isEmpty()) { System.out.println(0); return; }

        List<Integer> tails = new ArrayList<>();
        for (int n : nums) {
            int idx = Collections.binarySearch(tails, n);
            if (idx < 0) idx = -(idx + 1);
            if (idx == tails.size()) tails.add(n);
            else tails.set(idx, n);
        }
        System.out.println(tails.size());
    }
}`
    },
    testcases: [
      { stdin: "10 9 2 5 3 7 101 18", expectedOutput: "4", label: "Sample 1" },
      { stdin: "0 1 0 3 2 3", expectedOutput: "4", label: "Sample 2" },
      { stdin: "7 7 7 7 7 7 7", expectedOutput: "1", label: "Sample 3" },
      { stdin: "1 3 6 7 9 4 10 5 6", expectedOutput: "6", label: "Hidden 1" },
    ]
  },

  // ── 5. Trees ──
  {
    id: 'invert-tree-level',
    title: 'Invert Tree Level Order',
    topic: 'trees',
    topicLabel: 'Trees & Traversal',
    difficulty: 'Medium',
    description: `Given a binary tree represented as level-order space-separated integers where \`-1\` represents null, invert the tree (mirror left and right subtrees) and print the inverted tree in level-order.

### Input Format
- Space-separated integers representing the binary tree level-order

### Output Format
- Space-separated integers representing inverted level-order`,
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

struct Node {
    int val;
    Node* left;
    Node* right;
    Node(int v) : val(v), left(nullptr), right(nullptr) {}
};

Node* buildTree(const vector<int>& nums) {
    if (nums.empty() || nums[0] == -1) return nullptr;
    Node* root = new Node(nums[0]);
    queue<Node*> q;
    q.push(root);
    size_t i = 1;
    while (!q.empty() && i < nums.size()) {
        Node* curr = q.front();
        q.pop();
        if (i < nums.size() && nums[i] != -1) {
            curr->left = new Node(nums[i]);
            q.push(curr->left);
        }
        i++;
        if (i < nums.size() && nums[i] != -1) {
            curr->right = new Node(nums[i]);
            q.push(curr->right);
        }
        i++;
    }
    return root;
}

void invertTree(Node* root) {
    if (!root) return;
    swap(root->left, root->right);
    invertTree(root->left);
    invertTree(root->right);
}

int main() {
    int x;
    vector<int> nums;
    while (cin >> x) nums.push_back(x);
    Node* root = buildTree(nums);
    invertTree(root);

    if (!root) return 0;
    queue<Node*> q;
    q.push(root);
    vector<int> out;
    while (!q.empty()) {
        Node* curr = q.front();
        q.pop();
        if (curr) {
            out.push_back(curr->val);
            q.push(curr->left);
            q.push(curr->right);
        } else {
            out.push_back(-1);
        }
    }
    while (!out.empty() && out.back() == -1) out.pop_back();
    for (size_t k = 0; k < out.size(); k++) {
        cout << out[k] << (k + 1 == out.size() ? "" : " ");
    }
    cout << "\\n";
    return 0;
}`,
      python: `import sys

nums = list(map(int, sys.stdin.read().split()))
if not nums or nums[0] == -1:
    sys.exit(0)

class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

root = Node(nums[0])
q = [root]
i = 1
while q and i < len(nums):
    curr = q.pop(0)
    if i < len(nums) and nums[i] != -1:
        curr.left = Node(nums[i])
        q.append(curr.left)
    i += 1
    if i < len(nums) and nums[i] != -1:
        curr.right = Node(nums[i])
        q.append(curr.right)
    i += 1

def invert(node):
    if not node: return
    node.left, node.right = node.right, node.left
    invert(node.left)
    invert(node.right)

invert(root)

out = []
q = [root]
while q:
    curr = q.pop(0)
    if curr:
        out.append(curr.val)
        q.append(curr.left)
        q.append(curr.right)
    else:
        out.append(-1)

while out and out[-1] == -1:
    out.pop()

print(" ".join(map(str, out)))
`,
      java: `import java.util.*;

public class Main {
    static class Node {
        int val;
        Node left, right;
        Node(int v) { val = v; }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> nums = new ArrayList<>();
        while (sc.hasNextInt()) nums.add(sc.nextInt());
        if (nums.isEmpty() || nums.get(0) == -1) return;

        Node root = new Node(nums.get(0));
        Queue<Node> q = new LinkedList<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < nums.size()) {
            Node curr = q.poll();
            if (i < nums.size() && nums.get(i) != -1) {
                curr.left = new Node(nums.get(i));
                q.add(curr.left);
            }
            i++;
            if (i < nums.size() && nums.get(i) != -1) {
                curr.right = new Node(nums.get(i));
                q.add(curr.right);
            }
            i++;
        }

        invert(root);

        List<Integer> out = new ArrayList<>();
        q.add(root);
        while (!q.isEmpty()) {
            Node curr = q.poll();
            if (curr != null) {
                out.add(curr.val);
                q.add(curr.left);
                q.add(curr.right);
            } else {
                out.add(-1);
            }
        }
        while (!out.isEmpty() && out.get(out.size() - 1) == -1) {
            out.remove(out.size() - 1);
        }
        for (int k = 0; k < out.size(); k++) {
            System.out.print(out.get(k) + (k + 1 == out.size() ? "" : " "));
        }
        System.out.println();
    }

    static void invert(Node n) {
        if (n == null) return;
        Node tmp = n.left;
        n.left = n.right;
        n.right = tmp;
        invert(n.left);
        invert(n.right);
    }
}`
    },
    testcases: [
      { stdin: "4 2 7 1 3 6 9", expectedOutput: "4 7 2 9 6 3 1", label: "Sample 1" },
      { stdin: "2 1 3", expectedOutput: "2 3 1", label: "Sample 2" },
      { stdin: "1", expectedOutput: "1", label: "Hidden 1" },
    ]
  },
  {
    id: 'max-depth-tree',
    title: 'Maximum Depth of Binary Tree',
    topic: 'trees',
    topicLabel: 'Trees & Traversal',
    difficulty: 'Easy',
    description: `Given a binary tree represented as level-order space-separated integers where \`-1\` represents null, return its maximum depth.
A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.

### Input Format
- Space-separated integers representing the binary tree level-order

### Output Format
- Single integer representing the max depth`,
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

struct Node {
    int val;
    Node* left;
    Node* right;
    Node(int v) : val(v), left(nullptr), right(nullptr) {}
};

Node* buildTree(const vector<int>& nums) {
    if (nums.empty() || nums[0] == -1) return nullptr;
    Node* root = new Node(nums[0]);
    queue<Node*> q;
    q.push(root);
    size_t i = 1;
    while (!q.empty() && i < nums.size()) {
        Node* curr = q.front();
        q.pop();
        if (i < nums.size() && nums[i] != -1) {
            curr->left = new Node(nums[i]);
            q.push(curr->left);
        }
        i++;
        if (i < nums.size() && nums[i] != -1) {
            curr->right = new Node(nums[i]);
            q.push(curr->right);
        }
        i++;
    }
    return root;
}

int maxDepth(Node* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}

int main() {
    int x;
    vector<int> nums;
    while (cin >> x) nums.push_back(x);
    Node* root = buildTree(nums);
    cout << maxDepth(root) << "\\n";
    return 0;
}`,
      python: `import sys

nums = list(map(int, sys.stdin.read().split()))
if not nums or nums[0] == -1:
    print(0)
    sys.exit(0)

class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

root = Node(nums[0])
q = [root]
i = 1
while q and i < len(nums):
    curr = q.pop(0)
    if i < len(nums) and nums[i] != -1:
        curr.left = Node(nums[i])
        q.append(curr.left)
    i += 1
    if i < len(nums) and nums[i] != -1:
        curr.right = Node(nums[i])
        q.append(curr.right)
    i += 1

def max_depth(node):
    if not node:
        return 0
    return 1 + max(max_depth(node.left), max_depth(node.right))

print(max_depth(root))
`,
      java: `import java.util.*;

public class Main {
    static class Node {
        int val;
        Node left, right;
        Node(int v) { val = v; }
    }

    static int maxDepth(Node root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> nums = new ArrayList<>();
        while (sc.hasNextInt()) nums.add(sc.nextInt());
        if (nums.isEmpty() || nums.get(0) == -1) {
            System.out.println(0);
            return;
        }

        Node root = new Node(nums.get(0));
        Queue<Node> q = new LinkedList<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < nums.size()) {
            Node curr = q.poll();
            if (i < nums.size() && nums.get(i) != -1) {
                curr.left = new Node(nums.get(i));
                q.add(curr.left);
            }
            i++;
            if (i < nums.size() && nums.get(i) != -1) {
                curr.right = new Node(nums.get(i));
                q.add(curr.right);
            }
            i++;
        }

        System.out.println(maxDepth(root));
    }
}`
    },
    testcases: [
      { stdin: "3 9 20 -1 -1 15 7", expectedOutput: "3", label: "Sample 1" },
      { stdin: "1 -1 2", expectedOutput: "2", label: "Sample 2" },
      { stdin: "1", expectedOutput: "1", label: "Sample 3" },
      { stdin: "1 2 3 4 5 -1 -1", expectedOutput: "3", label: "Hidden 1" },
    ]
  }
];

// ── In-Memory State ───────────────────────────────────────────────────
let waitingQueue = [];      // [{ socketId, userId, username, rating, difficulty, topic, timeoutId }]
const activeMatches = new Map(); // matchId => matchData
const friendRooms = new Map();   // roomCode => { hostSocket, hostData, difficulty, topic }

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

    // ── 2. Private Room for Friends (With Custom Topic & Difficulty) ──
    socket.on('duel:create_room', (userData) => {
      const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const host = {
        socketId: socket.id,
        userId: userData?.userId || `guest_${socket.id.slice(0, 5)}`,
        username: userData?.username || 'HostCoder',
        avatar: userData?.avatar || '👑',
        rating: userData?.rating || 1200,
        difficulty: userData?.difficulty || 'any',
        topic: userData?.topic || 'all',
      };
      friendRooms.set(roomCode, host);
      socket.join(roomCode);
      socket.emit('duel:room_created', {
        roomCode,
        difficulty: host.difficulty,
        topic: host.topic,
      });
    });

    socket.on('duel:join_room', ({ roomCode, userData }) => {
      const cleanCode = (roomCode || '').trim().toUpperCase();
      const room = friendRooms.get(cleanCode);
      if (!room) {
        socket.emit('duel:room_error', { error: 'Room code not found or expired.' });
        return;
      }

      if (room.socketId === socket.id) {
        socket.emit('duel:room_error', { error: 'You cannot duel yourself in the same room!' });
        return;
      }

      const challenger = {
        socketId: socket.id,
        userId: userData?.userId || `guest_${socket.id.slice(0, 5)}`,
        username: userData?.username || 'Challenger',
        avatar: userData?.avatar || '⚔️',
        rating: userData?.rating || 1200,
      };

      friendRooms.delete(cleanCode);
      createMatch(io, room, challenger, false, room.difficulty, room.topic);
    });

    // ── 3. Live Test Progress Reporting ──
    socket.on('duel:report_progress', ({ matchId, passed, total, status }) => {
      const match = activeMatches.get(matchId);
      if (!match || match.ended) return;

      const isPlayer1 = match.player1.socketId === socket.id;
      const opponentSocket = isPlayer1 ? match.player2.socketId : match.player1.socketId;

      if (!match.isBotMatch || isPlayer1) {
        io.to(opponentSocket).emit('duel:opponent_progress', {
          passed,
          total,
          status,
          timestamp: Date.now(),
        });
      }
    });

    // ── 4. Solution Submission & Winner Evaluation ──
    socket.on('duel:submit_solution', ({ matchId, passed, total, code, language, timeTakenSec }) => {
      const match = activeMatches.get(matchId);
      if (!match || match.ended) return;

      if (passed === total && total > 0) {
        // Player Won!
        match.ended = true;
        const isPlayer1 = match.player1.socketId === socket.id;
        const winner = isPlayer1 ? match.player1 : match.player2;
        const loser = isPlayer1 ? match.player2 : match.player1;

        if (match.botInterval) clearInterval(match.botInterval);

        io.to(match.roomId).emit('duel:match_ended', {
          winnerId: winner.userId,
          winnerName: winner.username,
          loserId: loser.userId,
          loserName: loser.username,
          timeTakenSec,
          winningCode: code,
          language,
          ratingDelta: 25,
          reason: 'All testcases passed perfectly!'
        });
      }
    });

    // ── 5. Disconnect Cleanup ──
    socket.on('disconnect', () => {
      const idx = waitingQueue.findIndex((p) => p.socketId === socket.id);
      if (idx !== -1) {
        clearTimeout(waitingQueue[idx].timeoutId);
        waitingQueue.splice(idx, 1);
      }

      for (const [matchId, match] of activeMatches.entries()) {
        if (!match.ended && (match.player1.socketId === socket.id || match.player2.socketId === socket.id)) {
          match.ended = true;
          if (match.botInterval) clearInterval(match.botInterval);

          const isPlayer1 = match.player1.socketId === socket.id;
          const winner = isPlayer1 ? match.player2 : match.player1;
          const loser = isPlayer1 ? match.player1 : match.player2;

          io.to(match.roomId).emit('duel:match_ended', {
            winnerId: winner.userId,
            winnerName: winner.username,
            loserId: loser.userId,
            loserName: loser.username,
            reason: `${loser.username} disconnected. Victory by forfeit!`,
            ratingDelta: 20
          });
        }
      }
    });
  });
}

function createMatch(io, player1, player2, isBotMatch, preferredDifficulty = 'any', preferredTopic = 'all') {
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

  if (!isBotMatch) {
    const s2 = io.sockets.sockets.get(player2.socketId);
    if (s2) s2.join(roomId);
  }

  // Notify both players of match start
  io.to(roomId).emit('duel:match_found', {
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
      boilerplates: problem.boilerplates,
      testcases: problem.testcases.map(t => ({ stdin: t.stdin, expectedOutput: t.expectedOutput, label: t.label })),
    },
    durationSeconds: 15 * 60,
  });

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
      io.to(match.roomId).emit('duel:opponent_progress', {
        passed: 0,
        total,
        status: 'Writing algorithm logic...',
        timestamp: Date.now()
      });
    }

    if (elapsed === 35 && botPassed < 1) {
      botPassed = 1;
      io.to(match.roomId).emit('duel:opponent_progress', {
        passed: 1,
        total,
        status: 'Passed 1/' + total + ' testcases',
        timestamp: Date.now()
      });
    }

    if (elapsed === 65 && botPassed < 2) {
      botPassed = 2;
      io.to(match.roomId).emit('duel:opponent_progress', {
        passed: 2,
        total,
        status: 'Passed 2/' + total + ' testcases',
        timestamp: Date.now()
      });
    }

    if (elapsed === 110 && botPassed < 3) {
      botPassed = 3;
      io.to(match.roomId).emit('duel:opponent_progress', {
        passed: 3,
        total,
        status: 'Passed 3/' + total + ' testcases',
        timestamp: Date.now()
      });
    }

    // Bot finishes around 3 minutes (180s)
    if (elapsed >= 180 && !match.ended) {
      match.ended = true;
      clearInterval(match.botInterval);

      io.to(match.roomId).emit('duel:match_ended', {
        winnerId: match.player2.userId,
        winnerName: match.player2.username,
        loserId: match.player1.userId,
        loserName: match.player1.username,
        timeTakenSec: elapsed,
        winningCode: match.problem.boilerplates.python || match.problem.boilerplates.cpp,
        language: 'python',
        ratingDelta: 15,
        reason: 'AlgoBot 🤖 passed all testcases!'
      });
    }
  }, 5000);
}

module.exports = { setupDuelSockets, DUEL_PROBLEMS };
