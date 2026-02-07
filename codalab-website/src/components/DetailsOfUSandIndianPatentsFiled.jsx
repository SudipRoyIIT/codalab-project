import React from "react";
import { Link } from 'react-router-dom';


const DetailsOfUSandIndianPatentsFiled = (props) => {
  const {
    authors,
    title,
    application_number,
    date,
    patent_number,
    publisher,
    serialno,
    status,
    weblink,
    additionalInfo,
    pages,
  } = props;

  // Function to format authors array with "and" before the last author
  const formatAuthors = (authorsArray) => {
    if (!authorsArray || authorsArray.length === 0) return "";
    if (authorsArray.length === 1) return authorsArray[0];
    if (authorsArray.length === 2) return authorsArray.join(" and ");
    return (
      authorsArray.slice(0, -1).join(", ") + ` and ${authorsArray.slice(-1)[0]}`
    );
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="patent-entry">
      <ul start={props.size}>
        <li>
          {authors && `${formatAuthors(authors)}, `}
          {title && `"${title}", `}
          {/* {status === "Filed" && "Patent Application"} */}
          {status === "Granted" && `${publisher}, `}
          {application_number && `${application_number}, `}
          {date && `Filing date: ${formatDate(date)}, `}
          {patent_number && `Publication number: ${patent_number}, `}
          {pages && `Pages: ${pages}, `}
          {weblink && (
            <Link
              href={weblink}
              target="_blank"
            >
              Weblink
            </Link>
          )}
          {additionalInfo && ` [${additionalInfo}]`}
        </li>
      </ul>
    </div>
  );
};

export default DetailsOfUSandIndianPatentsFiled;