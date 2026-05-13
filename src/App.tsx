import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import ProblemInput from './components/ProblemInput';
import StepController from './components/StepController';
import ProblemInfo from './components/ProblemInfo';
import EmptyState from './components/EmptyState';
import ParticleBackground from './components/ParticleBackground';
import AIChat from './components/AIChat';
import VisualizerRouter from './visualizers';
import { useStore } from './store';

export default function App() {
  const { problem, activeTab } = useStore();

  return (
    <div className="min-h-screen cyber-grid-bg relative" style={{ background: '#0a0a0f' }}>
      <ParticleBackground />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
          {!problem ? (
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
              >
                <ProblemInput />
              </motion.div>
              <EmptyState />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left sidebar */}
              <div className="lg:col-span-1 space-y-4">
                <ProblemInput />
                <ProblemInfo />
              </div>

              {/* Main visualizer */}
              <div className="lg:col-span-2 space-y-4">
                {/* Visualizer panel */}
                <motion.div
                  layout
                  className="panel-border corner-bracket rounded-xl overflow-hidden"
                  style={{ background: '#0d1117' }}
                >
                  {/* Panel header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-border">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full" style={{ background: '#ff4757' }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: '#ffd700' }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: '#00ff88' }} />
                      </div>
                      <span className="font-mono text-sm" style={{ color: '#8b949e' }}>
                        {problem.type.toUpperCase()} VISUALIZER
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00ff88' }} />
                      <span className="text-xs font-mono text-gray-500">LIVE</span>
                    </div>
                  </div>

                  {/* Visualization */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={problem.type}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      style={{ minHeight: 400 }}
                    >
                      {activeTab === 'visualizer' && <VisualizerRouter />}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                {/* Step controller */}
                <StepController />

                {/* Additional: data state panel */}
                <DataStatePanel />
              </div>
            </motion.div>
          )}
        </main>
      </div>

      <AIChat />
    </div>
  );
}

function DataStatePanel() {
  const { problem, currentStep } = useStore();
  if (!problem) return null;
  const step = problem.steps[currentStep];
  if (!step?.values && !step?.pointers) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel-border rounded-xl p-4"
      style={{ background: '#0d1117' }}
    >
      <div className="text-xs text-gray-500 font-mono mb-3">STATE INSPECTOR</div>
      <div className="grid grid-cols-2 gap-3">
        {step.values && Object.entries(step.values).map(([k, v]) => (
          <div key={k} className="px-3 py-2 rounded-lg font-mono text-xs"
            style={{ background: '#161b22', border: '1px solid #30363d' }}>
            <span style={{ color: '#a855f7' }}>{k}</span>
            <span style={{ color: '#8b949e' }}> = </span>
            <span style={{ color: '#00d4ff' }}>
              {Array.isArray(v) ? `[${v.join(', ')}]` : String(v)}
            </span>
          </div>
        ))}
        {step.pointers && Object.entries(step.pointers).map(([k, v]) => (
          <div key={k} className="px-3 py-2 rounded-lg font-mono text-xs"
            style={{ background: '#161b22', border: '1px solid #30363d' }}>
            <span style={{ color: '#ffd700' }}>{k}</span>
            <span style={{ color: '#8b949e' }}> → </span>
            <span style={{ color: '#00ff88' }}>{String(v)}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
