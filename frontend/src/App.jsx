import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import AdminDashboard from './pages/AdminDashboard';
import { Toaster } from 'react-hot-toast';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <Toaster position="top-right" />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/dashboard" element={
                <PrivateRoute roles={['PATIENT']}>
                  <PatientDashboard />
                </PrivateRoute>
              } />

              <Route path="/submit" element={
                <PrivateRoute roles={['PATIENT']}>
                  <SubmitComplaint />
                </PrivateRoute>
              } />

              <Route path="/admin" element={
                <PrivateRoute roles={['ADMIN', 'STAFF']}>
                  <AdminDashboard />
                </PrivateRoute>
              } />
            </Routes>
          </main>
          <footer className="py-8 bg-white border-t border-slate-100 text-center text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} MediResolve. All rights reserved.
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
