import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Eye,
  Percent,
  MapPin,
  User,
  Calendar,
  X,
} from "lucide-react";
import axios from "axios";
import LoadingScreen from "@/Pages/LoadingScreen";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

// Transaction Details Modal Component
function TransactionModal({ isOpen, onClose, transactionId }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation("OwnerPages");

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
    } catch (err) {
      console.error("Error fetching transaction details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="bg-[#dd0303] dark:bg-[#060b15] top-0  border-b p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold">{t("Transaction Details")}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 dark:bg-[#060b15]">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : details ? (
            <div className="space-y-4 dark">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">{t("Code")}</p>
                  <p className="font-semibold font-mono">{details.code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("Discount")}</p>
                  <p className="font-semibold text-green-600">{details.discount}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("Status")}</p>
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${details.decision === "accept"
                        ? "bg-green-100 text-green-800"
                        : details.decision === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                  >
                    {details.decision}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("Redeemed At")}</p>
                  <p className="font-semibold">
                    {new Date(details.redeemedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {details.user && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <User size={16} className="text-gray-600" />
                    {t("User Information")}
                  </h4>
                  <div className="bg-gray-50  p-3 rounded">
                    <p className="font-medium">
                      {details.user.firstName} {details.user.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{details.user.email}</p>
                  </div>
                </div>
              )}

              {details.admin && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <User size={16} className="text-purple-600" />
                    {t("Admin Information")}
                  </h4>
                  <div className="bg-gray-50  p-3 rounded">
                    <p className="font-medium">
                      {details.admin.firstName} {details.admin.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{details.admin.email}</p>
                  </div>
                </div>
              )}

              {details.gemId && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin size={16} className="text-blue-600" />
                    {t("Gem Information")}
                  </h4>
                  <div className="bg-gray-50  p-3 rounded">
                    <p className="font-medium">{details.gemId.name}</p>
                    <p className="text-sm text-gray-600">
                      {t("Location")}: {details.gemId.gemLocation}
                    </p>
                    {details.gemId.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                        {details.gemId.description}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {t("No details available")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Transaction Dashboard Component
export default function TransactionDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [gemId, setGemId] = useState(null);
  const isDarkMode = useSelector((state) => state.darkMode.enabled);
  const { t, i18n } = useTranslation("OwnerPages");

  // Modal States
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Search & Filter States
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  const baseURL = import.meta.env.VITE_Base_URL;

  // URL query param for page
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromURL = parseInt(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromURL);

  // Get user info from Redux
  const { isLoggedIn: isloggedin, userInfo: user } = useSelector(
    (state) => state.user
  );

  // Fetch gemId for owner on component mount
  useEffect(() => {
    const fetchGemId = async () => {
      if (user?.role === "owner") {
        try {
          const response = await axios.get(`${baseURL}/gems/user/${user.id}`, {
            withCredentials: true,
          });
          const fetchedGemId = response.data.result[0]?._id;
          // console.log("gemId", fetchedGemId);
          if (!fetchedGemId) {
            console.log(setLoading(false));

          }

          setGemId(fetchedGemId);
        } catch (err) {
          console.error("Error fetching gemId:", err);
        }
      }
    };

    fetchGemId();
  }, [user, baseURL]);

  // Get endpoint based on role and gemId
  const getEndpoint = () => {
    if (user?.role === "owner" && gemId) {
      return `${baseURL}/transaction/owner/${gemId}`;
    }
    return `${baseURL}/transaction/admin`;
  };

  // Update URL when page changes
  useEffect(() => {
    setSearchParams({ page: currentPage });
  }, [currentPage]);

  // Fetch transactions when dependencies change
  useEffect(() => {
    // Only fetch if we have gemId (for owner) or if user is admin
    if (user?.role === "admin" || (user?.role === "owner" && gemId)) {
      fetchTransactions();
    }
  }, [currentPage, searchKeyword, statusFilter, sortBy, gemId]);

  const fetchTransactions = async () => {
    setLoading(true);

    const params = { page: currentPage };
    if (searchKeyword) params.keyword = searchKeyword;
    if (statusFilter) params.status = statusFilter;
    if (sortBy) params.sort = sortBy;

    const endpoint = getEndpoint();

    try {
      const response = await axios.get(endpoint, {
        params,
        withCredentials: true,
      });

      const data = response.data;
      if (data.message === "success") {
        setTransactions(data.result);
        setTotalPages(data.totalPages);
        setTotalItems(data.totalItems);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchKeyword("");
    setStatusFilter("");
    setSortBy("");
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewTransaction = (transactionId) => {
    setSelectedTransactionId(transactionId);
    setIsModalOpen(true);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const goToPage = (page) => setCurrentPage(page);

  return (
    <>
      <div className={`${isDarkMode ? 'dark' : ''}bg-white rounded-lg shadow-sm`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t("Transaction Management")}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {t("Total: {{count}} transactions found", { count: totalItems })}
              </p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by code, gem name, or user..."
                value={searchKeyword}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={handleStatusFilter}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option className="dark:text-black" value="">{t("All Status")}</option>
              <option className="dark:text-black" value="accept">{t("Accepted")}</option>
              <option className="dark:text-black" value="reject">{t("Rejected")}</option>
            </select>
            <select
              value={sortBy}
              onChange={handleSort}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option className="dark:text-black" value="">
                {t("Sort By")}
              </option>
              <option className="dark:text-black" value="code">
                {t("Sort Code AZ")}
              </option>
              <option className="dark:text-black" value="-code">
                {t("Sort Code ZA")}
              </option>
              <option className="dark:text-black" value="discount">
                {t("Sort Discount Low High")}
              </option>
              <option className="dark:text-black" value="-discount">
                {t("Sort Discount High Low")}
              </option>
              <option className="dark:text-black" value="redeemedAt">
                {t("Sort Date Old New")}
              </option>
              <option className="dark:text-black" value="-redeemedAt">
                {t("Sort Date New Old")}
              </option>

            </select>
          </div>

          {(searchKeyword || statusFilter || sortBy) && (
            <button
              onClick={clearFilters}
              className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {t("Clear All Filters")}
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
           <tr>
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {t("Voucher Code")}
  </th>
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {t("Discount")}
  </th>
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {t("Gem")}
  </th>
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {t("User")}
  </th>
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {t("Admin")}
  </th>
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {t("Redeemed Date")}
  </th>
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {t("Status")}
  </th>
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {t("Actions")}
  </th>
</tr>

            </thead>

            <tbody className="dark:bg-gray-900 bg-white divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono font-bold text-gray-900">
                        {transaction.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Percent size={16} className="text-green-600 mr-1" />
                        <span className="text-sm font-bold text-green-600">
                          {transaction.discount}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin size={14} className="text-blue-500 mr-1" />
                        <span className="text-sm text-gray-900">
                          {transaction.gemId?.name || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User size={14} className="text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">
                          {transaction.user
                            ? `${transaction.user.firstName} ${transaction.user.lastName}`
                            : "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User size={14} className="text-purple-400 mr-1" />
                        <span className="text-sm text-gray-600">
                          {transaction.admin
                            ? `${transaction.admin.firstName} ${transaction.admin.lastName}`
                            : "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {formatDate(transaction.redeemedAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${transaction.decision === "accept"
                            ? "bg-green-100 text-green-800"
                            : transaction.decision === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                      >
                        {transaction.decision || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewTransaction(transaction._id)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Eye size={18} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transactionId={selectedTransactionId}
      />
    </>
  );
}