import React from 'react';
import { Home, ShoppingBag, User as UserIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const currentPath = location.pathname;

  // Don't show on specific screens
  const hiddenPaths = ['/auth', '/checkout', '/order-success', '/admin'];
  if (hiddenPaths.some(path => currentPath.startsWith(path)) || currentPath.includes('/details')) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center z-40">
      <button 
        onClick={() => navigate('/')}
        className={`flex flex-col items-center gap-1 ${currentPath === '/' ? 'text-primary' : 'text-gray-400'}`}
      >
        <Home size={24} strokeWidth={currentPath === '/' ? 2.5 : 2} />
      </button>
      <div className="relative">
        <button 
          onClick={() => navigate('/cart')}
          className={`flex flex-col items-center gap-1 ${currentPath === '/cart' ? 'text-primary' : 'text-gray-400'}`}
        >
          <ShoppingBag size={24} strokeWidth={currentPath === '/cart' ? 2.5 : 2} />
        </button>
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-800">
            {cartCount}
          </span>
        )}
      </div>
      <button 
        onClick={() => navigate('/profile')}
        className={`flex flex-col items-center gap-1 ${currentPath === '/profile' ? 'text-primary' : 'text-gray-400'}`}
      >
        <UserIcon size={24} strokeWidth={currentPath === '/profile' ? 2.5 : 2} />
      </button>
    </div>
  );
};