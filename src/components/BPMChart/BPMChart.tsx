import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { UserActivity } from "../../services/authService";

function BPMChart({ selectedWeek }: { selectedWeek: UserActivity[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart className="btm-chart" data={selectedWeek}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis />
        <YAxis width={30} domain={[130, 190]} />
        <Legend />
        <Bar
          dataKey="heartRate.min"
          fill="#fcc1b6"
          radius={[10, 10, 10, 10]}
          barSize={12}
          name="Min BPM"
        />
        <Bar
          dataKey="heartRate.max"
          fill="#f4320b"
          radius={[10, 10, 10, 10]}
          barSize={12}
          name="Max BPM"
        />
        <Line
          isAnimationActive={false}
          name="Moyenne"
          type="monotone"
          dataKey="heartRate.average"
          stroke="#0b23f4"
          strokeWidth={3}
          dot={{ r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default BPMChart;
