import React from 'react'

export default function Details(props) {
  return (
    <li style={{marginBottom:'10px'}}>
        {props.name} in {props.graduating_year}; Thesis Title: "{props.thesis_title}"[published {props.no_of_journal_papers} journal papers and {props.no_of_conference_papers} conference papers; currently 
        working as an {props.current_working_status} in {props.place_of_work}]
    </li>
  )
}
