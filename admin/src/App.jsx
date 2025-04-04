import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout Components
import Sidebar from './components/Sidebar';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Salons from './pages/Salons';
import Coiffeurs from './pages/Coiffeurs';
import Clients from './pages/Clients';
import Disponibilites from './pages/Disponibilites';
import Services from './pages/Services';
import Reservations from './pages/Reservations';

export const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
export const currency = '€';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    return <Navigate to="/loginAdmin" replace />;
  }
  return children;
};

const App = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Routes>
        <Route path="/loginAdmin" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex flex-1">
                <Sidebar />
                <div className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/salons" element={<Salons />} />
                    <Route path="/coiffeurs" element={<Coiffeurs />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/disponibilites" element={<Disponibilites />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/reservations" element={<Reservations />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;
