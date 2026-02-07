import React from 'react';
import DetailsJournals from '../DetailsJournals';
import DetailsConference from '../DetailsConference'
import DetailsWorkshop from "../DetailsWorkshop";
import DetailsOfUSandIndianPatentsGranted from '../DetailsOfUSandIndianPatentsGranted';
import DetailsOfUSandIndianPatentsFiled from "../DetailsOfUSandIndianPatentsFiled";
import DetailsBooks from '../DetailsBooks';
import { useState, useEffect } from 'react';

export default function SRPublication() {
     const [item, setItems] = useState({});
     useEffect(() => {
       const fetchData = async () => {
         try {
           const response = await fetch(
            import.meta.env.VITE_SRPUBLICATION_API_URL
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
    <div className='w-full'>
            <h3>Book and Book Chapter</h3>
            {item &&
              item.arrayOfBooks &&
              item.arrayOfBooks.map((journals, index) => (
                <DetailsBooks
                  key={journals._id}
                  {...journals}
                  size={item.arrayOfBooks.length - index}
                />
              ))}

            <h3 className='mt-5'>Journal Publications</h3>
            {item &&
              item.arrayOfJournals &&
              item.arrayOfJournals.map((journals, index) => (
                <DetailsJournals
                  key={journals._id}
                  {...journals}
                  size={item.arrayOfJournals.length - index}
                />
              ))}

            <h3 className='mt-5'>US and Indian Patents Granted</h3>
            {item &&
              item.arrayOfGrantedPatents &&
              item.arrayOfGrantedPatents.map((journals, index) => (
                <DetailsOfUSandIndianPatentsGranted
                  key={journals._id}
                  {...journals}
                  size={item.arrayOfGrantedPatents.length - index}
                />
              ))}

            <h3 className='mt-5'>US and Indian Patents Filed</h3>
            {item &&
              item.arrayOfFiledPatents &&
              item.arrayOfFiledPatents.map((journals, index) => (
                <DetailsOfUSandIndianPatentsFiled
                  key={journals._id}
                  {...journals}
                  size={item.arrayOfFiledPatents.length - index}
                />
              ))}

            <h3 className='mt-5'>Conferences</h3>
            {item &&
              item.arrayOfConference &&
              item.arrayOfConference.map((Conference, index) => (
                <DetailsConference
                  key={Conference._id}
                  {...Conference}
                  size={item.arrayOfConference.length - index}
                />
              ))}

            <h3 className='mt-5'>Workshop</h3>
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
  );
}