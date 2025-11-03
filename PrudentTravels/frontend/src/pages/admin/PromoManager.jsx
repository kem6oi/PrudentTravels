import React, { useEffect, useState } from 'react';
import { HiPlus } from 'react-icons/hi';
import Sidebar from '../../components/common/Sidebar';
import { SidebarProvider } from '../../contexts/SidebarContext';
import Navbar from '../../components/common/Navbar';
import Modal from '../../components/common/Modal';
import { useForm } from 'react-hook-form';
import api, { apiEndpoints } from '../../services/api';
import toast from 'react-hot-toast';

const PromoManager = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const response = await api.get(apiEndpoints.promos.getAll);
      setPromoCodes(response.data.data || []);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      await api.post(apiEndpoints.promos.create, data);
      toast.success('Promo code created successfully');
      setShowModal(false);
      reset();
      fetchPromoCodes();
    } catch (error) {
      toast.error('Failed to create promo code');
    }
  };

  return (
    <SidebarProvider>
    <div className="flex h-screen bg-sky-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar title="Promo Codes" />
        
        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Manage Promo Codes</h2>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <HiPlus />
              Add Promo Code
            </button>
          </div>

          <div className="card overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-sky-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {promoCodes.map((promo) => (
                  <tr key={promo.id}>
                    <td className="px-6 py-4 font-medium">{promo.code}</td>
                    <td className="px-6 py-4">
                      {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `$${promo.discountValue}`}
                    </td>
                    <td className="px-6 py-4 capitalize">{promo.discountType}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${promo.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {promo.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Promo Modal */}
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="Add Promo Code"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label">Promo Code</label>
                <input {...register('code', { required: true })} className="input-field" />
              </div>
              <div>
                <label className="label">Discount Value</label>
                <input {...register('discountValue', { required: true })} type="number" className="input-field" />
              </div>
              <div>
                <label className="label">Discount Type</label>
                <select {...register('discountType')} className="input-field">
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <button type="submit" className="w-full btn-primary">
                Create Promo Code
              </button>
            </form>
          </Modal>
        </main>
      </div>
    </div>
    </SidebarProvider>
  );
};

export default PromoManager;
