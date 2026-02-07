import React from "react";
import { Link } from "react-router-dom";
import EastIcon from '@mui/icons-material/East';


export default function AnnouncementsItem(props) {
  const dateObj = new Date(props.date);
  const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const dayOfWeek = weekdays[dateObj.getUTCDay()];
  const day = String(dateObj.getUTCDate()).padStart(2, "0");
  const month = months[dateObj.getUTCMonth()];
  const year = dateObj.getUTCFullYear();
  const modifyDate = `${dayOfWeek}, ${day} ${month} ${year}`;
  return (
    <Link to={props.readMore} className="announcementItem p-3 rounded border">
    <span className='announcement-year mb-0 font-bold mb-2 block'>{modifyDate}</span>
        <h5 className='announcement-description mb-3'>{props.topicOfAnnouncement}</h5>
        <span className='readMore font-bold'>Read More</span>
    </Link>
  );
}