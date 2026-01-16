import z from "zod";
import type { Process } from "../../types/process.types";
import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const processSchema = z.object({
  name: z.string().min(3, 'El nombre debe de tener al menos 3 caracteres'),
  code: z.string().min(3, 'El nombre debe de tener al menos 3 caracteres'),
})

interface ProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  process: Process | null;
  onSubmit: (data: any) => void;
}

const ProcessModal: React.FC<ProcessModalProps> = ({
  isOpen,
  onClose,
  process,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(processSchema),
    defaultValues: {
      name: '',
      code: '',
    },
  });

  useEffect(() => {
    if (process) {
      setValue('name', process.name);
      setValue('code', process.code);
    } else {
      reset()
    }
  }, [process, setValue, reset])

  if (!isOpen) return null;

  const handleFormSubmit = (data: any) => {
    const submitData = {
      ...data,
    };
    onSubmit(submitData);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

        {/* Fondo oscuro con z-index más bajo */}
        <div className="fixed inset-0 bg-gray-500 opacity-75 transition-opacity" />

        {/* 🔧 Contenedor del modal con z-index más alto */}
        <div
          className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 relative z-10"
          onClick={handleModalClick} // 🔧 Prevenir propagación del click
        >

          {/* Botón de cerrar */}
          <div className="absolute top-4 right-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 z-20"
              onClick={onClose}
            >
              <span className="sr-only">Cerrar</span>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Contenido del modal */}
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {process ? 'Editar Proceso' : 'Nuevo Proceso'}
              </h3>

              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                {/* Name field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nombre de Proceso
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                {/* Code field */}
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                    Codigo de Proceso
                  </label>
                  <input
                    type="text"
                    {...register('code')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.code && (
                    <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {process ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={onClose}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProcessModal