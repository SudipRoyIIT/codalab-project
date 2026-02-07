import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <>
      {/* Header with sidebar toggle */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar open={open} toggleSidebar={toggleSidebar} />

      {/* Main page content */}
      <main style={{ marginTop: "80px", padding: "20px" }}>
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Layout;
