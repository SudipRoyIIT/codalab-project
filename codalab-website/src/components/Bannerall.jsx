import React from 'react'

const Bannerall = ({bgImage, title}) => {
  return (
    <div 
    className='px-3 flex items-center justify-center relative banner-container'
    style={{
        backgroundImage: `url(${bgImage || '/assets/bgfirst.jpg'})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
    }}
    >
    <div className='absolute inset-0 bg-black/60'></div>
        <h1 className='mb-0 banner-title relative text-white'>{title}</h1>
    </div>
  )
}

export default Bannerall;