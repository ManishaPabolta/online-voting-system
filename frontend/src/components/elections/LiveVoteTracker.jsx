import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const LiveVoteTracker = ({ data = [] }) => {
  const chartData = Array.isArray(data) ? data : [];

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl sm:p-6">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-white">
          Vote Distribution
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          Vote data returned by the election results API.
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-[280px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/30">
          <p className="text-sm text-slate-500">
            No vote results available.
          </p>
        </div>
      ) : (
        <div className="h-[280px] w-full sm:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: -15,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.08)"
              />

              <XAxis
                dataKey="name"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                cursor={{ fill: "rgba(16,185,129,0.06)" }}
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />

              <Bar
                dataKey="votes"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
                maxBarSize={55}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default LiveVoteTracker;