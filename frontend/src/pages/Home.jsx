import {
  ShieldCheck,
  Vote,
  Users,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

const Home = () => {
  return (
    <MainLayout>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center min-h-[85vh]">

        <div>

          <span className="bg-blue-500/20 text-blue-400 px-5 py-2 rounded-full">
            Secure Digital Elections
          </span>

          <h1 className="text-6xl font-black leading-tight mt-6">
            Vote From
            Anywhere
            Securely
          </h1>

          <p className="text-gray-400 text-lg mt-6 leading-relaxed">
            Modern online voting
            platform with facial
            verification, live vote
            tracking and advanced
            election security.
          </p>

          <div className="flex items-center gap-5 mt-10">

            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl font-bold transition"
            >
              Get Started
            </Link>

            <Link
              to="/elections"
              className="border border-white/20 hover:bg-white/10 px-8 py-4 rounded-2xl font-bold transition"
            >
              View Elections
            </Link>

          </div>

        </div>

        <div className="grid grid-cols-1 gap-6">

          <div className="bg-white/10 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">

            <ShieldCheck
              size={50}
              className="text-green-400"
            />

            <h2 className="text-2xl font-bold mt-5">
              Face Verification
            </h2>

            <p className="text-gray-400 mt-3">
              AI based voter identity
              verification for secure
              elections.
            </p>

          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">

            <Vote
              size={50}
              className="text-blue-400"
            />

            <h2 className="text-2xl font-bold mt-5">
              Secure Voting
            </h2>

            <p className="text-gray-400 mt-3">
              Encrypted vote casting
              with audit tracking.
            </p>

          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">

            <Users
              size={50}
              className="text-purple-400"
            />

            <h2 className="text-2xl font-bold mt-5">
              Real-time Results
            </h2>

            <p className="text-gray-400 mt-3">
              Live election updates &
              transparent statistics.
            </p>

          </div>

        </div>

      </section>

    </MainLayout>
  );
};

export default Home;