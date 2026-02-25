import React, { useEffect, useState } from 'react';
import NewsCard from '../components/NewsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { newsAPI } from '../api/api';
import './News.css';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        let response;
        if (selectedCategory) {
          response = await newsAPI.getNewsByCategory(selectedCategory, page);
        } else {
          response = await newsAPI.getAllNews(page, 12);
        }
        setNews(response.data.data);
        setTotalPages(response.data.pages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [page, selectedCategory]);

  const categories = [
    'Technology',
    'Sports',
    'Business',
    'Entertainment',
    'Health',
    'Politics',
    'Science',
    'Other',
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="news-page">
      <div className="container">
        <h1 className="page-title">All News</h1>

        {/* Filters */}
        <div className="filters">
          <div className="category-filter">
            <h3>Categories</h3>
            <div className="category-list">
              <button
                className={`category-btn ${selectedCategory === '' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory('');
                  setPage(1);
                }}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setPage(1);
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="search-filter">
            <h3>Search</h3>
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* News Grid */}
        <div className="news-container">
          {news.length > 0 ? (
            <div className="news-grid">
              {news.map((item) => (
                <NewsCard key={item._id} news={item} />
              ))}
            </div>
          ) : (
            <p className="no-news">No news found</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="page-btn"
            >
              Previous
            </button>
            <span className="page-info">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="page-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
