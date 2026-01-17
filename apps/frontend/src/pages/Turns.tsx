import { useState } from "react"
import type { CreateTurnDto, Turn } from "../types/turn.types"
import { useTurns } from "../hooks/useTurns"
import toast from "react-hot-toast"
import { PlusIcon } from "@heroicons/react/24/outline"
import TurnFilters from "../components/turns/TurnFilters"
import TurnTable from "../components/turns/TurnTable"
import TurnModal from "../components/turns/TurnModal"

const Turns: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTurn, setEditingTurn] = useState<any>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined)
  const [selectedTurn, setSelectedTurn] = useState<Turn | null>(null)

  const {
    turns,
    total,
    totalPages,
    currentPage,

    isLoading,
    error,
    isPlaceholderData,

    createTurn,
    isCreating,
    updateTurn,
    isUpdating,
    toggleTurnStatus,
    isToggling,
    deleteTurn,
    isDeleting,
  } = useTurns({ page, search, isActive })

  const handleCreateTurn = async (turnData: CreateTurnDto) => {
    try {
      await createTurn(turnData)
      toast.success('Turno creado exitosamente')
      setIsModalOpen(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear el turno')
    }
  }

  const handleUpdateTurn = async (turnData: any) => {
    try {
      await updateTurn({ id: editingTurn.id, data: turnData })
      toast.success('Turno editado exitosamente')
      setEditingTurn(null)
      setIsModalOpen(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar el turno')
    }
  }

  const handleToggleStatus = async (turn: any) => {
    try {
      await toggleTurnStatus(turn.id);
      toast.success(`Turno ${turn.isActive ? 'desactivado' : 'activado'} exitosamente`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cambiar estado');
    }
  };

  const handleDeleteTurn = async (turnId: number) => {
    if (window.confirm('¿Está seguro de eliminar este turno?')) {
      try {
        await deleteTurn(turnId);
        toast.success('Turno eliminado exitosamente');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error al eliminar turno');
      }
    }
  };

  const openEditModal = (turn: any) => {
    setEditingTurn(turn);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingTurn(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTurn(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Gestión de Turnos
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Administrar turnos del sistema
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Nuevo Turno
            </button>
          </div>
        </div>

        {/* Filtros */}
        <TurnFilters
          search={search}
          onSearchChange={setSearch}
          isActive={isActive}
          onIsActiveChange={setIsActive}
        />

        {/* Tabla de turnos */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <TurnTable
            turns={turns}
            isLoading={isLoading}
            onEdit={openEditModal}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteTurn}
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
        <TurnModal
          isOpen={isModalOpen}
          onClose={closeModal}
          turn={editingTurn}
          onSubmit={editingTurn ? handleUpdateTurn : handleCreateTurn}
        />
      </div>
    </div>
  )
}

export default Turns