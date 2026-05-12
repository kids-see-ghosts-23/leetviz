import { useStore, type VisType } from '../store';
import ArrayVisualizer from './ArrayVisualizer';
import TreeVisualizer from './TreeVisualizer';
import GraphVisualizer from './GraphVisualizer';
import MatrixVisualizer from './MatrixVisualizer';
import StackVisualizer from './StackVisualizer';
import TwoPointerVisualizer from './TwoPointerVisualizer';

const map: Record<VisType, React.ComponentType> = {
  array: ArrayVisualizer,
  tree: TreeVisualizer,
  graph: GraphVisualizer,
  linkedlist: ArrayVisualizer,
  matrix: MatrixVisualizer,
  dp: MatrixVisualizer,
  stack: StackVisualizer,
  hashmap: TwoPointerVisualizer,
  twopointer: TwoPointerVisualizer,
};

export default function VisualizerRouter() {
  const { problem } = useStore();
  if (!problem) return null;
  const Vis = map[problem.type] || ArrayVisualizer;
  return <Vis />;
}
