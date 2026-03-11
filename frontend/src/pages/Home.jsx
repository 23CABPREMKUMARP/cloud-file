import { Activity, ShieldCheck, Clock, UserCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="flex flex-col">
            <section className="relative overflow-hidden py-24 bg-white">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-medical-50/50 -skew-x-12 transform origin-right translate-x-16" />
                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex-1 space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 bg-medical-100/50 text-medical-600 px-4 py-2 rounded-full font-medium">
                            <ShieldCheck size={20} />
                            <span>Certified Healthcare Resolution Platform</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1]">
                            Ensuring Every <br />
                            <span className="text-medical-600">Patient Issue</span> <br />
                            is Resolved.
                        </h1>
                        <p className="text-xl text-slate-500 max-w-lg leading-relaxed">
                            MediResolve provides a transparent, secure, and efficient way for patients to report hospital issues and track their resolution in real time.
                        </p>
                        <div className="flex items-center gap-4 pt-4">
                            <Link to="/register" className="bg-medical-500 text-white px-8 py-4 rounded-2xl hover:bg-medical-600 transition-all font-bold text-lg shadow-xl shadow-medical-200/50 flex items-center gap-2 group">
                                Join MediResolve
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/login" className="px-8 py-4 rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 transition-all font-bold text-lg">
                                Member Login
                            </Link>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="flex-1 perspective-1000 hidden md:block"
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-medical-400 rounded-3xl blur-3xl opacity-20 transform -rotate-6 scale-95 group-hover:rotate-0 transition-transform duration-500" />
                            <div className="relative glass-morphism rounded-[3rem] p-4 shadow-2xl border-white/50 backdrop-blur-2xl">
                                <div className="bg-slate-100 rounded-[2.5rem] w-full h-[450px] flex items-center justify-center p-8 overflow-hidden">
                                    <div className="space-y-6 w-full max-w-sm">
                                        <div className="h-12 w-full bg-white rounded-2xl flex items-center px-4 gap-3 shadow-sm border border-slate-200/50">
                                            <div className="w-6 h-6 rounded-full bg-medical-500 animate-pulse" />
                                            <div className="h-3 w-3/4 bg-slate-200 rounded-full" />
                                        </div>
                                        <div className="h-40 w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-200/50 space-y-3">
                                            <div className="h-3 w-1/4 bg-medical-400/50 rounded-full" />
                                            <div className="h-3 w-full bg-slate-100 rounded-full" />
                                            <div className="h-3 w-full bg-slate-100 rounded-full" />
                                            <div className="h-3 w-1/2 bg-slate-100 rounded-full" />
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="h-32 w-1/2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/50 space-y-3">
                                                <div className="w-10 h-10 rounded-2xl bg-medical-50 flex items-center justify-center text-medical-600">
                                                    <Clock size={20} />
                                                </div>
                                                <div className="h-3 w-3/4 bg-slate-100 rounded-full" />
                                            </div>
                                            <div className="h-32 w-1/2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/50 space-y-3">
                                                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                                    <UserCheck size={20} />
                                                </div>
                                                <div className="h-3 w-3/4 bg-slate-100 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="py-24 bg-slate-50 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center space-y-4 mb-20">
                        <h2 className="text-4xl font-extrabold text-slate-900 capitalize italic">Streamlined Resolution Workflow</h2>
                        <div className="w-24 h-2 bg-medical-500 mx-auto rounded-full" />
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">We've built a platform that simplifies the entire process from submission to completion.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: <Activity className="text-medical-600" />,
                                title: "Report Issues",
                                desc: "Quickly submit complaints regarding waiting times, billing, or staff behavior with just a few clicks."
                            },
                            {
                                icon: <Clock className="text-orange-500" />,
                                title: "Real-time Tracking",
                                desc: "Stay informed with a live timeline of status updates as hospital administrators work on your case."
                            },
                            {
                                icon: <ShieldCheck className="text-emerald-600" />,
                                title: "Secure Resolution",
                                desc: "All interactions and data are encrypted and handled with the highest level of patient confidentiality."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white hover:border-medical-100 transition-all text-center group"
                            >
                                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-lg">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
