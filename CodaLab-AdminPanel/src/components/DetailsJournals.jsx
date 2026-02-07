import React from "react";

export default function DetailsJournals(props) {
  const publishedOn = props.publishedOn ? new Date(props.publishedOn) : null;
  const year = publishedOn ? publishedOn.getFullYear() : "";
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
  const month = publishedOn ? monthNames[publishedOn.getMonth()] : "";
  const authors = props.authors ? formatAuthors(props.authors) : "";
  const title = props.title || "";
  const journal = props.journal || "";
  const volume = props.volume ? `vol. ${props.volume}` : "";
  const pages = props.pages ? `pp. ${props.pages}` : "";
  const IF = props.IF ?? "";
  const SJR = props.SJR ?? "";
  const DOI = props.DOI ? `DOI: ${props.DOI}` : "";

  const doiLink = props.DOI ? `https://doi.org/${props.DOI}` : "#";
  return (
    <div>
      <ol start={props.size}>
        <li style={{ padding: "2%" }} onClick={props.onClick}>
          {authors && `${authors}, `}
          {title && `"${title}", `}
          {journal && `${journal}, `}
          {volume && `${volume}, `}
          {pages && `${pages}, `}
          {month && `${month}, `}
          {year && `${year}. `}
          {DOI && (
            <a
              style={{ color: "black", textDecoration: "none" }}
              href={doiLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {DOI}
            </a>
          )}{" "}
          {"   "}
          {(IF || SJR) && (
            <span style={{ color: "red" }}>
              {`[IF = ${IF}${SJR ? `; SJR: ${SJR}` : ""}]`}
            </span>
          )}{" "}
          {props.additionalInfo !== "" && props.additionalInfo}
        </li>
      </ol>
    </div>
  );
}
