import React, { use } from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
const Header = () => {
  const { user , isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-md"
    >
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
        {/* Logo */}
        <div className='flex items-center space-x-3'>
          <div className='w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
            <Briefcase className='w-5 h-5 text-white' />
          </div>
          <span className='text-xl font-bold text-gray-900'>CareerConnect</span>
        </div>

        {/* Navigation Links - Hidden on mobile */}
        <nav className='hidden md:flex items-center space-x-8'>
          <a
            onClick={() => navigate('/find-jobs')}
            className='text-gray-600 hover:text-gray-900 transition-colors font-medium'
          >
            Find Jobs
          </a>
          <a
            onClick={() =>
              navigate(
                isAuthenticated && user?.role === 'employer'
                  ? '/employer-dashboard'
                  : '/login'
              )
            }
            className='text-gray-600 hover:text-gray-900 transition-colors font-medium'
          >
            For Employers
          </a>
        </nav>

        {/* Authentication Buttons */}
        <div className='flex items-center space-x-3'>
          {isAuthenticated ? (
            <div className='flex items-center space-x-3'>
              <span className='text-gray-700'>
                Welcome, {user?.name || "Guest"}

              </span>
              <a
                href={
                  user?.role === 'employer'
                    ? '/employer-dashboard'
                    : '/find-jobs'
                }
                className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-m font-medium'
              >
                Dashboard
              </a>
            </div>
          ) : (
            <>
              <a href="/login" className='text-gray-600 hover:text-gray-900 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-gray-100'>
                Login
              </a>
              <a href="/signup" className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-m font-medium'>
                Sign Up
              </a>
            </>
          )}
        </div>
      </div>
    </div>
    </motion.header>
  );
}

export default Header;
