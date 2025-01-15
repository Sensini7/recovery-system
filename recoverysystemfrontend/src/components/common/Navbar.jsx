import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../services/authService';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const AuthButtons = () => {
    if (user) {
      return (
        <button
          onClick={handleLogout}
          className="text-gray-200 hover:text-white font-medium"
        >
          Logout
        </button>
      );
    }

    return (
      <>
        <Link
          to="/login"
          className="text-gray-200 hover:text-white font-medium"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-white text-blue-950 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          Sign Up
        </Link>
      </>
    );
  };

  return (
    <nav className="bg-blue-950 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Company Name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/logos--linux-tux.png"
                alt="Linux Friends Logo"
                className="h-8 w-auto"
              />
              <span className="text-white font-semibold text-xl">
                Solar Recovery
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex space-x-1 rounded-lg bg-blue-900/40 p-1">
              <Link
                to="/products"
                className="px-3 py-1.5 text-sm font-medium transition-colors rounded-md text-gray-200 hover:text-white"
              >
                Products
              </Link>
              <Link
                to="/services"
                className="px-3 py-1.5 text-sm font-medium transition-colors rounded-md text-gray-200 hover:text-white"
              >
                Services
              </Link>
              <Link
                to="/courses"
                className="px-3 py-1.5 text-sm font-medium transition-colors rounded-md text-gray-200 hover:text-white"
              >
                Courses
              </Link>
              <Link
                to="/about"
                className="px-3 py-1.5 text-sm font-medium transition-colors rounded-md text-gray-200 hover:text-white"
              >
                About
              </Link>
            </div>

            <div className="flex items-center ml-6 space-x-4">
              <AuthButtons />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-200 hover:text-white"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-950">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-blue-900/40 mb-2">
              <Link
                to="/products"
                className="px-3 py-1.5 text-sm font-medium transition-colors rounded-md text-center text-gray-200 hover:text-white"
              >
                Products
              </Link>
              <Link
                to="/services"
                className="px-3 py-1.5 text-sm font-medium transition-colors rounded-md text-center text-gray-200 hover:text-white"
              >
                Services
              </Link>
              <Link
                to="/courses"
                className="px-3 py-1.5 text-sm font-medium transition-colors rounded-md text-center text-gray-200 hover:text-white"
              >
                Courses
              </Link>
              <Link
                to="/about"
                className="px-3 py-1.5 text-sm font-medium transition-colors rounded-md text-center text-gray-200 hover:text-white"
              >
                About
              </Link>
            </div>
            <div className="flex flex-col space-y-2 px-3">
              <AuthButtons />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
