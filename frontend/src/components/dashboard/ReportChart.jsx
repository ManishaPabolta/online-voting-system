import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { BarChart3 } from "lucide-react";

const ReportChart = ({ data = [] }) => {
  const hasData =
    Array.isArray(data) && data.length > 0;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        delay: 0.15,
      }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl backdrop-blur-xl sm:p-6"
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-emerald-500/5 blur-3xl" />

      {/* Header */}
      <div className="relative mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
            <BarChart3 size={21} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white sm:text-xl">
              Voting Reports
            </h2>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Votes recorded across elections
            </p>
          </div>
        </div>

        <span className="w-fit rounded-full border border-teal-400/20 bg-teal-400/5 px-3 py-1.5 text-xs font-medium text-teal-300">
          Election Activity
        </span>
      </div>

      {/* Chart */}
      <div className="relative h-[300px] w-full sm:h-[350px]">
        {hasData ? (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -10,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148,163,184,0.10)"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                tick={{
                  fill: "#94a3b8",
                  fontSize: 11,
                }}
                axisLine={{
                  stroke:
                    "rgba(148,163,184,0.12)",
                }}
                tickLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fill: "#94a3b8",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                cursor={{
                  fill: "rgba(16,185,129,0.05)",
                }}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border:
                    "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "12px",
                  color: "#fff",
                  boxShadow:
                    "0 20px 40px rgba(0,0,0,0.35)",
                }}
                labelStyle={{
                  color: "#cbd5e1",
                  marginBottom: "4px",
                }}
              />

              <Bar
                dataKey="votes"
                fill="#10b981"
                radius={[
                  8,
                  8,
                  2,
                  2,
                ]}
                maxBarSize={55}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-800/20">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-500">
              <BarChart3 size={25} />
            </div>

            <p className="font-medium text-slate-300">
              No election data available
            </p>

            <p className="mt-1 text-center text-sm text-slate-500">
              Voting reports will appear here when election data is available.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ReportChart;