import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { newsAPI } from '../api/api';
import './Home.css';

const Home = () => {
  const [topNews, setTopNews] = useState([]);
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const topResponse = await newsAPI.getTopNews();
        setTopNews(topResponse.data.data);

        const allResponse = await newsAPI.getAllNews(1, 8);
        setAllNews(allResponse.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to News Portal</h1>
          <p>Stay updated with the latest news from around the world</p>
          <Link to="/news" className="hero-btn">
            Explore News
          </Link>
        </div>
      </section>

      {/* Top News Section */}
      {topNews.length > 0 && (
        <section className="featured-section">
          <div className="container">
            <h2 className="section-title">Featured News</h2>
            <div className="featured-grid">
              {topNews.slice(0, 6).map((news) => (
                <NewsCard key={news._id} news={news} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest News Section */}
      <section className="latest-section">
        <div className="container">
          <h2 className="section-title">Latest News</h2>
          <div className="news-grid">
            {allNews.slice(0, 8).map((news) => (
              <NewsCard key={news._id} news={news} />
            ))}
          </div>
          <div className="view-more">
            <Link to="/news" className="view-more-btn">
              View All News
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Browse by Category</h2>
          <div className="categories-grid">
            {['Technology', 'Business', 'Sports', 'Entertainment', 'Health', 'Politics'].map(
              (category) => (
                <Link key={category} to={`/news?category=${category}`} className="category-card">
                  <span>{category}</span>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <h2>Subscribe to Our Newsletter</h2>
          <p>Get the latest news delivered to your inbox</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
