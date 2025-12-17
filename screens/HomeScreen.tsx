
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, Star, Clock, Flame, Plus, Heart } from 'lucide-react';
import { Product } from '../types';
import { mockProducts } from '../services/mockApi';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { CATEGORIES } from '../constants';
import { ChefBot } from '../components/ChefBot';
import { CardSkeleton } from '../components/Skeleton';
import { OptimizedImage } from '../components/OptimizedImage';

const HomeScreen = () => {
  const { user, toggleFavorite } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Optimization: Fetch initial data
  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      const res = await mockProducts.getAll(1, 10);
      if (res.data) {
        setProducts(res.data.products);
        setHasMore(res.data.hasMore);
      }
      setLoading(false);
    };
    loadInitial();
  }, []);

  // Optimization: Load more data (Pagination)
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    const res = await mockProducts.getAll(nextPage, 10);
    if (res.data) {
      setProducts(prev => [...prev, ...res.data!.products]);
      setHasMore(res.data.hasMore);
      setPage(nextPage);
    }
    setLoadingMore(false);
  };

  // Optimization: Memoize filtering to prevent calc on every render
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="pb-24 pt-4 px-4 animate-in fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Delivering to</p>
          <div className="flex items-center gap-1">
            <h2 className="text-primary font-bold text-lg">Home, 123 Main St</h2>
            <ChevronLeft className="rotate-270 w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
          {user?.name.charAt(0)}
        </div>
      </div>

      {/* Search - Optimization: Could add debounce here in production */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Find your craving..." 
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border-none focus:ring-2 focus:ring-primary dark:text-white"
        />
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto gap-3 mb-8 pb-2 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              selectedCategory === cat 
                ? 'bg-primary text-white shadow-lg shadow-orange-500/25' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Loading State: Skeletons */}
        {loading && Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}

        {/* Data State */}
        {!loading && filteredProducts.map(product => {
          const isFav = user?.favorites.includes(product.id);
          return (
          <div 
            key={product.id} 
            onClick={() => navigate(`/details/${product.id}`)}
            className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group"
          >
            <button 
                onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                className="absolute top-4 right-4 z-30 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 active:scale-95 transition-all"
            >
                <Heart size={18} className={isFav ? "fill-red-500 text-red-500" : "text-white"} />
            </button>

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-700">
              <OptimizedImage src={product.image} alt={product.name} className="w-full h-full" />
              
              {!product.isAvailable && (
                 <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                    <span className="text-white font-bold bg-red-500 px-3 py-1 rounded-full text-xs">Sold Out</span>
                 </div>
              )}
              <div className="absolute top-2 left-2 z-20 bg-white/90 dark:bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="dark:text-white">{product.rating}</span>
              </div>
            </div>
            
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{product.name}</h3>
            
            <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-xs mb-3">
              <span className="flex items-center gap-1"><Clock size={12} /> {product.prepTime} min</span>
              <span className="flex items-center gap-1"><Flame size={12} /> {product.calories} kcal</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
              <button 
                disabled={!product.isAvailable}
                onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                className="w-8 h-8 rounded-full bg-primary disabled:bg-gray-300 text-white flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        )})}
      </div>

      {/* Infinite Scroll Trigger */}
      {!loading && hasMore && (
        <div className="mt-8 text-center">
          <button 
            onClick={loadMore} 
            disabled={loadingMore}
            className="text-primary text-sm font-bold hover:underline disabled:opacity-50"
          >
            {loadingMore ? 'Loading more...' : 'View More Products'}
          </button>
        </div>
      )}

      <ChefBot products={products} />
    </div>
  );
};

export default HomeScreen;
