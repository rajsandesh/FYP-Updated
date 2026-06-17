import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05070A] text-slate-400 font-mono">
        <p className="text-xs uppercase tracking-widest animate-pulse">Initializing connection...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return children;
}
