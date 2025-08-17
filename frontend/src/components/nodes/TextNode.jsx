"use client"

import { useState } from "react"
import { Handle, Position } from "reactflow"
import "../../styles/nodes.css"

export default function TextNode({ data }) {
  const [text, setText] = useState(data?.text || "")
  const variable = "variable"

  return (
    <div className="node-base node-text">
      <div className="node-header">
        <div className="node-icon">📝</div>
        <span>Text Node</span>
      </div>

      <div className="node-content">
        <label className="node-label">Text Template</label>
        <textarea
          placeholder="Hello {{name}}! Welcome to {{platform}}..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="node-input-field resize-none"
          rows={3}
        />
        <div className="node-description">
          Use <code>{"{{ variable }}"}</code> syntax for dynamic text replacement
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="node-handle"
        style={{ background: "#f093fb" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="node-handle"
        style={{ background: "#f093fb" }}
      />
    </div>
  )
}
