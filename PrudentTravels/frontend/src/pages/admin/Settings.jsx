import React from 'react';
import Sidebar from '../../components/common/Sidebar';
import { SidebarProvider } from '../../contexts/SidebarContext';
import Navbar from '../../components/common/Navbar';

const Settings = () => {
  return (
    <SidebarProvider>
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar title="Admin Settings" />
        
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Settings</h1>
            <div className="card p-8">
              <p className="text-gray-600">Admin settings configuration would go here.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
    </SidebarProvider>
  );
};

export default Settings;
