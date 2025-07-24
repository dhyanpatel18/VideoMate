import React from 'react';
import './Navbar.css';
import { 
    HiMenu, 
    HiSearch, 
    HiUpload, 
    HiBell, 
    HiDotsVertical, 
    HiUser
} from 'react-icons/hi';

const Navbar = ({ toggleSidebar }) => {
    return (
        <nav className="flex-div">
            <div className="nav-left flex-div">
                <HiMenu className="menu-icon" onClick={toggleSidebar} />
                <div className="logo">
                    <img src="/assets/logo.png" alt="VideoMate Logo" className="logo-image" />
                </div>
            </div>
            <div className="nav-middle flex-div">
                <div className="search-container">
                    <input type="text" placeholder="Search..." className="search-bar" />
                    <HiSearch className="search-icon" />
                </div>
            </div>
            <div className="nav-right flex-div">
                <HiUpload className="nav-icon" title="Upload Video" />
                <HiBell className="nav-icon" title="Notifications" />
                <HiDotsVertical className="nav-icon" title="More" />
                <HiUser className="nav-icon profile-icon" title="Profile" />
            </div>
        </nav>
    );
};

export default Navbar;
