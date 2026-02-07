import React, { useState, useEffect } from "react";
import Bannerall from "./Bannerall";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

const Gallery = () => {   
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
            import.meta.env.VITE_GALLERY_API_URL
        );
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  //Convert API images to lightbox format
  const slides = data.map(item => ({
    src: item.urlToImage,
    title: item.photo_caption
  }));

  return (
    <div className="container"> 
    <Bannerall title="Gallery" bgImage="/assets/Memories.avif"/> 
    <div className="max-w-[1200px] mx-auto px-3 py-[50px]" >
      <div className="gallery-card-container grid grid-cols-3 gap-4">
        {data.map((item, i) => (
          <div className="gallery-card cursor-pointer" 
          key={i} 
          onClick={() => {
            setIndex(i);
            setOpen(true);
            }}>
            <div className="gallery-card-image">
              <img src={item.urlToImage} alt={item.photo_caption} className="w-full h-[350px] object-cover rounded"/>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Zoom]}
        render={{
          slideFooter: ({ slide }) => (
            <div className="lightbox-caption text-xs text-white p-2">
              {slide.title}
            </div>
          )
        }}
      />
    </div>
  );
};

export default Gallery;