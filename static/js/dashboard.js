/* 
   DASHBOARD LOGIC (dashboard.js)
   ------------------------------
   This file acts as the "Backend in JS". 
   It contains:
   1. MOCK DATA (Simulating a database)
   2. APP LOGIC (Handling interactions)
   3. UI COMPONENTS (Rendering the view)
*/

const { useState, useEffect } = React;
const { motion, AnimatePresence } = window.Motion;

// ==========================================
// 1. MOCK BACKEND / DATA LAYER
// ==========================================

// Simulating User Database
const USER_DATABASE = {
    id: 101,
    name: "Alex",
    fullName: "Alex Morgan",
    email: "alex.morgan@design.co",
    role: "Senior Product Designer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&fit=crop",
    // This value will be fetched by the frontend
    roadmapProgress: 45 
};

// Simulating Stats API
const STATS_DATA = [
    { label: "Courses Enrolled", value: "12", icon: "BookOpen", color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Active Projects", value: "4", icon: "Folder", color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Certificates", value: "7", icon: "Award", color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Skills Gained", value: "24", icon: "Zap", color: "text-emerald-600", bg: "bg-emerald-100" },
];

// Simulating Updates API
const UPDATES_DATA = [
    { id: 1, title: "Figma Advanced Course", time: "2 hours ago", status: "In Progress" },
    { id: 2, title: "Dashboard Redesign", time: "5 hours ago", status: "Completed" },
    { id: 3, title: "React Certification", time: "1 day ago", status: "Pending" },
];

// Simulating Courses API
const COURSES_DATA = [
    { id: 1, title: "UI/UX Masterclass", progress: 75, color: "bg-blue-500" },
    { id: 2, title: "React Patterns", progress: 30, color: "bg-purple-500" },
    { id: 3, title: "Design Systems", progress: 90, color: "bg-emerald-500" },
];


// ==========================================
// 2. HELPER COMPONENTS
// ==========================================

// Icon Helper to render Lucide icons
const Icon = ({ name, size = 24, className = "" }) => {
    // Check if the global lucide object is available
    if (window.lucide && window.lucide.icons) {
        const IconComponent = window.lucide.icons[name];
        if (IconComponent) {
             // We can render SVG manually if needed, but for simplicity in this setup
             // we'll map a few common ones manually to ensure they work without complex build steps
        }
    }
    
    // Simple SVG Map for reliability in this standalone file
    const icons = {
        Bell: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
        Search: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
        User: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
        LogOut: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
        Settings: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
        Award: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
        Folder: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>,
        BookOpen: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
        Zap: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
        ChevronDown: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
    };
    return icons[name] || null;
};

// UI Building Blocks
const Card = ({ children, className }) => <div className={`dashboard-card ${className || ''}`}>{children}</div>;
const Button = ({ children, className, onClick }) => <button className={`btn btn-primary px-4 py-2 ${className || ''}`} onClick={onClick}>{children}</button>;

const Progress = ({ value, className }) => (
    <div className={`progress-track h-2 w-full ${className || ''}`}>
        <div className="progress-fill h-full" style={{ width: `${value}%` }}></div>
    </div>
);

// ==========================================
// 3. APP LOGIC / COMPONENTS
// ==========================================

const Navbar = () => {
    // State for the dropdown menu
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    return (
        <nav className="navbar px-6 py-4 flex items-center justify-between sticky top-0 z-50">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">D</div>
                <span className="font-[Outfit] text-xl font-bold text-slate-900">
                    Dash<span className="text-blue-600">Board</span>
                </span>
            </div>

            {/* User Profile & Dropdown */}
            <div className="relative">
                <button 
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                >
                    <img src={USER_DATABASE.avatar} alt="Profile" className="w-9 h-9 rounded-full border border-white shadow-sm" />
                    <div className="hidden md:flex flex-col items-start text-sm">
                        <span className="font-semibold text-slate-900">Hi, {USER_DATABASE.name}</span>
                        <span className="text-xs text-slate-500">{USER_DATABASE.role}</span>
                    </div>
                    <Icon name="ChevronDown" size={16} className="text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50"
                    >
                        <div className="px-3 py-2 border-b border-slate-100 mb-2">
                            <p className="font-semibold text-sm">{USER_DATABASE.fullName}</p>
                            <p className="text-xs text-slate-500">{USER_DATABASE.email}</p>
                        </div>
                        {['Account', 'Recent Updates', 'Skills', 'Courses', 'Projects', 'Certificates'].map(item => (
                            <div key={item} className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center gap-2">
                                {item}
                            </div>
                        ))}
                        <div className="h-px bg-slate-100 my-1"></div>
                        <div className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer flex items-center gap-2">
                            <Icon name="LogOut" size={16} /> Logout
                        </div>
                    </motion.div>
                )}
            </div>
        </nav>
    );
};

const Dashboard = () => {
    // State to simulate data fetching
    const [progress, setProgress] = useState(0);

    // Simulate "Backend" API Call
    useEffect(() => {
        // "Fetch" data after 500ms
        setTimeout(() => {
            setProgress(USER_DATABASE.roadmapProgress);
        }, 500);
    }, []);

    return (
        <div className="pb-20">
            <Navbar />

            <main className="container mx-auto p-6 space-y-8 max-w-7xl">
                
                {/* Welcome Banner */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    <div className="z-10 space-y-2">
                        <h1 className="text-3xl md:text-4xl font-bold">Welcome back, {USER_DATABASE.name}!</h1>
                        <p className="text-blue-100 text-lg">You have 4 active projects today.</p>
                    </div>
                    <button className="z-10 bg-white text-blue-600 px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-50 transition-colors">
                        View Roadmap
                    </button>
                    {/* Abstract Background Decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {STATS_DATA.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="dashboard-card p-6 flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                    <Icon name={stat.icon} size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Recent Updates */}
                        <motion.section 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-slate-800">Recent Updates</h2>
                            </div>
                            <div className="space-y-4">
                                {UPDATES_DATA.map((update) => (
                                    <div key={update.id} className="dashboard-card p-4 flex items-center justify-between cursor-pointer hover:border-blue-300">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                                <Icon name="Bell" size={20} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-900">{update.title}</h4>
                                                <p className="text-sm text-slate-500">{update.time}</p>
                                            </div>
                                        </div>
                                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                            update.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                            update.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {update.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                         {/* Enrolled Courses */}
                         <motion.section 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Enrolled Courses</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {COURSES_DATA.map((course) => (
                                    <div key={course.id} className="dashboard-card overflow-hidden">
                                        <div className={`h-1.5 w-full ${course.color}`} />
                                        <div className="p-6">
                                            <h3 className="text-lg font-bold mb-1">{course.title}</h3>
                                            <p className="text-sm text-slate-500 mb-4">Video Lessons • 12 Modules</p>
                                            <div className="flex items-center justify-between text-sm mb-2">
                                                <span className="text-slate-500">Progress</span>
                                                <span className="font-medium text-slate-900">{course.progress}%</span>
                                            </div>
                                            <Progress value={course.progress} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        
                        {/* Roadmap Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="dashboard-card bg-blue-600 text-white border-none p-6 shadow-xl">
                                <h3 className="text-xl font-bold mb-1">Roadmap Progress</h3>
                                <p className="text-blue-100 text-sm mb-6">Senior Designer Path</p>
                                
                                <div className="mb-6">
                                    <div className="flex items-end justify-between mb-2">
                                        <span className="text-3xl font-bold">{progress}%</span>
                                        <span className="text-sm text-blue-100">Target: 100%</span>
                                    </div>
                                    <div className="h-3 bg-blue-500 rounded-full overflow-hidden">
                                        <div className="h-full bg-white transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Steps */}
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">1</div>
                                        <span>UX Research</span>
                                        <span className="ml-auto opacity-60">Done</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-bold">
                                        <div className="w-6 h-6 rounded-full bg-white text-blue-600 flex items-center justify-center text-xs">2</div>
                                        <span>Visual Design</span>
                                        <span className="ml-auto">Now</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Skills */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="dashboard-card p-6">
                                <h3 className="text-xl font-bold mb-4">My Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {["Figma", "React", "CSS", "Prototyping", "User Research", "Design Systems"].map(skill => (
                                        <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-default border border-slate-200">
                                            {skill}
                                        </span>
                                    ))}
                                    <button className="px-3 py-1 border border-slate-300 rounded-lg text-sm text-slate-500 hover:bg-slate-50">
                                        + Add
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </main>
        </div>
    );
};

// ==========================================
// 4. RENDER APP
// ==========================================
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Dashboard />);
