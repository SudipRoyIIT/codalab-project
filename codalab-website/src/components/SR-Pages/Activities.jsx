import React, {useState, useEffect} from "react";

const Activities = () => {
  const [items, setItems] = useState({})
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_ACTIVITIES_API_URL
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
      <h3>Major Service In IIT Roorkee</h3>
          <ul>
            {items &&
              items["Major Services in IIT Roorkee"] &&
              items["Major Services in IIT Roorkee"].map((item, index) => (
                <li key={index}>{item.details}</li>
              ))}
          </ul>
          <h3 className="mt-5">Professional Membership and Affiliation</h3> 
          <ul>
            {items &&
              items["Professional Memberships and Affiliations"] &&
              items["Professional Memberships and Affiliations"].map(
                (item, index) => <li key={index}>{item.details}</li>
              )}
          </ul>
          <h3 className="mt-5">Outreach From Research Activities</h3>
          <ul>
            {items &&
              items["Outreach From Research Activities"] &&
              items["Outreach From Research Activities"].map((item, index) => (
                <li key={index}>{item.details}</li>
              ))}
          </ul>
          </div>
    </>
  );
};

export default Activities;
