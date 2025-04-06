import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Disponibilites = () => {
    const [coiffeurs, setCoiffeurs] = useState([]);
    const [salons, setSalons] = useState([]);
    const [selectedSalon, setSelectedSalon] = useState('');
    const [loading, setLoading] = useState(true);
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
            console.log('Salons reçus:', response.data);
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
            console.log('Coiffeurs reçus:', response.data);
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
                <h1 className="text-2xl sm:text-3xl font-bold">Gestion des Disponibilités</h1>
                <div className="w-full sm:w-auto">
                    <select
                        value={selectedSalon}
                        onChange={(e) => setSelectedSalon(e.target.value)}
                        className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tous les salons</option>
                        {salons.map((salon) => (
                            <option key={salon._id} value={salon._id}>
                                {salon.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Coiffeur
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Salon
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Statut
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
                                            {coiffeur.salonId?.name || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                coiffeur.isAvailable
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {coiffeur.isAvailable ? 'Disponible' : 'Indisponible'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button
                                            onClick={() => toggleAvailability(coiffeur._id, coiffeur.isAvailable)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            {coiffeur.isAvailable ? 'Rendre indisponible' : 'Rendre disponible'}
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

export default Disponibilites; 