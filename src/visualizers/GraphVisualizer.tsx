import { useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import { useStore } from '../store';

interface GraphData {
  nodes: { id: string }[];
  edges: string[][];
}

const positions = [
  { x: 250, y: 50 },
  { x: 100, y: 180 },
  { x: 400, y: 180 },
  { x: 100, y: 320 },
  { x: 400, y: 320 },
  { x: 250, y: 220 },
];

const GraphNodeComponent = ({ data }: { data: { label: string; highlighted: boolean } }) => (
  <motion.div
    animate={{
      scale: data.highlighted ? 1.2 : 1,
      boxShadow: data.highlighted
        ? '0 0 0 2px #a855f7, 0 0 25px rgba(168,85,247,0.6)'
        : '0 0 0 1px #30363d',
    }}
    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-mono font-bold"
    style={{
      background: data.highlighted
        ? 'radial-gradient(circle, #a855f722, #0a0a0f)'
        : '#161b22',
      color: data.highlighted ? '#a855f7' : '#e6edf3',
      border: `2px solid ${data.highlighted ? '#a855f7' : '#30363d'}`,
    }}
  >
    {data.label}
  </motion.div>
);

const nodeTypes = { graphNode: GraphNodeComponent };

export default function GraphVisualizer() {
  const { problem, currentStep } = useStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const rebuild = useCallback(() => {
    if (!problem) return;
    const step = problem.steps[currentStep];
    const highlighted = step?.highlights?.graph || [];
    const gd = problem.initialData.graph as GraphData;

    const n: Node[] = gd.nodes.map((nd, i) => ({
      id: nd.id,
      position: positions[i] || { x: Math.random() * 400, y: Math.random() * 300 },
      data: { label: nd.id, highlighted: highlighted.includes(nd.id) },
      type: 'graphNode',
    }));

    const e: Edge[] = gd.edges.map(([src, tgt], i) => {
      const srcH = highlighted.includes(src);
      const tgtH = highlighted.includes(tgt);
      return {
        id: `e${i}`,
        source: src,
        target: tgt,
        style: { stroke: srcH && tgtH ? '#a855f7' : '#30363d', strokeWidth: srcH && tgtH ? 3 : 1.5 },
        animated: srcH && tgtH,
      };
    });

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
        attributionPosition="bottom-left"
      >
        <Background color="#1a1a2e" gap={30} />
        <Controls style={{ background: '#0d1117', border: '1px solid #30363d' }} />
        <MiniMap
          style={{ background: '#0d1117', border: '1px solid #30363d' }}
          nodeColor={(n) => (n.data?.highlighted ? '#a855f7' : '#30363d')}
        />
      </ReactFlow>
    </div>
  );
}
