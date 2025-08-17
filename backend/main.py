from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import time

app = FastAPI()

# Enable frontend <-> backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class Node(BaseModel):
    id: str
    type: str
    data: Dict[str, Any] = {}

class Edge(BaseModel):
    source: str
    target: str

class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

@app.get("/")
async def root():
    return {"message": "Backend running!"}

@app.post("/pipelines/parse")
async def parse_pipeline(pipeline: Pipeline):
    nodes = pipeline.nodes
    edges = pipeline.edges

    # --- Pipeline stats ---
    num_nodes = len(nodes)
    num_edges = len(edges)

    # DAG check
    adjacency = {n.id: [] for n in nodes}
    for e in edges:
        adjacency[e.source].append(e.target)

    visited, stack = set(), set()
    def dfs(v):
        if v in stack:
            return False
        if v in visited:
            return True
        visited.add(v)
        stack.add(v)
        for neigh in adjacency.get(v, []):
            if not dfs(neigh):
                return False
        stack.remove(v)
        return True

    is_dag = all(dfs(n.id) for n in nodes if n.id not in visited)

    # --- Simulate execution for each node ---
    results = {}
    for node in nodes:
        if node.type == "input":
            results[node.id] = node.data.get("value", "User input")
        elif node.type == "text":
            template = node.data.get("text", "Hello {{name}}")
            results[node.id] = template.replace("{{name}}", "World")
        elif node.type == "llm":
            results[node.id] = f"LLM response (mock) for prompt: {node.data.get('prompt','')}"
        elif node.type == "output":
            results[node.id] = f"Output collected: {node.data.get('label','result')}"
        elif node.type == "delay":
            delay_time = int(node.data.get("seconds", 1))
            time.sleep(min(delay_time, 2))  # cap to 2 sec
            results[node.id] = f"Delayed {delay_time} sec"
        elif node.type == "concat":
            part1 = node.data.get("part1", "A")
            part2 = node.data.get("part2", "B")
            results[node.id] = part1 + part2
        elif node.type == "math":
            try:
                expr = node.data.get("expression", "1+1")
                results[node.id] = str(eval(expr))  # simple eval
            except Exception:
                results[node.id] = "Math error"
        elif node.type == "webhook":
            url = node.data.get("url", "http://example.com")
            results[node.id] = f"Webhook called -> {url}"
        else:
            results[node.id] = "Unknown node"

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": is_dag,
        "results": results,
        "message": "Pipeline executed successfully ✅",
    }
