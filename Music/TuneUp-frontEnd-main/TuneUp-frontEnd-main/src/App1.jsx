"use client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/authentication/signup";
import Login from "./components/authentication/login";
import HarmonyLandingPage from "./Landercomponents/HarmonyLandingPage";
import AppLayout from "./AppLayout";
import HeroGeometric from "./Landercomponents/HeroGeometric";
import { AuthProvider } from "./components/authentication/AuthContext";
import ProtectedRoute from "./components/authentication/ProtectedRoute";
import AdminPanel from "./v0/AdminPanel";

export default function App() {
  return (
      <AuthProvider>
        <Router basename={import.meta.env.VITE_BASE_PATH || "/MusicStreamingForntend"}>
          <Routes>
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/Login" element={<Login />} />
            {/* <Route path="/" element={<HarmonyLandingPage />} /> */}
            <Route path="/" element={<HeroGeometric />} />
            <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
  );
}
