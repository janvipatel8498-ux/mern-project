import mongoose from 'mongoose';

const taxConfigSchema = mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        taxRate: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const TaxConfig = mongoose.model('TaxConfig', taxConfigSchema);

export default TaxConfig;
