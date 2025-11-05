const { PaymentMethod } = require('../models');
const { successResponse, errorResponse, createdResponse } = require('../utils/response');

/**
 * Get all payment methods (optionally filtered by country)
 */
const getAllPaymentMethods = async (req, res) => {
  try {
    const { country, isActive } = req.query;

    const whereClause = {};
    if (country) whereClause.country = country;
    if (isActive !== undefined) whereClause.isActive = isActive === 'true';

    const paymentMethods = await PaymentMethod.findAll({
      where: whereClause,
      order: [['displayOrder', 'ASC'], ['createdAt', 'DESC']]
    });

    return successResponse(res, paymentMethods, 'Payment methods fetched successfully');
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return errorResponse(res, 'Error fetching payment methods', 500);
  }
};

/**
 * Get payment methods by country (public endpoint for users)
 */
const getPaymentMethodsByCountry = async (req, res) => {
  try {
    const { country } = req.params;

    const paymentMethods = await PaymentMethod.findAll({
      where: {
        country,
        isActive: true
      },
      order: [['displayOrder', 'ASC']],
      attributes: [
        'id',
        'country',
        'methodType',
        'providerName',
        'accountName',
        'accountNumber',
        'bankName',
        'branchName',
        'instructions',
        'currency',
        'minAmount',
        'maxAmount',
        'processingTime',
        'logo'
      ]
    });

    return successResponse(res, paymentMethods, 'Payment methods fetched successfully');
  } catch (error) {
    console.error('Error fetching payment methods by country:', error);
    return errorResponse(res, 'Error fetching payment methods', 500);
  }
};

/**
 * Get available countries
 */
const getAvailableCountries = async (req, res) => {
  try {
    const countries = await PaymentMethod.findAll({
      where: { isActive: true },
      attributes: ['country'],
      group: ['country'],
      raw: true
    });

    const countryList = countries.map(c => c.country).sort();

    return successResponse(res, countryList, 'Available countries fetched successfully');
  } catch (error) {
    console.error('Error fetching available countries:', error);
    return errorResponse(res, 'Error fetching countries', 500);
  }
};

/**
 * Get payment method by ID
 */
const getPaymentMethodById = async (req, res) => {
  try {
    const { id } = req.params;

    const paymentMethod = await PaymentMethod.findByPk(id);

    if (!paymentMethod) {
      return errorResponse(res, 'Payment method not found', 404);
    }

    return successResponse(res, paymentMethod, 'Payment method fetched successfully');
  } catch (error) {
    console.error('Error fetching payment method:', error);
    return errorResponse(res, 'Error fetching payment method', 500);
  }
};

/**
 * Create new payment method (admin only)
 */
const createPaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.create(req.body);

    return createdResponse(res, paymentMethod, 'Payment method created successfully');
  } catch (error) {
    console.error('Error creating payment method:', error);
    return errorResponse(res, error.message || 'Error creating payment method', 400);
  }
};

/**
 * Update payment method (admin only)
 */
const updatePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;

    const paymentMethod = await PaymentMethod.findByPk(id);

    if (!paymentMethod) {
      return errorResponse(res, 'Payment method not found', 404);
    }

    await paymentMethod.update(req.body);

    return successResponse(res, paymentMethod, 'Payment method updated successfully');
  } catch (error) {
    console.error('Error updating payment method:', error);
    return errorResponse(res, error.message || 'Error updating payment method', 400);
  }
};

/**
 * Delete payment method (admin only)
 */
const deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;

    const paymentMethod = await PaymentMethod.findByPk(id);

    if (!paymentMethod) {
      return errorResponse(res, 'Payment method not found', 404);
    }

    await paymentMethod.destroy();

    return successResponse(res, null, 'Payment method deleted successfully');
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return errorResponse(res, 'Error deleting payment method', 500);
  }
};

module.exports = {
  getAllPaymentMethods,
  getPaymentMethodsByCountry,
  getAvailableCountries,
  getPaymentMethodById,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod
};
