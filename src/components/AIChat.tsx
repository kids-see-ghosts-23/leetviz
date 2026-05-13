import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Code2, AlertTriangle, Loader2, ChevronDown } from 'lucide-react';
import { useStore } from '../store';
import { pythonSolutions, fuzzyMatchSolution, getGenericSolution } from '../utils/solutions';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'code' | 'mistakes' | 'mixed';
  code?: string;
  mistakes?: string[];
}

const SUGGESTIONS = [
  'Show me the Python solution',
  'What are common mistakes?',
  'Explain the algorithm',
  'What is the time complexity?',
  'Show me an alternative approach',
];

function buildSystemContext(problemTitle: string, problemType: string, algorithm: string): string {
  return `You are an expert competitive programming tutor helping a student understand the LeetCode problem "${problemTitle}".
Problem type: ${problemType}. Algorithm: ${algorithm}.
Keep answers concise, practical, and focused. When showing code, always use Python.
Point out common mistakes students make. Be direct and clear.`;
}

async function askGemini(messages: { role: string; content: string }[], systemCtx: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('NO_KEY');

  const prompt = [
    systemCtx,
    '',
    ...messages.map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`),
    'Tutor:',
  ].join('\n');

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
      }),
    }
  );

  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
}

function parseCodeBlocks(text: string): { type: 'text' | 'code'; content: string }[] {
  const parts: { type: 'text' | 'code'; content: string }[] = [];
  const regex = /```(?:python)?\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index).trim() });
    }
    parts.push({ type: 'code', content: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex).trim() });
  }

  return parts.filter(p => p.content);
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  const parts = msg.content ? parseCodeBlocks(msg.content) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5`}
        style={{
          background: isUser ? '#a855f722' : '#00d4ff22',
          border: `1px solid ${isUser ? '#a855f744' : '#00d4ff44'}`,
        }}>
        {isUser
          ? <User size={13} style={{ color: '#a855f7' }} />
          : <Bot size={13} style={{ color: '#00d4ff' }} />}
      </div>

      {/* Content */}
      <div className={`max-w-[85%] space-y-2 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>

        {/* Mistakes list */}
        {msg.mistakes && (
          <div className="rounded-lg p-3 w-full"
            style={{ background: '#ff475711', border: '1px solid #ff475733' }}>
            <div className="flex items-center gap-1.5 text-xs font-mono mb-2" style={{ color: '#ff4757' }}>
              <AlertTriangle size={12} /> Common Mistakes
            </div>
            <ul className="space-y-1.5">
              {msg.mistakes.map((m, i) => (
                <li key={i} className="text-xs flex items-start gap-2" style={{ color: '#e6edf3' }}>
                  <span style={{ color: '#ff4757' }} className="mt-0.5 shrink-0">✗</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Inline code block */}
        {msg.code && (
          <div className="rounded-lg overflow-hidden w-full"
            style={{ border: '1px solid #30363d' }}>
            <div className="flex items-center gap-2 px-3 py-1.5"
              style={{ background: '#161b22', borderBottom: '1px solid #30363d' }}>
              <Code2 size={11} style={{ color: '#00d4ff' }} />
              <span className="text-xs font-mono" style={{ color: '#8b949e' }}>Python</span>
            </div>
            <SyntaxHighlighter
              language="python"
              style={atomOneDark}
              customStyle={{ margin: 0, padding: '12px', background: '#0d1117', fontSize: 12, lineHeight: 1.6 }}
            >
              {msg.code}
            </SyntaxHighlighter>
          </div>
        )}

        {/* Text parts with possible inline code */}
        {parts.length > 0 && parts.map((part, i) =>
          part.type === 'code' ? (
            <div key={i} className="rounded-lg overflow-hidden w-full"
              style={{ border: '1px solid #30363d' }}>
              <div className="flex items-center gap-2 px-3 py-1.5"
                style={{ background: '#161b22', borderBottom: '1px solid #30363d' }}>
                <Code2 size={11} style={{ color: '#00d4ff' }} />
                <span className="text-xs font-mono" style={{ color: '#8b949e' }}>Python</span>
              </div>
              <SyntaxHighlighter
                language="python"
                style={atomOneDark}
                customStyle={{ margin: 0, padding: '12px', background: '#0d1117', fontSize: 12, lineHeight: 1.6 }}
              >
                {part.content}
              </SyntaxHighlighter>
            </div>
          ) : part.content ? (
            <div key={i}
              className="px-3 py-2 rounded-lg text-sm leading-relaxed"
              style={{
                background: isUser ? '#a855f711' : '#161b22',
                border: `1px solid ${isUser ? '#a855f733' : '#30363d'}`,
                color: '#e6edf3',
              }}
            >
              {part.content}
            </div>
          ) : null
        )}

        {/* Plain text if no parts */}
        {parts.length === 0 && !msg.code && !msg.mistakes && msg.content && (
          <div className="px-3 py-2 rounded-lg text-sm leading-relaxed"
            style={{
              background: isUser ? '#a855f711' : '#161b22',
              border: `1px solid ${isUser ? '#a855f733' : '#30363d'}`,
              color: '#e6edf3',
            }}>
            {msg.content}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function AIChat() {
  const { problem } = useStore();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasKey] = useState(() => !!import.meta.env.VITE_GEMINI_API_KEY);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Reset chat when problem changes
  useEffect(() => {
    setMessages([]);
  }, [problem?.title]);

  const addMessage = (msg: Omit<Message, 'id'>) => {
    setMessages(prev => [...prev, { ...msg, id: Date.now().toString() }]);
  };

  const handleSend = async (text?: string) => {
    const query = (text || input).trim();
    if (!query || !problem) return;
    setInput('');

    addMessage({ role: 'user', content: query });
    setLoading(true);

    const q = query.toLowerCase();
    const solKey = fuzzyMatchSolution(problem.title.toLowerCase());
    const sol = solKey ? pythonSolutions[solKey] : null;

    try {
      // Built-in answers for common queries
      if (q.includes('python') || q.includes('solution') || q.includes('code')) {
        const code = sol?.code || getGenericSolution(problem.type);
        addMessage({
          role: 'assistant',
          content: sol?.explanation || `Here's a Python solution for ${problem.title}:`,
          code,
        });
      } else if (q.includes('mistake') || q.includes('wrong') || q.includes('error') || q.includes('common')) {
        if (sol?.mistakes) {
          addMessage({
            role: 'assistant',
            content: `Here are the most common mistakes people make on ${problem.title}:`,
            mistakes: sol.mistakes,
          });
        } else if (hasKey) {
          const reply = await askGemini(
            [{ role: 'user', content: query }],
            buildSystemContext(problem.title, problem.type, problem.algorithm)
          );
          addMessage({ role: 'assistant', content: reply });
        } else {
          addMessage({ role: 'assistant', content: `Common mistakes for ${problem.type} problems:\n• Off-by-one errors on indices\n• Not handling edge cases (empty input, single element)\n• Mutating input while iterating\n• Wrong base case in recursion` });
        }
      } else if (q.includes('complexit') || q.includes('time') || q.includes('space')) {
        addMessage({
          role: 'assistant',
          content: `**${problem.title}**\n\nTime: ${problem.timeComplexity}\nSpace: ${problem.spaceComplexity}\n\n${sol ? `Why ${problem.timeComplexity}? ${sol.explanation.split('.')[0]}.` : ''}`,
        });
      } else if (q.includes('explain') || q.includes('how') || q.includes('algorithm')) {
        if (sol) {
          addMessage({ role: 'assistant', content: sol.explanation });
        } else if (hasKey) {
          const reply = await askGemini(
            [{ role: 'user', content: query }],
            buildSystemContext(problem.title, problem.type, problem.algorithm)
          );
          addMessage({ role: 'assistant', content: reply });
        } else {
          addMessage({ role: 'assistant', content: problem.algorithm });
        }
      } else if (q.includes('alternative') || q.includes('other way') || q.includes('different')) {
        if (hasKey) {
          const reply = await askGemini(
            [{ role: 'user', content: `What are alternative approaches to solve ${problem.title}? Show Python code.` }],
            buildSystemContext(problem.title, problem.type, problem.algorithm)
          );
          addMessage({ role: 'assistant', content: reply });
        } else {
          addMessage({ role: 'assistant', content: `For ${problem.title}, common alternative approaches:\n• Brute force: O(n²) nested loops (always works, often too slow)\n• ${problem.type === 'array' ? 'Sorting + two pointers' : problem.type === 'tree' ? 'BFS (iterative) vs DFS (recursive)' : 'Union-Find data structure'}\n\nAdd VITE_GEMINI_API_KEY to .env for AI-powered answers.` });
        }
      } else {
        // General question — try Gemini, fallback to heuristic
        if (hasKey) {
          const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
          history.push({ role: 'user', content: query });
          const reply = await askGemini(history, buildSystemContext(problem.title, problem.type, problem.algorithm));
          addMessage({ role: 'assistant', content: reply });
        } else {
          addMessage({
            role: 'assistant',
            content: `I can answer questions about ${problem.title} using built-in knowledge. Try asking:\n• "Show me the Python solution"\n• "What are common mistakes?"\n• "Explain the algorithm"\n• "Time complexity?"\n\nFor open-ended AI answers, add VITE_GEMINI_API_KEY to your .env file.`,
          });
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      if (msg === 'NO_KEY') {
        addMessage({ role: 'assistant', content: 'No Gemini API key found. Add VITE_GEMINI_API_KEY to your .env file for AI answers. Built-in answers still work for common questions.' });
      } else {
        addMessage({ role: 'assistant', content: `Error: ${msg}. Try a built-in question like "Show Python solution".` });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!problem) return null;

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center z-50 shadow-lg"
        style={{
          background: open ? '#ff4757' : 'linear-gradient(135deg, #00d4ff, #a855f7)',
          border: 'none',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ boxShadow: open ? '0 0 25px rgba(255,71,87,0.5)' : '0 0 25px rgba(0,212,255,0.5)' }}
        title="AI Tutor — ask about this problem"
      >
        {open
          ? <X size={20} style={{ color: '#fff' }} />
          : <MessageSquare size={20} style={{ color: '#fff' }} />}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl overflow-hidden"
            style={{
              width: 420,
              height: 580,
              background: '#0d1117',
              border: '1px solid #30363d',
              boxShadow: '0 0 40px rgba(0,0,0,0.6), 0 0 20px rgba(0,212,255,0.1)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid #30363d', background: '#161b22' }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: '#00d4ff22', border: '1px solid #00d4ff44' }}>
                  <Bot size={14} style={{ color: '#00d4ff' }} />
                </div>
                <div>
                  <div className="font-mono text-sm font-bold" style={{ color: '#00d4ff' }}>AI Tutor</div>
                  <div className="text-xs font-mono" style={{ color: '#8b949e' }}>{problem.title}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {hasKey && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-mono"
                    style={{ background: '#00ff8811', color: '#00ff88', border: '1px solid #00ff8822' }}>
                    Gemini
                  </span>
                )}
                <button onClick={() => setOpen(false)}
                  className="p-1 rounded hover:bg-gray-800 transition-colors"
                  style={{ color: '#8b949e' }}>
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-6">
                  <Bot size={32} className="mx-auto mb-3" style={{ color: '#00d4ff44' }} />
                  <p className="text-sm font-mono" style={{ color: '#8b949e' }}>
                    Ask me anything about <span style={{ color: '#00d4ff' }}>{problem.title}</span>
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#4a5568' }}>
                    Python solutions, mistakes, complexity, explanations
                  </p>
                </div>
              )}

              {messages.map(msg => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}

              {loading && (
                <div className="flex gap-2 items-center">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: '#00d4ff22', border: '1px solid #00d4ff44' }}>
                    <Bot size={13} style={{ color: '#00d4ff' }} />
                  </div>
                  <div className="px-3 py-2 rounded-lg flex items-center gap-2"
                    style={{ background: '#161b22', border: '1px solid #30363d' }}>
                    <Loader2 size={12} className="animate-spin" style={{ color: '#00d4ff' }} />
                    <span className="text-xs font-mono" style={{ color: '#8b949e' }}>thinking...</span>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 0 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="text-xs px-2.5 py-1 rounded-full font-mono transition-colors"
                    style={{ background: '#161b22', border: '1px solid #30363d', color: '#8b949e' }}
                    onMouseEnter={e => {
                      (e.target as HTMLElement).style.borderColor = '#00d4ff44';
                      (e.target as HTMLElement).style.color = '#00d4ff';
                    }}
                    onMouseLeave={e => {
                      (e.target as HTMLElement).style.borderColor = '#30363d';
                      (e.target as HTMLElement).style.color = '#8b949e';
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3" style={{ borderTop: '1px solid #30363d' }}>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Ask about this problem..."
                  className="flex-1 px-3 py-2 rounded-lg text-sm font-mono"
                  style={{
                    background: '#161b22',
                    border: '1px solid #30363d',
                    color: '#e6edf3',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#00d4ff44')}
                  onBlur={e => (e.target.style.borderColor = '#30363d')}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    background: input.trim() ? '#00d4ff22' : '#161b22',
                    border: `1px solid ${input.trim() ? '#00d4ff44' : '#30363d'}`,
                    color: input.trim() ? '#00d4ff' : '#4a5568',
                  }}
                >
                  <Send size={14} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
