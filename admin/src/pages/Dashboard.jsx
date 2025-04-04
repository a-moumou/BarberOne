import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaCalendar, FaCut } from 'react-icons/fa';
import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

const API_URL = 'http://localhost:5000';

const formatDate = (dateString) => {
  if (!dateString) return 'Date non spécifiée';
  const date = new Date(dateString);
  return isValid(date) ? format(date, "d MMMM yyyy 'à' HH:mm", { locale: fr }) : 'Date invalide';
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    reservations: 0,
    clients: 0,
    coiffeurs: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        if (!token) {
          setError('Veuillez vous connecter pour accéder au tableau de bord');
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const [reservationsRes, usersRes, hairdressersRes] = await Promise.all([
          axios.get(`${API_URL}/api/reservations`, config),
          axios.get(`${API_URL}/api/users`, config),
          axios.get(`${API_URL}/api/hairdressers`, config)
        ]);

        console.log('Données reçues:', {
          reservations: reservationsRes.data,
          users: usersRes.data,
          hairdressers: hairdressersRes.data
        });

        setStats({
          reservations: reservationsRes.data.length,
          clients: usersRes.data.length,
          coiffeurs: hairdressersRes.data.length
        });

        // Récupérer les 5 dernières réservations
        const recentReservations = reservationsRes.data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        setRecentActivity(recentReservations);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError(error.response?.data?.message || 'Erreur lors du chargement des données');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsConfig = [
    {
      name: 'Réservations totales',
      value: stats.reservations,
      icon: FaCalendar,
      color: 'text-blue-500'
    },
    {
      name: 'Clients actifs',
      value: stats.clients,
      icon: FaUsers,
      color: 'text-green-500'
    },
    {
      name: 'Coiffeurs',
      value: stats.coiffeurs,
      icon: FaCut,
      color: 'text-purple-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900">Tableau de bord</h2>

      {/* Stats Grid */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statsConfig.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-5 flex-1">
                  <p className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900">Activité récente</h3>
        <div className="mt-4 bg-white shadow rounded-lg">
          <div className="p-6">
            <ul className="divide-y divide-gray-200">
              {recentActivity.map((activity, index) => (
                <li key={index} className="py-4">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      Réservation - {activity.client?.name || 'Client'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(activity.date)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Service: {activity.service?.name || 'Non spécifié'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 