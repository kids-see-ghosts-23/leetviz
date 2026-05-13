import type { ParsedProblem, Step, VisType } from '../store';

// ─── Heuristic detector (scored, not first-match) ────────────────────────────
const TYPE_SIGNALS: Record<VisType, { patterns: RegExp[]; weight: number }[]> = {
  tree: [
    { patterns: [/binary tree/i, /bst/i, /binary search tree/i], weight: 10 },
    { patterns: [/tree node/i, /treenode/i, /root node/i], weight: 8 },
    { patterns: [/\binorder\b/i, /preorder/i, /postorder/i, /level.?order/i], weight: 8 },
    { patterns: [/\bright child\b/i, /\bleft child\b/i, /parent node/i], weight: 6 },
    { patterns: [/\broot\b/i, /\bleaf\b/i, /subtree/i], weight: 4 },
    { patterns: [/\bdepth\b/i, /\bheight\b/i, /\bdiameter\b/i], weight: 3 },
  ],
  linkedlist: [
    { patterns: [/linked list/i, /linkedlist/i], weight: 10 },
    { patterns: [/\.next\b/i, /next pointer/i, /next node/i], weight: 8 },
    { patterns: [/\bhead\b.*\bnode\b/i, /\bnode\b.*\bhead\b/i], weight: 6 },
    { patterns: [/singly linked/i, /doubly linked/i], weight: 10 },
    { patterns: [/\btail\b/i, /reverse.*list/i], weight: 4 },
  ],
  graph: [
    { patterns: [/\bgraph\b/i, /undirected graph/i, /directed graph/i], weight: 10 },
    { patterns: [/\bvertices\b/i, /\bedges\b/i, /adjacen/i], weight: 8 },
    { patterns: [/\bcycle\b/i, /\bconnected component/i, /topological/i], weight: 8 },
    { patterns: [/\bneighbor[s]?\b/i, /\bpath between\b/i], weight: 5 },
  ],
  matrix: [
    { patterns: [/\bmatrix\b/i, /\bgrid\b/i, /2d array/i], weight: 10 },
    { patterns: [/\bisland[s]?\b/i, /\bflood fill\b/i], weight: 8 },
    { patterns: [/m\s*[x×]\s*n\b/i, /\brows?\b.*\bcols?\b/i, /\bcols?\b.*\brows?\b/i], weight: 6 },
    { patterns: [/\bcell[s]?\b/i, /grid\[/i], weight: 4 },
  ],
  dp: [
    { patterns: [/dynamic programming/i, /\bmemoization\b/i, /\btabulation\b/i], weight: 10 },
    { patterns: [/\bsubproblem[s]?\b/i, /\boptimal substructure\b/i], weight: 8 },
    { patterns: [/\bknapsack\b/i, /\bcoin change\b/i, /\blongest common\b/i], weight: 8 },
    { patterns: [/\bmin cost\b/i, /\bmax profit\b/i, /\bnumber of ways\b/i], weight: 4 },
  ],
  stack: [
    { patterns: [/\bstack\b/i, /\bparenthes/i, /valid.*bracket/i, /bracket.*valid/i], weight: 10 },
    { patterns: [/\bpush\b.*\bpop\b/i, /\bpop\b.*\bpush\b/i], weight: 8 },
    { patterns: [/\bmonotonic stack\b/i, /\bbalanced.*\bparenthes/i], weight: 8 },
    { patterns: [/\b\(\)|\[\]|\{\}/], weight: 5 },
  ],
  twopointer: [
    { patterns: [/two.?pointer[s]?/i, /sliding window/i], weight: 10 },
    { patterns: [/\bsorted array\b/i, /\bbinary search\b/i], weight: 8 },
    { patterns: [/left.*right pointer/i, /\bleft\b.*\bright\b.*pointer/i], weight: 7 },
    { patterns: [/\bsearch\b.*\bsorted\b/i, /\bsorted\b.*\bsearch\b/i], weight: 6 },
    { patterns: [/log\s*n/i, /\bbisect\b/i], weight: 5 },
  ],
  hashmap: [
    { patterns: [/hash.?map/i, /hash.?table/i, /hash.?set/i], weight: 10 },
    { patterns: [/\bfrequency\b/i, /\bcount.*occurrence/i, /occurrence.*count/i], weight: 7 },
    { patterns: [/\bdictionary\b/i, /\blookup\b/i, /\bcache\b/i], weight: 5 },
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
          break; // only count each group once
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
      { id: 1, description: 'i=0: num=2, need=7. 7 not in map → store {2:0}', highlights: { nums: ['0'] }, message: 'complement = 9 - 2 = 7 → not found', pointers: { i: 0 } },
      { id: 2, description: 'i=1: num=7, need=2. 2 IS in map at index 0!', highlights: { nums: ['0', '1'] }, message: '✓ Found! complement = 9 - 7 = 2 → found at index 0', pointers: { i: 1 } },
      { id: 3, description: 'Return [0, 1] — the answer!', highlights: { nums: ['0', '1'] }, message: 'return [0, 1]', pointers: { i: 1 } },
    ],
  }),

  'valid parentheses': () => ({
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    type: 'stack',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    examples: [{ input: 's = "()[]{}"', output: 'true' }, { input: 's = "(]"', output: 'false' }],
    constraints: ['1 ≤ s.length ≤ 10⁴', 's consists of parentheses only'],
    initialData: { s: '([{}])', stack: [] as string[] },
    algorithm: 'Use a stack. Push open brackets. For close brackets, check if stack top matches.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    tags: ['Stack', 'String'],
    steps: [
      { id: 0, description: 'Start with empty stack, s = "([{}])"', highlights: {}, message: 'stack = []', values: { stack: [], current: '', idx: -1 } },
      { id: 1, description: 'Read "(": open bracket → push to stack', highlights: {}, message: 'push "("', values: { stack: ['('], current: '(', idx: 0 } },
      { id: 2, description: 'Read "[": open bracket → push to stack', highlights: {}, message: 'push "["', values: { stack: ['(', '['], current: '[', idx: 1 } },
      { id: 3, description: 'Read "{": open bracket → push to stack', highlights: {}, message: 'push "{"', values: { stack: ['(', '[', '{'], current: '{', idx: 2 } },
      { id: 4, description: 'Read "}": matches top "{" → pop!', highlights: {}, message: 'pop "{" ✓', values: { stack: ['(', '['], current: '}', idx: 3 } },
      { id: 5, description: 'Read "]": matches top "[" → pop!', highlights: {}, message: 'pop "[" ✓', values: { stack: ['('], current: ']', idx: 4 } },
      { id: 6, description: 'Read ")": matches top "(" → pop!', highlights: {}, message: 'pop "(" ✓', values: { stack: [], current: ')', idx: 5 } },
      { id: 7, description: 'Stack is empty → string is VALID!', highlights: {}, message: 'return true ✓', values: { stack: [], current: '', idx: -1 } },
    ],
  }),

  'binary search': () => ({
    title: 'Binary Search',
    difficulty: 'Easy',
    type: 'array',
    description: 'Given a sorted array of n integers and a target value, return the index if the target is found. If not, return -1.',
    examples: [{ input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' }],
    constraints: ['1 ≤ nums.length ≤ 10⁴', 'All values are unique', 'nums is sorted'],
    initialData: { nums: [-1, 0, 3, 5, 9, 12], target: 9 },
    algorithm: 'Maintain left and right pointers. Check middle element. Eliminate half the array each iteration.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    tags: ['Array', 'Binary Search'],
    steps: [
      { id: 0, description: 'Initialize left=0, right=5, target=9', highlights: { nums: [] }, pointers: { left: 0, right: 5, mid: -1 }, message: 'left=0, right=5' },
      { id: 1, description: 'mid = (0+5)/2 = 2 → nums[2]=3 < 9 → search right', highlights: { nums: ['2'] }, pointers: { left: 0, right: 5, mid: 2 }, message: 'mid=2, nums[2]=3 < 9 → left = mid+1' },
      { id: 2, description: 'left=3, mid = (3+5)/2 = 4 → nums[4]=9 = target!', highlights: { nums: ['4'] }, pointers: { left: 3, right: 5, mid: 4 }, message: 'mid=4, nums[4]=9 == target! ✓' },
      { id: 3, description: 'Found at index 4! Return 4', highlights: { nums: ['4'] }, pointers: { left: 3, right: 5, mid: 4 }, message: 'return 4 ✓' },
    ],
  }),

  'maximum depth of binary tree': () => ({
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    type: 'tree',
    description: 'Given the root of a binary tree, return its maximum depth. A binary tree\'s maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
    examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: '3' }],
    constraints: ['0 ≤ nodes ≤ 10⁴', '-100 ≤ Node.val ≤ 100'],
    initialData: {
      tree: {
        val: 3, id: '1',
        left: { val: 9, id: '2', left: null, right: null },
        right: {
          val: 20, id: '3',
          left: { val: 15, id: '4', left: null, right: null },
          right: { val: 7, id: '5', left: null, right: null }
        }
      }
    },
    algorithm: 'Recursively compute depth. maxDepth(node) = 1 + max(maxDepth(left), maxDepth(right))',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) where h = height',
    tags: ['Tree', 'DFS', 'BFS', 'Recursion'],
    steps: [
      { id: 0, description: 'Start at root (3)', highlights: { tree: ['1'] }, message: 'maxDepth(3)' },
      { id: 1, description: 'Go left to node 9', highlights: { tree: ['1', '2'] }, message: 'maxDepth(9)' },
      { id: 2, description: 'Node 9 has no children → depth = 1', highlights: { tree: ['2'] }, message: 'return 1 (leaf)' },
      { id: 3, description: 'Go right to node 20', highlights: { tree: ['1', '3'] }, message: 'maxDepth(20)' },
      { id: 4, description: 'Go left to node 15 → leaf → depth = 1', highlights: { tree: ['3', '4'] }, message: 'maxDepth(15) = 1' },
      { id: 5, description: 'Go right to node 7 → leaf → depth = 1', highlights: { tree: ['3', '5'] }, message: 'maxDepth(7) = 1' },
      { id: 6, description: 'Node 20: max(1,1)+1 = 2', highlights: { tree: ['3'] }, message: 'return 2' },
      { id: 7, description: 'Root: max(1,2)+1 = 3. Answer = 3!', highlights: { tree: ['1', '3', '4', '5'] }, message: 'return 3 ✓' },
    ],
  }),

  'number of islands': () => ({
    title: 'Number of Islands',
    difficulty: 'Medium',
    type: 'matrix',
    description: 'Given an m x n 2D binary grid representing a map of \'1\'s (land) and \'0\'s (water), return the number of islands.',
    examples: [{ input: 'grid = [["1","1","0"],["0","1","0"],["0","0","1"]]', output: '2' }],
    constraints: ['m == grid.length', 'n == grid[i].length', 'grid[i][j] is "0" or "1"'],
    initialData: {
      matrix: [
        [1, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ]
    },
    algorithm: 'DFS/BFS from each unvisited land cell. Mark all connected cells as visited. Count DFS calls.',
    timeComplexity: 'O(m × n)',
    spaceComplexity: 'O(m × n)',
    tags: ['Array', 'DFS', 'BFS', 'Union Find', 'Matrix'],
    steps: [
      { id: 0, description: 'Scan grid, find first unvisited land at (0,0)', highlights: { matrix: ['0,0'] }, message: 'islands = 0, start DFS from (0,0)' },
      { id: 1, description: 'DFS: mark (0,0) visited, explore neighbors', highlights: { matrix: ['0,0', '0,1', '1,1'] }, message: 'DFS: (0,0)→(0,1)→(1,1)' },
      { id: 2, description: 'Island 1 fully explored! Count = 1', highlights: { matrix: ['0,0', '0,1', '1,1'] }, message: 'islands = 1 ✓' },
      { id: 3, description: 'Continue scan, find land at (2,2)', highlights: { matrix: ['2,2'] }, message: 'start DFS from (2,2)' },
      { id: 4, description: 'Island 2 explored! Count = 2', highlights: { matrix: ['2,2'] }, message: 'islands = 2 ✓' },
      { id: 5, description: 'Continue scan, find land at (3,3)', highlights: { matrix: ['3,3'] }, message: 'start DFS from (3,3)' },
      { id: 6, description: 'Island 3 explored! Final count = 3', highlights: { matrix: ['3,3'] }, message: 'return 3 ✓' },
    ],
  }),

  'merge intervals': () => ({
    title: 'Merge Intervals',
    difficulty: 'Medium',
    type: 'array',
    description: 'Given an array of intervals, merge all overlapping intervals, and return an array of the non-overlapping intervals.',
    examples: [{ input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: '[1,3] and [2,6] overlap → merge to [1,6]' }],
    constraints: ['1 ≤ intervals.length ≤ 10⁴', 'intervals[i].length == 2'],
    initialData: { intervals: [[1, 3], [2, 6], [8, 10], [15, 18]] },
    algorithm: 'Sort by start. For each interval, if it overlaps with last merged, extend it. Otherwise add new.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    tags: ['Array', 'Sorting'],
    steps: [
      { id: 0, description: 'Sort intervals by start time', highlights: { nums: [] }, message: 'intervals = [[1,3],[2,6],[8,10],[15,18]]' },
      { id: 1, description: 'Add [1,3] to result', highlights: { nums: ['0'] }, message: 'result = [[1,3]]' },
      { id: 2, description: '[2,6] overlaps [1,3] (2 ≤ 3) → merge to [1,6]', highlights: { nums: ['0', '1'] }, message: 'result = [[1,6]] (merged)' },
      { id: 3, description: '[8,10] does NOT overlap [1,6] → add new', highlights: { nums: ['2'] }, message: 'result = [[1,6],[8,10]]' },
      { id: 4, description: '[15,18] does NOT overlap [8,10] → add new', highlights: { nums: ['3'] }, message: 'result = [[1,6],[8,10],[15,18]] ✓' },
    ],
  }),
};

// ─── Fuzzy match ──────────────────────────────────────────────────────────────
function fuzzyMatch(input: string): string | null {
  const t = input.toLowerCase().trim();
  // 1. Exact key match
  for (const key of Object.keys(builtinProblems)) {
    if (t === key) return key;
  }
  // 2. Input contains the full key phrase
  for (const key of Object.keys(builtinProblems)) {
    if (t.includes(key)) return key;
  }
  // 3. All meaningful words of key appear somewhere in input
  for (const key of Object.keys(builtinProblems)) {
    const words = key.split(' ').filter(w => w.length > 3);
    if (words.length > 1 && words.every(w => t.includes(w))) return key;
  }
  return null;
}

// ─── Generic fallback generator ───────────────────────────────────────────────
function generateGeneric(text: string): ParsedProblem {
  const type = detectType(text);
  const difficulty = detectDifficulty(text);
  const lines = text.split('\n').filter(l => l.trim());
  const title = lines[0]?.slice(0, 60) || 'Custom Problem';

  const baseData: Record<string, unknown> = {};
  const steps: Step[] = [];

  if (type === 'array' || type === 'twopointer') {
    baseData.nums = [1, 3, 5, 7, 9, 11, 13];
    steps.push(
      { id: 0, description: 'Initialize pointers', highlights: { nums: [] }, pointers: { left: 0, right: 6 }, message: 'left=0, right=6' },
      { id: 1, description: 'Check left element', highlights: { nums: ['0'] }, pointers: { left: 0, right: 6 }, message: 'examining nums[0] = 1' },
      { id: 2, description: 'Move pointer inward', highlights: { nums: ['1', '5'] }, pointers: { left: 1, right: 5 }, message: 'left++, right--' },
      { id: 3, description: 'Converging...', highlights: { nums: ['2', '4'] }, pointers: { left: 2, right: 4 }, message: 'left++, right--' },
      { id: 4, description: 'Pointers meet — done!', highlights: { nums: ['3'] }, pointers: { left: 3, right: 3 }, message: 'left >= right → stop' },
    );
  } else if (type === 'tree') {
    baseData.tree = {
      val: 1, id: 'n1',
      left: { val: 2, id: 'n2', left: { val: 4, id: 'n4', left: null, right: null }, right: { val: 5, id: 'n5', left: null, right: null } },
      right: { val: 3, id: 'n3', left: null, right: { val: 6, id: 'n6', left: null, right: null } }
    };
    steps.push(
      { id: 0, description: 'Visit root node 1', highlights: { tree: ['n1'] }, message: 'visit(1)' },
      { id: 1, description: 'Traverse left subtree', highlights: { tree: ['n1', 'n2'] }, message: 'visit(2)' },
      { id: 2, description: 'Visit left-left leaf', highlights: { tree: ['n4'] }, message: 'visit(4) → leaf' },
      { id: 3, description: 'Visit left-right leaf', highlights: { tree: ['n5'] }, message: 'visit(5) → leaf' },
      { id: 4, description: 'Traverse right subtree', highlights: { tree: ['n1', 'n3'] }, message: 'visit(3)' },
      { id: 5, description: 'Visit right-right leaf', highlights: { tree: ['n6'] }, message: 'visit(6) → leaf' },
    );
  } else if (type === 'graph') {
    baseData.graph = {
      nodes: [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
      edges: [['0', '1'], ['0', '2'], ['1', '3'], ['2', '4'], ['3', '4']]
    };
    steps.push(
      { id: 0, description: 'Start BFS from node 0', highlights: { graph: ['0'] }, message: 'queue = [0], visited = {0}' },
      { id: 1, description: 'Visit neighbors of 0: [1,2]', highlights: { graph: ['0', '1', '2'] }, message: 'queue = [1,2]' },
      { id: 2, description: 'Visit node 1, add neighbor 3', highlights: { graph: ['1', '3'] }, message: 'queue = [2,3]' },
      { id: 3, description: 'Visit node 2, add neighbor 4', highlights: { graph: ['2', '4'] }, message: 'queue = [3,4]' },
      { id: 4, description: 'Visit 3 and 4 — BFS complete!', highlights: { graph: ['3', '4'] }, message: 'queue = [] → done ✓' },
    );
  } else if (type === 'matrix') {
    baseData.matrix = [[0,1,0,1],[1,1,0,0],[0,0,1,1],[1,0,0,1]];
    steps.push(
      { id: 0, description: 'Start scanning matrix', highlights: { matrix: ['0,0'] }, message: 'i=0, j=0' },
      { id: 1, description: 'Found target cell', highlights: { matrix: ['0,1'] }, message: 'process cell (0,1)' },
      { id: 2, description: 'Explore neighbors', highlights: { matrix: ['0,1', '1,1'] }, message: 'DFS from (0,1)' },
      { id: 3, description: 'Continue traversal', highlights: { matrix: ['1,0', '1,1'] }, message: 'visiting connected cells' },
      { id: 4, description: 'Traversal complete', highlights: { matrix: ['0,1', '1,0', '1,1'] }, message: 'done ✓' },
    );
  } else {
    baseData.nums = [3, 1, 4, 1, 5, 9, 2, 6];
    steps.push(
      { id: 0, description: 'Initial state', highlights: { nums: [] }, message: 'begin algorithm' },
      { id: 1, description: 'Process first element', highlights: { nums: ['0'] }, message: 'process nums[0] = 3' },
      { id: 2, description: 'Process elements', highlights: { nums: ['1', '2', '3'] }, message: 'processing...' },
      { id: 3, description: 'Algorithm complete', highlights: { nums: ['0', '1', '2', '3', '4', '5', '6', '7'] }, message: 'done ✓' },
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
    algorithm: `Detected problem type: ${type.toUpperCase()}. Visualization generated with sample data.`,
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
