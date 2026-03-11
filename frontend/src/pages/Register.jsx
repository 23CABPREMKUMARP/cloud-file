import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Loader2, Hospital, Stethoscope, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'PATIENT'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await axios.post('http://localhost:5001/api/auth/register', formData);
            login(res.data.user, res.data.token);
            toast.success('Registration successful!');
            navigate(res.data.user.role === 'ADMIN' ? '/admin' : '/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || 'Something went wrong during registration.';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center -mt-16 py-24 px-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 p-12 border border-white"
            >
                <div className="text-center mb-12 space-y-4">
                    <div className="w-16 h-16 bg-medical-500 rounded-2xl flex items-center justify-center mx-auto text-white shadow-xl shadow-medical-100 mb-4">
                        <UserPlus size={28} />
                    </div>
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Create Your Account</h2>
                    <p className="text-slate-500 text-lg">Join MediResolve to start reporting hospital issues.</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 p-5 bg-red-50 text-red-600 rounded-2xl flex items-start gap-3 border border-red-100"
                    >
                        <AlertCircle className="mt-0.5 shrink-0" size={20} />
                        <span className="font-semibold">{error}</span>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-wide">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-medical-500 transition-colors" size={20} />
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-100/50 border-2 border-transparent focus:bg-white focus:border-medical-500 rounded-2xl py-4 pl-12 pr-4 transition-all"
                                    placeholder="Antigravity Dev"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-wide">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-medical-500 transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-100/50 border-2 border-transparent focus:bg-white focus:border-medical-500 rounded-2xl py-4 pl-12 pr-4 transition-all"
                                    placeholder="dev@antigravity.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-wide">Account Type</label>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { id: 'PATIENT', label: 'Patient', icon: <User size={20} />, activeClass: 'border-medical-500 bg-medical-50 text-medical-600' },
                                { id: 'STAFF', label: 'Staff', icon: <Stethoscope size={20} />, activeClass: 'border-medical-500 bg-medical-50 text-medical-600' },
                                { id: 'ADMIN', label: 'Admin', icon: <Hospital size={20} />, activeClass: 'border-medical-500 bg-medical-50 text-medical-600' }
                            ].map((role) => (
                                <button
                                    key={role.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: role.id })}
                                    className={`flex items-center justify-center gap-2 p-5 border-2 rounded-2xl font-bold transition-all ${formData.role === role.id ? role.activeClass : 'border-slate-100 bg-slate-100/50 text-slate-400 hover:border-slate-200'}`}
                                >
                                    {role.icon}
                                    {role.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-wide">Secure Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-medical-500 transition-colors" size={20} />
                            <input
                                type="password"
                                required
                                className="w-full bg-slate-100/50 border-2 border-transparent focus:bg-white focus:border-medical-500 rounded-2xl py-4 pl-12 pr-4 transition-all"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-medical-500 text-white rounded-2xl py-5 font-extrabold text-xl hover:bg-medical-600 transition-all shadow-xl shadow-medical-200/50 flex items-center justify-center gap-3 disabled:opacity-75"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'Create My Account'}
                    </button>
                </form>

                <p className="text-center mt-12 text-slate-500 font-medium text-lg">
                    Already a member? <Link to="/login" className="text-medical-600 font-bold hover:underline">Log in now</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
