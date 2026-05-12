import { motion } from 'framer-motion';
import { Clock, Database, BookOpen, Cpu } from 'lucide-react';
import { useStore } from '../store';

export default function ProblemInfo() {
  const { problem, activeTab, setActiveTab } = useStore();
  if (!problem) return null;

  const diffClass = { Easy: 'badge-easy', Medium: 'badge-medium', Hard: 'badge-hard' }[problem.difficulty];

  const tabs = [
    { id: 'visualizer' as const, label: 'Visualizer', icon: <Cpu size={12} /> },
    { id: 'explanation' as const, label: 'Explanation', icon: <BookOpen size={12} /> },
  ];

  return (
    <div className="space-y-3">
      {/* Problem title & meta */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel-border rounded-xl p-4"
        style={{ background: '#0d1117' }}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="font-bold text-lg" style={{ color: '#e6edf3' }}>{problem.title}</h2>
          <span className={`text-xs font-mono px-2 py-1 rounded-full border shrink-0 ${diffClass}`}>
            {problem.difficulty}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {problem.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full font-mono"
              style={{ background: '#a855f711', color: '#a855f7', border: '1px solid #a855f722' }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Complexity */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: '#161b22', border: '1px solid #30363d' }}>
            <Clock size={12} style={{ color: '#ffd700' }} />
            <div>
              <div className="text-xs text-gray-500 font-mono">Time</div>
              <div className="text-sm font-mono font-bold" style={{ color: '#ffd700' }}>{problem.timeComplexity}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: '#161b22', border: '1px solid #30363d' }}>
            <Database size={12} style={{ color: '#00ff88' }} />
            <div>
              <div className="text-xs text-gray-500 font-mono">Space</div>
              <div className="text-sm font-mono font-bold" style={{ color: '#00ff88' }}>{problem.spaceComplexity}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg" style={{ background: '#161b22', border: '1px solid #30363d' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-mono transition-all"
            style={{
              background: activeTab === tab.id ? '#0d1117' : 'transparent',
              color: activeTab === tab.id ? '#00d4ff' : '#8b949e',
              border: activeTab === tab.id ? '1px solid #00d4ff22' : '1px solid transparent',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Explanation panel */}
      {activeTab === 'explanation' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel-border rounded-xl p-4 space-y-4"
          style={{ background: '#0d1117' }}
        >
          <div>
            <div className="text-xs text-gray-500 font-mono mb-2 flex items-center gap-1">
              <BookOpen size={11} /> ALGORITHM
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{problem.algorithm}</p>
          </div>

          {problem.examples.length > 0 && (
            <div>
              <div className="text-xs text-gray-500 font-mono mb-2">EXAMPLES</div>
              <div className="space-y-2">
                {problem.examples.map((ex, i) => (
                  <div key={i} className="rounded-lg p-3 font-mono text-xs space-y-1"
                    style={{ background: '#161b22', border: '1px solid #30363d' }}>
                    <div><span className="text-gray-500">Input: </span><span className="text-blue-400">{ex.input}</span></div>
                    <div><span className="text-gray-500">Output: </span><span className="text-green-400">{ex.output}</span></div>
                    {ex.explanation && <div><span className="text-gray-500">Why: </span><span className="text-gray-400">{ex.explanation}</span></div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {problem.constraints.length > 0 && (
            <div>
              <div className="text-xs text-gray-500 font-mono mb-2">CONSTRAINTS</div>
              <ul className="space-y-1">
                {problem.constraints.map((c, i) => (
                  <li key={i} className="text-xs text-gray-400 font-mono flex items-start gap-2">
                    <span style={{ color: '#00d4ff' }}>•</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
