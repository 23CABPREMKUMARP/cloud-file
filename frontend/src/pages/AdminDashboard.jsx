import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
    Users, Activity, CheckCircle, Clock, Search, Filter, RefreshCcw, MoreVertical,
    TrendingUp, AlertTriangle, ShieldCheck, Trash2, UserCheck
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

const COLORS = ['#0ea5e9', '#4caf50', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [updateStatus, setUpdateStatus] = useState('');
    const [assignedToId, setAssignedToId] = useState('');
    const [comment, setComment] = useState('');
    const [staff, setStaff] = useState([]);
    const { token } = useAuth();

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [compRes, analyticsRes] = await Promise.all([
                axios.get('http://localhost:5001/api/complaints/all', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:5001/api/complaints/analytics', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:5001/api/auth/staff', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setComplaints(compRes.data);
            setAnalytics(analyticsRes.data);
            setStaff(staffRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    const handleQuickResolve = async (id) => {
        try {
            await axios.patch(`http://localhost:5001/api/complaints/${id}`,
                { status: 'RESOLVED', comment: 'Quick resolved by administrator.' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Incident resolved immediately!');
            fetchData();
        } catch (err) {
            toast.error('Failed to resolve incident.');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedComplaint) return;
        try {
            await axios.patch(`http://localhost:5001/api/complaints/${selectedComplaint.id}`,
                { status: updateStatus, comment, assignedToId: assignedToId || undefined },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSelectedComplaint(null);
            setUpdateStatus('');
            setAssignedToId('');
            setComment('');
            toast.success('Complaint updated successfully!');
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error updating complaint');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this incident signature?')) return;
        try {
            await axios.delete(`http://localhost:5001/api/complaints/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Incident deleted from registry.');
            fetchData();
        } catch (err) {
            toast.error('Deletion protocol failed.');
        }
    };

    const filteredComplaints = complaints.filter(c => {
        const matchesSearch = c.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.category?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus ? c.status === filterStatus : true;
        return matchesSearch && matchesStatus;
    });

    const chartData = analytics?.byCategory.map(c => ({
        name: c.category,
        value: c._count.id
    })) || [];

    const statusData = analytics?.byStatus.map(s => ({
        name: s.status,
        value: s._count.id
    })) || [];

    return (
        <div className="max-w-7xl mx-auto py-16 px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-black text-xs tracking-widest uppercase">
                        <ShieldCheck size={18} />
                        <span>Sentinel Registry Control</span>
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tight capitalize">
                        Admin <span className="text-indigo-600">Operations</span>
                    </h2>
                    <p className="text-slate-500 text-lg flex items-center gap-2 font-medium italic">
                        Overseeing <span className="text-slate-900 font-black">{complaints.length} medical incidents</span> across all departments.
                    </p>
                </div>
                <button
                    onClick={fetchData}
                    className="bg-white border-2 border-slate-100 p-5 rounded-[2rem] hover:bg-indigo-50 hover:border-indigo-100 transition-all shadow-sm group active:scale-95"
                >
                    <RefreshCcw size={24} className={`text-slate-300 group-hover:text-indigo-500 transition-colors ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="grid md:grid-cols-4 gap-8 mb-16">
                {[
                    { label: 'System Load', val: analytics?.total || 0, icon: <Activity />, color: 'bg-indigo-500', trend: '+12% Since Last Cycle', filter: '' },
                    { label: 'Queued Actions', val: (analytics?.total || 0) - (analytics?.resolved || 0), icon: <Clock />, color: 'bg-orange-500', trend: 'Critical Attention', filter: 'SUBMITTED' },
                    { label: 'Resolved Cases', val: analytics?.resolved || 0, icon: <CheckCircle />, color: 'bg-emerald-500', trend: '95% Service Rate', filter: 'RESOLVED' },
                    { label: 'In Progress', val: analytics?.byStatus?.find(s => s.status === 'IN_PROGRESS')?._count?.id || 0, icon: <TrendingUp />, color: 'bg-indigo-600', trend: 'Active Workflow', filter: 'IN_PROGRESS' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => setFilterStatus(stat.filter)}
                        className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-white space-y-6 group hover:border-indigo-100 transition-all overflow-hidden relative cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 p-8 text-slate-50 opacity-10 scale-[2.5] transform rotate-12 transition-transform group-hover:rotate-45 group-hover:scale-[3]">
                            {stat.icon}
                        </div>
                        <div className={`w-14 h-14 rounded-2xl ${stat.color} text-white flex items-center justify-center shadow-lg relative z-10`}>
                            {stat.icon}
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-4xl font-black text-slate-900 leading-none mb-3 italic tracking-tight">{stat.val}</h3>
                            <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-4 italic">{stat.label}</p>
                            <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50/50 py-1.5 px-3 rounded-full border border-indigo-100/50">
                                <ArrowUpRight size={12} />
                                {stat.trend}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-10 mb-16">
                <div className="lg:col-span-2 bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/50 p-12 border border-white">
                    <div className="flex items-center justify-between mb-12">
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                            <TrendingUp size={24} className="text-emerald-500" />
                            Service Analytics Portfolio
                        </h3>
                        <div className="flex bg-slate-50 p-2 rounded-2xl border border-slate-100">
                            <button className="px-6 py-2 bg-white rounded-xl shadow-sm text-xs font-black text-slate-900 uppercase">Load Metrics</button>
                            <button className="px-6 py-2 rounded-xl text-xs font-black text-slate-400 uppercase italic">Trend Lines</button>
                        </div>
                    </div>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} fontSize={10} tick={{ fontWeight: 900 }} />
                                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} fontSize={10} tick={{ fontWeight: 900 }} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '24px',
                                        border: 'none',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                        backgroundColor: 'rgba(255,255,255,0.9)',
                                        backdropFilter: 'blur(10px)',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        fontSize: '10px'
                                    }}
                                />
                                <Bar dataKey="value" fill="#6366f1" radius={[15, 15, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/50 p-12 border border-white flex flex-col items-center justify-center">
                    <h3 className="text-xl font-black text-slate-800 mb-8 uppercase tracking-widest italic">Operational Distro</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden">
                <div className="p-12 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="space-y-4">
                        <h3 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                            <ShieldCheck size={28} className="text-indigo-500" />
                            Registry Oversight
                        </h3>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Active Incident Logs from All Regions</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Lookup Incident or User..."
                                className="bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 py-4 pl-14 pr-8 rounded-[2rem] text-sm font-black italic transition-all shadow-sm w-full md:w-80"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="bg-slate-50 border-2 border-transparent py-4 px-8 rounded-[2rem] text-sm font-black italic appearance-none cursor-pointer hover:border-indigo-200 transition-all shadow-sm"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="">STATUS FILTER</option>
                            <option value="SUBMITTED">SUBMITTED</option>
                            <option value="IN_PROGRESS">IN PROGRESS</option>
                            <option value="RESOLVED">RESOLVED</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Signature ID</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Incident Origin</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Sector</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Urgency</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Protocol Status</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredComplaints.map((c, i) => (
                                <motion.tr
                                    key={c.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group hover:bg-slate-50/80 transition-all cursor-crosshair"
                                >
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col">
                                            <span className="text-slate-900 font-black italic uppercase tracking-tighter text-lg">{c.id.split('-')[0]}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">{format(new Date(c.createdAt), 'yy-MM-dd')}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 font-black text-sm border border-indigo-100">
                                                {c.patient?.name?.[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-slate-800 font-bold italic">{c.patient?.name}</span>
                                                <span className="text-[10px] text-slate-400 font-bold lowercase tracking-wider">{c.patient?.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="bg-white border border-slate-200 px-4 py-1.5 rounded-full text-[10px] font-black text-slate-600 uppercase italic">{c.department}</span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border-2 shadow-sm ${c.priority === 'CRITICAL' ? 'bg-red-50 text-red-600 border-red-200' :
                                            c.priority === 'HIGH' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                                'bg-slate-100 text-slate-400 border-slate-200 opacity-50'
                                            }`}>
                                            {c.priority}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className={`text-xs font-black italic uppercase underline decoration-2 underline-offset-4 ${c.status === 'RESOLVED' ? 'text-emerald-600 decoration-emerald-200' : 'text-slate-900 decoration-indigo-200'}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {c.status !== 'RESOLVED' && (
                                                <button
                                                    onClick={() => handleQuickResolve(c.id)}
                                                    className="bg-emerald-50 border-2 border-emerald-100 p-4 rounded-2xl text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm group active:scale-95"
                                                    title="Quick Resolve"
                                                >
                                                    <CheckCircle size={20} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setSelectedComplaint(c);
                                                    setUpdateStatus(c.status);
                                                    setAssignedToId(c.assignedToId || '');
                                                }}
                                                className="bg-white border-2 border-slate-200 p-4 rounded-2xl hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all shadow-sm group active:scale-95"
                                                title="View/Update Details"
                                            >
                                                <ArrowUpRight size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(c.id)}
                                                className="bg-red-50 border-2 border-red-100 p-4 rounded-2xl text-red-400 hover:bg-red-600 hover:text-white transition-all shadow-sm group active:scale-95"
                                                title="Delete Incident"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredComplaints.length === 0 && (
                        <div className="py-24 text-center bg-slate-50/30">
                            <div className="text-slate-200 mb-4 flex justify-center"><AlertTriangle size={64} /></div>
                            <p className="text-slate-300 font-black text-2xl uppercase tracking-[0.2em] italic">No incidents documented in current sector.</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedComplaint && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 sm:p-12">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setSelectedComplaint(null)}
                        className="absolute inset-0 bg-slate-900/90 backdrop-blur-3xl"
                    />
                    <motion.div
                        initial={{ scale: 0.9, y: 30, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        className="relative bg-white w-full max-w-4xl rounded-[4rem] shadow-2xl p-12 overflow-hidden border border-white"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-5 scale-[4] transform rotate-12 pointer-events-none">
                            <ShieldCheck size={128} className="text-indigo-600" />
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row gap-12">
                            <div className="flex-1 space-y-8">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 py-1.5 px-4 rounded-full border border-indigo-100">Protocol Oversight</span>
                                    <h3 className="text-5xl font-black text-slate-900 tracking-tighter italic">{selectedComplaint.category}</h3>
                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                                        <Activity size={14} />
                                        Signature: {selectedComplaint.id}
                                    </p>
                                </div>

                                <div className="bg-slate-50 rounded-[2.5rem] p-8 space-y-4 border border-slate-100">
                                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Incident Description</p>
                                    <p className="text-slate-900 leading-relaxed font-bold italic text-lg">{selectedComplaint.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Reporter</p>
                                        <p className="text-slate-900 font-black italic">{selectedComplaint.patient?.name}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Date Lodged</p>
                                        <p className="text-slate-900 font-black italic">{format(new Date(selectedComplaint.createdAt), 'MMM dd, yyyy')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-80 space-y-8">
                                <form onSubmit={handleUpdate} className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic ml-2">Update Operational Status</label>
                                        <select
                                            className="w-full bg-slate-100 border-2 border-transparent focus:bg-white focus:border-indigo-600 py-5 px-8 rounded-3xl font-black italic appearance-none cursor-pointer transition-all"
                                            value={updateStatus}
                                            onChange={(e) => setUpdateStatus(e.target.value)}
                                        >
                                            <option value="SUBMITTED">SUBMITTED</option>
                                            <option value="IN_REVIEW">IN REVIEW</option>
                                            <option value="ASSIGNED">ASSIGNED</option>
                                            <option value="IN_PROGRESS">IN PROGRESS</option>
                                            <option value="RESOLVED">RESOLVED</option>
                                            <option value="CLOSED">CLOSED</option>
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic ml-2">Assign to Personnel</label>
                                        <select
                                            className="w-full bg-slate-100 border-2 border-transparent focus:bg-white focus:border-indigo-600 py-5 px-8 rounded-3xl font-black italic appearance-none cursor-pointer transition-all"
                                            value={assignedToId}
                                            onChange={(e) => setAssignedToId(e.target.value)}
                                        >
                                            <option value="">-- UNASSIGNED --</option>
                                            {staff.map(member => (
                                                <option key={member.id} value={member.id}>{member.name} ({member.role})</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic ml-2">Resolution Log / Comment</label>
                                        <textarea
                                            className="w-full bg-slate-100 border-2 border-transparent focus:bg-white focus:border-indigo-600 py-6 px-8 rounded-[2.5rem] font-bold italic transition-all resize-none"
                                            rows="5"
                                            placeholder="Document resolution steps..."
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-xl italic uppercase tracking-widest hover:bg-slate-900 transition-all shadow-2xl shadow-indigo-200"
                                    >
                                        Commit Protocol Update
                                    </button>
                                </form>

                                <button
                                    onClick={() => setSelectedComplaint(null)}
                                    className="w-full py-4 text-slate-300 font-black text-[10px] uppercase tracking-widest hover:text-slate-500 transition-colors"
                                >
                                    Dismiss Overlay
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
