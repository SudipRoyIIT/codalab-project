import React, { useState } from "react";

const Navbar = ({ setCurrentView }) => {
  const [active, setActive] = useState("Announcements");

  const navItems = [
    { text: "Profile", view: "Announcements" },
    { text: "Teaching", view: "teaching" },
    { text: "Publications", view: "publications" },
    { text: "Projects", view: "projects" },
    { text: "Awards and Honours", view: "awards" },
    { text: "Activities", view: "activities" },
    { text: "For Prospective Students", view: "news" },
  ];

  const handleClick = (view) => {
    setActive(view);
    setCurrentView(view);
  };

  return (
    <div className="sidebar-profile">
      {navItems.map((item) => (
        <button
          key={item.view}
          onClick={() => handleClick(item.view)}
          className={`w-full text-left px-4 py-3 font-semibold transition-all duration-300 capitalize
            ${
              active === item.view
                ? "bg-[#cae8bd] text-black shadow-md"
                : "bg-[#ecfae5] hover:bg-[#cae8bd]"
            }
          `}
        >
          <span>{item.text}</span>
        </button>
      ))}
    </div>
  );
};

export default Navbar;