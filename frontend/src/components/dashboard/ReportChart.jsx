import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  {
    name: "Election 1",
    votes: 400,
  },

  {
    name: "Election 2",
    votes: 650,
  },

  {
    name: "Election 3",
    votes: 900,
  },

  {
    name: "Election 4",
    votes: 500,
  },
];

const ReportChart = () => {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">

      <h2 className="text-2xl font-bold mb-6">
        Voting Reports
      </h2>

      <div className="h-[350px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <BarChart data={data}>

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