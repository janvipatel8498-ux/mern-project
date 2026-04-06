import mongoose from 'mongoose';

const deliveryAccessCodeSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const DeliveryAccessCode = mongoose.model('DeliveryAccessCode', deliveryAccessCodeSchema);

export default DeliveryAccessCode;
