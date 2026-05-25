import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center overflow-hidden">

      <motion.div
        initial={{
          scale: 0.8,
          opacity: 0,
        }}

        animate={{
          scale: 1,
          opacity: 1,
        }}

        transition={{
          duration: 0.5,
        }}

        className="relative"
      >

        <div className="h-28 w-28 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin"></div>

        <div className="absolute inset-0 flex items-center justify-center">

          <div className="h-16 w-16 rounded-full bg-blue-600/20 backdrop-blur-xl border border-blue-500/30"></div>

        </div>

      </motion.div>

      <motion.h1
        initial={{
          y: 20,
          opacity: 0,
        }}

        animate={{
          y: 0,
          opacity: 1,
        }}

        transition={{
          delay: 0.2,
        }}

        className="mt-8 text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
      >
        VoteSecure
      </motion.h1>

      <motion.p
        initial={{
          opacity: 0,
        }}

        animate={{
          opacity: 1,
        }}

        transition={{
          delay: 0.4,
        }}

        className="text-gray-400 mt-3 text-sm tracking-widest uppercase"
      >
        Secure Online Voting System
      </motion.p>

      <motion.div
        initial={{
          width: 0,
        }}

        animate={{
          width: "200px",
        }}

        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}

        className="h-1 bg-blue-500 rounded-full mt-8"
      />

    </div>
  );
};

export default Loader;