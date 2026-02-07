import React from "react";
import { Link } from 'react-router-dom';

const DetailsConference = (props) => {
  const formatAuthors = (authorsArray) => {
    if (authorsArray.length === 1) {
      return authorsArray[0];
    } else if (authorsArray.length === 2) {
      return `${authorsArray[0]} and ${authorsArray[1]}`;
    } else {
      const lastIndex = authorsArray.length - 1;
      const formattedAuthors =
        authorsArray.slice(0, lastIndex).join(", ") +
        ` and ${authorsArray[lastIndex]}`;
      return formattedAuthors;
    }
  };
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = props.date ? new Date(props.date) : null;
  const year = date ? date.getFullYear() : "";
  const month = date ? monthNames[date.getMonth()] : "";
  const authors = props.authors ? formatAuthors(props.authors) : "";
  const title = props.title || "";
  const conference = props.conference || "";
  const location = props.location || "";
  const pages = props.pages || "";
  const serialno = props.serialno || "";
  const ranking = props.ranking || "";
  const DOI = props.DOI ? `https://doi.org/${props.DOI}` : "";
  return (
    <div
      className="conference-entry"
    >
      <div className="publication">
        <ul start={props.size}>
          <li>
            {authors && `${authors}, `}
            {title && `"${title}", `}
            {conference && `${conference}, `}
            {location && `${location}, `}
            {pages && `${pages}, `}
            {month && `${month}, `}
            {year && `${year}. `}
            {DOI && (
              <Link
                to={DOI}
                target="_blank"
              >{`DOI: ${props.DOI}`}</Link>
            )}
            {ranking && ` [${ranking}]`}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DetailsConference;