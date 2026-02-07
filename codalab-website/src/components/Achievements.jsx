import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Bannerall from "./Bannerall";


const Achievements = () => {
  const [items, setItems] = useState([]);

  const formattedDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_ACHIEVEMENTS_API_URL
        );
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      
      <div className="container">
        <Bannerall
        title="Achievements by Students"
        bgImage="/assets/achievements.jpg"
      />
      <div className="max-w-[1200px] mx-auto px-3 py-[32px]">
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                {item.name.join(", ")} from the {item.department} department{" "}
                {item.achievement?.title} which is organized by{" "}
                {item.achievement?.organised_by} on{" "}
                {formattedDate(item.achievement?.date)}.
                {item.achievement?.additionalInfo} 
              </li>
            ))}
          </ul>
      </div>
      </div>
    </>
  );
};

export default Achievements;
