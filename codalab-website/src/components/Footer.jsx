import React from "react";
import Logo from '../../public/assets/codalablogo.png';
import {Link} from 'react-router-dom';
import {
  Email,
  Phone,
  LocationOn,
  Facebook,
  Twitter,
  LinkedIn,
  YouTube,
  LocationCity,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <footer className="'bg-[#233039] shadow-md w-100'">
      <div className="mx-auto px-3 max-w-[1200px] w-100 pt-[40px] pb-[40px]">
        <div className="grid grid-cols-12 gap-13 footer-grid-container">

          {/* Lab Info */}
          <div className="col-span-4 column1">
           <Link to="/" onClick={() => window.scrollTo(0, 0)}>
            <div className='flex items-center gap-2 mb-2'>
              <img src={Logo} className='logo-image'/>
              <h4 className='logo-text text-lg font-bold mb-0'>CodaLab <br/>@IITR</h4>
            </div>
           </Link>
           <p className="text-[#363636] mb-0">
            Computing And Design Automation Laboratory Research Group,
            Indian Institute Of Technology, Roorkee
           </p>
          </div>

          {/* Links */}
          <div className="col-span-2 column2">
            <div className= "links flex flex-column gap-3">
              <Link to="/" onClick={() => window.scrollTo(0, 0)}>Home</Link>
              <Link to="/people" onClick={() => window.scrollTo(0, 0)}>People</Link>
              <Link to="/research" onClick={() => window.scrollTo(0, 0)}>Research</Link>
              <Link to="/publication" onClick={() => window.scrollTo(0, 0)}>Publications</Link>
              <Link to="/news" onClick={() => window.scrollTo(0, 0)}>News</Link>
            </div>
          </div>

          {/* Links */}
          <div className="col-span-2 column3">
            <div className = "links flex flex-column gap-3">
            <Link to="/SR_Profile" onClick={() => window.scrollTo(0, 0)}>Profile</Link> 
            <Link to="/achievements" onClick={() => window.scrollTo(0, 0)}>Achievements</Link>
            <Link to="/gallery" onClick={() => window.scrollTo(0, 0)}>Gallery</Link>
            <Link to="/contact" onClick={() => window.scrollTo(0, 0)}>Contact</Link>
            <Link to="/events" onClick={() => window.scrollTo(0, 0)}>Events</Link>
            </div>
          </div>

          {/*Social*/}
          <div className="col-span-4 column4">
            <div className="flex flex-column text-[#363636]">
              <h4>Follow Us</h4>
              <div className="socialIcons flex items-center gap-2">
                <Link to="/"><Facebook className="text-[#363636]"/></Link>
                <Link to="/"><Twitter className="text-[#363636]"/></Link>
                <Link to="/"><YouTube className="text-[#363636]"/></Link>
                <Link to="/"><LinkedIn className="text-[#363636]"/></Link>
              </div>
              <h4 className="mt-4">Contact Us</h4>
              <div className="flex flex-column contact-icons">
                <div className="flex items-center gap-1">
                  <Phone/><Link to="tel:XXXXXXXXXX">+91 XXXXXXXXX</Link>
                </div>
                <div className="flex items-center gap-1">
                  <Email/><Link to="mailto:iitrcodalab@gmail.com">iitrcodalab@gmail.com</Link>
                </div>
                <div className="flex items-center gap-1">
                  <LocationOn/>
                    Roorkee, Uttarakhand
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className = "p-3 flex justify-center bg-[#b0db9c]">
        <p className="text-center text-sm text-[#363636] mb-0">
          © {new Date().getFullYear()} Coda Lab @ IITR. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;