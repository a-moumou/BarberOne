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

        console.log('Réservations récentes:', recentReservations);
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
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsConfig.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Activité récente */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Activité récente</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {activity.userId 
                        ? `${activity.userId.first_name} ${activity.userId.last_name}` 
                        : activity.userInfo?.name || 'Client inconnu'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.selectedService?.name || 'Service non spécifié'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(activity.selectedDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Confirmé
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucune activité récente
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 