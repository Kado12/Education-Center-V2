import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface UserFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  isActive?: boolean;
  onIsActiveChange: (value: boolean | undefined) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  search,
  onSearchChange,
  isActive,
  onIsActiveChange,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Búsqueda */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Buscar usuario
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className='text-gray-700 w-5 h-5' />
            </div>
            <input
              type="text"
              id="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Nombre de usuario o email..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Filtro por estado */}
        <div className="sm:w-48">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FunnelIcon className="text-gray-400 w-5 h-5" />
            </div>
            <select
              id="status"
              value={isActive === undefined ? '' : isActive.toString()}
              onChange={(e) => onIsActiveChange(e.target.value === '' ? undefined : e.target.value === 'true')}
              className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
            >
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFilters;