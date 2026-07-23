/**
 * Product Model File
 * Location: backend/models/Product.js
 * Description: Mongoose schema representing products.
 *              Includes dimensions, weight, and stock tracking fields.
 *              Uses a custom String _id to maintain compatibility with the frontend mockup IDs.
 *              Includes a static findOrCreate method to auto-seed mock products on demand.
 */

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    _id: {
        type: String, // E.g., 'soho-1'
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    weight: {
        type: Number,
        required: true,
        default: 0.5, // in kg
        min: 0
    },
    length: {
        type: Number,
        required: true,
        default: 10, // in cm
        min: 0
    },
    width: {
        type: Number,
        required: true,
        default: 10, // in cm
        min: 0
    },
    height: {
        type: Number,
        required: true,
        default: 10, // in cm
        min: 0
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
        default: 100,
        min: 0
    },
    img: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    patternno: {
        type: Number
    }
}, {
    timestamps: true
});

ProductSchema.statics.findOrCreate = async function (productId) {
    let product = await this.findById(productId);
    if (!product) {
        console.log(`[AUTO-SEED] Product ${productId} not found. Attempting to seed...`);

        const mockCatalog = {
            'soho-1': {
                name: 'Soho Classic Ergonomic Chair',
                price: 999,
                weight: 1.3,
                length: 7,
                width: 7,
                height: 48,
                category: 'SOHO',
                stock: 50,
                img: '/assets/SOHO/soho60.png',
                description: 'Experience maximum support with the Soho Classic Ergonomic Chair. Engineered with contoured mesh backing, adjustable armrests, and smart lumbar support, this chair is optimized for productive home office environments and modern desks.',
                patternno: 525301
            },
            'soho-2': {
                name: 'Soho Executive Mesh Throne',
                price: 1499,
                weight: 1.5,
                length: 8,
                width: 8,
                height: 52,
                category: 'SOHO',
                stock: 30,
                img: '/assets/SOHO/soho1.png',
                description: 'Premium upgrade of the Soho series. Contoured neck rest, memory foam base, and custom tilt angles.',
                patternno: 525362
            },
            'sky-1': {
                name: 'Sky Executive Leather Chair',
                price: 4999,
                weight: 2.5,
                length: 15,
                width: 15,
                height: 80,
                category: 'Executive Chair',
                stock: 20,
                img: '/assets/SKY/sk1.png',
                description: 'Top-grain luxury leather cabin chair. Built for comfort, leadership, and long sessions.',
                patternno: 601020
            },
            'urbano-1': {
                name: 'Urbano Minimalist Task Chair',
                price: 1999,
                weight: 1.8,
                length: 10,
                width: 10,
                height: 60,
                category: 'Office',
                stock: 40,
                img: '/assets/URBANO/ur1.png',
                description: 'Sleek, lightweight office chair suitable for hotdesking and fast-paced team hubs.',
                patternno: 708090
            }
        };

        const mockData = mockCatalog[productId];
        if (mockData) {
            product = new this({
                _id: productId,
                ...mockData
            });
        } else {
            product = new this({
                _id: productId,
                name: 'Premium Product',
                price: 999,
                weight: 1.0,
                length: 10,
                width: 10,
                height: 10,
                category: 'SOHO',
                stock: 100,
                description: 'Premium furniture item.'
            });
        }

        await product.save();
        console.log(`[AUTO-SEED] Product ${productId} auto-seeded successfully.`);
    }
    return product;
};

module.exports = mongoose.model('Product', ProductSchema);
