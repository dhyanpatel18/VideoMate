const API_BASE_URL = 'http://localhost:3000/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth token
  getAuthToken() {
    return localStorage.getItem('accessToken');
  }

  // Helper method to set auth token
  setAuthToken(token) {
    localStorage.setItem('accessToken', token);
  }

  // Helper method to remove auth token
  removeAuthToken() {
    localStorage.removeItem('accessToken');
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Video APIs
  async getAllVideos(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return this.request(`/videos?${queryParams}`);
  }

  async getVideoById(videoId) {
    return this.request(`/videos/${videoId}`);
  }

  async publishVideo(formData) {
    const token = this.getAuthToken();
    const url = `${this.baseURL}/videos`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to publish video');
    }
    return data;
  }

  async updateVideo(videoId, formData) {
    const token = this.getAuthToken();
    const url = `${this.baseURL}/videos/${videoId}`;
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update video');
    }
    return data;
  }

  async deleteVideo(videoId) {
    return this.request(`/videos/${videoId}`, { method: 'DELETE' });
  }

  // User APIs
  async register(userData) {
    const token = this.getAuthToken();
    const url = `${this.baseURL}/users/register`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: userData, // userData is already FormData
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return data;
  }

  async login(credentials) {
    return this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request('/users/logout', { method: 'POST' });
  }

  async getCurrentUser() {
    return this.request('/users/current-user');
  }

  async updateUserProfile(userData) {
    const token = this.getAuthToken();
    const url = `${this.baseURL}/users/update-account`;
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }
    return data;
  }

  // Comment APIs
  async getVideoComments(videoId) {
    return this.request(`/comments/${videoId}`);
  }

  async addComment(videoId, content) {
    return this.request('/comments', {
      method: 'POST',
      body: JSON.stringify({ videoId, content }),
    });
  }

  async updateComment(commentId, content) {
    return this.request(`/comments/${commentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    });
  }

  async deleteComment(commentId) {
    return this.request(`/comments/${commentId}`, { method: 'DELETE' });
  }

  // Like APIs
  async toggleVideoLike(videoId) {
    return this.request(`/likes/toggle/v/${videoId}`, { method: 'POST' });
  }

  async toggleCommentLike(commentId) {
    return this.request(`/likes/toggle/c/${commentId}`, { method: 'POST' });
  }

  async getLikedVideos() {
    return this.request('/likes/videos');
  }

  // Subscription APIs
  async subscribeToChannel(channelId) {
    return this.request(`/subscriptions/${channelId}`, { method: 'POST' });
  }

  async unsubscribeFromChannel(channelId) {
    return this.request(`/subscriptions/${channelId}`, { method: 'DELETE' });
  }

  async getSubscribedChannels() {
    return this.request('/subscriptions/u');
  }

  // Playlist APIs
  async createPlaylist(playlistData) {
    return this.request('/playlists', {
      method: 'POST',
      body: JSON.stringify(playlistData),
    });
  }

  async getUserPlaylists() {
    return this.request('/playlists/user');
  }

  async getPlaylistById(playlistId) {
    return this.request(`/playlists/${playlistId}`);
  }

  async addVideoToPlaylist(playlistId, videoId) {
    return this.request(`/playlists/${playlistId}/videos/${videoId}`, {
      method: 'POST',
    });
  }

  async removeVideoFromPlaylist(playlistId, videoId) {
    return this.request(`/playlists/${playlistId}/videos/${videoId}`, {
      method: 'DELETE',
    });
  }

  // Dashboard APIs
  async getChannelStats() {
    return this.request('/dashboard/stats');
  }

  async getChannelVideos() {
    return this.request('/dashboard/videos');
  }
}

export default new ApiService(); 