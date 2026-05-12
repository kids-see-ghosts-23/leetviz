import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useStore } from '../store';

export default function StepController() {
  const { problem, currentStep, isPlaying, speed, setStep, nextStep, prevStep, togglePlay, setSpeed, reset } = useStore();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        nextStep();
      }, 1500 / speed);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, speed, nextStep]);

  if (!problem) return null;

  const total = problem.steps.length;
  const step = problem.steps[currentStep];
  const progress = ((currentStep) / Math.max(total - 1, 1)) * 100;

  const speeds = [0.5, 1, 1.5, 2, 3];

  return (
    <div className="panel-border rounded-xl p-4 space-y-4"
      style={{ background: '#0d1117' }}>

      {/* Step message */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-3 rounded-lg border font-mono text-sm"
        style={{ background: '#161b22', borderColor: '#00d4ff22', color: '#00d4ff' }}
      >
        <div className="flex items-start gap-2">
          <span className="text-gray-500 shrink-0">Step {currentStep + 1}/{total}:</span>
          <span>{step?.description}</span>
        </div>
        {step?.message && (
          <div className="mt-1 text-xs px-2 py-1 rounded font-mono"
            style={{ background: '#00d4ff08', color: '#00d4ff99' }}>
            <span className="text-gray-500">{'> '}</span>{step.message}
          </div>
        )}
      </motion.div>

      {/* Progress bar */}
      <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: '#30363d' }}>
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ background: 'linear-gradient(90deg, #00d4ff, #a855f7)' }}
        />
        {/* Step dots */}
        <div className="absolute inset-0 flex items-center">
          {problem.steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-all"
              style={{
                left: `${(i / Math.max(total - 1, 1)) * 100}%`,
                background: i <= currentStep ? '#00d4ff' : '#30363d',
                transform: `translate(-50%, -50%) scale(${i === currentStep ? 1.5 : 1})`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <ControlBtn onClick={() => setStep(0)} title="First">
            <SkipBack size={14} />
          </ControlBtn>
          <ControlBtn onClick={prevStep} disabled={currentStep === 0} title="Previous">
            <ChevronLeft size={16} />
          </ControlBtn>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: isPlaying ? '#ff475722' : '#00d4ff22',
              border: `2px solid ${isPlaying ? '#ff4757' : '#00d4ff'}`,
              color: isPlaying ? '#ff4757' : '#00d4ff',
            }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </motion.button>
          <ControlBtn onClick={nextStep} disabled={currentStep === total - 1} title="Next">
            <ChevronRight size={16} />
          </ControlBtn>
          <ControlBtn onClick={() => setStep(total - 1)} title="Last">
            <SkipForward size={14} />
          </ControlBtn>
        </div>

        {/* Speed */}
        <div className="flex items-center gap-1">
          {speeds.map(s => (
            <motion.button
              key={s}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSpeed(s)}
              className="px-2 py-1 rounded text-xs font-mono border"
              style={{
                borderColor: speed === s ? '#00d4ff44' : '#30363d',
                background: speed === s ? '#00d4ff11' : 'transparent',
                color: speed === s ? '#00d4ff' : '#8b949e',
              }}
            >
              {s}x
            </motion.button>
          ))}
        </div>

        <ControlBtn onClick={reset} title="Reset">
          <RotateCcw size={14} />
        </ControlBtn>
      </div>

      {/* Step indicators */}
      <div className="flex gap-1 flex-wrap">
        {problem.steps.map((_s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className="step-indicator px-2 py-0.5 rounded text-xs font-mono border transition-all"
            style={{
              borderColor: i === currentStep ? '#00d4ff' : i < currentStep ? '#a855f744' : '#30363d',
              background: i === currentStep ? '#00d4ff11' : i < currentStep ? '#a855f711' : 'transparent',
              color: i === currentStep ? '#00d4ff' : i < currentStep ? '#a855f7' : '#4a5568',
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

function ControlBtn({ children, onClick, disabled, title }: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.1 } : {}}
      whileTap={!disabled ? { scale: 0.9 } : {}}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="w-8 h-8 rounded flex items-center justify-center transition-colors"
      style={{
        background: '#161b22',
        border: '1px solid #30363d',
        color: disabled ? '#30363d' : '#8b949e',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </motion.button>
  );
}
