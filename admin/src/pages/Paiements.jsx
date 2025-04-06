import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Paiements = () => {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPaiement, setSelectedPaiement] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchPaiements();
  }, []);

  const fetchPaiements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/paiements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPaiements(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors de la récupération des paiements');
      setLoading(false);
      toast.error('Erreur lors de la récupération des paiements');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Gestion des Paiements</h1>

      {/* Modal des détails */}
      {showDetailsModal && selectedPaiement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Détails du Paiement</h2>
            <div className="space-y-2">
              <p><strong>Client:</strong> {selectedPaiement.clientName}</p>
              <p><strong>Date:</strong> {formatDate(selectedPaiement.date)}</p>
              <p><strong>Montant:</strong> {formatPrice(selectedPaiement.montant)}</p>
              <p><strong>Méthode:</strong> {selectedPaiement.methode}</p>
              <p><strong>Statut:</strong> {selectedPaiement.statut}</p>
              <p><strong>Référence:</strong> {selectedPaiement.reference}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des paiements */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paiements.map((paiement) => (
                <tr key={paiement._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{paiement.clientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(paiement.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatPrice(paiement.montant)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{paiement.methode}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      paiement.statut === 'réussi' ? 'bg-green-100 text-green-800' :
                      paiement.statut === 'en attente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {paiement.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedPaiement(paiement);
                        setShowDetailsModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Détails
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

export default Paiements; 