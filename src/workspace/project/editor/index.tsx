import OutlieSection from "@/components/customs/OutlieSection";

import {
  firebaseDb,
  GeminiAiStreamingModel,
  GeminiAiStreamingModelLite,
  generateContentWithRetry,
} from "./../../../../config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Project } from "@/types/Project";
import SliderFrame from "@/components/customs/SliderFrame";

const SLIDER_PROMPT = `Generate HTML (TailwindCSS + Flowbite UI + Lucide Icons) 
code for a 16:9 ppt slider in Modern Dark style.
{DESIGN_STYLE}. No responsive design; use a fixed 16:9 layout for slides.
Use Flowbite component structure. Use different layouts depending on content and style.
Use TailwindCSS colors like primary, accent, gradients, background, etc., and include colors from {COLORS_CODE}.
MetaData for Slider: {METADATA}

- Ensure images are optimized to fit within their container div and do not overflow.
- Use proper width/height constraints on images so they scale down if needed to remain inside the slide.
- Maintain 16:9 aspect ratio for all slides and all media.
- Use CSS classes like 'object-cover' or 'object-contain' for images to prevent stretching or overflow.
- Use grid or flex layouts to properly divide the slide so elements do not overlap.

Generate Image if needed using:
'https://ik.imagekit.io/ikmedia/ik-genimg-prompt-{imagePrompt}/{altImageName}.jpg'
Replace {imagePrompt} with relevant image prompt and altImageName with a random image name.  

<!-- Slide Content Wrapper (Fixed 16:9 Aspect Ratio) -->
<div class="w-[800px] h-[500px] relative overflow-hidden">
  <!-- Slide content here -->
</div>
Also do not add any overlay : Avoid this :
    <div class="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-20"></div>


Just provide body content for 1 slider. Make sure all content, including images, stays within the main slide div and preserves the 16:9 ratio.`;

function Editor() {
  const { projectId } = useParams();
  const [projectDetail, setProjectDetail] = useState<Project>();
  const [loading, setLoading] = useState(false);

  const [sliders, setSliders] = useState<{ code: string }[]>([]);

  const loadProjectDetail = async () => {
    setLoading(true);
    const ref = doc(firebaseDb, "projects", projectId as string);
    const snap = await getDoc(ref);

    const data = snap.data() as Project;

    console.log(data);
    setProjectDetail(data);
    setLoading(false);
  };

  const GenerateSlides = async () => {
    const prompt = SLIDER_PROMPT.replace(
      "{DESIGN_STYLE}",
      projectDetail?.designStyle?.designGuide ?? ""
    )
      .replace(
        "{COLORS_CODE}",
        JSON.stringify(projectDetail?.designStyle?.colors)
      )
      .replace("{METADATA}", JSON.stringify(projectDetail?.outline[0]));

    const result = await generateContentWithRetry(
      GeminiAiStreamingModel,
      prompt,
      2,
      GeminiAiStreamingModelLite
    );
    const finalText = result.response
      .text()
      .replace("```html", "")
      .replace("```", "");
    setSliders(() => [{ code: finalText }]); // always 1 slide for now
  };

  useEffect(() => {
    loadProjectDetail();
  }, [projectId]);

  useEffect(() => {
    if (projectDetail && !projectDetail.slides?.length) {
      GenerateSlides();
    } else if (projectDetail?.slides?.length) {
      setSliders(projectDetail.slides); // load existing slides
    }
  }, [projectDetail]);

  return (
    <div className="grid grid-cols-5 pt-30">
      <div className="col-span-2 h-screen overflow-auto">
        <OutlieSection
          loading={loading}
          outlineData={projectDetail?.outline ?? []}
          onSave={(updated) => console.log("Updated Outline:", updated)}
        />
      </div>

      <div className="col-span-3">
        {sliders?.map((slide, index) => (
          <SliderFrame
            key={index}
            slide={slide}
            colors={projectDetail?.designStyle?.colors}
            setUpdateSlider={(updated: string) => {
              setSliders((prev) => {
                const updatedArr = [...prev];
                updatedArr[index] = { code: updated };
                return updatedArr;
              });
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Editor;
