import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // Assuming you have a Sidebar component

const People = () => {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [currentDropdownOpen, setCurrentDropdownOpen] = useState(false);
  const [graduatedDropdownOpen, setGraduatedDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = (button) => {
    setHoveredButton(button);
    if (button === "Current") {
      setCurrentDropdownOpen(true);
    } else if (button === "Graduated") {
      setGraduatedDropdownOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setHoveredButton(null);
    setCurrentDropdownOpen(false);
    setGraduatedDropdownOpen(false);
  };

  const handleDropdownClick = (path) => {
    navigate(path);
  };

  const handleInternsClick = () => {
    navigate("/interns");
  };

  return (
    <div className="app" style={styles.app}>
      <Sidebar />
      
      <div style={styles.mainContainer}>
        <div style={styles.contentContainer}>
          <div style={styles.header}>
            <h1 style={styles.title}>People</h1>
            <div style={styles.date}>
              {new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
          
          <div style={styles.content}>
            <div style={styles.buttonContainer}>
              <div
                style={{
                  ...styles.button,
                  ...(hoveredButton === "Current" ? styles.buttonHover : {}),
                }}
                onMouseEnter={() => handleMouseEnter("Current")}
                onMouseLeave={handleMouseLeave}
                onClick={() => setCurrentDropdownOpen(!currentDropdownOpen)}
              >
                Current Members
                <div
                  style={{
                    ...styles.dropdownContent,
                    ...(currentDropdownOpen ? styles.dropdownContentShow : {}),
                  }}
                >
                  <div
                    style={styles.dropdownItem}
                    onClick={() => handleDropdownClick("/current/phd")}
                  >
                    Ph.D Scholars
                  </div>
                  <div
                    style={styles.dropdownItem}
                    onClick={() => handleDropdownClick("/current/mtech")}
                  >
                    M.Tech Students
                  </div>
                </div>
              </div>
              
              <div
                style={{
                  ...styles.button,
                  ...(hoveredButton === "Graduated" ? styles.buttonHover : {}),
                }}
                onMouseEnter={() => handleMouseEnter("Graduated")}
                onMouseLeave={handleMouseLeave}
                onClick={() => setGraduatedDropdownOpen(!graduatedDropdownOpen)}
              >
                Graduated
                <div
                  style={{
                    ...styles.dropdownContent,
                    ...(graduatedDropdownOpen ? styles.dropdownContentShow : {}),
                  }}
                >
                  <div
                    style={styles.dropdownItem}
                    onClick={() => handleDropdownClick("/graduated/phd")}
                  >
                    Ph.D Scholars
                  </div>
                  <div
                    style={styles.dropdownItem}
                    onClick={() => handleDropdownClick("/graduated/mtech")}
                  >
                    M.Tech Students
                  </div>
                  <div
                    style={styles.dropdownItem}
                    onClick={() => handleDropdownClick("/graduated/btech")}
                  >
                    B.Tech Students
                  </div>
                </div>
              </div>
              
              <div
                style={{
                  ...styles.button,
                  ...(hoveredButton === "Interns" ? styles.buttonHover : {}),
                }}
                onMouseEnter={() => handleMouseEnter("Interns")}
                onMouseLeave={handleMouseLeave}
                onClick={handleInternsClick}
              >
                Interns
              </div>
            </div>
            
            {/* Optional: Add some content or cards below */}
            <div style={styles.infoSection}>
              <p style={styles.infoText}>
                Select a category to view the members of CoDa Lab, IIT Roorkee.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  app: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "'Abhaya Libre', serif",
  },
  mainContainer: {
    flex: 1,
    marginLeft: "250px", // Adjust based on sidebar width
    padding: "20px",
  },
  contentContainer: {
    backgroundColor: "rgba(186, 224, 253, 0.19)",
    borderRadius: "15px",
    padding: "30px",
    minHeight: "calc(100vh - 100px)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    borderBottom: "2px solid #dee2e6",
    paddingBottom: "20px",
  },
  title: {
    fontSize: "3rem",
    color: "#212529",
    margin: 0,
    fontWeight: "bold",
  },
  date: {
    backgroundColor: "#e6f2ff",
    border: "1px solid #007bff",
    padding: "10px 20px",
    borderRadius: "20px",
    fontSize: "16px",
    fontWeight: "500",
    color: "#0066cc",
  },
  content: {
    padding: "20px 0",
  },
  buttonContainer: {
    display: "flex",
    gap: "25px",
    marginBottom: "40px",
    flexWrap: "wrap",
  },
  button: {
    position: "relative",
    padding: "15px 35px",
    color: "#212529",
    backgroundColor: "rgba(217, 217, 217, 0.37)",
    border: "none",
    borderRadius: "15px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    minWidth: "180px",
    textAlign: "center",
  },
  buttonHover: {
    backgroundColor: "rgba(186, 224, 253, 0.60)",
    color: "#212529",
    transform: "translateY(-3px)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
  },
  dropdownContent: {
    display: "none",
    position: "absolute",
    top: "100%",
    left: 0,
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    minWidth: "200px",
    zIndex: 100,
    marginTop: "10px",
    overflow: "hidden",
  },
  dropdownContentShow: {
    display: "block",
  },
  dropdownItem: {
    padding: "12px 20px",
    fontSize: "16px",
    cursor: "pointer",
    borderBottom: "1px solid #f1f3f4",
    transition: "background-color 0.2s ease",
  },
  dropdownItemHover: {
    backgroundColor: "#f8f9fa",
  },
  infoSection: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: "10px",
    padding: "25px",
    marginTop: "30px",
    borderLeft: "5px solid #007bff",
  },
  infoText: {
    fontSize: "18px",
    color: "#495057",
    margin: 0,
    lineHeight: "1.6",
  },
};

export default People;