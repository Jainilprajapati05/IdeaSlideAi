import { useEffect, useState } from "react";
import type { Outline } from "@/types/outline";
import { Skeleton } from "../ui/skeleton";
import { Edit, Save, X } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  loading: boolean;
  outlineData: Outline[];
  onSave?: (updated: Outline[]) => void;
};

export default function OutlieSection({ loading, outlineData, onSave }: Props) {
  const [editing, setEditing] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  const startEdit = (index: number, slide: Outline) => {
    setEditing(index);
    setTitle(slide.slidePoint);
    setNotes(slide.outline);

    setTimeout(() => {
      document.getElementById(`slide-${index}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);
  };

  const cancelEdit = () => {
    setEditing(null);
    setTitle("");
    setNotes("");
  };

  const saveEdit = () => {
    if (editing === null) return;

    const newData = [...outlineData];
    newData[editing] = {
      ...newData[editing],
      slidePoint: title,
      outline: notes,
    };

    onSave?.(newData);
    cancelEdit();
  };

  useEffect(() => {
    document.querySelectorAll("textarea[data-autoresize]").forEach((el) => {
      const t = el as HTMLTextAreaElement;

      const resize = () => {
        t.style.height = "auto";
        t.style.height = `${t.scrollHeight}px`;
      };

      t.addEventListener("input", resize);
      resize();
    });
  }, [editing]);

  return (
    <div className="mt-12 w-full max-w-3xl mx-auto pb-32">
      <h2 className="text-4xl font-extrabold bg-linear-to-r from-[#0A3D76] to-[#3FA2F6] bg-clip-text text-transparent">
        Sliders Outline
      </h2>
      <p className="text-gray-600 text-sm mt-2">Review and edit the outline.</p>

      {loading && (
        <div className="space-y-4 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[90px] rounded-2xl" />
          ))}
        </div>
      )}

      {!loading && outlineData.length > 0 && (
        <div className="space-y-6 mt-8">
          {outlineData.map((slide, i) => {
            const isEdit = editing === i;

            return (
              <motion.div
                id={`slide-${i}`}
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, scale: isEdit ? 1.02 : 1 }}
                className={`p-0.5 rounded-2xl ${
                  isEdit
                    ? "bg-linear-to-br from-[#FF7A1A]/40 to-[#FFB36B]/40"
                    : "bg-white/10"
                }`}
              >
                <div className="relative bg-white/70 backdrop-blur-xl p-6 rounded-2xl border">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-linear-to-r from-[#FF7A1A] to-[#FFA55C] text-white font-bold shadow">
                      {slide.slideNo}
                    </div>

                    <div className="flex-1">
                      {isEdit ? (
                        <>
                          <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 rounded-xl border mb-3"
                          />
                          <textarea
                            data-autoresize
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full p-3 rounded-xl border resize-none overflow-hidden"
                          />

                          <div className="flex gap-3 mt-4">
                            <button
                              onClick={saveEdit}
                              className="px-4 py-2 bg-green-600 text-white rounded-xl flex items-center gap-2"
                            >
                              <Save size={16} /> Save
                            </button>

                            <button
                              onClick={cancelEdit}
                              className="px-4 py-2 bg-gray-200 rounded-xl"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <h3 className="font-semibold text-lg">
                            {slide.slidePoint}
                          </h3>
                          <p className="text-sm text-gray-700">
                            {slide.outline}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {!isEdit && (
                    <button
                      onClick={() => startEdit(i, slide)}
                      className="absolute top-4 right-4 text-gray-600 hover:text-[#FF7A1A] 
               transition-all duration-200 hover:drop-shadow-[0_0_6px_rgba(255,122,26,0.6)]"
                    >
                      <Edit size={20} />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
