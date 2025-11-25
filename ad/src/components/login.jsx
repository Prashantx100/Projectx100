import React, { useState, createContext, useContext } from 'react';
import { LogIn, Mail, Lock, User, Phone, Globe, X, Sun, Moon, Menu, ChevronDown } from 'lucide-react';

// NOTE: Since we are in a single-file component environment, we are not importing 
// 'react-router-dom', but we keep 'useNavigate' to simulate the redirection logic 
// upon successful form submission.
const useNavigate = () => {
  return (path) => console.log(`[MOCK NAVIGATION]: Redirecting to ${path}`);
};

// Mock Link component for internal navigation without react-router-dom
const Link = ({ to, children, className, style, onClick }) => (
    <a 
        href={to} 
        onClick={(e) => { 
            e.preventDefault(); 
            console.log(`[MOCK LINK]: Navigating to ${to}`); 
            if (onClick) onClick(e);
        }} 
        className={className} 
        style={style}
    >
        {children}
    </a>
);

// --- 1. THEME CONFIGURATION ---
const THEME_CONFIG = {
    light: {
        PRIMARY_COLOR: '#1A1265',      // Deep Indigo
        SECONDARY_COLOR: '#F5F5F5',    // Light Gray/Cream (Card/Accent BG)
        BASE_BG: '#FFFFFF',            // White Background
        DARK_TEXT: '#111111',          // Near Black Text
        MID_TEXT: '#666666',           // Medium Gray Text
        HOVER_BG: '#EEEEEE',
        DANGER_COLOR: '#EF4444',
        SUCCESS_COLOR: '#10B981',
        ICON: Sun // Lucide React icon
    },
    dark: {
        PRIMARY_COLOR: '#9BA3FF',      // Light Indigo/Periwinkle
        SECONDARY_COLOR: '#1F2937',    // Dark Slate Gray (Card/Accent BG)
        BASE_BG: '#111827',            // Charcoal/Near-Black Background
        DARK_TEXT: '#F9FAFB',          // White Text
        MID_TEXT: '#9CA3AF',           // Light Gray Text
        HOVER_BG: '#374151',
        DANGER_COLOR: '#F87171',
        SUCCESS_COLOR: '#34D399',
        ICON: Moon // Lucide React icon
    }
};

// --- 2. THEME CONTEXT AND HOOK ---
const ThemeContext = createContext();

const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
    // Default to dark mode for better visibility on platforms that run this code
    const [themeMode, setThemeMode] = useState('dark'); 
    const themeColors = THEME_CONFIG[themeMode];

    const toggleTheme = () => {
        setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ themeColors, toggleTheme, themeMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Role constants
const ROLE_CUSTOMER = 1;
const ROLE_ADMIN = 2;

// Mock data for Footer links
const mockLinks = [
  { title: "Quick Links", items: ['Search', 'Pricing', 'Dashboard', 'FAQ'] },
  { title: "Company", items: ['About Us', 'Careers', 'Our Team', 'Blog'] },
];
const socialIcons = [
  { Icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c1 1.6 3 2 5 2 6 0 11-5 11-11v-.5c.67-.36 1.25-.85 1.76-1.42z', name: 'X (Twitter)' },
  { Icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z', name: 'LinkedIn' },
  { Icon: 'M18 2h-3.922c-1.465 0-2.845.568-3.882 1.584C9.178 4.606 8.65 5.986 8.65 7.452v2.548H6.65v4h2v7h4v-7h2.898l.602-4h-3.5v-2.548c0-.623.238-1.218.66-1.427 1.407-1.427 4.09-1.427 5.503 0l.004-.002V8z', name: 'Instagram' },
];

// Full SVG path for Google 'G' icon
const googleIconPath = (
  <>
    <path fill="#FFC107" d="M43.611 20.083H42V20h-20v8h11.979c-1.045 3.037-2.94 4.887-5.918 5.828l.192 1.342a12.875 12.875 0 007.828-2.618c2.146-1.789 3.547-4.387 4.092-7.235z"/>
    <path fill="#4CAF50" d="M22 41V33.28h-3.322l-.192 1.342c1.782 1.054 3.794 1.708 5.922 1.708 2.073 0 3.968-.62 5.578-1.71l-1.428-1.096A8.09 8.09 0 0122 36c-2.736 0-5.11-1.353-6.622-3.418L14 34.02v3.98H22z"/>
    <path fill="#4285F4" d="M4.091 28.083v-8.166H2V20h2.091a11.968 11.968 0 00.322 8.083H4V28z"/>
    <path fill="#F44336" d="M22 12c-2.457 0-4.743.896-6.527 2.404L14 13.98v-3.98h-.022A12.001 12.001 0 0022 8c2.457 0 4.743.896 6.527 2.404L29 9.976V13.98h.022c-1.784-1.508-4.07-2.404-6.527-2.404z"/>
  </>
);

// ---------- Notification Component ----------
const Notification = ({ message, onClose }) => {
    const { themeColors } = useTheme();

    if (!message) return null;

    return (
        <div
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md p-4 rounded-lg shadow-2xl"
            style={{
                backgroundColor: themeColors.DANGER_COLOR, 
                color: themeColors.BASE_BG, // Use contrasting color for text (white/light grey)
                borderLeft: `4px solid ${themeColors.DANGER_COLOR}80`,
                animation: 'ad-slideIn 0.28s ease-out',
            }}
        >
            <div className="flex justify-between items-center">
                <p className="text-sm font-medium">{message}</p>
                <button onClick={onClose} className="p-1" aria-label="Close notification" style={{ color: themeColors.BASE_BG }}>
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Local animation style */}
            <style>{`
                @keyframes ad-slideIn {
                    from { transform: translate(-50%, -40px); opacity: 0; }
                    to   { transform: translate(-50%, 0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

// Navigation Items for the Menu
const navItems = [
    { name: 'Services', to: '#services' },
    { name: 'About Us', to: '#about' },
    { name: 'Hoardings', to: '#hoardings' },
    { name: 'Contact Us', to: '#contact' }
];

// --- UPDATED HEADER COMPONENT ---
const Header = () => {
    const [isOpen, setIsOpen] = useState(false); // Used for Mobile Menu
    const { themeColors, toggleTheme } = useTheme();
    const ThemeIcon = themeColors.ICON;

    return (
        <header className="fixed top-0 left-0 w-full z-50 p-4 md:px-12 backdrop-blur-xl border-b shadow-lg" 
            style={{ backgroundColor: `${themeColors.BASE_BG}E6`, borderColor: `${themeColors.MID_TEXT}33` }}>
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <h1 className="text-2xl font-extrabold" style={{ color: themeColors.DARK_TEXT }}>
                    <Link to="/"><span style={{ color: themeColors.PRIMARY_COLOR }}>Adrenaline</span> ADS</Link>
                </h1>

                {/* Desktop Navigation / Menu Bar */}
                <div className="hidden md:flex space-x-4 items-center">
                    
                    {/* Theme Toggle (MOVED LEFT) */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-opacity-20 transition"
                        style={{ color: themeColors.DARK_TEXT, backgroundColor: themeColors.HOVER_BG }}
                        aria-label="Toggle theme"
                    >
                        <ThemeIcon className="w-5 h-5" />
                    </button>

                    {/* Navigation Dropdown Menu */}
                    <div className="relative group">
                        <button
                            className="flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition"
                            style={{ color: themeColors.DARK_TEXT, backgroundColor: themeColors.HOVER_BG }}
                            aria-label="Navigation Menu"
                        >
                            <Menu className="w-5 h-5" /> {/* CHANGED TO ICON */}
                            <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                        </button>

                        {/* Dropdown Content */}
                        <div className="absolute right-0 top-full mt-2 w-40 rounded-lg shadow-xl opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100 origin-top-right z-50 overflow-hidden"
                             style={{ backgroundColor: themeColors.SECONDARY_COLOR, border: `1px solid ${themeColors.MID_TEXT}33` }}>
                            {navItems.map((item) => (
                                <a 
                                    key={item.name} 
                                    href={item.to} 
                                    className="block px-4 py-3 text-sm font-medium hover:opacity-80 transition" 
                                    style={{ 
                                        color: themeColors.DARK_TEXT, 
                                        backgroundColor: themeColors.SECONDARY_COLOR,
                                        borderBottom: item.name !== 'Contact Us' ? `1px solid ${themeColors.MID_TEXT}1A` : 'none' 
                                    }}
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Mobile Icons */}
                <div className="md:hidden flex items-center space-x-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-opacity-20 transition"
                        style={{ color: themeColors.DARK_TEXT, backgroundColor: themeColors.HOVER_BG }}
                        aria-label="Toggle theme"
                    >
                        <ThemeIcon className="w-5 h-5" />
                    </button>
                    <button type="button" onClick={() => setIsOpen(!isOpen)} style={{ color: themeColors.DARK_TEXT }}>
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Flyout */}
            {isOpen && (
                <div className="md:hidden mt-4 space-y-3 p-4 rounded-xl shadow-xl" 
                     style={{ backgroundColor: themeColors.SECONDARY_COLOR, border: `1px solid ${themeColors.MID_TEXT}33` }}>
                    {navItems.map((item) => (
                        <a 
                            key={item.name} 
                            href={item.to} 
                            className="block font-medium py-2 hover:opacity-80 transition" 
                            style={{ color: themeColors.DARK_TEXT }} 
                            onClick={() => setIsOpen(false)}>
                            {item.name}
                        </a>
                    ))}
                    {/* Login/Signup links removed from mobile menu as well */}
                </div>
            )}
        </header>
    );
};

// ---------- Footer Component ----------
const Footer = () => {
    const { themeColors } = useTheme();

    return (
        <footer className="border-t pt-16 pb-8" style={{ backgroundColor: themeColors.BASE_BG, borderColor: `${themeColors.MID_TEXT}33` }}>
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-2 md:col-span-1">
                        <h1 className="text-xl font-extrabold mb-3" style={{ color: themeColors.DARK_TEXT }}>
                            <a href="#home" style={{ textDecoration: 'none' }}>
                                <span style={{ color: themeColors.PRIMARY_COLOR }}>Adrenaline</span> ADS
                            </a>
                        </h1>
                        <p className="text-sm max-w-xs" style={{ color: themeColors.MID_TEXT }}>
                            The next generation platform for instant outdoor advertising management.
                        </p>
                    </div>

                    {mockLinks.map((col, index) => (
                        <div key={index}>
                            <h4 className="font-semibold mb-4 border-b w-min whitespace-nowrap" style={{ color: themeColors.DARK_TEXT, borderColor: themeColors.PRIMARY_COLOR }}>
                                {col.title}
                            </h4>
                            <ul className="space-y-2 text-sm" style={{ color: themeColors.MID_TEXT }}>
                                {col.items.map((link) => (
                                    <li key={link}><a href="#" className="hover:underline">{link}</a></li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div>
                        <h4 className="font-semibold mb-4 border-b w-min whitespace-nowrap" style={{ color: themeColors.DARK_TEXT, borderColor: themeColors.PRIMARY_COLOR }}>
                            Contact
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li style={{ color: themeColors.MID_TEXT }}>Email: <a href="mailto:contact@ams.com" style={{ color: themeColors.DARK_TEXT }}>contact@ams.com</a></li>
                            <li style={{ color: themeColors.MID_TEXT }}>Phone: <a href="tel:+1234567890" style={{ color: themeColors.DARK_TEXT }}>+1 (234) 567-890</a></li>
                            <li className="flex space-x-4 pt-2">
                                {socialIcons.map((social) => (
                                    <a key={social.name} href="#" className="transition hover:opacity-80" style={{ color: themeColors.MID_TEXT }}>
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d={social.Icon} />
                                        </svg>
                                    </a>
                                ))}
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="text-center pt-8 border-t" style={{ borderColor: `${themeColors.MID_TEXT}33` }}>
                    <p className="text-sm" style={{ color: themeColors.MID_TEXT }}>
                        &copy; {new Date().getFullYear()} Adrenaline ADS. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

// ---------- ForgotPasswordForm Component ----------
const ForgotPasswordForm = ({ onBack }) => {
    const { themeColors } = useTheme();
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    // Determine text color for the primary button (must contrast with PRIMARY_COLOR)
    const primaryButtonTextColor = themeColors.BASE_BG === THEME_CONFIG.dark.BASE_BG ? '#111111' : '#FFFFFF';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!recoveryEmail || recoveryEmail.length < 5 || !recoveryEmail.includes('@')) {
            setError("Please enter a valid email address.");
            return;
        }
        // Mock API call simulation
        setMessage(`If ${recoveryEmail} is registered, a recovery link will be sent.`);
        setError(null);
        setRecoveryEmail('');
    };

    return (
        <div className="space-y-8 p-4">
            <Notification message={error} onClose={() => setError(null)} />

            <h3 className="text-3xl font-bold text-center" style={{ color: themeColors.DARK_TEXT }}>Forgot Password?</h3>
            <p className="text-center" style={{ color: themeColors.MID_TEXT }}>Enter your registered email to receive a password reset link.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                    <label htmlFor="recoveryEmail" className="sr-only">Email Address</label>
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: themeColors.PRIMARY_COLOR }} />
                    <input
                        type="email"
                        id="recoveryEmail"
                        placeholder="Email Address"
                        required
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        className="w-full p-3 pl-10 rounded-lg border focus:ring-1 transition"
                        style={{ 
                          backgroundColor: themeColors.HOVER_BG, 
                          color: themeColors.DARK_TEXT,
                          borderColor: themeColors.MID_TEXT + '33',
                          outlineColor: themeColors.PRIMARY_COLOR 
                        }}
                    />
                </div>

                <button type="submit" className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-lg font-bold rounded-lg transition hover:opacity-90" 
                    style={{ 
                        background: themeColors.PRIMARY_COLOR, 
                        color: primaryButtonTextColor, 
                        boxShadow: `0 4px 10px ${themeColors.PRIMARY_COLOR}60`
                    }}>
                    <Mail className="w-5 h-5" />
                    <span>Send Reset Link</span>
                </button>

                {message && <p className="text-center text-sm" style={{ color: themeColors.SUCCESS_COLOR }}>{message}</p>}

                <p className="text-center text-sm mt-4">
                    <a href="#" onClick={onBack} style={{ color: themeColors.MID_TEXT }} className="hover:underline hover:opacity-80 transition">Back to Login</a>
                </p>
            </form>
        </div>
    );
};

// ---------- Main AuthPage Component (App) ----------
const AuthPage = () => {
    const { themeColors, themeMode } = useTheme();

    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Mock navigation

    // Auth fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [roleId, setRoleId] = useState(ROLE_CUSTOMER);

    const isAdminLoginMode = isLogin && roleId === ROLE_ADMIN;

    // Determine text color for the primary button (must contrast with PRIMARY_COLOR)
    const primaryButtonTextColor = themeColors.BASE_BG === THEME_CONFIG.dark.BASE_BG ? '#111111' : '#FFFFFF';

    const handleRoleToggle = (e) => {
        e.preventDefault();
        setError(null);
        setIsLogin(true);
        setRoleId(isAdminLoginMode ? ROLE_CUSTOMER : ROLE_ADMIN);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        // Basic Validation
        if (!isLogin) {
            if (password !== confirmPassword) {
                setError("Password mismatch. Please ensure both password fields match.");
                return;
            }
            // Simple 10-digit number validation
            if (!/^\d{10}$/.test(phoneNumber)) {
                setError("Phone number must be exactly 10 digits (numbers only).");
                return;
            }
            if (!fullName || !email || !password || !confirmPassword || !phoneNumber) {
                setError("All sign up fields are required. Please fill them out.");
                return;
            }
        } else {
            if (!email || !password) {
                setError("Email and password are required for login.");
                return;
            }
        }

        const userData = {
            mode: isLogin ? 'Login' : 'Sign Up',
            email,
            password,
            role_id: isLogin ? (isAdminLoginMode ? ROLE_ADMIN : ROLE_CUSTOMER) : ROLE_CUSTOMER,
            ...(isLogin ? {} : { fullname: fullName, phone_number: phoneNumber })
        };

        console.log("--- SUBMISSION SUCCESSFUL ---", userData);
        setError(`Successfully submitted ${userData.mode} form (Role ID: ${userData.role_id}). Mock redirecting...`);

        // Mock redirection
        setTimeout(() => {
            if (userData.role_id === ROLE_ADMIN) {
                navigate('/admin');
            } else {
                navigate('/customer');
            }
        }, 1500);
    };

    // top-level container inline colors
    const pageStyle = {
        backgroundColor: themeColors.BASE_BG,
        color: themeColors.DARK_TEXT,
        minHeight: '100vh',
        fontFamily: 'Inter, sans-serif'
    };

    const cardStyle = { 
        backgroundColor: themeColors.SECONDARY_COLOR, 
        border: `1px solid ${themeColors.PRIMARY_COLOR}2A`,
        boxShadow: `0 10px 30px ${themeMode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)'}`,
    };

    return (
        <div className="min-h-screen flex flex-col" style={pageStyle}>
            <Header />

            <Notification message={error} onClose={() => setError(null)} />

            <main className="flex-grow flex flex-col items-center justify-center w-full p-4 pt-20 md:pt-24">
                {!isForgotPassword && (
                    <div className="w-full max-w-lg mb-2 text-right">
                        <a href="#" onClick={handleRoleToggle} className="text-sm font-medium transition duration-200 flex items-center justify-end hover:opacity-80" style={{ color: themeColors.MID_TEXT }}>
                            {isAdminLoginMode ? 'Switch to User Login' : 'Switch to Admin Login'}
                            <Globe className="w-4 h-4 ml-2" style={{ color: themeColors.PRIMARY_COLOR }} />
                        </a>
                    </div>
                )}

                <div className="w-full max-w-lg rounded-xl transition-all duration-500" style={cardStyle}>
                    {isForgotPassword ? (
                        <ForgotPasswordForm onBack={() => setIsForgotPassword(false)} />
                    ) : (
                        <div className="p-8 md:p-12">
                            <h2 className="text-4xl font-extrabold text-center mb-2" style={{ color: themeColors.DARK_TEXT }}>
                                {isLogin ? (isAdminLoginMode ? 'Admin Access' : 'Welcome Back') : 'Join Adrenaline'}
                            </h2>
                            <p className="text-center mb-10 text-base" style={{ color: themeColors.MID_TEXT }}>
                                {isLogin ? (isAdminLoginMode ? 'Log in with your administrator credentials.' : 'Access your Advertisement Management System.') : 'Sign up to manage your campaigns efficiently.'}
                            </p>

                            <div className="flex justify-center mb-10 rounded-lg overflow-hidden border border-white/10" style={{ borderColor: themeColors.PRIMARY_COLOR }}>
                                <button onClick={() => { setIsLogin(true); setRoleId(ROLE_CUSTOMER); setError(null); }}
                                    className={`flex-1 py-3 text-sm font-semibold transition duration-300 ${isLogin ? '' : 'hover:opacity-80'}`}
                                    style={isLogin ? { backgroundColor: themeColors.PRIMARY_COLOR, color: primaryButtonTextColor } : { backgroundColor: themeColors.HOVER_BG, color: themeColors.MID_TEXT }}>
                                    Login
                                </button>

                                <button onClick={() => { setIsLogin(false); setRoleId(ROLE_CUSTOMER); setError(null); }}
                                    className={`flex-1 py-3 text-sm font-semibold transition duration-300 ${!isLogin ? '' : 'hover:opacity-80'}`}
                                    style={!isLogin ? { backgroundColor: themeColors.PRIMARY_COLOR, color: primaryButtonTextColor } : { backgroundColor: themeColors.HOVER_BG, color: themeColors.MID_TEXT }}>
                                    Sign Up
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {!isLogin && (
                                    <div className="relative">
                                        <label htmlFor="fullName" className="sr-only">Full Name</label>
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: themeColors.PRIMARY_COLOR }} />
                                        <input id="fullName" placeholder="Full Name" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                                            className="w-full p-3 pl-10 rounded-lg border focus:ring-1 transition"
                                            style={{ backgroundColor: themeColors.HOVER_BG, color: themeColors.DARK_TEXT, borderColor: themeColors.MID_TEXT + '33', outlineColor: themeColors.PRIMARY_COLOR }} />
                                    </div>
                                )}

                                <div className="relative">
                                    <label htmlFor="email" className="sr-only">Email Address</label>
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: themeColors.PRIMARY_COLOR }} />
                                    <input id="email" type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-3 pl-10 rounded-lg border focus:ring-1 transition" style={{ backgroundColor: themeColors.HOVER_BG, color: themeColors.DARK_TEXT, borderColor: themeColors.MID_TEXT + '33', outlineColor: themeColors.PRIMARY_COLOR }} />
                                </div>

                                {!isLogin && (
                                    <div className="relative">
                                        <label htmlFor="phoneNumber" className="sr-only">Phone Number</label>
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: themeColors.PRIMARY_COLOR }} />
                                        <input id="phoneNumber" type="tel" placeholder="Phone Number (10 digits)" required maxLength={10} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="w-full p-3 pl-10 rounded-lg border focus:ring-1 transition" style={{ backgroundColor: themeColors.HOVER_BG, color: themeColors.DARK_TEXT, borderColor: themeColors.MID_TEXT + '33', outlineColor: themeColors.PRIMARY_COLOR }} />
                                    </div>
                                )}

                                <div className="relative">
                                    <label htmlFor="password" className="sr-only">Password</label>
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: themeColors.PRIMARY_COLOR }} />
                                    <input id="password" type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                        className="w-full p-3 pl-10 rounded-lg border focus:ring-1 transition" style={{ backgroundColor: themeColors.HOVER_BG, color: themeColors.DARK_TEXT, borderColor: themeColors.MID_TEXT + '33', outlineColor: themeColors.PRIMARY_COLOR }} />
                                </div>

                                {!isLogin && (
                                    <div className="relative">
                                        <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: themeColors.PRIMARY_COLOR }} />
                                        <input id="confirmPassword" type="password" placeholder="Confirm Password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full p-3 pl-10 rounded-lg border focus:ring-1 transition" style={{ backgroundColor: themeColors.HOVER_BG, color: themeColors.DARK_TEXT, borderColor: themeColors.MID_TEXT + '33', outlineColor: themeColors.PRIMARY_COLOR }} />
                                    </div>
                                )}

                                <button type="submit" className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-lg font-bold rounded-lg mt-8 transition hover:opacity-90"
                                    style={{ 
                                        backgroundColor: themeColors.PRIMARY_COLOR, 
                                        color: primaryButtonTextColor, 
                                        boxShadow: `0 4px 15px ${themeColors.PRIMARY_COLOR}60`
                                    }}>
                                    <LogIn className="w-5 h-5" />
                                    <span>{isLogin ? 'Login Securely' : 'Create Account'}</span>
                                </button>

                                {isLogin && (
                                    <p className="text-center text-sm mt-4">
                                        <a href="#" onClick={(e) => { e.preventDefault(); setIsForgotPassword(true); setError(null); }} 
                                        style={{ color: themeColors.PRIMARY_COLOR }} className="hover:underline hover:opacity-80 transition">Forgot Password?</a>
                                    </p>
                                )}

                            </form>
                        </div>
                    )}
                </div>

                {!isForgotPassword && (
                    <button className="w-full max-w-lg mt-6 flex items-center justify-center space-x-3 px-4 py-3 text-base font-semibold rounded-full border transition hover:opacity-80" 
                    style={{ backgroundColor: themeColors.SECONDARY_COLOR, color: themeColors.DARK_TEXT, borderColor: themeColors.MID_TEXT + '33' }}>
                        <svg viewBox="0 0 48 48" className="w-5 h-5">
                            {googleIconPath}
                        </svg>
                        <span>Sign in with Google</span>
                    </button>
                )}
            </main>

            <Footer />
        </div>
    );
};

// Export the themed application wrapper
export default () => (
    <ThemeProvider>
        <AuthPage />
    </ThemeProvider>
);