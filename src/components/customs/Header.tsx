import { useContext } from "react";
import logo from "../../assets/applogo.png";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";

import { Gem } from "lucide-react";
import { UserDetailContext } from "./../../../context/UserDetailContext";

function Header() {
  const { isSignedIn } = useUser();
  const location = useLocation();
  const { userDetail } = useContext(UserDetailContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 w-full backdrop-blur-xl bg-white/70 shadow-sm flex items-center justify-between px-10 py-4 z-50"
    >
      {/* LOGO */}
      <motion.img
        src={logo}
        alt="logo"
        width={75}
        height={75}
        whileHover={{ scale: 1.1, rotate: 2 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="cursor-pointer ml-5"
      />

      {/* RIGHT SECTION */}
      {!isSignedIn ? (
        <motion.div whileHover={{ scale: 1.08 }}>
          <SignInButton>
            <Button className="bg-gradient-to-r from-[#FF7A1A] to-[#FF9A3C] text-white rounded-xl px-5 py-2 text-lg shadow-md hover:shadow-xl transition-all">
              Get Started
            </Button>
          </SignInButton>
        </motion.div>
      ) : (
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <UserButton />

          {location.pathname.includes("workspace") ? (
            <div className="flex items-center p-2 px-3 gap-2 bg-orange-100 rounded-full">
              <Gem />
              {userDetail?.credits ?? 0}
            </div>
          ) : (
            <Link to="/workspace">
              <Button className="bg-gradient-to-r from-[#FF7A1A] to-[#FF9A3C] text-white rounded-xl px-5 py-2 shadow-md hover:shadow-xl transition-all">
                Go to Workspace
              </Button>
            </Link>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export default Header;
