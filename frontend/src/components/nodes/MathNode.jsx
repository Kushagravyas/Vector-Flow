
import { memo, useState } from "react"
import { Handle, Position } from "reactflow"
import "../../styles/nodes.css"

const MathNode = memo(({ data }) => {
  const [num1, setNum1] = useState(data?.num1 || 0)
  const [num2, setNum2] = useState(data?.num2 || 0)
  const [operation, setOperation] = useState(data?.operation || "add")

  const calculateResult = () => {
    const n1 = Number.parseFloat(num1) || 0
    const n2 = Number.parseFloat(num2) || 0
    switch (operation) {
      case "add":
        return n1 + n2
      case "subtract":
        return n1 - n2
      case "multiply":
        return n1 * n2
      case "divide":
        return n2 !== 0 ? n1 / n2 : "Error: Division by zero"
      default:
        return 0
    }
  }

  const operationSymbols = {
    add: "+",
    subtract: "−",
    multiply: "×",
    divide: "÷",
  }

  return (
    <div className="node-base node-math">
      <div className="node-header">
        <div className="node-icon">🧮</div>
        <span>Math Node</span>
      </div>
      <div className="node-content">
        <div>
          <label className="node-label">First Number</label>
          <input
            type="number"
            value={num1}
            onChange={(e) => setNum1(Number(e.target.value))}
            className="node-input-field"
            placeholder="0"
          />
        </div>
        <div>
          <label className="node-label">Operation</label>
          <select value={operation} onChange={(e) => setOperation(e.target.value)} className="node-select">
            <option value="add">Addition (+)</option>
            <option value="subtract">Subtraction (−)</option>
            <option value="multiply">Multiplication (×)</option>
            <option value="divide">Division (÷)</option>
          </select>
        </div>
        <div>
          <label className="node-label">Second Number</label>
          <input
            type="number"
            value={num2}
            onChange={(e) => setNum2(Number(e.target.value))}
            className="node-input-field"
            placeholder="0"
          />
        </div>
        <div>
          <label className="node-label">Result</label>
          <div
            style={{
              padding: "12px 16px",
              background: "#fef3c7",
              border: "2px solid #fcd34d",
              borderRadius: "10px",
              color: "#92400e",
              fontWeight: "600",
              textAlign: "center",
              fontSize: "16px",
            }}
          >
            {num1} {operationSymbols[operation]} {num2} = {calculateResult()}
          </div>
        </div>
        <div className="node-description">Perform mathematical operations on numeric inputs</div>
      </div>
      <Handle type="target" position={Position.Left} className="node-handle" style={{ background: "#ff9a9e" }} />
      <Handle type="source" position={Position.Right} className="node-handle" style={{ background: "#ff9a9e" }} />
    </div>
  )
})

export default MathNode
