import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { authAPI, newsAPI } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [userNews, setUserNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const [newsForm, setNewsForm] = useState({
    title: '',
    description: '',
    content: '',
    image: '',
    category: 'Technology',
    readingTime: 5,
    tags: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (activeTab === 'my-news') {
      fetchUserNews();
    }
  }, [activeTab]);

  const fetchUserNews = async () => {
    try {
      setLoading(true);
      const response = await newsAPI.getUserNews(1, 10);
      setUserNews(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authAPI.updateProfile(profileForm);
      updateUser(response.data.user);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleNewsChange = (e) => {
    const { name, value } = e.target;
    setNewsForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await newsAPI.createNews(newsForm);
      setSuccess('News published successfully');
      setNewsForm({
        title: '',
        description: '',
        content: '',
        image: '',
        category: 'Technology',
        readingTime: 5,
        tags: '',
      });
      setActiveTab('my-news');
      fetchUserNews();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish news');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news?')) return;

    try {
      setLoading(true);
      await newsAPI.deleteNews(id);
      setSuccess('News deleted successfully');
      fetchUserNews();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete news');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          <div className="user-profile-card">
            <img src={user.avatar} alt={user.name} className="profile-avatar" />
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>

          <nav className="dashboard-nav">
            <button
              className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              My Profile
            </button>
            <button
              className={`nav-btn ${activeTab === 'create-news' ? 'active' : ''}`}
              onClick={() => setActiveTab('create-news')}
            >
              Create News
            </button>
            <button
              className={`nav-btn ${activeTab === 'my-news' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-news')}
            >
              My News
            </button>
            <button
              className="nav-btn logout"
              onClick={() => {
                logout();
                localStorage.removeItem('token');
                navigate('/');
              }}
            >
              Logout
            </button>
          </nav>
        </div>

        <div className="dashboard-content">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="tab-content">
              <h2>Update Profile</h2>
              <form onSubmit={handleProfileSubmit} className="form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    rows="4"
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={profileForm.address}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* Create News Tab */}
          {activeTab === 'create-news' && (
            <div className="tab-content">
              <h2>Create News</h2>
              <form onSubmit={handleNewsSubmit} className="form">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newsForm.title}
                    onChange={handleNewsChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    name="description"
                    value={newsForm.description}
                    onChange={handleNewsChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Content</label>
                  <textarea
                    name="content"
                    value={newsForm.content}
                    onChange={handleNewsChange}
                    rows="6"
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={newsForm.image}
                    onChange={handleNewsChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={newsForm.category} onChange={handleNewsChange}>
                      <option>Technology</option>
                      <option>Sports</option>
                      <option>Business</option>
                      <option>Entertainment</option>
                      <option>Health</option>
                      <option>Politics</option>
                      <option>Science</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Reading Time (minutes)</label>
                    <input
                      type="number"
                      name="readingTime"
                      value={newsForm.readingTime}
                      onChange={handleNewsChange}
                      min="1"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={newsForm.tags}
                    onChange={handleNewsChange}
                    placeholder="news, trending, breaking"
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Publishing...' : 'Publish News'}
                </button>
              </form>
            </div>
          )}

          {/* My News Tab */}
          {activeTab === 'my-news' && (
            <div className="tab-content">
              <h2>My News</h2>
              {loading ? (
                <LoadingSpinner />
              ) : userNews.length > 0 ? (
                <div className="news-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Views</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userNews.map((news) => (
                        <tr key={news._id}>
                          <td>{news.title}</td>
                          <td>{news.category}</td>
                          <td>{news.views}</td>
                          <td>{new Date(news.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button
                              onClick={() => handleDeleteNews(news._id)}
                              className="delete-btn"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-data">No news published yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
