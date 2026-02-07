import React from 'react';
import Events from './Events';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const Event = () => {
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

const latestEvents = events.slice(0, 6);
  return (
    <div className='events-listing-section py-[50px]'>
      <h2 className='text-center mb-5'>Latest Events</h2>
    <div className="events-wrapper grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
      {latestEvents.map(event => (
        <Events key={event._id} url = {event.url} description = {event.eventDescription} date={event.date}/>
      ))}
    </div>
    <div className="view-all-events pt-[50px]">
        <Link
          to="/events"
          className="button-primary"
          onClick={() => window.scrollTo(0, 0)}
        >
          View All Events
        </Link>
      </div>
    </div>
  );
};

export default Event;