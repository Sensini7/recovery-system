import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
        <Navbar />
      </div>
      <main className="flex-1 mt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;