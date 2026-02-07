import React from 'react';
import EastIcon from '@mui/icons-material/East';

export default function Events({url, description, date}) {
  const dateObj = new Date(date);
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const monthYear = `${monthNames[dateObj.getUTCMonth()]} ${dateObj.getUTCFullYear()}`;
  const day = String(dateObj.getUTCDate()).padStart(2, "0");

    // console.log(formattedDate); 

  return (
    <a 
    className='event-item p-3 border rounded shadow-md'
    href = {url}
    target="_blank" 
    >
    <div className="event-info">
        <h4 className='event-year-month mb-0'>{monthYear}</h4>
        <span className='event-day'>{day}</span>
        <p className='event-description mb-0'>{description}</p>
        <span className='arrow-icon'><EastIcon/></span>
    </div>
    </a>
  )
}