import React, { useEffect, useState } from "react";
import PeopleItem from "./PeopleItem";
import DetailsPhD from "./DetailsPhD";
import DetailsMtech from "./DetailsMtech";
import DetailsInterns from "./DetailsInterns";
import DetailsBtech from "./DetailsBtech";
import { Link } from "react-router-dom";
import Bannerall from "./Bannerall";

export default function CodaPeople() {
  const [items, setItems] = useState({ MTech: [], PhD: [] });
  const [items1, setItems1] = useState([]);

  // 🔥 Tab States
  const [activeYear, setActiveYear] = useState("current");
  const [activeCourse, setActiveCourse] = useState("phd");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_STUDENTS_API_URL);
        const res1 = await fetch(import.meta.env.VITE_NEWSTUDENTS_API_URL);

        const data = await res.json();
        const data1 = await res1.json();

        setItems(data);
        setItems1(data1);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // 🔁 Reset default left tab when year changes
  useEffect(() => {
    if (activeYear === "current") setActiveCourse("phd");
    if (activeYear === "graduated") setActiveCourse("phd");
    if (activeYear === "interned") setActiveCourse("intern");
  }, [activeYear]);

  return (
    <div className="container">
      <Bannerall bgImage="/assets/people.jpg" title="Meet our faculty and students" />

      <div className="max-w-[1200px] mx-auto px-3 py-[50px]">
      <div className="faculty-data">
          <h2 className="mb-2">Faculty</h2>
          <div className="faculty-info">
          <p className="mb-0">
            <Link to="/SR_Profile" className="text-xl font-bold">Sudip Roy</Link>
            <small>&nbsp;(JSPS Fellow (2021-2022))</small>
          </p>
          <p className="mb-0">
            Associate Professor,&nbsp;
            <Link to="https://iitr.ac.in/Departments/Computer%20Science%20and%20Engineering%20Department/index.html">
              Department of Computer Science and Engineering
            </Link>
          </p>
          <p className="mb-0">
            Joint Faculty,&nbsp;
            <Link to="https://iitr.ac.in/Centres/Centre%20of%20Excellence%20in%20Disaster%20Mitigation%20and%20Management/Home.html">
               Center of Excellence in Disaster Mitigation and Management
              (CoEDMM)
            </Link>
          </p>
          <p className="mb-0">
          <Link to="https://www.iitr.ac.in/">
            Indian Institute of Technology (IIT) Roorkee
          </Link>
          </p>
          <p className="mb-0">
            Roorkee 247667, Uttarakhand, India
          </p>
        </div>
        </div>
        <h2 className="mt-5 mb-2">Student List</h2>
        {/* ===== STUDENT YEAR TABS ===== */}
        <div className="flex gap-4 student-year-tabs">
          {["current", "graduated", "interned"].map((year) => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={`px-5 py-3 font-bold rounded-lg transition
                ${
                  activeYear === year
                    ? "bg-[#cae8bd] text-black"
                    : "bg-[#ecfae5]"
                }
              `}
            >
              {year === "current"
                ? "Current Students"
                : year === "graduated"
                ? "Graduated Students"
                : "Interned Students"}
            </button>
          ))}
        </div>
        <div className="w-full h-[2px] bg-[#83a973] mb-[40px] separator"></div>
        <div className="flex gap-10 items-start student-tabs-wrapper">

          {/* ===== LEFT SIDEBAR ===== */}
          <div className="w-[30%] sticky top-28 rounded overflow-hidden left-col">

            {activeYear === "current" && (
              <>
                <button
                  onClick={() => setActiveCourse("phd")}
                  className={`w-full px-4 py-3 font-semibold
                    ${activeCourse === "phd" ? "bg-[#cae8bd] text-black" : "bg-[#ecfae5]"}
                  `}
                >
                  Ph.D Scholars
                </button>

                <button
                  onClick={() => setActiveCourse("mtech")}
                  className={`w-full px-4 py-3 rounded-xl font-semibold
                    ${activeCourse === "mtech" ? "bg-[#cae8bd]" : "bg-[#ecfae5]"}
                  `}
                >
                  M.Tech Students
                </button>
              </>
            )}

            {activeYear === "graduated" && (
              <>
                <button
                  onClick={() => setActiveCourse("phd")}
                  className={`w-full px-4 py-3 rounded-xl font-semibold
                    ${activeCourse === "phd" ? "bg-[#cae8bd]" : "bg-[#ecfae5]"}
                  `}
                >
                  Ph.D Scholars
                </button>

                <button
                  onClick={() => setActiveCourse("mtech")}
                  className={`w-full px-4 py-3 rounded-xl font-semibold
                    ${activeCourse === "mtech" ? "bg-[#cae8bd]" : "bg-[#ecfae5]"}
                  `}
                >
                  M.Tech Students
                </button>

                <button
                  onClick={() => setActiveCourse("btech")}
                  className={`w-full px-4 py-3 rounded-xl font-semibold
                    ${activeCourse === "btech" ? "bg-[#cae8bd]" : "bg-[#ecfae5]"}
                  `}
                >
                  B.Tech Students
                </button>
              </>
            )}

            {activeYear === "interned" && (
              <button
                onClick={() => setActiveCourse("intern")}
                className={`w-full px-4 py-3 rounded-xl font-semibold
                  ${activeCourse === "intern" ? "bg-[#cae8bd]" : "bg-[#ecfae5]"}
                `}
              >
                Interns
              </button>
            )}

          </div>

          {/* ===== RIGHT CONTENT ===== */}
          <div className="w-[70%] bg-white p-6 rounded-xl shadow-md right-col">

            {/* CURRENT */}
            {activeYear === "current" && activeCourse === "phd" && (
              <div className="flex flex-column">
                <div className="grid grid-cols-2 gap-4">
                  {items.PhD.map((item) => (
                    <PeopleItem
                    key={item.studentId}
                    id={item.studentId}
                    image={item.urlToImage}
                    name={item.name}
                    subtitle={item.subtitle || `M.Tech in ${item.domain}, ${item.graduatingYear}`}
                    Area={`${item.areaOfInterest?.substring(0, 104)}...`}
                  />                  
                  ))}
                </div>
              </div>
            )}

            {activeYear === "current" && activeCourse === "mtech" && (
              <div className="flex gap-6">
                <div className="w-1/2">
                {items["M.Tech"]?.filter((_, i) => i % 2 === 0).map((item) => (
                    <PeopleItem
                    key={item.studentId}
                    id={item.studentId}
                    image={item.urlToImage}
                    name={item.name}
                    subtitle={item.subtitle || `M.Tech in ${item.domain}, ${item.graduatingYear}`}
                    Area={`${item.areaOfInterest?.substring(0, 104)}...`}
                  />       
                  ))}
                </div>
                <div className="w-1/2">
                  {items["M.Tech"]?.filter((_, i) => i % 2 !== 0).map((item) => (
                    <PeopleItem
                    key={item.studentId}
                    id={item.studentId}
                    image={item.urlToImage}
                    name={item.name}
                    subtitle={item.subtitle || `M.Tech in ${item.domain}, ${item.graduatingYear}`}
                    Area={`${item.areaOfInterest?.substring(0, 104)}...`}
                  />       
                  ))}
                </div>
              </div>
            )}

            {/* GRADUATED */}
            {activeYear === "graduated" && activeCourse === "phd" && (
              <ul>{items1?.[0]?.["PhD Scholar"]?.map((i, idx) => <DetailsPhD key={idx} {...i} />)}</ul>
            )}

            {activeYear === "graduated" && activeCourse === "mtech" && (
              <ul>{items1?.[1]?.["M.Tech"]?.map((i, idx) => <DetailsMtech key={idx} {...i} />)}</ul>
            )}

            {activeYear === "graduated" && activeCourse === "btech" && (
              <ul>{items1?.[2]?.["B.Tech"]?.map((i, idx) => <DetailsBtech key={idx} {...i} />)}</ul>
            )}

            {/* INTERNED */}
            {activeYear === "interned" && activeCourse === "intern" && (
              <ul>{items1?.[3]?.["Intern"]?.map((i, idx) => <DetailsInterns key={idx} {...i} />)}</ul>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}