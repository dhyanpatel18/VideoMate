import React from "react";
import './PlayVideo.css';
import video1 from '/assets/video.mp4'; // Assuming you have a video file to link to
import like from '/assets/like.png';
import dislike from '/assets/dislike.png';
import share from '/assets/share.png';
import save from '/assets/save.png';
import jack from '/assets/jack.png';
import user_profile from '/assets/user_profile.jpg';

//AIzaSyAMcqjXfuoytE21Fl-VQ6TLp3YrHR-YiJs
const PlayVideo = () => {
  return (
    <div className="play-video">
        <video src = {video1} controls autoPlay muted className="video-player" ></video>
        <h3>Crack any coding problems</h3>
        <div className= "play-video-info">
            <p>10k views &bull; 2 days ago</p>
            <div className="like-dislike">
             <span><img src={like} alt="like" className="like-icon" />125</span>  
             <span><img src={dislike} alt="dislike" className="dislike-icon" />5</span>
             <span><img src={share} alt="share" className="share-icon" />Share</span>
            <span><img src={save} alt="save" className="save-icon" />Save</span>
             </div>
            </div> 
            
            <div className="publisher">
            <img src={jack} alt="jack" className="publisher-image" />
            <div>
                <p>GreatStack</p>
                <p>100k subscribers</p>
            </div>
            <button className="subscribe-button">Subscribe</button>
            </div>
            <div className="video-description">
                <p>Learn how to crack any coding problems with this video</p>
                <p>Subscribe the channel for more coding and tech content</p>
                <hr/>
                <div className="comment-section">
                    <p>130  Comments</p>
                    <div className="comment">
                        <img src={user_profile} alt="user" className="user-profile" />
                        <input type="text" placeholder="Add a public comment..." className="comment-input" />
                        <button className="comment-button">Post</button>
                       </div>
                        <hr/>
                        <div className="comment-item">
                            <img src={user_profile} alt="user" className="comment-user-profile" />
                            <div className="comment-content">
                                <p className="comment-author">User1</p>
                                <p className="comment-text">This video is really helpful!</p>
                            </div>

                        </div>
                        <div className="comment-item">
                            <img src={user_profile} alt="user" className="comment-user-profile" />
                            <div className="comment-content">
                                <p className="comment-author">User2</p>
                                <p className="comment-text">Great explanation, thanks!</p>
                                </div>
                                </div>


                    
                </div>
            </div>
        </div>
  );
}

export default PlayVideo;