import React from "react";
import useNewsStore from "../store/newsStore";
import AnnouncementsItem from "./AnnouncementsItem";
import { useState, useEffect, useRef } from "react";
import NewsItem from "../Home/NewsItem";
import ProfileImage from "../../../public/assets/SudipRoy2022.jpg";
import { Link } from "react-router-dom";
import CV from "../../../public/assets/cv.png";
import Scholar from "../../../public/assets/Google_Scholar_logo.svg.png";
import research from "../../../public/assets/seo.png";
import OCID from "../../../public/assets/ORCID_iD.png";
import Linkedin from "../../../public/assets/linkedin.png";
import Gmail from "../../../public/assets/Gmail_icon.png";
import Youtube from "../../../public/assets/youtube.png";
import Facebook from "../../../public/assets/facebook.png";
import Slider from "react-slick";


const Announcements = () => {

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: false,
    cssEase: "ease-in-out",
  };

  const settings2 = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: false,
    cssEase: "ease-in-out",
  };

  const { news, fetchNews, isLoading } = useNewsStore();
  const [item, setItems] = useState([]);
  // console.log(news)

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_ANNOUNCEMENTS_API_URL
        );
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <div className="container">
        <div className="sr-profile-top flex gap-3 mb-4">
          <img src={ProfileImage} className="rounded-full w-[170px] h-[170px] object-cover" />
          <div className="info">
            <span className="name text-xl font-bold mt-2 block mb-2">Dr. Sudip Roy (সুদীপ রায়)</span>
              <p>Associate Professor, Department Of Computer Science And Engineering
                <br/>
                Joint Faculty, Center Of Excellence In Disaster Mitigation And Management (CoEDMM)
              </p>
              <p>
                Indian Institute Of Technology (IIT) Roorkee<br/>
                Roorkee 247667, Uttarakhand, India
              </p>
            <div className="social-icons flex flex-wrap gap-3 mt-4">
              <Link to="https://faculty.iitr.ac.in/~sudiproy.fcs/web_files/Sudip_Roy_CV_Aug_2023.pdf" target="_blank"><img src={CV} className="w-[40px] h-[40px] object-contain"/></Link>
              <Link to="https://scholar.google.co.in/citations?user=Sl3l41YAAAAJ&hl=en" target="_blank"><img src={Scholar} className="w-[40px] h-[40px] object-contain"/></Link>
              <Link to="https://www.researchgate.net/profile/Sudip-Roy-10" target="_blank"><img src={research} className="w-[40px] h-[40px] object-contain"/></Link>
              <Link to="https://orcid.org/0000-0001-7873-3069" target="_blank"><img src={OCID} className="w-[40px] h-[40px] object-contain"/></Link>
              <Link to="https://www.linkedin.com/in/sudipr007/?trk=nav_responsive_tab_profile" target="_blank"><img src={Linkedin} className="w-[40px] h-[40px] object-contain"/></Link>
              <Link to="mailto:sudip.roy@cs.iitr.ac.in"><img src={Gmail} className="w-[40px] h-[40px] object-contain"/></Link>
              <Link to="https://www.youtube.com/channel/UCWw3N2Ua4qCRTOPmm1YM9hQ" target="_blank"><img src={Youtube} className="w-[40px] h-[40px] object-contain"/></Link>
              <Link to="https://www.facebook.com/sudiproy.bkp" target="_blank"><img src={Facebook} className="w-[40px] h-[40px] object-contain"/></Link>
            </div>
          </div>
        </div>
        <h3>About</h3>
                <p>
                  Sudip Roy completed his schooling (Class I to XII) from Kalyani
                  University Experimental High School at Kalyani, a town of West Bengal,
                  India in 1998. He passed Secondary (Class X Board Exam.) in 1996
                  from WBBSE and Higher-Secondary (Class XII Board Exam.) in 1998
                  from WBCHSE. He studied Bachelor of Science (BSc) with Physics Honors
                  from Rahara Ramakrishna Mission Vivekananda Centenary College and
                  received his BSc degree from the University of Calcutta in 2001. Then
                  he studied Bachelor of Technology (BTech) in Computer Science and
                  Engineering (a 3-year program) from University College of Science and
                  Technology (a.k.a. Rajabazar Science College) and received his BTech
                  degree from the University of Calcutta in 2004. In 2004, he wrote his
                  BTech dissertation on Crosstalk Minimization in VLSI Channel Routing
                  using Artificial Intelligence. He received the MS (by research) and
                  PhD degrees in Computer Science and Engineering from the Indian
                  Institute of Technology Kharagpur (IITkgp), India, in 2009 and 2014,
                  respectively.
                </p>
                <p>
                  In 2008, he wrote his masters thesis on Impact of Leakage Power
                  Reduction Techniques on Parametric Yield with his thesis advisor
                  of Prof. Ajit Pal at the Department of Computer Science and
                  Engineering, Indian Institute of Technology Kharagpur (IITkgp), India.
                  In 2014, he wrote his doctoral thesis on Design Automation Algorithms
                  for Sample Preparation on a Digital Microfluidic Lab-on-a-Chip with
                  his thesis advisors of Prof. Partha P. Chakrabarti and Prof. Bhargab
                  B. Bhattacharya at the Department of Computer Science and
                  Engineering, Indian Institute of Technology Kharagpur (IITkgp), India.
                </p>
                <p>
                  During 2004-2009, he had research experiences in different intervals
                  as a Project-Linked-Personnel (Nov 2004 - Jul 2005) at the Machine
                  Intelligence Unit, Indian Statistical Institute Kolkata, India, as a
                  Junior Project Assistant (Aug 2005 - Jun 2008) at the Department of
                  Computer Science and Engineering, Indian Institute of Technology
                  Kharagpur (IITkgp), India, and as a Project-Linked-Personnel (Jul 2008
                  - Sep 2009) at the Advanced Computing and Microelectronics
                  Unit, Indian Statistical Institute Kolkata, India.
                </p>
                <p>
                  Since Jul 2014, Dr. Roy has been working as an Assistant Professor at
                  the Department of Computer Science and Engineering, Indian Institute
                  of Technology Roorkee (IITR), India. Before joining with IITR, he was
                  a Research Associate (Feb 2014 - Jul 2014) at the Electronic Design
                  Automation Laboratory in the Department of Computer Science and
                  Information Engineering (CSIE), National Cheng Kung University,
                  Tainan, Taiwan.
                </p>
                <p>
                  He is a recipient of the Microsoft Research India Ph.D. Fellowship
                  award in 2010, and the national scholarship award by the Ministry of
                  Human Resource Development (MHRD), Government of India based on
                  performance in B.Sc. Physics Honors in 2001 (Duration: One time).
                </p>
                <p>
                  His research interest includes electronic design automation (EDA) of
                  microfluidic lab-on-a-chips and digital VLSI integrated circuits. He
                  has published 13 research articles in peer-reviewed journals, 24
                  research articles in international conference proceedings, holds 2
                  United States patents. He has authored one book and one book chapter.
                </p>
                <p>
                  Dr. Roy is a member of the IEEE and ACM.
                </p>

              <h3 className="mt-4">Expertise</h3>
              <p>
                Electronic Design Automation and Embedded System Design, Algorithm
                Design and Optimization Techniques, Microfluidic Biochips, CAD for VLSI,
                Cyber-Physical and IoT-based System Design, ICT for Disaster Management,
                Applications of Machine Learning.
              </p>
              <h3 className="mt-4">News And Highlights</h3>
              <div className="news-and-highlights">
                <Slider {...settings} className='profileNewsSlider w-full desktop'>
                {isLoading && (
                  <p className="text-center text-gray-500">Loading news...</p>
                )}
                  {news.map((item) => (
                    <div key={item._id} className="px-2">
                      <NewsItem
                        image={item.urlToImage}
                        title={item.newsTopic}
                        url={item.url}
                        description={item.newsDescription}
                      />
                      </div>
                    ))}
                  </Slider>
                  <Slider {...settings2} className='profileNewsSlider w-full mobile'>
                {isLoading && (
                  <p className="text-center text-gray-500">Loading news...</p>
                )}
                  {news.map((item) => (
                    <div key={item._id} className="px-2">
                      <NewsItem
                        image={item.urlToImage}
                        title={item.newsTopic}
                        url={item.url}
                        description={item.newsDescription}
                      />
                      </div>
                    ))}
                  </Slider>
              </div>
              <h3 className="mt-4">Announcements</h3>
            <div className="flex flex-column gap-3">
              {item.map((item) => (
                <AnnouncementsItem key={item._id} {...item}></AnnouncementsItem>
              ))}
            </div>
      </div>  
    </>
  );
};

export default Announcements;

