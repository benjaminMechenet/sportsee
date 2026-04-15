import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserInfo,
  loginRequest,
  type LoginResponse,
} from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";

function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      let user: LoginResponse;

      try {
        const response = await loginRequest(email, password);
        login(response.token);
        user = response;

        const response2 = await getUserInfo(user.token);
        setUser(response2);

        navigate("/dashboard");
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    } catch (err) {
      alert("Erreur de connexion : " + err);
    }
  };

  return (
    <section className="d-flex flex-row w-100">
      <div className="w-45 py-5 px-10 vh-100 d-flex flex-column align-items-start justify-content-between">
        <img className="h-20px" src="/logo.svg" />
        <div className="w-100 card border-0 rounded-5 p-5">
          <h1 className="w-100 text-start fs-2 text-blue mb-4">
            Transformez
            <br />
            vos stats en résultats
          </h1>

          <h3 className="w-100 fs-4 text-start mb-4">Se connecter</h3>

          <div className="d-flex flex-column mb-3">
            <label className="text-start text-label mb-1">
              Nom d'utilisateur
            </label>
            <input
              placeholder="username"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="d-flex flex-column mb-4">
            <label className="text-start text-label mb-1">Mot de passe</label>
            <input
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4 text-danger">{error}</div>
          <button
            className="btn btn-primary py-2 rounded-3"
            onClick={handleLogin}
          >
            Se connecter
          </button>

          <p className="text-start mt-5 text-small">Mot de passe oublié ?</p>
        </div>
        <div className="h-20px"></div>
      </div>
      <div className="flex-grow-1 overflow-hidden vh-100">
        <div className="rounded-5 position-absolute bg-white py-3 px-4 text-blue fs-7 bottom-20 right-20">
          Analysez vos performances en un clin d’œil,
          <br />
          suivez vos progrès et atteignez vos objectifs.
        </div>
        <img className="d-block w-100" src="/sportsee-home.webp" />
      </div>
    </section>
  );
}

export default Home;
