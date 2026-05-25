import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const ReportChart = ({ data = [] }) => {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl w-full">

      <h2 className="text-2xl font-bold mb-6">
        Voting Reports
      </h2>

      <div className="w-full h-[350px] min-h-[300px]">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart data={data || []}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Bar dataKey="votes" />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default ReportChart;