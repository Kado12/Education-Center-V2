import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar - Altura completa y fijo */}
        <Sidebar />

        {/* Contenido principal - Scroll independiente */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Contenedor scrollable del contenido */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;