import React from 'react';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';

const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
        <Navbar />
      </div>

      <div className="flex flex-1 pt-16"> {/* Add top padding to account for navbar height */}
        {/* Fixed Sidebar */}
        <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;