import React, { useState, createContext, useContext, useEffect } from 'react';
import { LogIn, TrendingUp, DollarSign, BarChart3, CloudUpload, Zap, Menu, Sun, Moon, ChevronDown, Phone, Mail, MapPin } from 'lucide-react';

// --- MOCK ROUTING/NAVIGATION ---
const useNavigate = () => {
  return (path) => console.log(`[MOCK NAVIGATION]: Redirecting to ${path}`);
};

// Mock Link component for internal navigation without react-router-dom
const Link = ({ to, children, className, style, onClick }) => (
    <a 
        href={to} 
        onClick={(e) => { 
            // Allows /login route to be mocked without changing hash
            if (to.startsWith('/')) e.preventDefault(); 
            // If it's a hash link, let default browser behavior change the hash
            if (to.startsWith('#')) {
                // Manually change hash and prevent default scroll for the AppRouter to pick it up immediately
                window.location.hash = to.substring(1); 
                e.preventDefault();
            }
            console.log(`[MOCK LINK]: Navigating to ${to}`); 
            if (onClick) onClick(e);
        }} 
        className={className} 
        style={style}
    >
        {children}
    </a>
);

// --- HASH ROUTER HOOK ---
const useHashRouter = () => {
    const [hash, setHash] = useState(window.location.hash || '#home');

    const handleHashChange = () => {
        // Normalize hash to treat empty hash as #home
        setHash(window.location.hash || '#home');
    };

    useEffect(() => {
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    return hash;
};


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

// Navigation Items for the Menu
const navItems = [
    { name: 'Services', to: '#services' },
    { name: 'About Us', to: '#about' },
    { name: 'Hoardings', to: '#hoardings' },
    { name: 'Contact Us', to: '#contact' }
];

// Reusable components
const FeatureCard = ({ title, description, Icon }) => {
  const { themeColors } = useTheme();
  return (
    <div
      className="p-6 rounded-2xl shadow-xl border flex flex-col items-start space-y-4 transition-transform duration-300 hover:scale-[1.02]"
      style={{
        backgroundColor: themeColors.SECONDARY_COLOR,
        borderColor: `${themeColors.PRIMARY_COLOR}33`,
        transform: 'translateZ(0)',
      }}
    >
      <div
        className="p-3 rounded-full"
        style={{
          backgroundColor: `${themeColors.PRIMARY_COLOR}33`,
          transition: 'background-color .3s',
        }}
      >
        <Icon className="w-8 h-8" style={{ color: themeColors.PRIMARY_COLOR }} />
      </div>
      <h3 className="text-xl font-semibold" style={{ color: themeColors.DARK_TEXT }}>{title}</h3>
      <p className="text-sm" style={{ color: themeColors.MID_TEXT }}>{description}</p>
    </div>
  );
};

const ReviewCard = ({ text, author, rating }) => {
  const { themeColors } = useTheme();
  
    // Define keyframes locally or in a central CSS block for the fadeIn animation
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        `;
        document.head.appendChild(style);

        return () => {
          document.head.removeChild(style);
        };
    }, []);

  return (
    <div className="min-w-[300px] p-6 rounded-2xl border shadow-lg" style={{ backgroundColor: themeColors.SECONDARY_COLOR, borderColor: `${themeColors.PRIMARY_COLOR}33` }}>
      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className="w-5 h-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: i < rating ? themeColors.PRIMARY_COLOR : themeColors.MID_TEXT }}
          >
            <path d="M9.049 2.927c.3-.921 1.63-.921 1.93 0l2.062 6.342h6.66c.969 0 1.371 1.24.588 1.81l-5.385 3.916 2.062 6.342c.3.921-.755 1.688-1.543 1.115L10 16.438l-5.385 3.916c-.788.573-1.843-.194-1.543-1.115l2.062-6.342-5.385-3.916c-.783-.57-.381-1.81.588 1.81h6.66l2.062-6.342z" />
          </svg>
        ))}
      </div>
      <p className="italic mb-4" style={{ color: themeColors.DARK_TEXT }}>"{text}"</p>
      <p className="text-sm font-semibold" style={{ color: themeColors.PRIMARY_COLOR }}>{author}</p>
    </div>
  );
};

// --- HEADER COMPONENT ---
const Header = () => {
    const [isOpen, setIsOpen] = useState(false); // Used for Mobile Menu
    const { themeColors, toggleTheme } = useTheme();
    const ThemeIcon = themeColors.ICON;

    return (
        <header className="fixed top-0 left-0 w-full z-50 p-4 md:px-12 backdrop-blur-xl border-b shadow-lg" 
            style={{ backgroundColor: `${themeColors.BASE_BG}E6`, borderColor: `${themeColors.MID_TEXT}33` }}>
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <h1 className="text-2xl font-extrabold" style={{ color: themeColors.DARK_TEXT }}>
                    <Link to="/#home"><span style={{ color: themeColors.PRIMARY_COLOR }}>Adrenaline</span> ADS</Link>
                </h1>

                {/* Desktop Navigation / Menu Bar */}
                <div className="hidden md:flex space-x-4 items-center">
                    
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-opacity-20 transition"
                        style={{ color: themeColors.DARK_TEXT, backgroundColor: themeColors.HOVER_BG }}
                        aria-label="Toggle theme"
                    >
                        <ThemeIcon className="w-5 h-5" />
                    </button>

                    {/* Navigation Dropdown Menu (Menu icon used instead of text) */}
                    <div className="relative group">
                        <button
                            className="flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition"
                            style={{ color: themeColors.DARK_TEXT, backgroundColor: themeColors.HOVER_BG }}
                            aria-label="Navigation Menu"
                        >
                            <Menu className="w-5 h-5" /> {/* Three horizontal bars icon */}
                            <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                        </button>

                        {/* Dropdown Content */}
                        <div className="absolute right-0 top-full mt-2 w-40 rounded-lg shadow-xl opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100 origin-top-right z-50 overflow-hidden"
                             style={{ backgroundColor: themeColors.SECONDARY_COLOR, border: `1px solid ${themeColors.MID_TEXT}33` }}>
                            {navItems.map((item) => (
                                <Link 
                                    key={item.name} 
                                    to={item.to} 
                                    className="block px-4 py-3 text-sm font-medium hover:opacity-80 transition" 
                                    style={{ 
                                        color: themeColors.DARK_TEXT, 
                                        backgroundColor: themeColors.SECONDARY_COLOR,
                                        borderBottom: item.name !== 'Contact Us' ? `1px solid ${themeColors.MID_TEXT}1A` : 'none' 
                                    }}
                                >
                                    {item.name}
                                </Link>
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
                        <Link 
                            key={item.name} 
                            to={item.to} 
                            className="block font-medium py-2 hover:opacity-80 transition" 
                            style={{ color: themeColors.DARK_TEXT }} 
                            onClick={() => setIsOpen(false)}>
                            {item.name}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
};

// --- NEW DETAIL PAGE COMPONENTS (with table-like structure) ---

const ServicesDetailPage = () => {
    const { themeColors } = useTheme();
    const services = [
        { title: "Real-time Inventory", description: "Instantly check live availability and location data for all media assets across all regions. No waiting, no guesswork.", Icon: Zap },
        { title: "Programmatic Integration", description: "Fully integrate our platform with your existing programmatic buying tools for seamless campaign execution.", Icon: BarChart3 },
        { title: "Secure Payment Gateway", description: "Fast, secure, and encrypted payment processing for single and bulk reservations, supporting major cards and bank transfers.", Icon: DollarSign },
        { title: "Dedicated Content Manager", description: "Use our simple workflow tool to upload, review, and get fast approval on your creative content assets.", Icon: CloudUpload },
    ];
    
    // Detailed Offerings table-like structure
    const detailedOfferings = [
        { feature: "Media Consultation", type: "Included", details: "Initial strategy call and ongoing campaign optimization advice.", Icon: TrendingUp },
        { feature: "Live Map View", type: "Standard", details: "Interactive map view of all sites with filterable metadata (size, traffic, visibility).", Icon: MapPin },
        { feature: "24/7 Monitoring", type: "Premium Add-on", details: "Continuous monitoring of ad displays and automated outage alerts.", Icon: Menu },
        { feature: "Custom Reporting API", type: "Enterprise", details: "Direct API access for integrating performance data into internal BI tools.", Icon: BarChart3 },
    ];

    return (
        <section className="py-24 md:py-32" style={{ backgroundColor: themeColors.BASE_BG }}>
            <div className="container mx-auto px-4 max-w-7xl">
                <h1 className="text-5xl font-extrabold text-center mb-4" style={{ color: themeColors.DARK_TEXT }}>
                    Our Core <span style={{ color: themeColors.PRIMARY_COLOR }}>Services</span>
                </h1>
                <p className="text-xl text-center mb-16 max-w-3xl mx-auto" style={{ color: themeColors.MID_TEXT }}>
                    A full-service platform covering every step of the outdoor advertising lifecycle.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {services.map((service, index) => (
                        <FeatureCard key={index} {...service} />
                    ))}
                </div>
                
                <h2 className="text-3xl font-bold mb-8 pt-10 border-t" style={{ color: themeColors.DARK_TEXT, borderColor: `${themeColors.MID_TEXT}33` }}>
                    Detailed Offerings (Pricing Tiers)
                </h2>

                <div className="overflow-x-auto rounded-xl shadow-xl border" style={{ borderColor: `${themeColors.PRIMARY_COLOR}33` }}>
                    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] md:grid-cols-[250px_150px_1fr_100px] gap-px rounded-xl" style={{ backgroundColor: `${themeColors.PRIMARY_COLOR}33` }}>
                        
                        {/* Table Header */}
                        <div className="p-4 font-bold text-lg hidden md:block" style={{ backgroundColor: themeColors.PRIMARY_COLOR, color: '#FFFFFF' }}>Feature</div>
                        <div className="p-4 font-bold text-lg hidden md:block" style={{ backgroundColor: themeColors.PRIMARY_COLOR, color: '#FFFFFF' }}>Tier</div>
                        <div className="p-4 font-bold text-lg hidden md:block col-span-1" style={{ backgroundColor: themeColors.PRIMARY_COLOR, color: '#FFFFFF' }}>Description</div>
                        <div className="p-4 font-bold text-lg hidden md:block" style={{ backgroundColor: themeColors.PRIMARY_COLOR, color: '#FFFFFF' }}>Status</div>

                        {/* Table Rows */}
                        {detailedOfferings.map((item, index) => (
                            <React.Fragment key={index}>
                                {/* Feature and Icon */}
                                <div className="p-4 flex items-center space-x-3" style={{ backgroundColor: themeColors.SECONDARY_COLOR, color: themeColors.DARK_TEXT }}>
                                    <item.Icon className="w-5 h-5" style={{ color: themeColors.PRIMARY_COLOR }} />
                                    <span className="font-semibold">{item.feature}</span>
                                </div>

                                {/* Tier */}
                                <div className="p-4 font-medium sm:col-span-1" style={{ backgroundColor: themeColors.HOVER_BG, color: themeColors.PRIMARY_COLOR }}>
                                    {item.type}
                                </div>

                                {/* Details (Full width on mobile, split on desktop) */}
                                <div className="p-4 text-sm md:col-span-1" style={{ backgroundColor: themeColors.SECONDARY_COLOR, color: themeColors.MID_TEXT }}>
                                    {item.details}
                                </div>
                                
                                {/* Status Icon */}
                                <div className="p-4 flex items-center justify-center" style={{ backgroundColor: themeColors.HOVER_BG }}>
                                    <Zap className="w-5 h-5" style={{ color: themeColors.SUCCESS_COLOR }} />
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Image Placeholder Area */}
                <div className="mt-16 p-8 rounded-xl text-center border-dashed border-2" style={{ backgroundColor: themeColors.SECONDARY_COLOR, borderColor: themeColors.MID_TEXT }}>
                    <p className="text-lg" style={{ color: themeColors.MID_TEXT }}>[Image Placeholder: Dynamic Service Flow Diagram / System Architecture]</p>
                </div>
            </div>
        </section>
    );
};

const AboutUsPage = () => {
    const { themeColors } = useTheme();

    const milestones = [
        { year: 2018, event: "Founded in Bangalore, India, focusing on digital integration for traditional OOH media." },
        { year: 2020, event: "Launched proprietary real-time inventory API, securing seed funding." },
        { year: 2022, event: "Expanded platform coverage to 500+ cities across three countries." },
        { year: 2024, event: "Integrated advanced programmatic buying features and AI-driven site recommendation." },
    ];

    return (
        <section className="py-24 md:py-32" style={{ backgroundColor: themeColors.BASE_BG }}>
            <div className="container mx-auto px-4 max-w-7xl">
                <h1 className="text-5xl font-extrabold text-center mb-4" style={{ color: themeColors.DARK_TEXT }}>
                    The <span style={{ color: themeColors.PRIMARY_COLOR }}>Adrenaline</span> Story
                </h1>
                <p className="text-xl text-center mb-16 max-w-3xl mx-auto" style={{ color: themeColors.MID_TEXT }}>
                    Redefining Outdoor Advertising for the Digital Age.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Mission/Vision */}
                    <div className="lg:col-span-2 space-y-8 p-6 rounded-xl shadow-xl border" style={{ backgroundColor: themeColors.SECONDARY_COLOR, borderColor: `${themeColors.PRIMARY_COLOR}33` }}>
                        <h2 className="text-3xl font-bold" style={{ color: themeColors.PRIMARY_COLOR }}>Our Vision</h2>
                        <p className="text-lg" style={{ color: themeColors.DARK_TEXT }}>
                            To be the world's leading platform for instant, transparent, and data-driven out-of-home media purchasing. We believe in simplifying complexity and delivering measurable results.
                        </p>
                        
                        {/* Image Placeholder Area 1 */}
                        <div className="mt-8 p-6 rounded-xl text-center border-dashed border-2" style={{ backgroundColor: themeColors.HOVER_BG, borderColor: themeColors.MID_TEXT }}>
                            <p className="text-md" style={{ color: themeColors.MID_TEXT }}>[Image Placeholder: Team Collaboration / Global Map]</p>
                        </div>
                    </div>

                    {/* Quick Stats / Sidebar */}
                    <div className="lg:col-span-1 p-6 rounded-xl shadow-xl border" style={{ backgroundColor: themeColors.SECONDARY_COLOR, borderColor: `${themeColors.PRIMARY_COLOR}33` }}>
                        <h2 className="text-3xl font-bold mb-6" style={{ color: themeColors.DARK_TEXT }}>Quick Facts</h2>
                        
                        <div className="space-y-4">
                            <p className="text-lg" style={{ color: themeColors.MID_TEXT }}>**Founded:** <span style={{ color: themeColors.DARK_TEXT }}>2018</span></p>
                            <p className="text-lg" style={{ color: themeColors.MID_TEXT }}>**Headquarters:** <span style={{ color: themeColors.DARK_TEXT }}>Bangalore, India</span></p>
                            <p className="text-lg" style={{ color: themeColors.MID_TEXT }}>**Employees:** <span style={{ color: themeColors.DARK_TEXT }}>150+ Full-time</span></p>
                            <p className="text-lg" style={{ color: themeColors.MID_TEXT }}>**Annual Campaigns:** <span style={{ color: themeColors.DARK_TEXT }}>3,000+</span></p>
                        </div>
                    </div>
                </div>
                
                {/* Milestones (Table-like Structure) */}
                <h2 className="text-3xl font-bold text-center mb-8 pt-16" style={{ color: themeColors.DARK_TEXT }}>Company Milestones</h2>
                <div className="overflow-x-auto rounded-xl shadow-xl border" style={{ borderColor: `${themeColors.PRIMARY_COLOR}33` }}>
                    <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-px rounded-xl" style={{ backgroundColor: `${themeColors.PRIMARY_COLOR}33` }}>
                        
                        {/* Header */}
                        <div className="p-4 font-bold text-lg hidden sm:block" style={{ backgroundColor: themeColors.PRIMARY_COLOR, color: '#FFFFFF' }}>Year</div>
                        <div className="p-4 font-bold text-lg hidden sm:block" style={{ backgroundColor: themeColors.PRIMARY_COLOR, color: '#FFFFFF' }}>Major Event</div>

                        {/* Rows */}
                        {milestones.map((item, index) => (
                            <React.Fragment key={index}>
                                <div className="p-4 font-extrabold text-lg" style={{ backgroundColor: themeColors.HOVER_BG, color: themeColors.PRIMARY_COLOR }}>
                                    {item.year}
                                </div>
                                <div className="p-4 text-base" style={{ backgroundColor: themeColors.SECONDARY_COLOR, color: themeColors.DARK_TEXT }}>
                                    {item.event}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const ContactUsPage = () => {
    const { themeColors } = useTheme();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Contact Form Submitted:", formData);
        alert("Thank you for your message! We will be in touch soon.");
        setFormData({ name: '', email: '', message: '' });
    };

    const inputStyle = { 
        backgroundColor: themeColors.HOVER_BG, 
        color: themeColors.DARK_TEXT, 
        borderColor: themeColors.MID_TEXT + '33', 
        outlineColor: themeColors.PRIMARY_COLOR 
    };
    const primaryButtonTextColor = themeColors.BASE_BG === THEME_CONFIG.dark.BASE_BG ? '#111111' : '#FFFFFF';

    return (
        <section className="py-24 md:py-32" style={{ backgroundColor: themeColors.BASE_BG }}>
            <div className="container mx-auto px-4 max-w-7xl">
                <h1 className="text-5xl font-extrabold text-center mb-4" style={{ color: themeColors.DARK_TEXT }}>
                    Get In <span style={{ color: themeColors.PRIMARY_COLOR }}>Touch</span>
                </h1>
                <p className="text-xl text-center mb-16 max-w-3xl mx-auto" style={{ color: themeColors.MID_TEXT }}>
                    We're here to help you launch your next successful campaign.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    
                    {/* Contact Form */}
                    <div className="p-8 rounded-xl shadow-xl border" style={{ backgroundColor: themeColors.SECONDARY_COLOR, borderColor: `${themeColors.PRIMARY_COLOR}33` }}>
                        <h2 className="text-3xl font-bold mb-6" style={{ color: themeColors.DARK_TEXT }}>Send Us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: themeColors.MID_TEXT }}>Full Name</label>
                                <input id="name" type="text" required value={formData.name} onChange={handleChange} 
                                    className="w-full p-3 rounded-lg border focus:ring-1 transition" style={inputStyle} />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: themeColors.MID_TEXT }}>Email Address</label>
                                <input id="email" type="email" required value={formData.email} onChange={handleChange} 
                                    className="w-full p-3 rounded-lg border focus:ring-1 transition" style={inputStyle} />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium mb-1" style={{ color: themeColors.MID_TEXT }}>Your Message</label>
                                <textarea id="message" rows="4" required value={formData.message} onChange={handleChange} 
                                    className="w-full p-3 rounded-lg border focus:ring-1 transition" style={inputStyle}></textarea>
                            </div>
                            <button type="submit" className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-lg font-bold rounded-lg transition hover:opacity-90"
                                style={{ backgroundColor: themeColors.PRIMARY_COLOR, color: primaryButtonTextColor, boxShadow: `0 4px 15px ${themeColors.PRIMARY_COLOR}60` }}>
                                <span>Submit Inquiry</span>
                            </button>
                        </form>
                    </div>

                    {/* Contact Details (Table-like Structure) */}
                    <div className="p-8 rounded-xl shadow-xl border" style={{ backgroundColor: themeColors.SECONDARY_COLOR, borderColor: `${themeColors.PRIMARY_COLOR}33` }}>
                        <h2 className="text-3xl font-bold mb-6" style={{ color: themeColors.DARK_TEXT }}>Our Information</h2>
                        
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <Mail className="w-6 h-6 flex-shrink-0" style={{ color: themeColors.PRIMARY_COLOR }} />
                                <div>
                                    <p className="font-semibold" style={{ color: themeColors.DARK_TEXT }}>Email Support</p>
                                    <p className="text-sm" style={{ color: themeColors.MID_TEXT }}>For general inquiries and technical support.</p>
                                    <a href="mailto:support@ams.com" className="text-base font-medium hover:underline" style={{ color: themeColors.PRIMARY_COLOR }}>support@ams.com</a>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <Phone className="w-6 h-6 flex-shrink-0" style={{ color: themeColors.PRIMARY_COLOR }} />
                                <div>
                                    <p className="font-semibold" style={{ color: themeColors.DARK_TEXT }}>Phone (24/7)</p>
                                    <p className="text-sm" style={{ color: themeColors.MID_TEXT }}>Contact our dedicated account managers.</p>
                                    <a href="tel:+1234567890" className="text-base font-medium hover:underline" style={{ color: themeColors.PRIMARY_COLOR }}>+1 (234) 567-890</a>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <MapPin className="w-6 h-6 flex-shrink-0" style={{ color: themeColors.PRIMARY_COLOR }} />
                                <div>
                                    <p className="font-semibold" style={{ color: themeColors.DARK_TEXT }}>Head Office</p>
                                    <p className="text-sm" style={{ color: themeColors.MID_TEXT }}>Adrenaline ADS, 123 Digital Blvd, Bangalore, India</p>
                                </div>
                            </div>
                        </div>

                         {/* Image Placeholder Area 2 */}
                        <div className="mt-10 p-6 rounded-xl text-center border-dashed border-2" style={{ backgroundColor: themeColors.HOVER_BG, borderColor: themeColors.MID_TEXT }}>
                            <p className="text-md" style={{ color: themeColors.MID_TEXT }}>[Image Placeholder: Map or Office Building]</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- LANDING PAGE SECTIONS (Used as default home view) ---
const HeroSection = () => {
  const { themeColors } = useTheme();
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: themeColors.BASE_BG }}>
      {/* Background radial gradient */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ background: `radial-gradient(circle at top 50px, ${themeColors.PRIMARY_COLOR}15 0%, transparent 40%)` }}></div>
      <div className="relative z-10 text-center container mx-auto px-4 max-w-4xl pt-24">
        <p className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tighter" style={{ color: themeColors.DARK_TEXT }}>
          “Smart Ads. Powerful Control. One Seamless Platform.”
        </p>
        <p className="text-xl md:text-2xl mb-12 font-light" style={{ color: themeColors.MID_TEXT }}>
          Reach Your Audience. Instantly.
        </p>

        <div className="flex justify-center">
          <Link to="/login"
            className="flex items-center justify-center space-x-3 px-10 py-4 text-xl font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition duration-300"
            style={{
              background: `linear-gradient(90deg, ${themeColors.PRIMARY_COLOR}, ${themeColors.PRIMARY_COLOR}DD)`,
              color: '#FFFFFF',
              boxShadow: `0 10px 30px ${themeColors.PRIMARY_COLOR}33`
            }}
          >
            <TrendingUp className="w-6 h-6" style={{ color: '#FFFFFF' }} />
            <span>Book Now</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

const AboutSummarySection = () => {
  const { themeColors } = useTheme();
  const stats = [
    { value: "10,000+", label: "Available Hoardings" },
    { value: "500+", label: "Cities Covered" },
    { value: "99.9%", label: "Platform Uptime" },
    { value: "24/7", label: "Dedicated Support" },
  ];

  return (
    <section id="about" className="py-20" style={{ backgroundColor: themeColors.BASE_BG }}>
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: themeColors.DARK_TEXT }}>
          About <span style={{ color: themeColors.PRIMARY_COLOR }}>Adrenaline ADS</span>
        </h2>

        <div className="p-8 md:p-12 rounded-2xl shadow-2xl border" style={{ backgroundColor: themeColors.SECONDARY_COLOR, borderColor: `${themeColors.MID_TEXT}33` }}>
          <p className="text-lg text-center mb-8 max-w-3xl mx-auto" style={{ color: themeColors.MID_TEXT }}>
            Adrenaline ADS is built on the philosophy of instant access and absolute transparency. We connect advertisers directly with an extensive network of premium outdoor media inventory, cutting out complexity and time delays.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4 rounded-xl" style={{ backgroundColor: `${themeColors.PRIMARY_COLOR}11` }}>
                <p className="text-3xl font-extrabold mb-1" style={{ color: themeColors.PRIMARY_COLOR }}>{stat.value}</p>
                <p className="text-sm" style={{ color: themeColors.MID_TEXT }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ServicesSummarySection = () => {
  const { themeColors } = useTheme();
  const services = [
    { title: "Real-time Hoarding Availability", description: "Instantly view what’s available in your desired location with live inventory updates.", Icon: Zap },
    { title: "Online Booking & Payments", description: "Secure, one-click reservations and instant payment processing via integrated gateway.", Icon: DollarSign },
    { title: "Tracking Dashboard Access", description: "Monitor campaign performance, optimize ad spend, and view analytics in one place.", Icon: BarChart3 },
    { title: "Ad Content Upload / Approval", description: "Seamlessly submit your creative assets and track approval status with clear guidelines.", Icon: CloudUpload },
  ];

  return (
    <section id="services" className="py-20" style={{ backgroundColor: themeColors.BASE_BG }}>
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-4" style={{ color: themeColors.DARK_TEXT }}>
          Our <span style={{ color: themeColors.PRIMARY_COLOR }}>Services</span>
        </h2>
        <p className="text-lg text-center mb-16" style={{ color: themeColors.MID_TEXT }}>
          The full suite of tools designed for modern outdoor advertising management.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <FeatureCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

const HoardingsSection = () => {
    const { themeColors } = useTheme();
    return (
        <section id="hoardings" className="py-20" style={{ backgroundColor: themeColors.SECONDARY_COLOR }}>
            <div className="container mx-auto px-4 max-w-6xl text-center">
                <h2 className="text-4xl font-bold mb-4" style={{ color: themeColors.DARK_TEXT }}>
                    Explore <span style={{ color: themeColors.PRIMARY_COLOR }}>Hoardings</span>
                </h2>
                <p className="text-lg mb-12" style={{ color: themeColors.MID_TEXT }}>
                    Browse our interactive map with over 10,000 sites worldwide.
                </p>
                 <div className="p-12 rounded-xl shadow-xl border-dashed border-2" style={{ backgroundColor: themeColors.HOVER_BG, borderColor: themeColors.PRIMARY_COLOR }}>
                    <p className="text-lg font-semibold" style={{ color: themeColors.PRIMARY_COLOR }}>[Image Placeholder: Interactive Hoardings Map Widget]</p>
                    <p className="text-sm mt-2" style={{ color: themeColors.MID_TEXT }}>Click 'Book Now' on the home page or navigate to our platform to access the full inventory.</p>
                </div>
            </div>
        </section>
    );
};

const ReviewsSection = () => {
  const { themeColors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = [
    { text: "AMS revolutionized our campaign planning. The real-time booking feature saved us weeks of manual work!", author: "Jane Doe, CMO at TechCorp", rating: 5 },
    { text: "The tracking dashboard is incredibly intuitive and provides deep insights. Highly recommended for modern advertisers.", author: "Alex Smith, Media Buyer", rating: 5 },
    { text: "Adrenaline ADS provides top-tier service and reliable availability data. The platform is truly next-gen.", author: "Sarah Lee, Head of Marketing", rating: 4 },
  ];

  const nextReview = () => setCurrentIndex((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  return (
    <section id="reviews" className="py-20" style={{ backgroundColor: themeColors.SECONDARY_COLOR }}>
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-4" style={{ color: themeColors.DARK_TEXT }}>
          What Our <span style={{ color: themeColors.PRIMARY_COLOR }}>Clients Say</span>
        </h2>
        <p className="text-lg text-center mb-12" style={{ color: themeColors.MID_TEXT }}>
          Trusted by industry leaders and innovative agencies.
        </p>

        <div className="relative flex justify-center items-center">
          <button onClick={prevReview} type="button" className="hidden md:block absolute left-0 z-10 p-3 rounded-full hover:bg-opacity-40 transition" style={{ backgroundColor: `${themeColors.PRIMARY_COLOR}33`, color: themeColors.PRIMARY_COLOR }} aria-label="Previous review">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>

          <div className="w-full sm:w-2/3 lg:w-1/2 flex justify-center">
            <div key={currentIndex} className="animate-fadeIn">
              <ReviewCard {...reviews[currentIndex]} />
            </div>
          </div>

          <button onClick={nextReview} type="button" className="hidden md:block absolute right-0 z-10 p-3 rounded-full hover:bg-opacity-40 transition" style={{ backgroundColor: `${themeColors.PRIMARY_COLOR}33`, color: themeColors.PRIMARY_COLOR }} aria-label="Next review">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>

          <div className="flex md:hidden justify-center space-x-4 mt-8">
            <button onClick={prevReview} type="button" className="p-3 rounded-full" style={{ backgroundColor: `${themeColors.PRIMARY_COLOR}33`, color: themeColors.PRIMARY_COLOR }} aria-label="Previous review">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button onClick={nextReview} type="button" className="p-3 rounded-full" style={{ backgroundColor: `${themeColors.PRIMARY_COLOR}33`, color: themeColors.PRIMARY_COLOR }} aria-label="Next review">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
    // Re-implemented to handle mock data dependency removal
    const { themeColors } = useTheme();
    const mockLinks = [
      { title: "Quick Links", items: ['Search', 'Pricing', 'Dashboard', 'FAQ'] },
      { title: "Company", items: ['About Us', 'Careers', 'Our Team', 'Blog'] },
    ];
    const socialIcons = [
        { path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c1 1.6 3 2 5 2 6 0 11-5 11-11v-.5c.67-.36 1.25-.85 1.76-1.42z', name: 'X' },
        { path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z', name: 'LinkedIn' },
        { path: 'M18 2h-3.922c-1.465 0-2.845.568-3.882 1.584C9.178 4.606 8.65 5.986 8.65 7.452v2.548H6.65v4h2v7h4v-7h2.898l.602-4h-3.5v-2.548c0-.623.238-1.218.66-1.427 1.407-1.427 4.09-1.427 5.503 0l.004-.002V8z', name: 'Instagram' },
    ];

  return (
    <footer className="border-t pt-16 pb-8" style={{ backgroundColor: themeColors.BASE_BG, borderColor: `${themeColors.MID_TEXT}33` }}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <h1 className="text-xl font-extrabold mb-3" style={{ color: themeColors.DARK_TEXT }}>
              <Link to="/"><span style={{ color: themeColors.PRIMARY_COLOR }}>Adrenaline</span> ADS</Link>
            </h1>
            <p className="text-sm max-w-xs" style={{ color: themeColors.MID_TEXT }}>
              The next generation platform for instant outdoor advertising management.
            </p>
          </div>

          {mockLinks.map((col, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4 border-b-2 w-min whitespace-nowrap" style={{ color: themeColors.DARK_TEXT, borderColor: themeColors.PRIMARY_COLOR }}>{col.title}</h4>
              <ul className="space-y-2 text-sm">
                {col.items.map((link) => (
                  <li key={link}><a href="#" className="hover:opacity-80 transition" style={{ color: themeColors.MID_TEXT }}>{link}</a></li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-semibold mb-4 border-b-2 w-min whitespace-nowrap" style={{ color: themeColors.DARK_TEXT, borderColor: themeColors.PRIMARY_COLOR }}>Contact</h4>
            <ul className="space-y-3 text-sm">
              <li style={{ color: themeColors.MID_TEXT }}>Email: <a href="mailto:contact@ams.com" style={{ color: themeColors.DARK_TEXT }}>contact@ams.com</a></li>
              <li style={{ color: themeColors.MID_TEXT }}>Phone: <a href="tel:+1234567890" style={{ color: themeColors.DARK_TEXT }}>+1 (234) 567-890</a></li>
              <li className="flex space-x-4 pt-2">
                {socialIcons.map((s) => (
                  <a key={s.name} href="#" className="hover:opacity-80 transition" style={{ color: themeColors.PRIMARY_COLOR }}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={s.path} />
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


// --- ROUTER COMPONENT ---
const LandingPage = () => {
  const { themeColors } = useTheme();
  const hash = useHashRouter();

  // Determine which page component to render based on the hash
  let ContentComponent;
  switch (hash) {
      case '#services':
          ContentComponent = ServicesDetailPage;
          break;
      case '#about':
          ContentComponent = AboutUsPage;
          break;
      case '#contact':
          ContentComponent = ContactUsPage;
          break;
      case '#hoardings':
          // For Hoardings, we navigate back to the landing page and rely on the browser to scroll
          // to the HoardingsSection's anchor, but since we are replacing the entire main content,
          // we'll just show the landing page and let the scroll happen (or show a summary section).
          ContentComponent = () => (
              <main>
                <HeroSection />
                <HoardingsSection />
                <ReviewsSection /> 
              </main>
          );
          break;
      case '#home':
      default:
          ContentComponent = () => (
              <main>
                <HeroSection />
                <AboutSummarySection />
                <ServicesSummarySection />
                <HoardingsSection />
                <ReviewsSection />
              </main>
          );
          break;
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial', backgroundColor: themeColors.BASE_BG, color: themeColors.DARK_TEXT }}>
      <Header />
      <ContentComponent />
      <Footer />
    </div>
  );
};

export default () => (
    <ThemeProvider>
        <LandingPage />
    </ThemeProvider>
);