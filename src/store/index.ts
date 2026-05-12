import { create } from 'zustand';

export type VisType = 'array' | 'tree' | 'graph' | 'linkedlist' | 'matrix' | 'dp' | 'stack' | 'hashmap' | 'twopointer';

export interface Step {
  id: number;
  description: string;
  highlights: Record<string, string[]>; // dataKey -> highlighted indices/nodes
  values?: Record<string, unknown>;
  pointers?: Record<string, number>;
  code?: string;
  message?: string;
}

export interface ParsedProblem {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: VisType;
  description: string;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  constraints: string[];
  initialData: Record<string, unknown>;
  steps: Step[];
  algorithm: string;
  timeComplexity: string;
  spaceComplexity: string;
  tags: string[];
}

interface AppState {
  problem: ParsedProblem | null;
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  inputText: string;
  isLoading: boolean;
  activeTab: 'visualizer' | 'code' | 'explanation';
  setProblem: (p: ParsedProblem) => void;
  setStep: (n: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  togglePlay: () => void;
  setSpeed: (s: number) => void;
  setInputText: (t: string) => void;
  setLoading: (b: boolean) => void;
  setActiveTab: (t: AppState['activeTab']) => void;
  reset: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  problem: null,
  currentStep: 0,
  isPlaying: false,
  speed: 1,
  inputText: '',
  isLoading: false,
  activeTab: 'visualizer',
  setProblem: (p) => set({ problem: p, currentStep: 0, isPlaying: false }),
  setStep: (n) => set({ currentStep: n }),
  nextStep: () => {
    const { currentStep, problem } = get();
    if (problem && currentStep < problem.steps.length - 1)
      set({ currentStep: currentStep + 1 });
    else set({ isPlaying: false });
  },
  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) set({ currentStep: currentStep - 1 });
  },
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setSpeed: (speed) => set({ speed }),
  setInputText: (inputText) => set({ inputText }),
  setLoading: (isLoading) => set({ isLoading }),
  setActiveTab: (activeTab) => set({ activeTab }),
  reset: () => set({ problem: null, currentStep: 0, isPlaying: false }),
}));
