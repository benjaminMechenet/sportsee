import { useUser } from "../../context/UserContext";
import {
  Pie,
  PieChart,
  type PieSectorShapeProps,
  ResponsiveContainer,
  Sector,
} from "recharts";

function GoalChart() {
  const { user } = useUser();
  const COLORS = ["#0B23F4", "#B6BDFC"];
  const GoalPie = (props: PieSectorShapeProps) => {
    return <Sector {...props} fill={COLORS[props.index % COLORS.length]} />;
  };

  return (
    <ResponsiveContainer>
      <PieChart>
        <Pie
          startAngle={180}
          endAngle={540}
          shape={GoalPie}
          label={({ name, value }) => `${value} ${name}`}
          data={[
            { name: "réalisé(s)", value: user?.goal },
            { name: "restant(s)", value: 6 - (user?.goal ?? 0) },
          ]}
          innerRadius={70}
          outerRadius={120}
          dataKey="value"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default GoalChart;
