/**
 * Mock Products Database File
 * Location: frontend/src/data/products.js
 * Description: Statically imports furniture assets directly from SOHO, SKY, SP,
 *              and URBANO asset directories and exposes a unified products catalog.
 */

// SOHO Imports
import sh1 from '../assets/SOHO/sh1.png';
import sh2 from '../assets/SOHO/sh2.png';
import sh3 from '../assets/SOHO/sh3.png';
import sh4 from '../assets/SOHO/sh4.png';
import sh5 from '../assets/SOHO/sh5.png';
import sh6 from '../assets/SOHO/sh6.png';

// SKY Imports
import sk1 from '../assets/SKY/sk1.png';
import sk2 from '../assets/SKY/sk2.png';
import sk3 from '../assets/SKY/sk3.png';
import sk4 from '../assets/SKY/sk4.png';
import sk5 from '../assets/SKY/sk5.png';
import sk6 from '../assets/SKY/sk6.png';

// SP Imports
import sp1 from '../assets/SP/sp1.png';
import sp2 from '../assets/SP/sp2.png';
import sp3 from '../assets/SP/sp3.png';
import sp4 from '../assets/SP/sp4.png';
import sp5 from '../assets/SP/sp5.png';
import sp6 from '../assets/SP/sp6.png';

// URBANO Imports
import ur1 from '../assets/URBANO/ur1.png';
import ur2 from '../assets/URBANO/ur2.png';
import ur3 from '../assets/URBANO/ur3.png';
import ur4 from '../assets/URBANO/ur4.png';
import ur5 from '../assets/URBANO/ur5.png';
import ur6 from '../assets/URBANO/ur6.png';

export const mockProducts = [
    // ================= SOHO CATEGORY =================
    {
        id: 'soho-1',
        name: 'Soho Classic Ergonomic Chair',
        price: 8999,
        rating: 4.8,
        reviewsCount: 142,
        category: 'SOHO',
        img: sh1,
        thumbnails: [sh1, sh2, sh3],
        description: 'Experience maximum support with the Soho Classic Ergonomic Chair. Engineered with contoured mesh backing, adjustable armrests, and smart lumbar support, this chair is optimized for productive home office environments and modern desks.',
        availability: 'In Stock',
        material: 'Premium Mesh fabric & Nylon base',
        dimensions: 'W 65cm x H 115-125cm x D 60cm',
        warranty: '2 Year Manufacturer Warranty',
        deliveryInfo: 'Free shipping. Dispatched in 2-3 business days.'
    },
    {
        id: 'soho-2',
        name: 'Soho Elite Executive Chair',
        price: 12499,
        rating: 4.9,
        reviewsCount: 96,
        category: 'SOHO',
        img: sh2,
        thumbnails: [sh2, sh3, sh4],
        description: 'Bring clean leadership aesthetics into your cabin room. The Soho Elite features high-density molded seat foam wrapped in sleek leatherette upholstery, alongside dynamic synchron-tilt mechanism controls.',
        availability: 'In Stock',
        material: 'High-grade Leatherette & Chrome base',
        dimensions: 'W 70cm x H 120-130cm x D 65cm',
        warranty: '3 Year Manufacturer Warranty',
        deliveryInfo: 'Free shipping. Dispatched in 2-3 business days.'
    },
    {
        id: 'soho-3',
        name: 'Soho Soft-Pad Task Chair',
        price: 7499,
        rating: 4.6,
        reviewsCount: 68,
        category: 'SOHO',
        img: sh3,
        thumbnails: [sh3, sh4, sh5],
        description: 'Compact, cozy, and highly responsive. The Soft-Pad model provides plush ribbed cushioning sections that conform gently to your body shape, allowing for comfortable prolonged sessions.',
        availability: 'In Stock',
        material: 'Soft ribbed PU leather & Aluminum frame',
        dimensions: 'W 60cm x H 95-105cm x D 55cm',
        warranty: '1 Year Manufacturer Warranty',
        deliveryInfo: 'Free shipping. Dispatched in 2-3 business days.'
    },
    {
        id: 'soho-4',
        name: 'Soho Minimalist Draft Chair',
        price: 6999,
        rating: 4.7,
        reviewsCount: 52,
        category: 'SOHO',
        img: sh4,
        thumbnails: [sh4, sh5, sh6],
        description: 'Perfect for drafting tables, high kitchen counters, and collaborative workspaces. Fitted with a height-adjustable footring and solid friction-castors.',
        availability: 'Only 3 left in stock',
        material: 'Breathable net backing & Sturdy steel frame',
        dimensions: 'W 58cm x H 105-125cm x D 58cm',
        warranty: '1 Year Manufacturer Warranty',
        deliveryInfo: 'Free shipping. Dispatched in 3-5 business days.'
    },

    // ================= EXECUTIVE CHAIRS (SKY) =================
    {
        id: 'sky-1',
        name: 'Skyline high-back Executive Chair',
        price: 15999,
        rating: 4.9,
        reviewsCount: 110,
        category: 'SKY',
        img: sk1,
        thumbnails: [sk1, sk2, sk3],
        description: 'The ultimate signature cabin seat. Handcrafted with premium genuine leather surfaces, hand-polished wooden accents, and knee-tilt multi-locking synchro mechanisms.',
        availability: 'In Stock',
        material: 'Genuine Top-grain Leather & Solid wood armrests',
        dimensions: 'W 75cm x H 125-135cm x D 70cm',
        warranty: '5 Year Premium Warranty',
        deliveryInfo: 'Free premium courier. Dispatched in 1-2 business days.'
    },
    {
        id: 'sky-2',
        name: 'Skyline Air-Grid Manager Seat',
        price: 10999,
        rating: 4.7,
        reviewsCount: 85,
        category: 'SKY',
        img: sk2,
        thumbnails: [sk2, sk3, sk4],
        description: 'Stay cool and fresh under pressure. Features high-tensile structural elastomeric mesh backing that offers excellent weight distribution and pressure reduction.',
        availability: 'In Stock',
        material: 'Korean Mesh & Reinforced fiberglass frame',
        dimensions: 'W 68cm x H 118-128cm x D 62cm',
        warranty: '3 Year Manufacturer Warranty',
        deliveryInfo: 'Free shipping. Dispatched in 2-3 business days.'
    },
    {
        id: 'sky-3',
        name: 'Skyline Orthopedic Lumbar Support',
        price: 9499,
        rating: 4.8,
        reviewsCount: 74,
        category: 'SKY',
        img: sk3,
        thumbnails: [sk3, sk4, sk5],
        description: 'Endorsed by spinal practitioners. The Orthopedic model integrates a unique spring-loaded self-adjusting lumbar curve that maintains spinal alignment automatically.',
        availability: 'In Stock',
        material: 'Memory foam & Poly-weave fabric surface',
        dimensions: 'W 65cm x H 112-122cm x D 60cm',
        warranty: '3 Year Manufacturer Warranty',
        deliveryInfo: 'Free shipping. Dispatched in 2-3 business days.'
    },

    // ================= GAMING CHAIRS (UV / SP) =================
    {
        id: 'urbano-1',
        name: 'Viper GT Carbon Pro Gaming Chair',
        price: 18999,
        rating: 4.9,
        reviewsCount: 165,
        category: 'URBANO',
        img: sp1,
        thumbnails: [sp1, sp2, sp3],
        description: 'Immerse yourself in esports style. Features a 180-degree fully reclining backrest, 4D adjustable armrests, and headrest/lumbar pillow sets wrapped in high-fidelity carbon fibre texture panels.',
        availability: 'In Stock',
        material: 'Carbon-texture PU leather & Heavy-duty steel wheelbase',
        dimensions: 'W 72cm x H 130-140cm x D 68cm',
        warranty: '3 Year Manufacturer Warranty',
        deliveryInfo: 'Free shipping. Dispatched in 2-3 business days.'
    },
    {
        id: 'urbano-2',
        name: 'Viper Apex Ergonomic Racer Seat',
        price: 14999,
        rating: 4.8,
        reviewsCount: 114,
        category: 'URBANO',
        img: sp2,
        thumbnails: [sp2, sp3, sp4],
        description: 'Engineered for absolute control during long raids. Form-fitting side bolstering keeps your posture snug, supported by multi-axis neck pillows and memory foam cushions.',
        availability: 'In Stock',
        material: 'Breathable cold-cure foam & Soft fabric upholstery',
        dimensions: 'W 70cm x H 125-135cm x D 65cm',
        warranty: '2 Year Manufacturer Warranty',
        deliveryInfo: 'Free shipping. Dispatched in 2-3 business days.'
    },
    {
        id: 'urbano-3',
        name: 'Viper Strike Stealth Gaming Throne',
        price: 16499,
        rating: 4.6,
        reviewsCount: 89,
        category: 'URBANO',
        img: sp3,
        thumbnails: [sp3, sp4, sp5],
        description: 'Sleek all-black matte appearance. The Stealth edition offers noise-free polyurethane wheels and high-load hydraulic gas cylinders for smooth transitions.',
        availability: 'Out of stock - Pre-order available',
        material: 'Matte black premium PU & Sturdy metal frame',
        dimensions: 'W 71cm x H 128-138cm x D 66cm',
        warranty: '3 Year Manufacturer Warranty',
        deliveryInfo: 'Pre-order item. Ships within 10-15 business days.'
    },

    // ================= WALLFLORAL / OFFICE CHAIRS =================
    {
        id: 'wallfloral-1',
        name: 'Urbano Taskmaster Mesh Chair',
        price: 4999,
        rating: 4.7,
        reviewsCount: 220,
        category: 'WALLFLORAL',
        img: ur1,
        thumbnails: [ur1, ur2, ur3],
        description: 'The standard choice for efficient offices. Outfitted with high-strength mesh back, dynamic tilt tension, and solid pneumatic cylinder height adjustments.',
        availability: 'In Stock',
        material: 'Durable nylon mesh & Heavy-duty plastic base',
        dimensions: 'W 60cm x H 90-100cm x D 58cm',
        warranty: '1 Year Warranty',
        deliveryInfo: 'Free bulk delivery options. Ships in 2 business days.'
    },
    {
        id: 'wallfloral-2',
        name: 'Urbano Comfort-Air Mid-Back',
        price: 5999,
        rating: 4.6,
        reviewsCount: 135,
        category: 'WALLFLORAL',
        img: ur2,
        thumbnails: [ur2, ur3, ur4],
        description: 'Maximize space without sacrificing back support. Sleek mid-back curvature contours seamlessly to your lower spine. Includes flip-up armrests.',
        availability: 'In Stock',
        material: 'Soft foam seat & Mesh backing',
        dimensions: 'W 62cm x H 98-108cm x D 58cm',
        warranty: '1 Year Warranty',
        deliveryInfo: 'Free shipping. Dispatched in 2 business days.'
    },
    {
        id: 'wallfloral-3',
        name: 'Urbano Executive Lite Mesh',
        price: 7999,
        rating: 4.8,
        reviewsCount: 154,
        category: 'WALLFLORAL',
        img: ur3,
        thumbnails: [ur3, ur4, ur5],
        description: 'An executive choice that blends value and features. Incorporates an adjustable headrest, multi-tilt lock controls, and high-quality castors.',
        availability: 'In Stock',
        material: 'Premium mesh & Chrome details',
        dimensions: 'W 64cm x H 110-120cm x D 60cm',
        warranty: '2 Year Warranty',
        deliveryInfo: 'Free shipping. Dispatched in 2 business days.'
    }
];

export const getProductById = (id) => {
    return mockProducts.find(prod => prod.id === id);
};

export const getProductsByCategory = (category) => {
    return mockProducts.filter(prod => prod.category.toLowerCase() === category.toLowerCase());
};

export default {
    mockProducts,
    getProductById,
    getProductsByCategory
};