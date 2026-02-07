import React from 'react'

export default function PublicList(props) {
  return (
    <ul start={props.size}>
      <li>{props.publication}</li>
    </ul>
  );
}
