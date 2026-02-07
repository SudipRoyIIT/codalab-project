import React from "react";

export default function DetailsBtech(props) {
  const formatName = (nameArray) => {
    if (!nameArray || !Array.isArray(nameArray) || nameArray.length === 0) {
      return ""; 
    } else if (nameArray.length === 1) {
      return nameArray[0];
    } else if (nameArray.length === 2) {
      return `${nameArray[0]} and ${nameArray[1]}`;
    } else {
      const lastIndex = nameArray.length - 1;
      const formattedName =
        nameArray.slice(0, lastIndex).join(", ") +
        ` and ${nameArray[lastIndex]}`;
      return formattedName;
    }
  };

  const formattedName = formatName(props.name);

  return (
    <li style={{ marginBottom: "10px" }}>
      {formattedName ? `${formattedName}, ` : ""}
      <i>{props.enrolledIn} in</i> {props.branch}, {props.graduating_year},
      {props.thesis_title}, {props.graduating_year},{" "}
      {props.current_working_status}
    </li>
  );
}
