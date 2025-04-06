import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Coiffeurs = () => {
  const [coiffeurs, setCoiffeurs] = useState([]);
  const [salons, setSalons] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCoiffeur, setNewCoiffeur] = useState({
    name: '',
    salonId: ''
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
    fetchCoiffeurs();
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
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expirée, veuillez vous reconnecter');
        navigate('/loginAdmin');
      } else {
        toast.error('Erreur lors de la récupération des salons');
      }
    }
  };

  const fetchCoiffeurs = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get('http://localhost:5000/api/hairdressers', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCoiffeurs(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expirée, veuillez vous reconnecter');
        navigate('/loginAdmin');
      } else {
        toast.error('Erreur lors de la récupération des coiffeurs');
      }
      setLoading(false);
    }
  };

  const handleAddCoiffeur = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(
        'http://localhost:5000/api/hairdressers',
        newCoiffeur,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success('Coiffeur ajouté avec succès');
      setShowAddModal(false);
      setNewCoiffeur({ name: '', salonId: '' });
      fetchCoiffeurs();
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expirée, veuillez vous reconnecter');
        navigate('/loginAdmin');
      } else {
        toast.error('Erreur lors de l\'ajout du coiffeur');
      }
    }
  };

  const handleDeleteCoiffeur = async (coiffeurId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce coiffeur ?')) {
      try {
        const token = localStorage.getItem('admin_token');
        await axios.delete(`http://localhost:5000/api/hairdressers/${coiffeurId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        toast.success('Coiffeur supprimé avec succès');
        fetchCoiffeurs();
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error('Session expirée, veuillez vous reconnecter');
          navigate('/loginAdmin');
        } else {
          toast.error('Erreur lors de la suppression du coiffeur');
        }
      }
    }
  };

  const toggleAvailability = async (coiffeurId, currentStatus) => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.put(
        `http://localhost:5000/api/hairdressers/${coiffeurId}/availability`,
        { isAvailable: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success('Disponibilité mise à jour');
      fetchCoiffeurs();
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expirée, veuillez vous reconnecter');
        navigate('/loginAdmin');
      } else {
        toast.error('Erreur lors de la mise à jour de la disponibilité');
      }
    }
  };

  const filteredCoiffeurs = selectedSalon
    ? coiffeurs.filter(coiffeur => coiffeur.salonId._id === selectedSalon)
    : coiffeurs;

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold">Gestion des Coiffeurs</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <select
            value={selectedSalon}
            onChange={(e) => setSelectedSalon(e.target.value)}
            className="w-full sm:w-auto border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les salons</option>
            {salons.map((salon) => (
              <option key={salon._id} value={salon._id}>
                {salon.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Ajouter un coiffeur
          </button>
        </div>
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
                  Salon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Disponibilité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCoiffeurs.map((coiffeur) => (
                <tr key={coiffeur._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {coiffeur.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {coiffeur.salonId?.name || 'Non assigné'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleAvailability(coiffeur._id, coiffeur.isAvailable)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        coiffeur.isAvailable
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {coiffeur.isAvailable ? 'Disponible' : 'Indisponible'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDeleteCoiffeur(coiffeur._id)}
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
            <h2 className="text-xl font-bold mb-4">Ajouter un coiffeur</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  value={newCoiffeur.name}
                  onChange={(e) => setNewCoiffeur({ ...newCoiffeur, name: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salon
                </label>
                <select
                  value={newCoiffeur.salonId}
                  onChange={(e) => setNewCoiffeur({ ...newCoiffeur, salonId: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner un salon</option>
                  {salons.map((salon) => (
                    <option key={salon._id} value={salon._id}>
                      {salon.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddCoiffeur}
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

export default Coiffeurs; 