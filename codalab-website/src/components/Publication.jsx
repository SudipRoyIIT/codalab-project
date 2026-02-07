import React from "react";
import { useState, useEffect } from "react";
import DetailsJournals from "./DetailsJournals";
import DetailsConference from "./DetailsConference";
import DetailsWorkshop from "./DetailsWorkshop";
import DetailsOfUSandIndianPatentsGranted from "./DetailsOfUSandIndianPatentsGranted";
import DetailsOfUSandIndianPatentsFiled from "./DetailsOfUSandIndianPatentsFiled";
import Bannerall from "./Bannerall";

const Publications = () => {

   const [item, setItems] = useState({})
   useEffect(() => {
     const fetchData = async () => {
       try {
         const response = await fetch(
          import.meta.env.VITE_PUBLICATION_API_URL
         );
         const data = await response.json();
         setItems(data);
         console.log(data);
       } catch (error) {
         console.error("Error fetching data:", error);
       }
     };

    fetchData();
   }, []);
  return (
    <div className="container">
      <Bannerall title="Publication" bgImage="/assets/public.jpg" />
      <div className="max-w-[1200px] mx-auto px-3 py-[50px]">
      <div className="publication-container">
          <div className="journal1 mb-[50px]">
            <h3 className="mb-4">Journal Publication</h3>
            {item &&
            item.arrayOfJournals &&
            item.arrayOfJournals.map((journals, index) => (
              <DetailsJournals
                key={journals._id}
                {...journals}
                size={item.arrayOfJournals.length - index}
              />
            ))}
          </div>
          <div className="journal1 mb-[50px]">
            <h3 className="mb-4">Conference Proceeding Publication</h3>
            <div>
            {item &&
              item.arrayOfConference &&
              item.arrayOfConference.map((Conference, index) => (
                <DetailsConference
                  key={Conference._id}
                  {...Conference}
                  size={item.arrayOfConference.length - index}
                />
              ))}
          </div>
          </div>
          <div className="journal1 mb-[50px]">
              <h3 className="mb-4">Workshop And Forum Presentations</h3>
              <div>
              {item &&
                item.arrayOfWorkshops &&
                item.arrayOfWorkshops.map((Workshops, index) => (
                  <DetailsWorkshop
                    key={Workshops._id}
                    {...Workshops}
                    size={item.arrayOfWorkshops.length - index}
                  />
                ))}
            </div>
          </div>
          <div className="journal1 mb-[50px]">
              <h3 className="mb-4">Us And Indain Patents Granted</h3>
              <div>
              {item &&
                item.arrayOfGrantedPatents &&
                item.arrayOfGrantedPatents.map((Patents, index) => (
                  <DetailsOfUSandIndianPatentsGranted
                    key={Patents._id}
                    {...Patents}
                    size={item.arrayOfGrantedPatents.length - index}
                  />
                ))}
            </div>
          </div>
          <div className="journal1">
                <h3>Us And Indain Patents Filed</h3>
                <div>
                {item &&
                  item.arrayOfFiledPatents &&
                  item.arrayOfFiledPatents.map((Patents, index) => (
                    <DetailsOfUSandIndianPatentsFiled
                      key={Patents._id}
                      {...Patents}
                      size={item.arrayOfFiledPatents.length - index}
                    />
                  ))}
              </div>
          </div>
      </div>
      </div>
      </div>
  );
};

export default Publications;