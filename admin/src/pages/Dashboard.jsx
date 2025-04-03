const Dashboard = () => {
  const stats = [
    { name: 'Réservations totales', value: '156' },
    { name: 'Clients actifs', value: '89' },
    { name: 'Coiffeurs', value: '5' },
    { name: 'Revenu mensuel', value: '3,250€' }
  ]

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900">Tableau de bord</h2>
      
      {/* Stats Grid */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-1">
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
              <li className="py-4">Nouvelle réservation - Jean Dupont</li>
              <li className="py-4">Annulation - Marie Martin</li>
              <li className="py-4">Nouveau client inscrit - Pierre Durant</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 