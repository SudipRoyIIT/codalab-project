import React from "react";
import { Link } from 'react-router-dom';

const DetailsWorkshop = (props) => {
  var {
    names,
    title,
    workshop,
    location,
    pages,
    year,
    weblink,
    serialno,
    ranking,
    additionalInfo,
  } = props;

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

  var authors = names ? formatAuthors(names) : "";

  return (
    <div
      className="conference-entry"
    >
      <ul start={props.size}>
        <li>
          {authors && `${authors}, `}
          {`"${title}", `}
          {workshop && `${workshop}, `}
          {pages && `pp. ${pages}, `}
          {location && `${location}, `}
          {year && `${year}. `}
          {weblink && (
            <Link
              to={weblink}
              target="_blank"
            >
              Weblink
            </Link>
          )}
          {!(ranking === " " || ranking === "") && ` [Ranking: ${ranking}]`}
          {additionalInfo && ` [${additionalInfo}]`}
        </li>
      </ul>
    </div>
  );
};

export default DetailsWorkshop;