import { Router } from "express";
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Create a playlist
router.post('/', verifyJWT, createPlaylist);

// Get all playlists for a user
router.get('/user/:userId', getUserPlaylists);

// Get a playlist by id
router.get('/:playlistId', getPlaylistById);

// Add a video to a playlist
router.post('/:playlistId/videos/:videoId', verifyJWT, addVideoToPlaylist);

// Remove a video from a playlist
router.delete('/:playlistId/videos/:videoId', verifyJWT, removeVideoFromPlaylist);

// Delete a playlist
router.delete('/:playlistId', verifyJWT, deletePlaylist);

// Update a playlist
router.patch('/:playlistId', verifyJWT, updatePlaylist);

export default router; 