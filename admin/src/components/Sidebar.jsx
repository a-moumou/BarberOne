import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaStore, FaUserTie, FaUsers, FaClock, FaList, FaSignOutAlt, FaCalendarAlt } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard', name: 'Tableau de bord', icon: <FaHome /> },
    { path: '/reservations', name: 'Réservations', icon: <FaCalendarAlt /> },
    { path: '/salons', name: 'Salons', icon: <FaStore /> },
    { path: '/coiffeurs', name: 'Coiffeurs', icon: <FaUserTie /> },
    { path: '/clients', name: 'Clients', icon: <FaUsers /> },
    { path: '/disponibilites', name: 'Disponibilités', icon: <FaClock /> },
    { path: '/services', name: 'Services', icon: <FaList /> }
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = 'http://localhost:5173';
  };

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">BarberOne</h1>
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 ${location.pathname === item.path ? 'bg-gray-700' : ''
                  }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 w-full text-left"
            >
              <FaSignOutAlt />
              <span>Déconnexion</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;