// MainContent.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "./components/AuthContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./components/SignIn";
import NotFound from "./components/Error";

// Import all page components
import Dashboard from "./components/Dashboard";
import Event from "./components/Event";
import News from "./components/News";
import Signup from "./components/Signup";
import Journals from "./components/Journals";
import Announcement from "./components/Announcement";
import Patents from "./components/Patents";
import Conference from "./components/Conference";
import Workshops from "./components/Workshops";
import Books from "./components/Books";
import Gallery from "./components/Gallery";
import Research from "./components/Research";
import Achievements from "./components/Achievements";
import People from "./components/People";
import PhdStudents from "./components/PhdStudents";
import PhdGraduated from "./components/PhdGraduated";
import MtechStudents from "./components/MtechStudents";
import MtechGraduated from "./components/MtechGraduated";
import Interns from "./components/Interns";
import Project from "./components/Project";
import Activities from "./components/Activities";
import Teachings from "./components/Teaching";
import Awards from "./components/Awards";
import Btech from "./components/Btech";

// Define route configuration
const ROUTE_CONFIG = {
  admin: [
    { path: "/", element: Dashboard },
    { path: "/event", element: Event },
    { path: "/news", element: News },
    { path: "/signup", element: Signup },
    { path: "/announcement", element: Announcement },
    { path: "/achievements", element: Achievements },
    { path: "/people", element: People },
    { path: "/gallery", element: Gallery },
    { path: "/research", element: Research },
    { path: "/publications/journals", element: Journals },
    { path: "/publications/patents", element: Patents },
    { path: "/publications/conference", element: Conference },
    { path: "/publications/workshops", element: Workshops },
    { path: "/publications/books", element: Books },
    { path: "/current/phd", element: PhdStudents },
    { path: "/graduated/phd", element: PhdGraduated },
    { path: "/current/mtech", element: MtechStudents },
    { path: "/graduated/mtech", element: MtechGraduated },
    { path: "/interns", element: Interns },
    { path: "/project", element: Project },
    { path: "/activities", element: Activities },
    { path: "/teaching", element: Teachings },
    { path: "/awards", element: Awards },
    { path: "/graduated/btech", element: Btech },
  ],
  subadmin: [
    { path: "/", element: Dashboard },
    { path: "/publications/journals", element: Journals },
    { path: "/publications/patents", element: Patents },
    { path: "/publications/conference", element: Conference },
    { path: "/publications/workshops", element: Workshops },
    { path: "/publications/books", element: Books },
    { path: "/current/phd", element: PhdStudents },
    { path: "/graduated/phd", element: PhdGraduated },
    { path: "/people", element: People },
    { path: "/current/mtech", element: MtechStudents },
    { path: "/graduated/mtech", element: MtechGraduated },
    { path: "/interns", element: Interns },
    { path: "/graduated/btech", element: Btech },
  ]
};

const HIDE_LAYOUT_PATHS = ["/signin"];

function MainContent() {
  const { currentUser, userRole, setCurrentUser } = useAuth();
  const [showHeaderAndSidebar, setShowHeaderAndSidebar] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const shouldHideLayout = HIDE_LAYOUT_PATHS.includes(location.pathname);
    setShowHeaderAndSidebar(!shouldHideLayout && currentUser !== null);
  }, [location, currentUser]);

  if (currentUser === null) {
    return (
      <div className="auth-container">
        <Routes>
          <Route
            path="/signin"
            element={
              <SignIn setCurrentUser={setCurrentUser} />
            }
          />
          <Route path="*" element={<Navigate to="/signin" />} />
        </Routes>
      </div>
    );
  }

  const userRoutes = ROUTE_CONFIG[userRole] || [];

  return (
    <div className="main-content-wrapper">
      {showHeaderAndSidebar && (
        <>
          <Header 
            setCurrentUser={setCurrentUser} 
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          />
          <Sidebar />
        </>
      )}
      
      <main className={`content-area ${showHeaderAndSidebar ? 'with-sidebar' : 'full-width'}`}>
        <Routes>
          {userRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute 
                  element={route.element} 
                  requiredRole={userRole}
                />
              }
            />
          ))}
          <Route path="*" element={<NotFound signin="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default MainContent;