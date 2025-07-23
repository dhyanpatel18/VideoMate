import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const owner = req.user?._id;
    if (!name || !description) {
        throw new ApiError(400, 'Name and description are required');
    }
    const playlist = await Playlist.create({ name, description, owner, videos: [] });
    return res.status(201).json(new ApiResponse(201, playlist, 'Playlist created successfully'));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, 'Invalid user id');
    }
    const playlists = await Playlist.find({ owner: userId }).populate('videos').populate('owner', 'username fullname avatar');
    return res.status(200).json(new ApiResponse(200, playlists, 'User playlists fetched successfully'));
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, 'Invalid playlist id');
    }
    const playlist = await Playlist.findById(playlistId).populate('videos').populate('owner', 'username fullname avatar');
    if (!playlist) {
        throw new ApiError(404, 'Playlist not found');
    }
    return res.status(200).json(new ApiResponse(200, playlist, 'Playlist fetched successfully'));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid playlist or video id');
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, 'Playlist not found');
    }
    if (String(playlist.owner) !== String(req.user._id)) {
        throw new ApiError(403, 'Not authorized to modify this playlist');
    }
    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, 'Video already in playlist');
    }
    playlist.videos.push(videoId);
    await playlist.save();
    return res.status(200).json(new ApiResponse(200, playlist, 'Video added to playlist'));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid playlist or video id');
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, 'Playlist not found');
    }
    if (String(playlist.owner) !== String(req.user._id)) {
        throw new ApiError(403, 'Not authorized to modify this playlist');
    }
    playlist.videos = playlist.videos.filter(v => String(v) !== String(videoId));
    await playlist.save();
    return res.status(200).json(new ApiResponse(200, playlist, 'Video removed from playlist'));
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, 'Invalid playlist id');
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, 'Playlist not found');
    }
    if (String(playlist.owner) !== String(req.user._id)) {
        throw new ApiError(403, 'Not authorized to delete this playlist');
    }
    await playlist.deleteOne();
    return res.status(200).json(new ApiResponse(200, {}, 'Playlist deleted successfully'));
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, 'Invalid playlist id');
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, 'Playlist not found');
    }
    if (String(playlist.owner) !== String(req.user._id)) {
        throw new ApiError(403, 'Not authorized to update this playlist');
    }
    if (name) playlist.name = name;
    if (description) playlist.description = description;
    await playlist.save();
    return res.status(200).json(new ApiResponse(200, playlist, 'Playlist updated successfully'));
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}