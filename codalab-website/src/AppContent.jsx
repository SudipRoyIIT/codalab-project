import React from "react";
import { Box } from "@mui/material";
import { Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Homes from "./components/SR-Pages/Homes";
import CodaPople from "./components/CodaPople";
// import Sidebar from "./components/Sidebar";
import Publication from "./components/Publication";
import Contact from "./components/Contact";
import Home from "./components/Home/Home";
import Achievements from "./components/Achievements";
import Research from "./components/Research";
import Students from "./components/Students";
import Gallery from "./components/Gallery";
import NotFound from "./components/Error";
import NewsPage from "./components/NewsPage";
import EventPage from "./components/EventPage";

const AppContent = () => {
  const location = useLocation();
  const validPaths = [
    "/",
    "/publication",
    "/teaching",
    "/SR_Profile",
    "/people",
    "/research",
    "/achievements",
    "/gallery",
    "/contact",
    "/student/:id",
    "/news",
    "/events",
  ];

  const isPathValid = validPaths.some(
    (path) =>
      location.pathname === path || location.pathname.startsWith("/student/")
  );

  return (
    <>
      {isPathValid && (
        <>
          <Box sx={{ display: "flex" }}>
            <Header />
          </Box>
          {location.pathname !== "/SR_Profile"}
        </>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/publication" element={<Publication />} />     
        <Route path="/SR_Profile" element={<Homes />} />
        <Route path="/people" element={<CodaPople />} />
        <Route path="/research" element={<Research />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/student/:id" element={<Students />} />
        <Route path="*" element={<NotFound />} />            
        <Route path="/news" element={<NewsPage/>}/>  
        <Route path="/events" element={<EventPage/>}/>                                                                                            
      </Routes>
      {isPathValid && <Footer />}
    </>
  );
};

export default AppContent;
