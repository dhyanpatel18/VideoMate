import React, { useState, useEffect } from "react";
import './Recommended.css';
import { useParams, Link } from "react-router-dom";
import { API_KEY } from "../../data.js";

const Recommended = () => {
  const { videoId, categoryId } = useParams();
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
    if (viewCount >= 1000000) {
      return Math.floor(viewCount / 1000000) + 'M';
    } else if (viewCount >= 1000) {
      return Math.floor(viewCount / 1000) + 'k';
    } else {
      return viewCount;
    }
  };

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

  // Enhanced multi-category recommendations
  const fetchEnhancedRecommendations = async () => {
    try {
      setLoading(true);
      
      const numCategoryId = parseInt(categoryId);
      const relatedCategories = recommendationGroups[numCategoryId] || [numCategoryId];
      
      // Randomly select 2-3 categories for variety
      const selectedCategories = shuffleArray(relatedCategories).slice(0, 3);
      
      const allVideos = [];
      const fetchPromises = [];

      // Fetch from multiple related categories
      for (const cat of selectedCategories) {
        const promise = fetch(
          `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics&chart=mostPopular&maxResults=20&regionCode=IN&videoCategoryId=${cat}&key=${API_KEY}`
        )
        .then(response => response.json())
        .then(result => {
          if (result.items) {
            return result.items.map(item => ({
              ...item,
              recommendationCategory: cat,
              relevanceScore: cat === numCategoryId ? 3 : (relatedCategories.indexOf(cat) === 0 ? 2 : 1)
            }));
          }
          return [];
        })
        .catch(error => {
          console.error(`Error fetching recommendation category ${cat}:`, error);
          return [];
        });

        fetchPromises.push(promise);
      }

      const categoryResults = await Promise.all(fetchPromises);
      
      // Combine results
      categoryResults.forEach(videos => {
        allVideos.push(...videos);
      });

      if (allVideos.length > 0) {
        // Remove current video and duplicates
        const filteredVideos = allVideos.filter((video, index, self) => 
          video.id !== videoId && 
          index === self.findIndex(v => v.id === video.id)
        );

        // Sort by relevance and shuffle within groups
        const highRelevance = filteredVideos.filter(v => v.relevanceScore === 3);
        const mediumRelevance = filteredVideos.filter(v => v.relevanceScore === 2);
        const lowRelevance = filteredVideos.filter(v => v.relevanceScore === 1);

        // Create mixed recommendations with weighted distribution
        const mixedRecommendations = [
          ...shuffleArray(highRelevance).slice(0, 15),
          ...shuffleArray(mediumRelevance).slice(0, 8),
          ...shuffleArray(lowRelevance).slice(0, 5)
        ];

        // Final shuffle and limit
        const finalRecommendations = shuffleArray(mixedRecommendations).slice(0, 25);
        setRecommendedVideos(finalRecommendations);
      } else {
        // Fallback to single category
        await fetchSingleCategoryRecommendations();
      }
    } catch (error) {
      console.error('Error fetching enhanced recommendations:', error);
      await fetchSingleCategoryRecommendations();
    } finally {
      setLoading(false);
    }
  };

  // Fallback single category recommendations
  const fetchSingleCategoryRecommendations = async () => {
    try {
      const apiUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=IN&videoCategoryId=${categoryId}&key=${API_KEY}`;
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data.items) {
        const filteredVideos = data.items.filter(video => video.id !== videoId);
        const shuffledVideos = shuffleArray(filteredVideos);
        const randomStart = Math.floor(Math.random() * Math.max(1, shuffledVideos.length - 25));
        const randomVideos = shuffledVideos.slice(randomStart, randomStart + 25);
        setRecommendedVideos(shuffleArray(randomVideos));
      } else {
        setRecommendedVideos([]);
      }
    } catch (error) {
      console.error('Error in fallback recommendations:', error);
      setRecommendedVideos([]);
    }
  };

  // Manual refresh for recommendations
  const handleRefreshRecommendations = () => {
    setRandomSeed(Math.random());
    fetchEnhancedRecommendations();
  };

  useEffect(() => {
    if (videoId && categoryId) {
      fetchEnhancedRecommendations();
    }
  }, [videoId, categoryId]);

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
            key={`${video.id}-${randomSeed}-${index}`}
            to={`/video/${video.snippet.categoryId}/${video.id}`}
            className="video-card"
          >
            <img 
              src={video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url} 
              alt={video.snippet.title}
              onError={(e) => {
                e.target.src = '/assets/thumbnail1.png';
              }}
            />
            <div className="video-info">
              <h3>{video.snippet.title}</h3>
              <p>{video.snippet.channelTitle}</p>
              <p>
                {formatViewCount(video.statistics.viewCount)} views • {formatPublishedDate(video.snippet.publishedAt)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Recommended;
