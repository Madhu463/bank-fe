import React from "react";
import { useState } from 'react';

export default function Component() {
  const [senderAccount, setSenderAccount] = useState('');
  const [receiverAccount, setReceiverAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleTransfer = () => {
    if (!senderAccount || !receiverAccount || !amount || !transactionType) {
      alert('Please fill all the details before transferring.');
      return;
    }

    setShowConfirmation(true);
  };

  const confirmTransfer = () => {
    const newTransaction = {
      senderAccount,
      receiverAccount,
      amount,
      transactionType,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      status: 'Successful', // Assuming status starts as pending
    };

    setTransactions([...transactions, newTransaction]);
    // Clear input fields after transfer
    setSenderAccount('');
    setReceiverAccount('');
    setAmount('');
    setTransactionType('');
    setShowConfirmation(false);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (transactionTypeFilter && transactionTypeFilter !== 'All' && transaction.transactionType !== transactionTypeFilter) {
      return false;
    }
    if (dateRangeFilter && new Date(transaction.date).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' }) !== dateRangeFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Transactions</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="sender-account">
              Sender Account Number
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              id="sender-account"
              placeholder="ACC123"
              type="text"
              value={senderAccount}
              onChange={(e) => setSenderAccount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="receiver-account">
              Receiver Account Number
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              id="receiver-account"
              placeholder="ACC456"
              type="text"
              value={receiverAccount}
              onChange={(e) => setReceiverAccount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="amount">
              Amount
            </label>
            <div className="flex items-center">
              <input
                className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                id="amount"
                placeholder="100.00"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="ml-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="transaction-type">
              Transaction Type
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              id="transaction-type"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <option value="">Select Transaction Type</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end mb-6">
  <button
    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
    onClick={handleTransfer}
  >
    Transfer
  </button>
</div>

        {showConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-8 rounded-md shadow-md">
              <h2 className="text-xl font-bold mb-4">Transfer Summary</h2>
              <p>Sender Account: {senderAccount}</p>
              <p>Receiver Account: {receiverAccount}</p>
              <p>Amount: {amount}</p>
              <p>Transaction Type: {transactionType}</p>
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md ml-4"
                  onClick={confirmTransfer}
                >
                  Confirm
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md ml-4"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Transaction History</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                  id="transaction-type-filter"
                  value={transactionTypeFilter}
                  onChange={(e) => setTransactionTypeFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
              </div>
              <div className="relative">
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                  id="date-range-filter"
                  type="month"
                  value={dateRangeFilter}
                  onChange={(e) => setDateRangeFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="px-4 py-2 text-left text-sm font-medium">S.No.</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Sender Account</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Receiver Account</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Transaction Type</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Amount</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Time</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <tr key={index} className="border-b dark:border-gray-700">
                    <td className="px-4 py-2 text-sm">{index + 1}</td>
                    <td className="px-4 py-2 text-sm">{transaction.senderAccount}</td>
                    <td className="px-4 py-2 text-sm">{transaction.receiverAccount}</td>
                    <td className="px-4 py-2 text-sm">{transaction.transactionType}</td>
                    <td className="px-4 py-2 text-sm">{transaction.amount}</td>
                    <td className="px-4 py-2 text-sm">{transaction.date}</td>
                    <td className="px-4 py-2 text-sm">{transaction.time}</td>
                    <td className="px-4 py-2 text-sm">{transaction.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
