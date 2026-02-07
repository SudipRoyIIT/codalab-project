import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import NewsItem from "./NewsItem";
import useNewsStore from "../store/newsStore";

const News = () => {
  const { news, fetchNews, isLoading } = useNewsStore();

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // latest 6 news
  const latestNews = news.slice(0, 6);

  return (
    <section className="featured-news-section py-[50px]">
      <h2 className="text-center mb-5">Featured News</h2>
      {/* Loader */}
      {isLoading && (
        <p className="text-center text-gray-500">Loading news...</p>
      )}

      {/* News Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestNews.map((item) => (
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

      {/* View All Button */}
      <div className="view-all-news pt-[50px]">
        <Link
          to="/news"
          className="button-primary"
        >
          View All News
        </Link>
      </div>
    </section>
  );
};

export default News;