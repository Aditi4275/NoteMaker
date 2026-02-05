'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiHome, FiFileText, FiBookmark, FiMenu, FiX, FiLogIn, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    const navLinks = user ? [
        { href: '/', label: 'Home', icon: FiHome },
        { href: '/notes', label: 'Notes', icon: FiFileText },
        { href: '/bookmarks', label: 'Bookmarks', icon: FiBookmark },
    ] : [];

    const isActive = (path) => pathname === path;

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="glass-card border-b border-white/10 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-shadow duration-300">
                            <FiBookmark className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                            NoteMark
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
                        {navLinks.length > 0 && navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isActive(link.href)
                                        ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{link.label}</span>
                                </Link>
                            );
                        })}

                        {/* Auth Buttons */}
                        <div className="ml-4 pl-4 border-l border-white/10 flex items-center space-x-2">
                            {user ? (
                                <>
                                    <div className="flex items-center space-x-2 px-3 py-2 text-white/70">
                                        <FiUser className="w-4 h-4" />
                                        <span className="text-sm">{user.name}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-2 px-4 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
                                    >
                                        <FiLogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isActive('/login')
                                            ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                                            : 'text-white/70 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        <FiLogIn className="w-4 h-4" />
                                        <span>Login</span>
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="btn-primary text-sm py-2"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden pb-4 animate-slide-up">
                        <div className="flex flex-col space-y-2">
                            {navLinks.length > 0 && navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive(link.href)
                                            ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                                            : 'text-white/70 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{link.label}</span>
                                    </Link>
                                );
                            })}

                            {/* Mobile Auth */}
                            <div className="pt-2 mt-2 border-t border-white/10">
                                {user ? (
                                    <>
                                        <div className="flex items-center space-x-2 px-4 py-3 text-white/70">
                                            <FiUser className="w-5 h-5" />
                                            <span>{user.name}</span>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-2 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all w-full"
                                        >
                                            <FiLogOut className="w-5 h-5" />
                                            <span>Logout</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center space-x-2 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
                                        >
                                            <FiLogIn className="w-5 h-5" />
                                            <span>Login</span>
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-center space-x-2 mx-4 mt-2 btn-primary"
                                        >
                                            <span>Sign Up</span>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
