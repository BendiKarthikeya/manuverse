import React, { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';

const Header = ({ onPageChange, user, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-12">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center space-x-3">
                        <img
                            src="/logos/manudocs_logo.jpg"
                            alt="MANUDOCS"
                            className="h-8 w-auto"
                        />
                        <span className="text-xl font-black text-manu-dark tracking-tight">
                            ManuDocs
                        </span>
                    </div>

                    {/* Desktop Navigation - Updated */}
                    <nav className="hidden md:flex space-x-8">
                        <button
                            onClick={() => user ? onPageChange('ai-agent') : onPageChange('auth')}
                            className="text-manu-dark hover:text-manu-green transition-colors font-medium text-sm"
                        >
                            AI Agent
                        </button>
                        <button
                            onClick={() => user ? onPageChange('upload') : onPageChange('auth')}
                            className="text-manu-dark hover:text-manu-green transition-colors font-medium text-sm"
                        >
                            Upload Docs
                        </button>
                        <button className="text-manu-dark hover:text-manu-green transition-colors font-medium text-sm">
                            Help
                        </button>
                        <button className="text-manu-dark hover:text-manu-green transition-colors font-medium text-sm">
                            Contact Us
                        </button>
                    </nav>


                    {/* Right Side - Auth or Profile */}
                    <div className="hidden md:block">
                        {!user ? (
                            // Not logged in - Show Sign Up button
                            <button
                                onClick={() => onPageChange('auth')}
                                className="bg-manu-green text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
                            >
                                Sign Up / Login
                            </button>
                        ) : (
                            // Logged in - Show Profile
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-2 hover:bg-gray-200 transition-colors"
                                >
                                    <div className="w-6 h-6 bg-manu-green rounded-full flex items-center justify-center">
                                        <User size={14} className="text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-manu-dark max-w-32 truncate">
                                        {user.user_metadata?.full_name || user.email}
                                    </span>
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">

                                        {/* User Info */}
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">
                                                {user.user_metadata?.full_name || 'User'}
                                            </p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>

                                        {/* Menu Items */}
                                        <button className="flex items-center space-x-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                                            <User size={16} />
                                            <span>Profile & Settings</span>
                                        </button>

                                        <hr className="my-2" />

                                        <button
                                            onClick={onLogout}
                                            className="flex items-center space-x-2 w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut size={16} />
                                            <span>Sign out</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-manu-dark hover:text-manu-green"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu - Updated */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg rounded-lg mt-2">
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false); // Close menu
                                    user ? onPageChange('ai-agent') : onPageChange('auth');
                                }}
                                className="block px-3 py-2 text-manu-dark hover:text-manu-green w-full text-left text-sm"
                            >
                                AI Agent
                            </button>
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false); // Close menu
                                    user ? onPageChange('upload') : onPageChange('auth');
                                }}
                                className="block px-3 py-2 text-manu-dark hover:text-manu-green w-full text-left text-sm"
                            >
                                Upload Docs
                            </button>
                            <button className="block px-3 py-2 text-manu-dark hover:text-manu-green w-full text-left text-sm">
                                Help
                            </button>
                            <button className="block px-3 py-2 text-manu-dark hover:text-manu-green w-full text-left text-sm">
                                Contact Us
                            </button>

                            {!user ? (
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        onPageChange('auth');
                                    }}
                                    className="block w-full text-left px-3 py-2 bg-manu-green text-white rounded-lg hover:bg-green-600 text-sm"
                                >
                                    Sign Up / Login
                                </button>
                            ) : (
                                <div className="border-t border-gray-200 pt-2">
                                    <div className="px-3 py-2">
                                        <p className="text-sm font-medium text-gray-900">{user.email}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            onLogout();
                                        }}
                                        className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 text-sm"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </header>
    );
};

export default Header;
