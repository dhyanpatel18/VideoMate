import React, { useState, useEffect } from "react";
import './Feed.css';
import { Link } from "react-router-dom";
import { API_KEY } from "../../data.js";

const Feed = ({ category, setCategory }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=IN&videoCategoryId=${category}&key=${API_KEY}`;
      
      const response = await fetch(videoList_url);
      const result = await response.json();
      
      if (result.items) {
        setData(result.items);
      } else {
        console.error('No items found in API response');
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
          to={`/video/${item.snippet.categoryId}/${item.id}`} 
          key={item.id} 
          className="card"
        >
          <img 
            src={item.snippet.thumbnails.medium.url} 
            alt={item.snippet.title}
            onError={(e) => {
              e.target.src = '/assets/thumbnail1.png'; // Fallback image
            }}
          />
          <h2>{item.snippet.title}</h2>
          <h3>{item.snippet.channelTitle}</h3>
          <p>
            {formatViewCount(item.statistics.viewCount)} views &bull; {formatPublishedDate(item.snippet.publishedAt)}
          </p>
        </Link>
      ))}
    </div>
  );
}

export default Feed;
