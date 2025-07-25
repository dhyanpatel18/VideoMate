import React from "react";
import './Home.css'
import Feed from "../../Components/Feed/Feed.jsx";

const Home = ({ category, setCategory }) => {
  return(
    <div className="container">
      <Feed category={category} setCategory={setCategory} />
    </div>
  )
}

export default Home
