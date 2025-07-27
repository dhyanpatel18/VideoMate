import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import './CommentSection.css';

const CommentSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (videoId) {
      fetchComments();
    }
  }, [videoId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.getVideoComments(videoId);
      if (response && response.data && response.data.comments) {
        setComments(response.data.comments);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments');
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setError('');
      const response = await apiService.addComment(videoId, newComment);
      if (response && response.data) {
        // Fetch the updated comment with populated owner data
        const updatedComment = await apiService.getVideoComments(videoId);
        if (updatedComment && updatedComment.data && updatedComment.data.comments) {
          setComments(updatedComment.data.comments);
        }
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment');
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      setError('');
      const response = await apiService.updateComment(commentId, editText);
      if (response && response.data) {
        setComments(prev => 
          prev.map(comment => 
            comment._id === commentId 
              ? { ...comment, content: editText }
              : comment
          )
        );
        setEditingComment(null);
        setEditText('');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      setError('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      setError('');
      await apiService.deleteComment(commentId);
      setComments(prev => prev.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Failed to delete comment');
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      setError('');
      await apiService.toggleCommentLike(commentId);
      // Refresh comments to get updated like status
      fetchComments();
    } catch (error) {
      console.error('Error liking comment:', error);
      setError('Failed to like comment');
    }
  };

  const formatDate = (dateString) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffTime = Math.abs(now - commentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    const years = Math.floor(diffDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  };

  try {
    if (loading) {
      return (
        <div className="comment-section">
          <h3>Comments</h3>
          <div className="loading-comments">
            {Array(3).fill().map((_, index) => (
              <div key={index} className="comment-skeleton">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-content">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="comment-section">
        <h3>{comments.length} Comments</h3>
        
        {error && <div className="error-message">{error}</div>}

        {/* Add Comment Form */}
        {isAuthenticated && (
          <div className="add-comment">
            <img 
              src={user?.avatar || '/assets/user_profile.jpg'} 
              alt={user?.username || 'User'} 
              className="user-avatar"
            />
            <form onSubmit={handleAddComment} className="comment-form">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="comment-input"
                maxLength={500}
              />
              <button 
                type="submit" 
                className="comment-submit"
                disabled={!newComment.trim()}
              >
                Comment
              </button>
            </form>
          </div>
        )}

        {/* Comments List */}
        <div className="comments-list">
          {comments && comments.length > 0 ? comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <img 
                src={comment.owner?.avatar || '/assets/user_profile.jpg'} 
                alt={comment.owner?.username || 'User'} 
                className="comment-avatar"
              />
              
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-author">
                    {comment.owner?.fullname || comment.owner?.username || 'Unknown User'}
                  </span>
                  <span className="comment-date">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                
                {editingComment === comment._id ? (
                  <div className="edit-comment">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="edit-input"
                      maxLength={500}
                    />
                    <div className="edit-actions">
                      <button 
                        onClick={() => handleEditComment(comment._id)}
                        className="save-btn"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => {
                          setEditingComment(null);
                          setEditText('');
                        }}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="comment-text">{comment.content}</p>
                )}
                
                <div className="comment-actions">
                  <button 
                    onClick={() => handleLikeComment(comment._id)}
                    className={`like-btn ${comment.isLiked ? 'liked' : ''}`}
                  >
                    👍 {comment.likes || 0}
                  </button>
                  
                  {isAuthenticated && user?._id === comment.owner?._id && (
                    <>
                      <button 
                        onClick={() => {
                          setEditingComment(comment._id);
                          setEditText(comment.content);
                        }}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteComment(comment._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="no-comments">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in CommentSection:', error);
    return (
      <div className="comment-section">
        <h3>Comments</h3>
        <div className="error-message">
          Something went wrong loading comments. Please try again later.
        </div>
      </div>
    );
  }
};

export default CommentSection; 