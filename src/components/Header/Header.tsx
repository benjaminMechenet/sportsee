import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

function Header() {
  const auth = useAuth();

  return (
    <header className="mt-5 px-10 d-flex flex-row justify-content-between">
      <img className="h-20px" src="/logo.svg" />
      <nav className="rounded-5 d-flex gap-5 flex-row bg-white px-5 py-3 ">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Mon profil
        </NavLink>
        <div className="header-divider"></div>
        <NavLink className="text-blue" to="/" onClick={auth.logout}>
          Se déconnecter
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
