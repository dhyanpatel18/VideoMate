import React, { useState, useEffect } from "react";
import './Recommended.css';
import { useParams, Link } from "react-router-dom";
import apiService from "../../services/api";

const Recommended = () => {
  const { videoId } = useParams();
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [randomSeed, setRandomSeed] = useState(0);

  // Related category groups for recommendations
  const recommendationGroups = {
    20: [20, 17], // Gaming + related entertainment
    2: [2], // Automobiles + Sports + Tech + Pets
    24: [24, 32, 39], // Entertainment + Comedy + Music + Blogs
    10: [10, 32, 41], // Music + Entertainment + Comedy + Travel
    21: [21], // Blogs + People + Education + Howto
    25: [25], // News + Howto + Education + Entertainment
    17: [17], // Sports + Automobiles + Gaming + Tech
    15: [15], // Pets + Entertainment + Comedy + Travel
    1: [10,24,32,36,39,41], // Film + Education + Tech + Entertainment
    19: [19], // Travel + Music + Entertainment + Sports
    22: [22], // People + Blogs + Education + Howto
    23: [23], // Comedy + Entertainment + Music + Blogs
    26: [26], // Howto + Education + Blogs + Entertainment
    27: [27], // Education + Howto + People + Tech
    28: [28]    // Tech + Automobiles + Education + Film
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

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

  // Fetch recommended videos
  const fetchRecommendedVideos = async () => {
    try {
      setLoading(true);
      
      const response = await apiService.getAllVideos({
        page: 1,
        limit: 25,
        sortBy: 'createdAt',
        sortType: 'desc'
      });
      
      if (response.data && response.data.videos) {
        // Remove current video and shuffle
        const filteredVideos = response.data.videos.filter(video => video._id !== videoId);
        const shuffledVideos = shuffleArray(filteredVideos);
        setRecommendedVideos(shuffledVideos.slice(0, 25));
      } else {
        setRecommendedVideos([]);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendedVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh for recommendations
  const handleRefreshRecommendations = () => {
    setRandomSeed(Math.random());
    fetchRecommendedVideos();
  };

  useEffect(() => {
    if (videoId) {
      fetchRecommendedVideos();
    }
  }, [videoId]);

  useEffect(() => {
    setRandomSeed(Math.random());
  }, []);

  if (loading) {
    return (
      <div className="recommended">
        <div className="recommended-header">
          <h2>Recommended Videos</h2>
        </div>
        <div className="recommended-videos">
          {Array(20).fill().map((_, index) => (
            <div key={index} className="video-card loading">
              
              <div className="loading-content">
                <div className="loading-title"></div>
                <div className="loading-channel"></div>
                <div className="loading-meta"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="recommended">
      <div className="recommended-header">
        <h2>Recommended Videos</h2>
        <button className="refresh-button-small" onClick={handleRefreshRecommendations}>
          🔄
        </button>
      </div>
      <div className="recommended-videos">
        {recommendedVideos.map((video, index) => (
          <Link 
            key={`${video._id}-${randomSeed}-${index}`}
            to={`/video/${video._id}`}
            className="video-card"
          >
            <img 
              src={video.thumbnail} 
              alt={video.title}
              onError={(e) => {
                e.target.src = '/assets/thumbnail1.png';
              }}
            />
            <div className="video-info">
              <h3>{video.title}</h3>
              <p>{video.owner?.fullname || video.owner?.username || 'Unknown User'}</p>
              <p>
                {formatViewCount(video.views)} views • {formatPublishedDate(video.createdAt)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Recommended;
