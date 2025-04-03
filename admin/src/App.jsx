import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Layout Components
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

// Pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Reservations from './pages/Reservations'
import Horaires from './pages/Horaires'
import Clients from './pages/Clients'
import Coiffeurs from './pages/Coiffeurs'
import Services from './pages/Services'
import Salons from './pages/Salons'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

export const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
export const currency = '€'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('admin_token')
  if (!token) {
    return <Navigate to="/loginAdmin" replace />
  }
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/loginAdmin" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/reservations" element={
          <ProtectedRoute>
            <Reservations />
          </ProtectedRoute>
        } />
        <Route path="/horaires" element={
          <ProtectedRoute>
            <Horaires />
          </ProtectedRoute>
        } />
        <Route path="/clients" element={
          <ProtectedRoute>
            <Clients />
          </ProtectedRoute>
        } />
        <Route path="/coiffeurs" element={
          <ProtectedRoute>
            <Coiffeurs />
          </ProtectedRoute>
        } />
        <Route path="/services" element={
          <ProtectedRoute>
            <Services />
          </ProtectedRoute>
        } />
        <Route path="/salons" element={
          <ProtectedRoute>
            <Salons />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
