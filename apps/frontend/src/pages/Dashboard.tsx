import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UsersIcon, BuildingOfficeIcon, AcademicCapIcon, CurrencyDollarIcon, PlusIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const stats = [
    {
      name: 'Total Estudiantes',
      value: '0',
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Total Sedes',
      value: '0',
      icon: BuildingOfficeIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Procesos Activos',
      value: '0',
      icon: AcademicCapIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Ingresos del Mes',
      value: 'S/ 0.00',
      icon: CurrencyDollarIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  const quickActions = [
    {
      name: 'Nuevo Estudiante',
      icon: PlusIcon,
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => console.log('Nuevo estudiante')
    },
    {
      name: 'Ver Inscripciones',
      icon: DocumentTextIcon,
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => console.log('Ver inscripciones')
    },
    {
      name: 'Reportes',
      icon: ChartBarIcon,
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => console.log('Reportes')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AcademicCapIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold text-gray-900">
                  Sistema de Inscripción
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-600">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user?.username}</p>
                  <p className="text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`${stat.bgColor} rounded-md p-3`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {stat.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {quickActions.map((action) => (
                <button
                  key={action.name}
                  onClick={action.onClick}
                  className={`${action.color} text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2`}
                >
                  <action.icon className="h-5 w-5" />
                  <span>{action.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity Placeholder */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Actividad Reciente</h2>
            <div className="bg-white shadow rounded-lg">
              <div className="p-6 text-center text-gray-500">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p>No hay actividad reciente para mostrar</p>
                <p className="text-sm mt-2">Las últimas inscripciones aparecerán aquí</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;