import Layout from "./Layout.jsx";
import Login from "./Login.jsx";
import Welcome from "./Welcome.jsx";
import Dashboard from "./Dashboard";
import StartFast from "./StartFast";
import ActiveTimer from "./ActiveTimer";
import Breathe from "./Breathe";
import Nutrition from "./Nutrition";
import Profile from "./Profile";
import JuiceRecipes from "./JuiceRecipes";
import Community from "./Community";
import Achievements from "./Achievements";
import Meditation from "./Meditation";
import Settings from "./Settings";
import ProtectedRoute from "@/components/ProtectedRoute";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { AuthProvider } from "@/contexts/AuthContext";

const PAGES = {
    Dashboard: Dashboard,
    StartFast: StartFast,
    ActiveTimer: ActiveTimer,
    Breathe: Breathe,
    Nutrition: Nutrition,
    Profile: Profile,
    JuiceRecipes: JuiceRecipes,
    Community: Community,
    Achievements: Achievements,
    Meditation: Meditation,
    Settings: Settings,
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    const isLoginPage = location.pathname === '/login';
    const isWelcomePage = location.pathname === '/welcome';
    
    // Don't show Layout on login or welcome pages
    if (isLoginPage) {
        return <Routes><Route path="/login" element={<Login />} /></Routes>;
    }
    
    if (isWelcomePage) {
        return (
            <Routes>
                <Route path="/welcome" element={
                    <ProtectedRoute>
                        <Welcome />
                    </ProtectedRoute>
                } />
            </Routes>
        );
    }
    
    // Render all pages without Layout wrapper for luxury full-screen experience
    return (
        <Routes>            
            <Route path="/" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } />
            
            <Route path="/Dashboard" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } />
            
            <Route path="/StartFast" element={
                <ProtectedRoute>
                    <StartFast />
                </ProtectedRoute>
            } />
            
            <Route path="/ActiveTimer" element={
                <ProtectedRoute>
                    <ActiveTimer />
                </ProtectedRoute>
            } />
            
            <Route path="/Breathe" element={
                <ProtectedRoute>
                    <Breathe />
                </ProtectedRoute>
            } />
            
            <Route path="/Nutrition" element={
                <ProtectedRoute>
                    <Nutrition />
                </ProtectedRoute>
            } />
            
            <Route path="/Profile" element={
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            } />
            
            <Route path="/JuiceRecipes" element={
                <ProtectedRoute>
                    <JuiceRecipes />
                </ProtectedRoute>
            } />
            
            <Route path="/Community" element={
                <ProtectedRoute>
                    <Community />
                </ProtectedRoute>
            } />
            
            <Route path="/Achievements" element={
                <ProtectedRoute>
                    <Achievements />
                </ProtectedRoute>
            } />
            
            <Route path="/Meditation" element={
                <ProtectedRoute>
                    <Meditation />
                </ProtectedRoute>
            } />
            
            <Route path="/Settings" element={
                <ProtectedRoute>
                    <Settings />
                </ProtectedRoute>
            } />
            
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default function Pages() {
    return (
        <AuthProvider>
            <Router>
                <PagesContent />
            </Router>
        </AuthProvider>
    );
}