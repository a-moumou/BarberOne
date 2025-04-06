import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Salons = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSalon, setNewSalon] = useState({
    name: '',
    address: '',
    phone: '',
    openingHours: {
      monday: { open: '09:00', close: '19:00' },
      tuesday: { open: '09:00', close: '19:00' },
      wednesday: { open: '09:00', close: '19:00' },
      thursday: { open: '09:00', close: '19:00' },
      friday: { open: '09:00', close: '19:00' },
      saturday: { open: '09:00', close: '19:00' },
      sunday: { open: '', close: '' }
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      toast.error('Veuillez vous connecter');
      navigate('/loginAdmin');
      return;
    }
    fetchSalons();
  }, [navigate]);

  const fetchSalons = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get('http://localhost:5000/api/salons', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSalons(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expirée, veuillez vous reconnecter');
        navigate('/loginAdmin');
      } else {
        toast.error('Erreur lors de la récupération des salons');
      }
      setLoading(false);
    }
  };

  const handleAddSalon = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(
        'http://localhost:5000/api/salons',
        newSalon,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success('Salon ajouté avec succès');
      setShowAddModal(false);
      setNewSalon({
        name: '',
        address: '',
        phone: '',
        openingHours: {
          monday: { open: '09:00', close: '19:00' },
          tuesday: { open: '09:00', close: '19:00' },
          wednesday: { open: '09:00', close: '19:00' },
          thursday: { open: '09:00', close: '19:00' },
          friday: { open: '09:00', close: '19:00' },
          saturday: { open: '09:00', close: '19:00' },
          sunday: { open: '', close: '' }
        }
      });
      fetchSalons();
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expirée, veuillez vous reconnecter');
        navigate('/loginAdmin');
      } else {
        toast.error('Erreur lors de l\'ajout du salon');
      }
    }
  };

  const handleDeleteSalon = async (salonId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce salon ?')) {
      try {
        const token = localStorage.getItem('admin_token');
        await axios.delete(`http://localhost:5000/api/salons/${salonId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        toast.success('Salon supprimé avec succès');
        fetchSalons();
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error('Session expirée, veuillez vous reconnecter');
          navigate('/loginAdmin');
        } else {
          toast.error('Erreur lors de la suppression du salon');
        }
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold">Gestion des Salons</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Ajouter un salon
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Adresse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salons.map((salon) => (
                <tr key={salon._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {salon.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {salon.address}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {salon.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDeleteSalon(salon._id)}
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

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Ajouter un salon</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  value={newSalon.name}
                  onChange={(e) => setNewSalon({ ...newSalon, name: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom du salon"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <input
                  type="text"
                  value={newSalon.address}
                  onChange={(e) => setNewSalon({ ...newSalon, address: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Adresse du salon"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={newSalon.phone}
                  onChange={(e) => setNewSalon({ ...newSalon, phone: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Numéro de téléphone"
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddSalon}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Salons; 