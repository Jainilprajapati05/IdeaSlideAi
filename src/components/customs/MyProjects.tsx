import { Button } from "../ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ArrowRight, FolderIcon } from "lucide-react";
import { motion } from "framer-motion";

function MyProjects() {
  // Function to scroll to PromptBox
  const scrollToPromptBox = () => {
    document
      .getElementById("promptBox")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="page-container flex justify-center items-start pt-15 px-6 pb-24">
      <div className="w-full max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-between items-center mb-10"
        >
          <h2 className="font-bold text-3xl tracking-tight bg-gradient-to-r from-[#0A3D76] to-[#2B67A1] bg-clip-text text-transparent">
            My Projects
          </h2>

          <Button
            className="rounded-xl px-5 py-2 shadow-md hover:shadow-lg hover:brightness-110 transition-all bg-gradient-to-r from-[#FF7A1A] to-[#FF9A3C] text-white"
            onClick={scrollToPromptBox}
          >
            + Create new Project
          </Button>
        </motion.div>

        {/* Empty Transparent Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="
            rounded-2xl 
            border border-white/20 
            bg-white/20 
            backdrop-blur-3xl 
            shadow-[0_8px_30px_rgba(0,0,0,0.08)]
            p-10 
            max-w-2xl 
            mx-auto
          "
        >
          <div className="pd-10">
            <Empty>
              {/* INNER COMPONENTS STYLED */}
              <EmptyHeader className="space-y-4">
                {/* Icon Box */}
                <EmptyMedia
                  variant="icon"
                  className="
                  bg-white/30 
                  p-4 
                  rounded-2xl 
                  border border-white/30 
                  shadow-[0_4px_20px_rgba(0,0,0,0.05)]
                "
                >
                  <FolderIcon className="w-9 h-9 text-[#2B67A1]/70" />
                </EmptyMedia>

                {/* Title */}
                <EmptyTitle
                  className="
                  text-2xl 
                  font-semibold 
                  tracking-tight 
                  bg-gradient-to-r from-[#0A3D76] to-[#3278C8]
                  bg-clip-text text-transparent
                "
                >
                  No Projects Yet
                </EmptyTitle>

                {/* Description */}
                <EmptyDescription
                  className="
                  text-sm 
                  text-black/70 
                  max-w-sm 
                  mx-auto 
                  leading-relaxed
                "
                >
                  You haven&apos;t created any projects yet. Start by creating
                  your first project — it will appear here.
                </EmptyDescription>
              </EmptyHeader>

              {/* Buttons */}
              <EmptyContent className="mt-6">
                <div className="flex gap-3 justify-center">
                  <Button
                    className="
                    px-5 py-2 
                    rounded-xl 
                    bg-gradient-to-r from-[#FF7A1A] to-[#FF9A3C] 
                    text-white 
                    shadow-md 
                    hover:shadow-xl 
                    transition
                  "
                    onClick={scrollToPromptBox}
                  >
                    Create Project
                  </Button>
                </div>
              </EmptyContent>

              {/* Learn More */}
              <Button
                variant="link"
                asChild
                className="
                text-black/60 
                mt-2 
                hover:text-[#0A3D76] 
                transition
              "
                size="sm"
              >
                <a href="#">
                  Learn More <ArrowRight className="ml-1 w-4 h-4" />
                </a>
              </Button>
            </Empty>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default MyProjects;
