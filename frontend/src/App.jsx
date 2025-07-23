import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AuthProvider from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VideoListPage from './pages/VideoListPage';
import VideoDetailPage from './pages/VideoDetailPage';
import VideoUploadPage from './pages/VideoUploadPage';
import PlaylistListPage from './pages/PlaylistListPage';
import PlaylistDetailPage from './pages/PlaylistDetailPage';
import DashboardPage from './pages/DashboardPage';
import HealthcheckPage from './pages/HealthcheckPage';
import TweetListPage from './pages/TweetListPage';
import LikeListPage from './pages/LikeListPage';
import CommentListPage from './pages/CommentListPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth (no layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* All other pages use the VideoMate layout */}
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route path="/videos" element={<VideoListPage />} />
                  <Route path="/videos/upload" element={<ProtectedRoute><VideoUploadPage /></ProtectedRoute>} />
                  <Route path="/videos/:videoId" element={<VideoDetailPage />} />
                  <Route path="/playlists" element={<ProtectedRoute><PlaylistListPage /></ProtectedRoute>} />
                  <Route path="/playlists/:playlistId" element={<ProtectedRoute><PlaylistDetailPage /></ProtectedRoute>} />
                  <Route path="/dashboard/:channelId" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                  <Route path="/tweets" element={<ProtectedRoute><TweetListPage /></ProtectedRoute>} />
                  <Route path="/likes" element={<ProtectedRoute><LikeListPage /></ProtectedRoute>} />
                  <Route path="/videos/:videoId/comments" element={<ProtectedRoute><CommentListPage /></ProtectedRoute>} />
                  <Route path="/healthcheck" element={<HealthcheckPage />} />
                  <Route path="*" element={<Navigate to="/videos" />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
