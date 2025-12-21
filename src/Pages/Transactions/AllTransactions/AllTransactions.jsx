import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import LoadingScreen from "@/Pages/LoadingScreen";



// Transaction Details Modal Component
function TransactionModal({ isOpen, onClose, transactionId }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && transactionId) {
      fetchTransactionDetails();
    }
  }, [isOpen, transactionId]);

  const fetchTransactionDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_Base_URL}/transaction/${transactionId}`,
        { withCredentials: true }
      );
      setDetails(res.data);
      // console.log("res.data", res.data.admin);
      
    } catch (err) {
      console.error("Error fetching transaction details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-zinc-800 border-b dark:border-zinc-700 p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold dark:text-white">Transaction Details</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded"
          >
            <X className="w-6 h-6 dark:text-white" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <LoadingScreen />
          ) : details ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Code</p>
                  <p className="font-semibold dark:text-white">{details.code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Discount</p>
                  <p className="font-semibold dark:text-white">{details.discount}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <p className="font-semibold capitalize dark:text-white">{details.decision}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Redeemed At</p>
                  <p className="font-semibold dark:text-white">
                    {new Date(details.redeemedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="border-t dark:border-zinc-700 pt-4">
                <h4 className="font-semibold mb-2 dark:text-white">User Information</h4>
                <div className="bg-gray-50 dark:bg-zinc-900 p-3 rounded">
                  <p className="dark:text-white">
                    {details.user.firstName} {details.user.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{details.user.email}</p>
                </div>
              </div>

              <div className="border-t dark:border-zinc-700 pt-4">
                <h4 className="font-semibold mb-2 dark:text-white">Admin Information</h4>
                <div className="bg-gray-50 dark:bg-zinc-900 p-3 rounded">
                 <p className="dark:text-white">
                    {details.admin.firstName} {details.admin.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{details.admin.email}</p>
                </div>
              </div>

              {details.gemId && (
                <div className="border-t dark:border-zinc-700 pt-4">
                  <h4 className="font-semibold mb-2 dark:text-white">Gem Information</h4>
                  <div className="bg-gray-50 dark:bg-zinc-900 p-3 rounded">
                    <p className="font-medium dark:text-white">{details.gemId.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Location: {details.gemId.gemLocation}
                    </p>
                  
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No details available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Transactions Component
export default function AllTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_Base_URL}/transaction`, {
        withCredentials: true,
      });
      setTransactions(res.data.result || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return (
   <LoadingScreen />
    );
  }

  if (!transactions.length) {
    return (
      <div className="flex justify-center items-center h-screen text-lg dark:text-white">
        No Transactions Found
      </div>
    );
  }

  return (
    <div className="mt-15 p-4">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Transactions List</h2>
      <ul className="space-y-2">
        {transactions.map((transaction) => (
          <li
            key={transaction._id}
            className="p-4 bg-white dark:bg-zinc-800 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
            onClick={() => {
              setSelectedTransactionId(transaction._id);
              setIsModalOpen(true);
            }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold dark:text-white">{transaction.code}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {transaction.user.firstName} {transaction.user.lastName}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600 dark:text-green-400">
                  {transaction.discount}% OFF
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(transaction.redeemedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transactionId={selectedTransactionId}
      />
    </div>
  );
}