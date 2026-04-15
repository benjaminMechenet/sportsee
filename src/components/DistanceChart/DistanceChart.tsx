import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import type { WeekData } from "../../services/groupDataService";
import "./DistanceChart.css";

function DistanceChart({ weeksData }: { weeksData: WeekData[] }) {
  const WeeklyTooltip = ({ active, payload }: TooltipContentProps) => {
    const isVisible = active && payload && payload.length;
    if (payload[0]?.payload?.dates?.start) {
      return (
        <div
          className="custom-tooltip"
          style={{ visibility: isVisible ? "visible" : "hidden" }}
        >
          {isVisible && (
            <>
              <p className="mb-0">
                Du{" "}
                {new Date(payload[0].payload.dates.start)
                  .toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                  })
                  .replace("/", ".")}{" "}
                au{" "}
                {new Date(payload[0].payload.dates.end)
                  .toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                  })
                  .replace("/", ".")}{" "}
              </p>
              <p className="fs-5 mb-0">{payload[0].value} km</p>
            </>
          )}
        </div>
      );
    }
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart responsive data={weeksData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis tickFormatter={(index) => `S${index + 1}`} />
        <YAxis dataKey="distance" width={20} />
        <Tooltip cursor={false} content={WeeklyTooltip} />
        <Legend />
        <Bar
          dataKey="distance"
          label={({ name, value }) => `${value} ${name}`}
          barSize={20}
          fill="#B6BDFC"
          activeBar={{ fill: "#0B23F4" }}
          radius={[10, 10, 10, 10]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default DistanceChart;
