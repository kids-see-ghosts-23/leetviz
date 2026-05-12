import { useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Position,
  type Node,
  type Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import { useStore } from '../store';

interface TreeNode {
  val: number;
  id: string;
  left?: TreeNode | null;
  right?: TreeNode | null;
}

function treeToFlow(
  node: TreeNode | null,
  x: number,
  y: number,
  spread: number,
  highlighted: string[]
): { nodes: Node[]; edges: Edge[] } {
  if (!node) return { nodes: [], edges: [] };

  const isHigh = highlighted.includes(node.id);
  const n: Node = {
    id: node.id,
    position: { x, y },
    data: { label: node.val, highlighted: isHigh },
    type: 'treeNode',
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  };

  const result: { nodes: Node[]; edges: Edge[] } = { nodes: [n], edges: [] };
  const nextSpread = spread * 0.55;
  const dy = 90;

  if (node.left) {
    result.edges.push({
      id: `e-${node.id}-${node.left.id}`,
      source: node.id,
      target: node.left.id,
      style: { stroke: '#30363d', strokeWidth: 2 },
      animated: highlighted.includes(node.id) && highlighted.includes(node.left.id),
    });
    const sub = treeToFlow(node.left, x - spread, y + dy, nextSpread, highlighted);
    result.nodes.push(...sub.nodes);
    result.edges.push(...sub.edges);
  }

  if (node.right) {
    result.edges.push({
      id: `e-${node.id}-${node.right.id}`,
      source: node.id,
      target: node.right.id,
      style: { stroke: '#30363d', strokeWidth: 2 },
      animated: highlighted.includes(node.id) && highlighted.includes(node.right.id),
    });
    const sub = treeToFlow(node.right, x + spread, y + dy, nextSpread, highlighted);
    result.nodes.push(...sub.nodes);
    result.edges.push(...sub.edges);
  }

  return result;
}

const TreeNodeComponent = ({ data }: { data: { label: number; highlighted: boolean } }) => (
  <motion.div
    animate={{
      scale: data.highlighted ? 1.15 : 1,
      boxShadow: data.highlighted
        ? '0 0 0 2px #00d4ff, 0 0 20px rgba(0,212,255,0.5)'
        : '0 0 0 1px #30363d',
    }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-mono font-bold"
    style={{
      background: data.highlighted
        ? 'radial-gradient(circle, #00d4ff22, #0a0a0f)'
        : 'radial-gradient(circle, #161b22, #0d1117)',
      color: data.highlighted ? '#00d4ff' : '#e6edf3',
      border: `2px solid ${data.highlighted ? '#00d4ff' : '#30363d'}`,
    }}
  >
    {data.label}
  </motion.div>
);

const nodeTypes = { treeNode: TreeNodeComponent };

export default function TreeVisualizer() {
  const { problem, currentStep } = useStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const rebuild = useCallback(() => {
    if (!problem) return;
    const step = problem.steps[currentStep];
    const highlighted = step?.highlights?.tree || [];
    const tree = problem.initialData.tree as TreeNode;
    const { nodes: n, edges: e } = treeToFlow(tree, 300, 30, 200, highlighted);
    setNodes(n);
    setEdges(e);
  }, [problem, currentStep, setNodes, setEdges]);

  useEffect(() => { rebuild(); }, [rebuild]);

  return (
    <div style={{ height: 380, background: '#0a0a0f', borderRadius: 8 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        attributionPosition="bottom-left"
      >
        <Background color="#1a1a2e" gap={30} />
        <Controls style={{ background: '#0d1117', border: '1px solid #30363d' }} />
        <MiniMap
          style={{ background: '#0d1117', border: '1px solid #30363d' }}
          nodeColor={(n) => (n.data?.highlighted ? '#00d4ff' : '#30363d')}
        />
      </ReactFlow>
    </div>
  );
}
