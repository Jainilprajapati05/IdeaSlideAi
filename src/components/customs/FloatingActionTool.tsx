type Props = {
  position: { x: number; y: number } | null;
  onClose: () => void;
  loading: boolean;
  handleAiChange: (val: string) => void;
};

export default function FloatingActionTool({
  position,
  onClose,
  loading,
  handleAiChange,
}: Props) {
  if (!position) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        transform: "translate(-50%, 0)",
        background: "white",
        padding: "10px",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        zIndex: 9999,
      }}
    >
      <textarea
        className="border p-2 rounded w-64 h-20"
        placeholder="Ask AI to rewrite/edit section…"
        onBlur={(e) => handleAiChange(e.target.value)}
      />

      <button
        onClick={onClose}
        className="mt-2 bg-black text-white px-3 py-1 rounded"
      >
        Close
      </button>

      {loading && <p className="text-sm text-gray-500 mt-1">Generating…</p>}
    </div>
  );
}
