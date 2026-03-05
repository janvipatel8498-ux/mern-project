import Ticket from '../models/Ticket.js';

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private/Vendor
export const createTicket = async (req, res, next) => {
    try {
        const { subject, message } = req.body;

        const ticket = new Ticket({
            vendor: req.user._id,
            subject,
            message,
            status: 'Open'
        });

        const createdTicket = await ticket.save();
        res.status(201).json(createdTicket);
    } catch (error) {
        next(error);
    }
};

// @desc    Get vendor's own tickets
// @route   GET /api/tickets/vendor
// @access  Private/Vendor
export const getVendorTickets = async (req, res, next) => {
    try {
        const tickets = await Ticket.find({ vendor: req.user._id }).sort({ updatedAt: -1 });
        res.json(tickets);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all tickets (admin)
// @route   GET /api/tickets
// @access  Private/Admin
export const getAllTickets = async (req, res, next) => {
    try {
        const tickets = await Ticket.find({}).populate('vendor', 'name email').sort({ status: -1, updatedAt: -1 });
        res.json(tickets);
    } catch (error) {
        next(error);
    }
};

// @desc    Reply to ticket
// @route   PUT /api/tickets/:id/reply
// @access  Private/Admin
export const replyToTicket = async (req, res, next) => {
    try {
        const { adminReply, status } = req.body;

        const ticket = await Ticket.findById(req.params.id);

        if (ticket) {
            ticket.adminReply = adminReply || ticket.adminReply;
            ticket.status = status || 'Answered';

            const updatedTicket = await ticket.save();
            const populatedTicket = await updatedTicket.populate('vendor', 'name email');
            res.json(populatedTicket);
        } else {
            res.status(404);
            throw new Error('Ticket not found');
        }
    } catch (error) {
        next(error);
    }
};
