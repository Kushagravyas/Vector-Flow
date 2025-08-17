
import { memo, useState } from "react"
import { Handle, Position } from "reactflow"
import "../../styles/nodes.css"

const DelayNode = memo(({ data }) => {
  const [delay, setDelay] = useState(data?.delay || 1000)

  const formatDelay = (ms) => {
    if (ms >= 1000) {
      return `${(ms / 1000).toFixed(1)}s`
    }
    return `${ms}ms`
  }

  return (
    <div className="node-base node-delay">
      <div className="node-header">
        <div className="node-icon">⏱️</div>
        <span>Delay Node</span>
      </div>
      <div className="node-content">
        <label className="node-label">Delay Duration</label>
        <input
          type="number"
          value={delay}
          onChange={(e) => setDelay(e.target.value)}
          className="node-input-field"
          min="0"
          step="100"
          placeholder="1000"
        />
        <div className="node-status">
          <span>⏰</span>
          {formatDelay(delay)} delay
        </div>
        <div className="node-description">Pause pipeline execution for specified duration</div>
      </div>
      <Handle type="target" position={Position.Left} className="node-handle" style={{ background: "#fa709a" }} />
      <Handle type="source" position={Position.Right} className="node-handle" style={{ background: "#fa709a" }} />
    </div>
  )
})

export default DelayNode
