import React from 'react';
import { Link } from 'react-router-dom';

export default function NewsItem({ image, title, url, description }) {
  return (
    <div className='flex flex-column p-3 rounded shadow-lg newsItem'>
      <Link to={url}><img src={image} alt={title} className='w-100 block h-[190px] object-cover'/></Link>
      <Link to={url}><h6 className='mt-3'>{title}</h6></Link>
      <p className="description">{description}</p>
      <Link to={url} className='readMore'><span className='font-bold'>Read More</span></Link>
    </div>
  )
}