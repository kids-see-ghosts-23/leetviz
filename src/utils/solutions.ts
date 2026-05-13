// Built-in Python solutions for all known problems

export const pythonSolutions: Record<string, {
  code: string;
  explanation: string;
  mistakes: string[];
  complexity: { time: string; space: string };
}> = {
  'two sum': {
    code: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}  # val -> index
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in seen:
            return [seen[complement], i]
        
        seen[num] = i
    
    return []  # no solution found


# Example
nums = [2, 7, 11, 15]
target = 9
print(two_sum(nums, target))  # [0, 1]`,
    explanation: `Use a hash map to store each number and its index as you iterate.
For every number, check if (target - number) already exists in the map.
If yes — you found the pair. If no — store the current number and move on.
This gives O(n) time instead of the naive O(n²) brute force.`,
    mistakes: [
      'Using nested loops — works but O(n²), way too slow for large inputs',
      'Checking if num == target - num and returning [i, i] — same index used twice',
      'Not handling duplicates correctly in the hash map',
      'Forgetting to return indices, not values',
    ],
    complexity: { time: 'O(n)', space: 'O(n)' },
  },

  'valid parentheses': {
    code: `def is_valid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            # It's a closing bracket
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            # It's an opening bracket
            stack.append(char)
    
    return len(stack) == 0  # stack must be empty at the end


# Examples
print(is_valid("()[]{}"))  # True
print(is_valid("(]"))       # False
print(is_valid("([{}])"))   # True`,
    explanation: `Push every opening bracket onto the stack.
When you see a closing bracket, pop from the stack and check if it matches.
If it doesn't match, or the stack is empty when you try to pop — invalid.
At the end, the stack must be empty (all opened brackets were closed).`,
    mistakes: [
      'Not checking if stack is empty before popping — causes IndexError',
      'Forgetting to check len(stack) == 0 at the end — "(((" would wrongly return True',
      'Using if/elif chains instead of a dict mapping — more error prone',
      'Returning True inside the loop instead of after it',
    ],
    complexity: { time: 'O(n)', space: 'O(n)' },
  },

  'binary search': {
    code: `def search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    
    while left <= right:  # note: <= not <
        mid = left + (right - left) // 2  # avoids integer overflow
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1   # target is in right half
        else:
            right = mid - 1  # target is in left half
    
    return -1  # not found


# Example
nums = [-1, 0, 3, 5, 9, 12]
print(search(nums, 9))   # 4
print(search(nums, 2))   # -1`,
    explanation: `Maintain two pointers — left and right — bounding the search space.
Calculate mid each iteration. If nums[mid] == target, done.
If target is bigger, move left up. If smaller, move right down.
Each step eliminates half the remaining elements — that's why it's O(log n).`,
    mistakes: [
      'Using mid = (left + right) // 2 — can overflow in other languages (use left + (right-left)//2)',
      'Using while left < right — misses the case where left == right and that element is the target',
      'Setting left = mid or right = mid instead of mid+1/mid-1 — causes infinite loops',
      'Not returning -1 at the end for the not-found case',
    ],
    complexity: { time: 'O(log n)', space: 'O(1)' },
  },

  'maximum depth of binary tree': {
    code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def max_depth(root: TreeNode | None) -> int:
    # Base case: empty tree has depth 0
    if root is None:
        return 0
    
    # Recursively get depth of left and right subtrees
    left_depth = max_depth(root.left)
    right_depth = max_depth(root.right)
    
    # Current node adds 1 to the deeper subtree
    return 1 + max(left_depth, right_depth)


# Iterative BFS approach (also valid)
from collections import deque

def max_depth_bfs(root: TreeNode | None) -> int:
    if not root:
        return 0
    
    depth = 0
    queue = deque([root])
    
    while queue:
        depth += 1
        for _ in range(len(queue)):  # process entire level
            node = queue.popleft()
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return depth`,
    explanation: `Recursive DFS: the depth of any node is 1 + max(depth of left, depth of right).
Base case is None — returns 0. This naturally handles leaf nodes (both children None → max(0,0)+1 = 1).
The BFS approach counts levels — increment depth once per level processed.`,
    mistakes: [
      'Forgetting the base case (if root is None: return 0) — causes AttributeError',
      'Using + instead of max() — returns wrong result for unbalanced trees',
      'Off-by-one: returning max(left, right) without the +1 for current node',
      'In BFS: not using range(len(queue)) to isolate levels — counts nodes instead of levels',
    ],
    complexity: { time: 'O(n)', space: 'O(h) recursive stack, O(n) BFS queue' },
  },

  'number of islands': {
    code: `def num_islands(grid: list[list[str]]) -> int:
    if not grid:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    count = 0
    
    def dfs(r, c):
        # Out of bounds or water or already visited
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        
        grid[r][c] = '0'  # mark as visited (sink the island)
        
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)  # sink the entire island
    
    return count


# Example
grid = [
    ["1","1","0","0"],
    ["0","1","0","0"],
    ["0","0","1","0"],
    ["0","0","0","1"],
]
print(num_islands(grid))  # 3`,
    explanation: `Scan every cell. When you find a '1' (land), increment count and DFS to sink all connected land.
Sinking means marking '1' as '0' so you don't count it again.
Each DFS call explores all 4 directions recursively until hitting water or bounds.
The number of DFS calls from the outer loop = number of islands.`,
    mistakes: [
      "Forgetting bounds checking in DFS — causes IndexError",
      "Not marking cells as visited — infinite recursion / infinite loop",
      "Only checking 2 directions instead of all 4",
      "Modifying a copy of grid but checking the original — visited cells reprocessed",
      "Counting the DFS calls instead of the outer loop triggers",
    ],
    complexity: { time: 'O(m × n)', space: 'O(m × n) recursive stack' },
  },

  'merge intervals': {
    code: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    merged = [intervals[0]]  # start with first interval
    
    for start, end in intervals[1:]:
        last_end = merged[-1][1]
        
        if start <= last_end:
            # Overlapping — extend the last interval if needed
            merged[-1][1] = max(last_end, end)
        else:
            # No overlap — add as new interval
            merged.append([start, end])
    
    return merged


# Example
intervals = [[1,3],[2,6],[8,10],[15,18]]
print(merge(intervals))  # [[1,6],[8,10],[15,18]]

# Edge case: contained interval
print(merge([[1,4],[2,3]]))  # [[1,4]]`,
    explanation: `Sort by start time first — this ensures overlapping intervals are adjacent.
Keep a result list. For each interval, check if it overlaps with the last one in result.
Overlap condition: current start <= last end.
If overlap: extend the end (use max in case current is fully contained).
If no overlap: append as-is.`,
    mistakes: [
      'Forgetting to sort first — algorithm breaks without sorted input',
      'Using last_end = end instead of max(last_end, end) — fails for contained intervals like [1,10],[2,3]',
      'Checking start < last_end instead of <= — misses touching intervals like [1,2],[2,3]',
      'Modifying intervals in place while iterating',
    ],
    complexity: { time: 'O(n log n)', space: 'O(n)' },
  },
};

// Generic Python template for unknown problems
export function getGenericSolution(type: string): string {
  const templates: Record<string, string> = {
    array: `def solve(nums: list[int]) -> ...:
    # Two pointer approach
    left, right = 0, len(nums) - 1
    
    while left < right:
        # Process current pair
        current = nums[left] + nums[right]
        
        if current == target:
            return [left, right]
        elif current < target:
            left += 1
        else:
            right -= 1
    
    return -1`,

    tree: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def solve(root: TreeNode | None) -> ...:
    if root is None:
        return base_case
    
    left = solve(root.left)
    right = solve(root.right)
    
    return combine(left, right, root.val)`,

    graph: `from collections import deque

def solve(graph: dict, start: int) -> ...:
    visited = set()
    queue = deque([start])
    visited.add(start)
    
    while queue:
        node = queue.popleft()
        # Process node
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)`,

    matrix: `def solve(grid: list[list[int]]) -> ...:
    rows, cols = len(grid), len(grid[0])
    visited = set()
    
    def dfs(r, c):
        if (r < 0 or r >= rows or c < 0 or c >= cols
                or (r, c) in visited or grid[r][c] == 0):
            return
        visited.add((r, c))
        for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
            dfs(r + dr, c + dc)
    
    result = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1 and (r, c) not in visited:
                result += 1
                dfs(r, c)
    return result`,

    stack: `def solve(s: str) -> bool:
    stack = []
    
    for char in s:
        if is_opening(char):
            stack.append(char)
        else:
            if not stack or not matches(stack[-1], char):
                return False
            stack.pop()
    
    return len(stack) == 0`,

    twopointer: `def solve(nums: list[int], target: int) -> list[int]:
    seen = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    
    return []`,
  };

  return templates[type] || templates['array'];
}

export function fuzzyMatchSolution(text: string): string | null {
  const t = text.toLowerCase();
  for (const key of Object.keys(pythonSolutions)) {
    if (t.includes(key)) return key;
  }
  return null;
}
