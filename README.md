# ⚡ LeetViz — Algorithm Visualizer

> Paste any LeetCode problem → watch it come alive.

A cyberpunk-themed, step-by-step algorithm visualizer. Paste a LeetCode problem statement and get an instant animated visualization with node graphs, array bars, matrix grids, stack animations and more.

![LeetViz Preview](https://img.shields.io/badge/LeetViz-Algorithm%20Visualizer-00d4ff?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJMMiA3bDEwIDUgMTAtNS0xMC01ek0yIDE3bDEwIDUgMTAtNS0xMC01LTEwIDV6TTIgMTJsMTAgNSAxMC01LTEwLTUtMTAgNXoiLz48L3N2Zz4=)

## ✨ Features

- 🧠 **AI Problem Parser** — paste any problem description, auto-detects data structure
- 🌳 **Tree Visualizer** — interactive node graph with ReactFlow
- 📊 **Array/Bar Chart** — animated bars with pointer tracking
- 🕸️ **Graph Visualizer** — BFS/DFS with highlighted edges  
- 📋 **Matrix Grid** — 2D grid with cell highlighting
- 📚 **Stack Visualizer** — push/pop animations
- 👆 **Two Pointer** — left/right pointer visualization
- ⏯️ **Playback Controls** — play, pause, speed control, step-by-step
- 🎨 **Cyberpunk Dark Theme** — neon glows, particle background, grid overlay

## 🚀 Supported Problems

Built-in step-by-step solutions for:
- **Two Sum** (Hash Map)
- **Valid Parentheses** (Stack)
- **Binary Search** (Two Pointer)
- **Maximum Depth of Binary Tree** (DFS)
- **Number of Islands** (BFS/DFS Matrix)
- **Merge Intervals** (Sorting)
- **Any custom problem** (heuristic visualization)

## 🛠️ Tech Stack

- **React 18** + **TypeScript**
- **Vite** — lightning fast dev server
- **ReactFlow** — node graph engine
- **Framer Motion** — animations
- **Zustand** — state management
- **Tailwind CSS** — styling
- **Lucide React** — icons

## 📦 Getting Started

```bash
git clone https://github.com/kids-see-ghosts-23/leetviz
cd leetviz
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 🎮 Usage

1. **Paste** any LeetCode problem statement in the input box
2. Click **Visualize Problem** (or Cmd+Enter)
3. Use **▶ Play** or step through manually
4. Adjust **speed** (0.5x → 3x)
5. Check **Explanation** tab for algorithm details

## 🗂️ Project Structure

```
src/
├── components/       # UI components
│   ├── Header.tsx
│   ├── ProblemInput.tsx
│   ├── StepController.tsx
│   ├── ProblemInfo.tsx
│   ├── EmptyState.tsx
│   └── ParticleBackground.tsx
├── visualizers/      # Visualization engines
│   ├── ArrayVisualizer.tsx
│   ├── TreeVisualizer.tsx
│   ├── GraphVisualizer.tsx
│   ├── MatrixVisualizer.tsx
│   ├── StackVisualizer.tsx
│   └── TwoPointerVisualizer.tsx
├── store/           # Zustand state
├── utils/           # Problem parser
└── App.tsx
```

## 🤝 Contributing

PRs welcome! To add a new problem:
1. Add entry to `src/utils/parser.ts` in `builtinProblems`
2. Define `initialData`, `steps`, complexity, tags

---

Made with ⚡ and lots of `#00d4ff`
