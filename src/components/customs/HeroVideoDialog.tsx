"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroVideoProps {
  className?: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  videoSrc: string;
  animationStyle?: "from-center" | "from-bottom";
}

export function HeroVideoDialog({
  className = "",
  thumbnailSrc,
  thumbnailAlt,
  videoSrc,
  animationStyle = "from-center",
}: HeroVideoProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      {/* Thumbnail Button */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="cursor-pointer rounded-2xl overflow-hidden shadow-xl border bg-white"
        onClick={() => setOpen(true)}
      >
        <img
          src={thumbnailSrc}
          alt={thumbnailAlt}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Video Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="modal"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            {/* Video Container */}
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={
                animationStyle === "from-bottom"
                  ? { y: 80, opacity: 0 }
                  : { scale: 0.6, opacity: 0 }
              }
              animate={
                animationStyle === "from-bottom"
                  ? { y: 0, opacity: 1 }
                  : { scale: 1, opacity: 1 }
              }
              exit={
                animationStyle === "from-bottom"
                  ? { y: 80, opacity: 0 }
                  : { scale: 0.6, opacity: 0 }
              }
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative bg-black rounded-2xl overflow-hidden w-full max-w-3xl aspect-video shadow-2xl"
            >
              <iframe
                src={videoSrc}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full"
              ></iframe>

              {/* Close Button */}
              <button
                className="absolute top-3 right-3 bg-white text-black rounded-full px-3 py-1 text-sm shadow"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
