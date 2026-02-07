import React from 'react';
import Slider from "react-slick";


const Images = () => {
  const settings = {
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

  const slides = [
    {
      image: "/assets/LabImage1.jpg"    
    },
    {
      image: "/assets/LabImage2.jpg"     
    },
    {
      image: "/assets/LabImage3.jpg"    
    }
  ];
  return (
    <div className="max-w-[800px] w-100 relative mx-auto py-4">
      <Slider {...settings} className='labSlider'>
      {slides.map((slide, index) => (
        <div key={index} className='relative'>
          <img src= {slide.image} className = "object-cover w-100 h-[400px]"></img>
        </div>      
    ))} 
    </Slider>
    </div>
  );
};

export default Images;