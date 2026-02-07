import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const News = () => {
  const [expanded, setExpanded] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.firstName) formErrors.firstName = "First Name is required";
    if (!formData.lastName) formErrors.lastName = "Last Name is required";
    if (!formData.email) {
      formErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = "Email is invalid";
    }
    if (!formData.phone) {
      formErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      formErrors.phone = "Phone number is invalid";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all fields correctly.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const formDataObject = new FormData(e.target);
    formDataObject.append("access_key", "3eed4094-9572-4c17-8d3d-28b0bf807289");
    const object = Object.fromEntries(formDataObject);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    }).then((res) => res.json());

    if (res.success) {
      toast.success("😊 Successfully Submitted!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      });
    } else {
      toast.error("Submission Failed. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="news-container">
        <h3 className="section-heading">Who can be a part of this community?</h3>
        <p className="section-description">
          Welcome to our research lab, where innovation meets dedication. Our lab
          is committed to pushing the boundaries of computer science, focusing on
          both foundational core subjects and cutting-edge interdisciplinary
          domains. We are looking for passionate, driven, and curious students to
          join our team and contribute to groundbreaking research.
        </p>
        
        <h3 className="section-heading">Research Domains</h3>
        
        <div className="domains-grid">
          {[
            { name: "Algorithms", highlighted: false },
            { name: "Computer Architecture", highlighted: true },
            { name: "CAD", highlighted: false },
            { name: "Programming", highlighted: true },
            { name: "Discrete Mathematics", highlighted: false },
            { name: "EDA", highlighted: true },
            { name: "Data Structures", highlighted: false },
            { name: "Internet Of Things", highlighted: true },
          ].map((domain, index) => (
            <div 
              key={index} 
              className={`domain-item ${domain.highlighted ? 'highlighted' : ''}`}
            >
              <p className="domain-name">{domain.name}</p>
            </div>
          ))}
        </div>

        <div className="explore-section">
          <h3 className="explore-heading">Explore Your Options</h3>
          <div className="explore-divider"></div>
        </div>

        <div className="accordion-container">
          {[
            {
              title: "For Ph.D",
              content: "If you are highly motivated to do research and have a strong interest in core CSE subjects like algorithms and computer architecture (specifically, graph and geometric algorithms, CAD, and EDA), I would be delighted to consider you for PhD supervision. For admission to PhD in IITR, Click Here."
            },
            {
              title: "For M.Tech/B.Tech",
              content: "If you are an M.Tech or B.Tech student at IITR with a passion for algorithms, data structures, graph theory, discrete mathematics, computer architecture, and programming in C/C++/Perl/Python/Java, I am here to guide and mentor you in your research journey."
            },
            {
              title: "For Non IITR Students",
              content: "If you are a non - IITR student and have interests in algorithms, data structures, graph theory, discrete mathematics, computer architecture, and programming in C/C++/Perl/Python/Java, then follow summer internship program by IITR."
            }
          ].map((item, index) => (
            <div key={index} className="accordion-item">
              <div 
                className={`accordion-header ${expanded === index ? 'active' : ''}`}
                onClick={() => setExpanded(expanded === index ? null : index)}
              >
                <h3 className="accordion-title">{item.title}</h3>
                <span className="accordion-icon">{expanded === index ? '−' : '+'}</span>
              </div>
              {expanded === index && (
                <div className="accordion-content">
                  <p>{item.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <h3 className="contact-heading">Get in Touch</h3>
          <div className="contact-divider"></div>
          
          <div className="form-grid">
            {["firstName", "lastName", "email", "phone"].map((field) => (
              <div key={field} className="form-field">
                <label className="form-label">
                  {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                </label>
                <input
                  type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className={`form-input ${errors[field] ? 'error' : ''}`}
                />
                {errors[field] && <span className="error-message">{errors[field]}</span>}
              </div>
            ))}
          </div>
          
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default News;