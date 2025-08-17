const styles =
  "cursor-grab select-none rounded-md border bg-white px-3 py-2 text-sm shadow hover:bg-slate-50";

const DraggableNode = ({ type, label }) => {
  const onDragStart = (event) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ nodeType: type })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div draggable onDragStart={onDragStart} className={styles} title={type}>
      {label}
    </div>
  );
};

export default DraggableNode;
