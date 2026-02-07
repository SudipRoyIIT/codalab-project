import React from "react";

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
    <div className="conference-entry" onClick={props.onClick}>
      <div className="publication">
        <ol start={props.size}>
          <li>
            {authors && `${authors}, `}
            {title && `"${title}", `}
            {conference && `${conference}, `}
            {location && `${location}, `}
            {pages && `${pages}, `}
            {month && `${month}, `}
            {year && `${year}. `}
            {DOI && (
              <a
                style={{ color: "blue", textDecoration: "none" }}
                href={DOI}
                target="_blank"
                rel="noopener noreferrer"
              >{`DOI: ${props.DOI}`}</a>
            )}
            {ranking && ` [${ranking}]`}
          </li>
        </ol>
      </div>
    </div>
  );
};

export default DetailsConference;
