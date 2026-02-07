import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope, faHome } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@mui/material/Button";
import Bannerall from './Bannerall';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        autoClose: 3000, // Close the notification after 3 seconds
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
        phoneNumber: "",
        description: "",
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
    <div className="container">
      <Bannerall title="Contact Us" bgImage="/assets/contact.avif"/>
      <div className="max-w-[1200px] mx-auto px-3 py-[50px]">
        <div className="contact-form-container">
          <div className="contact-info">
            <h2>Contact Information</h2>
            <span className="text-xl font-bold">Office Address</span>
            <address>
              CoDA Lab (Room No. S-307)
              <br />
              Department Of Computer Science And Engineering
              <br />
              Indian Institute Of Technology (IIT) Roorkee
              <br />
              Roorkee 247667, Uttarakhand, India
            </address>
            <p>
              <FontAwesomeIcon icon={faPhone} className="icon-right1 me-1" />
              <Link to="tel:(+91)-1332-284374">(+91)-1332-284374</Link>
            </p> 
            <p>
              <FontAwesomeIcon icon={faEnvelope} className="icon-right2 me-1" />
              <Link to="mailto:Codaiitr@Gmail.Com">Codaiitr@Gmail.Com</Link> <br />
              <FontAwesomeIcon icon={faEnvelope} className="icon-right2 me-1" />  
              <Link to="mailto:Sudiproy.Fcs@Iitr.Ac.In">Sudiproy.Fcs@Iitr.Ac.In</Link>
            </p>
            <p>
              <FontAwesomeIcon icon={faHome} className="icon-right3 me-1" />
              <Link to="mailto:Codalab_iitr@Googlegroups.Com">Codalab_iitr@Googlegroups.Com</Link>
            </p>
          </div>
        </div>
        <div className="box">
        <div className="form-query">
          <h2 className="mt-5 mb-3">For Any Queries</h2>
        </div>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div className="form-field">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="8"
                required
              />
            </div>
            <Button
              type="submit"
              variant="contained"
              className="button-primary"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      </div>
    </div>
  );
};

export default Contact;