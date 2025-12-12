import "./App.css";
import Header from "./components/customs/Header";
import Hero from "./components/customs/Hero";
import { motion } from "framer-motion";

function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 🔥 Full Page Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F4F4F6] to-[#FFB05A]/20 -z-30" />

      {/* 🔥 Full Page Soft Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.35, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute w-[900px] h-[900px] bg-[#2B67A1]/25 blur-[140px] rounded-full -z-20 top-1/3 left-1/4"
      />

      {/* 🔥 Full Page Floating Blob Left */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-20 left-10 w-72 h-72 bg-[#0A3D76]/30 blur-3xl rounded-full -z-10"
      />

      {/* 🔥 Full Page Floating Blob Right */}
      <motion.div
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute bottom-20 right-10 w-72 h-72 bg-[#FF9A3C]/40 blur-3xl rounded-full -z-10"
      />

      {/* Your Components */}
      <Header />
      <Hero />
    </div>
  );
}

export default App;
