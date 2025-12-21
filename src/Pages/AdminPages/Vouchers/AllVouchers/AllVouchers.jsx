import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Eye,
  Percent,
  MapPin,
  Mail,
  Calendar,
} from "lucide-react";
import axios from "axios";
import LoadingScreen from "@/Pages/LoadingScreen";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export default function AllVouchers() {
  const { t, i18n } = useTranslation("Vouchers");
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [gemId, setGemId] = useState(null); // Store gemId in state

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
          console.log("gemId", fetchedGemId);
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
      return `${baseURL}/vouchers/${gemId}`;
    }
    return `${baseURL}/vouchers/admin`;
  };

  // Update URL when page changes
  useEffect(() => {
    setSearchParams({ page: currentPage });
  }, [currentPage]);

  // Fetch vouchers when dependencies change
  useEffect(() => {
    // Only fetch if we have gemId (for owner) or if user is admin
    if (user?.role === "admin" || (user?.role === "owner" && gemId)) {
      fetchVouchers();
    }
  }, [currentPage, searchKeyword, statusFilter, sortBy, gemId]);

  const fetchVouchers = async () => {
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
        setVouchers(data.result);
        setTotalPages(data.totalPages);
        setTotalItems(data.totalItems);
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
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
    });
  };

  const isExpired = (dateString) => {
    return new Date(dateString) < new Date();
  };

  // Dynamic view link based on role
  const getViewLink = (voucherCode) => {
    if (user?.role === "owner") {
      return `/owner/${voucherCode}`;
    }
    return `/admin/vouchers/${voucherCode}`;
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const goToPage = (page) => setCurrentPage(page);

  return (
    <div className="bg-white dark:bg-[#060b15] rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t("vouchers.management_title")}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {t("vouchers.total_found", { count: totalItems })}
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
              placeholder={t("vouchers.search_placeholder")}
              value={searchKeyword}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="dark:bg-[#060b15] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{t("vouchers.all_status")}</option>
            <option value="active">{t("vouchers.status_active")}</option>
            <option value="expired">{t("vouchers.status_expired")}</option>
            <option value="used">{t("vouchers.status_used")}</option>
          </select>
          <select
            value={sortBy}
            onChange={handleSort}
            className="dark:bg-[#060b15] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{t("vouchers.sort_by")}</option>
            <option value="code">{t("vouchers.sort_code_az")}</option>
            <option value="-code">{t("vouchers.sort_code_za")}</option>
            <option value="discount">{t("vouchers.sort_discount_low")}</option>
            <option value="-discount">
              {t("vouchers.sort_discount_high")}
            </option>
            <option value="expiryDate">{t("vouchers.sort_expiry_old")}</option>
            <option value="-expiryDate">{t("vouchers.sort_expiry_new")}</option>
            <option value="createdAt">{t("vouchers.sort_created_old")}</option>
            <option value="-createdAt">{t("vouchers.sort_created_new")}</option>
          </select>
        </div>

        {(searchKeyword || statusFilter || sortBy) && (
          <button
            onClick={clearFilters}
            className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {t("vouchers.clear_filters")}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("vouchers.column_code")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("vouchers.column_discount")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("vouchers.column_gem")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("vouchers.column_user_email")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("vouchers.column_expiry")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("vouchers.column_actions")}
              </th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-[#060b15] divide-y divide-gray-200">
            {vouchers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  {t("vouchers.no_vouchers_found")}
                </td>
              </tr>
            ) : (
              vouchers.map((voucher) => (
                <tr
                  key={voucher._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono font-bold text-gray-900">
                      {voucher.code}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Percent size={16} className="text-green-600 mr-1" />
                      <span className="text-sm font-bold text-green-600">
                        {voucher.discount}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin size={14} className="text-blue-500 mr-1" />
                      <span className="text-sm text-gray-900">
                        {voucher.gemId?.name || t("vouchers.not_available")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Mail size={14} className="text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">
                        {voucher.userId?.email || t("vouchers.not_available")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      <span
                        className={`text-sm ${isExpired(voucher.expiryDate)
                            ? "text-red-600 font-semibold"
                            : "text-gray-900"
                          }`}
                      >
                        {formatDate(voucher.expiryDate)}
                      </span>
                      {isExpired(voucher.expiryDate) && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                          {t("vouchers.expired")}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={getViewLink(voucher.code)}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                    >
                      <Eye size={18} />
                      <span>{t("vouchers.view")}</span>
                    </Link>
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
          {t("vouchers.showing_page", {
            current: currentPage,
            total: totalPages,
          })}
        </div>
        <div
          className={`flex gap-2 ${i18n.language === "ar" ? "flex-row-reverse" : ""
            }`}
        >
          <button
            onClick={() => goToPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {i18n.language === "ar" ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
          <button
            onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {i18n.language === "ar" ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
