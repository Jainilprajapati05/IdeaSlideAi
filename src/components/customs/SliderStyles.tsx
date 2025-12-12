import { useState } from "react";
import { motion } from "framer-motion";

import ProfessionalSlider from "./../../assets/professional.jpg";
import ModernGradientSlider from "./../../assets/modern-gradient.jpg";
import DarkSlider from "./../../assets/dark.jpg";
import PastelSlider from "./../../assets/pastel-ppt.jpg";
import MinWhiteSlider from "./../../assets/Minimalist-White.jpg";
import TechSlider from "./../../assets/tech.jpg";

// Add designGuide & colors for AI usage
export type DesignStyle = {
  styleName: string;
  bannerImage: string;
  designGuide: string; // AI instructions for this style
  colors: Record<string, string>; // color codes for AI
};

const Design_Styles: DesignStyle[] = [
  {
    styleName: "Professional Blue 💼",
    bannerImage: ProfessionalSlider,
    designGuide:
      "Use a professional blue theme with clean spacing and serif fonts.",
    colors: { primary: "#0A3D76", accent: "#FF7A1A", background: "#FFFFFF" },
  },
  {
    styleName: "Minimal White ⚪",
    bannerImage: MinWhiteSlider,
    designGuide:
      "Use a minimal white theme with subtle shadows and modern sans-serif fonts.",
    colors: { primary: "#1A1A1D", accent: "#FF7A1A", background: "#FFFFFF" },
  },
  {
    styleName: "Modern Gradient 🌈",
    bannerImage: ModernGradientSlider,
    designGuide:
      "Use vibrant gradients with modern UI elements and rounded corners.",
    colors: { primary: "#FF7A1A", accent: "#3FA2F6", background: "#F4F4F6" },
  },
  {
    styleName: "Elegant Dark ✨",
    bannerImage: DarkSlider,
    designGuide:
      "Use dark backgrounds with subtle gradients and neon highlights.",
    colors: { primary: "#0A0A0A", accent: "#FF7A1A", background: "#1A1A1D" },
  },
  {
    styleName: "Creative Pastel 🎨",
    bannerImage: PastelSlider,
    designGuide: "Use soft pastel tones with playful typography and layouts.",
    colors: { primary: "#FFB6B9", accent: "#A0E7E5", background: "#FFF7F0" },
  },
  {
    styleName: "Startup Pitch 🚀",
    bannerImage: TechSlider,
    designGuide:
      "Use bold and modern layouts with tech-inspired colors and fonts.",
    colors: { primary: "#0A3D76", accent: "#FFA500", background: "#F4F4F4" },
  },
];

type Props = {
  selectStyle: (style: DesignStyle) => void;
};

function SliderStyles({ selectStyle }: Props) {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  return (
    <div className="mt-16 select-none">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl font-bold text-[#0A3D76]"
      >
        Select Slider Style ✨
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-7 mt-10"
      >
        {Design_Styles.map((design) => (
          <motion.div
            key={design.styleName}
            onClick={() => {
              setSelectedStyle(design.styleName);
              selectStyle(design);
            }}
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 160 }}
            className={`relative rounded-2xl p-[2.5px]
              bg-linear-to-br from-[#FF9A3C40] via-[#F4F4F640] to-[#2B67A140]
              backdrop-blur-xl shadow-xl cursor-pointer transition-all
              ${
                design.styleName === selectedStyle
                  ? "scale-[1.03] ring-2 ring-[#FF7A1A] ring-offset-2 shadow-[0_0_25px_rgba(255,122,26,0.35)]"
                  : ""
              }`}
          >
            <div className="overflow-hidden rounded-2xl">
              <motion.img
                src={design.bannerImage}
                alt={design.styleName}
                className="w-full h-[150px] object-cover rounded-2xl group-hover:scale-110 transition-all"
              />
            </div>

            <h3 className="text-center mt-3 text-[15px] font-semibold text-[#1A1A1D]">
              {design.styleName}
            </h3>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default SliderStyles;
