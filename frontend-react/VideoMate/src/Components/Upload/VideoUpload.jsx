import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import './VideoUpload.css';

const VideoUpload = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [files, setFiles] = useState({
    videoFile: null,
    thumbnail: null
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles({
        ...files,
        [name]: selectedFiles[0]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setUploadProgress(0);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }
      if (!files.videoFile) {
        throw new Error('Video file is required');
      }
      if (!files.thumbnail) {
        throw new Error('Thumbnail is required');
      }

      // Create FormData
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('videoFile', files.videoFile);
      uploadData.append('thumbnail', files.thumbnail);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      const response = await apiService.publishVideo(uploadData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Reset form
      setFormData({ title: '', description: '' });
      setFiles({ videoFile: null, thumbnail: null });
      
      // Close modal and navigate to the uploaded video
      onClose();
      if (response && response.data && response.data._id) {
        navigate(`/video/${response.data._id}`);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="upload-modal-overlay" onClick={onClose}>
      <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="upload-header">
          <h2>Upload Video</h2>
          <p>Share your video with the world</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter video title"
              value={formData.title}
              onChange={handleInputChange}
              required
              maxLength={100}
            />
            <span className="char-count">{formData.title.length}/100</span>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description *</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your video"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              maxLength={500}
            />
            <span className="char-count">{formData.description.length}/500</span>
          </div>

          <div className="form-group">
            <label htmlFor="videoFile" className="form-label">Video File *</label>
            <input
              type="file"
              id="videoFile"
              name="videoFile"
              accept="video/*"
              onChange={handleFileChange}
              required
              className="file-input"
            />
            {files.videoFile && (
              <div className="file-info">
                <span>Selected: {files.videoFile.name}</span>
                <span>Size: {(files.videoFile.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="thumbnail" className="form-label">Thumbnail *</label>
            <input
              type="file"
              id="thumbnail"
              name="thumbnail"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="file-input"
            />
            {files.thumbnail && (
              <div className="thumbnail-preview">
                <img 
                  src={URL.createObjectURL(files.thumbnail)} 
                  alt="Thumbnail preview" 
                  className="preview-thumbnail"
                />
              </div>
            )}
          </div>

          {uploadProgress > 0 && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <span className="progress-text">{uploadProgress}% uploaded</span>
            </div>
          )}

          <button 
            type="submit" 
            className="upload-button"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VideoUpload; 