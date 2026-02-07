import React, { useEffect, useRef, useState } from 'react';
import Logo from '../../public/assets/codalablogo.png';
import {Link} from 'react-router-dom';
import IITRLogo from '../../public/assets/IITR_new_logo.png';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation } from "react-router-dom";
import { NavLink } from 'react-router-dom';


const Header = () => {
  const headerRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const setContainerPaddingTop = () => { 
      if (!headerRef.current) return;

      const container = document.querySelector('.container');
      if (!container) return;
      const headerHeight = headerRef.current.offsetHeight;
      container.style.paddingTop = `${headerHeight}px`;
    };

    // run on load
    setTimeout(() => {
      setContainerPaddingTop();
    }, 100);

    //run on resize
    window.addEventListener('resize', setContainerPaddingTop);

    return () => {
      window.removeEventListener('resize', setContainerPaddingTop);
      document.body.style.paddingTop = '0px';
    };
  }, [location.pathname]);

  // Menu resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setMenuOpen(false);
      }
    };
  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);  

  // Body overflow hidden on menuopen
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]); 

  return (
    <header ref={headerRef} className='bg-[#ECFAE5] shadow-md w-100 fixed z-9999'>
      <div className="mx-auto px-3 max-w-[1200px] w-100 pt-3 pb-3">
        <div className="grid grid-cols-12 items-center gap-3 header-column-wrapper">
          <div className='site-logo-wrapper col-span-2'>
            <Link to="/">
              <div className='flex gap-2 items-start'>
                <img src={Logo} className='logo-image'/>
                <h5 className='logo-text text-lg font-bold mb-0'>CodaLab<br/>@IITR</h5>
              </div>
            </Link>
          </div>
          <div className='navigation-menu-wrapper col-span-8 flex-wrap'>
            <nav className="flex items-center gap-2 text-base font-normal justify-center flex-wrap max-xl:text-sm font-semibold">
                <NavLink
                  to="/"
                  onClick={() => window.scrollTo(0, 0)}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Home
                </NavLink>

                <NavLink
                  to="/people"
                  onClick={() => window.scrollTo(0, 0)}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  People
                </NavLink>

                <NavLink
                  to="/research"
                  onClick={() => window.scrollTo(0, 0)}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Research
                </NavLink>

                <NavLink
                  to="/publication"
                  onClick={() => window.scrollTo(0, 0)}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Publications
                </NavLink>

                <NavLink
                  to="/achievements"
                  onClick={() => window.scrollTo(0, 0)}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Achievements
                </NavLink>

                <NavLink
                  to="/gallery"
                  onClick={() => window.scrollTo(0, 0)}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Gallery
                </NavLink>

                <NavLink
                  to="/contact"
                  onClick={() => window.scrollTo(0, 0)}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Contact
                </NavLink>
            </nav>
          </div>  
          <div className="col-span-2 third-col flex items-center gap-3 justify-end profile-section">
              <Link to="http://13.233.23.212/admin/"><PersonIcon className='text-[#233039] text-3xl'/></Link>
              <Link className="profile-logo" to="https://www.iitr.ac.in/" target='_blank'><img src={IITRLogo} className='new-logo w-[70px]'/></Link>
          </div>
          <div className='col-span-2 flex justify-end mobile-menu'>
            <button onClick={() => setMenuOpen(!menuOpen)}>
              { menuOpen ? ( <CloseIcon className='text-4xl'/> ) : ( <MenuIcon className='text-4xl'/> )}
            </button>
            {menuOpen && (
            <div className="absolute top-full left-0 w-full bg-white shadow-md">
              <nav className="flex flex-col mobile-nav text-base">
                  <NavLink
                    to="/"
                    end
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Home
                  </NavLink>

                  <NavLink
                    to="/people"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    People
                  </NavLink>

                  <NavLink
                    to="/research"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Research
                  </NavLink>

                  <NavLink
                    to="/publication"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Publications
                  </NavLink>

                  <NavLink
                    to="/achievements"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Achievements
                  </NavLink>

                  <NavLink
                    to="/gallery"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Gallery
                  </NavLink>

                  <NavLink
                    to="/contact"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Contact
                  </NavLink>
                </nav>
            </div>
          )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header