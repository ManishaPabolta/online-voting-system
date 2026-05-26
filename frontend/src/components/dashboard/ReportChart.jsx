import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const ReportChart = ({
  data = [],
}) => {

  return (

    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl w-full">

      <h2 className="text-2xl font-bold mb-6">
        Voting Reports
      </h2>

      {/* FIXED HEIGHT */}
      <div
        style={{
          width: "100%",
          height: 350,
          minHeight: 300,
        }}
      >

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <BarChart
            data={data}
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="votes"
              fill="#6366f1"
              radius={[8, 8, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default ReportChart;