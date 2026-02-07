// App.jsx - Final version with all providers
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import { ThemeProvider } from "./components/ThemeContext";
import { NotificationProvider } from "./components/NotificationContext";
import MainContent from "./MainContent";
import "./styles/global.css";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <div className="app-container">
              <MainContent />
            </div>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;