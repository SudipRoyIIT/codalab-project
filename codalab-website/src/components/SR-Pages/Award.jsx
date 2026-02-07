import React, {useState, useEffect} from "react";
import { Box, Typography } from "@mui/material";


const Award = () => {
  const [items, setItems] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_AWARD_API_URL
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
    <div className="w-full">
        <h3>Awards and Fellowships</h3>
        <ul>
          {items &&
            items["Awards And Fellowships"] &&
            items["Awards And Fellowships"].map((item, index) => (
              <li key={index}>{item.additionalInfo}</li>
            ))}
        </ul>
                
          <h3 className="mt-5">Invited Talks</h3>
          <ul>
            {items &&
              items["Invited Talks"] &&
              items["Invited Talks"].map((item, index) => (
                <li key={index}>{item.additionalInfo}</li>
              ))}
          </ul>
      </div>
    </>
  );
};

export default Award;