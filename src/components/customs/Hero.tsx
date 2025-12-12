import { useState } from "react";
import { Button } from "../ui/button";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import { HeroVideoDialog } from "./HeroVideoDialog";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

function Hero() {
  const { user } = useUser();
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="relative pt-32 pb-20 flex flex-col items-center justify-center px-6 mb-2 select-none">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-6xl font-bold text-center leading-tight 
        bg-gradient-to-r from-[#0A3D76] to-[#2B67A1] bg-clip-text text-transparent drop-shadow-xl"
      >
        From Idea to Presentation
        <span className="block mt-1">
          in one click <span className="text-black">⚡️</span>
        </span>
      </motion.h1>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="max-w-2xl text-center text-[#1A1A1D]/70 text-lg mt-5"
      >
        Your ideas. Our AI. Clean, editable presentations created instantly —
        fast, simple, and beautifully designed.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="flex gap-6 mt-10"
      >
        {/* Watch Video */}
        <motion.div whileHover={{ scale: 1.08, rotate: -1 }}>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowVideo(true)}
            className="flex items-center gap-2 border-[#8A8F98] 
            hover:bg-[#F4F4F6] transition-all duration-300 
            rounded-xl px-7 py-5 text-lg shadow-sm text-[#1A1A1D]"
          >
            Watch video <Play className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Get Started Button */}
        <motion.div whileHover={{ scale: 1.15, rotate: 1 }}>
          {!user ? (
            <SignInButton mode="modal">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#FF7A1A] to-[#FF9A3C] text-white 
                font-semibold shadow-lg hover:shadow-2xl hover:brightness-110 
                transition-all duration-300 rounded-xl px-7 py-5 text-lg"
              >
                Get Started
              </Button>
            </SignInButton>
          ) : (
            <Link to="/workspace">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#FF7A1A] to-[#FF9A3C] text-white 
                font-semibold shadow-lg hover:shadow-2xl hover:brightness-110 
                transition-all duration-300 rounded-xl px-7 py-5 text-lg"
              >
                Go to Workspace
              </Button>
            </Link>
          )}
        </motion.div>
      </motion.div>

      {/* Hidden Video Dialog */}
      {showVideo && (
        <HeroVideoDialog
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc=""
          thumbnailAlt=""
          className="hidden"
        />
      )}

      {/* Video Preview Section */}
      <motion.div
        initial={{ opacity: 0, y: 70 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="relative max-w-3xl mt-14 flex flex-col items-center"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-lg text-[#1A1A1D]/70 mb-4"
        >
          Watch how to create AI PPT
        </motion.h2>

        {/* Light Mode Thumbnail */}
        <motion.div
          whileHover={{ scale: 1.03, rotate: 0.3 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="cursor-pointer"
        >
          <HeroVideoDialog
            className="block dark:hidden"
            animationStyle="from-center"
            videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
            thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
            thumbnailAlt="Hero Video"
          />
        </motion.div>

        {/* Dark Mode Thumbnail */}
        <motion.div
          whileHover={{ scale: 1.03, rotate: 0.3 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="hidden dark:block cursor-pointer"
        >
          <HeroVideoDialog
            animationStyle="from-center"
            videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
            thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
            thumbnailAlt="Hero Video"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Hero;
