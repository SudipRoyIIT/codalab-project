import React, { useEffect, useState } from "react";
import Bannerall from "./Bannerall";

const Research = () => {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_RESEARCH_API_URL);
        const data = await response.json();

        // 🔥 GROUP BY researcharea_name
        const grouped = data.reduce((acc, item) => {
          const key = item.researcharea_name;

          if (!acc[key]) {
            acc[key] = {
              _id: key,
              name: key,
              details: [],
            };
          }

          if (Array.isArray(item.details)) {
            acc[key].details.push(...item.details);
          } else if (item.details) {
            acc[key].details.push(item.details);
          }

          return acc;
        }, {});

        const finalData = Object.values(grouped);

        setItems(finalData);
        setActive(finalData[0]); // default first selected
      } catch (error) {
        console.error("Error fetching research data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full container">
      <Bannerall title="Research Area" bgImage="/assets/research.avif" />

      <div className="max-w-[1200px] mx-auto px-3 py-[50px] flex gap-10 research-area-wrapper items-start">

        {/* LEFT SIDE - BUTTONS */}
        <div className="w-[30%] rounded overflow-hidden left-col sticky top-28">
          {items.map((item) => (
            <button
              key={item._id}
              onClick={() => setActive(item)}
              className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all duration-300 capitalize
                ${
                  active?._id === item._id
                    ? "bg-[#cae8bd] text-black shadow-md"
                    : "bg-[#ecfae5] hover:bg-[#cae8bd]"
                }
              `}
            >
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        {/* RIGHT SIDE - CONTENT */}
        <div className="w-[70%] bg-white px-4 py-3 rounded shadow-md min-h-[300px] right-col">
          {active && (
            <>
              <span className="text-lg mb-3 block font-bold mb-6 text-gray-900 research-content-title capitalize">
                {active.name}
              </span>

              {active.details.length > 0 ? (
                <ul className="list-disc pl-6 space-y-3 text-gray-700 leading-relaxed">
                  {active.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">
                  No details available for this research area.
                </p>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default Research;