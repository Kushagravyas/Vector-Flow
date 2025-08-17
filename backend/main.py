from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI(title="VectorShift Backend")

# -----------------------------
# Request / Response Schemas
# -----------------------------

class Node(BaseModel):
    id: str
    type: str
    data: Dict[str, Any] = {}
    position: Dict[str, Any] = {}

class Edge(BaseModel):
    source: str
    target: str

class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

# -----------------------------
# Root route
# -----------------------------
@app.get("/")
def read_root():
    return {"ping": "pong"}

# -----------------------------
# Pipeline execution mock
# -----------------------------
@app.post("/pipelines/parse")
def parse_pipeline(pipeline: Pipeline):
    """
    This endpoint receives the nodes + edges,
    runs a mock execution (no real LLM),
    and returns simulated results.
    """

    results = {}

    for node in pipeline.nodes:
        if node.type == "input":
            results[node.id] = node.data.get("value", "")
        elif node.type == "text":
            template = node.data.get("text", "")
            # replace {{var}} placeholders with previous results if available
            out = template
            for k, v in results.items():
                out = out.replace(f"{{{{{k}}}}}", str(v))
            results[node.id] = out
        elif node.type == "llm":
            prompt = node.data.get("prompt", "")
            # Mock: in real LLM, call OpenAI API here
            results[node.id] = f"🤖 LLM processed: {prompt}"
        elif node.type == "math":
            expr = node.data.get("expr", "1+1")
            try:
                results[node.id] = eval(expr)
            except Exception:
                results[node.id] = "Error in expression"
        elif node.type == "concat":
            parts = node.data.get("parts", [])
            results[node.id] = " ".join(str(results.get(p, p)) for p in parts)
        elif node.type == "random":
            import random
            results[node.id] = random.randint(0, 100)
        elif node.type == "upper":
            val = node.data.get("value", "")
            results[node.id] = str(val).upper()
        elif node.type == "output":
            input_val = None
            for edge in pipeline.edges:
                if edge.target == node.id:
                    input_val = results.get(edge.source, "")
            results[node.id] = input_val
        else:
            results[node.id] = f"[{node.type}] not implemented"

    return {"results": results, "pipeline": pipeline.dict()}

