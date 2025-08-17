import { memo, useState } from "react"
import { Handle, Position } from "reactflow"
import "../../styles/nodes.css"

const ConcatNode = memo(({ data }) => {
  const [text1, setText1] = useState(data?.text1 || "")
  const [text2, setText2] = useState(data?.text2 || "")

  const previewResult = text1 && text2 ? `${text1}${text2}` : "Result preview..."

  return (
    <div className="node-base node-concat">
      <div className="node-header">
        <div className="node-icon">🔗</div>
        <span>Concat Node</span>
      </div>
      <div className="node-content">
        <div>
          <label className="node-label">First Input</label>
          <input
            type="text"
            placeholder="Enter first text..."
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            className="node-input-field"
          />
        </div>
        <div>
          <label className="node-label">Second Input</label>
          <input
            type="text"
            placeholder="Enter second text..."
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            className="node-input-field"
          />
        </div>
        <div>
          <label className="node-label">Preview</label>
          <div
            style={{
              padding: "8px 12px",
              background: "#f0f9ff",
              border: "2px solid #bae6fd",
              borderRadius: "8px",
              fontSize: "13px",
              color: "#0c4a6e",
              fontStyle: previewResult === "Result preview..." ? "italic" : "normal",
            }}
          >
            {previewResult}
          </div>
        </div>
        <div className="node-description">Combines two text inputs into one output</div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        id="input1"
        className="node-handle"
        style={{ background: "#a8edea", top: "40%" }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="input2"
        className="node-handle"
        style={{ background: "#a8edea", top: "60%" }}
      />
      <Handle type="source" position={Position.Right} className="node-handle" style={{ background: "#a8edea" }} />
    </div>
  )
})

export default ConcatNode
