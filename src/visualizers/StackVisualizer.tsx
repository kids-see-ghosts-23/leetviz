import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';

export default function StackVisualizer() {
  const { problem, currentStep } = useStore();
  if (!problem) return null;

  const step = problem.steps[currentStep];
  const stack = (step?.values?.stack as string[]) || [];
  const current = step?.values?.current as string || '';
  const s = problem.initialData.s as string || '';
  const idx = step?.values?.idx as number ?? -1;

  const matchMap: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  const isClose = [')', ']', '}'].includes(current);
  const isOpen = ['(', '[', '{'].includes(current);

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Input string */}
      <div className="flex gap-1 flex-wrap justify-center">
        {s.split('').map((ch, i) => (
          <motion.div
            key={i}
            animate={{
              backgroundColor: i === idx ? '#00d4ff22' : i < idx ? '#a855f711' : '#161b22',
              borderColor: i === idx ? '#00d4ff' : i < idx ? '#a855f744' : '#30363d',
              scale: i === idx ? 1.2 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="w-10 h-10 flex items-center justify-center rounded font-mono font-bold text-base border"
            style={{
              color: i === idx ? '#00d4ff' : i < idx ? '#a855f7' : '#e6edf3',
            }}
          >
            {ch}
          </motion.div>
        ))}
      </div>

      {/* Current char status */}
      {current && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-2 rounded-lg border font-mono text-sm"
          style={{
            borderColor: isClose ? '#ff4757' : '#00ff88',
            background: isClose ? '#ff475711' : '#00ff8811',
            color: isClose ? '#ff4757' : '#00ff88',
          }}
        >
          <span>Current: <strong>"{current}"</strong></span>
          <span>→</span>
          <span>{isOpen ? '📥 Push to stack' : isClose ? `📤 Pop & match '${matchMap[current]}'` : ''}</span>
        </motion.div>
      )}

      {/* Stack visualization */}
      <div className="flex flex-col items-center gap-1" style={{ minHeight: 200 }}>
        <div className="text-xs text-gray-500 font-mono mb-2">STACK (top ↑)</div>
        <AnimatePresence>
          {[...stack].reverse().map((item, i) => (
            <motion.div
              key={`${item}-${stack.length - 1 - i}`}
              initial={{ opacity: 0, scale: 0.5, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-20 h-10 flex items-center justify-center font-mono font-bold text-lg rounded border"
              style={{
                background: i === 0 ? '#00d4ff22' : '#161b22',
                borderColor: i === 0 ? '#00d4ff' : '#30363d',
                color: i === 0 ? '#00d4ff' : '#e6edf3',
                boxShadow: i === 0 ? '0 0 10px rgba(0,212,255,0.3)' : 'none',
              }}
            >
              {item}
            </motion.div>
          ))}
        </AnimatePresence>
        {stack.length === 0 && (
          <div className="w-20 h-10 flex items-center justify-center font-mono text-xs text-gray-600 border border-dashed border-gray-700 rounded">
            empty
          </div>
        )}
        {/* Stack base */}
        <div className="w-24 h-1 mt-1 rounded" style={{ background: '#30363d' }} />
      </div>
    </div>
  );
}
