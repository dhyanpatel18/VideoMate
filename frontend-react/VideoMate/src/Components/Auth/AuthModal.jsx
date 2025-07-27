import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullname: '',
    password: '',
    confirmPassword: ''
  });
  const [files, setFiles] = useState({
    avatar: null,
    coverImage: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

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

    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        // Check if avatar is selected
        if (!files.avatar) {
          throw new Error('Avatar is required');
        }
        
        // Create FormData for file upload
        const formDataToSend = new FormData();
        formDataToSend.append('username', formData.username);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('fullname', formData.fullname);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('avatar', files.avatar);
        
        if (files.coverImage) {
          formDataToSend.append('coverImage', files.coverImage);
        }
        
        await register(formDataToSend);
      }
      onClose();
      setFormData({
        username: '',
        email: '',
        fullname: '',
        password: '',
        confirmPassword: ''
      });
      setFiles({
        avatar: null,
        coverImage: null
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="auth-header">
          <h2>{isLogin ? 'Login' : 'Register'}</h2>
          <button 
            className="toggle-auth"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="avatar" className="file-label">
                Avatar (Required)
              </label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                onChange={handleFileChange}
                required={!isLogin}
                className="file-input"
              />
              {files.avatar && (
                <div className="file-preview">
                  <img 
                    src={URL.createObjectURL(files.avatar)} 
                    alt="Avatar preview" 
                    className="preview-image"
                  />
                </div>
              )}
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="coverImage" className="file-label">
                Cover Image (Optional)
              </label>
              <input
                type="file"
                id="coverImage"
                name="coverImage"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
              {files.coverImage && (
                <div className="file-preview">
                  <img 
                    src={URL.createObjectURL(files.coverImage)} 
                    alt="Cover image preview" 
                    className="preview-image"
                  />
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal; 