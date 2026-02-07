import React, { useEffect } from "react";
import Bannerall from './Bannerall';
import NewsItem from "./Home/NewsItem";
import useNewsStore from "./store/newsStore";


const NewsPage = () => {

  const { news, fetchNews, isLoading } = useNewsStore();
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return (
    <div className='container'>
        <Bannerall title="News"/> 
        <div className="max-w-[1200px] mx-auto px-3 py-[50px]">
            {/* Loader */}
            {isLoading && (
                <p className="text-center text-gray-500">Loading news...</p>
            )}

            {/* News Grid */}
            {!isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {news.map((item) => (
                <NewsItem
                    key={item._id}
                    image={item.urlToImage}
                    title={item.newsTopic}
                    url={item.url}
                    description={item.newsDescription}
                />
                ))}
            </div>
            )}
        </div>
    </div>
  )
}

export default NewsPage