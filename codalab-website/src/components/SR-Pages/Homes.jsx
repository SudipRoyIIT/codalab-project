import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import Navbar from "./Navbar";
import Announcements from "./Announcements";
import News from "./News";
import Activities from "./Activities";
import SRPublication from "./SRPublication";
import Project from "./Project";
import Award from "./Award";
import Teaching from "./Teaching";

const Homes = () => {
  const [currentView, setCurrentView] = useState("profile");
  const location = useLocation();
  const renderView = () => {
    switch (currentView) {
      case "Profile" || "Announcements":
        return <Announcements />;
      case "news":
        return <News />;
      case "activities":
        return <Activities />;
      case "teaching":
        return <Teaching />;
      case "publications":
        return <SRPublication />;
      case "projects":
        return <Project />;
      case "awards":
        return <Award />;
      default:
        return <Announcements />;
    }
  };

  return (
    <div className="container">
      <div className="max-w-[1200px] mx-auto px-3 py-[50px] flex gap-10 items-start profile-main-wrapper">
        <div className="w-[30%] rounded overflow-hidden sticky top-28">
          <Navbar setCurrentView={setCurrentView}/>
        </div>
        <div className="w-[70%] bg-white px-4 py-3 rounded shadow-md right-col">
          {renderView()}
        </div>
      </div>
    </div>
  );
};

export default Homes;