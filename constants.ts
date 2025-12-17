import { Product } from './types';

export const CATEGORIES = ['All', 'Burgers', 'Pizza', 'Sushi', 'Salads', 'Desserts', 'Drinks'];

export const MOCK_PRODUCTS: Product[] = [
  // --- BURGERS ---
  {
    id: '1',
    name: 'Truffle Mushroom Burger',
    description: 'Juicy beef patty topped with truffle mayo, swiss cheese, and sautéed mushrooms.',
    price: 16.99,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    calories: 850,
    prepTime: 20,
    ingredients: ['Beef Patty', 'Brioche Bun', 'Swiss Cheese', 'Truffle Oil', 'Mushrooms', 'Lettuce'],
    isAvailable: true,
    reviews: 124
  },
  {
    id: '101',
    name: 'Classic Cheeseburger',
    description: 'The timeless classic with cheddar, lettuce, tomato, and house sauce.',
    price: 12.99,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    calories: 700,
    prepTime: 15,
    ingredients: ['Beef Patty', 'Cheddar', 'Lettuce', 'Tomato', 'House Sauce'],
    isAvailable: true,
    reviews: 200
  },
  {
    id: '102',
    name: 'Spicy Chicken Burger',
    description: 'Crispy fried chicken breast with spicy slaw and pickles.',
    price: 14.50,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1615557960916-5f4791effe9d?auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    calories: 750,
    prepTime: 18,
    ingredients: ['Fried Chicken', 'Spicy Slaw', 'Pickles', 'Mayo'],
    isAvailable: true,
    reviews: 85
  },

  // --- PIZZA ---
  {
    id: '2',
    name: 'Margherita Supreme',
    description: 'Classic tomato sauce, fresh buffalo mozzarella, basil, and a drizzle of olive oil.',
    price: 14.50,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    calories: 700,
    prepTime: 25,
    ingredients: ['Pizza Dough', 'San Marzano Tomato', 'Buffalo Mozzarella', 'Fresh Basil', 'Olive Oil'],
    isAvailable: true,
    reviews: 89
  },
  {
    id: '201',
    name: 'Pepperoni Feast',
    description: 'Loaded with double pepperoni and extra cheese.',
    price: 16.00,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    calories: 900,
    prepTime: 25,
    ingredients: ['Pepperoni', 'Mozzarella', 'Tomato Sauce', 'Oregano'],
    isAvailable: true,
    reviews: 310
  },
  {
    id: '202',
    name: 'Truffle Pizza',
    description: 'White base pizza with truffle cream, mushrooms, and thyme.',
    price: 19.50,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    calories: 820,
    prepTime: 28,
    ingredients: ['Truffle Cream', 'Mushrooms', 'Thyme', 'Mozzarella'],
    isAvailable: false,
    reviews: 50
  },

  // --- SUSHI ---
  {
    id: '3',
    name: 'Dragon Roll',
    description: 'Eel and cucumber inside, topped with avocado and tobiko.',
    price: 18.00,
    category: 'Sushi',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    calories: 450,
    prepTime: 15,
    ingredients: ['Sushi Rice', 'Nori', 'Eel', 'Cucumber', 'Avocado', 'Tobiko'],
    isAvailable: true,
    reviews: 215
  },
  {
    id: '6',
    name: 'Spicy Tuna Roll',
    description: 'Fresh tuna mixed with spicy mayo and cucumber.',
    price: 11.50,
    category: 'Sushi',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    calories: 320,
    prepTime: 12,
    ingredients: ['Tuna', 'Spicy Mayo', 'Cucumber', 'Sushi Rice', 'Nori'],
    isAvailable: true,
    reviews: 98
  },

  // --- SALADS ---
  {
    id: '4',
    name: 'Quinoa Power Salad',
    description: 'Mixed greens, quinoa, chickpeas, avocado, and lemon tahini dressing.',
    price: 12.99,
    category: 'Salads',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    calories: 380,
    prepTime: 10,
    ingredients: ['Mixed Greens', 'Quinoa', 'Chickpeas', 'Avocado', 'Lemon', 'Tahini'],
    isAvailable: true,
    reviews: 56
  },
  {
    id: '401',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan cheese, croutons, and caesar dressing.',
    price: 10.50,
    category: 'Salads',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80',
    rating: 4.2,
    calories: 450,
    prepTime: 10,
    ingredients: ['Romaine', 'Parmesan', 'Croutons', 'Caesar Dressing'],
    isAvailable: true,
    reviews: 120
  },

  // --- DESSERTS ---
  {
    id: '5',
    name: 'Molten Lava Cake',
    description: 'Warm chocolate cake with a gooey center, served with vanilla ice cream.',
    price: 9.99,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    calories: 550,
    prepTime: 15,
    ingredients: ['Dark Chocolate', 'Butter', 'Eggs', 'Sugar', 'Flour', 'Vanilla Ice Cream'],
    isAvailable: true,
    reviews: 342
  },
  {
    id: '501',
    name: 'Berry Cheesecake',
    description: 'New York style cheesecake topped with fresh berry compote.',
    price: 8.50,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    calories: 480,
    prepTime: 10,
    ingredients: ['Cream Cheese', 'Graham Cracker', 'Berries', 'Sugar'],
    isAvailable: true,
    reviews: 150
  },
  
  // --- DRINKS ---
  {
    id: '601',
    name: 'Fresh Lemonade',
    description: 'Squeezed fresh daily with a hint of mint.',
    price: 4.50,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    calories: 120,
    prepTime: 5,
    ingredients: ['Lemon', 'Water', 'Sugar', 'Mint'],
    isAvailable: true,
    reviews: 80
  },
  {
    id: '602',
    name: 'Iced Matcha Latte',
    description: 'Premium matcha green tea with oat milk and ice.',
    price: 5.95,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1515823664811-14741f528987?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    calories: 180,
    prepTime: 5,
    ingredients: ['Matcha Powder', 'Oat Milk', 'Ice', 'Agave'],
    isAvailable: true,
    reviews: 210
  }
];

export const MOCK_ORDERS_STATS = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];