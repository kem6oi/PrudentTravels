const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { isSupport, isAdmin } = require('../middleware/role.middleware');
const { validateSupportTicket } = require('../middleware/validation.middleware');

// Placeholder controllers - to be implemented
const supportController = {
  createTicket: async (req, res) => {
    res.json({ success: true, message: 'Ticket created' });
  },
  getTickets: async (req, res) => {
    res.json({ success: true, message: 'Tickets fetched' });
  },
  getTicket: async (req, res) => {
    res.json({ success: true, message: 'Ticket fetched' });
  },
  updateTicket: async (req, res) => {
    res.json({ success: true, message: 'Ticket updated' });
  },
  assignTicket: async (req, res) => {
    res.json({ success: true, message: 'Ticket assigned' });
  },
  getUserTickets: async (req, res) => {
    res.json({ success: true, message: 'User tickets fetched' });
  }
};

// All routes require authentication
router.use(protect);

// User routes
router.post('/tickets', validateSupportTicket, supportController.createTicket);
router.get('/my-tickets', supportController.getUserTickets);

// Support staff routes
router.use(isSupport);
router.get('/tickets', supportController.getTickets);
router.get('/tickets/:id', supportController.getTicket);
router.put('/tickets/:id', supportController.updateTicket);
router.post('/tickets/:id/assign', supportController.assignTicket);

module.exports = router;