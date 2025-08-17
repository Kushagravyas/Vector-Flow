import axios from "axios";
import toast from "react-hot-toast";

export async function submitPipeline({ nodes, edges }) {
  try {
    const res = await axios.post("http://127.0.0.1:8000/pipelines/parse", {
      nodes,
      edges,
    });

    const { num_nodes, num_edges, is_dag } = res.data;

    toast.custom(() => (
      <div
        style={{
          background: "#fff",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          borderLeft: is_dag ? "6px solid #22c55e" : "6px solid #ef4444",
          minWidth: "260px",
          fontFamily: "sans-serif",
        }}
      >
        <h3
          style={{
            margin: "0 0 8px 0",
            fontSize: "16px",
            fontWeight: "600",
            color: is_dag ? "#16a34a" : "#dc2626",
          }}
        >
          Pipeline Results
        </h3>
        <p style={{ margin: "4px 0", fontSize: "14px" }}>
          <strong>Nodes:</strong> {num_nodes}
        </p>
        <p style={{ margin: "4px 0", fontSize: "14px" }}>
          <strong>Edges:</strong> {num_edges}
        </p>
        <p style={{ margin: "4px 0", fontSize: "14px" }}>
          <strong>Is DAG:</strong>{" "}
          <span style={{ fontWeight: "600" }}>
            {is_dag ? "✅ Yes" : "❌ No"}
          </span>
        </p>
      </div>
    ));
  } catch (err) {
    console.error("Error submitting pipeline:", err);
    toast.error("❌ Failed to submit pipeline");
  }
}
