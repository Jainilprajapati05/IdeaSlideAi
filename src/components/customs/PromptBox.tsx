import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "../ui/input-group";

import { ArrowUp, Loader2Icon } from "lucide-react";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useUser } from "@clerk/clerk-react";
import { firebaseDb } from "../../../config/FirebaseConfig";
import { useNavigate } from "react-router-dom";

function PromptBox() {
  const [userInput, setUserInput] = useState<string>("");
  const [noOfSlider, SetNoOfSlider] = useState<string>("4-6");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getUserEmail = (): string | null => {
    // be defensive with Clerk user shape
    // primaryEmailAddress may be undefined in some SDK shapes
    // fallback to user.emailAddresses[0].emailAddress if present
    try {
      // @ts-ignore - some clerk shapes differ
      const primary = user?.primaryEmailAddress?.emailAddress;
      if (primary) return primary;
      // @ts-ignore
      if (Array.isArray(user?.emailAddresses) && user.emailAddresses[0]) {
        // @ts-ignore
        return user.emailAddresses[0].emailAddress;
      }
      return null;
    } catch {
      return null;
    }
  };

  const CreateAndSaveProject = async () => {
    if (!userInput || userInput.trim().length === 0) {
      alert("Please describe the topic for the slides.");
      return;
    }

    const projectId = uuidv4();
    setLoading(true);

    try {
      const createdBy = getUserEmail();

      const payload = {
        createdAt: serverTimestamp(),
        createdBy: createdBy,
        designStyle: null,
        noOfSliders: noOfSlider,
        outline: [],
        projectId: projectId,
        userInputPrompt: userInput,
      };

      await setDoc(doc(firebaseDb, "projects", projectId), payload, {
        merge: true,
      });

      // navigate to outline editor
      navigate(`/workspace/project/${projectId}/outline`);
    } catch (err) {
      console.error("Failed to create project:", err);
      alert("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="promptBox"
      className="page-container flex justify-center items-center px-6 mt-40"
    >
      <div className="flex flex-col items-center text-center max-w-3xl space-y-5 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="font-bold text-4xl md:text-5xl leading-snug 
          bg-gradient-to-r from-[#0A3D76] to-[#2B67A1] bg-clip-text text-transparent"
        >
          Describe your topic — we’ll design
          <span className="text-[#FF7A1A]"> AI PPT Slides</span>
          <span className="text-white ml-2">✨</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-lg text-[#1A1A1D]/70"
        >
          Your design will be saved as a new project automatically.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full"
        >
          <InputGroup className="shadow-xl rounded-2xl border border-[#8A8F98]/30 backdrop-blur-xl">
            <InputGroupTextarea
              placeholder="Explain what kind of PPT slides you want..."
              className="min-h-40 text-lg placeholder:text-[#8A8F98] focus:ring-2 focus:ring-[#FF7A1A]/50"
              value={userInput}
              onChange={(event) => setUserInput(event.target.value)}
            />

            <InputGroupAddon align="block-end" className="space-x-3">
              <Select onValueChange={(value) => SetNoOfSlider(value)}>
                <SelectTrigger className="w-[190px] rounded-xl border-[#8A8F98]/40 shadow-sm bg-white/70 backdrop-blur-lg hover:border-[#2B67A1] transition">
                  <SelectValue placeholder="Select slide count" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Number of Slides</SelectLabel>
                    <SelectItem value="4-6">4–6 Slides</SelectItem>
                    <SelectItem value="6-8">6–8 Slides</SelectItem>
                    <SelectItem value="8-12">8–12 Slides</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <div className="flex w-full">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 2 }}
                  className="ml-auto"
                >
                  <InputGroupButton
                    variant="default"
                    className="rounded-full bg-gradient-to-r from-[#FF7A1A] to-[#FF9A3C] 
                    text-white shadow-lg hover:shadow-2xl hover:brightness-110 transition-all"
                    size="icon-sm"
                    onClick={CreateAndSaveProject}
                    disabled={!userInput || loading}
                  >
                    {loading ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      <ArrowUp className="w-5 h-5" />
                    )}
                  </InputGroupButton>
                </motion.div>
              </div>
            </InputGroupAddon>
          </InputGroup>
        </motion.div>
      </div>
    </div>
  );
}

export default PromptBox;
