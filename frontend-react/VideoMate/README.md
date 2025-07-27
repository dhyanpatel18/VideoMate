# VideoMate - Video Sharing Platform

A full-stack video sharing platform built with React.js, Node.js, Express.js, and MongoDB. VideoMate provides a YouTube-like experience with modern UI, real-time interactions, and comprehensive video management features.

## 🚀 Features

### **Core Video Features**
- **Video Upload & Management**: Upload videos with thumbnails, titles, and descriptions
- **Video Playback**: Native HTML5 video player with custom controls
- **Video Grid Layout**: Responsive 3-column grid layout for video browsing
- **Video Categories**: Browse videos by different categories (Gaming, Music, Sports, etc.)
- **Video Search**: Search videos by title and description
- **Video Recommendations**: AI-powered video recommendations

### **User Authentication & Profiles**
- **User Registration**: Sign up with avatar and cover image upload
- **User Login/Logout**: Secure authentication with JWT tokens
- **User Profiles**: Customizable user profiles with avatars and cover images
- **Channel Pages**: Dedicated channel pages for content creators

### **Social Features**
- **Like System**: Like/unlike videos with real-time count updates
- **Comment System**: Add, edit, and delete comments on videos
- **Comment Likes**: Like/unlike comments with count tracking
- **Subscription System**: Subscribe/unsubscribe to channels with real-time count updates
- **User Interactions**: Full social interaction system

### **Content Management**
- **Video Analytics**: View counts and engagement metrics
- **Video History**: Track watched videos
- **Playlist System**: Create and manage video playlists
- **Video Scheduling**: Schedule videos for future publication
- **Bulk Upload**: Upload multiple videos at once

### **UI/UX Features**
- **Dark Theme**: Modern dark theme with consistent styling
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Loading States**: Skeleton loading animations
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Accessibility**: Keyboard navigation and screen reader support

## 🛠️ Tech Stack

### **Frontend**
- **React.js**: Modern UI framework
- **React Router**: Client-side routing
- **React Context**: Global state management
- **CSS3**: Custom styling with CSS Grid and Flexbox
- **React Icons**: Icon library for UI elements

### **Backend**
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **Multer**: File upload middleware
- **Cloudinary**: Cloud media storage and delivery

### **Development Tools**
- **Vite**: Fast build tool and development server
- **ESLint**: Code linting and formatting
- **Git**: Version control

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Cloudinary Account** (for media storage)

## 🚀 Installation & Setup

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd front_and_back
```

### **2. Backend Setup**

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure Environment Variables** (create `.env` file in backend directory):
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/videomate

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

**Start the Backend Server:**
```bash
npm start
```

### **3. Frontend Setup**

```bash
# Navigate to frontend directory
cd frontend-react/VideoMate

# Install dependencies
npm install

# Start the development server
npm run dev
```

### **4. Database Setup**

**Local MongoDB:**
```bash
# Start MongoDB service
mongod

# Or if using MongoDB Atlas, use your connection string
```

**MongoDB Atlas (Recommended):**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `MONGODB_URI` in your `.env` file

### **5. Cloudinary Setup**

1. Create a free account at [Cloudinary](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret
3. Update the Cloudinary variables in your `.env` file

## 🏃‍♂️ Running the Application

### **Development Mode**

1. **Start Backend Server:**
```bash
cd backend
npm start
```
Backend will run on: `http://localhost:3000`

2. **Start Frontend Development Server:**
```bash
cd frontend-react/VideoMate
npm run dev
```
Frontend will run on: `http://localhost:5173`

3. **Open Browser:**
Navigate to `http://localhost:5173`

### **Production Build**

```bash
# Build frontend for production
cd frontend-react/VideoMate
npm run build

# Start backend in production mode
cd backend
NODE_ENV=production npm start
```

## 📁 Project Structure

```
front_and_back/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Custom middlewares
│   │   ├── utils/          # Utility functions
│   │   ├── app.js          # Express app setup
│   │   └── index.js        # Server entry point
│   ├── public/             # Static files
│   └── package.json
└── frontend-react/
    └── VideoMate/
        ├── src/
        │   ├── Components/  # React components
        │   ├── Pages/       # Page components
        │   ├── contexts/    # React contexts
        │   ├── services/    # API services
        │   └── App.jsx      # Main app component
        ├── public/          # Static assets
        └── package.json
```

## 🔧 API Endpoints

### **Authentication**
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `GET /api/v1/users/current-user` - Get current user

### **Videos**
- `GET /api/v1/videos` - Get all videos
- `GET /api/v1/videos/:id` - Get video by ID
- `POST /api/v1/videos` - Upload new video
- `PATCH /api/v1/videos/:id` - Update video
- `DELETE /api/v1/videos/:id` - Delete video

### **Comments**
- `GET /api/v1/comments/:videoId` - Get video comments
- `POST /api/v1/comments/:videoId` - Add comment
- `PATCH /api/v1/comments/c/:commentId` - Update comment
- `DELETE /api/v1/comments/c/:commentId` - Delete comment

### **Likes**
- `POST /api/v1/likes/toggle/v/:videoId` - Toggle video like
- `POST /api/v1/likes/toggle/c/:commentId` - Toggle comment like
- `GET /api/v1/likes/videos` - Get liked videos

### **Subscriptions**
- `POST /api/v1/subscriptions/:channelId/toggle` - Toggle subscription
- `GET /api/v1/subscriptions/:userId/subscribed` - Get subscribed channels

## 🎨 UI Components

### **Core Components**
- **Navbar**: Navigation with search, upload, and user menu
- **Sidebar**: Category navigation and subscribed channels
- **VideoGrid**: Responsive 3-column video grid
- **VideoPlayer**: Custom video player with controls
- **CommentSection**: Interactive comment system
- **ChannelInfo**: Channel details with subscription

### **Authentication Components**
- **AuthModal**: Login/registration modal
- **VideoUpload**: Video upload form with progress

### **Interactive Components**
- **LikeButton**: Like/unlike functionality
- **SubscribeButton**: Subscribe/unsubscribe functionality
- **CommentForm**: Add and edit comments

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption
- **CORS Protection**: Cross-origin resource sharing configuration
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Secure file upload with validation

## 🚀 Performance Optimizations

- **Lazy Loading**: Components load on demand
- **Image Optimization**: Optimized image loading with fallbacks
- **Error Boundaries**: Graceful error handling
- **Loading States**: Skeleton loading for better UX
- **Responsive Design**: Optimized for all screen sizes

## 🐛 Troubleshooting

### **Common Issues**

1. **Backend Connection Error**
   - Check if MongoDB is running
   - Verify environment variables
   - Check if port 3000 is available

2. **Frontend Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

3. **File Upload Issues**
   - Check Cloudinary credentials
   - Verify file size limits
   - Check network connectivity

4. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT token expiration
   - Verify backend is running

### **Debug Mode**

Enable debug logging by setting `NODE_ENV=development` in your backend `.env` file.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **React.js** for the amazing frontend framework
- **Express.js** for the robust backend framework
- **MongoDB** for the flexible database
- **Cloudinary** for media storage solutions
- **React Icons** for the beautiful icon library

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section
2. Review the console logs for errors
3. Verify all environment variables are set correctly
4. Ensure all dependencies are installed

---

**Happy Coding! 🎉**
