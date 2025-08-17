"use client"

import { useState, useRef } from "react"

const BaseNode = ({ title, children }) => {
  const [size, setSize] = useState({ width: 220, height: "auto" })
  const [isResizing, setIsResizing] = useState(false)
  const nodeRef = useRef(null)
  const startPos = useRef({ x: 0, y: 0 })
  const startSize = useRef({ width: 0, height: 0 })

  const handleMouseDown = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)

    startPos.current = { x: e.clientX, y: e.clientY }
    startSize.current = {
      width: nodeRef.current.offsetWidth,
      height: nodeRef.current.offsetHeight,
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleMouseMove = (e) => {
    if (!isResizing) return

    const deltaX = e.clientX - startPos.current.x
    const deltaY = e.clientY - startPos.current.y

    const newWidth = Math.max(180, startSize.current.width + deltaX)
    const newHeight = Math.max(120, startSize.current.height + deltaY)

    setSize({ width: newWidth, height: newHeight })
  }

  const handleMouseUp = () => {
    setIsResizing(false)
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  return (
    <div
      ref={nodeRef}
      className={`base-node ${isResizing ? "resizing" : ""}`}
      style={{
        width: size.width,
        height: size.height,
        minWidth: "180px",
        minHeight: "120px",
      }}
    >
      {title && <div className="node-header">{title}</div>}
      <div className="node-content">{children}</div>

      <div className="resize-handle" onMouseDown={handleMouseDown} title="Drag to resize">
        <div className="resize-icon">⟲</div>
      </div>
    </div>
  )
}

export default BaseNode
