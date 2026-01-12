import { AcademicCapIcon, Bars3Icon, BuildingOfficeIcon, ChartBarIcon, ChevronDownIcon, Cog6ToothIcon, CurrencyDollarIcon, DocumentTextIcon, HomeIcon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Usuarios',
    href: '/users',
    icon: UserIcon,
    roles: ['admin', 'secretary']
  },
  {
    name: 'Estudiantes',
    href: '/students',
    icon: AcademicCapIcon,
    roles: ['admin', 'secretary', 'teacher']
  },
  {
    name: 'Sedes',
    href: '/sedes',
    icon: BuildingOfficeIcon,
    roles: ['admin', 'secretary']
  },
  {
    name: 'Salones',
    href: '/salons',
    icon: BuildingOfficeIcon,
    roles: ['admin', 'secretary']
  },
  {
    name: 'Procesos',
    href: '/processes',
    icon: DocumentTextIcon,
    roles: ['admin', 'secretary']
  },
  {
    name: 'Pagos',
    href: '/payments',
    icon: CurrencyDollarIcon,
    roles: ['admin', 'secretary']
  },
  {
    name: 'Reportes',
    href: '/reports',
    icon: ChartBarIcon,
    roles: ['admin', 'secretary']
  },
  {
    name: 'Configuración',
    href: '/settings',
    icon: Cog6ToothIcon,
    roles: ['admin']
  }
];

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredNavigation = navigation.filter(item =>
    !item.roles || item.roles.includes(user?.role || '')
  );

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white shadow-lg">
      {/* Header del sidebar */}
      <div className="flex items-center justify-between h-16 px-4 bg-indigo-600 flex-shrink-0">
        <Link to="/dashboard" className="flex items-center">
          <AcademicCapIcon className="h-8 w-8 text-white" />
          <span className="ml-2 text-xl font-bold text-white">EduCenter</span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden p-2 rounded-md text-white hover:bg-indigo-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Navegación - Scrollable */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {filteredNavigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`
              flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
              ${isActive(item.href)
                ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-700'
                : 'text-gray-700 hover:bg-gray-100'
              }
            `}
            onClick={() => setIsSidebarOpen(false)}
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Footer con menú de usuario */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        {/* Menú de usuario aquí */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3 flex-1 text-left">
              <p className="text-sm font-medium text-gray-900">{user?.username}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <ChevronDownIcon className={`ml-2 h-4 w-4 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isUserMenuOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
              >
                <ArrowLeftOnRectangleIcon className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Botón móvil para abrir sidebar */}
      <div className="lg:hidden fixed top-0 left-0 z-50 bg-white shadow-md p-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      {/* Overlay para móvil */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar - Altura completa y posicionado correctamente */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0 lg:h-full
      `}>
        <SidebarContent />
      </div>
    </>
  );
};


export default Sidebar;