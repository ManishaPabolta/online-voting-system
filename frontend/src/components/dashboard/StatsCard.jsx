import { motion } from "framer-motion";

const StatsCard = ({
  title,
  value,
  icon,
  color,
}) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.03,
      }}

      className={`bg-gradient-to-br ${color} rounded-3xl p-6 shadow-2xl border border-white/10`}
    >

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-200">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-3">
            {value}
          </h2>

        </div>

        <div className="bg-white/10 p-4 rounded-2xl">
          {icon}
        </div>

      </div>

    </motion.div>
  );
};

export default StatsCard;