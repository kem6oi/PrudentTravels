import React, { useEffect, useState } from 'react';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import Sidebar from '../../components/common/Sidebar';
import { SidebarProvider } from '../../contexts/SidebarContext';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PaymentMethodManager = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [formData, setFormData] = useState({
    country: '',
    methodType: 'mobile_money',
    providerName: '',
    accountName: '',
    accountNumber: '',
    bankName: '',
    branchName: '',
    swiftCode: '',
    routingNumber: '',
    instructions: '',
    currency: 'USD',
    minAmount: '',
    maxAmount: '',
    processingTime: '',
    logo: '',
    isActive: true,
    displayOrder: 0
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await api.get('/payment-methods');
      setPaymentMethods(response.data.data || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (method = null) => {
    if (method) {
      setEditingMethod(method);
      setFormData(method);
    } else {
      setEditingMethod(null);
      setFormData({
        country: '',
        methodType: 'mobile_money',
        providerName: '',
        accountName: '',
        accountNumber: '',
        bankName: '',
        branchName: '',
        swiftCode: '',
        routingNumber: '',
        instructions: '',
        currency: 'USD',
        minAmount: '',
        maxAmount: '',
        processingTime: '',
        logo: '',
        isActive: true,
        displayOrder: 0
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMethod(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingMethod) {
        await api.put(`/payment-methods/${editingMethod.id}`, formData);
        toast.success('Payment method updated successfully');
      } else {
        await api.post('/payment-methods', formData);
        toast.success('Payment method created successfully');
      }
      fetchPaymentMethods();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast.error(error.response?.data?.message || 'Failed to save payment method');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment method?')) {
      return;
    }

    try {
      await api.delete(`/payment-methods/${id}`);
      toast.success('Payment method deleted successfully');
      fetchPaymentMethods();
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error('Failed to delete payment method');
    }
  };

  const methodTypes = [
    { value: 'mobile_money', label: 'Mobile Money' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cash_deposit', label: 'Cash Deposit' },
    { value: 'online_banking', label: 'Online Banking' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'digital_wallet', label: 'Digital Wallet' },
    { value: 'other', label: 'Other' }
  ];

  const countries = ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Nigeria', 'Ghana', 'South Africa', 'USA', 'UK', 'Canada', 'Other'];

  // Group by country
  const groupedMethods = paymentMethods.reduce((acc, method) => {
    if (!acc[method.country]) {
      acc[method.country] = [];
    }
    acc[method.country].push(method);
    return acc;
  }, {});

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-sky-50">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Navbar title="Payment Methods" />

          <main className="p-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Method Management</h1>
                <p className="text-gray-600">Configure payment options available to customers by country</p>
              </div>
              <button
                onClick={() => handleOpenModal()}
                className="btn-primary flex items-center gap-2"
              >
                <HiPlus />
                Add Payment Method
              </button>
            </div>

            {/* Payment Methods */}
            {loading ? (
              <Loader />
            ) : Object.keys(groupedMethods).length === 0 ? (
              <div className="card p-12 text-center">
                <div className="text-6xl mb-4">💳</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No payment methods configured</h3>
                <p className="text-gray-600 mb-6">Add your first payment method to start accepting payments</p>
                <button onClick={() => handleOpenModal()} className="btn-primary">
                  Add Payment Method
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedMethods).map(([country, methods]) => (
                  <div key={country} className="card p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{country}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {methods.map((method) => (
                        <div key={method.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{method.providerName}</h3>
                              <p className="text-sm text-gray-600 capitalize">{method.methodType.replace('_', ' ')}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleOpenModal(method)}
                                className="text-primary-600 hover:text-primary-700"
                                title="Edit"
                              >
                                <HiPencil size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(method.id)}
                                className="text-red-600 hover:text-red-700"
                                title="Delete"
                              >
                                <HiTrash size={18} />
                              </button>
                            </div>
                          </div>
                          <div className="space-y-1 text-sm">
                            {method.accountName && (
                              <p><span className="text-gray-600">Account:</span> {method.accountName}</p>
                            )}
                            {method.accountNumber && (
                              <p><span className="text-gray-600">Number:</span> {method.accountNumber}</p>
                            )}
                            {method.bankName && (
                              <p><span className="text-gray-600">Bank:</span> {method.bankName}</p>
                            )}
                            <p className="text-gray-600">{method.currency}</p>
                            <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                              method.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {method.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modal */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
                      </h2>
                      <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                        <HiX size={24} />
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Country */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country *
                          </label>
                          <select
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            className="input-field"
                            required
                          >
                            <option value="">Select Country</option>
                            {countries.map((country) => (
                              <option key={country} value={country}>{country}</option>
                            ))}
                          </select>
                        </div>

                        {/* Method Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Payment Type *
                          </label>
                          <select
                            value={formData.methodType}
                            onChange={(e) => setFormData({ ...formData, methodType: e.target.value })}
                            className="input-field"
                            required
                          >
                            {methodTypes.map((type) => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Provider Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Provider Name *
                          </label>
                          <input
                            type="text"
                            value={formData.providerName}
                            onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                            className="input-field"
                            placeholder="e.g., M-Pesa, MTN Mobile Money"
                            required
                          />
                        </div>

                        {/* Account Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Account Name
                          </label>
                          <input
                            type="text"
                            value={formData.accountName}
                            onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                            className="input-field"
                            placeholder="Account holder or business name"
                          />
                        </div>

                        {/* Account Number */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Account Number / Phone
                          </label>
                          <input
                            type="text"
                            value={formData.accountNumber}
                            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                            className="input-field"
                            placeholder="Account number or phone number"
                          />
                        </div>

                        {/* Bank Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bank Name
                          </label>
                          <input
                            type="text"
                            value={formData.bankName}
                            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                            className="input-field"
                            placeholder="For bank transfers"
                          />
                        </div>

                        {/* Branch */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Branch Name
                          </label>
                          <input
                            type="text"
                            value={formData.branchName}
                            onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                            className="input-field"
                          />
                        </div>

                        {/* Currency */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Currency *
                          </label>
                          <input
                            type="text"
                            value={formData.currency}
                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            className="input-field"
                            placeholder="USD, KES, etc."
                            required
                          />
                        </div>

                        {/* Processing Time */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Processing Time
                          </label>
                          <input
                            type="text"
                            value={formData.processingTime}
                            onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
                            className="input-field"
                            placeholder="e.g., Instant, 1-3 business days"
                          />
                        </div>

                        {/* Display Order */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Display Order
                          </label>
                          <input
                            type="number"
                            value={formData.displayOrder}
                            onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                            className="input-field"
                          />
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.isActive}
                              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                              className="mr-2"
                            />
                            <span className="text-sm font-medium text-gray-700">Active</span>
                          </label>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Instructions
                        </label>
                        <textarea
                          value={formData.instructions}
                          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                          className="input-field"
                          rows="3"
                          placeholder="Additional instructions for customers making payment"
                        />
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-primary flex-1">
                          {editingMethod ? 'Update' : 'Create'} Payment Method
                        </button>
                        <button type="button" onClick={handleCloseModal} className="btn-outline flex-1">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PaymentMethodManager;
