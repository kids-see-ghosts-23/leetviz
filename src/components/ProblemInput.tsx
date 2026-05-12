import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, ChevronUp, Loader2, Terminal } from 'lucide-react';
import { useStore } from '../store';
import { parseProblem } from '../utils/parser';
import { builtinProblems } from '../utils/parser';

const SAMPLES = Object.keys(builtinProblems).map(k =>
  k.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
);

export default function ProblemInput() {
  const { inputText, setInputText, setProblem, setLoading, isLoading } = useStore();
  const [expanded, setExpanded] = useState(true);

  const handleVisualize = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    // Small delay for "AI processing" feel
    await new Promise(r => setTimeout(r, 800));
    const parsed = parseProblem(inputText);
    setProblem(parsed);
    setLoading(false);
    setExpanded(false);
  };

  const loadSample = (name: string) => {
    setInputText(name);
    handleVisualize();
  };

  return (
    <motion.div
      className="panel-border corner-bracket rounded-xl overflow-hidden"
      style={{ background: '#0d1117' }}
      layout
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        style={{ borderBottom: expanded ? '1px solid #30363d' : 'none' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Terminal size={14} style={{ color: '#00d4ff' }} />
          <span className="font-mono text-sm font-medium" style={{ color: '#00d4ff' }}>
            Problem Input
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-mono"
            style={{ background: '#00d4ff11', color: '#00d4ff88', border: '1px solid #00d4ff22' }}>
            AI Parser
          </span>
        </div>
        <div className="text-gray-500">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {/* Textarea */}
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder={`Paste any LeetCode problem statement here...\n\nExamples:\n• "Two Sum"\n• "Given an array of integers, find two numbers that add up to target"\n• Any full problem description`}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg font-mono text-sm resize-none"
                  style={{
                    background: '#161b22',
                    border: '1px solid #30363d',
                    color: '#e6edf3',
                    lineHeight: 1.6,
                  }}
                  onFocus={e => (e.target.style.borderColor = '#00d4ff44')}
                  onBlur={e => (e.target.style.borderColor = '#30363d')}
                  onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleVisualize(); }}
                />
                <div className="absolute bottom-2 right-3 text-xs text-gray-600 font-mono">
                  ⌘+Enter to run
                </div>
              </div>

              {/* Sample problems */}
              <div>
                <div className="text-xs text-gray-500 font-mono mb-2">Quick Load:</div>
                <div className="flex flex-wrap gap-2">
                  {SAMPLES.map(name => (
                    <motion.button
                      key={name}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => loadSample(name)}
                      className="px-3 py-1 rounded-full text-xs font-mono border transition-colors"
                      style={{ borderColor: '#30363d', color: '#8b949e', background: '#161b22' }}
                      onMouseEnter={e => {
                        (e.target as HTMLElement).style.borderColor = '#a855f744';
                        (e.target as HTMLElement).style.color = '#a855f7';
                      }}
                      onMouseLeave={e => {
                        (e.target as HTMLElement).style.borderColor = '#30363d';
                        (e.target as HTMLElement).style.color = '#8b949e';
                      }}
                    >
                      {name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Visualize button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleVisualize}
                disabled={isLoading || !inputText.trim()}
                className="w-full py-3 rounded-lg font-mono font-bold text-sm flex items-center justify-center gap-2 relative overflow-hidden"
                style={{
                  background: isLoading
                    ? '#161b22'
                    : 'linear-gradient(135deg, #00d4ff22, #a855f722)',
                  border: '1px solid',
                  borderColor: isLoading ? '#30363d' : '#00d4ff44',
                  color: isLoading ? '#8b949e' : '#00d4ff',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {!isLoading && (
                  <motion.div
                    className="absolute inset-0"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.1), transparent)',
                    }}
                  />
                )}
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Analyzing Problem...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Visualize Problem</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
