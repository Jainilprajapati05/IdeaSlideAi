import { useEffect, useState } from "react";
import SliderStyles from "./../../components/customs/SliderStyles";
import type { DesignStyle } from "./../../components/customs/SliderStyles";
import OutlieSection from "@/components/customs/OutlieSection";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Outline } from "@/types/outline";
import { useParams } from "react-router-dom";

import {
  firebaseDb,
  GeminiAiStreamingModel,
  GeminiAiStreamingModelLite,
  generateContentWithRetry,
} from "../../../config/FirebaseConfig";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function OutlinePage() {
  const { projectId } = useParams();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [outlineData, setOutlineData] = useState<Outline[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle | null>(null);
  const [slidesHTML, setSlidesHTML] = useState<string[]>([]);

  const dummyOutlines: Outline[] = [
    {
      slideNo: "1",
      slidePoint: "Welcome Screen",
      outline: "This slide introduces the presentation.",
    },
    {
      slideNo: "2",
      slidePoint: "Agenda",
      outline: "Overview of the main points.",
    },
    {
      slideNo: "3",
      slidePoint: "Introduction",
      outline: "Explains what the topic is and why it matters.",
    },
    {
      slideNo: "4",
      slidePoint: "Main Concept",
      outline: "Highlights the key idea.",
    },
    {
      slideNo: "5",
      slidePoint: "Thank You",
      outline: "Final slide with gratitude.",
    },
  ];

  // Load project details from Firestore
  const loadProjectDetail = async () => {
    if (!projectId) {
      setOutlineData(dummyOutlines);
      return;
    }
    setLoading(true);
    try {
      const ref = doc(firebaseDb, "projects", projectId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setSelectedStyle(data?.designStyle ?? null);
        setOutlineData(
          Array.isArray(data?.outline) && data.outline.length > 0
            ? data.outline
            : dummyOutlines
        );
        setSlidesHTML(data?.slides ?? []);
      } else {
        setOutlineData(dummyOutlines);
      }
    } catch (err) {
      console.error("Error fetching project:", err);
      setOutlineData(dummyOutlines);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectDetail();
  }, [projectId]);

  // Save current outline, style, and slides
  const handleSaveProject = async () => {
    if (!projectId) return;
    setSaving(true);
    try {
      await setDoc(
        doc(firebaseDb, "projects", projectId),
        {
          outline: outlineData,
          designStyle: selectedStyle,
          slides: slidesHTML,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Generate slides using AI
  const handleGenerateSlides = async () => {
    if (!projectId || !selectedStyle) return;
    setGenerating(true);

    try {
      await handleSaveProject();

      const SLIDER_PROMPT = `Format my prompt: 
Generate HTML using TailwindCSS + Flowbite UI + Lucide Icons for a fully responsive 16:9 Modern Dark Slide layout. 
Apply premium UI principles with semantic structure, smooth spacing, and adaptive layout selection.

${selectedStyle.designGuide ?? ""}

Design Rules:
- Use a true 16:9 responsive container with safe-area padding.
- Apply modern dark UI patterns with subtle gradients, soft shadows, and minimal borders.
- Use Tailwind colors such as primary, accent, gradient, background, plus this color set: ${JSON.stringify(
        selectedStyle.colors ?? []
      )}
- Use Flowbite typography + spacing standards.
- Automatically choose layout structure based on content density (split layout, centered, media-left, media-right, stacked, grid).

Content Rules:
- Transform my text into clean slide sections (Title → Subtitle → Points → Visuals).
- Improve readability using spacing, highlights, contrast.
- Emphasize keywords using Tailwind utilities.

Metadata Rules:
- Use my slide metadata here: ${JSON.stringify(outlineData)}

Output Rules:
- Return only the <body> content.
- Code must be clean, production-ready, and professionally structured.
- Include smooth Tailwind transitions for a premium feel.
- Must match 16:9 PPT-style slide output with modern dark aesthetics.
`;

      const result = await generateContentWithRetry(
        GeminiAiStreamingModel,
        SLIDER_PROMPT,
        2,
        GeminiAiStreamingModelLite
      );
      const text = result.response.text();
      setSlidesHTML([text]);
      await setDoc(
        doc(firebaseDb, "projects", projectId),
        { slides: [text], updatedAt: serverTimestamp() },
        { merge: true }
      );
    } catch (err) {
      console.error("Error generating slides:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="w-full flex justify-center mt-16 pt24 relative select-none">
      <div className="w-full max-w-4xl px-6">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-800 to-blue-400 bg-clip-text text-transparent">
          Settings & Slider Styles
        </h2>

        <div className="mt-12 space-y-8">
          <SliderStyles selectStyle={setSelectedStyle} />
          <OutlieSection
            loading={loading}
            outlineData={outlineData}
            onSave={setOutlineData}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          whileHover={{ y: -6, scale: 1.05 }}
        >
          <Button
            size="lg"
            disabled={saving || generating || loading || !selectedStyle}
            onClick={handleGenerateSlides}
            className="px-10 py-4 rounded-2xl text-lg bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-lg"
          >
            {generating ? "Generating..." : "Start Generating"}
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </motion.div>

        {slidesHTML.length > 0 && (
          <div className="mt-12 space-y-6">
            {slidesHTML.map((slide, i) => (
              <div key={i} className="p-4 border rounded-lg bg-gray-50">
                <div dangerouslySetInnerHTML={{ __html: slide }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
