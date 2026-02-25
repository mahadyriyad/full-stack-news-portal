import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, truncateText } from '../utils/helpers';
import './NewsCard.css';

const NewsCard = ({ news }) => {
  return (
    <div className="news-card">
      <div className="news-card-image">
        <img src={news.image} alt={news.title} />
        <span className="category-badge">{news.category}</span>
      </div>
      <div className="news-card-content">
        <h3 className="news-card-title">
          <Link to={`/news/${news.slug}`}>{news.title}</Link>
        </h3>
        <p className="news-card-description">{truncateText(news.description, 120)}</p>

        <div className="news-card-meta">
          <span className="author">
            <img src={news.author?.avatar} alt={news.author?.name} />
            {news.author?.name}
          </span>
          <span className="date">{formatDate(news.createdAt)}</span>
        </div>

        <div className="news-card-footer">
          <span className="reading-time">📖 {news.readingTime} min read</span>
          <span className="views">👁️ {news.views} views</span>
        </div>

        <Link to={`/news/${news.slug}`} className="read-more-btn">
          Read More →
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;
