import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      toast.error('Veuillez vous connecter');
      navigate('/loginAdmin');
      return;
    }
    fetchReservations();
  }, [navigate]);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get('http://localhost:5000/api/reservations', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setReservations(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expirée, veuillez vous reconnecter');
        navigate('/loginAdmin');
      } else {
        toast.error('Erreur lors de la récupération des réservations');
      }
      setLoading(false);
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      try {
        const token = localStorage.getItem('admin_token');
        await axios.delete(`http://localhost:5000/api/reservations/${reservationId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        toast.success('Réservation supprimée avec succès');
        fetchReservations();
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error('Session expirée, veuillez vous reconnecter');
          navigate('/loginAdmin');
        } else {
          toast.error('Erreur lors de la suppression de la réservation');
        }
      }
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Date non définie';
      const date = parseISO(dateString);
      return format(date, 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
      return 'Date invalide';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold">Gestion des Réservations</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coiffeur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.map((reservation) => (
                <tr key={reservation._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {reservation.userInfo?.name || 'Client supprimé'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {reservation.selectedService?.name || 'Service supprimé'}
                      {reservation.selectedService?.price && (
                        <span className="ml-2 text-xs text-gray-400">
                          ({reservation.selectedService.price} €)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {reservation.selectedHairdresser?.name || 'Coiffeur supprimé'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {reservation.selectedSalon?.name || 'Salon supprimé'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(reservation.selectedDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {reservation.selectedTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDeleteReservation(reservation._id)}
                      className="text-red-600 hover:text-red-900 focus:outline-none"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reservations; 