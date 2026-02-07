import React from "react";
import { useNavigate } from "react-router-dom";

const Para = () => {
  const navigate = useNavigate(); 

  const goToSRProfile = () => {
    navigate("/SR_Profile");
  };

  return (
    <div style={styles.newSection}>
      <p style={styles.paragraph}>
        Welcome to the website of Computing and Design Automation (CODA)
        Laboratory research group led by
        <a onClick={() => goToSRProfile()} style={styles.link}>
          {" "}
          Dr. Sudip Roy
        </a>{" "}
        in the Department of Computer Science and Engineering, Indian Institute
        of Technology (IIT) Roorkee. CODA Lab research group currently focuses
        on Computer-Aided-Design (CAD) techniques for automation of microfluidic
        biochips, VLSI (Very Large Scale Integration) chips, and other
        electronic systems. This lab started functioning from May 21, 2016 with
        equipment sponsored by the project grant (MHRD, Govt. of India) to Dr.
        Roy.
      </p>
    </div>
  );
};

const styles = {
  newSection: {
    fontSize: "16px",
    lineHeight: "1.6",
    height: "183px",
    padding: "20px",
    width: "67vw",
  },
  link: {
    color: "black",
    cursor:"pointer",   
     textDecoration: "underline",
  }
};

export default Para;
