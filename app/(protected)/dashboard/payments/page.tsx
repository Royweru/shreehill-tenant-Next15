"use client";
import React, { useState, useMemo } from "react";
import {
  CreditCard,
  DollarSign,
  Calendar,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  Search,
  Filter,
  Download,
  Phone,
  Receipt,
} from "lucide-react";
import {
  usePayments,
  useRecentPayments,
  useMpesaPayment,
  usePaymentAnalytics,
} from "@/hooks/usePayments";

import { usePaymentHistoryModal } from "@/modalHooks/usePaymentHistoryModal";
import { useBills, useBillSummary } from "@/hooks/useBills";
import { PaymentHistoryModal } from "@/components/modals/paymentHistoryModal";
import { formatCurrency } from "@/lib/utils";
import { useMpesaPaymentModal } from "@/modalHooks/useMpesaPaymentModal";
const PaymentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  // Data fetching
  const { data: summary, isLoading: summaryLoading } = useBillSummary();
  const { data: billsData, isLoading: billsLoading } = useBills({
    status: "pending",
  });
  const { data: recentPayments } = useRecentPayments();
  const { data: analytics } = usePaymentAnalytics();
  const { onOpen: openMpesaPaymentModal } = useMpesaPaymentModal();
  const mpesaPayment = useMpesaPayment();

  const {
    isOpen: isPaymentHistoryOpen,
    onOpen: openPaymentHistory,
    onClose: closePaymentHistory,
  } = usePaymentHistoryModal();
  // Calculations for dashboard stats
  const dashboardStats = useMemo(() => {
    if (!summary) return null;

    const currentBalance = parseFloat(summary.current_balance || "0");
    const overdueAmount = parseFloat(summary.overdue_amount || "0");
    const totalPaid = parseFloat(summary.total_paid_this_year || "0");

    return {
      currentBalance,
      overdueAmount,
      totalPaid,
      nextDueDate: summary.next_due_date,
      pendingCount: summary.bill_counts?.pending || 0,
      overdueCount: summary.bill_counts?.overdue || 0,
      paidCount: summary.bill_counts?.paid || 0,
    };
  }, [summary]);

  // Handle M-Pesa payment
  const handleMpesaPayment = async (
    billId: string,
    amount: any,
    phoneNumber: string
  ) => {
    try {
      await mpesaPayment.mutateAsync({
        bill_id: billId,
        amount: amount.toString(),
        phone_number: phoneNumber,
      });
      setShowPaymentModal(false);
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  // Get status color and icon
  type paymentsPageStatusDisplayType =
    | "pending"
    | "paid"
    | "overdue"
    | "partial";
  const getStatusDisplay = (status: any) => {
    const statusConfig = {
      pending: {
        color: "text-yellow-600 bg-yellow-50",
        icon: Clock,
        text: "Pending",
      },
      paid: {
        color: "text-green-600 bg-green-50",
        icon: CheckCircle,
        text: "Paid",
      },
      overdue: {
        color: "text-red-600 bg-red-50",
        icon: AlertTriangle,
        text: "Overdue",
      },
      partial: {
        color: "text-blue-600 bg-blue-50",
        icon: CreditCard,
        text: "Partial",
      },
    };

    return (
      statusConfig[status as paymentsPageStatusDisplayType] ||
      statusConfig.pending
    );
  };

  if (summaryLoading || billsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Payments Dashboard
        </h1>
        <p className="text-gray-600">Manage your rent and bill payments</p>
      </div>

      {/* Dashboard Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <span
              className={`text-sm px-2 py-1 rounded ${
                (dashboardStats?.currentBalance as number) > 0
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-600"
              }`}
            >
              {(dashboardStats?.currentBalance as number) > 0
                ? "Balance Due"
                : "Paid Up"}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(dashboardStats?.currentBalance)}
          </h3>
          <p className="text-gray-600 text-sm">Current Balance</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-sm text-red-600">
              {dashboardStats?.overdueCount} bills
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(dashboardStats?.overdueAmount)}
          </h3>
          <p className="text-gray-600 text-sm">Overdue Amount</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600">
              {dashboardStats?.paidCount} paid
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(dashboardStats?.totalPaid)}
          </h3>
          <p className="text-gray-600 text-sm">Paid This Year</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">
              {dashboardStats?.nextDueDate
                ? new Date(dashboardStats.nextDueDate).toLocaleDateString()
                : "No due date"}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {dashboardStats?.nextDueDate
              ? `${Math.ceil(
                  (new Date(dashboardStats.nextDueDate).getTime() -
                    new Date().getTime()) /
                    (1000 * 3600 * 24)
                )} days`
              : "N/A"}
          </h3>
          <p className="text-gray-600 text-sm">Next Payment Due</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search bills or payments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Outstanding Bills */}
        <div className="xl:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Outstanding Bills
              </h2>
              <span className="text-sm text-gray-500">
                {billsData?.results?.length || 0} pending
              </span>
            </div>
          </div>

          <div className="p-6">
            {billsData && billsData?.results?.length > 0 ? (
              <div className="space-y-4">
                {billsData.results.slice(0, 5).map((bill) => {
                  const statusDisplay = getStatusDisplay(bill.status);
                  const StatusIcon = statusDisplay.icon;

                  return (
                    <div
                      key={bill.id}
                      className="flex items-center justify-between p-4
                     bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-2 rounded-full ${statusDisplay.color}`}
                        >
                          <StatusIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {bill.description}
                          </h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-sm text-gray-500">
                              Due:{" "}
                              {new Date(bill.due_date).toLocaleDateString()}
                            </p>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${statusDisplay.color}`}
                            >
                              {statusDisplay.text}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(bill.balance_due)}
                        </p>
                        {bill.status !== "paid" && (
                          <button
                            onClick={() => {
                              setSelectedBill(bill);
                              setShowPaymentModal(true);
                            }}
                            className="mt-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Pay Now
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  All caught up!
                </h3>
                <p className="text-gray-500">
                  You have no outstanding bills at the moment.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Payments & Quick Actions */}
        <div className="space-y-6">
          {/* Recent Payments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Payments
              </h2>
            </div>
            <div className="p-6">
              {recentPayments && recentPayments?.length > 0 ? (
                <div className="space-y-4">
                  {recentPayments.slice(0, 5).map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-50 rounded-full">
                          <Receipt className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {payment.bill_description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(
                              payment.payment_date
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 text-sm">
                          {formatCurrency(payment.amount_paid)}
                        </p>
                        <p className="text-xs text-green-600 capitalize">
                          {payment.payment_method.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No recent payments
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Quick Actions
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <button
                className="w-full flex items-center justify-center
               gap-2 py-3 px-4 bg-green-600 text-white rounded-lg
                hover:bg-green-700 transition-colors"
                onClick={openMpesaPaymentModal}
              >
                <Phone className="w-5 h-5" />
                Pay with M-Pesa
              </button>
              <button
                onClick={openPaymentHistory}
                className="w-full flex items-center justify-center gap-2 
                  py-3 px-4 bg-purple-600 text-white rounded-lg
                 hover:bg-purple-700 transition-colors"
              >
                <Calendar className="w-5 h-5" />
                Payment History
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* M-Pesa Payment Modal */}
      {showPaymentModal && selectedBill && (
        <PaymentModal
          bill={selectedBill}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedBill(null);
          }}
          onPayment={handleMpesaPayment}
          isLoading={mpesaPayment.isPending}
        />
      )}

      {/*  Payment history Modal */}
      <PaymentHistoryModal
        isOpen={isPaymentHistoryOpen}
        onClose={closePaymentHistory}
      />
    </div>
  );
};

// Payment Modal Component
const PaymentModal = ({
  bill,
  onClose,
  onPayment,
  isLoading,
}: {
  bill: Bill;
  onClose: () => void;
  onPayment: (billId: string, amount: any, phoneNumber: string) => void;
  isLoading?: boolean;
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState(bill.balance_due);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber && amount > 0) {
      onPayment(bill.id, amount, phoneNumber);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              M-Pesa Payment
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">
              {bill.description}
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Balance Due:</span>
              <span className="font-medium">
                {formatCurrency(bill.balance_due)}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">Due Date:</span>
              <span>{new Date(bill.due_date).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="254712345678"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your M-Pesa registered phone number
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                min="1"
                max={bill.balance_due}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !phoneNumber || amount <= 0}
              className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Processing..." : `Pay ${formatCurrency(amount)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentsPage;
