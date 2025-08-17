"use client"

import { useState } from "react"
import { Handle, Position } from "reactflow"
import "../../styles/nodes.css"

export default function InputNode({ data }) {
  const [value, setValue] = useState(data?.value || "")

  return (
    <div className="node-base node-input">
      <div className="node-header">
        <div className="node-icon">📥</div>
        <span>Input Node</span>
      </div>
      <div className="node-content">
        <label className="node-label">Input Data</label>
        <textarea
          placeholder="Enter your input data here..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="node-input-field"
          rows={3}
        />
        <div className="node-description">This node accepts input data to start your pipeline</div>
      </div>
      <Handle type="source" position={Position.Right} className="node-handle" style={{ background: "#667eea" }} />
    </div>
  )
}
