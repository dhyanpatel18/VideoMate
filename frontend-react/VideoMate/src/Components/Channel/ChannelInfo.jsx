import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import './ChannelInfo.css';

const ChannelInfo = ({ channelId, channelData }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(channelData?.subscriberCount || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (channelId && isAuthenticated) {
      checkSubscriptionStatus();
    }
    // Update subscriber count when channelData changes
    if (channelData?.subscriberCount !== undefined) {
      console.log('ChannelInfo: Setting subscriber count to:', channelData.subscriberCount);
      setSubscriberCount(channelData.subscriberCount);
    }
  }, [channelId, isAuthenticated, channelData]);

  const checkSubscriptionStatus = async () => {
    try {
      const response = await apiService.getSubscribedChannels();
      if (response && response.data) {
        const subscribed = response.data.some(channel => channel._id === channelId);
        setIsSubscribed(subscribed);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      setError('Please login to subscribe');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (isSubscribed) {
        const response = await apiService.unsubscribeFromChannel(channelId);
        setIsSubscribed(false);
        // Update subscriber count from response
        if (response && response.data && response.data.subscriberCount !== undefined) {
          console.log('ChannelInfo: Updated subscriber count to:', response.data.subscriberCount);
          setSubscriberCount(response.data.subscriberCount);
        }
      } else {
        const response = await apiService.subscribeToChannel(channelId);
        setIsSubscribed(true);
        // Update subscriber count from response
        if (response && response.data && response.data.subscriberCount !== undefined) {
          console.log('ChannelInfo: Updated subscriber count to:', response.data.subscriberCount);
          setSubscriberCount(response.data.subscriberCount);
        }
      }
    } catch (error) {
      setError(error.message || 'Failed to update subscription');
    } finally {
      setLoading(false);
    }
  };

  const formatSubscriberCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (!channelData) {
    return (
      <div className="channel-info">
        <div className="channel-skeleton">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-content">
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="channel-info">
      <div className="channel-header">
        <img 
          src={channelData?.avatar || '/assets/user_profile.jpg'} 
          alt={channelData?.fullname || channelData?.username || 'Channel'} 
          className="channel-avatar"
        />
        
        <div className="channel-details">
          <h3 className="channel-name">
            {channelData?.fullname || channelData?.username || 'Unknown Channel'}
          </h3>
          <p className="channel-username">
            @{channelData?.username || 'unknown'}
          </p>
          <p className="subscriber-count">
            {formatSubscriberCount(subscriberCount)} subscribers
          </p>
        </div>
        
        {isAuthenticated && user?._id !== channelData?._id && (
          <button 
            onClick={handleSubscribe}
            disabled={loading}
            className={`subscribe-button ${isSubscribed ? 'subscribed' : ''}`}
          >
            {loading ? 'Loading...' : (isSubscribed ? 'Subscribed' : 'Subscribe')}
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {channelData?.coverImage && (
        <div className="channel-cover">
          <img 
            src={channelData.coverImage} 
            alt="Channel cover" 
            className="cover-image"
          />
        </div>
      )}

      {channelData?.description && (
        <div className="channel-description">
          <h4>About</h4>
          <p>{channelData.description}</p>
        </div>
      )}
    </div>
  );
};

export default ChannelInfo; 