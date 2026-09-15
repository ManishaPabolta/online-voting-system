import { motion } from "framer-motion";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <div className="min-h-screen lg:ml-72">
        <Navbar />

        <motion.main
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="
            min-h-[calc(100vh-4rem)]
            bg-gradient-to-br
            from-slate-950
            via-slate-900
            to-emerald-950/20
            px-4
            py-6
            sm:px-6
            lg:px-8
            xl:px-10
          "
        >
          <div className="mx-auto w-full max-w-[1600px]">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default DashboardLayout;