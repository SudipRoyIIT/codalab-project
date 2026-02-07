export default function DetailsBooks(props) {
  const publishingDate = props.publishingDate
    ? new Date(props.publishingDate)
    : null;
  const year = publishingDate ? publishingDate.getFullYear() : "";

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
  const month = publishingDate ? monthNames[publishingDate.getMonth()] : "";
  const authors = props.authors ? formatAuthors(props.authors) : "";
  const title = props.title || "";
  const additionalInfo = props.additionalInfo || "";
  const pages = props.pages ? `pp. ${props.pages}` : "";
  const publisher = props.publisher || "";
  const ISBN = props.ISBN !== "" ? `ISBN: ${props.ISBN}` : "";
  const weblink = props.weblink || "#";
  const volume = props.volume ? `vol. ${props.volume}` : "";

  return (
    <div
      style={{ marginLeft: "-3%", marginBottom: "20px" }}
      onClick={props.onClick}
    >
      <ol start={props.size}>
        <li>
          {props.size}. {" "}
          {authors && `${authors}, `}
          {title && `"${title}", `}
          {additionalInfo && `${additionalInfo}, `}
          {volume && `${volume}, `}
          {ISBN && `${ISBN}, `}
          {pages && `${pages}, `}
          {publisher !== "" && `${publisher}, `}
          {month && `${month}, `}
          {year && `${year}. `}
          {weblink && (
            <a
              style={{ color: "blue", textDecoration: "none" }}
              href={weblink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Weblink
            </a>
          )}
        </li>
      </ol>
    </div>
  );
}
