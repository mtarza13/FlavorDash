
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Phone, CreditCard, Banknote, Check, AlertCircle, ShoppingBag, Truck, Receipt } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { mockOrders } from '../services/mockApi';
import { Button } from '../components/Button';
import { PaymentForm } from '../components/PaymentForm';

// Steps: 1=Delivery, 2=Payment, 3=Review
type CheckoutStep = 1 | 2 | 3;

export const CheckoutScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();
  
  const [step, setStep] = useState<CheckoutStep>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [address, setAddress] = useState('123 Main St, New York, NY');
  const [phone, setPhone] = useState(user?.phone || '');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'apple_pay'>('card');
  const [cardData, setCardData] = useState<{ last4: string } | null>(null);

  // Totals
  const deliveryFee = 2.50;
  const tax = cartTotal * 0.08;
  const finalTotal = cartTotal + deliveryFee + tax;

  // Handlers
  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !phone) {
      setError('Please fill in all delivery details.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleCardSuccess = async (data: { last4: string }) => {
    // In a real app, this would tokenise the card. 
    // Here we just save the state and move to review.
    setCardData(data);
    setStep(3);
  };

  const handleCashSelection = () => {
    setPaymentMethod('cash');
    setCardData(null);
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      const res = await mockOrders.create({
        userId: user.id,
        items: cart,
        subtotal: cartTotal,
        address,
        phone,
        instructions,
        paymentMethod,
        cardLast4: cardData?.last4
      });

      if (res.success) {
        clearCart();
        navigate('/order-success');
      } else {
        setError(res.message || 'Order failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // --- Step Components ---

  const StepIndicator = () => (
    <div className="flex justify-between mb-8 px-4">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
            step >= s ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
          }`}>
            {step > s ? <Check size={16} /> : s}
          </div>
          <span className={`text-xs mt-1 ${step >= s ? 'text-primary font-medium' : 'text-gray-400'}`}>
            {s === 1 ? 'Delivery' : s === 2 ? 'Payment' : 'Review'}
          </span>
        </div>
      ))}
      <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -z-10 mt-4" /> {/* Simple connector line idea */}
    </div>
  );

  return (
    <div className="pb-24 pt-4 px-4 min-h-screen bg-gray-50 dark:bg-gray-900 animate-in slide-in-from-right">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => step > 1 ? setStep((s) => s - 1 as CheckoutStep) : navigate('/cart')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
           <ChevronLeft size={24} className="dark:text-white" />
        </button>
        <h2 className="text-2xl font-bold dark:text-white">Checkout</h2>
      </div>

      <StepIndicator />

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-2 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* STEP 1: DELIVERY */}
      {step === 1 && (
        <form onSubmit={handleDeliverySubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <section className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold mb-4 dark:text-white flex items-center gap-2">
              <MapPin size={20} className="text-primary" /> Delivery Details
            </h3>
            
            <div className="space-y-4">
               <div>
                 <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Delivery Address</label>
                 <input 
                   type="text" required
                   value={address} onChange={e => setAddress(e.target.value)}
                   className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl dark:text-white border-none focus:ring-2 focus:ring-primary"
                   placeholder="Street, City, Zip"
                 />
               </div>
               
               <div>
                 <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Phone Number</label>
                 <input 
                   type="tel" required
                   value={phone} onChange={e => setPhone(e.target.value)}
                   className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl dark:text-white border-none focus:ring-2 focus:ring-primary"
                   placeholder="+1 234 567 8900"
                 />
               </div>

               <div>
                 <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Delivery Instructions (Optional)</label>
                 <textarea 
                   value={instructions} onChange={e => setInstructions(e.target.value)}
                   className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl dark:text-white border-none focus:ring-2 focus:ring-primary h-24 resize-none"
                   placeholder="Gate code, leave at door..."
                 />
               </div>
            </div>
          </section>
          
          <Button type="submit" className="w-full py-4 text-lg">Next: Payment</Button>
        </form>
      )}

      {/* STEP 2: PAYMENT */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
           <section className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold mb-4 dark:text-white flex items-center gap-2">
              <CreditCard size={20} className="text-primary" /> Select Method
            </h3>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
               <button
                 type="button"
                 onClick={() => setPaymentMethod('card')}
                 className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                   paymentMethod === 'card' 
                   ? 'border-primary bg-orange-50 dark:bg-primary/10 text-primary' 
                   : 'border-gray-100 dark:border-gray-700 text-gray-500'
                 }`}
               >
                 <CreditCard size={24} />
                 <span className="font-bold text-sm">Credit Card</span>
               </button>

               <button
                 type="button"
                 onClick={() => setPaymentMethod('cash')}
                 className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                   paymentMethod === 'cash' 
                   ? 'border-primary bg-orange-50 dark:bg-primary/10 text-primary' 
                   : 'border-gray-100 dark:border-gray-700 text-gray-500'
                 }`}
               >
                 <Banknote size={24} />
                 <span className="font-bold text-sm">Cash on Delivery</span>
               </button>
            </div>

            {paymentMethod === 'card' ? (
               <div className="animate-in fade-in">
                  <p className="text-sm text-gray-500 mb-4 text-center">Enter your card details to proceed.</p>
                  <PaymentForm 
                     amount={finalTotal}
                     isLoading={false}
                     onSubmit={handleCardSuccess} // In this wizard, this moves to next step
                  />
               </div>
            ) : (
               <div className="text-center py-6 animate-in fade-in">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600">
                    <Banknote size={32} />
                  </div>
                  <p className="font-medium dark:text-white">Pay cash when your food arrives.</p>
                  <p className="text-sm text-gray-500 mt-1">Please have exact change if possible.</p>
                  
                  <Button onClick={handleCashSelection} className="w-full mt-6 py-4">Review Order</Button>
               </div>
            )}
          </section>
        </div>
      )}

      {/* STEP 3: REVIEW */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
           <section className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold mb-6 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-4">
                 <Receipt size={20} className="text-primary" /> Order Summary
              </h3>

              {/* Items */}
              <div className="space-y-3 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-bold dark:text-white">x{item.quantity}</span>
                      <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                    </div>
                    <span className="font-medium dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-700 text-sm">
                 <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-gray-500">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-gray-500">
                    <span className="flex items-center gap-1"><Truck size={14} /> Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-100 dark:border-gray-700">
                    <span className="font-bold text-lg dark:text-white">Total</span>
                    <span className="font-bold text-2xl text-primary">${finalTotal.toFixed(2)}</span>
                 </div>
              </div>
           </section>

           <section className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-sm">
              <div className="flex justify-between items-start mb-4">
                 <div>
                   <p className="text-gray-500 text-xs uppercase font-bold mb-1">Delivering To</p>
                   <p className="dark:text-white font-medium">{address}</p>
                   <p className="text-gray-400">{phone}</p>
                 </div>
                 <button onClick={() => setStep(1)} className="text-primary text-xs font-bold">Edit</button>
              </div>
              <div className="flex justify-between items-start">
                 <div>
                   <p className="text-gray-500 text-xs uppercase font-bold mb-1">Payment Method</p>
                   <p className="dark:text-white font-medium capitalize flex items-center gap-2">
                     {paymentMethod === 'card' ? <CreditCard size={14}/> : <Banknote size={14} />}
                     {paymentMethod} {cardData && `(**** ${cardData.last4})`}
                   </p>
                 </div>
                 <button onClick={() => setStep(2)} className="text-primary text-xs font-bold">Edit</button>
              </div>
           </section>

           <Button onClick={handlePlaceOrder} isLoading={loading} className="w-full py-4 text-lg shadow-xl shadow-primary/30">
             Place Order
           </Button>
        </div>
      )}
    </div>
  );
};
export default CheckoutScreen;
