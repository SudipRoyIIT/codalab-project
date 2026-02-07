import React from 'react';
import Bannerall from './Bannerall';
import { useState, useEffect } from 'react';
import Events from './Home/Events';

const EventPage = () => {
   const [events, setEvents] = useState([]);

   useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_EVENT_API_URL);
           
            const data = await response.json();
            // console.log(data);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
}, []);


  return (
    <div className='container'>
      <Bannerall title="Events"/>
      <div className="max-w-[1200px] mx-auto px-3 py-[50px]">
        <div className="events-wrapper grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {events.map(event => (
        <Events key={event._id} url = {event.url} description = {event.eventDescription} date={event.date}/>
      ))}
    </div>

      </div>
    </div>
    
  )
}

export default EventPage