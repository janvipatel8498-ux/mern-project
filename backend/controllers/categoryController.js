import Category from '../models/Category.js';

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
    try {
        const defaults = ['Groceries', 'Fruits', 'Vegetables', 'Dairy & Bakery', 'Meat & Seafood', 'Snacks & Beverages', 'Household', 'Personal Care', 'Other'];

        // Find existing categories to see which defaults are missing
        const existingCategories = await Category.find({});
        const existingNames = existingCategories.map(c => c.name);

        const missingDefaults = defaults.filter(name => !existingNames.includes(name));

        if (missingDefaults.length > 0) {
            const seedData = missingDefaults.map(name => ({ name }));
            await Category.insertMany(seedData);
            // Re-fetch everything after seeding
            const allCategories = await Category.find({});
            return res.json(allCategories);
        }

        res.json(existingCategories);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;

        const categoryExists = await Category.findOne({ name });

        if (categoryExists) {
            res.status(400);
            throw new Error('Category already exists');
        }

        const category = new Category({
            name,
        });

        const createdCategory = await category.save();
        res.status(201).json(createdCategory);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
    try {
        const { name } = req.body;

        const category = await Category.findById(req.params.id);

        if (category) {
            category.name = name || category.name;

            const updatedCategory = await category.save();
            res.json(updatedCategory);
        } else {
            res.status(404);
            throw new Error('Category not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);

        if (category) {
            await Category.deleteOne({ _id: category._id });
            res.json({ message: 'Category removed' });
        } else {
            res.status(404);
            throw new Error('Category not found');
        }
    } catch (error) {
        next(error);
    }
};
