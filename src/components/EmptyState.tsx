import { motion } from 'framer-motion';
import { Code2, ArrowDown } from 'lucide-react';

const features = [
  { icon: '🌳', label: 'Trees', desc: 'BST, traversal, depth' },
  { icon: '📊', label: 'Arrays', desc: 'Sorting, searching, sliding window' },
  { icon: '🕸️', label: 'Graphs', desc: 'BFS, DFS, shortest path' },
  { icon: '📋', label: 'Matrix', desc: 'Grid traversal, islands' },
  { icon: '📚', label: 'Stack/Queue', desc: 'Brackets, monotonic stack' },
  { icon: '👆', label: 'Two Pointers', desc: 'Left-right, fast-slow' },
];

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 py-12">
      {/* Animated logo */}
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <motion.div
          className="absolute inset-0 rounded-3xl"
          animate={{
            boxShadow: [
              '0 0 20px rgba(0,212,255,0.2)',
              '0 0 60px rgba(0,212,255,0.4)',
              '0 0 20px rgba(0,212,255,0.2)',
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <div className="relative w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #00d4ff11, #a855f711)', border: '1px solid #00d4ff44' }}>
          <Code2 size={48} style={{ color: '#00d4ff' }} />
        </div>
      </motion.div>

      <motion.h1
        className="text-4xl font-bold mb-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        LeetViz
      </motion.h1>

      <motion.p
        className="text-gray-400 text-lg mb-2 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Paste any LeetCode problem and watch it come alive.
      </motion.p>

      <motion.p
        className="text-gray-600 text-sm mb-10 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Step-by-step animated visualizations with node graphs
      </motion.p>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mb-10"
      >
        <ArrowDown size={20} style={{ color: '#00d4ff44' }} />
      </motion.div>

      {/* Feature grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {features.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.07 }}
            whileHover={{ scale: 1.03, borderColor: '#00d4ff44' }}
            className="flex items-start gap-3 p-4 rounded-xl border text-left cursor-default"
            style={{ background: '#0d1117', border: '1px solid #30363d' }}
          >
            <span className="text-2xl">{f.icon}</span>
            <div>
              <div className="font-semibold text-sm" style={{ color: '#e6edf3' }}>{f.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{f.desc}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
