import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import RedTeam from "./RedTeam";
import BlueTeam from "./Blueteam";
import { SimulationProvider } from "./src/SimulationContext";
import { AuthProvider } from "./src/AuthContext";
import { ThemeProvider } from "./src/ThemeContext";
import ProtectedRoute from "./src/components/ProtectedRoute";
import NetworkLogs from "./NetworkLogs";
import Reports from "./Reports";
import DashboardLayout from "./DashboardLayout";

function AnimatedRoutes() {
  const navigate = useNavigate();

  const nav = (dest) => {
    navigate(`/${dest}`);
  };

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* Redirect old nexus to admin dashboard since it's the new unified command center */}
      <Route path="/nexus" element={<Navigate to="/admin" replace />} />
      
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard onNav={nav} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/red-team"
        element={
          <ProtectedRoute>
            <RedTeam onNav={nav} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blue-team"
        element={
          <ProtectedRoute>
            <BlueTeam onNav={nav} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/network-logs"
        element={
          <ProtectedRoute>
            <NetworkLogs onNav={nav} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports onNav={nav} />
          </ProtectedRoute>
        }
      />
      
      {/* Catch-all redirect to admin dashboard if logged in, else login handles it */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SimulationProvider>
          <div className="bg-[#05070A] relative w-screen min-h-screen overflow-x-hidden font-sans selection:bg-cyan-500/30">
            <Router>
              <AnimatedRoutes />
            </Router>
          </div>
        </SimulationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
