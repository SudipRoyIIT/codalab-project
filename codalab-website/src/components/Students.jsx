import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PublicList from "./PublicList";

function Students() {
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState("Overview");
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_ST_API_URL}/${id}`);
        const data = await res.json();
        setStudent(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  if (!student) return <p>Loading...</p>;

  return (
    <div className="w-100">
      <div className="container">
      {/* ================= PROFILE HEADER ================= */}
      <div className="relative bg-[#cae8bd] h-[170px] profile-section">
        <div className="absolute flex items-center justify-center profile-wrapper flex-column">
          <div
            className="w-[200px] h-[200px] rounded-full bg-cover bg-center profile-image mb-2"
            style={{ backgroundImage: `url(${student.urlToImage})` }}
          />
          <div className="text-center">
            <span className="text-3xl font-bold block mb-1">{student.name}</span>
            <p className="text-lg">({student.subtitle})</p>
        </div>
        </div>
      </div>

      {/* ================= LAYOUT ================= */}
      <div className="max-w-[1200px] mx-auto px-3 mt-10 flex gap-10 pt-[180px] pb-[50px] profile-tab-wrapper">

        {/* ===== LEFT TABS ===== */}
        <div className="w-[30%] sticky top-28 rounded overflow-hidden left-col">
          {["Overview", "Research", "Publication", "Contact"].map((section) => (
            <div
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-3 font-semibold cursor-pointer transition-all capitalize
                ${
                  activeSection === section
                    ? "bg-[#cae8bd] text-black"
                    : "bg-[#ecfae5]   hover:bg-[#cae8bd]"
                }
              `}
            >
              {section}
            </div>
          ))}
        </div>

        {/* ===== RIGHT CONTENT ===== */}
        <div className="w-[70%] bg-white p-6 rounded shadow-md right-col">

          {activeSection === "Overview" && (
            <p className="leading-relaxed text-gray-700">{student.overview}</p>
          )}

          {activeSection === "Research" && (
            <p className="leading-relaxed text-gray-700">{student.researches}</p>
          )}

          {activeSection === "Publication" && (
            <div className="space-y-4">
              {student.publications?.conference_publications?.map((pub, index) => (
                <PublicList
                  key={index}
                  publication={pub}
                  size={
                    student.publications.conference_publications.length - index
                  }
                />
              ))}
            </div>
          )}

          {activeSection === "Contact" && (
            <div className="grid grid-cols-2 gap-6">

              {/* EMAIL */}
              <div>
                <p className="font-semibold">Email</p>
                {student.contactInformation?.email?.map((mail, i) => (
                  <p key={i} className="text-blue-600">
                    <a href={`mailto:${mail}`}>{mail}</a>
                  </p>
                ))}
              </div>

              {/* GOOGLE SCHOLAR */}
              <div>
                <p className="font-semibold">Google Scholar</p>
                <a
                  href={student.contactInformation?.googleScholarLink}
                  className="text-blue-600"
                >
                  View Profile
                </a>
              </div>

              {/* ORCID */}
              <div>
                <p className="font-semibold">ORCID</p>
                <a
                  href={student.contactInformation?.orcidLink}
                  className="text-blue-600"
                >
                  ORCID Profile
                </a>
              </div>

              {/* LINKEDIN */}
              <div>
                <p className="font-semibold">LinkedIn</p>
                <a
                  href={student.contactInformation?.linkedIn}
                  className="text-blue-600"
                >
                  LinkedIn Profile
                </a>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
    </div>
  );
}

export default Students;