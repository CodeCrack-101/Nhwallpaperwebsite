/**
 * Mock Products Database File
 * Location: frontend/src/data/products.js
 * Description: Exportable catalog list containing high-fidelity wallpaper mock details.
 *              Used uniformly by Shop, ProductDetails, Cart, and Wishlist pages.
 */

export const mockProducts = [
    {
        id: '1',
        name: 'Floral Sanctuary Wallpaper',
        price: 1499,
        rating: 4.8,
        reviewsCount: 124,
        category: 'Nature',
        img: 'https://images.unsplash.com/photo-1533038590840-1cde6e6e40dd?q=80&w=600',
        description: 'Breathe vibrant organic energy into your interior spaces with our Floral Sanctuary Wallpaper. Featuring detailed, hand-drawn tropical leaves and elegant botanical accents, this wallpaper is perfect for creating a refreshing nature-themed accent wall in living rooms or studies.',
        features: [
            'Eco-friendly non-woven fabric material',
            'Water-resistant, easy to clean surface coating',
            'Pre-trimmed panels for effortless seamless installation',
            'Breathable texture prevents mould growth'
        ],
        specifications: {
            'Roll Width': '53 cm (21 inches)',
            'Roll Length': '10 meters (33 feet)',
            'Pattern Match': 'Straight Match (53 cm)',
            'Weight': '1.2 kg per roll',
            'Origin': 'Made in India'
        }
    },
    {
        id: '2',
        name: 'Cosmic Starfield Wallpaper',
        price: 2499,
        rating: 4.9,
        reviewsCount: 88,
        category: 'Space',
        img: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=600',
        description: 'Immerse yourself in the infinite depth of the night sky. The Cosmic Starfield Wallpaper features gorgeous high-resolution print rendering of glowing nebulas, distant celestial galaxies, and twinkling stellar dust. Highly recommended for kids rooms, home theatres, and modern workspaces.',
        features: [
            'Premium non-woven fabric with smooth texture',
            'Fade-resistant UV cured inks for long-lasting vibrancy',
            'Fire-retardant safety certified',
            'Peelable surface for easy replacement later'
        ],
        specifications: {
            'Roll Width': '53 cm (21 inches)',
            'Roll Length': '10 meters (33 feet)',
            'Pattern Match': 'Offset Match (26.5 cm)',
            'Weight': '1.3 kg per roll',
            'Origin': 'Made in India'
        }
    },
    {
        id: '3',
        name: 'Geometric Luxe Wallpaper',
        price: 1999,
        rating: 4.7,
        reviewsCount: 156,
        category: 'Abstract',
        img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600',
        description: 'Elevate your home aesthetic with clean luxury. The Geometric Luxe Wallpaper displays sophisticated rose-gold metallic line forms nested over a deep charcoal matte texture base, providing a modern, premium architectural look to bedroom backdrops or boardroom interiors.',
        features: [
            'Metallic foil printed highlights on heavy-duty backing',
            'Highly wash-resistant and scrubbable surface',
            'Paste-the-wall backing for easier alignment during installation',
            'Good lightfastness prevents yellowing'
        ],
        specifications: {
            'Roll Width': '53 cm (21 inches)',
            'Roll Length': '10 meters (33 feet)',
            'Pattern Match': 'Free Match (Random)',
            'Weight': '1.4 kg per roll',
            'Origin': 'Made in India'
        }
    },
    {
        id: '4',
        name: 'Tropical Oasis Wallpaper',
        price: 1699,
        rating: 4.6,
        reviewsCount: 42,
        category: 'Nature',
        img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600',
        description: 'Recreate a serene tropical island mood in your private spaces. Featuring hand-painted watercolour designs of palm trees, hibiscus buds, and gentle rainforest flora, this wallpaper introduces a calming breeze-inspired texture to bedrooms and baths.',
        features: [
            'Premium breathable paper-based substrate',
            'Eco-solvent non-toxic dye prints',
            'Moisture-resistant protection ideal for bathrooms',
            'Easy dry strip removal'
        ],
        specifications: {
            'Roll Width': '53 cm (21 inches)',
            'Roll Length': '10 meters (33 feet)',
            'Pattern Match': 'Drop Match (64 cm)',
            'Weight': '1.15 kg per roll',
            'Origin': 'Made in India'
        }
    },
    {
        id: '5',
        name: 'Nebula Dream Wallpaper',
        price: 2699,
        rating: 4.9,
        reviewsCount: 95,
        category: 'Space',
        img: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=600',
        description: 'A beautiful masterpiece featuring deep indigo space clusters and pink gas clouds. Our Nebula Dream Wallpaper utilizes high-definition pigments printed on an elegant pearl-shimmer background, reflecting ambient lights to create a gorgeous multi-dimensional look.',
        features: [
            'Premium pearl-finish metallic substrate',
            'Scratch-resistant satin protective overlay',
            'Seamless panel alignment design',
            'Eco-friendly print ink formulation'
        ],
        specifications: {
            'Roll Width': '53 cm (21 inches)',
            'Roll Length': '10 meters (33 feet)',
            'Pattern Match': 'Straight Match (53 cm)',
            'Weight': '1.25 kg per roll',
            'Origin': 'Made in India'
        }
    },
    {
        id: '6',
        name: 'Marble Horizon Wallpaper',
        price: 2199,
        rating: 4.8,
        reviewsCount: 112,
        category: 'Abstract',
        img: 'https://images.unsplash.com/photo-1533038590840-1cde6e6e40dd?q=80&w=600', // Unsplash marble
        description: 'Inspired by raw Italian marble structures, this wallpaper displays dynamic grey and gold veins drifting over a premium off-white plaster base. Excellent choice for creating high-end minimalist entryways, luxurious salons, or corporate dining halls.',
        features: [
            'Heavy textured vinyl face over non-woven backing',
            'Excellent scrubbability for heavy traffic locations',
            'Superb resistance to heat and light fade',
            'Class A fire protection rating'
        ],
        specifications: {
            'Roll Width': '53 cm (21 inches)',
            'Roll Length': '10 meters (33 feet)',
            'Pattern Match': 'Offset Match (32 cm)',
            'Weight': '1.5 kg per roll',
            'Origin': 'Made in India'
        }
    }
];

export const getProductById = (id) => {
    return mockProducts.find(prod => prod.id === id);
};

export default {
    mockProducts,
    getProductById
};
