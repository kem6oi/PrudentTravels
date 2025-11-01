const { SupportTicket, User, Booking } = require('../models');
const { TICKET_STATUS, TICKET_PRIORITY } = require('../config/constants');
const { successResponse, errorResponse, createdResponse, paginatedResponse } = require('../utils/response');
const { getPagination, getPagingData } = require('../utils/helpers');
const emailService = require('../services/email.service');

/**
 * Create support ticket
 */
const createTicket = async (req, res) => {
  try {
    const { subject, description, category, priority, bookingId } = req.body;

    // Verify booking if provided
    if (bookingId) {
      const booking = await Booking.findOne({
        where: { id: bookingId, userId: req.user.id }
      });

      if (!booking) {
        return errorResponse(res, 'Booking not found or does not belong to you', 404);
      }
    }

    const ticket = await SupportTicket.create({
      userId: req.user.id,
      subject,
      description,
      category: category || 'general',
      priority: priority || TICKET_PRIORITY.MEDIUM,
      bookingId,
      status: TICKET_STATUS.OPEN
    });

    // Send email notification
    await emailService.sendSupportTicketCreated(ticket, req.user);

    return createdResponse(res, ticket, 'Support ticket created successfully');
  } catch (error) {
    console.error('Error creating support ticket:', error);
    return errorResponse(res, 'Error creating support ticket', 500);
  }
};

/**
 * Get user tickets
 */
const getUserTickets = async (req, res) => {
  try {
    const { status, category } = req.query;

    const whereClause = { userId: req.user.id };

    if (status) {
      whereClause.status = status;
    }

    if (category) {
      whereClause.category = category;
    }

    const tickets = await SupportTicket.findAll({
      where: whereClause,
      include: [
        {
          model: Booking,
          as: 'booking',
          attributes: ['id', 'bookingNumber']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return successResponse(res, tickets, 'Tickets fetched successfully');
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    return errorResponse(res, 'Error fetching tickets', 500);
  }
};

/**
 * Get ticket by ID
 */
const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const whereClause = { id };

    // Non-admin users can only view their own tickets
    if (req.user.role !== 'admin' && req.user.role !== 'support') {
      whereClause.userId = req.user.id;
    }

    const ticket = await SupportTicket.findOne({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        },
        {
          model: Booking,
          as: 'booking',
          attributes: ['id', 'bookingNumber', 'status']
        },
        {
          model: User,
          as: 'assignedAgent',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    if (!ticket) {
      return errorResponse(res, 'Ticket not found', 404);
    }

    return successResponse(res, ticket, 'Ticket fetched successfully');
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return errorResponse(res, 'Error fetching ticket', 500);
  }
};

/**
 * Get all tickets (admin/support only)
 */
const getAllTickets = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, priority, assignedTo } = req.query;
    const { limit: queryLimit, offset } = getPagination(page, limit);

    const whereClause = {};

    if (status) whereClause.status = status;
    if (category) whereClause.category = category;
    if (priority) whereClause.priority = priority;
    if (assignedTo) whereClause.assignedTo = assignedTo;

    const data = await SupportTicket.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'assignedAgent',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      limit: queryLimit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const response = getPagingData(data, page, queryLimit);

    return paginatedResponse(
      res,
      response.items,
      {
        totalItems: response.totalItems,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        hasNextPage: response.hasNextPage,
        hasPrevPage: response.hasPrevPage,
        limit: queryLimit
      },
      'Tickets fetched successfully'
    );
  } catch (error) {
    console.error('Error fetching all tickets:', error);
    return errorResponse(res, 'Error fetching tickets', 500);
  }
};

/**
 * Update ticket status
 */
const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(TICKET_STATUS).includes(status)) {
      return errorResponse(res, 'Invalid status', 400);
    }

    const ticket = await SupportTicket.findByPk(id);

    if (!ticket) {
      return errorResponse(res, 'Ticket not found', 404);
    }

    const updates = { status };

    if (status === TICKET_STATUS.RESOLVED) {
      updates.resolvedAt = new Date();
    }

    if (status === TICKET_STATUS.CLOSED) {
      updates.closedAt = new Date();
    }

    await ticket.update(updates);

    return successResponse(res, ticket, 'Ticket status updated successfully');
  } catch (error) {
    console.error('Error updating ticket status:', error);
    return errorResponse(res, 'Error updating ticket status', 500);
  }
};

/**
 * Assign ticket to agent (admin/support only)
 */
const assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;

    if (!agentId) {
      return errorResponse(res, 'Agent ID is required', 400);
    }

    // Verify agent exists and has support or admin role
    const agent = await User.findByPk(agentId);

    if (!agent || (agent.role !== 'admin' && agent.role !== 'support')) {
      return errorResponse(res, 'Invalid agent', 400);
    }

    const ticket = await SupportTicket.findByPk(id);

    if (!ticket) {
      return errorResponse(res, 'Ticket not found', 404);
    }

    await ticket.update({
      assignedTo: agentId,
      status: TICKET_STATUS.IN_PROGRESS
    });

    return successResponse(res, ticket, 'Ticket assigned successfully');
  } catch (error) {
    console.error('Error assigning ticket:', error);
    return errorResponse(res, 'Error assigning ticket', 500);
  }
};

/**
 * Update ticket priority (admin/support only)
 */
const updateTicketPriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    if (!Object.values(TICKET_PRIORITY).includes(priority)) {
      return errorResponse(res, 'Invalid priority', 400);
    }

    const ticket = await SupportTicket.findByPk(id);

    if (!ticket) {
      return errorResponse(res, 'Ticket not found', 404);
    }

    await ticket.update({ priority });

    return successResponse(res, ticket, 'Ticket priority updated successfully');
  } catch (error) {
    console.error('Error updating ticket priority:', error);
    return errorResponse(res, 'Error updating ticket priority', 500);
  }
};

/**
 * Add internal notes (admin/support only)
 */
const addInternalNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    if (!notes) {
      return errorResponse(res, 'Notes are required', 400);
    }

    const ticket = await SupportTicket.findByPk(id);

    if (!ticket) {
      return errorResponse(res, 'Ticket not found', 404);
    }

    await ticket.update({ internalNotes: notes });

    return successResponse(res, ticket, 'Internal notes added successfully');
  } catch (error) {
    console.error('Error adding internal notes:', error);
    return errorResponse(res, 'Error adding internal notes', 500);
  }
};

/**
 * Rate ticket resolution
 */
const rateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return errorResponse(res, 'Rating must be between 1 and 5', 400);
    }

    const ticket = await SupportTicket.findOne({
      where: { id, userId: req.user.id }
    });

    if (!ticket) {
      return errorResponse(res, 'Ticket not found', 404);
    }

    if (ticket.status !== TICKET_STATUS.RESOLVED && ticket.status !== TICKET_STATUS.CLOSED) {
      return errorResponse(res, 'Can only rate resolved or closed tickets', 400);
    }

    await ticket.update({
      rating,
      feedback: feedback || null
    });

    return successResponse(res, ticket, 'Ticket rated successfully');
  } catch (error) {
    console.error('Error rating ticket:', error);
    return errorResponse(res, 'Error rating ticket', 500);
  }
};

module.exports = {
  createTicket,
  getUserTickets,
  getTicketById,
  getAllTickets,
  updateTicketStatus,
  assignTicket,
  updateTicketPriority,
  addInternalNotes,
  rateTicket
};
