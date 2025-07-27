import React, { useState, useEffect } from "react";
import './PlayVideo.css';
import video1 from '/assets/video.mp4';
import like from '/assets/like.png';
import dislike from '/assets/dislike.png';
import share from '/assets/share.png';
import save from '/assets/save.png';
import jack from '/assets/jack.png';
import user_profile from '/assets/user_profile.jpg';
import { useParams } from "react-router-dom";
import apiService from "../../services/api";

const PlayVideo = () => {
  const { videoId } = useParams(); // Get videoId from URL
  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch video data
  const fetchVideoData = async () => {
    try {
      const response = await apiService.getVideoById(videoId);
      if (response.data) {
        setApiData(response.data);
        setChannelData(response.data.owner);
      }
    } catch (error) {
      console.error('Error fetching video data:', error);
    }
  };

  // Fetch comments
  const fetchCommentData = async () => {
    try {
      const response = await apiService.getVideoComments(videoId);
      if (response.data) {
        setCommentData(response.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setCommentData([]); // Set empty array if comments fail to load
    }
  };

  useEffect(() => {
    if (videoId) {
      setLoading(true);
      Promise.all([
        fetchVideoData(),
        fetchCommentData()
      ]).finally(() => {
        setLoading(false);
      });
    }
  }, [videoId]);

  if (loading) {
    return (
      <div className="play-video">
        <div className="loading-video-player"></div>
        <div className="loading-content">
          <div className="loading-title"></div>
          <div className="loading-info"></div>
          <div className="loading-publisher"></div>
        </div>
      </div>
    );
  }

  if (!apiData) {
    return (
      <div className="play-video">
        <div className="error-message">
          <p>Video not found or failed to load.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="play-video">
        {/* Video player */}
        <video 
          className="video-player"
          controls
          src={apiData.videoFile}
          poster={apiData.thumbnail}
          title={apiData.title}
        >
          Your browser does not support the video tag.
        </video>
        
        {/* Dynamic video title */}
        <h3>{apiData.title}</h3>
        
        <div className="play-video-info">
            <p>
              {formatViewCount(apiData.views)} views &bull; {formatPublishedDate(apiData.createdAt)}
            </p>
            <div className="like-dislike">
             <span>
               <img src={like} alt="like" className="like-icon" />
               {apiData.likes ? formatViewCount(apiData.likes) : 'Like'}
             </span>  
             <span><img src={dislike} alt="dislike" className="dislike-icon" />Dislike</span>
             <span><img src={share} alt="share" className="share-icon" />Share</span>
             <span><img src={save} alt="save" className="save-icon" />Save</span>
            </div>
        </div> 
        
        <hr />
        
        <div className="publisher">
            <img 
              src={channelData?.avatar || jack} 
              alt={channelData?.fullname || channelData?.username || "Channel"} 
              className="publisher-image" 
            />
            <div>
                <p>{channelData?.fullname || channelData?.username || 'Unknown User'}</p>
                <p>Channel</p>
            </div>
            <button className="subscribe-button">Subscribe</button>
        </div>
        
        <div className="video-description">
            <p>{apiData.description || 'No description available'}</p>
        </div>
        
        <hr />
        
        <div className="comment-section">
            <p>{commentData.length > 0 ? `${commentData.length} Comments` : 'Comments'}</p>
            <div className="comment">
                <img src={user_profile} alt="user" className="user-profile" />
                <input type="text" placeholder="Add a public comment..." className="comment-input" />
                <button className="comment-button">Post</button>
            </div>
            
            {/* Dynamic comments */}
            {commentData.map((comment, index) => (
              <div key={index} className="comment-item">
                  <img 
                    src={comment.owner?.avatar || user_profile} 
                    alt="user" 
                    className="comment-user-profile" 
                  />
                  <div className="comment-content">
                      <p className="comment-author">
                        {comment.owner?.fullname || comment.owner?.username || 'Unknown User'}
                      </p>
                      <p className="comment-text">
                        {comment.content}
                      </p>
                  </div>
              </div>
            ))}
        </div>
    </div>
  );
}

export default PlayVideo;
