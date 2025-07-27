import { isValidObjectId } from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = 'createdAt', sortType = 'desc', userId } = req.query;
    const match = {};
    if (query) {
        match.$or = [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
        ];
    }
    if (userId && isValidObjectId(userId)) {
        match.owner = userId;
    }
    const sort = {};
    sort[sortBy] = sortType === 'asc' ? 1 : -1;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const videos = await Video.find(match)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('owner', 'username fullname avatar subscriberCount');
    const total = await Video.countDocuments(match);
    return res.status(200).json(new ApiResponse(200, { videos, total, page: parseInt(page), limit: parseInt(limit) }, 'Videos fetched successfully'));
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const owner = req.user?._id;
    const userExists = await User.exists({ _id: owner });
    if (!userExists) {
      throw new ApiError(404, 'User not found');
    }
    if (!title || !description) {
        throw new ApiError(400, 'Title and description are required');
    }
    const videoFilePath = req.files?.videoFile?.[0]?.path;
    const thumbnailPath = req.files?.thumbnail?.[0]?.path;
    if (!videoFilePath || !thumbnailPath) {
        throw new ApiError(400, 'Video file and thumbnail are required');
    }
    const videoUpload = await uploadOnCloudinary(videoFilePath);
    const thumbnailUpload = await uploadOnCloudinary(thumbnailPath);
    if (!videoUpload || !thumbnailUpload) {
        throw new ApiError(500, 'File upload failed');
    }
    const video = await Video.create({
        videoFile: videoUpload.url,
        thumbnail: thumbnailUpload.url,
        title,
        description,
        duration: 0,
        owner
    });
    return res.status(201).json(new ApiResponse(201, video, 'Video published successfully'));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid video id');
    }
    const video = await Video.findById(videoId).populate('owner', 'username fullname avatar subscriberCount');
    if (!video) {
        throw new ApiError(404, 'Video not found');
    }
    return res.status(200).json(new ApiResponse(200, video, 'Video fetched successfully'));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid video id');
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, 'Video not found');
    }
    if (String(video.owner) !== String(req.user._id)) {
        throw new ApiError(403, 'Not authorized to update this video');
    }
    const { title, description } = req.body;
    if (title) video.title = title;
    if (description) video.description = description;
    if (req.files?.thumbnail?.[0]?.path) {
        const thumbnailUpload = await uploadOnCloudinary(req.files.thumbnail[0].path);
        if (thumbnailUpload) video.thumbnail = thumbnailUpload.url;
    }
    await video.save();
    return res.status(200).json(new ApiResponse(200, video, 'Video updated successfully'));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid video id');
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, 'Video not found');
    }
    if (String(video.owner) !== String(req.user._id)) {
        throw new ApiError(403, 'Not authorized to delete this video');
    }
    await video.deleteOne();
    return res.status(200).json(new ApiResponse(200, {}, 'Video deleted successfully'));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid video id');
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, 'Video not found');
    }
    if (String(video.owner) !== String(req.user._id)) {
        throw new ApiError(403, 'Not authorized to update this video');
    }
    video.isPublished = !video.isPublished;
    await video.save();
    return res.status(200).json(new ApiResponse(200, video, 'Video publish status toggled'));
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}