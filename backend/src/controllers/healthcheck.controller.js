import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const healthcheck = asyncHandler(async (req, res) => {
    if (req.query.fail === 'true') {
        throw new ApiError(500, 'Simulated healthcheck failure');
    }
    return res.status(200).json(new ApiResponse(200, { status: 'ok' }, 'Server is healthy'));
});

export {
    healthcheck
    }
    