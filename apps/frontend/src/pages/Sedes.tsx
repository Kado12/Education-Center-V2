import React from "react";
import { useState } from "react";
import type { CreateSedeDto, Sede } from "../types/sede.types";
import { useSedes } from "../hooks/useSedes";
import toast from "react-hot-toast";
import { PlusIcon } from "@heroicons/react/24/outline";
import SedeFilters from "../components/sedes/SedeFilters";
import SedeTable from "../components/sedes/SedeTable";
import SedeModal from "../components/sedes/SedeModal";

const Sedes: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSede, setEditingSede] = useState<any>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined)

  const {
    sedes,
    total,
    totalPages,
    currentPage,

    isLoading,
    error,
    isPlaceholderData,

    createSede,
    isCreating,
    updateSede,
    isUpdating,
    toggleSedeStatus,
    isToggling,
    deleteSede,
    isDeleting,
  } = useSedes({ page, search, isActive })

  const handleCreateSede = async (sedeData: CreateSedeDto) => {
    try {
      await createSede(sedeData)
      toast.success('Sede creada exitosamente')
      setIsModalOpen(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear sede')
    }
  }

  const handleUpdateSede = async (sedeData: any) => {
    try {
      await updateSede({ id: editingSede.id, data: sedeData })
      toast.success('Sede editada exitosamente')
      setEditingSede(null)
      setIsModalOpen(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar sede')
    }
  }

  const handleToggleStatus = async (sede: any) => {
    try {
      await toggleSedeStatus(sede.id);
      toast.success(`Sede ${sede.isActive ? 'desactivada' : 'activada'} exitosamente`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cambiar estado');
    }
  };

  const handleDeleteSede = async (sedeId: number) => {
    if (window.confirm('¿Está seguro de eliminar esta sede?')) {
      try {
        await deleteSede(sedeId);
        toast.success('Sede eliminada exitosamente');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error al eliminar sede');
      }
    }
  };

  const openEditModal = (sede: any) => {
    setEditingSede(sede);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingSede(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSede(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Gestión de Sedes
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Administrar sedes del sistema
              {total > 0 && (
                <span className="ml-2 text-gray-400">
                  ({total} sedes encontradas)
                </span>
              )}
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              onClick={openCreateModal}
              disabled={isCreating}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Nuevo Proceso
            </button>
          </div>
        </div>

        {/* Filtros */}
        <SedeFilters
          search={search}
          onSearchChange={setSearch}
          isActive={isActive}
          onIsActiveChange={setIsActive}
        />
        {/* Tabla de usuarios */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-800">
            {(error as any).response?.data?.message ?? 'Ocurrió un error al cargar las sedes.'}
          </div>
        )}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <SedeTable
            sedes={sedes}
            isLoading={isLoading}
            onEdit={openEditModal}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteSede}
            isToggling={isToggling}
            isDeleting={isDeleting}
          />
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6">
            <div className="flex justify-between flex-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1 || isPlaceholderData}
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
                disabled={page >= totalPages || isPlaceholderData}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Modal */}
        <SedeModal
          isOpen={isModalOpen}
          onClose={closeModal}
          sede={editingSede}
          onSubmit={editingSede ? handleUpdateSede : handleCreateSede}
          isSubmitting={editingSede ? isUpdating : isCreating}
        />
      </div>
    </div>
  )
}

export default Sedes
