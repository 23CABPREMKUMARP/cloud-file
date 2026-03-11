import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await axios.post('http://localhost:5001/api/auth/login', formData);
            login(res.data.user, res.data.token);
            toast.success('Login successful!');
            navigate(res.data.user.role === 'ADMIN' ? '/admin' : '/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid registration or login details.';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        if (!formData.email) {
            toast.error('Please enter your email address first.');
            return;
        }
        toast.success(`Password reset link sent to ${formData.email}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center -mt-16 py-20 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-10 border border-white"
            >
                <div className="text-center mb-10 space-y-4">
                    <div className="w-16 h-16 bg-medical-500 rounded-2xl flex items-center justify-center mx-auto text-white shadow-xl shadow-medical-100 mb-4">
                        <LogIn size={28} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900">Welcome Back</h2>
                    <p className="text-slate-500">Log in to your MediResolve account</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl flex items-start gap-3 border border-red-100"
                    >
                        <AlertCircle className="mt-0.5 shrink-0" size={18} />
                        <span className="text-sm font-medium">{error}</span>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-medical-500 transition-colors" size={20} />
                            <input
                                type="email"
                                required
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-medical-500 transition-all font-medium"
                                placeholder="doctor.name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-sm font-bold text-slate-700">Password</label>
                            <button type="button" onClick={handleForgotPassword} className="text-xs text-medical-600 font-bold hover:underline">Forgot Password?</button>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-medical-500 transition-colors" size={20} />
                            <input
                                type="password"
                                required
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-medical-500 transition-all font-medium"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-medical-500 text-white rounded-2xl py-4 font-bold text-lg hover:bg-medical-600 transition-all shadow-xl shadow-medical-200/50 flex items-center justify-center gap-2 group disabled:opacity-75"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                Log In
                                <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center mt-10 text-slate-500 font-medium">
                    Don't have an account? <Link to="/register" className="text-medical-600 font-bold hover:underline">Create Account</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
