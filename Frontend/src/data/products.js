/**
 * Mock Products Database File
 * Location: frontend/src/data/products.js
 * Description: Statically imports furniture assets directly from SOHO, SKY, SP,
 *              and URBANO asset directories and exposes a unified products catalog.
 */

// SOHO Imports
import sh1 from '../assets/SOHO/soho1.png';
import sh2 from '../assets/SOHO/soho1.1.png';
import sh3 from '../assets/SOHO/soho1.2.png';
import sh4 from '../assets/SOHO/soho1.3.png';
import sh5 from '../assets/SOHO/soho1.4.png';
import sh6 from '../assets/SOHO/soho1.5.png';


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
        patternno:525301,
        name: 'Soho Classic Ergonomic Chair',
        price: 999,
        rating: 5.0,
        Info:{
            Weight: 1.3,
            Lenghtcm:7,
            widthcm:7,
            heightcm:48
        },
        reviewsCount: 142,
        category: 'SOHO',
        img: sh6,
        thumbnails: [sh1, sh2, sh3],
        description: 'Experience maximum support with the Soho Classic Ergonomic Chair. Engineered with contoured mesh backing, adjustable armrests, and smart lumbar support, this chair is optimized for productive home office environments and modern desks.',
        availability: 'In Stock',
        material: 'Premium Mesh fabric & Nylon base',
        dimensions: 'W 65cm x H 115-125cm x D 60cm',
        warranty: '2 Year Manufacturer Warranty',
        deliveryInfo: 'Free shipping. Dispatched in 2-3 business days.'
    },
   
    // ================= (SKY) =================
    
    // =================(Urbano)=================
    
    // ================= WALLFLORAL =================
   
    // Royal Texture

    // Mirabel

    // Epic Wall

    // Selfie Point

    // 2X2

    //4X10

    //Foam Sheet
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