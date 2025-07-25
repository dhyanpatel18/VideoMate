import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { API_KEY } from '../../data.js';
import './SearchResults.css';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Helper functions
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

    const searchVideos = async (searchQuery) => {
        if (!searchQuery || !searchQuery.trim()) return;

        setLoading(true);
        setError(null);

        try {
            // First, search for videos
            const searchUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${encodeURIComponent(searchQuery)}&type=video&regionCode=IN&key=${API_KEY}`;
            
            const searchResponse = await fetch(searchUrl);
            const searchData = await searchResponse.json();

            if (searchData.items && searchData.items.length > 0) {
                // Get video IDs for statistics
                const videoIds = searchData.items.map(item => item.id.videoId).join(',');
                
                // Fetch video statistics
                const statsUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${API_KEY}`;
                const statsResponse = await fetch(statsUrl);
                const statsData = await statsResponse.json();

                if (statsData.items) {
                    setVideos(statsData.items);
                } else {
                    setVideos([]);
                }
            } else {
                setVideos([]);
                setError('No videos found for your search query.');
            }
        } catch (err) {
            console.error('Search error:', err);
            setError('Failed to search videos. Please try again.');
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (query) {
            searchVideos(query);
        }
    }, [query]);

    if (loading) {
        return (
            <div className="search-results">
                <div className="search-header">
                    <h2>Searching for "{query}"...</h2>
                </div>
                <div className="search-grid">
                    {Array(12).fill().map((_, index) => (
                        <div key={index} className="search-card loading">
                            <div className="loading-thumbnail"></div>
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

    if (error) {
        return (
            <div className="search-results">
                <div className="search-header">
                    <h2>Search Results for "{query}"</h2>
                </div>
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => searchVideos(query)} className="retry-button">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="search-results">
            <div className="search-header">
                <h2>Search Results for "{query}"</h2>
                <p className="results-count">
                    {videos.length > 0 ? `Found ${videos.length} results` : 'No results found'}
                </p>
            </div>
            
            {videos.length > 0 ? (
                <div className="search-grid">
                    {videos.map((video) => (
                        <Link 
                            key={video.id}
                            to={`/video/${video.snippet.categoryId}/${video.id}`}
                            className="search-card"
                        >
                            <img 
                                src={video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url}
                                alt={video.snippet.title}
                                onError={(e) => {
                                    e.target.src = '/assets/thumbnail1.png';
                                }}
                            />
                            <div className="search-card-content">
                                <h3>{video.snippet.title}</h3>
                                <p className="channel-name">{video.snippet.channelTitle}</p>
                                <p className="video-meta">
                                    {formatViewCount(video.statistics.viewCount)} views • {formatPublishedDate(video.snippet.publishedAt)}
                                </p>
                                <p className="video-description">
                                    {video.snippet.description.length > 100 
                                        ? video.snippet.description.substring(0, 100) + '...'
                                        : video.snippet.description
                                    }
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="no-results">
                    <div className="no-results-icon">🔍</div>
                    <h3>No videos found</h3>
                    <p>Try different keywords or check your spelling</p>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
