import { motion } from 'framer-motion';
import { useStore } from '../store';

export default function ArrayVisualizer() {
  const { problem, currentStep } = useStore();
  if (!problem) return null;

  const step = problem.steps[currentStep];
  const nums = problem.initialData.nums as number[];
  const highlighted = step?.highlights?.nums || [];
  const pointers: Record<string, number> = step?.pointers || {};

  const max = Math.max(...nums.map(Math.abs), 1);

  return (
    <div className="flex flex-col items-center gap-6 py-8 px-4 w-full">
      {/* Pointer labels */}
      {Object.keys(pointers).length > 0 ? (
        <div className="flex gap-3 flex-wrap justify-center">
          {Object.entries(pointers).map(([name, idx]) => {
            if (idx < 0 || idx >= nums.length) return null;
            return (
              <div key={name} className="flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono"
                style={{ borderColor: name === 'left' ? '#00ff88' : name === 'right' ? '#ff4757' : '#ffd700', color: name === 'left' ? '#00ff88' : name === 'right' ? '#ff4757' : '#ffd700' }}>
                <span>{name}</span>
                <span className="opacity-60">→ [{idx}]</span>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Bar chart */}
      <div className="flex items-end gap-2 justify-center" style={{ height: 180 }}>
        {nums.map((val, i) => {
          const isHighlighted = highlighted.includes(String(i));
          const isLeft = pointers.left === i;
          const isRight = pointers.right === i;
          const isMid = pointers.mid === i;
          const height = Math.max((Math.abs(val) / max) * 140, 20);
          const color = isMid ? '#ffd700' : isLeft ? '#00ff88' : isRight ? '#ff4757' : isHighlighted ? '#00d4ff' : '#30363d';

          return (
            <motion.div
              key={i}
              className="flex flex-col items-center gap-1"
              animate={{ scale: isHighlighted ? 1.1 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Pointer arrow */}
              {(isLeft || isRight || isMid) && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-mono"
                  style={{ color }}
                >
                  {isLeft ? 'L' : isRight ? 'R' : 'M'}▼
                </motion.div>
              )}
              {/* Bar */}
              <motion.div
                className="rounded-t-sm cursor-pointer relative"
                style={{ width: 44, backgroundColor: color, height }}
                animate={{ backgroundColor: color, height }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                whileHover={{ scale: 1.05 }}
              >
                {isHighlighted && (
                  <motion.div
                    className="absolute inset-0 rounded-t-sm"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    style={{ backgroundColor: color, mixBlendMode: 'screen' }}
                  />
                )}
              </motion.div>
              {/* Value label */}
              <div className="text-xs font-mono" style={{ color: isHighlighted ? color : '#8b949e' }}>{val}</div>
              {/* Index label */}
              <div className="text-xs text-gray-600 font-mono">[{i}]</div>
            </motion.div>
          );
        })}
      </div>

      {/* Index row (interval visualization) */}
      {!!problem.initialData.intervals && (
        <div className="mt-4 w-full max-w-2xl">
          <div className="text-xs text-gray-500 font-mono mb-2">INTERVALS</div>
          <div className="space-y-2">
            {(problem.initialData.intervals as number[][]).map(([start, end], i) => {
              const isH = highlighted.includes(String(i));
              return (
                <motion.div key={i} className="flex items-center gap-3"
                  animate={{ opacity: isH ? 1 : 0.4 }}
                  transition={{ duration: 0.3 }}>
                  <span className="text-xs font-mono w-16 text-right" style={{ color: isH ? '#00d4ff' : '#8b949e' }}>
                    [{start},{end}]
                  </span>
                  <div className="flex-1 relative h-5 rounded" style={{ background: '#161b22' }}>
                    <motion.div
                      className="absolute h-5 rounded"
                      animate={{
                        left: `${(start / 20) * 100}%`,
                        width: `${((end - start) / 20) * 100}%`,
                        backgroundColor: isH ? '#00d4ff' : '#30363d',
                      }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
