import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Send, FileText, LayoutDashboard, Paperclip, AlertTriangle, Loader2, Hospital, Building2 } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const categories = [
    'Long waiting time',
    'Doctor unavailability',
    'Billing issues',
    'Staff behavior complaints',
    'Medical service problems',
    'Appointment issues',
    'Other'
];

const departments = [
    'Emergency',
    'Cardiology',
    'Orthopedics',
    'Pediatrics',
    'Gynaecology',
    'General Medicine',
    'Neurology',
    'Other'
];

const SubmitComplaint = () => {
    const [formData, setFormData] = useState({
        patientIdentifier: '',
        department: 'General Medicine',
        category: 'Long waiting time',
        description: '',
        priority: 'MEDIUM',
        evidenceUrl: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await axios.post('http://localhost:5001/api/complaints', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Complaint submitted successfully!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error submitting complaint');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-20 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 p-12 border border-white overflow-hidden relative"
            >
                <div className="absolute top-0 left-0 w-2 h-full bg-medical-500" />
                <div className="flex items-center justify-between mb-12">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Submit New Complaint</h2>
                        <p className="text-slate-500 text-lg">Please provide as much detail as possible to help us resolve this.</p>
                    </div>
                    <div className="bg-medical-50 p-6 rounded-[2.5rem] text-medical-600 hidden md:block">
                        <FileText size={48} />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-widest flex items-center gap-2">
                                <LayoutDashboard size={14} className="text-medical-500" />
                                Patient ID (Optional)
                            </label>
                            <input
                                type="text"
                                className="w-full bg-slate-100/50 border-2 border-transparent focus:bg-white focus:border-medical-500 rounded-2xl py-5 px-6 transition-all"
                                placeholder="HOSP-12345"
                                value={formData.patientIdentifier}
                                onChange={(e) => setFormData({ ...formData, patientIdentifier: e.target.value })}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-widest flex items-center gap-2">
                                <Building2 size={14} className="text-medical-500" />
                                Department
                            </label>
                            <select
                                className="w-full bg-slate-100/50 border-2 border-transparent focus:bg-white focus:border-medical-500 rounded-2xl py-5 px-6 transition-all appearance-none cursor-pointer"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            >
                                {departments.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-widest flex items-center gap-2">
                                <Hospital size={14} className="text-medical-500" />
                                Issue Category
                            </label>
                            <select
                                className="w-full bg-slate-100/50 border-2 border-transparent focus:bg-white focus:border-medical-500 rounded-2xl py-5 px-6 transition-all appearance-none cursor-pointer"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-widest flex items-center gap-2">
                                <AlertTriangle size={14} className="text-medical-500" />
                                Priority Level
                            </label>
                            <div className="grid grid-cols-4 gap-3">
                                {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, priority: p })}
                                        className={`py-5 px-1 rounded-2xl font-bold text-[10px] transition-all border-2 ${formData.priority === p ? 'bg-medical-500 border-medical-600 text-white shadow-lg shadow-medical-200' : 'bg-slate-100/50 border-transparent text-slate-400 hover:border-slate-200'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 ml-2 uppercase tracking-widest">Issue Description</label>
                        <textarea
                            required
                            rows="6"
                            className="w-full bg-slate-100/50 border-2 border-transparent focus:bg-white focus:border-medical-500 rounded-3xl py-6 px-8 transition-all resize-none font-medium leading-[1.8]"
                            placeholder="Describe your issue in detail. What happened? When and where?"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-4 hover:border-medical-300 transition-colors cursor-pointer group">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-medical-500 transition-colors shadow-sm">
                            <Paperclip size={28} />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-900 leading-tight">Attach Evidence</p>
                            <p className="text-slate-400">Add medical receipts, prescriptions, or bills.</p>
                        </div>
                        <p className="text-xs text-slate-300 font-medium">MAX IMAGE SIZE: 5MB</p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-medical-500 text-white rounded-[2rem] py-6 font-extrabold text-2xl hover:bg-medical-600 transition-all shadow-2xl shadow-medical-200/50 flex items-center justify-center gap-4 disabled:opacity-75"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={28} /> : (
                            <>
                                <Send size={24} />
                                Submit Issue Report
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default SubmitComplaint;
