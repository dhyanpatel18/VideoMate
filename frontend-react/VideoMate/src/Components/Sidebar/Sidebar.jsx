import React from "react";
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar, category, setCategory }) => {
    
    const sidebarData = [
        { id: 0, name: "Home", icon: "/assets/home.png", categoryId: 0 },
        { id: 1, name: "Gaming", icon: "/assets/game_icon.png", categoryId: 20 },
        { id: 2, name: "Automobiles", icon: "/assets/automobiles.png", categoryId: 2 },
        { id: 3, name: "Entertainment", icon: "/assets/entertainment.png", categoryId: 24 },
        { id: 4, name: "Music", icon: "/assets/music.png", categoryId: 10 },
        { id: 6, name: "News", icon: "/assets/news.png", categoryId: 25 },
        { id: 7, name: "Sports", icon: "/assets/sports.png", categoryId: 17 },
    ];

    return (
        <>
            {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
            
            <div className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <div className="shortcut-links">
                    {sidebarData.map((item) => (
                        <div 
                            key={item.id}
                            className={`side-link ${category === item.categoryId ? 'active' : ''}`}
                            onClick={() => setCategory(item.categoryId)}
                        >
                            <img src={item.icon} alt={item.name} className="side-icon" />
                            <p>{item.name}</p>
                        </div>
                    ))}
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
