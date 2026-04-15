import { useUser } from "../../context/UserContext";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProfilePicture from "../../components/ProfilePicture/ProfilePicture";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";
import DateSelector from "../../components/DateSelector/DateSelector";
import { getUserActivity } from "../../services/authService";
import type { UserActivity } from "../../services/authService";
import type { WeekData } from "../../services/groupDataService";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Dashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ComposedChart,
  Line,
  PieChart,
  Pie,
  type PieSectorShapeProps,
  Sector,
  type TooltipContentProps,
} from "recharts";
import {
  fetchCurrentWeekOffset,
  getWeeksBounds,
  groupDataByWeek,
} from "../../services/groupDataService";

function Dashboard() {
  const { user } = useUser();
  const auth = useAuth();

  const [weeksData, setWeeksData] = useState<WeekData[]>([]);
  const [currentWeek, setCurrentWeek] = useState<UserActivity[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<UserActivity[]>([]);

  const [multiWeekBaseOffset, setMultiWeekBaseOffset] = useState(0);

  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0);

  const intl = new Intl.DateTimeFormat("fr-CA");

  const multiBounds = getWeeksBounds(multiWeekBaseOffset, 4);
  const currentBounds = getWeeksBounds(0, 1);
  const selectedBounds = getWeeksBounds(selectedWeekOffset, 1);

  const multiStartDate = intl.format(multiBounds.start);
  const multiEndDate = intl.format(multiBounds.end);
  const formatter = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  });

  const multiDisplay = `${formatter.format(multiBounds.start)} – ${formatter.format(multiBounds.end)}`;
  const selectedDisplay = `${formatter.format(selectedBounds.start)} – ${formatter.format(selectedBounds.end)}`;

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await getUserActivity(
          auth.token!,
          multiStartDate,
          multiEndDate,
        );
        setWeeksData(groupDataByWeek(multiStartDate, multiEndDate, response));

        setCurrentWeek(await fetchCurrentWeekOffset(auth.token!, 0));

        setSelectedWeek(
          await fetchCurrentWeekOffset(auth.token!, selectedWeekOffset),
        );
      } catch (err) {
        alert("Erreur de connexion : " + err);
      }
    };
    fetchActivity();
  }, [
    auth.token,
    multiStartDate,
    multiEndDate,
    multiWeekBaseOffset,
    selectedWeekOffset,
  ]);

  const COLORS = ["#0B23F4", "#B6BDFC"];
  const GoalPie = (props: PieSectorShapeProps) => {
    return <Sector {...props} fill={COLORS[props.index % COLORS.length]} />;
  };

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
    <div className="d-flex flex-column justify-content-between gap-5">
      <Header />
      <div className="card d-flex flex-row justify-content-between border-0 py-4 px-5 w-75 mx-auto rounded-4 mt-5 bg-fade">
        <div className="d-flex flex-row align-items-center gap-3">
          <ProfilePicture />
          <ProfileInfo />
        </div>
        {user?.statistics.totalDistance && (
          <div className="d-flex flex-row align-items-center gap-3">
            Distance totale parcourue
            <div className="p-4 rounded-3 bg-blue text-center d-flex gap-3 align-items-center">
              <img className="fade-slide-up" src="/distance-icon.svg" />
              <div className="fade-slide-up">
                <span className="fs-3">{user?.statistics.totalDistance} </span>
                km
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-75 mx-auto">
        <h2 className="mb-4">Vos dernières performances</h2>
        <div className="d-flex flex-row gap-5">
          <div className="card border-0 py-4 w-45 px-5 d-flex flex-column gap-5">
            <div className="d-flex flex-row justify-content-between align-items-start">
              <div>
                <div className="text-blue fs-4">
                  {Number(
                    (
                      weeksData.reduce((sum, item) => sum + item.distance, 0) /
                      weeksData.length
                    ).toFixed(2),
                  )}
                  km en moyenne
                </div>
                Total des kilomètres 4 dernières semaines
              </div>
              <DateSelector
                dates={multiDisplay}
                onPrev={() =>
                  setMultiWeekBaseOffset((offset: number) => offset + 4)
                }
                onNext={() =>
                  setMultiWeekBaseOffset((offset: number) =>
                    Math.max(0, offset - 4),
                  )
                }
              />
            </div>
            <div className="w-100">
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
            </div>
          </div>

          <div className="card border-0 w-50 py-4 px-5 d-flex flex-column gap-5 flex-grow-1">
            <div className="d-flex flex-row justify-content-between align-items-start">
              <div>
                <div className="text-red lh-sm fs-4">
                  {selectedWeek.find((item) => item.caloriesBurned > 0)
                    ? Number(
                        (
                          selectedWeek.reduce(
                            (sum, item) => sum + item.heartRate.average,
                            0,
                          ) /
                          selectedWeek.filter((item) => item.caloriesBurned > 0)
                            .length
                        ).toFixed(2),
                      ) + " BPM"
                    : "Pas de donnés pour la semaine selectionnée"}{" "}
                </div>
                Fréquence cardiaque moyenne
              </div>
              <DateSelector
                dates={selectedDisplay}
                onPrev={() => setSelectedWeekOffset((offset) => offset + 1)}
                onNext={() =>
                  setSelectedWeekOffset((offset) => Math.max(0, offset - 1))
                }
              />
            </div>
            <div className="w-100">
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart className="btm-chart" data={selectedWeek}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis />
                  <YAxis domain={[130, 190]} />
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
            </div>
          </div>
        </div>
      </div>

      <div className="w-75 mx-auto">
        <h2>Cette semaine</h2>
        <h5>
          Du {currentBounds.start.toLocaleDateString()} au{" "}
          {currentBounds.end.toLocaleDateString()}
        </h5>
        <div className="d-flex flex-row gap-5 mt-4">
          <div className="card border-0 py-4 px-5 w-45 d-flex flex-column">
            <p className="mb-0 fs-4 text-pale-blue">
              <span className="text-blue fw-bold fs-2">
                x{user?.goal ?? 0}{" "}
              </span>
              sur objectif de {6}
            </p>
            <p>Courses hebdomadaires réalisées</p>

            <div className="mt-3 m-auto w-100 h-300">
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
            </div>
          </div>
          <div className="d-flex flex-column gap-4 flex-grow-1">
            <div className="border-0 card py-4 px-5">
              <p>Durée d'activité</p>
              <p className="mb-0 fs-4 text-pale-blue">
                {currentWeek.find((item) => item.duration > 0) ? (
                  <>
                    <span className="text-blue fw-bold fs-2">
                      {currentWeek.reduce(
                        (sum, item) => sum + item.duration,
                        0,
                      ) / currentWeek.length || 1}{" "}
                    </span>
                    minutes
                  </>
                ) : (
                  <>Pas de données pour cette semaine</>
                )}
              </p>
            </div>
            <div className="border-0 card py-4 px-5">
              <p>Distance</p>
              <p className="mb-0 fs-4 text-pale-red">
                {currentWeek.find((item) => item.distance > 0) ? (
                  <>
                    <span className="text-red fw-bold fs-2">
                      {Number(
                        (
                          currentWeek.reduce(
                            (sum, item) => sum + item.distance,
                            0,
                          ) / currentWeek.length
                        ).toFixed(2),
                      )}{" "}
                    </span>
                    kilomètres{" "}
                  </>
                ) : (
                  <>Pas de données pour cette semaine</>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
