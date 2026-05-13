import type { ParsedProblem, Step, VisType } from '../store';

// ─── Heuristic detector (scored, not first-match) ────────────────────────────
const TYPE_SIGNALS: Record<VisType, { patterns: RegExp[]; weight: number }[]> = {
  tree: [
    { patterns: [/binary tree/i, /bst/i, /binary search tree/i], weight: 10 },
    { patterns: [/tree node/i, /treenode/i, /root node/i], weight: 10 },
    { patterns: [/\binorder\b/i, /preorder/i, /postorder/i, /level.?order/i], weight: 10 },
    { patterns: [/\bright child\b/i, /\bleft child\b/i, /parent node/i], weight: 8 },
    { patterns: [/\broot\b.*\btree\b/i, /\btree\b.*\broot\b/i], weight: 6 },
    { patterns: [/\bleaf node/i, /subtree/i], weight: 5 },
    { patterns: [/\bdepth\b.*\btree\b/i, /\bheight\b.*\btree\b/i], weight: 5 },
  ],
  linkedlist: [
    { patterns: [/linked list/i, /linkedlist/i], weight: 10 },
    { patterns: [/\.next\b/i, /next pointer/i, /next node/i], weight: 8 },
    { patterns: [/\bhead\b.*\bnode\b/i, /\bnode\b.*\bhead\b/i], weight: 6 },
    { patterns: [/singly linked/i, /doubly linked/i], weight: 10 },
    { patterns: [/\btail\b.*\bnode\b/i, /reverse.*linked/i], weight: 6 },
  ],
  graph: [
    // Only strong, unambiguous graph signals — "neighbor" alone is NOT enough
    { patterns: [/\bgraph\b/i, /undirected graph/i, /directed graph/i], weight: 10 },
    { patterns: [/\bvertices\b/i, /\badjacency\b/i, /\badjacent node/i], weight: 10 },
    { patterns: [/\bcycle\b.*\bgraph\b/i, /\bconnected component/i, /topological sort/i], weight: 10 },
    { patterns: [/\bedges?\b.*\bnodes?\b/i, /\bnodes?\b.*\bedges?\b/i], weight: 8 },
    { patterns: [/\bpath\b.*\bgraph\b/i, /\bgraph\b.*\bpath\b/i], weight: 7 },
  ],
  matrix: [
    { patterns: [/\bmatrix\b/i, /\bgrid\b/i, /2d array/i], weight: 10 },
    { patterns: [/\bisland[s]?\b/i, /\bflood fill\b/i], weight: 10 },
    { patterns: [/m\s*[x×]\s*n\b/i, /\brows?\b.*\bcols?\b/i, /\bcols?\b.*\brows?\b/i], weight: 8 },
    { patterns: [/\bcell[s]?\b.*\bgrid\b/i, /\bgrid\b.*\bcell/i], weight: 6 },
  ],
  dp: [
    { patterns: [/dynamic programming/i, /\bmemoization\b/i, /\btabulation\b/i], weight: 10 },
    { patterns: [/\bsubproblem[s]?\b/i, /\boptimal substructure\b/i], weight: 10 },
    { patterns: [/\bknapsack\b/i, /\bcoin change\b/i, /\blongest common subsequence\b/i], weight: 10 },
    { patterns: [/\bclimbing stairs\b/i, /\bhouse robber\b/i, /\bedit distance\b/i], weight: 10 },
    { patterns: [/\bnumber of ways\b/i, /\bmin.*cost\b.*\bpath\b/i], weight: 5 },
  ],
  stack: [
    { patterns: [/\bstack\b/i, /\bparenthes/i, /valid.*bracket/i, /bracket.*valid/i], weight: 10 },
    { patterns: [/\bpush\b.*\bpop\b/i, /\bpop\b.*\bpush\b/i], weight: 10 },
    { patterns: [/\bmonotonic stack\b/i, /\bbalanced.*\bparenthes/i], weight: 10 },
    { patterns: [/next greater element/i, /daily temperatures/i], weight: 10 },
  ],
  twopointer: [
    { patterns: [/two.?pointer[s]?/i, /sliding window/i], weight: 10 },
    { patterns: [/\bbinary search\b/i], weight: 10 },
    { patterns: [/\bsorted.*array\b/i, /\barray.*sorted\b/i], weight: 7 },
    { patterns: [/\bsearch.*sorted\b/i, /\bsorted.*search\b/i], weight: 8 },
    { patterns: [/\bO\(log\s*n\)\b/i, /\bbisect\b/i, /\blogn\b/i], weight: 7 },
    { patterns: [/find.*index.*sorted/i, /index.*sorted.*array/i], weight: 8 },
  ],
  hashmap: [
    { patterns: [/hash.?map/i, /hash.?table/i, /hash.?set/i], weight: 10 },
    { patterns: [/\bfrequency\b/i, /\bcount.*occurrence/i, /occurrence.*count/i], weight: 8 },
    { patterns: [/\bduplicate[s]?\b/i, /\banagram\b/i], weight: 6 },
  ],
  array: [],
};

function detectType(text: string): VisType {
  const scores: Partial<Record<VisType, number>> = {};
  const types: VisType[] = ['tree','linkedlist','graph','matrix','dp','stack','twopointer','hashmap'];

  for (const type of types) {
    let score = 0;
    for (const group of TYPE_SIGNALS[type]) {
      for (const pat of group.patterns) {
        if (pat.test(text)) {
          score += group.weight;
          break;
        }
      }
    }
    if (score > 0) scores[type] = score;
  }

  if (Object.keys(scores).length === 0) return 'array';
  return (Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]) as VisType;
}

function detectDifficulty(text: string): 'Easy' | 'Medium' | 'Hard' {
  const t = text.toLowerCase();
  if (/\bhard\b/.test(t)) return 'Hard';
  if (/\bmedium\b/.test(t)) return 'Medium';
  return 'Easy';
}

// ─── Built-in problems ────────────────────────────────────────────────────────
const builtinProblems: Record<string, () => ParsedProblem> = {

  'two sum': () => ({
    title: 'Two Sum',
    difficulty: 'Easy',
    type: 'twopointer',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' }],
    constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', 'Only one valid answer exists'],
    initialData: { nums: [2, 7, 11, 15], target: 9 },
    algorithm: 'Use a hash map to store seen numbers. For each number, check if (target - num) exists in the map.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    tags: ['Array', 'Hash Table'],
    steps: [
      { id: 0, description: 'Initialize empty hash map', highlights: { nums: [] }, message: 'map = {}', pointers: { i: -1 } },
      { id: 1, description: 'i=0: num=2, complement=7 → not in map, store {2:0}', highlights: { nums: ['0'] }, message: 'complement = 9 - 2 = 7 → not found', pointers: { i: 0 } },
      { id: 2, description: 'i=1: num=7, complement=2 → found at index 0!', highlights: { nums: ['0', '1'] }, message: '✓ Found! 9 - 7 = 2 is in map at index 0', pointers: { i: 1 } },
      { id: 3, description: 'Return [0, 1]', highlights: { nums: ['0', '1'] }, message: 'return [0, 1] ✓', pointers: { i: 1 } },
    ],
  }),

  'valid parentheses': () => ({
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    type: 'stack',
    description: 'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid.',
    examples: [{ input: 's = "()[]{}"', output: 'true' }, { input: 's = "(]"', output: 'false' }],
    constraints: ['1 ≤ s.length ≤ 10⁴', 's consists of parentheses only'],
    initialData: { s: '([{}])', stack: [] as string[] },
    algorithm: 'Use a stack. Push open brackets. For close brackets, check if stack top matches.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    tags: ['Stack', 'String'],
    steps: [
      { id: 0, description: 'Start with empty stack', highlights: {}, message: 'stack = []', values: { stack: [], current: '', idx: -1 } },
      { id: 1, description: 'Read "(": open → push', highlights: {}, message: 'push "("', values: { stack: ['('], current: '(', idx: 0 } },
      { id: 2, description: 'Read "[": open → push', highlights: {}, message: 'push "["', values: { stack: ['(', '['], current: '[', idx: 1 } },
      { id: 3, description: 'Read "{": open → push', highlights: {}, message: 'push "{"', values: { stack: ['(', '[', '{'], current: '{', idx: 2 } },
      { id: 4, description: 'Read "}": matches top "{" → pop', highlights: {}, message: 'pop "{" ✓', values: { stack: ['(', '['], current: '}', idx: 3 } },
      { id: 5, description: 'Read "]": matches top "[" → pop', highlights: {}, message: 'pop "[" ✓', values: { stack: ['('], current: ']', idx: 4 } },
      { id: 6, description: 'Read ")": matches top "(" → pop', highlights: {}, message: 'pop "(" ✓', values: { stack: [], current: ')', idx: 5 } },
      { id: 7, description: 'Stack empty → VALID!', highlights: {}, message: 'return true ✓', values: { stack: [], current: '', idx: -1 } },
    ],
  }),

  'binary search': () => ({
    title: 'Binary Search',
    difficulty: 'Easy',
    type: 'array',
    description: 'Given a sorted array of integers and a target, return the index if found, else -1.',
    examples: [{ input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' }],
    constraints: ['1 ≤ nums.length ≤ 10⁴', 'All values unique', 'nums is sorted ascending'],
    initialData: { nums: [-1, 0, 3, 5, 9, 12], target: 9 },
    algorithm: 'Maintain left and right pointers. Check mid each step. Eliminate half the array.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    tags: ['Array', 'Binary Search'],
    steps: [
      { id: 0, description: 'Initialize: left=0, right=5, target=9', highlights: { nums: [] }, pointers: { left: 0, right: 5, mid: -1 }, message: 'left=0, right=5' },
      { id: 1, description: 'mid=2, nums[2]=3 < 9 → move left up', highlights: { nums: ['2'] }, pointers: { left: 0, right: 5, mid: 2 }, message: 'nums[2]=3 < 9 → left = 3' },
      { id: 2, description: 'mid=4, nums[4]=9 = target → found!', highlights: { nums: ['4'] }, pointers: { left: 3, right: 5, mid: 4 }, message: 'nums[4]=9 == 9 ✓' },
      { id: 3, description: 'Return index 4', highlights: { nums: ['4'] }, pointers: { left: 3, right: 5, mid: 4 }, message: 'return 4 ✓' },
    ],
  }),

  'find peak element': () => ({
    title: 'Find Peak Element',
    difficulty: 'Medium',
    type: 'array',
    description: 'A peak element is an element strictly greater than its neighbors. Given an integer array nums, find a peak element and return its index.',
    examples: [{ input: 'nums = [1,2,3,1]', output: '2', explanation: 'nums[2]=3 is a peak' }, { input: 'nums = [1,2,1,3,5,6,4]', output: '5' }],
    constraints: ['1 ≤ nums.length ≤ 1000', 'nums[-1] = nums[n] = -∞'],
    initialData: { nums: [1, 2, 3, 1, 5, 6, 4] },
    algorithm: 'Binary search: if nums[mid] < nums[mid+1], peak is on the right. Otherwise peak is on the left.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    tags: ['Array', 'Binary Search'],
    steps: [
      { id: 0, description: 'Initialize: left=0, right=6', highlights: { nums: [] }, pointers: { left: 0, right: 6, mid: -1 }, message: 'left=0, right=6' },
      { id: 1, description: 'mid=3, nums[3]=1 < nums[4]=5 → peak is right', highlights: { nums: ['3', '4'] }, pointers: { left: 0, right: 6, mid: 3 }, message: 'nums[3] < nums[4] → left = mid+1 = 4' },
      { id: 2, description: 'mid=5, nums[5]=6 > nums[6]=4 → peak is left side', highlights: { nums: ['5', '6'] }, pointers: { left: 4, right: 6, mid: 5 }, message: 'nums[5] > nums[6] → right = mid = 5' },
      { id: 3, description: 'left=right=5, nums[5]=6 is the peak!', highlights: { nums: ['5'] }, pointers: { left: 5, right: 5, mid: 5 }, message: 'return 5 ✓' },
    ],
  }),

  'contains duplicate': () => ({
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    type: 'hashmap',
    description: 'Given an integer array nums, return true if any value appears at least twice, and false if every element is distinct.',
    examples: [{ input: 'nums = [1,2,3,1]', output: 'true' }, { input: 'nums = [1,2,3,4]', output: 'false' }],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁹ ≤ nums[i] ≤ 10⁹'],
    initialData: { nums: [1, 2, 3, 1, 4] },
    algorithm: 'Use a hash set. For each number, check if it already exists in the set. If yes — duplicate found.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    tags: ['Array', 'Hash Table', 'Sorting'],
    steps: [
      { id: 0, description: 'Initialize empty set', highlights: { nums: [] }, message: 'seen = set()', pointers: { i: -1 } },
      { id: 1, description: 'i=0: 1 not in set → add', highlights: { nums: ['0'] }, message: 'seen = {1}', pointers: { i: 0 } },
      { id: 2, description: 'i=1: 2 not in set → add', highlights: { nums: ['1'] }, message: 'seen = {1,2}', pointers: { i: 1 } },
      { id: 3, description: 'i=2: 3 not in set → add', highlights: { nums: ['2'] }, message: 'seen = {1,2,3}', pointers: { i: 2 } },
      { id: 4, description: 'i=3: 1 IS in set → duplicate found!', highlights: { nums: ['0', '3'] }, message: 'return True ✓', pointers: { i: 3 } },
    ],
  }),

  'best time to buy and sell stock': () => ({
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    type: 'array',
    description: 'Given an array prices where prices[i] is the price on day i, maximize profit by choosing a single day to buy and a later day to sell.',
    examples: [{ input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price=1), sell on day 5 (price=6)' }],
    constraints: ['1 ≤ prices.length ≤ 10⁵', '0 ≤ prices[i] ≤ 10⁴'],
    initialData: { nums: [7, 1, 5, 3, 6, 4] },
    algorithm: 'Track the minimum price seen so far. At each day, compute profit = price - min_price. Track max profit.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    tags: ['Array', 'Dynamic Programming'],
    steps: [
      { id: 0, description: 'Start: min_price=7, max_profit=0', highlights: { nums: [] }, pointers: { left: 0, right: -1 }, message: 'min_price=7, max_profit=0' },
      { id: 1, description: 'price=1 < min_price → new min', highlights: { nums: ['1'] }, pointers: { left: 1, right: -1 }, message: 'min_price=1' },
      { id: 2, description: 'price=5, profit=5-1=4 → new max', highlights: { nums: ['1', '2'] }, pointers: { left: 1, right: 2 }, message: 'profit=4, max_profit=4' },
      { id: 3, description: 'price=3, profit=3-1=2 < 4, no update', highlights: { nums: ['3'] }, pointers: { left: 1, right: 3 }, message: 'profit=2 < 4, skip' },
      { id: 4, description: 'price=6, profit=6-1=5 → new max!', highlights: { nums: ['1', '4'] }, pointers: { left: 1, right: 4 }, message: 'profit=5, max_profit=5 ✓' },
      { id: 5, description: 'price=4, profit=3 < 5, done. Answer=5', highlights: { nums: ['1', '4'] }, pointers: { left: 1, right: 5 }, message: 'return 5 ✓' },
    ],
  }),

  'maximum subarray': () => ({
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    type: 'array',
    description: "Given an integer array nums, find the subarray with the largest sum and return its sum.",
    examples: [{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'Subarray [4,-1,2,1] has sum 6' }],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁴ ≤ nums[i] ≤ 10⁴'],
    initialData: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
    algorithm: "Kadane's algorithm: keep a running sum. If it drops below 0, reset to 0. Track max sum seen.",
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    tags: ['Array', 'Dynamic Programming', "Kadane's"],
    steps: [
      { id: 0, description: 'Start: current=0, max=-inf', highlights: { nums: [] }, pointers: { i: -1 }, message: 'current_sum=0, max_sum=-inf' },
      { id: 1, description: 'i=0: -2 → current=-2 < 0, reset to 0', highlights: { nums: ['0'] }, pointers: { i: 0 }, message: 'current=0 (reset), max=-2' },
      { id: 2, description: 'i=1: +1 → current=1', highlights: { nums: ['1'] }, pointers: { i: 1 }, message: 'current=1, max=1' },
      { id: 3, description: 'i=2: -3 → current=-2 < 0, reset to 0', highlights: { nums: ['2'] }, pointers: { i: 2 }, message: 'current=0 (reset), max=1' },
      { id: 4, description: 'i=3: +4 → current=4', highlights: { nums: ['3'] }, pointers: { i: 3 }, message: 'current=4, max=4' },
      { id: 5, description: 'i=4: -1 → current=3', highlights: { nums: ['3', '4'] }, pointers: { i: 4 }, message: 'current=3, max=4' },
      { id: 6, description: 'i=5: +2 → current=5', highlights: { nums: ['3', '4', '5'] }, pointers: { i: 5 }, message: 'current=5, max=5' },
      { id: 7, description: 'i=6: +1 → current=6, new max!', highlights: { nums: ['3', '4', '5', '6'] }, pointers: { i: 6 }, message: 'current=6, max=6 ✓' },
      { id: 8, description: 'Answer is 6 from subarray [4,-1,2,1]', highlights: { nums: ['3', '4', '5', '6'] }, pointers: { i: 6 }, message: 'return 6 ✓' },
    ],
  }),

  'maximum depth of binary tree': () => ({
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    type: 'tree',
    description: 'Given the root of a binary tree, return its maximum depth.',
    examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: '3' }],
    constraints: ['0 ≤ nodes ≤ 10⁴', '-100 ≤ Node.val ≤ 100'],
    initialData: {
      tree: {
        val: 3, id: '1',
        left: { val: 9, id: '2', left: null, right: null },
        right: { val: 20, id: '3', left: { val: 15, id: '4', left: null, right: null }, right: { val: 7, id: '5', left: null, right: null } }
      }
    },
    algorithm: 'Recursively: maxDepth(node) = 1 + max(maxDepth(left), maxDepth(right)). Base case: None → 0.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    tags: ['Tree', 'DFS', 'BFS'],
    steps: [
      { id: 0, description: 'Visit root (3)', highlights: { tree: ['1'] }, message: 'maxDepth(3)' },
      { id: 1, description: 'Recurse left → node 9', highlights: { tree: ['1', '2'] }, message: 'maxDepth(9)' },
      { id: 2, description: 'Node 9 is a leaf → return 1', highlights: { tree: ['2'] }, message: 'return 1' },
      { id: 3, description: 'Recurse right → node 20', highlights: { tree: ['1', '3'] }, message: 'maxDepth(20)' },
      { id: 4, description: 'Node 15 is a leaf → return 1', highlights: { tree: ['3', '4'] }, message: 'maxDepth(15) = 1' },
      { id: 5, description: 'Node 7 is a leaf → return 1', highlights: { tree: ['3', '5'] }, message: 'maxDepth(7) = 1' },
      { id: 6, description: 'Node 20: max(1,1)+1 = 2', highlights: { tree: ['3'] }, message: 'return 2' },
      { id: 7, description: 'Root: max(1,2)+1 = 3 ✓', highlights: { tree: ['1', '3', '4', '5'] }, message: 'return 3 ✓' },
    ],
  }),

  'number of islands': () => ({
    title: 'Number of Islands',
    difficulty: 'Medium',
    type: 'matrix',
    description: "Given an m x n grid of '1's (land) and '0's (water), return the number of islands.",
    examples: [{ input: 'grid = [["1","1","0"],["0","1","0"],["0","0","1"]]', output: '2' }],
    constraints: ['m == grid.length', 'n == grid[i].length', 'grid[i][j] is "0" or "1"'],
    initialData: { matrix: [[1,1,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]] },
    algorithm: 'DFS from each unvisited land cell. Sink (mark 0) all connected land. Count DFS starts.',
    timeComplexity: 'O(m × n)',
    spaceComplexity: 'O(m × n)',
    tags: ['Array', 'DFS', 'BFS', 'Matrix'],
    steps: [
      { id: 0, description: 'Scan grid, land at (0,0)', highlights: { matrix: ['0,0'] }, message: 'islands=0, DFS from (0,0)' },
      { id: 1, description: 'DFS sinks (0,0),(0,1),(1,1)', highlights: { matrix: ['0,0', '0,1', '1,1'] }, message: 'island 1 sunk' },
      { id: 2, description: 'Island 1 done. Count = 1', highlights: { matrix: ['0,0', '0,1', '1,1'] }, message: 'islands = 1' },
      { id: 3, description: 'Found land at (2,2)', highlights: { matrix: ['2,2'] }, message: 'DFS from (2,2)' },
      { id: 4, description: 'Island 2. Count = 2', highlights: { matrix: ['2,2'] }, message: 'islands = 2' },
      { id: 5, description: 'Found land at (3,3)', highlights: { matrix: ['3,3'] }, message: 'DFS from (3,3)' },
      { id: 6, description: 'Island 3. Final = 3 ✓', highlights: { matrix: ['3,3'] }, message: 'return 3 ✓' },
    ],
  }),

  'merge intervals': () => ({
    title: 'Merge Intervals',
    difficulty: 'Medium',
    type: 'array',
    description: 'Given an array of intervals, merge all overlapping intervals.',
    examples: [{ input: '[[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' }],
    constraints: ['1 ≤ intervals.length ≤ 10⁴'],
    initialData: { intervals: [[1,3],[2,6],[8,10],[15,18]] },
    algorithm: 'Sort by start. For each interval, if overlaps last in result — extend end. Else append.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    tags: ['Array', 'Sorting'],
    steps: [
      { id: 0, description: 'Sort intervals by start', highlights: { nums: [] }, message: '[[1,3],[2,6],[8,10],[15,18]]' },
      { id: 1, description: 'Add [1,3]', highlights: { nums: ['0'] }, message: 'result = [[1,3]]' },
      { id: 2, description: '[2,6] overlaps [1,3] → merge to [1,6]', highlights: { nums: ['0','1'] }, message: 'result = [[1,6]]' },
      { id: 3, description: '[8,10] no overlap → append', highlights: { nums: ['2'] }, message: 'result = [[1,6],[8,10]]' },
      { id: 4, description: '[15,18] no overlap → append', highlights: { nums: ['3'] }, message: 'result = [[1,6],[8,10],[15,18]] ✓' },
    ],
  }),
};

// ─── Fuzzy match ──────────────────────────────────────────────────────────────
function fuzzyMatch(input: string): string | null {
  const t = input.toLowerCase().trim();
  for (const key of Object.keys(builtinProblems)) {
    if (t === key) return key;
  }
  for (const key of Object.keys(builtinProblems)) {
    if (t.includes(key)) return key;
  }
  for (const key of Object.keys(builtinProblems)) {
    const words = key.split(' ').filter(w => w.length > 3);
    if (words.length > 1 && words.every(w => t.includes(w))) return key;
  }
  return null;
}

// ─── Generic fallback ─────────────────────────────────────────────────────────
function generateGeneric(text: string): ParsedProblem {
  const type = detectType(text);
  const difficulty = detectDifficulty(text);
  const lines = text.split('\n').filter(l => l.trim());
  const title = lines[0]?.slice(0, 60) || 'Custom Problem';

  const baseData: Record<string, unknown> = {};
  const steps: Step[] = [];

  if (type === 'array' || type === 'twopointer' || type === 'hashmap') {
    baseData.nums = [1, 3, 5, 7, 9, 11, 13];
    steps.push(
      { id: 0, description: 'Initialize', highlights: { nums: [] }, pointers: { left: 0, right: 6 }, message: 'left=0, right=6' },
      { id: 1, description: 'Process left element', highlights: { nums: ['0'] }, pointers: { left: 0, right: 6 }, message: 'nums[0] = 1' },
      { id: 2, description: 'Move pointers inward', highlights: { nums: ['1', '5'] }, pointers: { left: 1, right: 5 }, message: 'left++, right--' },
      { id: 3, description: 'Converging', highlights: { nums: ['2', '4'] }, pointers: { left: 2, right: 4 }, message: 'left++, right--' },
      { id: 4, description: 'Done!', highlights: { nums: ['3'] }, pointers: { left: 3, right: 3 }, message: 'left >= right → stop ✓' },
    );
  } else if (type === 'tree') {
    baseData.tree = {
      val: 1, id: 'n1',
      left: { val: 2, id: 'n2', left: { val: 4, id: 'n4', left: null, right: null }, right: { val: 5, id: 'n5', left: null, right: null } },
      right: { val: 3, id: 'n3', left: null, right: { val: 6, id: 'n6', left: null, right: null } }
    };
    steps.push(
      { id: 0, description: 'Visit root', highlights: { tree: ['n1'] }, message: 'visit(1)' },
      { id: 1, description: 'Go left', highlights: { tree: ['n1','n2'] }, message: 'visit(2)' },
      { id: 2, description: 'Visit leaf 4', highlights: { tree: ['n4'] }, message: 'visit(4)' },
      { id: 3, description: 'Visit leaf 5', highlights: { tree: ['n5'] }, message: 'visit(5)' },
      { id: 4, description: 'Go right', highlights: { tree: ['n1','n3'] }, message: 'visit(3)' },
      { id: 5, description: 'Visit leaf 6', highlights: { tree: ['n6'] }, message: 'visit(6) ✓' },
    );
  } else if (type === 'graph') {
    baseData.graph = {
      nodes: [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
      edges: [['0','1'],['0','2'],['1','3'],['2','4'],['3','4']]
    };
    steps.push(
      { id: 0, description: 'BFS from node 0', highlights: { graph: ['0'] }, message: 'queue=[0]' },
      { id: 1, description: 'Visit 1 and 2', highlights: { graph: ['0','1','2'] }, message: 'queue=[1,2]' },
      { id: 2, description: 'Visit 3', highlights: { graph: ['1','3'] }, message: 'queue=[2,3]' },
      { id: 3, description: 'Visit 4', highlights: { graph: ['2','4'] }, message: 'queue=[3,4]' },
      { id: 4, description: 'BFS complete', highlights: { graph: ['3','4'] }, message: 'done ✓' },
    );
  } else if (type === 'matrix' || type === 'dp') {
    baseData.matrix = [[0,1,0,1],[1,1,0,0],[0,0,1,1],[1,0,0,1]];
    steps.push(
      { id: 0, description: 'Scan matrix', highlights: { matrix: ['0,0'] }, message: 'i=0, j=0' },
      { id: 1, description: 'Found target cell', highlights: { matrix: ['0,1'] }, message: 'process (0,1)' },
      { id: 2, description: 'Explore neighbors', highlights: { matrix: ['0,1','1,1'] }, message: 'DFS' },
      { id: 3, description: 'Continue', highlights: { matrix: ['1,0','1,1'] }, message: 'visiting cells' },
      { id: 4, description: 'Done', highlights: { matrix: ['0,1','1,0','1,1'] }, message: 'done ✓' },
    );
  } else {
    baseData.nums = [3, 1, 4, 1, 5, 9, 2, 6];
    steps.push(
      { id: 0, description: 'Initial state', highlights: { nums: [] }, message: 'begin' },
      { id: 1, description: 'Process elements', highlights: { nums: ['0'] }, message: 'nums[0]=3' },
      { id: 2, description: 'Continue', highlights: { nums: ['1','2','3'] }, message: 'processing...' },
      { id: 3, description: 'Complete', highlights: { nums: ['0','1','2','3','4','5','6','7'] }, message: 'done ✓' },
    );
  }

  return {
    title,
    difficulty,
    type,
    description: text.slice(0, 300),
    examples: [],
    constraints: [],
    initialData: baseData,
    steps,
    algorithm: `Detected type: ${type.toUpperCase()}. Sample visualization shown.`,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    tags: [type.charAt(0).toUpperCase() + type.slice(1)],
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function parseProblem(text: string): ParsedProblem {
  const match = fuzzyMatch(text);
  if (match) return builtinProblems[match]();
  return generateGeneric(text);
}

export { builtinProblems };
export type { Step };
