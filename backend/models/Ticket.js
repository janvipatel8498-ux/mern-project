import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
    {
        vendor: {
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

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
