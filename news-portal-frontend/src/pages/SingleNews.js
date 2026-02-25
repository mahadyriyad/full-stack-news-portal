import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { newsAPI } from '../api/api';
import { formatDate } from '../utils/helpers';
import './SingleNews.css';

const SingleNews = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await newsAPI.getSingleNews(slug);
        setNews(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [slug]);

  if (loading) return <LoadingSpinner />;

  if (error || !news)
    return (
      <div className="error-container">
        <h2>News not found</h2>
        <button onClick={() => navigate('/news')} className="back-btn">
          Back to News
        </button>
      </div>
    );

  return (
    <div className="single-news">
      <div className="container">
        <button onClick={() => navigate('/news')} className="back-link">
          ← Back to News
        </button>

        <article className="news-article">
          <h1 className="article-title">{news.title}</h1>

          <div className="article-meta">
            <div className="author-info">
              <img src={news.author?.avatar} alt={news.author?.name} className="author-avatar" />
              <div>
                <p className="author-name">{news.author?.name}</p>
                <p className="publish-date">{formatDate(news.createdAt)}</p>
              </div>
            </div>
            <div className="article-stats">
              <span>📖 {news.readingTime} min read</span>
              <span>👁️ {news.views} views</span>
              <span className="category-tag">{news.category}</span>
            </div>
          </div>

          <div className="article-image">
            <img src={news.image} alt={news.title} />
          </div>

          <div className="article-description">
            <p>{news.description}</p>
          </div>

          <div className="article-content">
            {news.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {news.tags && news.tags.length > 0 && (
            <div className="article-tags">
              <h3>Tags:</h3>
              <div className="tags-list">
                {news.tags.map((tag) => (
                  <span key={tag} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="author-bio">
            <h3>About the Author</h3>
            <div className="author-card">
              <img src={news.author?.avatar} alt={news.author?.name} className="bio-avatar" />
              <div>
                <h4>{news.author?.name}</h4>
                <p>{news.author?.bio || 'No bio available'}</p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default SingleNews;
