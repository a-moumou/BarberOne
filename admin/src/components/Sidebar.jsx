import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaStore, FaUserTie, FaUsers, FaClock, FaList, FaSignOutAlt, FaCalendarAlt, FaBars, FaTimes } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Fermer la barre latérale lors du changement de route
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Fermer la barre latérale lors du redimensionnement de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <>
      {/* Bouton pour afficher/masquer la barre latérale sur mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay pour masquer le contenu lorsque la barre latérale est ouverte sur mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Barre latérale */}
      <div
        className={`bg-gray-800 text-white w-64 min-h-screen p-4 fixed md:static z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold">BarberOne</h1>
        </div>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 ${
                    location.pathname === item.path ? 'bg-gray-700' : ''
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
    </>
  );
};

export default Sidebar;