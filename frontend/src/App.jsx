import { useState, useEffect } from "react"
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  ReactFlowProvider,
} from "reactflow"
import "reactflow/dist/style.css"
import "./styles/index.css"
import axios from "axios"
import { Toaster, toast } from "react-hot-toast"

import InputNode from "./components/nodes/InputNode"
import TextNode from "./components/nodes/TextNode"
import LLMNode from "./components/nodes/LLMNode"
import OutputNode from "./components/nodes/OutputNode"
import DelayNode from "./components/nodes/DelayNode"
import ConcatNode from "./components/nodes/ConcatNode"
import MathNode from "./components/nodes/MathNode"
import WebhookNode from "./components/nodes/WebhookNode"

// Node registry
const nodeTypes = {
  input: InputNode,
  text: TextNode,
  llm: LLMNode,
  output: OutputNode,
  delay: DelayNode,
  concat: ConcatNode,
  math: MathNode,
  webhook: WebhookNode,
}

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme")
    return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
  })

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light")
    localStorage.setItem("theme", isDarkMode ? "dark" : "light")
  }, [isDarkMode])

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds))

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"

    const dragElement = event.target
    dragElement.style.opacity = "0.7"
    setTimeout(() => {
      dragElement.style.opacity = "1"
    }, 100)
  }

  const onDrop = (event) => {
    event.preventDefault()
    const type = event.dataTransfer.getData("application/reactflow")
    if (!type) return

    const position = reactFlowInstance.project({
      x: event.clientX - 280,
      y: event.clientY - 40,
    })

    const newNode = {
      id: `${type}_${+new Date()}`,
      type,
      position,
      data: { label: `${type} node` },
    }

    setNodes((nds) => nds.concat(newNode))
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} node added!`, {
      duration: 2000,
      className: "toast-success",
    })
  }

  const onDragOver = (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }

  const submitPipeline = async () => {
    if (nodes.length === 0) {
      toast.error("Please add some nodes first!", { className: "toast-error" })
      return
    }

    try {
      toast.loading("Executing pipeline...", { id: "pipeline-loading" })

      const response = await axios.post("http://127.0.0.1:8000/pipelines/parse", {
        nodes,
        edges,
      })

      const { num_nodes, num_edges, is_dag, results, message } = response.data

      toast.dismiss("pipeline-loading")
      toast.success(message || "Pipeline executed successfully!", {
        className: "toast-success",
        duration: 3000,
      })

      const resultsDialog = document.createElement("div")
      resultsDialog.innerHTML = `
        <div class="results-modal">
          <h3 class="results-title">Pipeline Results</h3>
          <div class="results-stats">
            <div class="stat-item">
              <span>Nodes:</span>
              <span class="stat-value">${num_nodes}</span>
            </div>
            <div class="stat-item">
              <span>Edges:</span>
              <span class="stat-value">${num_edges}</span>
            </div>
            <div class="stat-item">
              <span>Is DAG:</span>
              <span class="stat-value ${is_dag ? "success" : "error"}">
                ${is_dag ? "✅ Yes" : "❌ No"}
              </span>
            </div>
          </div>
          <div class="results-content">
            <h4>Results:</h4>
            <pre class="results-data">${JSON.stringify(results, null, 2)}</pre>
          </div>
          <button onclick="this.parentElement.parentElement.remove()" class="results-close-btn">
            Close
          </button>
        </div>
        <div class="results-overlay" onclick="this.parentElement.remove()"></div>
      `
      document.body.appendChild(resultsDialog)
    } catch (error) {
      console.error("Pipeline submission failed:", error)
      toast.dismiss("pipeline-loading")
      toast.error("Pipeline execution failed. Check backend connection.", {
        className: "toast-error",
        duration: 4000,
      })
    }
  }

  const handleRefresh = () => {
    if (nodes.length > 0 || edges.length > 0) {
      if (window.confirm("Are you sure you want to refresh? All nodes will be lost.")) {
        window.location.reload()
      }
    } else {
      window.location.reload()
    }
  }

  const handleNodeClick = (nodeId) => {
    setSelectedNodeId(nodeId === selectedNodeId ? null : nodeId)
  }

  const handleDeleteSelected = () => {
    if (selectedNodeId) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId))
      setSelectedNodeId(null)
      toast.success("Node deleted!", { className: "toast-success" })
    }
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const nodeConfigs = [
    { type: "input", label: "Input Node", icon: "📥", className: "node-input" },
    { type: "text", label: "Text Node", icon: "📝", className: "node-text" },
    { type: "llm", label: "LLM Node", icon: "🤖", className: "node-llm" },
    { type: "output", label: "Output Node", icon: "📤", className: "node-output" },
    { type: "delay", label: "Delay Node", icon: "⏱️", className: "node-delay" },
    { type: "concat", label: "Concat Node", icon: "🔗", className: "node-concat" },
    { type: "math", label: "Math Node", icon: "🧮", className: "node-math" },
    { type: "webhook", label: "Webhook Node", icon: "🌐", className: "node-webhook" },
  ]

  return (
    <ReactFlowProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            fontWeight: "600",
          },
        }}
      />
      <div className="app-container">
        <div className="sidebar left-sidebar">
          <div className="sidebar-header">
            <h1 className="sidebar-title">Flow Forge</h1>
            <p className="sidebar-subtitle">Drag & Drop Pipeline Builder</p>
          </div>

          <div className="nodes-section">
            <h3 className="section-title">
              <span>🎯</span>
              Available Nodes
            </h3>
            <div className="nodes-grid">
              {nodeConfigs.map(({ type, label, icon, className }) => (
                <div
                  key={type}
                  draggable
                  onDragStart={(e) => onDragStart(e, type)}
                  className={`draggable-node ${className}`}
                >
                  <span className="node-icon">{icon}</span>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="canvas-container" onDrop={onDrop} onDragOver={onDragOver}>
          <ReactFlow
            nodes={nodes.map((node) => ({
              ...node,
              style: {
                ...node.style,
                border: node.id === selectedNodeId ? "3px solid var(--accent-color)" : "2px solid transparent",
                boxShadow: node.id === selectedNodeId ? "0 0 20px var(--accent-glow)" : "var(--shadow-md)",
                borderRadius: "12px",
                transition: "all 0.3s ease",
              },
            }))}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            fitView
            onNodeClick={(_, node) => handleNodeClick(node.id)}
            defaultEdgeOptions={{
              style: { strokeWidth: 2, stroke: "var(--accent-color)" },
              type: "smoothstep",
            }}
          >
            <MiniMap
              nodeStrokeColor="var(--accent-color)"
              nodeColor="var(--node-bg)"
              nodeBorderRadius={8}
              className="react-flow__minimap-dark"
            />
            <Background variant="dots" gap={20} size={1} color="var(--grid-color)" />
            <Controls className="react-flow__controls-dark" />
          </ReactFlow>
        </div>

        <div className="sidebar right-sidebar">
          <div className="sidebar-header">
            <h3 className="sidebar-title">Actions</h3>
            <p className="sidebar-subtitle">Pipeline Controls</p>
          </div>

          <div className="actions-section">
            <button onClick={submitPipeline} className="action-button btn-execute" title="Execute Pipeline">
              <span className="action-icon">🚀</span>
              <span className="action-text">Execute</span>
            </button>

            <button onClick={handleRefresh} className="action-button btn-refresh" title="Refresh Canvas">
              <span className="action-icon">🔄</span>
              <span className="action-text">Refresh</span>
            </button>

            <button
              onClick={handleDeleteSelected}
              disabled={!selectedNodeId}
              className="action-button btn-delete"
              title="Delete Selected Node"
            >
              <span className="action-icon">🗑️</span>
              <span className="action-text">Delete</span>
            </button>
          </div>

          <div className="theme-section">
            <h4 className="section-subtitle">Theme</h4>
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
            >
              <span className="theme-icon">{isDarkMode ? "☀️" : "🌙"}</span>
              <span className="theme-text">{isDarkMode ? "Light" : "Dark"}</span>
            </button>
          </div>

          <div className="status-section">
            <div className="status-item">
              <span className="status-label">Nodes:</span>
              <span className="status-value">{nodes.length}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Edges:</span>
              <span className="status-value">{edges.length}</span>
            </div>
            {selectedNodeId && (
              <div className="status-item selected">
                <span className="status-label">Selected:</span>
                <span className="status-value">{selectedNodeId.split("_")[0]}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  )
}
