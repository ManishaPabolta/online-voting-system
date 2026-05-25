import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const LiveVoteTracker = ({ data = [] }) => {
  return (
    <div style={{ width: "100%", height: "300px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="votes" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiveVoteTracker;