import ContactTicket from '../models/ContactTicket.js';

// @desc    Create new contact ticket
// @route   POST /api/contact-tickets
// @access  Private
export const createUserTicket = async (req, res, next) => {
    try {
        const { subject, message } = req.body;

        const ticket = new ContactTicket({
            user: req.user._id,
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

// @desc    Get user's own contact tickets
// @route   GET /api/contact-tickets/my-tickets
// @access  Private
export const getUserTickets = async (req, res, next) => {
    try {
        const tickets = await ContactTicket.find({ user: req.user._id }).sort({ updatedAt: -1 });
        res.json(tickets);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all contact tickets (admin)
// @route   GET /api/contact-tickets
// @access  Private/Admin
export const getAllUserTickets = async (req, res, next) => {
    try {
        const tickets = await ContactTicket.find({}).populate('user', 'name email').sort({ status: -1, updatedAt: -1 });
        res.json(tickets);
    } catch (error) {
        next(error);
    }
};

// @desc    Reply to contact ticket
// @route   PUT /api/contact-tickets/:id/reply
// @access  Private/Admin
export const replyToUserTicket = async (req, res, next) => {
    try {
        const { adminReply, status } = req.body;

        const ticket = await ContactTicket.findById(req.params.id);

        if (ticket) {
            ticket.adminReply = adminReply || ticket.adminReply;
            ticket.status = status || 'Answered';

            const updatedTicket = await ticket.save();
            const populatedTicket = await updatedTicket.populate('user', 'name email');
            res.json(populatedTicket);
        } else {
            res.status(404);
            throw new Error('Ticket not found');
        }
    } catch (error) {
        next(error);
    }
};
