import { NavLink } from 'react-router-dom'
import {
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  ScissorsIcon,
  WrenchScrewdriverIcon,
  Cog6ToothIcon,
  ClockIcon,
  BuildingStorefrontIcon,
  UserIcon
} from '@heroicons/react/24/outline'

const Sidebar = () => {
  const menuItems = [
    {
      title: 'Principal',
      items: [
        { name: 'Dashboard', icon: ChartBarIcon, path: '/' },
        { name: 'Réservations', icon: CalendarIcon, path: '/reservations' },
        { name: 'Horaires', icon: ClockIcon, path: '/horaires' }
      ]
    },
    {
      title: 'Gestion',
      items: [
        { name: 'Clients', icon: UserGroupIcon, path: '/clients' },
        { name: 'Coiffeurs', icon: ScissorsIcon, path: '/coiffeurs' },
        { name: 'Services', icon: WrenchScrewdriverIcon, path: '/services' },
        { name: 'Salons', icon: BuildingStorefrontIcon, path: '/salons' }
      ]
    },
    {
      title: 'Administration',
      items: [
        { name: 'Mon Profil', icon: UserIcon, path: '/profile' },
        { name: 'Paramètres', icon: Cog6ToothIcon, path: '/settings' }
      ]
    }
  ]

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-gray-800">
          {/* Logo */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
            <img
              className="h-8 w-auto"
              src="/logo.png"
              alt="BarberOne"
            />
            <span className="ml-2 text-white text-lg font-semibold">BarberOne</span>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-4">
              {menuItems.map((section) => (
                <div key={section.title}>
                  <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {section.title}
                  </h3>
                  <div className="mt-2 space-y-1">
                    {section.items.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                          `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                            isActive
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          }`
                        }
                      >
                        <item.icon className="mr-3 flex-shrink-0 h-6 w-6" />
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar