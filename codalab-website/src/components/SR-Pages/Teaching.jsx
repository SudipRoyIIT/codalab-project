import { borderBottom } from "@mui/system";
import React from "react";
import { useState, useEffect } from "react";


export default function Teaching() {
  const [item, setItems] = useState([]);
  const [item1, setItems1] = useState([]);
  const date = new Date();
  const month = date.getMonth();
  var check  = false;
  if (month > 5){
    check = true;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_SPRING_API_URL
        );
        const response1 = await fetch(
          import.meta.env.VITE_AUTUMN_API_URL
        );
        const data = await response.json();
        const data1 = await response1.json();
        setItems(data);
        console.log(data);
        setItems1(data1);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="w-full">
            <h3>Current Teachings</h3>
            <ul>
              <li>
                <p>
                  <b>{check ? "Autumn" : "Spring"}</b>
                </p>
              </li>
              <li>
                <p>
                  {!check && item.length > 0 && item[0].year
                    ? `${item[0].year}`
                    : ""}
                  {check && item1.length > 0 && item1[0].year
                    ? `${item1[0].year}`
                    : ""}
                </p>
                {!check &&
                  item &&
                  item[0] &&
                  item[0].courses &&
                  item[0].courses.map((course, idx) => (
                    <div key={idx}>
                      <span>{course.subjectCode}</span>: {course.subjectName}
                      {course.additionalInfo && (
                        <span> ({course.additionalInfo})</span>
                      )}
                      <div>
                        {course.studentsStrength && (
                          <p
                          >{`Student Strength:  ${course.studentsStrength}`}</p>
                        )}
                      </div>
                    </div>
                  ))}
                {check &&
                  item1 &&
                  item1[0] &&
                  item1[0].courses &&
                  item1[0].courses.map((course, idx) => (
                    <div key={idx}>
                      <span>{course.subjectCode}</span>: {course.subjectName}
                      {course.additionalInfo && (
                        <span> ({course.additionalInfo})</span>
                      )}
                      <div>
                        {course.studentsStrength && (
                          <p
                          >{`Student Strength:  ${course.studentsStrength}`}</p>
                        )}
                      </div>
                    </div>
                  ))}
              </li>
            </ul>
            <h2 className="mt-5 text-center past-teaching">Past Teaching Experience</h2>
              <h3 className="mt-5">Spring semester</h3>
          <ul>
            {item &&
              item.map((item, index) => (
                <div key={index}>
                  <ul>
                    <li>
                      <b>{item.year}</b>
                    </li>
                    {item &&
                      item.courses.map((course, idx) => (
                        <p key={idx}>
                          <span>{course.subjectCode}</span>:{" "}
                          {course.subjectName}
                          {course.additionalInfo && (
                            <span> ({course.additionalInfo})</span>
                          )}
                          {course.studentsStrength && (
                            <p
                            >{`Student Strength:  ${course.studentsStrength}`}</p>
                          )}
                        </p>
                      ))}
                  </ul>
                </div>
              ))}
          </ul>

            <h3 className="mt-5">Autumn Semester</h3>
            <ul>
              {item1 &&
                item1.map((item, index) => (
                  <div key={index}>
                    <ul>
                      <li>
                        <b>{item.year}</b>
                      </li>
                      {item &&
                        item.courses.map((course, idx) => (
                          <p key={idx}>
                            <span>{course.subjectCode}</span>:{" "}
                            {course.subjectName}
                            {course.additionalInfo && (
                              <span> ({course.additionalInfo})</span>
                            )}
                            {course.studentsStrength && (
                              <p
                              >{`Student Strength:  ${course.studentsStrength}`}</p>
                            )}
                          </p>
                        ))}
                    </ul>
                  </div>
                ))}
            </ul>
        </div>
  );
}