import { motion } from 'framer-motion';
import { useStore } from '../store';

export default function TwoPointerVisualizer() {
  const { problem, currentStep } = useStore();
  if (!problem) return null;

  const step = problem.steps[currentStep];
  const nums = problem.initialData.nums as number[];
  const highlighted = step?.highlights?.nums || [];
  const pointers = step?.pointers || {};

  return (
    <div className="flex flex-col items-center gap-8 py-10 px-6">
      {/* Numbers row */}
      <div className="flex gap-3 flex-wrap justify-center">
        {nums.map((val, i) => {
          const isLeft = pointers.left === i;
          const isRight = pointers.right === i;
          const isActive = highlighted.includes(String(i));
          const isBoth = isLeft && isRight;

          const color = isBoth ? '#ffd700' : isLeft ? '#00ff88' : isRight ? '#ff4757' : isActive ? '#00d4ff' : '#30363d';
          const bg = isBoth ? '#ffd70022' : isLeft ? '#00ff8822' : isRight ? '#ff475722' : isActive ? '#00d4ff22' : '#161b22';

          return (
            <div key={i} className="flex flex-col items-center gap-1">
              {/* top pointer */}
              <motion.div
                animate={{ opacity: (isLeft || isBoth) ? 1 : 0, y: (isLeft || isBoth) ? 0 : -5 }}
                className="text-xs font-mono font-bold"
                style={{ color: '#00ff88' }}
              >
                {isLeft ? 'L' : ''}
              </motion.div>

              {/* Cell */}
              <motion.div
                animate={{ backgroundColor: bg, borderColor: color, scale: isActive ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-12 h-12 flex items-center justify-center rounded-lg border-2 font-mono font-bold text-base"
                style={{ color }}
              >
                {val}
              </motion.div>

              {/* index */}
              <span className="text-xs text-gray-600 font-mono">[{i}]</span>

              {/* bottom pointer */}
              <motion.div
                animate={{ opacity: (isRight || isBoth) ? 1 : 0, y: (isRight || isBoth) ? 0 : 5 }}
                className="text-xs font-mono font-bold"
                style={{ color: '#ff4757' }}
              >
                {isRight ? 'R' : ''}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Sum display */}
      {pointers.left !== undefined && pointers.right !== undefined &&
        pointers.left >= 0 && pointers.right >= 0 &&
        pointers.left < nums.length && pointers.right < nums.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4 px-6 py-3 rounded-xl border font-mono text-sm"
            style={{ borderColor: '#30363d', background: '#161b22' }}
          >
            <div style={{ color: '#00ff88' }}>
              nums[L={pointers.left}] = <strong>{nums[pointers.left as number]}</strong>
            </div>
            <div style={{ color: '#8b949e' }}>+</div>
            <div style={{ color: '#ff4757' }}>
              nums[R={pointers.right}] = <strong>{nums[pointers.right as number]}</strong>
            </div>
            <div style={{ color: '#8b949e' }}>=</div>
            <div style={{ color: '#ffd700', fontWeight: 'bold' }}>
              {(nums[pointers.left as number] || 0) + (nums[pointers.right as number] || 0)}
            </div>
            {problem.initialData.target !== undefined && (
              <>
                <div style={{ color: '#8b949e' }}>(target: {problem.initialData.target as number})</div>
                <div style={{ color: (nums[pointers.left as number] || 0) + (nums[pointers.right as number] || 0) === problem.initialData.target ? '#00ff88' : '#ff4757' }}>
                  {(nums[pointers.left as number] || 0) + (nums[pointers.right as number] || 0) === problem.initialData.target ? '✓ MATCH!' : '✗'}
                </div>
              </>
            )}
          </motion.div>
        )}

      {/* Hash map visualization */}
      {step?.message?.includes('map') && (
        <div className="w-full max-w-md">
          <div className="text-xs text-gray-500 font-mono mb-2">HASH MAP</div>
          <div className="grid grid-cols-4 gap-2">
            {nums.slice(0, Math.min(highlighted.length + 1, nums.length)).map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="px-2 py-1 rounded border text-xs font-mono text-center"
                style={{
                  borderColor: highlighted.includes(String(i)) ? '#00d4ff44' : '#30363d',
                  background: highlighted.includes(String(i)) ? '#00d4ff11' : '#161b22',
                  color: highlighted.includes(String(i)) ? '#00d4ff' : '#8b949e',
                }}
              >
                {val} → {i}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
