import React, { useState, useMemo } from 'react';
import { 
    LayoutDashboard, Users, BookOpen, CreditCard, 
    Image, Map, Star, Trash2, Edit, Check, X, Menu, Settings, LogOut, Search, Info, Upload, User, Mail, Phone, Lock, Sun, Moon
} from 'lucide-react';

// --- THEME CONFIGURATION ---
const THEME_CONFIG = {
    // Light theme: White background, Deep Indigo primary accent
    light: {
        PRIMARY_COLOR: '#1A1265',      // Deep Indigo
        SECONDARY_COLOR: '#F5F5F5',    // Light Gray/Cream (Card/Accent BG)
        BASE_BG: '#FFFFFF',            // White Background
        DARK_TEXT: '#111111',          // Near Black Text
        MID_TEXT: '#666666',           // Medium Gray Text
        HOVER_BG: '#EEEEEE',
        DANGER_COLOR: '#EF4444',
        SUCCESS_COLOR: '#10B981',
        ICON: Sun
    },
    // Dark theme for a better visual distinction and UI feel
    dark: {
        PRIMARY_COLOR: '#9BA3FF',      // Light Indigo/Periwinkle
        SECONDARY_COLOR: '#1F2937',    // Dark Slate Gray (Card/Accent BG)
        BASE_BG: '#111827',            // Charcoal/Near-Black Background
        DARK_TEXT: '#F9FAFB',          // White Text
        MID_TEXT: '#9CA3AF',           // Light Gray Text
        HOVER_BG: '#374151',
        DANGER_COLOR: '#F87171',
        SUCCESS_COLOR: '#34D399',
        ICON: Moon
    }
};

// --- UTILITIES ---
const formatCurrency = (amount) => `₹${Number(amount).toFixed(2)}`;

// --- MOCK DATA (Remains unchanged) ---
const mockUsers = [
    { user_id: 101, username: 'jane_d', fullname: 'Jane Doe', email: 'jane@example.com', role_id: 1, phone_number: '9876543210', is_active: true, block_remarks: null },
    { user_id: 102, username: 'admin_p', fullname: 'Peter Admin', email: 'peter@admin.com', role_id: 2, phone_number: '9999988888', is_active: true, block_remarks: null }, // Reviewer/Admin
    { user_id: 103, username: 'mark_s', fullname: 'Mark Smith', email: 'mark@test.com', role_id: 1, phone_number: '8000012345', is_active: false, block_remarks: 'Non-payment issue.' },
    { user_id: 104, username: 'sara_k', fullname: 'Sara Khan', email: 'sara@test.com', role_id: 1, phone_number: '7000054321', is_active: true, block_remarks: null },
];

const mockSizes = [
    { size_id: 1, name: '5x10 ft' },
    { size_id: 2, name: '10x20 ft' },
    { size_id: 3, name: '20x40 ft' },
];

const mockCities = [
    { city_id: 1, city_name: 'Mumbai' },
    { city_id: 2, city_name: 'Delhi' },
];

const mockLocations = [
    { location_id: 10, location_name: 'Central Plaza Area', city_id: 1, pricing_premium: 1.15 },
    { location_id: 20, location_name: 'Aerocity', city_id: 2, pricing_premium: 1.05 },
    { location_id: 30, location_name: 'Tech Park Zone', city_id: 1, pricing_premium: 1.00 },
];

const mockCrossroads = [
    { crossroad_id: 101, crossroad_name: 'Central Plaza Junction', address: 'Near PVR Cinema, Vashi', location_id: 10 },
    { crossroad_id: 105, crossroad_name: 'Tech Park Entry', address: 'Opposite Infotech Building', location_id: 30 },
    { crossroad_id: 112, crossroad_name: 'NH-4 Exit', address: 'Mile marker 25, Highway NH-4', location_id: 20 },
];

const mockHoardings = [
    { hoarding_id: 1, size_id: 2, crossroad_id: 101, side: 'North', rate: 150000.00, is_available: true },
    { hoarding_id: 2, size_id: 1, crossroad_id: 105, side: 'South', rate: 80000.00, is_available: false },
    { hoarding_id: 3, size_id: 3, crossroad_id: 112, side: 'East', rate: 250000.00, is_available: true },
    { hoarding_id: 4, size_id: 1, crossroad_id: 101, side: 'West', rate: 75000.00, is_available: true },
];

const mockBookings = [
    { booking_id: 501, user_id: 101, hoarding_id: 1, start_date: '2025-11-01', end_date: '2025-11-30', total_amount: 150000.00, booking_date: '2025-10-20T10:00:00Z', transaction_id: 'TXN12345', payment_status: 'Success', payment_method: 'Card' },
    { booking_id: 502, user_id: 103, hoarding_id: 2, start_date: '2025-12-05', end_date: '2025-12-25', total_amount: 80000.00, booking_date: '2025-10-25T12:30:00Z', transaction_id: 'TXN67890', payment_status: 'Pending', payment_method: 'UPI' },
    { booking_id: 503, user_id: 104, hoarding_id: 3, start_date: '2025-12-10', end_date: '2025-12-30', total_amount: 120000.00, booking_date: '2025-10-26T14:00:00Z', transaction_id: 'TXN11223', payment_status: 'Failed', payment_method: 'NetBanking' },
    { booking_id: 504, user_id: 101, hoarding_id: 4, start_date: '2026-01-15', end_date: '2026-01-30', total_amount: 200000.00, booking_date: '2025-11-10T11:00:00Z', transaction_id: 'TXN33445', payment_status: 'Success', payment_method: 'Card' },
];

const mockAdContent = [
    { image_id: 701, booking_id: 501, image_url: 'https://placehold.co/400x150/1A1265/ffffff?text=Ad+501', upload_date: '2025-10-21T15:00:00Z', version_number: 1, admin_approval_status: 'Pending', admin_id_reviewer: null, rejection_reason: null },
    { image_id: 702, booking_id: 502, image_url: 'https://placehold.co/400x150/1A1265/F5F5F5?text=Ad+502', upload_date: '2025-10-26T11:00:00Z', version_number: 2, admin_approval_status: 'Rejected (Re-upload required)', admin_id_reviewer: 102, rejection_reason: 'Inappropriate content ratio.' },
    { image_id: 703, booking_id: 503, image_url: 'https://placehold.co/400x150/1A1265/ffffff?text=Ad+503', upload_date: '2025-10-28T11:00:00Z', version_number: 1, admin_approval_status: 'Approved', admin_id_reviewer: 102, rejection_reason: null },
    { image_id: 704, booking_id: 504, image_url: 'https://placehold.co/400x150/1A1265/F5F5F5?text=Ad+504', upload_date: '2025-11-11T11:00:00Z', version_number: 1, admin_approval_status: 'Pending', admin_id_reviewer: null, rejection_reason: null },
];

const mockTracking = [
    { tracking_id: 901, booking_id: 501, hoarding_id: 1, image_url: 'https://placehold.co/400x150/1A1265/ffffff?text=Live+Photo+901', status: 'Completed', end_date: '2025-11-30' },
    { tracking_id: 902, booking_id: 502, hoarding_id: 2, image_url: '', status: 'Pending', end_date: '2025-12-25' },
    { tracking_id: 903, booking_id: 503, hoarding_id: 3, image_url: 'https://placehold.co/400x150/F5F5F5/1A1265?text=Expired+Photo+903', status: 'Completed', end_date: '2020-01-01' },
];

const mockReviews = [
    { review_id: 801, user_id: 101, booking_id: 501, rating: 5, comment: 'Excellent service and great location!', is_enabled: true },
    { review_id: 802, user_id: 103, booking_id: 502, rating: 3, comment: 'Hoarding location was difficult to find initially.', is_enabled: false },
    { review_id: 803, user_id: 104, booking_id: 504, rating: 4, comment: 'Smooth booking process.', is_enabled: true },
];

// --- NAVIGATION CONFIGURATION ---
const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, component: 'Dashboard' },
    { name: 'Hoarding Management', icon: Map, component: 'HoardingManagement' },
    { name: 'User Profiles', icon: Users, component: 'UserManagement' },
    { name: 'Booking & Payment', icon: CreditCard, component: 'BookingPayment' },
    { name: 'Ad Content Review', icon: Image, component: 'AdContentReview' },
    { name: 'Physical Tracking', icon: Settings, component: 'PhysicalTracking' },
    { name: 'Review Management', icon: Star, component: 'ReviewManagement' },
];

// --- REUSABLE UI COMPONENTS ---

const Card = ({ children, title, className = '', themeColors }) => (
    <div style={{ backgroundColor: themeColors.SECONDARY_COLOR, color: themeColors.DARK_TEXT }} className={`p-4 sm:p-6 rounded-lg border border-gray-200/50 shadow-lg transition duration-300 w-full ${className}`}>
        {title && <h3 style={{ color: themeColors.DARK_TEXT }} className={`text-xl font-semibold mb-4`}>{title}</h3>}
        {children}
    </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', Icon, disabled = false, type = 'button', themeColors }) => {
    const baseStyle = `flex items-center justify-center space-x-2 px-3 py-2 text-sm font-semibold rounded-lg transition duration-300 ease-in-out shadow-md hover:shadow-lg hover:opacity-90 ${className}`;
    
    const dynamicStyle = {
        opacity: disabled ? 0.5 : 1, // Handle disabled state via style
    };
    let additionalClasses = '';

    switch (variant) {
        case 'primary':
            dynamicStyle.backgroundColor = themeColors.PRIMARY_COLOR;
            dynamicStyle.color = 'white';
            break;
        case 'secondary':
            dynamicStyle.backgroundColor = themeColors.SECONDARY_COLOR;
            dynamicStyle.color = themeColors.DARK_TEXT;
            additionalClasses = `border border-gray-500/50`; 
            break;
        case 'danger':
            dynamicStyle.backgroundColor = themeColors.DANGER_COLOR;
            dynamicStyle.color = 'white';
            break;
        case 'success':
            dynamicStyle.backgroundColor = themeColors.SUCCESS_COLOR;
            dynamicStyle.color = 'white';
            break;
        default:
            dynamicStyle.backgroundColor = 'gray'; // Fallback
            dynamicStyle.color = 'white';
    }

    // Combine base styles and dynamic styles
    return (
        <button 
            type={type} 
            className={`${baseStyle} ${additionalClasses}`}
            style={dynamicStyle}
            onClick={onClick} 
            disabled={disabled}
        >
            {Icon && <Icon className="w-4 h-4" />}
            <span>{children}</span>
        </button>
    );
};

const Input = (props) => (
    <input
        {...props}
        // Applying all theme-dependent styles directly to the element via style prop
        style={{ 
            backgroundColor: props.themeColors.BASE_BG, 
            color: props.themeColors.DARK_TEXT,
            borderColor: props.themeColors.MID_TEXT,
            '--tw-ring-color': props.themeColors.PRIMARY_COLOR, // For focus ring dynamic color
        }}
        // Using fixed Tailwind classes for layout and effects
        className={`p-3 rounded-lg border w-full focus:ring-2 focus:ring-[var(--tw-ring-color)] focus:border-[var(--tw-ring-color)] placeholder-gray-500 transition duration-150 ${props.className || ''}`}
    />
);

const Select = (props) => (
    <select
        {...props}
        // Applying all theme-dependent styles directly to the element via style prop
        style={{ 
            backgroundColor: props.themeColors.BASE_BG, 
            color: props.themeColors.DARK_TEXT,
            borderColor: props.themeColors.MID_TEXT,
            '--tw-ring-color': props.themeColors.PRIMARY_COLOR, // For focus ring dynamic color
        }}
        // Using fixed Tailwind classes for layout and effects
        className={`p-3 rounded-lg border w-full focus:ring-2 focus:ring-[var(--tw-ring-color)] focus:border-[var(--tw-ring-color)] transition duration-150 ${props.className || ''}`}
    />
);

const Modal = ({ show, onClose, title, children, maxWidth = 'max-w-lg', themeColors }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
            <div style={{ backgroundColor: themeColors.BASE_BG }} className={`w-full ${maxWidth} rounded-lg shadow-2xl border border-gray-300/50`}>
                <div className="flex justify-between items-center p-4 border-b border-gray-200/50">
                    <h3 style={{ color: themeColors.DARK_TEXT }} className={`text-xl font-semibold`}>{title}</h3>
                    <button onClick={onClose} style={{ color: themeColors.DARK_TEXT }} className={`hover:text-red-500 p-1 rounded-full hover:bg-[${themeColors.HOVER_BG}]`}>
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value, themeColors }) => (
    <div style={{ backgroundColor: themeColors.SECONDARY_COLOR }} className={`p-3 rounded-lg border border-gray-200/50`}>
        <p style={{ color: themeColors.MID_TEXT }} className={`text-xs`}>{label}</p>
        <div style={{ color: themeColors.DARK_TEXT }} className={`text-base font-medium`}>
            {typeof value === 'object' ? value : <span>{value}</span>}
        </div>
    </div>
);

const HeaderTitle = ({ children, themeColors }) => (
    <h2 style={{ color: themeColors.DARK_TEXT }} className={`text-2xl sm:text-3xl font-bold mb-6`}>{children}</h2>
);


// --- CRUD MANAGER COMPONENT FOR SUB-TABLES ---
const CRUDManager = ({ title, data, fields, setData, primaryKey, uniqueField, themeColors }) => {
    const [isEditing, setIsEditing] = useState(null);
    const [formState, setFormState] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    const filteredData = useMemo(() => {
        const query = searchQuery.toLowerCase();
        if (!query) return data;
        
        return data.filter(item =>
            fields.some(field => 
                String(item[field.key]).toLowerCase().includes(query)
            )
        );
    }, [data, searchQuery, fields]);

    const handleEdit = (item) => {
        setIsEditing(item[primaryKey]);
        setFormState(item);
    };

    const handleNew = () => {
        setIsEditing('new');
        setFormState(fields.reduce((acc, field) => ({ ...acc, [field.key]: field.defaultValue || '' }), {}));
    };

    const handleSave = (e) => {
        e.preventDefault();
        
        const requiredFields = fields.filter(f => f.required).map(f => f.key);
        if (requiredFields.some(key => !formState[key])) {
            console.error("All required fields must be filled.");
            return;
        }

        if (uniqueField) {
            const existingItem = data.find(item => item[uniqueField.key].toLowerCase() === formState[uniqueField.key].toLowerCase() && item[primaryKey] !== isEditing);
            if (existingItem) {
                console.error(`${uniqueField.label} must be unique.`);
                return;
            }
        }

        if (isEditing === 'new') {
            const newId = Math.max(...data.map(item => item[primaryKey]), 0) + 1;
            setData([...data, { ...formState, [primaryKey]: newId }]);
        } else {
            setData(data.map(item => 
                item[primaryKey] === isEditing ? { ...formState } : item
            ));
        }
        setIsEditing(null);
    };

    const handleDelete = (id) => {
        if (window.confirm(`Are you sure you want to delete this ${title.replace(' Manage', '').toLowerCase()} record?`)) {
            setData(data.filter(item => item[primaryKey] !== id));
        }
    };

    const renderForm = () => (
        <Card title={isEditing === 'new' ? `Add New ${title.replace(' Manage', '')}` : `Edit ${title.replace(' Manage', '')} #${isEditing}`} themeColors={themeColors}>
            <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fields.filter(f => f.key !== primaryKey).map(field => (
                        <div key={field.key} className="flex flex-col">
                            <label style={{ color: themeColors.DARK_TEXT }} className={`text-sm mb-1 capitalize`}>
                                {field.label} {field.required && <span className='text-red-500'>*</span>}
                            </label>
                            {field.type === 'select' ? (
                                <Select
                                    required={field.required}
                                    value={formState[field.key] || ''}
                                    onChange={(e) => setFormState({ ...formState, [field.key]: field.dataType === 'INT' ? parseInt(e.target.value) : e.target.value })}
                                    themeColors={themeColors}
                                >
                                    <option value="">Select...</option>
                                    {field.options && field.options.map(option => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </Select>
                            ) : (
                                <Input
                                    type={field.type === 'NUMERIC' ? 'number' : 'text'}
                                    step={field.type === 'NUMERIC' ? '0.01' : null}
                                    required={field.required}
                                    value={formState[field.key] || ''}
                                    onChange={(e) => setFormState({ ...formState, [field.key]: e.target.value })}
                                    placeholder={`Enter ${field.label}`}
                                    themeColors={themeColors}
                                />
                            )}
                        </div>
                    ))}
                </div>
                
                <div className="flex justify-end space-x-4 mt-6">
                    <Button onClick={() => setIsEditing(null)} type="button" variant="secondary" themeColors={themeColors}>Cancel</Button>
                    <Button type="submit" Icon={Check} variant="primary" themeColors={themeColors}>Save</Button>
                </div>
            </form>
        </Card>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h3 style={{ color: themeColors.DARK_TEXT }} className="text-xl font-semibold">{title}</h3>
                <div className="relative w-full max-w-sm sm:max-w-xs">
                    <Input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`pl-10`}
                        themeColors={themeColors}
                    />
                    <Search className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2`} style={{ color: themeColors.MID_TEXT }} />
                </div>
                <Button onClick={handleNew} Icon={Edit} variant="primary" themeColors={themeColors}>Add New</Button>
            </div>

            {(isEditing) && renderForm()}

            <Card className="p-0" themeColors={themeColors}>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] divide-y divide-gray-200/50">
                        <thead>
                            <tr style={{ backgroundColor: themeColors.HOVER_BG }}>
                                {fields.map(header => (
                                    <th key={header.key} style={{ color: themeColors.DARK_TEXT }} className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider`}>{header.label}</th>
                                ))}
                                <th style={{ color: themeColors.DARK_TEXT }} className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody style={{ color: themeColors.DARK_TEXT }} className={`divide-y divide-gray-200/50`}>
                            {filteredData.length > 0 ? (
                                filteredData.map(item => (
                                    <tr key={item[primaryKey]} className={`hover:bg-[${themeColors.HOVER_BG}] transition duration-150`}>
                                        {fields.map(field => (
                                            <td key={field.key} className="px-4 py-3 whitespace-nowrap text-sm">
                                                {field.key === 'pricing_premium' ? `${(item[field.key] * 100).toFixed(0)}%` : 
                                                    (field.type === 'select' ? field.options.find(opt => opt.id === item[field.key])?.name || item[field.key] : item[field.key])}
                                            </td>
                                        ))}
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                                            <Button onClick={() => handleEdit(item)} Icon={Edit} variant="secondary" className="p-1.5" themeColors={themeColors} />
                                            <Button onClick={() => handleDelete(item[primaryKey])} Icon={Trash2} variant="danger" className="p-1.5" themeColors={themeColors} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={fields.length + 1} style={{ color: themeColors.MID_TEXT }} className="px-4 py-3 text-center">No records found matching the filters.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};


// --- ADMIN MANAGEMENT VIEWS ---

const Dashboard = ({ themeColors }) => (
    <div className="space-y-6">
        <HeaderTitle themeColors={themeColors}>Admin Dashboard</HeaderTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Total Hoardings" themeColors={themeColors}>
                <p style={{ color: themeColors.PRIMARY_COLOR }} className={`text-3xl sm:text-4xl font-extrabold`}>{mockHoardings.length}</p>
                <p style={{ color: themeColors.MID_TEXT }} className={`text-sm mt-1`}>Total Inventory</p>
            </Card>
            <Card title="Active Users" themeColors={themeColors}>
                <p className={`text-3xl sm:text-4xl font-extrabold text-green-500`}>{mockUsers.filter(u => u.is_active && u.role_id !== 2).length}</p>
                <p style={{ color: themeColors.MID_TEXT }} className={`text-sm mt-1`}>Customer Profiles</p>
            </Card>
            <Card title="Pending Approvals" themeColors={themeColors}>
                <p className={`text-3xl sm:text-4xl font-extrabold text-amber-500`}>{mockAdContent.filter(c => c.admin_approval_status === 'Pending').length}</p>
                <p style={{ color: themeColors.MID_TEXT }} className={`text-sm mt-1`}>Ad Content Images</p>
            </Card>
        </div>
        
        <Card title="System Notices" themeColors={themeColors}>
            <p style={{ color: themeColors.MID_TEXT }} className={`flex items-center space-x-2`}>
                <Info className="w-5 h-5 text-amber-500" />
                <span>Last system check was successful. All services operational.</span>
            </p>
        </Card>
    </div>
);

// --- Hoarding Management Component ---
const HoardingManagement = ({ themeColors }) => {
    const [hoardings, setHoardings] = useState(mockHoardings);
    const [sizes, setSizes] = useState(mockSizes);
    const [cities, setCities] = useState(mockCities);
    const [locations, setLocations] = useState(mockLocations);
    const [crossroads, setCrossroads] = useState(mockCrossroads);
    const [activeTab, setActiveTab] = useState('Hoardings');

    const getHoardingDetails = (hoarding) => {
        const crossroad = crossroads.find(c => c.crossroad_id === hoarding.crossroad_id);
        const location = locations.find(l => l.location_id === crossroad?.location_id);
        const city = cities.find(c => c.city_id === location?.city_id);
        const size = sizes.find(s => s.size_id === hoarding.size_id);

        return {
            size_name: size?.name || 'N/A',
            crossroad_name: crossroad?.crossroad_name || 'N/A',
            location_name: location?.location_name || 'N/A',
            city_name: city?.city_name || 'N/A',
        };
    };

    const mainHoardingFields = [
        { key: 'hoarding_id', label: 'ID' },
        { key: 'city_name', label: 'City', isComputed: true },
        { key: 'location_name', label: 'Location', isComputed: true },
        { key: 'crossroad_name', label: 'Crossroad', isComputed: true },
        { key: 'size_name', label: 'Size', isComputed: true },
        { key: 'side', label: 'Side' },
        { key: 'rate', label: 'Rate' },
        { key: 'is_available', label: 'Available' },
    ];
    
    const renderCRUDComponent = () => {
        switch (activeTab) {
            case 'Manage City':
                return <CRUDManager
                    title="Manage City"
                    data={cities}
                    fields={[
                        { key: 'city_id', label: 'City ID', type: 'INT' },
                        { key: 'city_name', label: 'City Name', type: 'TEXT', required: true }
                    ]}
                    primaryKey="city_id"
                    uniqueField={{ key: 'city_name', label: 'City Name' }}
                    setData={setCities}
                    themeColors={themeColors}
                />;
            case 'Manage Location':{
                const cityOptions = cities.map(c => ({ id: c.city_id, name: c.city_name }));
                return <CRUDManager
                    title="Manage Location"
                    data={locations}
                    fields={[
                        { key: 'location_id', label: 'Location ID', type: 'INT' },
                        { key: 'location_name', label: 'Location Name', type: 'TEXT', required: true },
                        { key: 'city_id', label: 'City', type: 'select', required: true, options: cityOptions, dataType: 'INT' },
                        { key: 'pricing_premium', label: 'Pricing Premium (Ratio, e.g., 1.10)', type: 'NUMERIC', required: false, defaultValue: 1.00 }
                    ]}
                    primaryKey="location_id"
                    setData={setLocations}
                    themeColors={themeColors}
                />;
            }
            case 'Manage Crossroads':{
                const locationOptions = locations.map(l => ({ id: l.location_id, name: l.location_name }));
                return <CRUDManager
                    title="Manage Crossroad Details"
                    data={crossroads}
                    fields={[
                        { key: 'crossroad_id', label: 'Crossroad ID', type: 'INT' },
                        { key: 'crossroad_name', label: 'Crossroad Name', type: 'TEXT', required: true },
                        { key: 'address', label: 'Address', type: 'TEXT', required: true },
                        { key: 'location_id', label: 'Location', type: 'select', required: true, options: locationOptions, dataType: 'INT' },
                    ]}
                    primaryKey="crossroad_id"
                    setData={setCrossroads}
                    themeColors={themeColors}
                />;
            }
            case 'Manage Sizes':
                return <CRUDManager
                    title="Manage Sizes"
                    data={sizes}
                    fields={[
                        { key: 'size_id', label: 'Size ID', type: 'INT' },
                        { key: 'name', label: 'Name / Dimension', type: 'TEXT', required: true }
                    ]}
                    primaryKey="size_id"
                    uniqueField={{ key: 'name', label: 'Name / Dimension' }}
                    setData={setSizes}
                    themeColors={themeColors}
                />;
            default:
                return <HoardingsList 
                    hoardings={hoardings}
                    setHoardings={setHoardings}
                    getHoardingDetails={getHoardingDetails}
                    sizes={sizes}
                    crossroads={crossroads}
                    mainHoardingFields={mainHoardingFields}
                    themeColors={themeColors}
                />;
        }
    };

    return (
        <div className="space-y-6">
            <HeaderTitle themeColors={themeColors}>Hoarding Management</HeaderTitle>
            
            <div style={{ backgroundColor: themeColors.SECONDARY_COLOR }} className={`flex flex-wrap p-1 rounded-lg border border-gray-500/50 shadow-inner`}>
                {['Hoardings', 'Manage City', 'Manage Location', 'Manage Crossroads', 'Manage Sizes'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={activeTab === tab ? { backgroundColor: themeColors.PRIMARY_COLOR, color: 'white' } : { color: themeColors.DARK_TEXT }}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition duration-200 m-0.5
                            ${activeTab !== tab ? `hover:bg-[${themeColors.HOVER_BG}]` : 'shadow-md'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {renderCRUDComponent()}
        </div>
    );
};

// Sub-component for main Hoardings List
const HoardingsList = ({ hoardings, setHoardings, getHoardingDetails, sizes, crossroads, mainHoardingFields, themeColors }) => {
    const [isEditing, setIsEditing] = useState(null); 
    const [formState, setFormState] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    const hoardingsWithDetails = useMemo(() => {
        return hoardings.map(h => ({ ...h, ...getHoardingDetails(h) }));
    }, [hoardings, getHoardingDetails]);

    const filteredHoardings = useMemo(() => {
        const query = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
        if (query.length === 0) return hoardingsWithDetails;
        
        return hoardingsWithDetails.filter(h => 
            query.every(q => 
                mainHoardingFields.some(field => 
                    String(h[field.key] || '').toLowerCase().includes(q)
                )
            )
        );
    }, [hoardingsWithDetails, searchQuery, mainHoardingFields]);

    const handleEdit = (hoarding) => {
        setIsEditing(hoarding.hoarding_id);
        setFormState(hoarding);
    };

    const handleNew = () => {
        setIsEditing('new');
        setFormState({ size_id: '', crossroad_id: '', side: '', rate: 0, is_available: true });
    };

    const handleSave = (e) => {
        e.preventDefault();
        
        if (!formState.rate || !formState.side || !formState.size_id || !formState.crossroad_id) {
            console.error("All required fields must be filled.");
            return;
        }

        const newRate = parseFloat(formState.rate);
        const newHoardingData = { ...formState, rate: newRate };
        
        if (isEditing === 'new') {
            const newId = Math.max(...hoardings.map(h => h.hoarding_id), 0) + 1;
            setHoardings([...hoardings, { ...newHoardingData, hoarding_id: newId }]);
        } else {
            setHoardings(hoardings.map(h => 
                h.hoarding_id === isEditing ? { ...h, ...newHoardingData } : h
            ));
        }
        setIsEditing(null)
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this hoarding?")) {
            setHoardings(hoardings.filter(h => h.hoarding_id !== id));
        }
    };

    const renderHoardingForm = () => (
        <Card title={isEditing === 'new' ? "Add New Hoarding" : `Edit Hoarding #${isEditing}`} className="mb-6" themeColors={themeColors}>
            <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Size */}
                    <div className="flex flex-col">
                        <label style={{ color: themeColors.DARK_TEXT }} className={`text-sm mb-1`}>Size <span className='text-red-500'>*</span></label>
                        <Select
                            required
                            value={formState.size_id || ''}
                            onChange={(e) => setFormState({ ...formState, size_id: parseInt(e.target.value) })}
                            themeColors={themeColors}
                        >
                            <option value="">Select Size</option>
                            {sizes.map(s => <option key={s.size_id} value={s.size_id}>{s.name}</option>)}
                        </Select>
                    </div>
                    {/* Crossroad */}
                    <div className="flex flex-col">
                        <label style={{ color: themeColors.DARK_TEXT }} className={`text-sm mb-1`}>Crossroad <span className='text-red-500'>*</span></label>
                        <Select
                            required
                            value={formState.crossroad_id || ''}
                            onChange={(e) => setFormState({ ...formState, crossroad_id: parseInt(e.target.value) })}
                            themeColors={themeColors}
                        >
                            <option value="">Select Crossroad</option>
                            {crossroads.map(c => <option key={c.crossroad_id} value={c.crossroad_id}>{c.crossroad_name} (ID: {c.crossroad_id})</option>)}
                        </Select>
                    </div>
                    {/* Side */}
                    <div className="flex flex-col">
                        <label style={{ color: themeColors.DARK_TEXT }} className={`text-sm mb-1`}>Side <span className='text-red-500'>*</span></label>
                        <Input
                            type="text"
                            required
                            value={formState.side || ''}
                            onChange={(e) => setFormState({ ...formState, side: e.target.value })}
                            placeholder={`Enter side (e.g., North, East)`}
                            themeColors={themeColors}
                        />
                    </div>
                    {/* Rate */}
                    <div className="flex flex-col">
                        <label style={{ color: themeColors.DARK_TEXT }} className={`text-sm mb-1`}>Rate (₹) <span className='text-red-500'>*</span></label>
                        <Input
                            type="number"
                            step="0.01"
                            required
                            value={formState.rate || ''}
                            onChange={(e) => setFormState({ ...formState, rate: e.target.value })}
                            placeholder={`Enter rate in Rupees`}
                            themeColors={themeColors}
                        />
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4 col-span-full">
                        <input
                            type="checkbox"
                            id="is_available"
                            checked={formState.is_available || false}
                            onChange={(e) => setFormState({ ...formState, is_available: e.target.checked })}
                            className={`w-4 h-4 text-indigo-600 rounded-sm focus:ring-indigo-500 border-gray-300/50`}
                            style={{backgroundColor: themeColors.BASE_BG, accentColor: themeColors.PRIMARY_COLOR}}
                        />
                        <label htmlFor="is_available" style={{ color: themeColors.DARK_TEXT }} className={`text-sm`}>Is Available</label>
                    </div>
                </div>
                
                <div className="flex justify-end space-x-4 mt-6">
                    <Button onClick={() => setIsEditing(null)} type="button" variant="secondary" themeColors={themeColors}>Cancel</Button>
                    <Button type="submit" Icon={Check} variant="primary" themeColors={themeColors}>Save Hoarding</Button>
                </div>
            </form>
        </Card>
    );

    return (
        <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full max-w-md">
                    <Input
                        type="text"
                        placeholder="Search by ID, Location, Size, etc."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`pl-10`}
                        themeColors={themeColors}
                    />
                    <Search className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2`} style={{ color: themeColors.MID_TEXT }} />
                </div>
                <Button onClick={handleNew} Icon={Map} variant="primary" themeColors={themeColors}>Add New Hoarding</Button>
            </div>
            
            {(isEditing) && renderHoardingForm()}

            <Card title="Current Hoarding Inventory" themeColors={themeColors}>
                
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1200px] divide-y divide-gray-200/50">
                        <thead>
                            <tr style={{ backgroundColor: themeColors.HOVER_BG }}>
                                {mainHoardingFields.map(header => (
                                    <th key={header.key} style={{ color: themeColors.DARK_TEXT }} className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider`}>{header.label}</th>
                                ))}
                                <th style={{ color: themeColors.DARK_TEXT }} className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody style={{ color: themeColors.DARK_TEXT }} className={`divide-y divide-gray-200/50`}>
                            {filteredHoardings.length > 0 ? (
                                filteredHoardings.map(h => (
                                    <tr key={h.hoarding_id} className={`hover:bg-[${themeColors.HOVER_BG}] transition duration-150`}>
                                        <td className="px-4 py-3 whitespace-nowrap">{h.hoarding_id}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{h.city_name}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{h.location_name}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{h.crossroad_name}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{h.size_name}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{h.side}</td>
                                        <td className="px-4 py-3 whitespace-nowrap font-semibold">{formatCurrency(h.rate)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${h.is_available ? 'bg-green-600/10 text-green-600' : 'bg-red-600/10 text-red-600'}`}>
                                                {h.is_available ? 'YES' : 'NO'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                                            <Button onClick={() => handleEdit(h)} Icon={Edit} variant="secondary" className="p-1.5" themeColors={themeColors} />
                                            <Button onClick={() => handleDelete(h.hoarding_id)} Icon={Trash2} variant="danger" className="p-1.5" themeColors={themeColors} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" style={{ color: themeColors.MID_TEXT }} className="px-4 py-3 text-center">No hoardings found matching the filters.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};


// --- User Management Component ---
const UserManagement = ({ themeColors }) => {
    const [users, setUsers] = useState(mockUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [showRemarksModal, setShowRemarksModal] = useState(false);
    const [targetUserId, setTargetUserId] = useState(null);
    const [remarks, setRemarks] = useState('');
    const [isActivating, setIsActivating] = useState(false);

    const filteredUsers = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return users.filter(u => 
            u.role_id !== 2 && ( // Exclude Admins
                String(u.user_id).includes(query) || 
                u.email.toLowerCase().includes(query) ||
                u.fullname.toLowerCase().includes(query)
            )
        );
    }, [users, searchQuery]);

    const initiateStatusChange = (userId, activate) => {
        setTargetUserId(userId);
        setIsActivating(activate);
        if (activate) {
            toggleStatus(userId, true);
        } else {
            setRemarks(users.find(u => u.user_id === userId).block_remarks || '');
            setShowRemarksModal(true);
        }
    };

    const handleRemarksSubmit = () => {
        if (!remarks.trim() && !isActivating) {
            console.error("Remarks are required to disable a user.");
            return;
        }
        toggleStatus(targetUserId, isActivating, remarks.trim());
        setShowRemarksModal(false);
        setRemarks('');
    };

    const toggleStatus = (id, activate, newRemarks = null) => {
        setUsers(users.map(u => 
            u.user_id === id ? { ...u, is_active: activate, block_remarks: activate ? null : newRemarks } : u
        ));
    };

    return (
        <div className="space-y-6">
            <HeaderTitle themeColors={themeColors}>Customer Profile Management</HeaderTitle>
            
            <div className="flex justify-between items-center">
                <div className="relative w-full max-w-md">
                    <Input
                        type="text"
                        placeholder="Search by User ID, Email, or Name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`pl-10`}
                        themeColors={themeColors}
                    />
                    <Search className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2`} style={{ color: themeColors.MID_TEXT }} />
                </div>
            </div>

            <Card title="Registered Users (Excluding Admins)" themeColors={themeColors}>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] divide-y divide-gray-200/50">
                        <thead>
                            <tr style={{ backgroundColor: themeColors.HOVER_BG }}>
                                {['ID', 'Full Name', 'Email', 'Phone', 'Active Status', 'Remarks', 'Actions'].map(header => (
                                    <th key={header} style={{ color: themeColors.DARK_TEXT }} className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider`}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody style={{ color: themeColors.DARK_TEXT }} className={`divide-y divide-gray-200/50`}>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(u => (
                                    <tr key={u.user_id} className={`hover:bg-[${themeColors.HOVER_BG}] transition duration-150`}>
                                        <td className="px-4 py-3 whitespace-nowrap">{u.user_id}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{u.fullname}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{u.email}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{u.phone_number}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.is_active ? 'bg-green-600/10 text-green-600' : 'bg-red-600/10 text-red-600'}`}>
                                                {u.is_active ? 'Active' : 'Disabled'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm max-w-xs truncate" title={u.block_remarks || 'N/A'}>
                                            {u.block_remarks || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <Button 
                                                onClick={() => initiateStatusChange(u.user_id, u.is_active ? false : true)} 
                                                variant={u.is_active ? 'danger' : 'success'} 
                                                className="p-1.5 text-xs"
                                                themeColors={themeColors}
                                            >
                                                {u.is_active ? 'Disable' : 'Enable'}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ color: themeColors.MID_TEXT }} className="px-4 py-3 text-center">No customers found matching the search query.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Disable Remarks Modal */}
            <Modal show={showRemarksModal && !isActivating} onClose={() => setShowRemarksModal(false)} title="Disable User Account" themeColors={themeColors}>
                <p style={{ color: themeColors.MID_TEXT }} className={`mb-4`}>
                    Please provide a brief reason for disabling the account for user ID: {targetUserId}.
                </p>
                <textarea
                    rows="4"
                    required
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    style={{ backgroundColor: themeColors.SECONDARY_COLOR, color: themeColors.DARK_TEXT }}
                    className={`w-full p-3 rounded-lg border border-gray-500/50 focus:ring-2 focus:ring-[${themeColors.PRIMARY_COLOR}]`}
                    placeholder="Reason for disabling the account..."
                />
                <div className="flex justify-end space-x-4 mt-6">
                    <Button onClick={() => setShowRemarksModal(false)} variant="secondary" themeColors={themeColors}>Cancel</Button>
                    <Button onClick={handleRemarksSubmit} variant="danger" disabled={!remarks.trim()} themeColors={themeColors}>Confirm Disable</Button>
                </div>
            </Modal>
        </div>
    );
};

// --- Booking & Payment Component ---
const BookingPayment = ({ themeColors }) => {
    const [searchBookingId, setSearchBookingId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const bookingsWithCustomer = useMemo(() => {
        return mockBookings.map(b => {
            const customer = mockUsers.find(u => u.user_id === b.user_id);
            return {
                ...b,
                customer_name: customer ? customer.fullname : 'Unknown User'
            };
        });
    }, []);

    const filteredBookings = useMemo(() => {
        const idQuery = searchBookingId ? String(searchBookingId) : '';
        
        return bookingsWithCustomer.filter(b => {
            const idMatch = idQuery ? String(b.booking_id).includes(idQuery) : true;
            
            // Filter by date range (booking date)
            const bookingDate = new Date(b.booking_date);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            if (end) end.setHours(23, 59, 59, 999);

            const dateMatch = (!start || bookingDate >= start) && (!end || bookingDate <= end);
            
            return idMatch && dateMatch;
        });
    }, [searchBookingId, startDate, endDate, bookingsWithCustomer]);

    const pendingPayments = useMemo(() => {
        return filteredBookings.filter(b => b.payment_status === 'Pending' || b.payment_status === 'Failed');
    }, [filteredBookings]);

    const openPaymentDetails = (booking) => {
        setSelectedBooking(booking);
        setShowPaymentModal(true);
    };

    const renderPaymentStatusBadge = (status) => {
        let colorClass;
        if (status === 'Success') colorClass = 'bg-green-600/10 text-green-600';
        else if (status === 'Pending') colorClass = 'bg-amber-500/10 text-amber-500';
        else colorClass = 'bg-red-600/10 text-red-600';
        
        return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
                {status}
            </span>
        );
    };

    const renderBookingTable = (data, title) => (
        <Card title={title} themeColors={themeColors}>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] divide-y divide-gray-200/50">
                    <thead>
                        <tr style={{ backgroundColor: themeColors.HOVER_BG }}>
                            {['ID', 'Customer', 'Hoarding ID', 'Booking Date', 'Amount', 'Transaction ID', 'Status'].map(header => (
                                <th key={header} style={{ color: themeColors.DARK_TEXT }} className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider`}>{header}</th>
                            ))}
                            <th className='px-4 py-3'></th>
                        </tr>
                    </thead>
                    <tbody style={{ color: themeColors.DARK_TEXT }} className={`divide-y divide-gray-200/50`}>
                        {data.length > 0 ? (
                            data.map(b => (
                                <tr key={b.booking_id} className={`hover:bg-[${themeColors.HOVER_BG}] transition duration-150`}>
                                    <td className="px-4 py-3 whitespace-nowrap">{b.booking_id}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{b.customer_name}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{b.hoarding_id}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{new Date(b.booking_date).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 whitespace-nowrap font-semibold">{formatCurrency(b.total_amount)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <button onClick={() => openPaymentDetails(b)} style={{ color: themeColors.PRIMARY_COLOR }} className={`hover:underline text-sm`}>
                                            {b.transaction_id || 'N/A'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">{renderPaymentStatusBadge(b.payment_status)}</td>
                                    <td className='px-4 py-3'>
                                         <Button onClick={() => openPaymentDetails(b)} Icon={Info} variant="secondary" className="p-1.5" themeColors={themeColors} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={{ color: themeColors.MID_TEXT }} className="px-4 py-3 text-center">No records found matching filters.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );

    return (
        <div className="space-y-6">
            <HeaderTitle themeColors={themeColors}>Booking & Payment Management</HeaderTitle>
            
            <Card title="Filter Bookings" themeColors={themeColors}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className='flex flex-col'>
                         <label style={{ color: themeColors.MID_TEXT }} className={`text-xs mb-1`}>Booking ID</label>
                         <Input
                            type="number"
                            placeholder="Search by Booking ID"
                            value={searchBookingId}
                            onChange={(e) => setSearchBookingId(e.target.value)}
                            themeColors={themeColors}
                        />
                    </div>
                    <div className='flex flex-col'>
                         <label style={{ color: themeColors.MID_TEXT }} className={`text-xs mb-1`}>Start Date</label>
                         <Input
                            type="date"
                            placeholder="Start Date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            themeColors={themeColors}
                        />
                    </div>
                    <div className='flex flex-col'>
                         <label style={{ color: themeColors.MID_TEXT }} className={`text-xs mb-1`}>End Date</label>
                         <Input
                            type="date"
                            placeholder="End Date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            themeColors={themeColors}
                        />
                    </div>
                    <div className='flex items-end'>
                       <Button onClick={() => { setSearchBookingId(''); setStartDate(''); setEndDate(''); }} variant="secondary" className='w-full' themeColors={themeColors}>Clear Filters</Button>
                    </div>
                </div>
            </Card>

            {pendingPayments.length > 0 && renderBookingTable(pendingPayments, "Pending/Failed Payments (Requires Action)")}
            
            {renderBookingTable(filteredBookings, "All Bookings (Filtered)")}
            
            <Modal show={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Payment Details" maxWidth="max-w-xl" themeColors={themeColors}>
                {selectedBooking && (
                    <div className="space-y-4">
                        <p style={{ color: themeColors.PRIMARY_COLOR }} className={`text-lg font-bold`}>Booking ID: {selectedBooking.booking_id}</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <DetailItem label="Customer Name" value={selectedBooking.customer_name} themeColors={themeColors} />
                            <DetailItem label="Transaction ID" value={selectedBooking.transaction_id || 'N/A'} themeColors={themeColors} />
                            <DetailItem label="Amount Paid" value={formatCurrency(selectedBooking.total_amount)} themeColors={themeColors} />
                            <DetailItem label="Payment Method" value={selectedBooking.payment_method} themeColors={themeColors} />
                            <DetailItem label="Transaction Status" value={renderPaymentStatusBadge(selectedBooking.payment_status)} themeColors={themeColors} />
                            <DetailItem label="Payment Date" value={new Date(selectedBooking.booking_date).toLocaleString()} themeColors={themeColors} />
                        </div>
                        <p style={{ color: themeColors.MID_TEXT }} className={`text-sm pt-4`}>
                            This information links the BOOKING and PAYMENT tables via the booking_id.
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
};


// --- Ad Content Review Component ---
const AdContentReview = ({ themeColors }) => {
    const [content, setContent] = useState(mockAdContent);
    const [activeTab, setActiveTab] = useState('Pending');
    const [searchBookingId, setSearchBookingId] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [targetImageId, setTargetImageId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [isReuploadRequest, setIsReuploadRequest] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const filteredContent = useMemo(() => {
        const idQuery = searchBookingId ? String(searchBookingId) : '';
        
        return content.filter(c => {
            const bookingMatch = idQuery ? String(c.booking_id).includes(idQuery) : true;
            
            let statusMatch = false;
            if (activeTab === 'Pending') {
                statusMatch = c.admin_approval_status === 'Pending';
            } else if (activeTab === 'Approved') {
                statusMatch = c.admin_approval_status === 'Approved';
            } else if (activeTab === 'Rejected') {
                // Include both final rejection and re-upload requests in the Rejected tab
                statusMatch = c.admin_approval_status.includes('Rejected');
            }
            
            return statusMatch && bookingMatch;
        });

    }, [content, activeTab, searchBookingId]);

    const initiateReject = (id) => {
        setTargetImageId(id);
        const currentContent = content.find(c => c.image_id === id);
        setRejectReason(currentContent.rejection_reason || '');
        setIsReuploadRequest(currentContent.admin_approval_status.includes('Re-upload required'));
        setShowRejectModal(true);
    };
    
    const handleApproval = (id, status, reason = null) => {
        const reviewerId = mockUsers.find(u => u.role_id === 2)?.user_id || 999; 
        
        setContent(content.map(c => 
            c.image_id === id ? { ...c, admin_approval_status: status, admin_id_reviewer: reviewerId, rejection_reason: reason } : c
        ));
    };

    const handleRejectSubmit = () => {
        if (!rejectReason.trim()) {
            console.error("A rejection reason is required.");
            return;
        }
        const status = isReuploadRequest ? 'Rejected (Re-upload required)' : 'Rejected';
        handleApproval(targetImageId, status, rejectReason.trim());
        setShowRejectModal(false);
        setRejectReason('');
    };
    
    const openImageModal = (url) => {
        setImageUrl(url);
        setShowImageModal(true);
    };

    const renderStatusBadge = (status) => {
        let colorClass;
        if (status === 'Approved') colorClass = 'bg-green-600/10 text-green-600';
        else if (status.includes('Pending')) colorClass = 'bg-amber-500/10 text-amber-500';
        else colorClass = 'bg-red-600/10 text-red-600';

        return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <HeaderTitle themeColors={themeColors}>Ad Content Verification & Approval</HeaderTitle>
            
            <div style={{ backgroundColor: themeColors.SECONDARY_COLOR }} className={`flex flex-wrap p-1 rounded-lg border border-gray-500/50 shadow-inner`}>
                {['Pending', 'Approved', 'Rejected'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setSearchBookingId(''); }}
                        style={activeTab === tab ? { backgroundColor: themeColors.PRIMARY_COLOR, color: 'white' } : { color: themeColors.DARK_TEXT }}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition duration-200 m-0.5
                             ${activeTab !== tab ? `hover:bg-[${themeColors.HOVER_BG}]` : 'shadow-md'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
                
            <div className="relative w-full max-w-xs">
                 <Input
                    type="number"
                    placeholder="Search by Booking ID"
                    value={searchBookingId}
                    onChange={(e) => setSearchBookingId(e.target.value)}
                    className={`pl-10`}
                    themeColors={themeColors}
                />
                <Search className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2`} style={{ color: themeColors.MID_TEXT }} />
            </div>

            <Card title={`${activeTab} Content`} themeColors={themeColors}>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px] divide-y divide-gray-200/50">
                        <thead>
                            <tr style={{ backgroundColor: themeColors.HOVER_BG }}>
                                {['ID', 'Booking ID', 'Version', 'Image', 'Status', 'Reviewer', 'Reason', 'Actions'].map(header => (
                                    <th key={header} style={{ color: themeColors.DARK_TEXT }} className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider`}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody style={{ color: themeColors.DARK_TEXT }} className={`divide-y divide-gray-200/50`}>
                            {filteredContent.length > 0 ? (
                                filteredContent.map(c => {
                                    const reviewer = mockUsers.find(u => u.user_id === c.admin_id_reviewer);
                                    const reviewerDisplay = reviewer ? `${reviewer.fullname} (ID: ${c.admin_id_reviewer})` : 'N/A';
                                    
                                    return (
                                        <tr key={c.image_id} className={`hover:bg-[${themeColors.HOVER_BG}] transition duration-150`}>
                                            <td className="px-4 py-3 whitespace-nowrap">{c.image_id}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">{c.booking_id}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">{c.version_number}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <button onClick={() => openImageModal(c.image_url)} style={{ color: themeColors.PRIMARY_COLOR }} className={`hover:underline text-sm flex items-center space-x-1`}>
                                                    <span>View Image</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path><path d="M7 17H5a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v2"></path></svg>
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">{renderStatusBadge(c.admin_approval_status)}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">{reviewerDisplay}</td>
                                            <td className="px-4 py-3 text-sm max-w-xs truncate" title={c.rejection_reason || 'N/A'}>{c.rejection_reason || 'N/A'}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                                {c.admin_approval_status === 'Pending' && (
                                                    <div className="flex space-x-2">
                                                        <Button onClick={() => handleApproval(c.image_id, 'Approved')} Icon={Check} variant="success" className="p-1.5" themeColors={themeColors} title="Approve" />
                                                        <Button onClick={() => initiateReject(c.image_id)} Icon={X} variant="danger" className="p-1.5" themeColors={themeColors} title="Reject / Request Re-upload" />
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="8" style={{ color: themeColors.MID_TEXT }} className="px-4 py-3 text-center">No content found in the '{activeTab}' category.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal show={showRejectModal} onClose={() => setShowRejectModal(false)} title="Reject Content & Add Reason" themeColors={themeColors}>
                <p style={{ color: themeColors.MID_TEXT }} className={`mb-4`}>
                    Provide a reason for rejection. Use the checkbox to request a re-upload.
                </p>
                <textarea
                    rows="4"
                    required
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    style={{ backgroundColor: themeColors.SECONDARY_COLOR, color: themeColors.DARK_TEXT }}
                    className={`w-full p-3 rounded-lg border border-gray-500/50 focus:ring-2 focus:ring-[${themeColors.PRIMARY_COLOR}]`}
                    placeholder="Reason for rejection (required)..."
                />
                <div className="flex items-center space-x-2 mt-4">
                    <input
                        type="checkbox"
                        id="reupload_request"
                        checked={isReuploadRequest}
                        onChange={(e) => setIsReuploadRequest(e.target.checked)}
                        className={`w-4 h-4 text-indigo-600 rounded-sm focus:ring-indigo-500 border-gray-300/50`}
                        style={{backgroundColor: themeColors.BASE_BG, accentColor: themeColors.PRIMARY_COLOR}}
                    />
                    <label htmlFor="reupload_request" style={{ color: themeColors.DARK_TEXT }} className={`text-sm`}>Request Customer Re-upload (Sets status to 'Rejected (Re-upload required)')</label>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <Button onClick={() => setShowRejectModal(false)} variant="secondary" themeColors={themeColors}>Cancel</Button>
                    <Button onClick={handleRejectSubmit} variant="danger" disabled={!rejectReason.trim()} themeColors={themeColors}>
                        {isReuploadRequest ? 'Reject & Request Re-upload' : 'Final Reject'}
                    </Button>
                </div>
            </Modal>
            
            <Modal show={showImageModal} onClose={() => setImageUrl(null) || setShowImageModal(false)} title="Ad Content Preview" maxWidth="max-w-3xl" themeColors={themeColors}>
                {imageUrl ? (
                    <img src={imageUrl} alt="Ad Content Preview" className="w-full h-auto object-contain rounded-lg shadow-xl" 
                                onError={(e) => e.target.src = 'https://placehold.co/800x300/112d4e/ffffff?text=Image+Load+Error'} />
                ) : (
                    <p style={{ color: themeColors.DANGER_COLOR }}>No image URL provided.</p>
                )}
            </Modal>
        </div>
    );
};

// --- Physical Tracking Component ---
const PhysicalTracking = ({ themeColors }) => {
    const [tracking, setTracking] = useState(mockTracking);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [targetTrackingId, setTargetTrackingId] = useState(null);
    const [liveImageUrl, setLiveImageUrl] = useState('');
    
    const today = new Date().toISOString().split('T')[0];

    const activeTracking = useMemo(() => {
        const trackingWithBookingInfo = tracking.map(t => {
            const booking = mockBookings.find(b => b.booking_id === t.booking_id);
            
            // Filter out bookings that haven't been paid for or are long expired (simplified check)
            const isExpired = booking && booking.end_date < today;

            if (isExpired && t.status !== 'Completed') { // Allow viewing completed historical tracking
                return null;
            }
            if (booking && booking.payment_status !== 'Success' && t.status === 'Pending') { 
                 return null;
            }

            return { ...t, booking_end_date: booking ? booking.end_date : 'N/A' };
        }).filter(t => t !== null);

        return trackingWithBookingInfo;
    }, [tracking, today]);

    const updateStatus = (id, newStatus) => {
        setTracking(tracking.map(t => 
            t.tracking_id === id ? { ...t, status: newStatus } : t
        ));
    };
    
    const initiateUpload = (id) => {
        setTargetTrackingId(id);
        setLiveImageUrl(tracking.find(t => t.tracking_id === id).image_url || '');
        setShowUploadModal(true);
    };

    const handleUploadSubmit = () => {
        if (!liveImageUrl.trim()) {
            console.error("Please provide a valid image URL for the live photo.");
            return;
        }
        setTracking(tracking.map(t => 
            t.tracking_id === targetTrackingId ? { ...t, image_url: liveImageUrl, status: 'Completed' } : t
        ));
        setShowUploadModal(false);
        setLiveImageUrl('');
        setTargetTrackingId(null);
    };


    return (
        <div className="space-y-6">
            <HeaderTitle themeColors={themeColors}>Physical Hoarding Tracking</HeaderTitle>
            <Card title="Installation & Dismantling Status" themeColors={themeColors}>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] divide-y divide-gray-200/50">
                        <thead>
                            <tr style={{ backgroundColor: themeColors.HOVER_BG }}>
                                {['Tracking ID', 'Booking ID', 'Hoarding ID', 'End Date', 'Status', 'Image Proof', 'Update Status'].map(header => (
                                    <th key={header} style={{ color: themeColors.DARK_TEXT }} className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider`}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody style={{ color: themeColors.DARK_TEXT }} className={`divide-y divide-gray-200/50`}>
                            {activeTracking.length > 0 ? (
                                activeTracking.map(t => (
                                    <tr key={t.tracking_id} className={`hover:bg-[${themeColors.HOVER_BG}] transition duration-150`}>
                                        <td className="px-4 py-3 whitespace-nowrap">{t.tracking_id}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{t.booking_id}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{t.hoarding_id}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{t.booking_end_date}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${t.status === 'Completed' ? 'bg-green-600/10 text-green-600' : 'bg-amber-500/10 text-amber-500'}`}
                                            >
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                            {/* Button simplified to always say 'Upload Image' and opens the modal */}
                                            <Button 
                                                onClick={() => initiateUpload(t.tracking_id)} 
                                                Icon={Upload} 
                                                variant={t.image_url ? 'secondary' : 'primary'} 
                                                className="p-1.5 text-xs" 
                                                themeColors={themeColors}
                                            >
                                                Upload Image
                                            </Button>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                                            <Select
                                                value={t.status}
                                                onChange={(e) => updateStatus(t.tracking_id, e.target.value)}
                                                className={`p-1 text-xs`}
                                                themeColors={themeColors}
                                            >
                                                {['Pending', 'Completed'].map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </Select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ color: themeColors.MID_TEXT }} className="px-4 py-3 text-center">No active/pending tracking records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal show={showUploadModal} onClose={() => setShowUploadModal(false)} title={`Upload Image Proof for Tracking ID: ${targetTrackingId}`} themeColors={themeColors}>
                <p style={{ color: themeColors.MID_TEXT }} className={`mb-4`}>
                    Upload the physical proof image here. This will set the tracking status to 'Completed'.
                </p>
                <Input
                    type="text"
                    required
                    value={liveImageUrl}
                    onChange={(e) => setLiveImageUrl(e.target.value)}
                    placeholder="Paste image link here for mock file upload."
                    themeColors={themeColors}
                />
                <div className="flex justify-end space-x-4 mt-6">
                    <Button onClick={() => setShowUploadModal(false)} variant="secondary" themeColors={themeColors}>Cancel</Button>
                    <Button onClick={handleUploadSubmit} variant="success" disabled={!liveImageUrl.trim()} themeColors={themeColors}>Confirm Upload</Button>
                </div>
            </Modal>
        </div>
    );
};

// --- Review Management Component ---
const ReviewManagement = ({ themeColors }) => {
    const [reviews, setReviews] = useState(mockReviews);
    const [searchUserId, setSearchUserId] = useState('');

    const filteredReviews = useMemo(() => {
        const query = searchUserId.toLowerCase();
        if (!query) return reviews;
        return reviews.filter(r => String(r.user_id).includes(query));
    }, [reviews, searchUserId]);

    const toggleReviewStatus = (id) => {
        setReviews(reviews.map(r => 
            r.review_id === id ? { ...r, is_enabled: !r.is_enabled } : r
        ));
    };

    return (
        <div className="space-y-6">
            <HeaderTitle themeColors={themeColors}>Review Management</HeaderTitle>
            
            <div className="flex justify-between items-center">
                <div className="relative w-full max-w-sm">
                    <Input
                        type="number"
                        placeholder="Search by User ID"
                        value={searchUserId}
                        onChange={(e) => setSearchUserId(e.target.value)}
                        className={`pl-10`}
                        themeColors={themeColors}
                    />
                    <Search className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2`} style={{ color: themeColors.MID_TEXT }} />
                </div>
            </div>

            <Card title="Customer Feedback" themeColors={themeColors}>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] divide-y divide-gray-200/50">
                        <thead>
                            <tr style={{ backgroundColor: themeColors.HOVER_BG }}>
                                {['Review ID', 'User ID', 'Booking ID', 'Rating', 'Comment', 'Enabled', 'Actions'].map(header => (
                                    <th key={header} style={{ color: themeColors.DARK_TEXT }} className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider`}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody style={{ color: themeColors.DARK_TEXT }} className={`divide-y divide-gray-200/50`}>
                            {filteredReviews.length > 0 ? (
                                filteredReviews.map(r => (
                                    <tr key={r.review_id} className={`hover:bg-[${themeColors.HOVER_BG}] transition duration-150`}>
                                        <td className="px-4 py-3 whitespace-nowrap">{r.review_id}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{r.user_id}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{r.booking_id}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={`text-sm ${i < r.rating ? 'text-amber-500' : 'text-gray-400'}`}>★</span>
                                            ))}
                                        </td>
                                        <td className="px-4 py-3 max-w-sm overflow-hidden text-ellipsis" title={r.comment}>{r.comment}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${r.is_enabled ? 'bg-green-600/10 text-green-600' : 'bg-red-600/10 text-red-600'}`}>
                                                {r.is_enabled ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <Button 
                                                onClick={() => toggleReviewStatus(r.review_id)} 
                                                variant={r.is_enabled ? 'danger' : 'success'} 
                                                className="p-1.5 text-xs"
                                                themeColors={themeColors}
                                            >
                                                {r.is_enabled ? 'Disable' : 'Enable'}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ color: themeColors.MID_TEXT }} className="px-4 py-3 text-center">No reviews found matching the User ID.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};


// --- MAIN ADMIN PORTAL COMPONENT (Renamed to App) ---
const AdminPortal = () => {
    const [activeComponent, setActiveComponent] = useState('Dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false); // Start with light mode

    // Apply the active theme configuration
    const themeColors = isDarkMode ? THEME_CONFIG.dark : THEME_CONFIG.light;
    const ThemeIcon = themeColors.ICON;

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case 'Dashboard': return <Dashboard themeColors={themeColors} />;
            case 'HoardingManagement': return <HoardingManagement themeColors={themeColors} />;
            case 'UserManagement': return <UserManagement themeColors={themeColors} />;
            case 'BookingPayment': return <BookingPayment themeColors={themeColors} />;
            case 'AdContentReview': return <AdContentReview themeColors={themeColors} />;
            case 'PhysicalTracking': return <PhysicalTracking themeColors={themeColors} />;
            case 'ReviewManagement': return <ReviewManagement themeColors={themeColors} />;
            default: return <Dashboard themeColors={themeColors} />;
        }
    };

    const Sidebar = () => (
        <div 
            style={{ backgroundColor: themeColors.SECONDARY_COLOR, color: themeColors.DARK_TEXT }}
            className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-500/50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col shadow-2xl`}
        >
            
            <div style={{ backgroundColor: themeColors.BASE_BG }} className={`p-4 border-b border-gray-500/50 flex justify-between items-center sticky top-0`}>
                <h1 style={{ color: themeColors.DARK_TEXT }} className={`text-2xl font-extrabold`}>
                    <span style={{ color: themeColors.PRIMARY_COLOR }}>AMS</span> Admin
                </h1>
                <button onClick={() => setIsSidebarOpen(false)} style={{ color: themeColors.DARK_TEXT }} className={`lg:hidden hover:text-red-500 p-1 rounded-full hover:bg-[${themeColors.HOVER_BG}]`}>
                    <X className="w-6 h-6" />
                </button>
            </div>

            <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = activeComponent === item.component;
                    return (
                        <button
                            key={item.name}
                            onClick={() => { setActiveComponent(item.component); setIsSidebarOpen(false); }}
                            style={isActive ? { backgroundColor: themeColors.PRIMARY_COLOR, color: 'white' } : { color: themeColors.DARK_TEXT, transition: 'background-color 0.15s' }}
                            className={`w-full flex items-center p-3 rounded-lg text-left transition duration-150 font-medium
                                ${isActive ? 'font-semibold shadow-md' : `hover:bg-[${themeColors.HOVER_BG}] hover:text-opacity-80`}`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            <span>{item.name}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );

    const formattedActiveComponent = activeComponent ? activeComponent.replace(/([A-Z])/g, ' $1').trim() : 'Dashboard';
    const currentAdmin = mockUsers.find(u => u.role_id === 2);

    return (
        <div style={{ backgroundColor: themeColors.BASE_BG }} className={`min-h-screen flex font-sans`}>
            
            {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

            <Sidebar />

            <div style={{ backgroundColor: themeColors.BASE_BG }} className="flex-grow lg:ml-64 transition-all duration-300 min-w-0 p-4 sm:p-8">
                
                <header style={{ backgroundColor: themeColors.BASE_BG }} className="sticky top-0 z-30 bg-opacity-95 backdrop-blur-sm py-3 mb-4 border-b border-gray-500/50">
                    <div className="flex justify-between items-center">
                        <h2 style={{ color: themeColors.DARK_TEXT }} className={`text-2xl font-bold lg:hidden`}>{formattedActiveComponent}</h2>
                        
                        {/* Mobile Menu Button */}
                        <button onClick={() => setIsSidebarOpen(true)} style={{ color: themeColors.DARK_TEXT }} className={`p-2 rounded-full hover:bg-[${themeColors.HOVER_BG}] lg:hidden`}>
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="hidden lg:flex justify-end items-center w-full space-x-4">
                            
                            {/* Dark Mode Toggle Button */}
                            <button
                                onClick={toggleDarkMode}
                                style={{ color: themeColors.PRIMARY_COLOR, backgroundColor: themeColors.SECONDARY_COLOR }}
                                className="p-3 rounded-full hover:brightness-110 transition duration-150 border border-gray-500/50 shadow-md focus:outline-none focus:ring-2"
                                title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
                            >
                                <ThemeIcon className="w-6 h-6" />
                            </button>

                            {/* Profile Dropdown (Hover activated) */}
                            <div 
                                className="relative"
                                onMouseEnter={() => setIsProfileMenuOpen(true)}
                                onMouseLeave={() => setIsProfileMenuOpen(false)}
                            >
                                <button
                                    style={{ color: 'white', backgroundColor: themeColors.PRIMARY_COLOR }}
                                    className={`p-3 rounded-full shadow-lg transition duration-150 focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                                >
                                    <User className="w-6 h-6" />
                                </button>

                                {isProfileMenuOpen && (
                                    <div 
                                        style={{ backgroundColor: themeColors.BASE_BG }}
                                        className="absolute right-0 mt-3 w-56 shadow-xl rounded-lg border border-gray-500/50 z-50 py-2 origin-top-right animate-in fade-in zoom-in-95"
                                    >
                                        <div className="px-4 py-2 text-sm border-b border-gray-500/50" style={{ color: themeColors.DARK_TEXT }}>
                                            <p className="font-bold">{currentAdmin?.fullname || 'Admin User'}</p>
                                            <p className="text-xs" style={{ color: themeColors.MID_TEXT }}>Admin ID: {currentAdmin?.user_id}</p>
                                        </div>
                                        <div className="p-2">
                                            <Button 
                                                variant="danger" 
                                                Icon={LogOut} 
                                                className="w-full justify-start px-3 py-2"
                                                onClick={() => { 
                                                    console.log('Logged out (mock)'); 
                                                    setIsProfileMenuOpen(false); 
                                                }}
                                                themeColors={themeColors}
                                            >
                                                Log Out
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="mt-2 lg:mt-0">
                    {renderComponent()}
                </div>
            </div>
        </div>
    );
};

export default AdminPortal;