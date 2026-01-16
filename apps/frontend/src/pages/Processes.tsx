import React from "react";
import { useState } from "react";
import type { CreateProcessDto, Process } from "../types/process.types";
import { useProcesses } from "../hooks/useProcesses";
import toast from "react-hot-toast";
import { PlusIcon } from "@heroicons/react/24/outline";
import ProcessFilters from "../components/processes/ProcessFilters";
import ProcessTable from "../components/processes/ProcessTable";
import ProcessModal from "../components/processes/ProcessModal";

const Processes: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProcess, setEditingProcess] = useState<any>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined)
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)

  const {
    processes,
    total,
    totalPages,
    currentPage,

    isLoading,
    error,
    isPlaceholderData,

    createProcess,
    isCreating,
    updateProcess,
    isUpdating,
    toggleProcessStatus,
    isToggling,
    deleteProcess,
    isDeleting,
  } = useProcesses({ page, search, isActive })

  const handleCreateProcess = async (processData: CreateProcessDto) => {
    try {
      const create = await createProcess(processData)
      console.log(create)
      toast.success('Proceso de Inscripción creado exitosamente')
      setIsModalOpen(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear proceso')
    }
  }

  const handleUpdateProcess = async (processData: any) => {
    try {
      const update = await updateProcess({ id: editingProcess.id, data: processData })
      console.log(update)
      toast.success('Proceso de Inscripcion editado exitosamente')
      setEditingProcess(null)
      setIsModalOpen(false)
    } catch (error: any) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Error al actualizar usuario')
    }
  }

  const handleToggleStatus = async (process: any) => {
    try {
      await toggleProcessStatus(process.id);
      toast.success(`Proceso ${process.isActive ? 'desactivado' : 'activado'} exitosamente`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cambiar estado');
    }
  };

  const handleDeleteProcess = async (processId: number) => {
    if (window.confirm('¿Está seguro de eliminar este proceso?')) {
      try {
        await deleteProcess(processId);
        toast.success('Proceso eliminado exitosamente');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error al eliminar proceso');
      }
    }
  };

  const openEditModal = (process: any) => {
    setEditingProcess(process);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingProcess(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProcess(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Gestión de Procesos
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Administrar procesos del sistema
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Nuevo Proceso
            </button>
          </div>
        </div>

        {/* Filtros */}
        <ProcessFilters
          search={search}
          onSearchChange={setSearch}
          isActive={isActive}
          onIsActiveChange={setIsActive}
        />

        {/* Tabla de usuarios */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ProcessTable
            processes={processes}
            isLoading={isLoading}
            onEdit={openEditModal}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteProcess}
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
        <ProcessModal
          isOpen={isModalOpen}
          onClose={closeModal}
          process={editingProcess}
          onSubmit={editingProcess ? handleUpdateProcess : handleCreateProcess}
        />
      </div>
    </div>
  )
}

export default Processes