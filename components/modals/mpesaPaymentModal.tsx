'use client'
import { useMpesaPayment } from "@/hooks/useMpesa";
import { formatCurrency } from "@/lib/utils";
import { AlertCircle, CheckCircle, RefreshCw, Smartphone, X } from "lucide-react";
import { useState } from "react";

interface MpesaPaymentModalProps{
    isOpen:boolean,
    onClose:()=>void,
    bills:Bill[],
    onSuccess:()=>void
}
export const MpesaPaymentModal = ({ isOpen, onClose, bills, onSuccess }:MpesaPaymentModalProps) => {
  const [selectedBill, setSelectedBill] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('form'); // form, processing, success, error
  const {mutateAsync}=useMpesaPayment()
  const selectedBillData = bills.find(bill => bill.id === selectedBill);

  // In your modal component
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedBill || !phoneNumber || !amount) return;
  setLoading(true);
  setStep('processing');  
  try {
    const paymentData = {
      bill_id: selectedBill,
      phone_number: phoneNumber,
      amount: parseFloat(amount),
    };
    
    console.log('Sending payment data:', paymentData);
    
    const result = await mutateAsync(paymentData);
    console.log('Payment result:', result);
    
    setStep('success');
    onSuccess?.();
  } catch (error:any) {
    console.error('Payment submission error:', error);
    console.error('Error response:', error?.response);
    console.error('Error data:', error?.response?.data);
    setStep('error');
  } finally {
    setLoading(false);
  }
};
  const handleClose = () => {
    setStep('form');
    setSelectedBill('');
    setPhoneNumber('');
    setAmount('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Smartphone className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">M-Pesa Payment</h3>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Bill</label>
              <select
                value={selectedBill}
                onChange={(e) => {
                  setSelectedBill(e.target.value);
                  const bill = bills.find(b => b.id === e.target.value);
                  if (bill) setAmount(bill.balance_due.toString());
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose a bill...</option>
                {bills.map((bill) => (
                  <option key={bill.id} value={bill.id}>
                    {bill.description} - {formatCurrency(bill.balance_due)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">M-Pesa Phone</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="254712345678"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (KES)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                max={selectedBillData?.balance_due || 999999}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {selectedBillData && (
                <p className="text-xs text-gray-500 mt-1">
                  Maximum: {formatCurrency(selectedBillData.balance_due)}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
              Pay with M-Pesa
            </button>
          </form>
        )}

        {step === 'processing' && (
          <div className="text-center py-8">
            <RefreshCw className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Processing Payment</h4>
            <p className="text-gray-600 mb-4">Check your phone for M-Pesa prompt</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                Enter your M-Pesa PIN when prompted. This may take a few moments.
              </p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h4>
            <p className="text-gray-600 mb-4">Your payment has been processed</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-green-800">
                <strong>Receipt:</strong> QGH7XY89
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        )}

        {step === 'error' && (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Payment Failed</h4>
            <p className="text-gray-600 mb-4">Unable to process payment. Please try again.</p>
            <div className="space-y-2">
              <button
                onClick={() => setStep('form')}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700"
              >
                Try Again
              </button>
              <button
                onClick={handleClose}
                className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
