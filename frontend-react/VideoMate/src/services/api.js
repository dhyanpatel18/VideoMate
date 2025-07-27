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
    try {
      const queryParams = new URLSearchParams(params).toString();
      return await this.request(`/videos?${queryParams}`);
    } catch (error) {
      console.error('Error getting all videos:', error);
      return { data: { videos: [] } };
    }
  }

  async getVideoById(videoId) {
    try {
      return await this.request(`/videos/${videoId}`);
    } catch (error) {
      console.error('Error getting video by ID:', error);
      throw error;
    }
  }

  async publishVideo(formData) {
    try {
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
    } catch (error) {
      console.error('Error publishing video:', error);
      throw error;
    }
  }

  async updateVideo(videoId, formData) {
    try {
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
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  }

  async deleteVideo(videoId) {
    try {
      return await this.request(`/videos/${videoId}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
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
    try {
      return await this.request('/users/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async logout() {
    try {
      return await this.request('/users/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.request('/users/current-user');
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }

  async updateUserProfile(userData) {
    try {
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
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Comment APIs
  async getVideoComments(videoId) {
    try {
      return await this.request(`/comments/${videoId}`);
    } catch (error) {
      console.error('Error fetching comments:', error);
      return { data: { comments: [] } };
    }
  }

  async addComment(videoId, content) {
    try {
      return await this.request(`/comments/${videoId}`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  async updateComment(commentId, content) {
    try {
      return await this.request(`/comments/c/${commentId}`, {
        method: 'PATCH',
        body: JSON.stringify({ content }),
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  }

  async deleteComment(commentId) {
    try {
      return await this.request(`/comments/c/${commentId}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  // Like APIs
  async toggleVideoLike(videoId) {
    try {
      return await this.request(`/likes/toggle/v/${videoId}`, { method: 'POST' });
    } catch (error) {
      console.error('Error toggling video like:', error);
      throw error;
    }
  }

  async toggleCommentLike(commentId) {
    try {
      return await this.request(`/likes/toggle/c/${commentId}`, { method: 'POST' });
    } catch (error) {
      console.error('Error toggling comment like:', error);
      throw error;
    }
  }

  async getLikedVideos() {
    try {
      return await this.request('/likes/videos');
    } catch (error) {
      console.error('Error getting liked videos:', error);
      return { data: [] };
    }
  }

  // Subscription APIs
  async subscribeToChannel(channelId) {
    try {
      return await this.request(`/subscriptions/${channelId}/toggle`, { method: 'POST' });
    } catch (error) {
      console.error('Error subscribing to channel:', error);
      throw error;
    }
  }

  async unsubscribeFromChannel(channelId) {
    try {
      return await this.request(`/subscriptions/${channelId}/toggle`, { method: 'POST' });
    } catch (error) {
      console.error('Error unsubscribing from channel:', error);
      throw error;
    }
  }

  async getSubscribedChannels() {
    try {
      // Get current user first to get their ID
      const userResponse = await this.getCurrentUser();
      if (userResponse && userResponse.data && userResponse.data._id) {
        return await this.request(`/subscriptions/${userResponse.data._id}/subscribed`);
      }
      return { data: [] };
    } catch (error) {
      console.error('Error getting subscribed channels:', error);
      return { data: [] };
    }
  }

  // Playlist APIs
  async createPlaylist(playlistData) {
    try {
      return await this.request('/playlists', {
        method: 'POST',
        body: JSON.stringify(playlistData),
      });
    } catch (error) {
      console.error('Error creating playlist:', error);
      throw error;
    }
  }

  async getUserPlaylists() {
    try {
      return await this.request('/playlists/user');
    } catch (error) {
      console.error('Error getting user playlists:', error);
      return { data: [] };
    }
  }

  async getPlaylistById(playlistId) {
    try {
      return await this.request(`/playlists/${playlistId}`);
    } catch (error) {
      console.error('Error getting playlist:', error);
      throw error;
    }
  }

  async addVideoToPlaylist(playlistId, videoId) {
    try {
      return await this.request(`/playlists/${playlistId}/videos/${videoId}`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error adding video to playlist:', error);
      throw error;
    }
  }

  async removeVideoFromPlaylist(playlistId, videoId) {
    try {
      return await this.request(`/playlists/${playlistId}/videos/${videoId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error removing video from playlist:', error);
      throw error;
    }
  }

  // Dashboard APIs
  async getChannelStats() {
    try {
      return await this.request('/dashboard/stats');
    } catch (error) {
      console.error('Error getting channel stats:', error);
      return { data: {} };
    }
  }

  async getChannelVideos() {
    try {
      return await this.request('/dashboard/videos');
    } catch (error) {
      console.error('Error getting channel videos:', error);
      return { data: [] };
    }
  }
}

export default new ApiService(); 