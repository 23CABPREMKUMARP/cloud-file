import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Activity, LayoutDashboard, FileText } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 glass-morphism border-b border-blue-100 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-medical-500 text-white p-2 rounded-xl group-hover:bg-medical-600 transition-colors">
                        <Activity size={24} />
                    </div>
                    <span className="text-xl font-bold text-slate-800 tracking-tight">
                        Medi<span className="text-medical-600">Resolve</span>
                    </span>
                </Link>

                {user ? (
                    <div className="flex items-center gap-6">
                        <Link to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} className="text-slate-600 hover:text-medical-600 font-medium transition-colors flex items-center gap-1">
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </Link>
                        {user.role === 'PATIENT' && (
                            <Link to="/submit" className="bg-medical-500 text-white px-4 py-2 rounded-lg hover:bg-medical-600 transition-all shadow-md shadow-medical-100 flex items-center gap-2">
                                <FileText size={18} />
                                <span>Submit Complaint</span>
                            </Link>
                        )}
                        <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-semibold text-slate-800">{user.name}</span>
                                <span className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-slate-600 hover:text-medical-600 font-medium px-4 py-2">Login</Link>
                        <Link to="/register" className="bg-medical-500 text-white px-5 py-2 rounded-lg hover:bg-medical-600 transition-all shadow-md shadow-medical-100">Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
