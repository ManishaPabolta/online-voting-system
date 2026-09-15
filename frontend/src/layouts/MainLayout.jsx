import { motion } from "framer-motion";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white">
      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-400/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <motion.main
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="
            mx-auto
            w-full
            max-w-7xl
            flex-1
            px-4
            py-6
            sm:px-6
            sm:py-8
            lg:px-8
            lg:py-10
          "
        >
          {children}
        </motion.main>

        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;