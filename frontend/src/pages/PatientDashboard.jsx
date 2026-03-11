import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Clock, CheckCircle2, AlertCircle, RefreshCcw, MoreHorizontal, ChevronRight, Activity, Calendar, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const StatusBadge = ({ status }) => {
    const styles = {
        SUBMITTED: 'bg-blue-100/50 text-blue-600 border-blue-200',
        IN_REVIEW: 'bg-orange-100/50 text-orange-600 border-orange-200',
        ASSIGNED: 'bg-purple-100/50 text-purple-600 border-purple-200',
        IN_PROGRESS: 'bg-indigo-100/50 text-indigo-600 border-indigo-200',
        RESOLVED: 'bg-green-100/50 text-green-600 border-green-200',
        CLOSED: 'bg-slate-100/50 text-slate-600 border-slate-200',
    };
    return <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-2 ${styles[status]}`}>{status.replace('_', ' ')}</span>;
};

const PatientDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const fetchComplaints = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('http://localhost:5001/api/complaints/my', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComplaints(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, [token]);

    const filteredComplaints = filter === 'ALL'
        ? complaints
        : complaints.filter(c => !['RESOLVED', 'CLOSED'].includes(c.status));

    return (
        <div className="max-w-7xl mx-auto py-16 px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-medical-50 text-medical-600 px-4 py-2 rounded-xl font-bold text-sm tracking-wide">
                        <Activity size={18} />
                        <span>Active Pulse Management</span>
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tight capitalize">
                        Welcome, <span className="text-medical-600">{user?.name}</span>
                    </h2>
                    <p className="text-slate-500 text-lg flex items-center gap-2">
                        <ShieldCheck size={20} className="text-emerald-500" />
                        You have <span className="text-slate-900 font-bold">{complaints.length} issues</span> submitted for resolution.
                    </p>
                </div>
                <button
                    onClick={fetchComplaints}
                    className="bg-white border-2 border-slate-100 p-5 rounded-3xl hover:bg-slate-50 transition-all shadow-sm group active:scale-95"
                    title="Refresh Pulse"
                >
                    <RefreshCcw size={24} className={`text-slate-400 group-hover:text-medical-500 transition-colors ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="grid md:grid-cols-4 gap-8 mb-16">
                {[
                    { label: 'Total Submitted', val: complaints.length, icon: <FileText />, color: 'bg-blue-500' },
                    { label: 'In Progress', val: complaints.filter(c => ['IN_REVIEW', 'ASSIGNED', 'IN_PROGRESS'].includes(c.status)).length, icon: <Clock />, color: 'bg-orange-500' },
                    { label: 'Resolved Issues', val: complaints.filter(c => c.status === 'RESOLVED').length, icon: <CheckCircle2 />, color: 'bg-emerald-500' },
                    { label: 'Closed Cases', val: complaints.filter(c => c.status === 'CLOSED').length, icon: <AlertCircle />, color: 'bg-slate-500' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white space-y-4 group hover:border-blue-100 transition-all">
                        <div className={`w-14 h-14 rounded-2xl ${stat.color} text-white flex items-center justify-center shadow-lg transform group-hover:-translate-y-2 transition-transform duration-500`}>
                            {stat.icon}
                        </div>
                        <div>
                            <h3 className="text-4xl font-black text-slate-900 leading-none mb-2">{stat.val}</h3>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/50 p-12 border border-white">
                <div className="flex items-center justify-between mb-12">
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight italic">Complaints Timeline</h3>
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                        <button
                            onClick={() => setFilter('ALL')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold italic transition-all ${filter === 'ALL' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
                            All Reports
                        </button>
                        <button
                            onClick={() => setFilter('PENDING')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold italic transition-all ${filter === 'PENDING' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
                            Pending Only
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="py-24 text-center space-y-4">
                        <div className="w-16 h-16 border-4 border-medical-500 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-slate-400 font-bold tracking-widest uppercase">Syncing Records...</p>
                    </div>
                ) : complaints.length === 0 ? (
                    <div className="py-24 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                        <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200 shadow-sm">
                            <FileText size={40} />
                        </div>
                        <p className="text-slate-400 font-black text-xl italic mb-6 uppercase tracking-wider">No issue reports found in system.</p>
                        <button onClick={() => navigate('/submit')} className="bg-medical-500 text-white px-8 py-4 rounded-2xl font-black italic tracking-widest uppercase hover:bg-medical-600 transition-all">Report New Incident</button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <AnimatePresence mode="wait">
                            {filteredComplaints.map((c, i) => (
                                <motion.div
                                    key={c.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group relative bg-slate-50/50 hover:bg-white rounded-[2.5rem] p-8 border border-transparent hover:border-medical-200 hover:shadow-2xl hover:shadow-medical-100 transition-all cursor-pointer"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                        <div className="flex items-start gap-6 flex-1">
                                            <div className="bg-white p-4 rounded-3xl text-medical-600 shadow-sm border border-slate-100/50 hidden md:block">
                                                <FileText size={28} />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-4">
                                                    <StatusBadge status={c.status} />
                                                    <span className="text-xs font-black text-slate-300 uppercase tracking-widest">{c.id.split('-')[0]}</span>
                                                </div>
                                                <h4 className="text-2xl font-black text-slate-900 flex items-center gap-2 italic">
                                                    {c.category}
                                                    <ChevronRight size={20} className="text-medical-400 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                                </h4>
                                                <p className="text-slate-500 line-clamp-2 max-w-2xl font-medium leading-relaxed italic">{c.description}</p>
                                                <div className="flex items-center gap-6 pt-4">
                                                    <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-white py-1.5 px-3 rounded-full border border-slate-100">
                                                        <Calendar size={14} />
                                                        {format(new Date(c.createdAt), 'MMM dd, yyyy')}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-white py-1.5 px-3 rounded-full border border-slate-100 uppercase italic">
                                                        {c.department}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-3 text-right">
                                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${c.priority === 'CRITICAL' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-100/50 text-slate-400 border-slate-100'}`}>
                                                {c.priority} PRIORITY
                                            </div>
                                            <p className="text-slate-300 font-medium italic text-xs">Last updated 2 hours ago</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientDashboard;
