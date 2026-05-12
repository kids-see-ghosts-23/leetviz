import { motion } from 'framer-motion';
import { useStore } from '../store';

export default function MatrixVisualizer() {
  const { problem, currentStep } = useStore();
  if (!problem) return null;

  const step = problem.steps[currentStep];
  const matrix = problem.initialData.matrix as number[][];
  const highlighted = step?.highlights?.matrix || [];

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-4">
      <div className="inline-block rounded-lg overflow-hidden border border-cyber-border" style={{ background: '#0d1117' }}>
        {matrix.map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => {
              const key = `${r},${c}`;
              const isH = highlighted.includes(key);
              const isLand = cell === 1;

              return (
                <motion.div
                  key={c}
                  animate={{
                    backgroundColor: isH
                      ? isLand ? '#00ff8844' : '#ff475744'
                      : isLand ? '#1a2a1a' : '#0d1117',
                    boxShadow: isH
                      ? isLand ? '0 0 12px #00ff88' : '0 0 12px #ff4757'
                      : 'none',
                    scale: isH ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-14 h-14 flex items-center justify-center font-mono font-bold text-sm border"
                  style={{
                    borderColor: '#1a1f2e',
                    color: isH
                      ? isLand ? '#00ff88' : '#ff4757'
                      : isLand ? '#4a9a5a' : '#30363d',
                    position: 'relative',
                    cursor: 'default',
                  }}
                >
                  {isH && (
                    <motion.div
                      className="absolute inset-0"
                      animate={{ opacity: [0.2, 0.5, 0.2] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      style={{
                        background: isLand ? '#00ff8811' : '#ff475711',
                        borderRadius: 2,
                      }}
                    />
                  )}
                  <span style={{ position: 'relative', zIndex: 1 }}>{cell}</span>
                  <span
                    className="absolute bottom-0 right-1 text-xs opacity-30 font-mono"
                    style={{ fontSize: 9 }}
                  >
                    {r},{c}
                  </span>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex gap-6 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ background: '#4a9a5a' }} />
          <span className="text-gray-400">Land (1)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ background: '#30363d' }} />
          <span className="text-gray-400">Water (0)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ background: '#00ff8844', border: '1px solid #00ff88' }} />
          <span className="text-gray-400">Active</span>
        </div>
      </div>
    </div>
  );
}
