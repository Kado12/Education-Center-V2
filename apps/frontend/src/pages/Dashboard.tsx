import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  UsersIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { useProcesses } from '../hooks/useProcesses';
import { useTurns } from '../hooks/useTurns';
import { useSedes } from '../hooks/useSedes';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const processes = useProcesses().processes;
  const activeProcesses = processes.filter((process) => process.isActive === true);
  const turns = useTurns().turns;
  const activeTurns = turns.filter((turn) => turn.isActive === true);
  const sedes = useSedes().sedes;
  const activeSedes = sedes.filter((sede) => sede.isActive === true);

  // Stats de ejemplo (más tarde conectaremos con API)
  const stats = [
    {
      name: 'Total Estudiantes',
      value: '0',
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      onClick: () => navigate('/students')
    },
    {
      name: 'Total Sedes',
      value: activeSedes.length.toString(),
      icon: BuildingOfficeIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      onClick: () => navigate('/sedes')
    },
    {
      name: 'Procesos Activos',
      value: activeProcesses.length.toString(),
      icon: DocumentTextIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      onClick: () => navigate('/processes'),
    },
    {
      name: 'Ingresos del Mes',
      value: '$0.00',
      icon: CurrencyDollarIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      onClick: () => navigate('/payments')
    },
    {
      name: 'Turnos Activos',
      value: activeTurns.length.toString(),
      icon: ChartBarIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      onClick: () => navigate('/turns')
    }
  ];

  const quickActions = [
    {
      name: 'Nuevo Estudiante',
      icon: UsersIcon,
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => navigate('/students')
    },
    {
      name: 'Gestión Usuarios',
      icon: UsersIcon,
      color: 'bg-orange-600 hover:bg-orange-700',
      onClick: () => navigate('/users')
    },
    {
      name: 'Ver Procesos de Insripción',
      icon: DocumentTextIcon,
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => navigate('/processes')
    },
    {
      name: 'Ver Turnos',
      icon: AcademicCapIcon,
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => navigate('/turns')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, {user?.username}!
        </h1>
        <p className="mt-2 text-gray-600">
          Panel de control del sistema de inscripción
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer"
            onClick={stat.onClick}
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`${stat.bgColor} rounded-md p-3`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
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

      {/* Acciones Rápidas */}
      <div>
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

      {/* Actividad Reciente Placeholder */}
      <div>
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
  );
};

export default Dashboard;