import React, { useState, useEffect } from "react";
import './Feed.css';
import { Link } from "react-router-dom";
import apiService from "../../services/api";

const Feed = ({ category, setCategory }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAllVideos({
        page: 1,
        limit: 50,
        sortBy: 'createdAt',
        sortType: 'desc'
      });
      
      if (response.data && response.data.videos) {
        setData(response.data.videos);
      } else {
        console.error('No videos found in API response');
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  // Helper function to format view count
  const formatViewCount = (viewCount) => {
    if (!viewCount) return '0';
    if (viewCount >= 1000000) {
      return Math.floor(viewCount / 1000000) + 'M';
    } else if (viewCount >= 1000) {
      return Math.floor(viewCount / 1000) + 'k';
    } else {
      return viewCount;
    }
  };

  // Helper function to format published date
  const formatPublishedDate = (publishedAt) => {
    if (!publishedAt) return 'Unknown';
    const now = new Date();
    const published = new Date(publishedAt);
    const diffTime = Math.abs(now - published);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return '1 day ago';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  };

  if (loading) {
    return (
      <div className="feed">
        {Array(20).fill().map((_, index) => (
          <div key={index} className="card loading">
            <div className="loading-thumbnail"></div>
            <div className="loading-content">
              <div className="loading-title"></div>
              <div className="loading-channel"></div>
              <div className="loading-meta"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="feed">
      {data.map((item) => (
        <Link 
          to={`/video/${item._id}`} 
          key={item._id} 
          className="card"
        >
          <img 
            src={item.thumbnail} 
            alt={item.title}
            onError={(e) => {
              e.target.src = '/assets/thumbnail1.png'; // Fallback image
            }}
          />
          <h2>{item.title}</h2>
          <h3>{item.owner?.fullname || item.owner?.username || 'Unknown User'}</h3>
          <p>
            {formatViewCount(item.views)} views &bull; {formatPublishedDate(item.createdAt)}
          </p>
        </Link>
      ))}
    </div>
  );
}

export default Feed;
