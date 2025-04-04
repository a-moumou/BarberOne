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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestion des Coiffeurs</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedSalon}
            onChange={(e) => setSelectedSalon(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Ajouter un coiffeur
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
              <tr key={coiffeur._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {coiffeur.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {coiffeur.salonId?.name || 'Non assigné'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${coiffeur.isAvailable
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {coiffeur.isAvailable ? 'Disponible' : 'Indisponible'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => toggleAvailability(coiffeur._id, coiffeur.isAvailable)}
                    className={`${coiffeur.isAvailable
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                      } text-white px-3 py-1 rounded`}
                  >
                    {coiffeur.isAvailable ? 'Marquer indisponible' : 'Marquer disponible'}
                  </button>
                  <button
                    onClick={() => handleDeleteCoiffeur(coiffeur._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal d'ajout de coiffeur */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Ajouter un coiffeur</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nom
              </label>
              <input
                type="text"
                value={newCoiffeur.name}
                onChange={(e) => setNewCoiffeur({ ...newCoiffeur, name: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Nom du coiffeur"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Salon
              </label>
              <select
                value={newCoiffeur.salonId}
                onChange={(e) => setNewCoiffeur({ ...newCoiffeur, salonId: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Sélectionner un salon</option>
                {salons.map((salon) => (
                  <option key={salon._id} value={salon._id}>
                    {salon.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Annuler
              </button>
              <button
                onClick={handleAddCoiffeur}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coiffeurs; 