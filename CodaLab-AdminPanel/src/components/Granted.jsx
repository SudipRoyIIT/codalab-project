// import react from 'react'
const Granted = (props) => {
  const {
    authors,
    title,
    application_number,
    date,
    patent_number,
    publisher,
    serialno,
    weblink,
  } = props;

  // Function to format authors array with "and" before the last author
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

  return (
    <div
      className="patent-entry"
      style={{ marginBottom: "6%" }}
      onClick={props.onClick}
    >
      <ol start={props.size}>
        <li>
          {authors && `${formatAuthors(authors)}, `}
          {title && `"${title}", `}
          {patent_number && `${patent_number}, `}
          {date &&
            `granted on: ${new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}, `}
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
          {application_number &&
            `Patent Application number: ${application_number} `}
          {publisher && ` ${publisher} `}
        </li>
      </ol>
    </div>
  );
};

export default Granted;
