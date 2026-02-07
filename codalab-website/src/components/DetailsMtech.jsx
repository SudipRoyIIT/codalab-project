import React from "react";

export default function DetailsMtech(props) {
  return (
    <li style={{ marginBottom: "10px" }}>
      {props.name}, <i>{props.enrolledIn} in</i> {props.branch},{" "}
      {props.graduating_year}, {props.thesis_title}, {props.graduating_year},{" "}
      {props.current_working_status}
    </li>
  );
}
