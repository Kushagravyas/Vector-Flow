"use client"

import { useState } from "react"
import { Handle, Position } from "reactflow"
import "../../styles/nodes.css"

const aiOptions = [
  { value: "chatgpt", label: "ChatGPT" },
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "claude", label: "Claude AI" },
]

export default function LLMNode({ data }) {
  const [prompt, setPrompt] = useState(data?.prompt || "")
  const [aiPlatform, setAiPlatform] = useState(data?.aiPlatform || "chatgpt")

  return (
    <div className="node-base node-llm">
      <div className="node-header">
        <div className="node-icon">🤖</div>
        <span>LLM Node</span>
      </div>
      <div className="node-content">
        <div>
          <label className="node-label">AI Platform</label>
          <select value={aiPlatform} onChange={(e) => setAiPlatform(e.target.value)} className="node-select">
            {aiOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="node-label">Prompt</label>
          <textarea
            placeholder="Enter your AI prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="node-input-field"
            rows={3}
          />
        </div>
        <div className="node-status">
          <span>🟢</span>
          Ready
        </div>
        <div className="node-description">Generate AI responses using large language models</div>
      </div>
      <Handle type="target" position={Position.Left} className="node-handle" style={{ background: "#4facfe" }} />
      <Handle type="source" position={Position.Right} className="node-handle" style={{ background: "#4facfe" }} />
    </div>
  )
}
