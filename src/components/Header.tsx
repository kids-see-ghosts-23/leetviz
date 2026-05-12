import { motion } from 'framer-motion';
import { Code2, Zap, GitBranch } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative flex items-center justify-between px-6 py-4 border-b border-cyber-border"
      style={{ background: 'rgba(13,17,23,0.95)', backdropFilter: 'blur(10px)' }}>
      {/* Glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, #a855f7, transparent)' }} />

      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-lg"
            style={{ background: 'conic-gradient(#00d4ff, #a855f7, #00ff88, #00d4ff)', filter: 'blur(4px)', opacity: 0.6 }}
          />
          <div className="relative w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: '#0d1117', border: '1px solid #30363d' }}>
            <Code2 size={18} className="text-cyber-accent" />
          </div>
        </div>
        <div>
          <div className="font-bold text-lg leading-none text-glow-cyan" style={{ color: '#00d4ff', fontFamily: 'JetBrains Mono, monospace' }}>
            LeetViz
          </div>
          <div className="text-xs text-gray-500 font-mono">Algorithm Visualizer</div>
        </div>
      </motion.div>

      <motion.div
        className="flex items-center gap-2 text-xs text-gray-400 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Zap size={12} className="text-yellow-400" />
        <span>Paste any LeetCode problem → instant visualization</span>
      </motion.div>

      <motion.a
        href="https://github.com"
        target="_blank"
        className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-mono transition-colors hover:border-cyber-accent hover:text-cyber-accent"
        style={{ borderColor: '#30363d', color: '#8b949e' }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
      >
        <GitBranch size={14} />
        GitHub
      </motion.a>
    </header>
  );
}
