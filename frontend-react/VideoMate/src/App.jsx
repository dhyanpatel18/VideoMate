import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Sidebar from "./Components/Sidebar/Sidebar.jsx";
import Home from "./Pages/Home/Home.jsx";
import Video from "./Pages/Video/Video.jsx";
import './App.css'; 

const App = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="app">
            <Navbar toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            
            <div className={`main-content ${sidebarOpen ? 'with-sidebar' : 'without-sidebar'}`}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/video/:categoryId/:videoId" element={<Video />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
