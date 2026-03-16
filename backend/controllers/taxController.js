import TaxConfig from '../models/TaxConfig.js';
import Product from '../models/Product.js';

// @desc    Get all tax configurations
// @route   GET /api/tax
// @access  Public
export const getTaxConfigs = async (req, res, next) => {
    try {
        // First get all unique categories currently in products to ensure all are covered
        const activeCategories = await Product.distinct('category');

        // Fetch existing tax configs
        const configs = await TaxConfig.find({});
        const configMap = new Map(configs.map(c => [c.category, c.taxRate]));

        // Merge active categories with existing configs (default to 0 if not exists)
        const combinedTaxRates = activeCategories.map(cat => ({
            category: cat,
            taxRate: configMap.has(cat) ? configMap.get(cat) : 0
        }));

        res.json(combinedTaxRates);
    } catch (error) {
        next(error);
    }
};

// @desc    Update tax configuration
// @route   PUT /api/tax
// @access  Private/Admin
export const updateTaxConfig = async (req, res, next) => {
    try {
        const { taxUpdates } = req.body; // Array of { category, taxRate }

        if (!taxUpdates || !Array.isArray(taxUpdates)) {
            res.status(400);
            throw new Error('Invalid tax updates data');
        }

        const updatedConfigs = [];

        for (const update of taxUpdates) {
            const { category, taxRate } = update;

            let config = await TaxConfig.findOne({ category });

            if (config) {
                config.taxRate = taxRate;
                const updated = await config.save();
                updatedConfigs.push(updated);
            } else {
                const newConfig = await TaxConfig.create({ category, taxRate });
                updatedConfigs.push(newConfig);
            }
        }

        res.json(updatedConfigs);
    } catch (error) {
        next(error);
    }
};
