import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { XMarkIcon, KeyIcon } from '@heroicons/react/24/outline';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Debe contener mayúscula, minúscula y número'),
  confirmPassword: z.string().min(1, 'Confirme la contraseña'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  onSubmit: (data: { currentPassword: string; newPassword: string }) => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  username,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  if (!isOpen) return null;

  const handleFormSubmit = (data: any) => {
    onSubmit({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    reset();
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

        {/* Fondo oscuro */}
        <div className="fixed inset-0 bg-gray-500 opacity-75 transition-opacity" />

        {/* Contenedor del modal */}
        <div
          className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6 relative z-10"
          onClick={handleModalClick}
        >

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <KeyIcon className="h-6 w-6 text-indigo-600 mr-2" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Cambiar Contraseña
              </h3>
            </div>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Información del usuario */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Usuario:</span> {username}
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Contraseña actual */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Contraseña Actual
              </label>
              <input
                type="password"
                {...register('currentPassword')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ingrese su contraseña actual"
              />
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
              )}
            </div>

            {/* Nueva contraseña */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                Nueva Contraseña
              </label>
              <input
                type="password"
                {...register('newPassword')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Mínimo 6 caracteres"
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                {...register('confirmPassword')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Repita la nueva contraseña"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Botones */}
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Actualizar Contraseña
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
  );
};

export default PasswordModal;