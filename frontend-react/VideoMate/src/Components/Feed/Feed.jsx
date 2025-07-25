import React from "react";
import './Feed.css';
import { Link } from "react-router-dom";
const Feed = () => {
  return (
    <div className="feed">
      <Link to="/video/20/4521" className="card">
      <img src ="/assets/thumbnail1.png" alt ="" />
      <h2>Crack any coding problems</h2>
      <h3>Greatstack</h3>
      <p>10k views &bull; 2 days ago</p>  
      </Link>
      <div className="card">
      <img src ="/assets/thumbnail2.png" alt ="" />
      <h2>Learn React in 30 minutes</h2>
      <h3>CodeAcademy</h3>
      <p>5k views &bull; 1 week ago</p>
      </div>
      <div className="card">
      <img src ="/assets/thumbnail3.png" alt ="" />
      <h2>Max Amini Random Comedy Show</h2>
      <h3>Max Amini</h3>
      <p>200k views &bull; 3 weeks ago</p>
      </div>
      <div className="card">
      <img src ="/assets/thumbnail4.png" alt ="" />
      <h2>F1- The movie (Official Trailer)</h2>
      <h3>Formula 1</h3>
      <p>1M views &bull; 1 hour ago</p>
      </div>
      <div className="card">
      <img src ="/assets/thumbnail5.png" alt ="" />
      <h2>Top 10 JavaScript Frameworks</h2>
      <h3>DevTips</h3>
      <p>15k views &bull; 2 days ago</p>  
      </div>
      <div className="card">
      <img src ="/assets/thumbnail6.png" alt ="" />
      <h2>Understanding AI and Machine Learning</h2>
      <h3>TechWorld</h3>
      <p>8k views &bull; 3 days ago</p>
      </div>
      <div className="card">
      <img src ="/assets/thumbnail7.png" alt ="" />
      <h2>Travel Vlog: Exploring Japan</h2>
      <h3>Wanderlust</h3>
      <p>50k views &bull; 1 week ago</p>
      </div>
      <div className="card">
      <img src ="/assets/thumbnail8.png" alt ="" />
      <h2>Cooking with Jamie: Pasta Recipes</h2>
      <h3>Jamie Oliver</h3>
      <p>30k views &bull; 2 weeks ago</p>
      </div>

    </div>
    
  );
}

export default Feed;