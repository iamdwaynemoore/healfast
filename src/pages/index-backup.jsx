import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import StartFast from "./StartFast";

import ActiveTimer from "./ActiveTimer";

import Breathe from "./Breathe";

import Nutrition from "./Nutrition";

import Profile from "./Profile";

import JuiceRecipes from "./JuiceRecipes";

import Community from "./Community";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    StartFast: StartFast,
    
    ActiveTimer: ActiveTimer,
    
    Breathe: Breathe,
    
    Nutrition: Nutrition,
    
    Profile: Profile,
    
    JuiceRecipes: JuiceRecipes,
    
    Community: Community,
    
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
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/StartFast" element={<StartFast />} />
                
                <Route path="/ActiveTimer" element={<ActiveTimer />} />
                
                <Route path="/Breathe" element={<Breathe />} />
                
                <Route path="/Nutrition" element={<Nutrition />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/JuiceRecipes" element={<JuiceRecipes />} />
                
                <Route path="/Community" element={<Community />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}