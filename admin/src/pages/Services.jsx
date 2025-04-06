import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    price: '',
    duration: '30'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      toast.error('Veuillez vous connecter');
      navigate('/loginAdmin');
      return;
    }
    fetchServices();
  }, [navigate]);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get('http://localhost:5000/api/services', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setServices(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expirée, veuillez vous reconnecter');
        navigate('/loginAdmin');
      } else {
        toast.error('Erreur lors de la récupération des services');
      }
      setLoading(false);
    }
  };

  const handleAddService = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(
        'http://localhost:5000/api/services',
        {
          ...newService,
          price: parseFloat(newService.price),
          duration: parseInt(newService.duration)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success('Service ajouté avec succès');
      setShowAddModal(false);
      setNewService({
        name: '',
        price: '',
        duration: '30'
      });
      fetchServices();
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expirée, veuillez vous reconnecter');
        navigate('/loginAdmin');
      } else {
        toast.error('Erreur lors de l\'ajout du service');
      }
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      try {
        const token = localStorage.getItem('admin_token');
        await axios.delete(`http://localhost:5000/api/services/${serviceId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        toast.success('Service supprimé avec succès');
        fetchServices();
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error('Session expirée, veuillez vous reconnecter');
          navigate('/loginAdmin');
        } else {
          toast.error('Erreur lors de la suppression du service');
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
        <h1 className="text-2xl sm:text-3xl font-bold">Gestion des Services</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Ajouter un service
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
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durée
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {service.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {service.price} €
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {service.duration} min
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDeleteService(service._id)}
                      className="text-red-600 hover:text-red-900"
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Ajouter un service
              </h3>
              <form onSubmit={handleAddService} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={newService.name}
                    onChange={(e) =>
                      setNewService({ ...newService, name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Prix (€)
                  </label>
                  <input
                    type="number"
                    value={newService.price}
                    onChange={(e) =>
                      setNewService({ ...newService, price: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Durée (minutes)
                  </label>
                  <input
                    type="number"
                    value={newService.duration}
                    onChange={(e) =>
                      setNewService({ ...newService, duration: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services; 