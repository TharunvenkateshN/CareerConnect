import React from 'react'
import { useState, useEffect } from 'react'
import {
    Briefcase,
    Building2,
    LogOut,
    Menu,
    X,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { EMPLOYER_MENU, JOB_SEEKER_MENU } from '../../utils/data'

const DashboardLayout = ({ children, activeMenu }) => {

    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeNavItem, setActiveNavItem] = useState(activeMenu || "dashboard");
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) {
                setSidebarOpen(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => { window.removeEventListener("resize", handleResize); }
    }, []);

    //Close drop downs when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (profileDropdownOpen) {
                setProfileDropdownOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [profileDropdownOpen]);

    const handleNavigation = (itemId) => {
        setActiveNavItem(itemId);
        navigate(`/${itemId}`);
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const sidebarCollapsed = !isMobile && false;

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform
        ${isMobile
                        ? sidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                        : "translate-x-0"
                    }
        ${sidebarCollapsed ? "w-16" : "w-64"}
        bg-white border-r border-gray-200`}
            >
                {/* Company logo and name */}
                <div className="flex items-center justify-between h-16 border-b border-gray-200 px-6">
                    {/* Logo Area */}
                    <div className="flex items-center">
                        {(!sidebarCollapsed || isMobile) ? (
                            <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                                    <Briefcase className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-gray-900 font-bold text-xl">CareerConnect</span>
                            </div>
                        ) : (
                            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-white" />
                            </div>
                        )}
                    </div>
                    {/* Mobile Close Button */}
                    {isMobile && (
                        <button onClick={toggleSidebar} className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                            <X className="h-6 w-6" aria-hidden="true" />
                        </button>
                    )}
                </div>


                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {(user?.role === 'employer' ? EMPLOYER_MENU : JOB_SEEKER_MENU).map((item) => (
                        <NavigationItem
                            key={item.id}
                            item={item}
                            isActive={activeMenu === item.id}
                            onClick={handleNavigation}
                            isCollapsed={sidebarCollapsed}
                        />
                    ))}
                </nav>

                {/* Logout */}
                <div className='absolute bottom-4 left-4 right-4'>
                    <button
                        className='w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200'
                        onClick={logout}
                    >
                        <LogOut className='h-5 w-5 flex-shrink-0 text-gray-500' />
                        {!sidebarCollapsed && <span className='ml-3'>Logout</span>}
                    </button>

                </div>
            </div>

            {/* Main Content */}
            <main
                className={`flex-1 overflow-y-auto transition-all duration-300 
                ${isMobile ? 'ml-0' : (sidebarCollapsed ? 'ml-16' : 'ml-64')}`}
            >
                {/* Mobile Header to toggle Sidebar */}
                {isMobile && (
                    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center">
                            <button
                                onClick={toggleSidebar}
                                className="-ml-2 mr-2 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                            >
                                <Menu className="h-6 w-6" aria-hidden="true" />
                            </button>
                            <span className="text-lg font-bold text-gray-900">CareerConnect</span>
                        </div>
                    </div>
                )}
                {children}
            </main>
        </div>
    );
};

const NavigationItem = ({ item, isActive, onClick, isCollapsed }) => {
    const Icon = item.icon;
    return (
        <button
            onClick={() => onClick(item.id)}
            className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
        ${isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
      `}
        >
            <Icon
                className={`flex-shrink-0 h-5 w-5 ${isActive ? "text-blue-600" : "text-gray-500"
                    }`}
            />
            {!isCollapsed && <span className="ml-3 font-medium">{item.label}</span>}
            {isActive && !isCollapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600"></div>
            )}
        </button>
    );
};

export default DashboardLayout