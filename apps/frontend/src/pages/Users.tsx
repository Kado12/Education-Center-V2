import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import UserModal from '../components/users/UserModal';
import UserTable from '../components/users/UserTable';
import UserFilters from '../components/users/UserFilters';
import PasswordModal from '../components/users/PasswordModal';
import { PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import type { User } from '../types/auth.types';
import { userService } from '../services/user.service';
import type { CreateUserDto } from '../types/user.types';

const Users: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const {
    users,
    total,
    totalPages,
    currentPage,
    roles,

    // ✅ ACTUALIZADO: isLoading -> isLoading
    isLoading,
    rolesLoading,
    error,
    isPlaceholderData,

    // ✅ ACTUALIZADO: isCreating -> isCreating
    createUser,
    isCreating,

    updateUser,
    isUpdating,

    toggleUserStatus,
    isToggling,

    deleteUser,
    isDeleting,
  } = useUsers({ page, search, isActive });

  const handleCreateUser = async (userData: CreateUserDto) => {
    try {
      await createUser(userData);
      toast.success('Usuario creado exitosamente');
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear usuario');
    }
  };

  const handleUpdateUser = async (userData: any) => {
    try {
      await updateUser({ id: editingUser.id, data: userData });
      toast.success('Usuario actualizado exitosamente');
      setEditingUser(null);
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar usuario');
    }
  };

  const handleToggleStatus = async (user: any) => {
    try {
      await toggleUserStatus(user.id);
      toast.success(`Usuario ${user.isActive ? 'desactivado' : 'activado'} exitosamente`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cambiar estado');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        await deleteUser(userId);
        toast.success('Usuario eliminado exitosamente');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error al eliminar usuario');
      }
    }
  };

  const handleChangePassword = (user: User) => {
    setSelectedUser(user);
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSubmit = async (passwordData: { currentPassword: string; newPassword: string }) => {
    try {
      await userService.updatePassword(selectedUser!.id, passwordData.currentPassword, passwordData.newPassword);
      toast.success('Contraseña actualizada exitosamente');
      setIsPasswordModalOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar contraseña');
    }
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Gestión de Usuarios
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Administrar usuarios del sistema y sus roles
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Nuevo Usuario
            </button>
          </div>
        </div>

        {/* Filtros */}
        <UserFilters
          search={search}
          onSearchChange={setSearch}
          isActive={isActive}
          onIsActiveChange={setIsActive}
        />

        {/* Tabla de usuarios */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <UserTable
            users={users}
            roles={roles}
            isLoading={isLoading}
            onEdit={openEditModal}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteUser}
            onChangePassword={handleChangePassword}
          />
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6">
            <div className="flex justify-between flex-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <div className="flex items-center">
                <span className="text-sm text-gray-700">
                  Página <span className="font-medium">{currentPage}</span> de{' '}
                  <span className="font-medium">{totalPages}</span>
                </span>
              </div>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Modal */}
        <UserModal
          isOpen={isModalOpen}
          onClose={closeModal}
          user={editingUser}
          roles={roles}
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
        />
      </div>

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setSelectedUser(null);
        }}
        username={selectedUser?.username || ''}
        onSubmit={handlePasswordSubmit}
      />
    </div>
  );
};

export default Users;