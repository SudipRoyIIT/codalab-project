import React from "react";
import { Link } from "react-router-dom";
import EastIcon from '@mui/icons-material/East';


export default function PeopleItem({ id, image, name, subtitle, Area }) {
  return (
    <Link to={`/student/${id}`} className="people-box p-4 block rounded overflow-hidden">
        <div className="d-flex flex-column align-items-center people-box-inside">
          <img
            loading="lazy"
            className="rounded-circle border mb-3"
            style={{ height: "140px", width: "140px"}}
            src={image}
            alt="image"
          />
          <div className="info text-center">
            <p className="name mb-0">{name}</p>
            <p className="subtitle">{subtitle}</p>
            <p className="area mb-0"><strong>Area: </strong>{Area}</p>
          </div>
        </div>
    </Link>
  );
}