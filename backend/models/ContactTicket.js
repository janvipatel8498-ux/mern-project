import mongoose from 'mongoose';

const contactTicketSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        subject: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Open', 'Answered', 'Closed'],
            default: 'Open',
        },
        adminReply: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const ContactTicket = mongoose.model('ContactTicket', contactTicketSchema);

export default ContactTicket;
