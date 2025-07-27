import React, { useState } from "react";
import './Navbar.css';
import { HiMenu, HiSearch, HiUpload, HiBell, HiDotsVertical, HiUser, HiLogout } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../Auth/AuthModal';

const Navbar = ({ toggleSidebar, onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to search results page with query
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            // Also trigger search in parent component if needed
            if (onSearch) {
                onSearch(searchQuery.trim());
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit(e);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <>
            <nav className="flex-div">
                <div className="nav-left flex-div">
                    <HiMenu className="menu-icon" onClick={toggleSidebar} />
                    <div className="logo">
                     <Link to='/'>  <span className="logo-text">VideoMate</span></Link>
                    </div>
                </div>
                <div className="nav-middle flex-div">
                    <form className="search-container" onSubmit={handleSearchSubmit}>
                        <input 
                            type="text" 
                            placeholder="Search videos..." 
                            className="search-bar"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button type="submit" className="search-icon-button">
                            <HiSearch className="search-icon" />
                        </button>
                    </form>
                </div>
                <div className="nav-right flex-div">
                    {isAuthenticated ? (
                        <>
                            <HiUpload className="nav-icon" title="Upload Video" />
                            <HiBell className="nav-icon" title="Notifications" />
                            <HiDotsVertical className="nav-icon" title="More" />
                            <div className="user-profile">
                                <img 
                                    src={user?.avatar || '/assets/user_profile.jpg'} 
                                    alt={user?.fullname || user?.username || 'User'} 
                                    className="profile-avatar"
                                />
                                <span className="username">{user?.username || user?.fullname}</span>
                                <HiLogout className="nav-icon logout-icon" title="Logout" onClick={handleLogout} />
                            </div>
                        </>
                    ) : (
                        <>
                            <HiBell className="nav-icon" title="Notifications" />
                            <HiDotsVertical className="nav-icon" title="More" />
                            <button 
                                className="login-button"
                                onClick={() => setShowAuthModal(true)}
                            >
                                Sign In
                            </button>
                        </>
                    )}
                </div>
            </nav>
            
            <AuthModal 
                isOpen={showAuthModal} 
                onClose={() => setShowAuthModal(false)} 
            />
        </>
    );
};

export default Navbar;
