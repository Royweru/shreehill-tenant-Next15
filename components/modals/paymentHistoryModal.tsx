'use client'
import React, { useState, useMemo } from 'react';
import { 
  X, 
  Download, 
  Search, 
  Filter,
  Calendar,
  CreditCard,
  Phone,
  Receipt,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  
  DollarSign
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { usePaymentHistory } from '@/hooks/usePayments';







interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState('-payment_date');

  // Build filters object
  const filters = useMemo(() => ({
    search: searchQuery,
    payment_status: selectedStatus !== 'all' ? selectedStatus : undefined,
    payment_method: selectedMethod !== 'all' ? selectedMethod : undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    ordering: sortBy,
  }), [searchQuery, selectedStatus, selectedMethod, dateFrom, dateTo, sortBy]);

  const { data, isLoading, error } = usePaymentHistory(currentPage, pageSize, filters);
 type StatusConfig ='completed' |'pending' |'failed' |'cancelled'
  const getStatusDisplay = (status: StatusConfig) => {
   
    const statusConfig = {
      completed: { color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle, text: 'Completed' },
      pending: { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: Clock, text: 'Pending' },
      failed: { color: 'text-red-600 bg-red-50 border-red-200', icon: AlertTriangle, text: 'Failed' },
      cancelled: { color: 'text-gray-600 bg-gray-50 border-gray-200', icon: X, text: 'Cancelled' }
    };
    return statusConfig[status as StatusConfig] || statusConfig.pending;
  };

  const getMethodDisplay = (method: string) => {
    const methodConfig = {
      mpesa: { icon: Phone, text: 'M-Pesa', color: 'text-green-600' },
      bank_transfer: { icon: CreditCard, text: 'Bank Transfer', color: 'text-blue-600' },
      cash: { icon: DollarSign, text: 'Cash', color: 'text-purple-600' },
      cheque: { icon: Receipt, text: 'Cheque', color: 'text-orange-600' }
    };
    return methodConfig[method as keyof typeof methodConfig] || { icon: Receipt, text: method, color: 'text-gray-600' };
  };

  const handleExportData = () => {
    // Mock export functionality
    const csvContent = [
      'Date,Reference,Amount,Method,Status,Bill,Receipt',
      ...(data?.results || []).map(payment => 
        `${new Date(payment.payment_date).toLocaleDateString()},${payment.payment_reference},${payment.amount_paid},${payment.payment_method},${payment.payment_status},${payment.bill_description},${payment.mpesa_receipt || ''}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedMethod('all');
    setDateFrom('');
    setDateTo('');
    setSortBy('-payment_date');
    setCurrentPage(1);
  };

  const totalPages = data ? Math.ceil(data.count / pageSize) : 1;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Payment History</h2>
            <p className="text-gray-600 mt-1">
              {data?.count ? `${data.count} total payments` : 'Loading payments...'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters Section */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Method Filter */}
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Methods</option>
              <option value="mpesa">M-Pesa</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="-payment_date">Latest First</option>
              <option value="payment_date">Oldest First</option>
              <option value="-amount_paid">Highest Amount</option>
              <option value="amount_paid">Lowest Amount</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Filters */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">From:</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <label className="text-sm font-medium text-gray-700 ml-4">To:</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading payments...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Payments</h3>
              <p className="text-gray-600">Failed to load payment history. Please try again.</p>
            </div>
          ) : !data?.results?.length ? (
            <div className="text-center py-12">
              <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Payments Found</h3>
              <p className="text-gray-600">No payments match your current filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.results.map((payment) => {
                const statusDisplay = getStatusDisplay(payment.payment_status as StatusConfig);
                const methodDisplay = getMethodDisplay(payment.payment_method);
                const StatusIcon = statusDisplay.icon;
                const MethodIcon = methodDisplay.icon;

                return (
                  <div
                    key={payment.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-full ${statusDisplay.color.split(' ')[1]} ${statusDisplay.color.split(' ')[2]}`}>
                          <StatusIcon className={`w-5 h-5 ${statusDisplay.color.split(' ')[0]}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {payment.bill_description}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Bill: {payment.bill?.bill_number} • Ref: {payment.payment_reference}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusDisplay.color}`}>
                              {statusDisplay.text}
                            </span>
                            <span className={`inline-flex items-center text-sm ${methodDisplay.color}`}>
                              <MethodIcon className="w-4 h-4 mr-1" />
                              {methodDisplay.text}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(payment.amount_paid)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(payment.payment_date).toLocaleDateString('en-KE', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(payment.payment_date).toLocaleTimeString('en-KE', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Additional Details */}
                    {(payment.mpesa_receipt || payment.transaction_id || payment.notes) && (
                      <div className="border-t border-gray-100 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {payment.mpesa_receipt && (
                            <div>
                              <span className="font-medium text-gray-700">M-Pesa Receipt:</span>
                              <p className="text-gray-900">{payment.mpesa_receipt}</p>
                            </div>
                          )}
                          {payment.transaction_id && (
                            <div>
                              <span className="font-medium text-gray-700">Transaction ID:</span>
                              <p className="text-gray-900">{payment.transaction_id}</p>
                            </div>
                          )}
                          {payment.notes && (
                            <div>
                              <span className="font-medium text-gray-700">Notes:</span>
                              <p className="text-gray-900">{payment.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {data && data.results.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, data.count)} of {data.count} payments
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-3 py-1 text-sm rounded ${
                          currentPage === pageNumber
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
