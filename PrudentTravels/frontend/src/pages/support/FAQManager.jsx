import React, { useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import Modal from '../../components/common/Modal';
import { HiPlus } from 'react-icons/hi';

const FAQManager = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex h-screen bg-sky-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar title="FAQ Manager" />
        
        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Manage FAQs</h2>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <HiPlus />
              Add FAQ
            </button>
          </div>

          <div className="card p-6">
            <p className="text-gray-600">FAQ management interface would go here.</p>
          </div>

          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="Add FAQ"
          >
            <form className="space-y-4">
              <div>
                <label className="label">Question</label>
                <input type="text" className="input-field" />
              </div>
              <div>
                <label className="label">Answer</label>
                <textarea rows="4" className="input-field resize-none" />
              </div>
              <button type="submit" className="w-full btn-primary">
                Add FAQ
              </button>
            </form>
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default FAQManager;
