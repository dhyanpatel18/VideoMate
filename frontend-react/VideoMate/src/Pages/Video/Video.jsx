import React from "react";
import './Video.css'
import PlayVideo from "../../Components/PlayVideo/PlayVideo.jsx";
import Recommended from "../../Components/Recommended/Recommended.jsx";
import { useParams } from "react-router-dom";

const Video = () => {
  const {videoId, categoryId} = useParams();

  return(
    <div className="play-container">
      <PlayVideo videoId={videoId} />
      <Recommended categoryId={categoryId} videoId={videoId} />
    </div>
  )
}

export default Video;
