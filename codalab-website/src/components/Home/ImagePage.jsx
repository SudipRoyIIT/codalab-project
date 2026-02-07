import React, { useEffect, useState } from 'react';
import Slider from "react-slick";


const ImagePage = () => {

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: false,
    cssEase: "ease-in-out",
  };

  const slides = [
    {
      image: "/assets/Image1.jpg",
      title: "Design And Application",
      description: "We Are Interdisciplinary Research Lab Working To Advance The Future"
    },
    {
      image: "/assets/Image2.jpg",
      title: "Embedded Systems",
      description: "We Are Interdisciplinary Research Lab Working To Advance The Future"
    },
    {
      image: "/assets/Image3.jpg",
      title: "Internet Of Things",
      description: "We Are Interdisciplinary Research Lab Working To Advance The Future"
    },
    {
      image: "/assets/Image4.jpg",
      title: "Machine Learning",
      description: "We Are Interdisciplinary Research Lab Working To Advance The Future"
    },

  ];

  return (
    <Slider {...settings} className='homeSlider'>
      {slides.map((slide, index) => (
        <div key={index} className='relative'>
          {/* Background Image */}
          <div className='slide-image w-100 bg-cover bg-center' style={{ backgroundImage: `url(${slide.image})` }}></div>          
          {/* Overlay */}
          <div className='absolute inset-0 bg-black/50 flex items-center'>
            <div className='max-w-[1200px] mx-auto px-3 py-4 text-white w-100'>
              <div className='w-[575px]'>
                <h2 className='text-6xl font-bold mb-3 text-white'>
                  {slide.title}
                </h2>
                <p className='text-xl mb-0'>{slide.description}</p>
              </div>
            </div>
          </div>
        </div>
      ))} 
    </Slider>
  );
};


export default ImagePage;