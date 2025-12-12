import { useContext, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { firebaseDb } from "./../../config/FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserDetailContext } from "./../../context/UserDetailContext";
import Header from "@/components/customs/Header";
import PromptBox from "@/components/customs/PromptBox";
import MyProjects from "@/components/customs/MyProjects";
import { AnimatePresence, motion } from "framer-motion";

function Workspace() {
  const { user, isLoaded } = useUser();

  const { setUserDetail } = useContext(UserDetailContext);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      CreateNewUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const CreateNewUser = async () => {
    if (!user) return;

    const email =
      (user as any)?.primaryEmailAddress?.emailAddress ??
      (user as any)?.emailAddresses?.[0]?.emailAddress;
    if (!email) return;

    const docRef = doc(firebaseDb, "users", email);
    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserDetail(docSnap.data());
      } else {
        const data = {
          fullName: (user as any)?.fullName ?? null,
          email,
          createdAt: new Date(),
          credits: 3,
        };

        await setDoc(doc(firebaseDb, "users", email), data);
        setUserDetail(data);
      }
    } catch (err) {
      console.error("CreateNewUser error:", err);
    }
  };

  if (!user && isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-blue-50/40 px-6">
        <div className="bg-white/80 backdrop-blur-xl shadow-xl border border-gray-200 rounded-2xl p-10 max-w-md w-full text-center animate-fadeIn">
          <div className="mx-auto w-20 h-20 flex items-center justify-center bg-blue-100 rounded-full shadow-sm mb-6">
            <span className="text-4xl">🔒</span>
          </div>

          <h2 className="text-3xl font-semibold text-gray-800">
            Access Restricted
          </h2>

          <p className="text-gray-600 mt-3">
            Please sign in to access your workspace and continue.
          </p>

          <div className="mt-8">
            <SignInButton mode="modal">
              <button className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header />

      {/* GLOBAL BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F4F4F6] to-[#FFB05A]/20 -z-20" />

      {/* Global Blue Glow */}
      <div className="absolute w-[700px] h-[700px] bg-[#2B67A1]/25 blur-[130px] rounded-full -z-10 left-1/2 -translate-x-1/2 top-10"></div>

      {/* Page Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -25 }}
          transition={{ duration: 0.35 }}
        >
          {location.pathname === "/workspace" && (
            <div className="flex flex-col gap-24">
              <PromptBox />
              <MyProjects />
            </div>
          )}

          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Workspace;
