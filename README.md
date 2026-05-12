# LeetViz

Paste a LeetCode problem, get an animated step-by-step visualization.

## What it does

- Detects the data structure from the problem text (array, tree, graph, matrix, stack, two pointer)
- Renders an animated visualization with highlighted nodes/cells at each step
- Step through manually or hit play

## Supported visualizations

- Arrays — bar chart with pointer tracking
- Trees — interactive node graph
- Graphs — BFS/DFS with edge highlighting
- Matrix — 2D grid with cell highlighting
- Stack — push/pop animations
- Two Pointer — left/right pointer with hash map view

## Built-in problems

- Two Sum
- Valid Parentheses
- Binary Search
- Maximum Depth of Binary Tree
- Number of Islands
- Merge Intervals

Any other problem text will get a heuristic visualization based on detected type.

## Stack

- React 18 + TypeScript
- Vite
- ReactFlow (node graphs)
- Framer Motion (animations)
- Zustand (state)
- Tailwind CSS

## Run locally

```bash
git clone https://github.com/kids-see-ghosts-23/leetviz
cd leetviz
npm install
npm run dev
```
