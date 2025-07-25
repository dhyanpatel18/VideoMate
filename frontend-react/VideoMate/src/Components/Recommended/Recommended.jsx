import React from "react";
import './Recommended.css';

const Recommended = () => {
  const recommendedVideos = [
    {
      id: 1,
      thumbnail: "/assets/thumbnail1.png",
      title: "Advanced React Hooks Tutorial",
      channel: "CodeMaster",
      views: "15k views",
      time: "2 days ago"
    },
    {
      id: 2,
      thumbnail: "/assets/thumbnail2.png",
      title: "JavaScript ES6 Features Explained",
      channel: "WebDev Pro",
      views: "8k views", 
      time: "1 week ago"
    },
    {
      id: 3,
      thumbnail: "/assets/thumbnail3.png",
      title: "CSS Grid Layout Complete Guide",
      channel: "Design Hub",
      views: "22k views",
      time: "3 days ago"
    },
    {
      id: 4,
      thumbnail: "/assets/thumbnail4.png",
      title: "Node.js Backend Development",
      channel: "ServerSide",
      views: "12k views",
      time: "5 days ago"
    },
    {
      id: 5,
      thumbnail: "/assets/thumbnail5.png",
      title: "Database Design Best Practices",
      channel: "DataGenius",
      views: "9k views",
      time: "1 week ago"
    },
    {
      id: 6,
      thumbnail: "/assets/thumbnail6.png",
      title: "API Development with Express",
      channel: "BackendMaster",
      views: "18k views",
      time: "4 days ago"
    },
    {
      id: 7,
      thumbnail: "/assets/thumbnail7.png",
      title: "Web Security Fundamentals",
      channel: "CyberSafe",
      views: "11k views",
      time: "6 days ago"
    },
    {
      id: 8,
      thumbnail: "/assets/thumbnail8.png",
      title: "Modern DevOps Practices",
      channel: "CloudOps",
      views: "14k views",
      time: "3 days ago"
    }
  ];

  return (
    <div className="recommended">
      <h2>Recommended Videos</h2>
      <div className="recommended-videos">
        {recommendedVideos.map((video) => (
          <div key={video.id} className="video-card">
            <img src={video.thumbnail} alt={video.title} />
            <div>
              <h3>{video.title}</h3>
              <p>{video.channel}</p>
              <p>{video.views} • {video.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recommended;
