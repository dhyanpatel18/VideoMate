import React from "react";
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
            
            {/* Sidebar - Completely hidden when closed */}
            <div className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <div className="shortcut-links">
                    <br/><br/>
                    <div className="side-link active">
                        <img src="/assets/home.png" alt="Home" className="side-icon" />
                        <p>Home</p>
                    </div>
                    <div className="side-link">
                        <img src="/assets/game_icon.png" alt="Games" className="side-icon" />
                        <p>Games</p>
                    </div>
                    <div className="side-link">
                        <img src="/assets/automobiles.png" alt="Automobiles" className="side-icon" />
                        <p>Automobiles</p>
                    </div>
                    <div className="side-link">
                        <img src="/assets/entertainment.png" alt="Entertainment" className="side-icon" />
                        <p>Entertainment</p>
                    </div>
                    <div className="side-link">
                        <img src="/assets/music.png" alt="Music" className="side-icon" />
                        <p>Music</p>
                    </div>
                    <div className="side-link">
                        <img src="/assets/blogs.png" alt="Blogs" className="side-icon" />
                        <p>Blogs</p>
                    </div>
                    <div className="side-link">
                        <img src="/assets/news.png" alt="News" className="side-icon" />
                        <p>News</p>
                    </div>
                </div>

                <hr className="sidebar-divider" />

                <div className="subscribed_list">
                    <h3>Subscribed</h3>
                    <div className="side-link">
                        <img src="/assets/jack.png" alt="Pewdiepie" className="side-icon" />
                        <p>Pewdiepie</p>
                    </div>
                    <div className="side-link">
                        <img src="/assets/simon.png" alt="MrBeast" className="side-icon" />
                        <p>MrBeast</p>
                    </div>
                    <div className="side-link">
                        <img src="/assets/tom.png" alt="Justin Bieber" className="side-icon" />
                        <p>Justin Bieber</p>
                    </div>
                    <div className="side-link">
                        <img src="/assets/megan.png" alt="Falcons" className="side-icon" />
                        <p>Falcons</p>
                    </div>
                    <div className="side-link">
                        <img src="/assets/cameron.png" alt="Sand Paper" className="side-icon" />
                        <p>Sand Paper</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
