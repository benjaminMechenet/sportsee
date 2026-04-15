import { Link } from "react-router-dom";

function Error404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-6xl font-bold mb-4 mt-5">404</h1>
      <p className="text-lg mb-5">Oups, cette page n'existe pas.</p>

      <Link
        to="/"
        className="px-4 py-3 border-blue rounded text-blue rounded-xl btn-primary"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}

export default Error404;
