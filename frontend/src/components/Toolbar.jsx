import DraggableNode from "./DraggableNode";

const Toolbar = () => {
  return (
    <aside className="h-full w-64 border-r bg-white p-3">
      <div className="mb-2 text-xs font-semibold uppercase text-slate-500">
        Nodes
      </div>
      <div className="flex flex-col gap-2">
        <DraggableNode type="input" label="Input" />
        <DraggableNode type="text" label="Text" />
        <DraggableNode type="llm" label="LLM" />
        <DraggableNode type="output" label="Output" />
      </div>
    </aside>
  );
};

export default Toolbar;
