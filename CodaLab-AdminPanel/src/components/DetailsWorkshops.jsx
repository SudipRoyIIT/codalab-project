import React from "react";

const DetailsWorkshops = (props) => {
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
    <div className="conference-entry" onClick={props.onClick} style={{marginBottom:'10px'}}>
      <ol start={props.size}>
        <li>
          {authors && `${authors}, `}
          {`"${title}", `}
          {workshop && `${workshop}, `}
          {pages && `pp. ${pages}, `}
          {location && `${location}, `}
          {year && `${year}. `}
          {weblink && (
            <a
              href={weblink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", textDecoration: "none" }}
            >
              Weblink
            </a>
          )}
          {!(ranking === " " || ranking === "") && ` [Ranking: ${ranking}]`}
          {additionalInfo && ` [${additionalInfo}]`}
        </li>
      </ol>
    </div>
  );
};

export default DetailsWorkshops;
