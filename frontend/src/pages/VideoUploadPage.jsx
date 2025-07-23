import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:3000/api/v1';

const VideoUploadPage = () => {
  const [form, setForm] = useState({ title: '', description: '' });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    if (e.target.name === 'videoFile') setVideoFile(e.target.files[0]);
    if (e.target.name === 'thumbnail') setThumbnail(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const data = new FormData();
    data.append('title', form.title);
    data.append('description', form.description);
    data.append('videoFile', videoFile);
    data.append('thumbnail', thumbnail);
    try {
      await axios.post(`${API_BASE}/videos`, data, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/videos');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="video-upload-container">
      <h2>Upload Video</h2>
      <form onSubmit={handleSubmit} className="video-upload-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="videoFile"
          accept="video/*"
          onChange={handleFileChange}
          required
        />
        <input
          type="file"
          name="thumbnail"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
        <button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Upload'}</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default VideoUploadPage; 