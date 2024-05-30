import { useEffect, useState } from "react";
import axios from "axios";
import PageTitle from "../../components/PageTitle";
import { fetchUserTransactions } from "../../utils/fetchUserTransactions";
import updateOutletContext from "../../utils/updateOutletContext";
import { useOutletContext } from "react-router-dom";
import Button from "../../components/Button";
import toast from "react-hot-toast";

export default function Component() {
  const [receiverPhone, setReceiverPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState("");
  const [accountFilter, setAccountFilter] = useState("");
  const [selectedAccount, setSelectedAccount] = useState({ id: "", type: "" });
  const [txnLoading, setTxnLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [transferMessage, setTransferMessage] = useState("");
  const [transferMessageType, setTransferMessageType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 20;
  const phoneRegex = /^\d{10}$/;
  const [profile, isLoading, transactions, setProfile, setIsLoading, setTransactions] = useOutletContext();

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!receiverPhone || !amount || !pin) {
      alert("Please fill all the details before transferring.");
      return;
    }
    if (!phoneRegex.test(receiverPhone)) {
      setTransferMessage("Receiver phone number must be 10 digits.");
      setTransferMessageType("error");
      return;
    }
    try {
      setTxnLoading(true);
      const token = localStorage.getItem("authorization");
      if (!token) {
        throw new Error("Authorization token not found.");
      }
      const requestBody = {
        amount: Number(amount),
        senderAccountId: selectedAccount.id,
        receiverPhoneNumber: Number(receiverPhone),
        pin: Number(pin),
      };
      const transferResponse = await axios.post("https://techbuzzers.somee.com/Transfer", requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Transfer completed", { duration: 5000 });
    } catch (error) {
      console.error(error.response.data);
      toast.error(error.response.data, { duration: 5000 });
    } finally {
      setTxnLoading(false);
      updateOutletContext(setProfile, setTransactions, setIsLoading);
    }
  };

  const handleSearch = async () => {
    try {
      setSearchLoading(true);
      const token = localStorage.getItem("authorization");
      if (!token) throw new Error("Unauthorized: Token not found");

      const response = await axios.get(`https://techbuzzers.somee.com/SearchUser?phone=${receiverPhone}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("User found");
      setSearchLoading(false);
    } catch (err) {
      setSearchLoading(false);
      toast.error("User not found");
    }
  };

  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    setReceiverPhone(phone);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (statusFilter && statusFilter !== "All" && transaction.status !== statusFilter) {
      return false;
    }
    if (accountFilter && transaction.debitId !== accountFilter) {
      return false;
    }
    const transactionDate = new Date(transaction.timestamp);
    const filterDate = new Date(dateRangeFilter);
    const transactionMonthYearString = `${transactionDate.getMonth() + 1}/${transactionDate.getFullYear()}`;
    const filterMonthYearString = `${filterDate.getMonth() + 1}/${filterDate.getFullYear()}`;
    if (dateRangeFilter && transactionMonthYearString !== filterMonthYearString) {
      return false;
    }
    return true;
  });
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  return (
    <div>
      <PageTitle title={"Transactions"} />
      <div className="flex flex-col gap-2 mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6">
          <div className="space-y-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-grow space-y-2">
                <label className="text-sm font-medium" htmlFor="receiver-phone">
                  Receiver Phone Number
                </label>
                <input className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200" id="receiver-phone" placeholder="Enter Receiver's Phone Number" type="tel" value={receiverPhone} onChange={handlePhoneChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="search-button">
                  &nbsp;
                </label>
                <Button title={"Search"} onClick={handleSearch} loading={searchLoading} loadingTitle={"Searching"} />
              </div>
            </div>
            {receiverPhone && !phoneRegex.test(receiverPhone) && <p className="text-red-500 text-sm">Receiver phone number must be 10 digits.</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="amount">
                  Amount
                </label>
                <input className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200" id="amount" placeholder="100" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="transaction-type">
                  Account
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200" id="transaction-type" value={selectedAccount.id} onChange={(e) => setSelectedAccount({ id: e.target.value, name: e.target.options[e.target.selectedIndex].text })}>
                  <option value="">Select Account</option>
                  {profile.accounts.map((account, index) => (
                    <option key={index} value={account.id}>
                      {account.accountName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="amount">
                  Pin
                </label>
                <input className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200" id="amount" placeholder="xxxx" type="password" value={pin} onChange={(e) => setPin(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium invisible" htmlFor="transfer-button">
                  &nbsp;
                </label>
                <Button title={"Transfer"} onClick={handleTransfer} loading={txnLoading} loadingTitle={"Transfering"} />
              </div>
            </div>
            {transferMessage && (
              <div className={`text-sm mt-4 ${transferMessageType === "success" ? "text-green-500" : "text-red-500"}`}>
                {transferMessageType === "success" ? (
                  <div>
                    <span>✔️ </span>
                    {transferMessage}
                  </div>
                ) : (
                  <div>
                    <span>❌ </span>
                    {transferMessage}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Transaction History</h2>
            <div className="flex items-center space-x-4">
            <div className="relative">
            <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200" id="account-filter" value={accountFilter} onChange={(e) => setAccountFilter(e.target.value)}>
            <option value="">Account</option>
            {profile.accounts.map((account, index) => (
            <option key={index} value={account.id}>
            {account.accountName}
           </option>))}
           </select>
          </div>
              <div className="relative">
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200" id="status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">Status</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="relative">
                <input className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200" id="date-range-filter" type="month" value={dateRangeFilter} onChange={(e) => setDateRangeFilter(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="px-4 py-2 text-left text-sm font-medium">S.No.</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Transaction Id</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Receiver AccountId</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Transaction Type</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Amount</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Time</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((transaction, index) => (
                  <tr key={index} className="border-b dark:border-gray-700">
                    <td className="px-4 py-2 text-sm">{index + 1}</td>
                    <td className="px-4 py-2 text-sm">{transaction.id}</td>
                    <td className="px-4 py-2 text-sm">{transaction.creditId}</td>
                    <td className="px-4 py-2 text-sm">{transaction.transactionType}</td>
                    <td className="px-4 py-2 text-sm">{transaction.amount}</td>
                    <td className="px-4 py-2 text-sm">{new Date(transaction.timestamp).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-sm">{new Date(transaction.timestamp).toLocaleTimeString()}</td>
                    <td className="px-4 py-2 text-sm">{transaction.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
              <button onClick={prevPage} disabled={currentPage === 1} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 disabled:opacity-50">
                Previous
              </button>
              <div>
                Page {currentPage} of {Math.ceil(filteredTransactions.length / transactionsPerPage)}
              </div>
              <button onClick={nextPage} disabled={indexOfLastTransaction >= filteredTransactions.length} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 disabled:opacity-50">
                Next
              </button>
            </div>
            {transactions.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">No transactions found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
