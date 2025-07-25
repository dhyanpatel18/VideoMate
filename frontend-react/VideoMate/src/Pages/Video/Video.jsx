import React from "react";
import './Video.css'
import PlayVideo from "../../Components/PlayVideo/PlayVideo.jsx";
import Recommended from "../../Components/Recommended/Recommended.jsx";

const Video = () => {
  return(
    <div className="play-container">
      <PlayVideo /><Recommended />
    </div>
  )
}

export default Video;
