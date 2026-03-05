import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Fetch all products (with pagination & search)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
    try {
        const pageSize = 12;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const filter = req.query.category ? { category: req.query.category } : {};

        const count = await Product.countDocuments({ ...keyword, ...filter });
        const products = await Product.find({ ...keyword, ...filter })
            .populate('user', 'name email')
            .populate('vendor', 'name email')
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ products, page, pages: Math.ceil(count / pageSize), count });
    } catch (error) {
        next(error);
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('user', 'name email')
            .populate('vendor', 'name email');

        if (product) {
            res.json(product);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Vendor or Admin
export const createProduct = async (req, res, next) => {
    try {
        const { name, price, description, image, category, countInStock, unit } = req.body;

        const product = new Product({
            name: name || 'Sample name',
            price: price || 0,
            user: req.user._id,
            vendor: req.user.role === 'vendor' ? req.user._id : undefined,
            image: image || '/images/sample.jpg',
            category: category || 'Sample category',
            countInStock: countInStock || 0,
            unit: unit || 'unit',
            numReviews: 0,
            description: description || 'Sample description',
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        next(error);
    }
};

// @desc    Get vendor's own products
// @route   GET /api/products/vendor
// @access  Private/Vendor
export const getVendorProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ vendor: req.user._id });
        res.json(products);
    } catch (error) {
        next(error);
    }
};

// @desc    Get reviews for vendor's products
// @route   GET /api/products/vendor/reviews
// @access  Private/Vendor
export const getVendorProductReviews = async (req, res, next) => {
    try {
        const products = await Product.find({ vendor: req.user._id, numReviews: { $gt: 0 } })
            .select('name image reviews category');

        // Flatten the reviews array from all products into a single list
        let allReviews = [];

        products.forEach(product => {
            product.reviews.forEach(review => {
                allReviews.push({
                    _id: review._id,
                    productId: product._id,
                    productName: product.name,
                    productImage: product.image,
                    productCategory: product.category,
                    userName: review.name,
                    rating: review.rating,
                    comment: review.comment,
                    createdAt: review.createdAt
                });
            });
        });

        // Sort by newest first
        allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(allReviews);
    } catch (error) {
        next(error);
    }
};

// @desc    Get products by vendor (for admin)
// @route   GET /api/products/admin/vendor/:id
// @access  Private/Admin
export const getProductsByVendorAdmin = async (req, res, next) => {
    try {
        const vendorId = req.params.id;
        const products = await Product.find({ vendor: vendorId }).select('name image category price numReviews reviews');
        res.json(products);
    } catch (error) {
        next(error);
    }
};


// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Vendor or Admin
export const updateProduct = async (req, res, next) => {
    try {
        const { name, price, description, image, category, countInStock, unit } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            // Check if user is the owner of the product or an admin
            if (product.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                res.status(403);
                throw new Error('Not authorized to update this product');
            }

            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.image = image || product.image;
            product.category = category || product.category;
            product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
            product.unit = unit || product.unit;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Vendor or Admin
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // Check if user is the owner of the product or an admin
            if (product.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                res.status(403);
                throw new Error('Not authorized to delete this product');
            }

            await Product.deleteOne({ _id: product._id });
            res.json({ message: 'Product removed' });
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                res.status(400);
                throw new Error('Product already reviewed');
            }

            // Check if user bought it and it's delivered
            const hasBoughtProduct = await Order.findOne({
                user: req.user._id,
                isDelivered: true,
                'orderItems.product': product._id
            });

            if (!hasBoughtProduct) {
                res.status(400);
                throw new Error('You can only review products that have been delivered to you.');
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            product.reviews.push(review);

            product.numReviews = product.reviews.length;

            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save();
            res.status(201).json({ message: 'Review added' });
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
export const getTopProducts = async (req, res, next) => {
    try {
        const products = await Product.find({}).sort({ rating: -1 }).limit(4);
        res.json(products);
    } catch (error) {
        next(error);
    }
};

