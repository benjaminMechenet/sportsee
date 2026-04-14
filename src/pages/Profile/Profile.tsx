import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";
import ProfilePicture from "../../components/ProfilePicture/ProfilePicture";
import { useUser } from "../../context/UserContext";
import { formatFrenchDate } from "../../utils/utils";

function Profile() {
  const { user } = useUser();

  const formatHeight = (heightCm: number | undefined) => {
    if (!heightCm) return "0";

    const meters = Math.floor(heightCm / 100);
    const centimeters = heightCm % 100;

    return `${meters}m${centimeters.toString().padStart(2, "0")}`;
  };

  return (
    <div className="d-flex flex-column justify-content-between gap-5 vh-100">
      <div className="d-flex flex-column justify-content-between gap-5">
        <Header />

        <section className="d-flex flex-row w-75 mx-auto gap-5 mt-5">
          <div className="d-flex flex-column w-45 gap-3">
            <div className="d-flex rounded-4 flex-row align-items-center gap-4 card border-0 p-4 w-100">
              {" "}
              <ProfilePicture />
              <ProfileInfo />
            </div>

            <div className="card rounded-4 border-0 w-45 p-4 w-100">
              <h2>Votre profil</h2>
              <hr />
              <p>Âge : {user?.profile.age ?? 0}</p>
              <p>Genre : {user?.profile.gender ?? "Non renseigné"}</p>
              <p>Taille : {formatHeight(user?.profile.height)}</p>
              <p>Poids : {user?.profile.weight ?? 0} kg</p>
            </div>
          </div>

          <div className="flex-grow-1">
            <h2>Vos statistiques</h2>
            <div>
              depuis le {formatFrenchDate(user?.profile.createdAt || "")}
            </div>
            <div className="d-flex flex-row gap-3 w-100 mt-4">
              <div className="gap-3 flex-grow-1 d-flex flex-column">
                <div className="bg-blue px-4 py-3 rounded-3">
                  Temps total couru
                  <p className="mt-2 mb-0">
                    <span className="fs-4">
                      {user?.statistics.totalDuration ?? 0}h
                    </span>
                  </p>
                </div>
                <div className="bg-blue px-4 py-3 rounded-3">
                  Distance totale parcourue
                  <p className="mt-2 mb-0">
                    <span className="fs-4 me-1">
                      {user?.statistics.totalDistance ?? 0}
                    </span>
                    km
                  </p>
                </div>
                <div className="bg-blue px-4 py-3 rounded-3">
                  Nombre de sessions
                  <p className="mt-2 mb-0">
                    <span className="fs-4 me-1">
                      {user?.statistics.totalSessions ?? 0}
                    </span>
                    sessions
                  </p>
                </div>
              </div>
              <div className="gap-3 flex-grow-1 d-flex flex-column">
                <div className="bg-blue px-4 py-3 rounded-3">
                  Calories brûlées
                  <p className="mt-2 mb-0">
                    <span className="fs-4 me-1">
                      {user?.statistics.totalCaloriesBurned ?? 0}
                    </span>
                    cal
                  </p>
                </div>
                <div className="bg-blue px-4 py-3 rounded-3">
                  Nombre de jours de repos
                  <p className="mt-2 mb-0">
                    <span className="fs-4 me-1">0</span>
                    jours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
