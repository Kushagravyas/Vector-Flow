
import { memo, useState } from "react"
import { Handle, Position } from "reactflow"
import "../../styles/nodes.css"

const WebhookNode = memo(({ data }) => {
  const [url, setUrl] = useState(data?.url || "https://api.example.com")
  const [method, setMethod] = useState(data?.method || "POST")

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const urlStatus = isValidUrl(url) ? "valid" : "invalid"

  return (
    <div className="node-base node-webhook">
      <div className="node-header">
        <div className="node-icon">🌐</div>
        <span>Webhook Node</span>
      </div>
      <div className="node-content">
        <div>
          <label className="node-label">HTTP Method</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="node-select">
            <option value="POST">POST</option>
            <option value="GET">GET</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
        <div>
          <label className="node-label">Webhook URL</label>
          <input
            type="text"
            placeholder="https://api.example.com/webhook"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="node-input-field"
            style={{
              borderColor: urlStatus === "valid" ? "#10b981" : "#ef4444",
            }}
          />
        </div>
        <div className="node-status">
          <span>{urlStatus === "valid" ? "🟢" : "🔴"}</span>
          {urlStatus === "valid" ? "URL Valid" : "Invalid URL"}
        </div>
        <div className="node-description">Send HTTP requests to external APIs and services</div>
      </div>
      <Handle type="target" position={Position.Left} className="node-handle" style={{ background: "#ffecd2" }} />
      <Handle type="source" position={Position.Right} className="node-handle" style={{ background: "#ffecd2" }} />
    </div>
  )
})

export default WebhookNode
