
import React, { useState } from 'react';
import { CreditCard, Lock } from 'lucide-react';
import { Button } from './Button';

interface PaymentFormProps {
  amount: number;
  onSubmit: (cardDetails: { last4: string }) => Promise<void>;
  isLoading: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ amount, onSubmit, isLoading }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    }
    return value;
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/[^0-9]/g, '');
    if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
    setExpiry(v);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.length < 16 || expiry.length < 5 || cvc.length < 3 || !name) return;
    onSubmit({ last4: cardNumber.slice(-4) });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 animate-in slide-in-from-bottom-10">
      <div className="flex items-center justify-between mb-6">
         <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
            <CreditCard size={20} className="text-primary" /> Card Details
         </h3>
         <div className="flex gap-2">
           <div className="h-6 w-10 bg-gray-200 rounded"></div>
           <div className="h-6 w-10 bg-gray-200 rounded"></div>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
           <label className="block text-xs font-medium text-gray-500 mb-1">Cardholder Name</label>
           <input 
             type="text" required
             value={name} onChange={e => setName(e.target.value)}
             placeholder="John Doe"
             className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-xl dark:text-white border-none focus:ring-2 focus:ring-primary"
           />
        </div>
        
        <div>
           <label className="block text-xs font-medium text-gray-500 mb-1">Card Number</label>
           <div className="relative">
             <input 
               type="text" required maxLength={19}
               value={cardNumber} onChange={handleCardChange}
               placeholder="0000 0000 0000 0000"
               className="w-full pl-10 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl dark:text-white border-none focus:ring-2 focus:ring-primary font-mono"
             />
             <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
           </div>
        </div>

        <div className="flex gap-4">
           <div className="flex-1">
             <label className="block text-xs font-medium text-gray-500 mb-1">Expiry Date</label>
             <input 
               type="text" required maxLength={5}
               value={expiry} onChange={handleExpiryChange}
               placeholder="MM/YY"
               className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-xl dark:text-white border-none focus:ring-2 focus:ring-primary text-center"
             />
           </div>
           <div className="flex-1">
             <label className="block text-xs font-medium text-gray-500 mb-1">CVC / CWW</label>
             <div className="relative">
                <input 
                  type="password" required maxLength={4}
                  value={cvc} onChange={e => setCvc(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="123"
                  className="w-full pl-8 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl dark:text-white border-none focus:ring-2 focus:ring-primary text-center"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
             </div>
           </div>
        </div>

        <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
          Pay ${amount.toFixed(2)}
        </Button>
        
        <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
          <Lock size={12} /> Secure 256-bit SSL Encrypted payment
        </p>
      </form>
    </div>
  );
};
