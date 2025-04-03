import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'

const Reservations = () => {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/reservations`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json()
      console.log('Réservations reçues:', data) // Pour le débogage
      setReservations(data)
    } catch (error) {
      console.error('Erreur:', error) // Pour le débogage
      toast.error('Erreur lors du chargement des réservations')
    } finally {
      setLoading(false)
    }
  }

  const updateReservationStatus = async (id, status) => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ status })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      toast.success('Statut mis à jour')
      fetchReservations()
    } catch (error) {
      console.error('Erreur:', error) // Pour le débogage
      toast.error('Erreur lors de la mise à jour')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  }

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-2xl font-semibold text-gray-900">Réservations</h2>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Ajouter une réservation
          </button>
        </div>
      </div>

      {reservations.length === 0 ? (
        <div className="text-center mt-6">
          <p className="text-gray-500">Aucune réservation trouvée</p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Client</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Service</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Heure</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Statut</th>
                      <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {reservations.map((reservation) => (
                      <tr key={reservation._id}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {reservation.userInfo?.name || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {reservation.selectedService?.name || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {new Date(reservation.selectedDate).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {reservation.selectedTime}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <select
                            value={reservation.status}
                            onChange={(e) => updateReservationStatus(reservation._id, e.target.value)}
                            className="rounded-md border-gray-300 text-sm"
                          >
                            <option value="En attente">En attente</option>
                            <option value="Confirmé">Confirmé</option>
                            <option value="Annulé">Annulé</option>
                            <option value="Terminé">Terminé</option>
                          </select>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => updateReservationStatus(reservation._id, 'Annulé')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Annuler
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reservations 