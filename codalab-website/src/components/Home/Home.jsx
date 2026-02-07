import React from "react";
import Imagepage from "./ImagePage";
import Event from "./Event";
import Slideimage from "./Slideimage";
import News from "./News";
import { Link } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ArticleIcon from '@mui/icons-material/Article';
import SettingsIcon from '@mui/icons-material/Settings';

const Home = () => {
  return (
    <div className="container">
      <div className="full-content">
        <Imagepage />
      </div>
      <div className="main-content max-w-[1200px] w-100 mx-auto px-3 py-8">
        <p className="text-center">
          Welcome to the website of Computing and Design Automation (CODA) Laboratory research group led by <Link to="/SR_Profile">Dr. Sudip Roy</Link> in the Department of Computer Science and Engineering, Indian Institute of Technology (IIT) Roorkee. CODA Lab research group currently focuses on Computer-Aided-Design (CAD) techniques for automation of microfluidic biochips, VLSI (Very Large Scale Integration) chips, and other electronic systems. This lab started functioning from May 21, 2016 with equipment sponsored by the project grant (MHRD, Govt. of India) to Dr. Roy.
        </p>
        <Slideimage />
        <div className="staticContentWrapper flex w-100 flex-column py-[50px]">
          <h2 className="text-center mb-5">Lorem Ipsum</h2>
          <div className="flex flex-container gap-4 flex-wrap">
            {/* Vison */}
            <div className="staticColumn column-1 flex-1 flex">
              <div className="inside shadow-lg p-[30px] flex flex-column items-center rounded h-full">
                <RemoveRedEyeIcon className="icon mb-2 text-[#83a973]"/>
                <h4>Vision</h4>
                <p className="text-center">
                  Our Vision For The Research Lab Is To Be At The Forefront Of Innovation In The Integration Of Cutting-Edge Design Principles With Advanced Algorithmic Research. We Aim To Explore And Develop Novel Algorithms That Enhance The Functionality And Efficiency Of The Internet Of Things (IoT) Ecosystems. By Leveraging The Power Of Machine Learning, Our Lab Will Create Intelligent, Adaptive Systems Capable Of Transforming Data Into Actionable Insights. 
                </p>
              </div>
            </div>
            {/* News */}
            <div className="staticColumn column-2 flex-1 flex">
              <div className="inside shadow-lg p-[30px] flex flex-column items-center rounded h-full">
                <ArticleIcon className="icon mb-2 text-[#83a973]"/>
                <h4>News</h4>
                <p className="text-center">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id libero dui. Duis elementum pulvinar velit, non congue elit gravida ultrices. Pellentesque sem mi, varius quis libero a, tincidunt maximus quam. In fermentum tristique facilisis. Donec ut porta nulla, non venenatis lectus. Ut ac leo lacus. Vivamus venenatis condimentum porta. Donec interdum consequat dui quis tincidunt. 
              </p>
              </div>
            </div>
            <div className="staticColumn column-2 flex-1 flex">
              <div className="inside shadow-lg p-[30px] flex flex-column items-center rounded h-full">
                <SettingsIcon className="icon mb-2 text-[#83a973]"/>
                <h4>Text</h4>
                <p className="text-center">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id libero dui. Duis elementum pulvinar velit, non congue elit gravida ultrices. Pellentesque sem mi, varius quis libero a, tincidunt maximus quam. In fermentum tristique facilisis. Donec ut porta nulla, non venenatis lectus. Ut ac leo lacus. Vivamus venenatis condimentum porta. Donec interdum consequat dui quis tincidunt. 
              </p>
              </div>
            </div>
          </div>
        </div>
        <Event />
        <News />
      </div>
      </div>
  );
};

export default Home;