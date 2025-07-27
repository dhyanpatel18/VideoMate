# VideoMate - Full Stack Video Platform

A YouTube-like video platform built with React frontend and Node.js backend.

## 🚀 Quick Start

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file (.env):**
   ```bash
   # Create .env file in backend directory
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/videomate
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production
   JWT_EXPIRY=7d
   JWT_REFRESH_EXPIRY=30d
   
   # Cloudinary Configuration (for video/thumbnail uploads)
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   
   # Cookie Configuration
   COOKIE_EXPIRY=7
   COOKIE_SECURE=false
   COOKIE_HTTP_ONLY=true
   COOKIE_SAME_SITE=lax
   ```

4. **Start MongoDB:**
   - Make sure MongoDB is running on your system
   - Or use MongoDB Atlas (cloud service)

5. **Start the backend server:**
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend-react/VideoMate
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## 🔧 Features

### Backend Features
- ✅ User authentication (register/login/logout)
- ✅ Video upload with Cloudinary integration
- ✅ Video CRUD operations
- ✅ Comments system
- ✅ Like/Dislike functionality
- ✅ Subscription system
- ✅ Playlist management
- ✅ Dashboard with channel stats
- ✅ Search functionality
- ✅ Pagination support

### Frontend Features
- ✅ Modern React with Vite
- ✅ Responsive design
- ✅ Video player with controls
- ✅ Real-time video recommendations
- ✅ User authentication UI
- ✅ Search functionality
- ✅ Comment system
- ✅ Like/Dislike buttons
- ✅ Channel subscription
- ✅ Playlist management

## 📁 Project Structure

```
front_and_back/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Auth & upload middlewares
│   │   ├── utils/           # Helper utilities
│   │   └── db/              # Database connection
│   └── package.json
└── frontend-react/
    └── VideoMate/
        ├── src/
        │   ├── Components/   # React components
        │   ├── Pages/        # Page components
        │   ├── services/     # API service layer
        │   ├── contexts/     # React contexts
        │   └── main.jsx      # App entry point
        └── package.json
```

## 🔌 API Integration

The frontend is now fully integrated with your backend API:

### Key Changes Made:
1. **API Service Layer**: Created `src/services/api.js` with all backend endpoints
2. **Authentication Context**: Added `src/contexts/AuthContext.jsx` for user state management
3. **Updated Components**: 
   - Feed component now fetches from your backend
   - Video player uses your video files
   - Comments system integrated
   - Recommendations from your database

### API Endpoints Used:
- `GET /api/v1/videos` - Get all videos
- `GET /api/v1/videos/:id` - Get specific video
- `GET /api/v1/comments/:videoId` - Get video comments
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- And many more...

## 🎯 Next Steps

1. **Set up Cloudinary account** for video/thumbnail uploads
2. **Configure MongoDB** (local or Atlas)
3. **Update environment variables** with your actual values
4. **Test the integration** by uploading videos and testing features

## 🛠️ Development

### Backend Development:
```bash
cd backend
npm run dev  # For development with nodemon
```

### Frontend Development:
```bash
cd frontend-react/VideoMate
npm run dev  # For development with hot reload
```

## 🔒 Environment Variables

Make sure to update the `.env` file in the backend directory with your actual values:

- **MongoDB URI**: Your MongoDB connection string
- **JWT Secrets**: Strong secret keys for authentication
- **Cloudinary Credentials**: For video/thumbnail uploads

## 📝 Notes

- The frontend now uses your backend API instead of YouTube API
- Authentication is handled through JWT tokens
- Video uploads require Cloudinary setup
- All data is stored in your MongoDB database
- CORS is configured to allow frontend-backend communication

## 🐛 Troubleshooting

1. **Backend not starting**: Check MongoDB connection and environment variables
2. **Frontend can't connect**: Ensure backend is running on port 3000
3. **Upload issues**: Verify Cloudinary credentials
4. **Authentication errors**: Check JWT configuration

## 🚀 Deployment

For production deployment:
1. Set up production MongoDB database
2. Configure production environment variables
3. Set up proper CORS origins
4. Use HTTPS in production
5. Configure proper security headers

---

Your video platform is now ready! The frontend and backend are fully connected and ready for development. 🎉
