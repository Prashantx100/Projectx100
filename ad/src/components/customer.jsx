import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';

// --- Lucide React Imports ---
import { 
    MonitorDot, ShoppingCart, Sun, Moon, Search, 
    ChevronLeft, ChevronRight, BoxSelect, Container, Maximize, 
    MapPin, Frown, Plus, ShoppingBag, UploadCloud, UserCheck, X, 
    ArrowLeft, LogIn, Menu, Twitter, Linkedin, Instagram,
    User, ListOrdered, Map, Clock, CheckCircle, Edit3
} from 'lucide-react';

// --- Configuration and Data ---

const THEME_CONFIG = {
    light: {
        PRIMARY_COLOR: '#1A1265',       // Deep Indigo
        SECONDARY_COLOR: '#F5F5F5',     // Light Gray/Cream (Card/Accent BG)
        BASE_BG: '#FFFFFF',             // White Background
        DARK_TEXT: '#111111',           // Near Black Text
        MID_TEXT: '#666666',            // Medium Gray Text
        HOVER_BG: '#EEEEEE',
        DANGER_COLOR: '#EF4444',
        SUCCESS_COLOR: '#10B981',
        ICON: Sun 
    },
    dark: {
        PRIMARY_COLOR: '#9BA3FF',       // Light Indigo/Periwinkle
        SECONDARY_COLOR: '#1F2937',     // Dark Slate Gray (Card/Accent BG)
        BASE_BG: '#111827',             // Charcoal/Near-Black Background
        DARK_TEXT: '#F9FAFB',           // White Text
        MID_TEXT: '#9CA3AF',            // Light Gray Text
        HOVER_BG: '#374151',
        DANGER_COLOR: '#F87171',
        SUCCESS_COLOR: '#34D399',
        ICON: Moon 
    }
};

// --- Mock Data ---

const HOARDING_DATA = [
    { id: 101, name: 'S. G. Highway Crossroad', city: 'Ahmedabad', location: 'Satellite', size: 'Large (30x60)', side: 'North', rate: 125000.00, address: 'Near Croma, Opp. Iscon Mall', is_available: true },
    { id: 102, name: 'C. G. Road Junction', city: 'Ahmedabad', location: 'Navrangpura', size: 'Medium (20x40)', side: 'East', rate: 85000.00, address: 'Corner of CG Road & Stadium', is_available: true },
    { id: 103, name: 'Ring Road Exit 4', city: 'Surat', location: 'Althan', size: 'Small (10x20)', side: 'South', rate: 45000.00, address: 'Near PVR Cinema', is_available: true }, 
    { id: 104, name: 'Adajan Flyover', city: 'Surat', location: 'Adajan', size: 'Large (30x60)', side: 'West', rate: 110000.00, address: 'Under the main flyover bridge', is_available: true },
    { id: 105, name: 'Vastrapur Lake Side', city: 'Ahmedabad', location: 'Vastrapur', size: 'Medium (20x40)', side: 'South-East', rate: 92000.00, address: 'Near lake garden entrance', is_available: true },
    { id: 106, name: 'Akota Bridge End', city: 'Vadodara', location: 'Akota', size: 'Large (30x60)', side: 'North-West', rate: 105000.00, address: 'Opposite Domino\'s Pizza', is_available: true },
    { id: 107, name: 'Gotri Road Bypass', city: 'Vadodara', location: 'Gotri', size: 'Small (10x20)', side: 'North', rate: 55000.00, address: 'Near Reliance Petrol Pump', is_available: true }, 
    { id: 108, name: 'Paldi Circle', city: 'Ahmedabad', location: 'Paldi', size: 'Medium (20x40)', side: 'South', rate: 78000.00, address: 'Near PVR, Paldi', is_available: true },
    { id: 109, name: 'Rander Road T-Point', city: 'Surat', location: 'Rander', size: 'Large (30x60)', side: 'East', rate: 130000.00, address: 'Opposite DMart', is_available: true },
    { id: 110, name: 'V.I.P. Road Junction', city: 'Vadodara', location: 'Karelibaug', size: 'Small (10x20)', side: 'West', rate: 48000.00, address: 'Near Big Bazaar', is_available: true },
    { id: 111, name: '150ft Ring Road', city: 'Rajkot', location: 'Mota Mava', size: 'Large (30x60)', side: 'North', rate: 95000.00, address: 'Opposite Fun Republic', is_available: true },
    { id: 112, name: 'Kalawad Road', city: 'Rajkot', location: 'Nana Mava', size: 'Medium (20x40)', side: 'South', rate: 72000.00, address: 'Near Reliance Mall', is_available: true },
    { id: 113, name: 'University Road Corner', city: 'Rajkot', location: 'University', size: 'Small (10x20)', side: 'East', rate: 60000.00, address: 'Near Atmiya University', is_available: true },
    { id: 114, name: 'Bhagal Circle', city: 'Surat', location: 'Bhagal', size: 'Medium (20x40)', side: 'North', rate: 70000.00, address: 'Opp. Railway Station', is_available: true },
    { id: 115, name: 'Ashram Road Flyover', city: 'Ahmedabad', location: 'Ashram', size: 'Large (30x60)', side: 'West', rate: 140000.00, address: 'Near Vadaj Circle', is_available: true },
];

const MOCK_ORDERS = [
    { id: 'ORD001', hoardingId: 101, date: '2024-10-01', hoarding: 'S. G. Highway Crossroad', total: 125000, status: 'Completed', startDate: '2024-10-10', endDate: '2024-11-10', imageStatus: 'Approved', side: 'North' },
    { id: 'ORD002', hoardingId: 104, date: '2024-10-15', hoarding: 'Adajan Flyover', total: 110000, status: 'Active', startDate: '2024-12-01', endDate: '2025-01-01', imageStatus: 'Pending Review', side: 'West' },
    { id: 'ORD003', hoardingId: 108, date: '2024-11-05', hoarding: 'Paldi Circle', total: 78000, status: 'Pending Payment', startDate: '2025-01-15', endDate: '2025-02-15', imageStatus: 'Not Uploaded', side: 'South' },
    { id: 'ORD004', hoardingId: 109, date: '2024-11-10', hoarding: 'Rander Road T-Point', total: 130000, status: 'Active', startDate: '2025-03-01', endDate: '2025-04-01', imageStatus: 'Rejected (Needs higher resolution)', side: 'East' },
    { id: 'ORD005', hoardingId: 115, date: '2024-11-15', hoarding: 'Ashram Road Flyover', total: 140000, status: 'Completed', startDate: '2024-11-20', endDate: '2024-12-20', imageStatus: 'Approved', side: 'West' },
];

const minRate = 40000;
const maxRate = 150000;
const itemsPerPage = 9;

// --- Utility Functions ---

/** Calculates the max date allowed for booking (Today + 6 months). */
const getMaxDate = (months) => {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    return d.toISOString().split('T')[0];
};

/** Simulates a notification/alert without using the native alert() function. */
const alertMessage = (message, type = 'info') => {
    const currentTheme = localStorage.getItem('ams-theme') || 'light';
    const config = THEME_CONFIG[currentTheme];
    const color = type === 'success' ? config.SUCCESS_COLOR : (type === 'info' ? config.PRIMARY_COLOR : config.DANGER_COLOR);
    
    const container = document.createElement('div');
    container.innerHTML = message;
    container.style.cssText = `
        position: fixed; top: 1rem; right: 1rem; padding: 1rem; 
        background-color: ${color}; color: white; border-radius: 0.5rem; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 1000;
        opacity: 0; transition: transform 0.3s, opacity 0.3s;
        transform: translateX(100%); font-family: Inter, sans-serif;
    `;
    document.body.appendChild(container);
    
    requestAnimationFrame(() => {
        container.style.transform = 'translateX(0)';
        container.style.opacity = '1';
    });

    setTimeout(() => {
        container.style.transform = 'translateX(100%)';
        container.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(container)) {
                document.body.removeChild(container);
            }
        }, 500);
    }, 5000);
};

// --- Component: Image Modal ---

const ImageModal = ({ imageUrl, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9000] p-4" onClick={onClose}>
            <div 
                className="bg-bg rounded-xl shadow-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-auto card" 
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <div className="flex justify-between items-center border-b pb-3 mb-4 border-text-mid border-opacity-30">
                    <h3 className="text-xl font-bold text-text-dark">Live Hoarding Image</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-hover-bg text-text-dark">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {/* Simulated Image Placeholder based on Hoarding ID */}
                <img 
                    src={imageUrl} 
                    alt="Live Hoarding View" 
                    className="w-full h-auto object-contain rounded-lg shadow-md"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x600/EF4444/FFFFFF?text=Image+Unavailable"; }}
                />
                <p className="text-xs text-text-mid text-center mt-3">This is a simulated live image of the hoarding location.</p>
            </div>
        </div>
    );
};


// --- Component: Profile Dropdown Menu ---

const ProfileDropdown = ({ toggleDropdown, setDropdownOpen, setView }) => {
    const dropdownRef = useRef(null);
    
    const menuItems = [
        { name: "Profile Details", icon: User, view: 'profile' },
        { name: "Booking History/Orders", icon: ListOrdered, view: 'orders' },
        { name: "Hoarding Tracker", icon: Map, view: 'tracking' },
        { name: "Image Verification", icon: CheckCircle, view: 'image-verification' },
    ];

    const handleClick = (view) => {
        setView(view);
        setDropdownOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const profileButton = document.getElementById('profile-button-toggle');
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && (!profileButton || !profileButton.contains(event.target))) {
                setDropdownOpen(false);
            }
        };

        if (toggleDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [toggleDropdown, setDropdownOpen]);

    if (!toggleDropdown) return null;

    return (
        <div 
            ref={dropdownRef}
            className="card absolute right-0 mt-2 w-56 rounded-xl shadow-2xl p-2 z-50 transform origin-top-right transition-all duration-200 ease-out"
            style={{ 
                backgroundColor: 'var(--c-secondary)', 
                borderColor: 'var(--c-hover)' 
            }}
        >
            <div className="py-1 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => handleClick(item.view)}
                        className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg text-text-dark hover:bg-hover-bg transition-colors"
                    >
                        <item.icon className="w-4 h-4 mr-3 text-primary" />
                        {item.name}
                    </button>
                ))}
            </div>
        </div>
    );
};


// --- Component: Header ---
const Header = ({ currentTheme, cartItems, toggleTheme, setView }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    
    const navItems = ['Search Hoardings', 'About AMS', 'Contact Us'];
    const ThemeIcon = THEME_CONFIG[currentTheme].ICON;

    const headerClasses = "fixed top-0 left-0 w-full z-50 p-4 md:px-12 backdrop-blur-md border-b shadow-lg bg-bg bg-opacity-90 border-secondary";

    return (
        <header className={headerClasses}>
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <h1 className="text-2xl font-extrabold cursor-pointer text-text-dark" onClick={() => setView('home')}>
                    <span className="text-primary">Adrenaline</span> ADS
                </h1>

                {/* Desktop Menu and Actions */}
                <div className="hidden md:flex items-center space-x-6">
                    <nav className="space-x-8 text-sm font-medium text-text-dark">
                        {navItems.map((item, index) => (
                            <a 
                                key={item} 
                                href={index === 0 ? '#' : `#${item.replace(' ', '').toLowerCase()}`} 
                                className="hover:opacity-80 transition"
                                onClick={() => index === 0 && setView('home')} // Navigate home for search
                            >
                                {item}
                            </a>
                        ))}
                    </nav>

                    {/* Integrated Portal Actions (Cart, Theme, Profile) */}
                    <div className="flex space-x-3 items-center border-l pl-6 border-text-mid border-opacity-30">
                        {/* Cart Icon and Counter */}
                        <button 
                            id="portal-cart-button" 
                            className="relative p-2 rounded-full text-text-dark hover:bg-hover-bg transition-colors" 
                            onClick={() => setView('cart')}
                        >
                            <ShoppingCart className="w-6 h-6" />
                            {cartItems.length > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-danger rounded-full">
                                    {cartItems.length}
                                </span>
                            )}
                        </button>
                        
                        {/* Theme Toggle Button */}
                        <button 
                            id="portal-theme-toggle" 
                            className="p-2 rounded-full text-text-dark hover:bg-hover-bg transition-colors" 
                            onClick={toggleTheme}
                        >
                            <ThemeIcon className="w-6 h-6" />
                        </button>

                        {/* Customer Profile Button with Dropdown */}
                        <div 
                            className="relative"
                            onMouseEnter={() => setDropdownOpen(true)}
                            onMouseLeave={() => setDropdownOpen(false)}
                        >
                            <button 
                                id="profile-button-toggle" // ID for click outside check
                                type="button" 
                                className="flex items-center space-x-2 px-4 py-2 border rounded-[12px] font-semibold text-text-dark hover:bg-primary hover:text-white transition-colors border-primary group"
                                onClick={() => setDropdownOpen(prev => !prev)}
                            >
                                <UserCheck className="w-4 h-4 text-primary group-hover:text-white" />
                                <span className="hidden lg:inline">Profile</span>
                            </button>
                            <ProfileDropdown 
                                toggleDropdown={isDropdownOpen} 
                                setDropdownOpen={setDropdownOpen} 
                                setView={setView}
                            />
                        </div>

                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center space-x-3">
                    {/* Mobile Cart Icon */}
                    <button 
                        className="relative p-1 rounded-full text-text-dark hover:opacity-80 transition-colors" 
                        onClick={() => setView('cart')}
                    >
                        <ShoppingCart className="w-6 h-6" />
                        {cartItems.length > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-danger rounded-full">
                                {cartItems.length}
                            </span>
                        )}
                    </button>
                    <button type="button" onClick={() => setIsOpen(!isOpen)} className="text-text-dark">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Content */}
            {isOpen && (
                <div className="md:hidden mt-4 space-y-3 p-4 rounded-xl shadow-xl card">
                    {navItems.map((item, index) => (
                        <a 
                            key={item} 
                            href={index === 0 ? '#' : `#${item.replace(' ', '').toLowerCase()}`} 
                            className="block font-medium text-lg text-text-dark hover:text-primary transition" 
                            onClick={() => { setIsOpen(false); index === 0 && setView('home'); }}
                        >
                            {item}
                        </a>
                    ))}
                    <div className="pt-4 border-t space-y-3 border-text-mid border-opacity-30">
                        {/* Profile Button in Mobile */}
                        <button 
                            type="button" 
                            className="w-full text-center flex items-center justify-center space-x-2 px-4 py-3 border rounded-xl font-semibold text-text-dark bg-secondary hover:bg-hover-bg transition-colors border-primary"
                            onClick={() => { setView('profile'); setIsOpen(false); }}
                        >
                            <UserCheck className="w-5 h-5 text-primary" />
                            <span>Customer Profile</span>
                        </button>
                        
                        {/* Mobile Theme Toggle */}
                        <div className="flex justify-center pt-2">
                            <button 
                                className="p-2 rounded-full hover:bg-hover-bg transition-colors flex items-center space-x-2 text-text-dark" 
                                onClick={() => { toggleTheme(); setIsOpen(false); }}
                            >
                                <ThemeIcon className="w-5 h-5" />
                                <span>{currentTheme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

// --- Component: Footer ---
const Footer = () => {
    // Helper component for social icons using Lucide
    const SocialIcon = ({ Icon, name }) => (
        <a key={name} href="#" className="hover:opacity-80 transition text-primary" title={name}>
            <Icon className="w-5 h-5" />
        </a>
    );

    return (
        <footer className="border-t pt-16 pb-8 mt-12 bg-secondary border-text-mid border-opacity-30">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-2 md:col-span-1">
                        <h1 className="text-xl font-extrabold mb-3 text-text-dark">
                            <a href="#home"><span className="text-primary">Adrenaline</span> ADS</a>
                        </h1>
                        <p className="text-sm max-w-xs text-text-mid">
                            The next generation platform for instant outdoor advertising management.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 border-b-2 w-min whitespace-nowrap text-text-dark border-primary">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            {['Search', 'Pricing', 'Dashboard', 'FAQ'].map((link) => (
                                <li key={link}><a href="#" className="hover:opacity-80 transition text-text-mid">{link}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 border-b-2 w-min whitespace-nowrap text-text-dark border-primary">Company</h4>
                        <ul className="space-y-2 text-sm">
                            {['About Us', 'Careers', 'Our Team', 'Blog'].map((link) => (
                                <li key={link}><a href="#" className="hover:opacity-80 transition text-text-mid">{link}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 border-b-2 w-min whitespace-nowrap text-text-dark border-primary">Contact</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="text-text-mid">Email: <a href="mailto:contact@ams.com" className="text-text-dark hover:text-primary">contact@ams.com</a></li>
                            <li className="text-text-mid">Phone: <a href="tel:+1234567890" className="text-text-dark hover:text-primary">+1 (234) 567-890</a></li>
                            <li className="flex space-x-4 pt-2">
                                <SocialIcon Icon={Twitter} name="X/Twitter" />
                                <SocialIcon Icon={Linkedin} name="LinkedIn" />
                                <SocialIcon Icon={Instagram} name="Instagram" />
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="text-center pt-8 border-t border-text-mid border-opacity-30">
                    <p className="text-sm text-text-mid">
                        &copy; {new Date().getFullYear()} Adrenaline ADS. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};


// --- Component: HomeView ---
const HomeView = ({ 
    filteredHoardings, paginatedHoardings, totalPages, currentPage, 
    searchTerm, setSearchTerm, filters, handleFilterChange, 
    minPrice, maxPrice, handlePriceChange, handlePriceFilterEnd, 
    sliderFillStyle, changePage, addToCart, handleBookNow, startDateRef, endDateRef 
}) => {
    
    // Unique locations and cities for filter dropdowns
    const uniqueLocations = useMemo(() => {
        let locations = HOARDING_DATA.map(h => h.location);
        if (filters.city) {
            locations = HOARDING_DATA.filter(h => h.city === filters.city).map(h => h.location);
        }
        return [...new Set(locations)].sort();
    }, [filters.city]);

    const renderPagination = () => {
        if (filteredHoardings.length <= itemsPerPage) return null;

        const createButton = (text, page, isDisabled) => (
            <button
                key={typeof text === 'string' ? page : `icon-${page}`}
                className={`min-w-[40px] h-10 px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    isDisabled ? 'bg-secondary text-text-mid cursor-not-allowed opacity-50' : 
                    (page === currentPage ? 'bg-primary text-white shadow-md' : 'bg-secondary text-text-dark hover:bg-hover-bg')
                }`}
                disabled={isDisabled}
                onClick={() => changePage(page)}
            >
                {text}
            </button>
        );

        let buttons = [];
        buttons.push(createButton(<ChevronLeft className="w-4 h-4" />, currentPage - 1, currentPage === 1));

        const renderRange = (start, end) => {
            for (let i = start; i <= end; i++) {
                buttons.push(createButton(i.toString(), i, false));
            }
        };
        
        const ellipsis1Key = `ellipsis-1-${currentPage}`;
        const ellipsis2Key = `ellipsis-2-${currentPage}`;

        if (totalPages <= 7) {
            renderRange(1, totalPages);
        } else {
            if (currentPage <= 4) {
                renderRange(1, 5);
                buttons.push(<span key={ellipsis1Key} className="px-2 text-text-mid">...</span>);
                buttons.push(createButton(totalPages.toString(), totalPages, false));
            } else if (currentPage >= totalPages - 3) {
                buttons.push(createButton('1', 1, false));
                buttons.push(<span key={ellipsis1Key} className="px-2 text-text-mid">...</span>);
                renderRange(totalPages - 4, totalPages);
            } else {
                buttons.push(createButton('1', 1, false));
                buttons.push(<span key={ellipsis1Key} className="px-2 text-text-mid">...</span>);
                renderRange(currentPage - 1, currentPage + 1);
                buttons.push(<span key={ellipsis2Key} className="px-2 text-text-mid">...</span>);
                buttons.push(createButton(totalPages.toString(), totalPages, false));
            }
        }

        buttons.push(createButton(<ChevronRight className="w-4 h-4" />, currentPage + 1, currentPage === totalPages));
        
        return <div key={`pagination-${currentPage}`} className="flex justify-center items-center space-x-2 mt-8">{buttons}</div>;
    };


    return (
        <div id="home-view"> 
            {/* Hero Section with Search */}
            <section className="bg-primary pb-16 shadow-lg">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
                    <h2 className="text-4xl sm:text-5xl font-extrabold mb-3 pt-12">
                        Find Your Perfect Hoarding
                    </h2>
                    <p className="text-white text-opacity-80 text-lg mb-8">
                        Search real-time availability across Crossroads, Cities, and Sizes.
                    </p>

                    {/* Search and Filter Container */}
                    <div className="bg-bg card-container rounded-xl shadow-2xl p-4 sm:p-6 text-left">
                        
                        {/* Main Search Input */}
                        <div className="relative mb-4">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-mid">
                                <Search className="w-5 h-5" />
                            </span>
                            <input 
                                type="text" 
                                id="search-input" 
                                placeholder="Search by Crossroad Name or Address..." 
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 text-text-dark focus:ring-primary focus:border-primary bg-secondary"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); changePage(1); }}
                            />
                        </div>

                        {/* Secondary Filters (City, Location, Size) */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                            {/* City Filter */}
                            <select id="city-filter" name="city" className="p-3 rounded-lg border border-gray-300 text-text-dark focus:ring-primary focus:border-primary bg-secondary" onChange={handleFilterChange} value={filters.city}>
                                <option value="">All Cities</option>
                                <option value="Ahmedabad">Ahmedabad</option>
                                <option value="Surat">Surat</option>
                                <option value="Vadodara">Vadodara</option>
                                <option value="Rajkot">Rajkot</option>
                            </select>

                            {/* Location Filter */}
                            <select id="location-filter" name="location" className="p-3 rounded-lg border border-gray-300 text-text-dark focus:ring-primary focus:border-primary bg-secondary" onChange={handleFilterChange} value={filters.location}>
                                <option value="">All Locations</option>
                                {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                            </select>

                            {/* Size Filter */}
                            <select id="size-filter" name="size" className="p-3 rounded-lg border border-gray-300 text-text-dark focus:ring-primary focus:border-primary bg-secondary" onChange={handleFilterChange} value={filters.size}>
                                <option value="">All Sizes</option>
                                <option value="Small (10x20)">Small (10x20)</option>
                                <option value="Medium (20x40)">Medium (20x40)</option>
                                <option value="Large (30x60)">Large (30x60)</option>
                            </select>
                            
                            <div className="hidden lg:block"></div> 
                        </div>

                        {/* Date & Price Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Date Range Filters */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="min-w-0">
                                    <label htmlFor="startDate-filter" className="text-text-dark font-medium self-center text-sm whitespace-nowrap mb-1 block">From Date:</label>
                                    <input 
                                        type="date" 
                                        id="startDate-filter" 
                                        name="startDate"
                                        ref={startDateRef}
                                        className="w-full p-3 rounded-lg border border-gray-300 text-text-dark focus:ring-primary focus:border-primary bg-secondary" 
                                        onChange={handleFilterChange} 
                                        value={filters.startDate}
                                    />
                                </div>
                                
                                <div className="min-w-0">
                                    <label htmlFor="endDate-filter" className="text-text-dark font-medium self-center text-sm whitespace-nowrap mb-1 block">To Date:</label>
                                    <input 
                                        type="date" 
                                        id="endDate-filter" 
                                        name="endDate"
                                        ref={endDateRef}
                                        className="w-full p-3 rounded-lg border border-gray-300 text-text-dark focus:ring-primary focus:border-primary bg-secondary" 
                                        onChange={handleFilterChange} 
                                        value={filters.endDate}
                                    />
                                </div>
                            </div>

                            {/* Price Range Slider (Dual Thumb) */}
                            <div className="flex flex-col">
                                <label className="text-text-dark font-medium mb-4 flex justify-between">
                                    Price Range: 
                                    <span id="price-range-output">₹{minPrice.toLocaleString('en-IN')} - ₹{maxPrice.toLocaleString('en-IN')}</span>
                                </label>
                                <div id="dual-range-container">
                                    {/* Track and Fill */}
                                    <div id="slider-track" className="bg-gray-300" />
                                    <div id="slider-fill" className="bg-primary" style={sliderFillStyle} />
                                    
                                    {/* Min Slider Input */}
                                    <input 
                                        type="range" 
                                        id="min-price-slider" 
                                        min={minRate} 
                                        max={maxRate} 
                                        value={minPrice} 
                                        step="1000" 
                                        onChange={(e) => handlePriceChange(true, e)}
                                        onMouseUp={handlePriceFilterEnd}
                                        onTouchEnd={handlePriceFilterEnd}
                                    />
                                    {/* Max Slider Input */}
                                    <input 
                                        type="range" 
                                        id="max-price-slider" 
                                        min={minRate} 
                                        max={maxRate} 
                                        value={maxPrice} 
                                        step="1000" 
                                        onChange={(e) => handlePriceChange(false, e)}
                                        onMouseUp={handlePriceFilterEnd}
                                        onTouchEnd={handlePriceFilterEnd}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hoarding Inventory List Section */}
            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <h3 className="text-2xl font-bold mb-6 text-text-dark border-b pb-2">
                    Hoardings Inventory (<span id="total-hoardings-count">{filteredHoardings.length}</span> results found)
                </h3>
                
                {/* Responsive Grid for Hoarding Cards */}
                {paginatedHoardings.length > 0 ? (
                    <div id="hoarding-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedHoardings.map(hoarding => {
                            const isAvailable = hoarding.is_available;
                            const availabilityText = isAvailable ? 'Available Now' : 'Booked/Disabled';
                            const bookButtonColor = isAvailable ? 'bg-primary hover:opacity-90' : 'bg-gray-400 cursor-not-allowed';
                            const bookButtonDisabled = isAvailable ? false : true;
                            
                            let SizeIconComponent;
                            if (hoarding.size === 'Small (10x20)') {
                                SizeIconComponent = BoxSelect;
                            } else if (hoarding.size === 'Medium (20x40)') {
                                SizeIconComponent = Container;
                            } else {
                                SizeIconComponent = Maximize;
                            }
                            
                            const imageUrl = `https://placehold.co/400x250/374151/F9FAFB?text=Hoarding+No.+${hoarding.id}`;

                            return (
                                <div key={hoarding.id} className="card rounded-xl flex flex-col h-full overflow-hidden">
                                    {/* Hoarding Image Placeholder */}
                                    <div className="relative overflow-hidden bg-gray-200 aspect-video">
                                        <img src={imageUrl} alt={`Hoarding at ${hoarding.name}`} className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"/>
                                    </div>

                                    <div className="p-5 flex flex-col justify-between flex-grow">
                                        <div>
                                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${isAvailable ? 'bg-success text-white' : 'bg-danger text-white'} mb-3 inline-block`}>
                                                {availabilityText}
                                            </span>
                                            <h4 className="text-xl font-bold text-primary mb-1">{hoarding.name}</h4>
                                            <p className="text-text-mid text-sm">{hoarding.side} Side - {hoarding.location}, {hoarding.city}</p>
                                            
                                            <div className="mt-2 text-sm space-y-2 border-t border-text-mid border-opacity-20 pt-3">
                                                <p className="text-text-dark font-medium flex items-center">
                                                    <SizeIconComponent className="w-4 h-4 mr-2 text-text-mid" />
                                                    Size: <span className="ml-1 font-semibold">{hoarding.size}</span>
                                                </p>
                                                <p className="text-text-dark font-medium flex items-center">
                                                    <MapPin className="w-4 h-4 mr-2 text-text-mid" />
                                                    Location: <span className="ml-1">{hoarding.address}</span>
                                                </p>
                                                <p className="text-3xl font-extrabold text-text-dark pt-2">
                                                    ₹ {hoarding.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Action Buttons */}
                                        <div className="flex space-x-3 mt-4">
                                            <button 
                                                className={`flex-1 py-2 rounded-lg text-white font-semibold ${bookButtonColor} transition-opacity`} 
                                                disabled={bookButtonDisabled} 
                                                onClick={() => handleBookNow(hoarding.id)}
                                            >
                                                Book Now
                                            </button>
                                            <button 
                                                className="py-2 px-3 rounded-lg text-primary font-semibold border-2 border-primary hover:bg-primary hover:text-white transition-colors disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-500"
                                                disabled={bookButtonDisabled}
                                                onClick={() => addToCart(hoarding.id)}
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div id="no-results" className="text-center p-12 mt-8 rounded-xl bg-secondary card">
                        <Frown className="w-12 h-12 mx-auto mb-4 text-text-mid" />
                        <p className="text-xl font-medium text-text-dark">No hoardings found.</p>
                        <p className="text-text-mid">Try adjusting your search criteria or filters.</p>
                    </div>
                )}

                {/* Pagination Controls */}
                {renderPagination()}
            </main>
        </div>
    );
};

// --- Component: CartView ---
const CartView = ({ cartItems, cartSummary, removeFromCart, setView, isCheckoutReady }) => {
    
    // Simulate successful checkout/payment
    const handleProceedToPayment = () => {
        alertMessage('This would lead to the Payment Initiation (Payment_TBL process).', 'success');
    };

    return (
        <div id="cart-view" className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <h2 className="text-3xl font-bold mb-6 text-primary">Booking Checkout</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Main Content (Hoardings, Image Upload, Billing) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* 1. Selected Hoardings (Cart Items) */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4 text-text-dark border-b pb-2">Selected Hoardings</h3>
                        <div id="cart-items-list" className="space-y-4">
                            {cartItems.length === 0 ? (
                                <div id="empty-cart-message" className="text-center p-12 mt-4 rounded-xl bg-secondary card">
                                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-text-mid" />
                                    <p className="text-xl font-medium text-text-dark">Your cart is empty.</p>
                                    <p className="text-text-mid">Start by exploring our available hoardings!</p>
                                </div>
                            ) : (
                                cartItems.map(hoarding => {
                                    const imageUrl = `https://placehold.co/100x70/374151/F9FAFB?text=Hoarding+No.+${hoarding.id}`;
                                    return (
                                        <div key={hoarding.id} className="card p-4 rounded-xl flex items-center space-x-4">
                                            <img src={imageUrl} alt={hoarding.name} className="w-20 h-14 object-cover rounded-md flex-shrink-0"/>
                                            <div className="flex-grow min-w-0">
                                                <p className="font-bold text-text-dark truncate">{hoarding.name}</p>
                                                <p className="text-text-mid text-sm">{hoarding.size} | {hoarding.city}, {hoarding.location}</p>
                                                <div className="text-xs text-text-mid mt-1">
                                                    <p className="font-medium text-text-dark">Dates: <span className="font-semibold">{hoarding.bookingDates}</span></p>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="font-extrabold text-xl text-primary">₹ {hoarding.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                                                <button onClick={() => removeFromCart(hoarding.id)} className="text-sm text-danger hover:text-opacity-80 mt-1 flex items-center justify-end">
                                                    <X className="w-4 h-4 inline-block align-middle mr-1" /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* 2. Ad Content Image Upload (OPTIONAL) */}
                    <div className="card p-6 rounded-xl border-4 border-dashed border-gray-300">
                        <h3 className="text-xl font-bold mb-4 text-text-dark border-b pb-2 flex items-center">
                            <UploadCloud className="w-5 h-5 mr-2 text-primary" /> Advertisement Content Image (Optional)
                        </h3>
                        <p className="text-sm text-text-mid mb-4">Upload your content image now, or later via your customer dashboard. Booking is allowed without an image.</p>
                        <input 
                            type="file" 
                            id="ad-image-upload" 
                            accept="image/*" 
                            className="w-full text-text-dark file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90 transition-colors"
                        />
                    </div>
                    
                    {/* 3. Billing Details */}
                    <div className="card p-6 rounded-xl">
                        <h3 className="text-xl font-bold mb-4 text-text-dark border-b pb-2 flex items-center">
                            <UserCheck className="w-5 h-5 mr-2" /> Billing & Contact Information
                        </h3>
                        <form id="billing-form" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Full Name (Required)" className="p-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary bg-secondary" required />
                            <input type="email" placeholder="Email Address (Required)" className="p-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary bg-secondary" required />
                            <input type="tel" placeholder="Phone Number (Required)" className="p-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary bg-secondary" required />
                            <input type="text" placeholder="Company/GST (Optional)" className="p-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary bg-secondary" />
                            <textarea placeholder="Full Billing Address (Required)" className="p-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary bg-secondary md:col-span-2" rows="2" required></textarea>
                        </form>
                    </div>

                    <button onClick={() => setView('home')} className="mt-6 py-3 px-6 rounded-lg text-primary font-semibold border-2 border-primary hover:bg-primary hover:text-white transition-colors flex items-center">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Continue Shopping
                    </button>
                </div>
                
                {/* Cart Summary (1/3 width) */}
                <div className="lg:col-span-1">
                    <div className="card p-6 rounded-xl sticky top-4">
                        <h3 className="text-2xl font-bold mb-4 text-text-dark border-b pb-2">Order Summary</h3>
                        
                        <div className="space-y-3 text-text-dark">
                            <div className="flex justify-between">
                                <span className="text-text-mid">Total Items</span>
                                <span className="font-semibold">{cartSummary.itemCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-mid">Booking Subtotal</span>
                                <span className="font-semibold">₹ {cartSummary.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            {/* Grand Total */}
                            <div className="flex justify-between font-bold text-xl pt-4 border-t border-text-mid border-opacity-30">
                                <span>Grand Total</span>
                                <span className="text-primary">₹ {cartSummary.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                        
                        <button 
                            id="checkout-button" 
                            className="w-full mt-6 py-3 px-6 rounded-lg text-white font-semibold bg-success hover:bg-opacity-90 transition-opacity disabled:bg-gray-400 disabled:cursor-not-allowed" 
                            disabled={!isCheckoutReady} 
                            title={isCheckoutReady ? '' : 'Please add items to your cart to proceed.'}
                            onClick={handleProceedToPayment}
                        >
                            Proceed to Payment
                        </button>
                        <p className="text-xs text-text-mid mt-2 text-center">Final payment amount: ₹{cartSummary.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (Payment_TBL)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- New Component: ProfileDetailsView ---
const ProfileDetailsView = ({ setView }) => {
    const initialUser = {
        name: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        phone: "+91 98765 43210",
        lastLogin: "2024-11-19 10:30 AM",
    };
    
    // 1. State for editing
    const [isEditing, setIsEditing] = useState(false);
    const [mockUser, setMockUser] = useState(initialUser);

    const handleEditChange = (e) => {
        setMockUser({ ...mockUser, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        // In a real app, this would be an API call
        alertMessage("Profile updated successfully!", 'success');
        setIsEditing(false);
    };

    return (
        <div id="profile-view" className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <h2 className="text-3xl font-bold mb-6 text-primary flex items-center">
                <User className="w-7 h-7 mr-3"/> Customer Profile Details
            </h2>
            
            {/* 1. Contact Information Card */}
            <div className="card p-6 rounded-xl space-y-4 shadow-lg h-min">
                <h3 className="text-xl font-bold text-text-dark border-b pb-2 flex justify-between items-center">
                    Account Information
                    <button 
                        onClick={() => setIsEditing(prev => !prev)}
                        className="text-primary text-sm font-medium hover:text-opacity-80 flex items-center space-x-1"
                    >
                        <Edit3 className="w-4 h-4" />
                        <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                    </button>
                </h3>
                
                {!isEditing ? (
                    <div className="space-y-3">
                        <p className="text-sm text-text-mid">
                            <span className="font-semibold text-text-dark block">Full Name:</span> {mockUser.name}
                        </p>
                        <p className="text-sm text-text-mid">
                            <span className="font-semibold text-text-dark block">Email:</span> {mockUser.email}
                        </p>
                        <p className="text-sm text-text-mid">
                            <span className="font-semibold text-text-dark block">Phone:</span> {mockUser.phone}
                        </p>
                        <p className="text-sm text-text-mid flex items-center pt-2">
                            <Clock className="w-4 h-4 mr-2 text-text-mid"/> Last Login: {mockUser.lastLogin}
                        </p>
                        <button className="mt-4 w-full py-2 px-4 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-semibold">
                            Change Password (Mock)
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-3">
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Full Name"
                            value={mockUser.name} 
                            onChange={handleEditChange} 
                            className="w-full p-2 rounded-lg border bg-bg text-text-dark border-text-mid border-opacity-30 focus:border-primary" 
                            required 
                        />
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email"
                            value={mockUser.email} 
                            onChange={handleEditChange} 
                            className="w-full p-2 rounded-lg border bg-bg text-text-dark border-text-mid border-opacity-30 focus:border-primary" 
                            required 
                        />
                        <input 
                            type="tel" 
                            name="phone" 
                            placeholder="Phone Number"
                            value={mockUser.phone} 
                            onChange={handleEditChange} 
                            className="w-full p-2 rounded-lg border bg-bg text-text-dark border-text-mid border-opacity-30 focus:border-primary" 
                            required 
                        />
                        <button type="submit" className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-semibold">
                            Save Changes
                        </button>
                    </form>
                )}
            </div>

            <button onClick={() => setView('home')} className="mt-8 py-3 px-6 rounded-lg text-primary font-semibold border-2 border-primary hover:bg-primary hover:text-white transition-colors flex items-center">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Search
            </button>
        </div>
    );
};


// --- New Component: ImageVerificationView (New Dedicated Page) ---
const ImageVerificationView = ({ setView }) => {
    
    const getStatusStyle = (status) => {
        if (status.includes('Approved')) return 'text-success font-semibold';
        if (status.includes('Rejected') || status.includes('Not Uploaded')) return 'text-danger font-semibold';
        return 'text-primary font-semibold'; // Pending Review
    };

    return (
        <div id="image-verification-view" className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            <h2 className="text-3xl font-bold mb-6 text-primary flex items-center">
                <CheckCircle className="w-7 h-7 mr-3"/> Advertisement Image Verification
            </h2>

            <p className="text-text-mid mb-6">Review the status of your uploaded advertisement artwork for each booked hoarding. You can re-upload files if they were rejected.</p>
            
            <div className="card rounded-xl overflow-x-auto shadow-md p-6">
                <table className="min-w-full divide-y divide-text-mid divide-opacity-10">
                    <thead className="bg-hover-bg">
                        <tr>
                            <th className="py-2 text-left text-xs font-medium text-text-mid uppercase">Order ID</th>
                            <th className="py-2 text-left text-xs font-medium text-text-mid uppercase">Hoarding</th>
                            <th className="py-2 text-left text-xs font-medium text-text-mid uppercase">Status</th>
                            <th className="py-2 text-left text-xs font-medium text-text-mid uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-text-dark divide-y divide-text-mid divide-opacity-10">
                        {MOCK_ORDERS.filter(o => o.status !== 'Pending Payment').map(order => {
                            const needsUpload = order.imageStatus.includes('Rejected') || order.imageStatus.includes('Not Uploaded') || order.imageStatus.includes('Creative Pending');
                            
                            return (
                                <tr key={order.id} className="hover:bg-hover-bg transition-colors">
                                    <td className="py-3 whitespace-nowrap text-sm font-medium">{order.id}</td>
                                    <td className="py-3 whitespace-nowrap text-sm">{order.hoarding}</td>
                                    <td className="py-3 whitespace-nowrap text-sm">
                                        <span className={`${getStatusStyle(order.imageStatus)}`}>{order.imageStatus}</span>
                                    </td>
                                    <td className="py-3 whitespace-nowrap text-sm">
                                        {needsUpload ? (
                                            <button 
                                                onClick={() => alertMessage(`Simulating re-upload for ${order.id}.`, 'info')}
                                                className="text-primary hover:underline font-semibold flex items-center text-xs"
                                            >
                                                <UploadCloud className="w-4 h-4 mr-1"/> Re-Upload
                                            </button>
                                        ) : (
                                            <span className="text-success text-xs font-medium">Verified</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <button onClick={() => setView('home')} className="mt-8 py-3 px-6 rounded-lg text-primary font-semibold border-2 border-primary hover:bg-primary hover:text-white transition-colors flex items-center">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Search
            </button>
        </div>
    );
};


// --- New Component: BookingHistoryView (Orders) ---
const BookingHistoryView = ({ setView }) => {
    // Filter data to only show Completed and Active
    const displayOrders = useMemo(() => MOCK_ORDERS.filter(o => o.status === 'Completed' || o.status === 'Active'), []);
    
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed': return 'text-success bg-success/20 border-success';
            case 'Active': return 'text-primary bg-primary/20 border-primary';
            default: return 'text-text-mid bg-secondary/50 border-text-mid';
        }
    };

    return (
        <div id="orders-view" className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            <h2 className="text-3xl font-bold mb-6 text-primary flex items-center">
                <ListOrdered className="w-7 h-7 mr-3"/> Booking History / Orders
            </h2>

            <div className="card rounded-xl overflow-x-auto shadow-md">
                <table className="min-w-full divide-y divide-text-mid divide-opacity-30">
                    <thead className="bg-hover-bg">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-mid uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-mid uppercase tracking-wider">Hoarding Location</th>
                            {/* Display both dates */}
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-mid uppercase tracking-wider">Booking Dates</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-mid uppercase tracking-wider">Total Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-mid uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-mid uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-text-mid divide-opacity-10 text-text-dark">
                        {displayOrders.map(order => (
                            <tr key={order.id} className="hover:bg-hover-bg transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{order.hoarding}</td>
                                {/* Display start and end date */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className="font-semibold">{order.startDate}</span> to <span className="font-semibold">{order.endDate}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">₹ {order.total.toLocaleString('en-IN')}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusStyle(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button 
                                        onClick={() => alertMessage(`Viewing full order details for ${order.id}`, 'info')}
                                        className="text-primary hover:underline disabled:opacity-50"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <button onClick={() => setView('home')} className="mt-8 py-3 px-6 rounded-lg text-primary font-semibold border-2 border-primary hover:bg-primary hover:text-white transition-colors flex items-center">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Search
            </button>
        </div>
    );
};


// --- New Component: TrackingPageView (Tracking) ---
const TrackingPageView = ({ setView, openImageModal }) => {
    // Filter to show only active or completed (in-progress) orders
    const mockTracking = useMemo(() => MOCK_ORDERS.filter(o => o.status === 'Active' || o.status === 'Completed'), []);

    return (
        <div id="tracking-view" className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            <h2 className="text-3xl font-bold mb-6 text-primary flex items-center">
                <Map className="w-7 h-7 mr-3"/> Hoarding Tracking
            </h2>
            
            <p className="text-text-mid mb-6">Monitor the status of your currently booked advertising campaigns.</p>

            <div className="space-y-6">
                {mockTracking.map(item => (
                    <div key={item.id} className="card p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        
                        <div className="flex-grow">
                            <h3 className="text-xl font-bold text-text-dark">{item.hoarding} ({item.city})</h3>
                            {/* ADDED: Hoarding Side information */}
                            <p className="text-sm text-text-mid mt-1 font-medium">
                                Side: <span className='font-semibold'>{item.side}</span>
                            </p>
                            <p className="text-sm text-text-mid mt-1 flex items-center space-x-2">
                                <span className={`font-semibold ${item.status === 'Active' ? 'text-primary' : 'text-success'}`}>
                                    {item.status === 'Active' ? 'Currently Active' : 'Campaign Completed'}
                                </span>
                            </p>
                            <p className="text-xs text-text-mid mt-1">Booked: {item.startDate} to {item.endDate}</p>
                        </div>

                        {/* Removed Progress Bar */}
                        <div className="flex-shrink-0 md:pl-6 pt-4 md:pt-0">
                            {/* Renamed button and added modal action */}
                            <button 
                                onClick={() => openImageModal(item.hoardingId)}
                                className="py-2 px-4 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-sm font-semibold flex items-center"
                            >
                                View Live Image
                            </button>
                        </div>

                    </div>
                ))}
            </div>

            <button onClick={() => setView('home')} className="mt-8 py-3 px-6 rounded-lg text-primary font-semibold border-2 border-primary hover:bg-primary hover:text-white transition-colors flex items-center">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Search
            </button>
        </div>
    );
};


// --- Main Component: CustomerPortal ---
export default function CustomerPortal() {
    // --- State Definitions ---
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('ams-theme') || 'light');
    const [view, setView] = useState('home'); // 'home', 'cart', 'profile', 'orders', 'tracking', or 'image-verification'
    const [cartItems, setCartItems] = useState(() => {
        try {
            const storedCart = localStorage.getItem('ams-cart');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (e) {
            console.error("Could not load cart from storage:", e);
            return [];
        }
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        city: '',
        location: '',
        size: '',
        startDate: '',
        endDate: '',
    });
    const [minPrice, setMinPrice] = useState(minRate);
    const [maxPrice, setMaxPrice] = useState(maxRate);
    
    // State for Image Modal
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState('');

    // --- Refs for Date Constraints ---
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);
    
    // --- Theme Logic ---
    const applyTheme = useCallback((themeName) => {
        const config = THEME_CONFIG[themeName];
        const root = document.documentElement;
        
        for (const [key, value] of Object.entries(config)) {
            if (key !== 'ICON') {
                root.style.setProperty(`--c-${key.toLowerCase().replace('_color', '').replace('_bg', '')}`, value);
            }
        }
        setCurrentTheme(themeName);
        localStorage.setItem('ams-theme', themeName);
        root.className = themeName === 'dark' ? 'dark' : 'light';
    }, []);

    const toggleTheme = () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    };

    // --- Price Range Logic ---
    const calculateSliderFillStyle = useCallback((min, max) => {
        const rangeTotal = maxRate - minRate;
        const minPercent = ((min - minRate) / rangeTotal) * 100;
        const maxPercent = ((max - minRate) / rangeTotal) * 100;
        return {
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
        };
    }, []);
    
    const handlePriceChange = useCallback((isMin, e) => {
        const newValue = Number(e.target.value);
        let newMin = minPrice;
        let newMax = maxPrice;

        if (isMin) {
            newMin = Math.min(newValue, newMax - 1000);
        } else {
            newMax = Math.max(newValue, newMin + 1000);
        }
        
        setMinPrice(newMin);
        setMaxPrice(newMax);
    }, [minPrice, maxPrice]);
    
    const sliderFillStyle = useMemo(() => calculateSliderFillStyle(minPrice, maxPrice), [minPrice, maxPrice, calculateSliderFillStyle]);
    
    // Reset page on price filter end
    const handlePriceFilterEnd = () => {
        setCurrentPage(1);
    };

    // --- Filter Logic ---
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const filterKey = name || e.target.id.replace('-filter', ''); 
        
        setFilters(prev => ({ ...prev, [filterKey]: value }));
        setCurrentPage(1); 
    };
    
    // Combine all filtering logic into a useMemo hook for efficiency
    const filteredHoardings = useMemo(() => {
        const { city, location, size, startDate, endDate } = filters;
        
        if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
            if (view === 'home') {
                 alertMessage("The 'To Date' must be after the 'From Date'.", 'danger');
            }
            return [];
        } 

        return HOARDING_DATA.filter(hoarding => {
            const matchesSearch = searchTerm === '' || 
                                  hoarding.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  hoarding.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  hoarding.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  hoarding.location.toLowerCase().includes(searchTerm.toLowerCase());
                                  
            const matchesCity = !city || hoarding.city === city;
            const matchesLocation = !location || hoarding.location === location;
            const matchesSize = !size || hoarding.size === size;
            
            const matchesPrice = hoarding.rate >= minPrice && hoarding.rate <= maxPrice; 
            const matchesAvailability = hoarding.is_available; 
            
            return matchesSearch && matchesCity && matchesLocation && matchesSize && matchesPrice && matchesAvailability;
        });
    }, [searchTerm, filters, minPrice, maxPrice, view]);

    // --- Pagination Logic ---
    const totalPages = Math.ceil(filteredHoardings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedHoardings = filteredHoardings.slice(startIndex, startIndex + itemsPerPage);

    const changePage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 300, behavior: 'smooth' }); 
        }
    };

    // --- Cart Logic ---
    const saveCart = (newCart) => {
        setCartItems(newCart);
        localStorage.setItem('ams-cart', JSON.stringify(newCart));
    };

    const addToCart = (hoardingId, skipAlert = false) => {
        const hoarding = HOARDING_DATA.find(h => h.id === hoardingId);
        if (!hoarding || !hoarding.is_available) return;

        const { startDate, endDate } = filters;
        if (!startDate || !endDate || new Date(startDate) >= new Date(endDate)) {
            alertMessage("Please select a valid 'From Date' and 'To Date' (To Date must be after From Date) before adding to cart.", 'danger');
            return;
        }

        const cartItemExists = cartItems.some(item => 
            item.id === hoardingId && 
            item.startDate === startDate && 
            item.endDate === endDate
        );

        if (cartItemExists) {
            if (!skipAlert) alertMessage(`${hoarding.name} is already in your cart for these dates.`, 'info');
            return;
        }
        
        const cartItem = { 
            ...hoarding, 
            startDate: startDate, 
            endDate: endDate,
            bookingDates: `${startDate} to ${endDate}`
        };
        
        const newCart = [...cartItems, cartItem];
        saveCart(newCart);
        if (!skipAlert) alertMessage(`${hoarding.name} added to cart!`, 'success');
    };

    const handleBookNow = (hoardingId) => {
        const hoarding = HOARDING_DATA.find(h => h.id === hoardingId);
        const { startDate, endDate } = filters;
        
        if (!startDate || !endDate || new Date(startDate) >= new Date(endDate)) {
            alertMessage("Please select a valid 'From Date' and 'To Date' (To Date must be after From Date) before booking.", 'danger');
            return;
        }

        addToCart(hoardingId, true); 
        
        setView('cart');
        alertMessage(`Booking initiated for ${hoarding.name}. Please proceed to checkout.`, 'success');
    };
    
    const removeFromCart = (hoardingId) => {
        const hoarding = cartItems.find(h => h.id === hoardingId);
        if (!hoarding) return;

        const newCart = cartItems.filter(item => item.id !== hoardingId);
        saveCart(newCart);
        alertMessage(`${hoarding.name} removed from cart.`, 'danger');
    };

    const cartSummary = useMemo(() => {
        const subtotal = cartItems.reduce((sum, item) => sum + item.rate, 0);
        const grandTotal = subtotal; 
        return { subtotal, grandTotal, itemCount: cartItems.length };
    }, [cartItems]);

    const isCheckoutReady = cartSummary.itemCount > 0;

    // --- Image Modal Logic ---
    const openImageModal = (hoardingId) => {
        // Mock image URL based on ID
        const url = `https://placehold.co/800x600/1A1265/F9FAFB?text=Live+View+of+ID+${hoardingId}`;
        setModalImageUrl(url);
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
        setModalImageUrl('');
    };


    // --- Initialization Effect (Theme, Date Constraints) ---
    useEffect(() => {
        applyTheme(currentTheme);

        const today = new Date().toISOString().split('T')[0];
        const maxDate = getMaxDate(6);
        if (startDateRef.current) {
            startDateRef.current.min = today;
            startDateRef.current.max = maxDate;
        }
        if (endDateRef.current) {
            endDateRef.current.min = today;
            endDateRef.current.max = maxDate;
        }
    }, [applyTheme, currentTheme]);
    
    // Effect to ensure the current page is valid after filtering
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        } else if (currentPage > 1 && totalPages === 0) {
            setCurrentPage(1);
        }
    }, [filteredHoardings.length, totalPages, currentPage]);

    // --- Content Renderer Logic (Updated) ---
    const renderContent = () => {
        const homeProps = {
            filteredHoardings, paginatedHoardings, totalPages, currentPage, 
            searchTerm, setSearchTerm, filters, handleFilterChange, 
            minPrice, maxPrice, handlePriceChange, handlePriceFilterEnd, 
            sliderFillStyle, changePage, addToCart, handleBookNow, startDateRef, endDateRef
        };
        
        const cartProps = {
            cartItems, cartSummary, removeFromCart, setView, isCheckoutReady
        };

        switch (view) {
            case 'home':
                return <HomeView {...homeProps} />;
            case 'cart':
                return <CartView {...cartProps} />;
            case 'profile':
                return <ProfileDetailsView setView={setView} />;
            case 'orders':
                return <BookingHistoryView setView={setView} />;
            case 'tracking':
                return <TrackingPageView setView={setView} openImageModal={openImageModal} />;
            case 'image-verification':
                return <ImageVerificationView setView={setView} />;
            default:
                return <HomeView {...homeProps} />;
        }
    };


    return (
        <>
            {/* Custom Styles for Theming and Dual Slider */}
            <style jsx="true">{`
                /* Font import for aesthetics */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
                
                /* Default/Fallback CSS Variables for Tailwind Customization */
                :root {
                    --c-primary: ${THEME_CONFIG.light.PRIMARY_COLOR};
                    --c-secondary: ${THEME_CONFIG.light.SECONDARY_COLOR};
                    --c-base: ${THEME_CONFIG.light.BASE_BG};
                    --c-dark: ${THEME_CONFIG.light.DARK_TEXT};
                    --c-mid: ${THEME_CONFIG.light.MID_TEXT};
                    --c-hover: ${THEME_CONFIG.light.HOVER_BG};
                    --c-danger: ${THEME_CONFIG.light.DANGER_COLOR};
                    --c-success: ${THEME_CONFIG.light.SUCCESS_COLOR};
                    font-family: 'Inter', sans-serif;
                }
                /* Custom Theme Selectors based on JS-added classes (light/dark) */
                .dark {
                    --c-primary: ${THEME_CONFIG.dark.PRIMARY_COLOR};
                    --c-secondary: ${THEME_CONFIG.dark.SECONDARY_COLOR};
                    --c-base: ${THEME_CONFIG.dark.BASE_BG};
                    --c-dark: ${THEME_CONFIG.dark.DARK_TEXT};
                    --c-mid: ${THEME_CONFIG.dark.MID_TEXT};
                    --c-hover: ${THEME_CONFIG.dark.HOVER_BG};
                    --c-danger: ${THEME_CONFIG.dark.DANGER_COLOR};
                    --c-success: ${THEME_CONFIG.dark.SUCCESS_COLOR};
                }
                
                /* Tailwind Configuration Mappings */
                .bg-primary { background-color: var(--c-primary); }
                .text-primary { color: var(--c-primary); }
                .border-primary { border-color: var(--c-primary); }
                .bg-secondary { background-color: var(--c-secondary); }
                .bg-bg { background-color: var(--c-base); }
                .text-text-dark { color: var(--c-dark); }
                .text-text-mid { color: var(--c-mid); }
                .hover\\:bg-hover-bg:hover { background-color: var(--c-hover); }
                .bg-danger { background-color: var(--c-danger); }
                .text-danger { color: var(--c-danger); }
                .bg-success { background-color: var(--c-success); }

                /* Card Style - Uses secondary background color */
                .card { 
                    background-color: var(--c-secondary); 
                    border: 1px solid var(--c-hover); 
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
                }

                /* --- Dual Range Slider Custom CSS --- */
                #dual-range-container {
                    position: relative;
                    height: 1.5rem; 
                    width: 100%;
                }

                #slider-track, #slider-fill {
                    position: absolute;
                    height: 6px;
                    border-radius: 3px;
                    top: 50%;
                    transform: translateY(-50%);
                }

                #slider-track {
                    width: 100%;
                }

                /* Slider Inputs */
                #min-price-slider, #max-price-slider {
                    position: absolute;
                    width: 100%;
                    -webkit-appearance: none;
                    pointer-events: none; /* Allows click-through for the track and fill */
                    height: 1.5rem; 
                    background: transparent;
                    top: 0;
                    z-index: 2;
                }

                /* Slider Thumb Styling */
                #min-price-slider::-webkit-slider-thumb, 
                #max-price-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 15px;
                    height: 15px;
                    background: var(--c-primary);
                    cursor: pointer;
                    border-radius: 50%;
                    box-shadow: 0 0 0 4px var(--c-base); /* Ring uses the base BG color */
                    margin-top: 0px; 
                    pointer-events: all; /* Make thumbs clickable */
                }

                #min-price-slider { z-index: 3; }
                #max-price-slider { z-index: 4; }
                
                /* Ensure all inputs use the correct background color */
                input[type="text"], input[type="email"], input[type="tel"], textarea, select, input[type="date"] {
                    background-color: var(--c-secondary);
                    color: var(--c-dark);
                }

            `}</style>
            
            {/* 1. Header Component (New Fixed Component) */}
            <Header 
                currentTheme={currentTheme} 
                cartItems={cartItems} 
                toggleTheme={toggleTheme} 
                setView={setView}
            />

            {/* 2. Main Content View - Added margin-top to clear the fixed header */}
            <div className="bg-bg min-h-[calc(100vh-64px)] transition-colors duration-300 pt-[6rem]">
                {renderContent()}
            </div>
            
            {/* Image Modal for Tracking View */}
            <ImageModal 
                imageUrl={modalImageUrl} 
                isOpen={isImageModalOpen} 
                onClose={closeImageModal} 
            />

            {/* 3. Footer Component (New Component) */}
            <Footer />
        </>
    );
}