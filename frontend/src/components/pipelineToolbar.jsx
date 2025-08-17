// components/PipelineToolbar.jsx
export default function PipelineToolbar({ onExecute, onReset, onDelete, canDelete }) {
  return (
    <div className="pipeline-toolbar">
      <button className="toolbar-btn execute" onClick={onExecute}>
        🚀 Execute
      </button>
      <button className="toolbar-btn reset" onClick={onReset}>
        🔄 Reset
      </button>
      <button
        className="toolbar-btn delete"
        onClick={onDelete}
        disabled={!canDelete}
      >
        🗑️ Delete
      </button>
    </div>
  )
}
