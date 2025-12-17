
import React, { useState, useEffect, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, Home, User as UserIcon, Search, Plus, Minus, Trash2, ChevronLeft, 
  Star, Clock, Flame, CreditCard, LogOut, Moon, Sun, LayoutDashboard, 
  CheckCircle, AlertCircle, Edit2, X, Loader2, RefreshCw 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { MOCK_ORDERS_STATS, CATEGORIES } from './constants';
import { Product, Order, ViewState } from './types';
import { Button } from './components/Button';
import { BottomNav } from './components/BottomNav';
import { PaymentForm } from './components/PaymentForm';
import { mockProducts, mockOrders } from './services/mockApi';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider, useCart } from './contexts/CartContext';

// Optimization: Lazy Load Screens
const HomeScreen = React.lazy(() => import('./screens/HomeScreen'));
import { CheckoutScreen } from './screens/CheckoutScreen';

// --- Error Boundary ---
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any, info: any) { console.error("App Crash:", error, info); }
  render() {
    if (this.state.hasError) {
      return <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-xl font-bold mb-2">Something went wrong.</h1>
          <button onClick={() => window.location.reload()} className="text-primary underline">Reload App</button>
        </div>
      </div>;
    }
    return this.props.children;
  }
}

// --- Global Loading Skeleton ---
const ScreenLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-400 text-sm">Loading FlavorDash...</p>
    </div>
  </div>
);

// --- Protected Route Helper ---
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <ScreenLoader />;
  if (!user) return <Navigate to="/auth" />;
  return <>{children}</>;
};

const AuthScreen = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    let res;
    if (isLogin) {
      res = await login(email, password);
    } else {
      res = await register(name, email, phone, password);
    }
    
    setLoading(false);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-64 bg-primary/10 rounded-b-[100px] -z-0"></div>
      <div className="z-10 w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="w-20 h-20 bg-primary rounded-3xl mx-auto flex items-center justify-center mb-4 shadow-xl shadow-orange-500/30">
            <Flame className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">FlavorDash</h1>
          <p className="text-gray-500 dark:text-gray-400">Craving satisfied in minutes.</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-xl text-sm">{error}</div>}
        
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex mb-6">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isLogin ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-500'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${!isLogin ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-500'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input 
                type="text" required placeholder="Full Name" value={name} onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
              />
              <input 
                type="tel" required placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
              />
            </>
          )}
          <input 
            type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
          />
          <input 
            type="password" required placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
          />
          <Button type="submit" className="w-full mt-4" isLoading={loading}>
            {isLogin ? 'Login' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-8 text-center">
             <p className="text-xs text-gray-400">
               Demo Admin: <span className="font-mono">admin@flavor.dash / admin</span>
             </p>
        </div>
      </div>
    </div>
  );
};

const ProductDetailsScreen = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const location = useLocation();
  const productId = location.pathname.split('/').pop();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    mockProducts.getAll(1, 100).then(res => {
      const p = res.data?.products.find(i => i.id === productId);
      if (p) setProduct(p);
    });
  }, [productId]);

  if (!product) return <ScreenLoader />;

  return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto animate-in slide-in-from-right">
        <div className="relative h-72 sm:h-96">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/40 text-white"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
        <div className="px-6 py-8 -mt-10 relative bg-white dark:bg-gray-900 rounded-t-[40px] shadow-inner min-h-[calc(100vh-280px)]">
          <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
          
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white max-w-[70%]">{product.name}</h1>
            <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
          </div>

          <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400 mb-6 text-sm">
            <span className="flex items-center gap-1"><Star size={16} className="text-yellow-400 fill-yellow-400" /> {product.rating} ({product.reviews} reviews)</span>
            <span className="flex items-center gap-1"><Clock size={16} /> {product.prepTime} mins</span>
            <span className="flex items-center gap-1"><Flame size={16} /> {product.calories} kcal</span>
          </div>

          <h3 className="font-bold text-lg mb-2 dark:text-white">Description</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            {product.description}
          </p>

          <Button 
            disabled={!product.isAvailable}
            onClick={() => { addToCart(product); navigate('/cart'); }} 
            className="w-full shadow-xl shadow-primary/20"
          >
            {product.isAvailable ? `Add to Cart - $${product.price.toFixed(2)}` : 'Currently Unavailable'}
          </Button>
        </div>
      </div>
  );
};

const CartScreen = () => {
    const { cart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();
    return (
        <div className="pb-24 pt-4 px-4 min-h-screen bg-gray-50 dark:bg-gray-900 animate-in fade-in">
           <h2 className="text-2xl font-bold mb-6 dark:text-white">My Order</h2>
           {cart.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400">
                <ShoppingBag size={64} className="mb-4 opacity-20" />
                <p>Your basket is empty</p>
                <Button variant="outline" onClick={() => navigate('/')} className="mt-4">Go Shopping</Button>
             </div>
           ) : (
             <div className="space-y-4">
               {cart.map(item => (
                 <div key={item.id} className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                    <div className="flex-1 flex flex-col justify-between">
                       <div className="flex justify-between">
                          <h3 className="font-bold text-gray-900 dark:text-white">{item.name}</h3>
                          <button onClick={() => updateQuantity(item.id, -item.quantity)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                       </div>
                       <div className="flex justify-between items-end">
                          <span className="font-bold text-primary text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-lg px-2 py-1">
                             <button onClick={() => updateQuantity(item.id, -1)} className="p-1"><Minus size={14} className="dark:text-white" /></button>
                             <span className="text-sm font-bold w-4 text-center dark:text-white">{item.quantity}</span>
                             <button onClick={() => updateQuantity(item.id, 1)} className="p-1"><Plus size={14} className="dark:text-white" /></button>
                          </div>
                       </div>
                    </div>
                 </div>
               ))}
               <div className="fixed bottom-24 left-4 right-4 max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between mb-2 text-gray-600 dark:text-gray-400"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                  <div className="flex justify-between mb-4 text-xl font-bold text-gray-900 dark:text-white"><span>Total</span><span>${(cartTotal + 2.50).toFixed(2)}</span></div>
                  <Button onClick={() => navigate('/checkout')} className="w-full">Checkout</Button>
               </div>
             </div>
           )}
        </div>
    );
};

const OrderSuccessScreen = () => {
    const navigate = useNavigate();
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900 text-center animate-in zoom-in">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 text-green-500">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-bold dark:text-white mb-2">Order Placed!</h2>
        <p className="text-gray-500 mb-8 max-w-xs">Your food is being prepared by the kitchen.</p>
        <Button onClick={() => navigate('/profile')} className="w-full max-w-xs">
          Track Order
        </Button>
        <button onClick={() => navigate('/')} className="mt-4 text-primary font-medium">Back to Home</button>
      </div>
    );
};

const ProfileScreen = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (darkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [darkMode]);

    // Polling for "Live" updates
    useEffect(() => {
        if(!user) return;
        const fetchOrders = () => mockOrders.getUserOrders(user.id).then(res => res.data && setOrders(res.data));
        fetchOrders();
        const interval = setInterval(fetchOrders, 5000); // Poll every 5s to see status changes
        return () => clearInterval(interval);
    }, [user]);

    if (!user) return <Navigate to="/auth" />;

    return (
    <div className="pb-24 pt-8 px-4 animate-in fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
          {user?.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-2xl font-bold dark:text-white">{user?.name}</h2>
          <p className="text-gray-500">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-4">
         <button 
           onClick={() => setDarkMode(!darkMode)}
           className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm"
         >
           <div className="flex items-center gap-3">
             {darkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-blue-500" />}
             <span className="font-medium dark:text-white">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
           </div>
         </button>

         <div className="mt-8">
           <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-lg dark:text-white">Order History</h3>
             <div className="flex items-center gap-1 text-xs text-primary animate-pulse">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                Live Updates
             </div>
           </div>
           
           {orders.length === 0 ? (
             <p className="text-gray-400 text-sm">No recent orders</p>
           ) : (
             <div className="space-y-3">
               {orders.map(order => (
                 <div key={order.id} className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                   <div className="flex justify-between mb-2">
                     <span className="font-bold text-gray-900 dark:text-white">Order #{order.id.slice(-4)}</span>
                     <span className={`font-bold text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                       order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                       order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                       'bg-blue-100 text-blue-600'
                     }`}>
                       {order.status !== 'delivered' && <Loader2 size={10} className="animate-spin" />}
                       {order.status.toUpperCase()}
                     </span>
                   </div>
                   <div className="text-sm text-gray-500 flex justify-between">
                     <span>{order.items.length} items • {new Date(order.date).toLocaleDateString()}</span>
                     <span className="font-bold">${order.total.toFixed(2)}</span>
                   </div>
                 </div>
               ))}
             </div>
           )}
         </div>

         <button 
           onClick={() => { logout(); navigate('/auth'); }}
           className="w-full flex items-center gap-3 p-4 text-red-500 font-medium mt-4"
         >
           <LogOut size={20} /> Sign Out
         </button>
      </div>
    </div>
    );
};

const AdminScreen = () => <div className="p-4">Admin Dashboard</div>;

// --- App Root ---
export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 font-sans max-w-md mx-auto shadow-2xl overflow-hidden relative">
               <Suspense fallback={<ScreenLoader />}>
                 <Routes>
                    <Route path="/auth" element={<AuthScreen />} />
                    <Route path="/" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
                    <Route path="/details/:id" element={<ProtectedRoute><ProductDetailsScreen /></ProtectedRoute>} />
                    <Route path="/cart" element={<ProtectedRoute><CartScreen /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><CheckoutScreen /></ProtectedRoute>} />
                    <Route path="/order-success" element={<ProtectedRoute><OrderSuccessScreen /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute><AdminScreen /></ProtectedRoute>} />
                 </Routes>
               </Suspense>
               <BottomNav />
            </div>
          </CartProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}
