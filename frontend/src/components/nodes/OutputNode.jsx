import { Handle, Position } from "reactflow"
import "../../styles/nodes.css"

export default function OutputNode({ data }) {
  return (
    <div className="node-base node-output">
      <div className="node-header">
        <div className="node-icon">📤</div>
        <span>Output Node</span>
      </div>
      <div className="node-content">
        <div className="node-label">Final Output</div>
        <div
          style={{
            padding: "12px 16px",
            background: "#f0fdf4",
            border: "2px solid #bbf7d0",
            borderRadius: "10px",
            color: "#166534",
            fontWeight: "500",
          }}
        >
          {data?.label || "Pipeline result will appear here"}
        </div>
        <div className="node-status">
          <span>🟢</span>
          Ready to receive
        </div>
        <div className="node-description">Final destination for your pipeline output</div>
      </div>
      <Handle type="target" position={Position.Left} className="node-handle" style={{ background: "#43e97b" }} />
    </div>
  )
}
