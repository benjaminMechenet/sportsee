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
  fetchCurrentWeekOffset,
  getWeeksBounds,
  groupDataByWeek,
} from "../../services/groupDataService";
import GoalChart from "../../components/GoalChart/GoalChart";
import DistanceChart from "../../components/DistanceChart/DistanceChart";
import BPMChart from "../../components/BPMChart/BPMChart";

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

  const avgWeeksDistance =
    weeksData.length > 0
      ? (
          weeksData.reduce((sum, i) => sum + i.distance, 0) / weeksData.length
        ).toFixed(2)
      : null;

  const selectedAvgHeartRate = (() => {
    const valid = selectedWeek.filter((i) => i.caloriesBurned > 0);
    if (!valid.length) return null;

    return (
      (
        valid.reduce((sum, i) => sum + i.heartRate.average, 0) / valid.length
      ).toFixed(2) + " BPM"
    );
  })();

  const currentDurationAvg =
    currentWeek.length > 0
      ? (
          currentWeek.reduce((s, i) => s + i.duration, 0) / currentWeek.length
        ).toFixed(2)
      : null;

  const currentDistanceAvg =
    currentWeek.length > 0
      ? (
          currentWeek.reduce((s, i) => s + i.distance, 0) / currentWeek.length
        ).toFixed(2)
      : null;

  useEffect(() => {
    if (!auth.token) return;

    const fetchWeeks = async () => {
      try {
        const response = await getUserActivity(
          auth.token!,
          multiStartDate,
          multiEndDate,
        );

        setWeeksData(groupDataByWeek(multiStartDate, multiEndDate, response));
      } catch (err) {
        alert("Erreur de connexion : " + err);
      }
    };

    fetchWeeks();
  }, [auth.token, multiStartDate, multiEndDate]);

  useEffect(() => {
    if (!auth.token) return;

    const fetchCurrent = async () => {
      try {
        const data = await fetchCurrentWeekOffset(auth.token!, 0);
        setCurrentWeek(data);
      } catch (err) {
        alert("Erreur de connexion : " + err);
      }
    };

    fetchCurrent();
  }, [auth.token]);

  useEffect(() => {
    if (!auth.token) return;

    const fetchSelected = async () => {
      try {
        const data = await fetchCurrentWeekOffset(
          auth.token!,
          selectedWeekOffset,
        );
        setSelectedWeek(data);
      } catch (err) {
        alert("Erreur de connexion : " + err);
      }
    };

    fetchSelected();
  }, [auth.token, selectedWeekOffset]);

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
                  {avgWeeksDistance ?? 0}
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
              <DistanceChart weeksData={weeksData} />
            </div>
          </div>

          <div className="card border-0 w-50 py-4 px-5 d-flex flex-column gap-5 flex-grow-1">
            <div className="d-flex flex-row justify-content-between align-items-start">
              <div>
                <div className="text-red lh-sm fs-4">
                  {selectedAvgHeartRate ??
                    "Pas de donnés pour la semaine selectionnée"}{" "}
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
              <BPMChart selectedWeek={selectedWeek} />
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
              <GoalChart />
            </div>
          </div>
          <div className="d-flex flex-column gap-4 flex-grow-1">
            <div className="border-0 card py-4 px-5">
              <p>Durée d'activité</p>
              <p className="mb-0 fs-4 text-pale-blue">
                {currentDurationAvg === "0" ? (
                  <>
                    <span className="text-blue fw-bold fs-2">
                      {currentDurationAvg}{" "}
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
                {currentDistanceAvg === "0" ? (
                  <>
                    <span className="text-red fw-bold fs-2">
                      {currentDistanceAvg}{" "}
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
