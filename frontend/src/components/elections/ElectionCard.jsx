import { motion } from "framer-motion";

import {
  Calendar,
  Users,
  ArrowRight,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

const ElectionCard = ({
  election,
}) => {
  return (
    <motion.div
      whileHover={{
        y: -5,
      }}

      className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
    >

      <div className="h-48 overflow-hidden">

        <img
          src={
            election.image ||
            "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620"
          }
          alt={election.title}
          className="w-full h-full object-cover"
        />

      </div>

      <div className="p-6">

        <div className="flex items-center justify-between mb-4">

          <span className="bg-green-500/20 text-green-400 px-4 py-1 rounded-full text-sm">
            Active
          </span>

          <div className="flex items-center gap-2 text-gray-300 text-sm">

            <Users size={16} />

            <span>
              {
                election.totalVoters
              }{" "}
              Voters
            </span>

          </div>

        </div>

        <h2 className="text-2xl font-bold mb-3">
          {election.title}
        </h2>

        <p className="text-gray-400 line-clamp-3">
          {
            election.description
          }
        </p>

        <div className="flex items-center gap-2 mt-5 text-gray-300">

          <Calendar size={18} />

          <span>
            {election.startDate}
          </span>

        </div>

        <Link
          to={`/elections/${election._id}`}
          className="mt-6 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all duration-300 py-3 rounded-2xl font-semibold"
        >
          View Election
          <ArrowRight size={18} />
        </Link>

      </div>

    </motion.div>
  );
};

export default ElectionCard;