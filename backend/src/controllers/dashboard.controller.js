import mongoose from "mongoose"
import {Video} from "../models/video.models.js"
import {Subscription} from "../models/subscription.models.js"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, 'Invalid channel id');
    }
    const totalVideos = await Video.countDocuments({ owner: channelId });
    const videos = await Video.find({ owner: channelId }, 'views');
    const totalViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });
    return res.status(200).json(new ApiResponse(200, {
        totalVideos,
        totalViews,
        totalSubscribers
    }, 'Channel stats fetched successfully'));
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, 'Invalid channel id');
    }
    const videos = await Video.find({ owner: channelId });
    return res.status(200).json(new ApiResponse(200, videos, 'Channel videos fetched successfully'));
});

export {
    getChannelStats, 
    getChannelVideos
    }