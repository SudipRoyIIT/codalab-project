import React from 'react'

export default function DetailsInterns(props) {
  return (
    <li style={{marginBottom:'10px'}}>
        <b >{props.name}</b>, {props.university_name}, Pursuing {props.branch} ({props.graduating_year}), 
        “{props.internship_domain}”, ({props.duration}).
    </li>
  )
}
