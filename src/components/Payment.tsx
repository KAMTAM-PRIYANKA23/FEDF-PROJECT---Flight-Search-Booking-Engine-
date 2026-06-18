import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  CheckCircle, 
  ArrowRight, 
  DollarSign, 
  FileText, 
  User, 
  Calendar, 
  AlertCircle 
} from 'lucide-react';

interface PaymentProps {
  totalAmount: number;
  flightAirline: string;
  flightNo: string;
  onSuccess: (cardNumber: string) => void;
  onBeforeSubmit?: () => boolean;
}

export default function Payment({ 
  totalAmount, 
  flightAirline, 
  flightNo, 
  onSuccess,
  onBeforeSubmit
}: PaymentProps) {
  const navigate = useNavigate();
  
  // Card Inputs state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  // UI States
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [validationError, setValidationError] = useState('');
  const [mockTxId, setMockTxId] = useState('');

  // Auto-detect Card Brand
  const getCardBrand = () => {
    const cleanNum = cardNumber.replace(/\D/g, '');
    if (cleanNum.startsWith('4')) return 'Visa';
    if (cleanNum.startsWith('5')) return 'Mastercard';
    if (cleanNum.startsWith('3')) return 'American Express';
    return 'Generic';
  };

  // Formatting Card Number: xxxx xxxx xxxx xxxx
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    
    // Add spaces every 4 digits
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
    if (validationError) setValidationError('');
  };

  // Formatting Expiry: MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardExpiry(value);
    if (validationError) setValidationError('');
  };

  // Validate inputs
  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check parent pre-validation first
    if (onBeforeSubmit && !onBeforeSubmit()) {
      return;
    }

    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (cleanNumber.length < 16) {
      setValidationError('Please specify a valid 16-digit credit card number.');
      return;
    }
    if (!cardName.trim()) {
      setValidationError('Cardholder name is required.');
      return;
    }
    if (cardExpiry.length < 5) {
      setValidationError('Expiration date must be in MM/YY format.');
      return;
    }
    
    // Validating expiration month range
    const month = parseInt(cardExpiry.split('/')[0], 10);
    if (month < 1 || month > 12) {
      setValidationError('Invalid expiration month. Must be 01 - 12.');
      return;
    }
    
    if (cardCvv.length < 3) {
      setValidationError('CVV code must be at least 3 digits.');
      return;
    }

    // Set errors empty and run mock loader sequence
    setValidationError('');
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const generatedTx = 'TXN-' + Math.floor(10000000 + Math.random() * 90000000).toString();
      setMockTxId(generatedTx);
      setShowSuccessPopup(true);
    }, 2000);
  };

  // Countdown timer redirect effect
  useEffect(() => {
    if (showSuccessPopup && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showSuccessPopup && countdown === 0) {
      // Execute booking pipeline submission once countdown drops
      onSuccess(cardNumber);
    }
  }, [showSuccessPopup, countdown]);

  const handleImmediateRedirect = () => {
    onSuccess(cardNumber);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
      
      {/* Header Accent block */}
      <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-sky-400" />
          <span className="font-extrabold text-xs tracking-widest uppercase font-mono">Mock Card Payment Gateway</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>SSL Secured</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Interactive Live Card Visualizer */}
        <div className="relative h-44 sm:h-48 w-full rounded-2xl bg-gradient-to-tr from-slate-905 via-slate-800 to-sky-950 p-6 text-white shadow-lg overflow-hidden flex flex-col justify-between max-w-sm mx-auto border border-slate-700/50">
          
          {/* Shimmer background rings */}
          <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 w-32 h-32 rounded-full border border-white/5 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 translate-y-6 -translate-x-6 w-44 h-44 rounded-full border border-sky-450/10 pointer-events-none"></div>

          {/* Top Info section */}
          <div className="flex justify-between items-start z-10">
            <div>
              <span className="text-[8px] font-mono tracking-widest text-slate-400 uppercase">SkyWings Corporate Platinum</span>
              <h4 className="text-xs font-bold mt-1 text-slate-100">{flightAirline || 'SkyWings Premium'}</h4>
            </div>
            
            {/* Dynamic Card Brand Label badge */}
            <span className="text-[10px] font-mono font-extrabold bg-white/10 px-2 py-0.5 rounded border border-white/10">
              {getCardBrand()}
            </span>
          </div>

          {/* Chip and card number spacing visualizer */}
          <div className="z-10 space-y-1">
            <div className="w-9 h-7 bg-amber-400/85 rounded-md border border-amber-300 pointer-events-none shadow-xs mb-2"></div>
            <p className="text-base sm:text-lg font-mono font-extrabold tracking-widest text-slate-100">
              {cardNumber || '•••• •••• •••• ••••'}
            </p>
          </div>

          {/* Cardholder name and Expiry block */}
          <div className="flex justify-between items-end z-10 text-xs font-mono">
            <div>
              <span className="text-[7px] text-slate-400 block uppercase">Cardholder Name</span>
              <span className="truncate max-w-[150px] block font-semibold text-slate-200">
                {cardName.toUpperCase() || 'MEMBER ACCOUNT'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[7px] text-slate-400 block uppercase text-right">EXPIRES</span>
              <span className="font-semibold text-slate-200">{cardExpiry || 'MM/YY'}</span>
            </div>
          </div>
        </div>

        {/* Validation Errors container */}
        {validationError && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-start gap-2 max-w-sm mx-auto">
            <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleCardSubmit} className="space-y-4.5 max-w-sm mx-auto">
          
          {/* 1. Cardholder Name */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">
              Cardholder Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-slate-400" />
              </span>
              <input
                type="text"
                required
                placeholder="As printed on card"
                value={cardName}
                onChange={(e) => {
                  setCardName(e.target.value);
                  if (validationError) setValidationError('');
                }}
                className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-sky-500 text-xs"
              />
            </div>
          </div>

          {/* 2. Card Number */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">
              Credit Card Number (16-Digit)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <CreditCard className="h-4 w-4 text-slate-400" />
              </span>
              <input
                type="text"
                required
                placeholder="4111 2222 3333 4444"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono tracking-wider font-semibold focus:ring-2 focus:ring-sky-500 text-xs"
              />
            </div>
          </div>

          {/* 3. Expiry and CVV Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">
                Expiration Date
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-slate-400" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="MM/YY"
                  maxLength={5}
                  value={cardExpiry}
                  onChange={handleExpiryChange}
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-center font-semibold focus:ring-2 focus:ring-sky-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">
                Security Code (CVV)
              </label>
              <input
                type="password"
                required
                placeholder="***"
                maxLength={3}
                value={cardCvv}
                onChange={(e) => {
                  setCardCvv(e.target.value.replace(/\D/g, ''));
                  if (validationError) setValidationError('');
                }}
                className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-center font-semibold focus:ring-2 focus:ring-sky-500 text-xs"
              />
            </div>
          </div>

          {/* CTA Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full mt-2 py-3.5 bg-sky-600 hover:bg-sky-550 active:bg-sky-700 text-white font-black rounded-xl transition-all shadow-md shadow-sky-600/20 text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Authorizing Bank Network...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Pay ${totalAmount} Securely
              </>
            )}
          </button>

          {/* Safe Disclaimer info */}
          <div className="text-[10px] text-slate-400 text-center leading-relaxed">
            This checkout simulates standard credit authorization loops. No real charges are executed on live financial networks. Interceptors active.
          </div>

        </form>

      </div>

      {/* --- PAYMENT SUCCESS POPUP MODAL --- */}
      <AnimatePresence>
        {showSuccessPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              className="bg-white rounded-3xl max-w-md w-full border border-slate-200 overflow-hidden shadow-2xl space-y-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            >
              {/* Green Hero head */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-750 p-6 text-white text-center relative">
                
                {/* Simulated Wave accent */}
                <div className="absolute bottom-0 inset-x-0 h-4 bg-white rounded-t-2xl"></div>

                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <CheckCircle className="w-9 h-9 text-white animate-pulse" />
                </div>
                
                <h3 className="text-xl font-extrabold">Payment Successful!</h3>
                <p className="text-xs text-emerald-100 mt-1 font-medium">Your transit seats have been securely ticketed</p>
              </div>

              {/* Transaction Metric Details block */}
              <div className="px-6 space-y-4">
                
                <div className="text-xs text-slate-500 text-center">
                  Payment of <span className="text-slate-900 font-extrabold text-sm">${totalAmount}</span> was processed correctly under reference code:
                </div>

                <div className="bg-slate-55 rounded-2xl p-4.5 border border-slate-150 space-y-3 font-medium text-xs text-slate-650">
                  
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/60">
                    <span className="text-slate-400 uppercase text-[9px] font-mono tracking-wider font-semibold">Terminal Ref Code</span>
                    <strong className="text-slate-800 font-mono tracking-wide">{mockTxId}</strong>
                  </div>

                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/60 font-sans">
                    <span className="text-slate-400 uppercase text-[9px] font-mono tracking-wider font-semibold">Airline Partner</span>
                    <strong className="text-slate-900">{flightAirline} ({flightNo})</strong>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 uppercase text-[9px] font-mono tracking-wider font-semibold">Security Guard</span>
                    <span className="font-mono text-emerald-600 font-bold flex items-center gap-1 text-[10px]">
                      <ShieldCheck className="w-3.5 h-3.5" /> Checked & Decrypted
                    </span>
                  </div>

                </div>

                <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-100 text-sky-850 text-xs text-center leading-relaxed">
                  You are being redirected to your electronic ticket page in{' '}
                  <strong className="text-sky-600 font-mono text-sm">{countdown}</strong> seconds automatically...
                </div>

              </div>

              {/* Bottom immediate direct actions */}
              <div className="px-6 pb-6 pt-2">
                <button
                  type="button"
                  onClick={handleImmediateRedirect}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  Skip Waiting & Access Ticket
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
