import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle,
  Search,
  Mail,
  Clock,
  CheckCircle,
  MessageSquare,
  Filter,
} from "lucide-react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import LoadingScreen from "@/Pages/LoadingScreen";
import toast from "react-hot-toast";

export default function AllReports() {
  const { t, i18n } = useTranslation("AdminReports");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);

  // Search & Filter States
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("-createdAt");

  const baseURL = import.meta.env.VITE_Base_URL;
  const { userInfo } = useSelector((state) => state.user || {});

  // URL query param for page
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromURL = parseInt(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromURL);

  // Update URL when page changes
  useEffect(() => {
    setSearchParams({ page: currentPage });
  }, [currentPage]);

  useEffect(() => {
    fetchReports();
  }, [currentPage, searchKeyword, statusFilter, dateFilter, sortBy]);

  const fetchReports = () => {
    setLoading(true);

    const params = { page: currentPage };
    if (searchKeyword) params.keyword = searchKeyword;
    if (statusFilter) params.status = statusFilter;
    if (dateFilter) params.date = dateFilter;
    if (sortBy) params.sort = sortBy;

    axios
      .get(`${baseURL}/contactus/admin`, { params, withCredentials: true })
      .then((response) => {
        const data = response.data;
        if (data.message === "success") {
          setReports(data.result);
          setTotalPages(data.totalPages);
          setTotalItems(data.totalItems);
        }
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
        toast.error(t("toast.failedToLoadReports"), "error");
      })
      .finally(() => setLoading(false));
  };

 

  const openDeleteModal = (report) => {
    setReportToDelete(report);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setReportToDelete(null);
  };

  const handleDelete = () => {
    if (!reportToDelete) return;
    axios
      .delete(`${baseURL}/contactus/admin/${reportToDelete._id}`, {
        withCredentials: true,
      })
      .then(() => {
        toast.success(t("toast.reportDeleted"), "success");
        closeDeleteModal();
        fetchReports();
      })
      .catch((error) => {
        console.error("Error deleting report:", error);
        toast.error(t("toast.failedToDeleteReport"), "error");
      });
  };

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDateFilter = (e) => {
    setDateFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchKeyword("");
    setStatusFilter("");
    setDateFilter("");
    setSortBy("-createdAt");
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(i18n.language === "ar" ? "ar-EG" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-green-100 text-green-800";
      case "resolved":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-black-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={14} />;
      case "reviewed":
        return <Eye size={14} />;
      case "resolved":
        return <CheckCircle size={14} />;
      case "rejected":
        return <X size={14} />;
      default:
        return null;
    }
  };

  if (loading) return <LoadingScreen />;

  const goToPage = (page) => setCurrentPage(page);

  // Calculate date filter options
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const lastWeek = new Date(Date.now() - 7 * 86400000)
    .toISOString()
    .split("T")[0];
  const lastMonth = new Date(Date.now() - 30 * 86400000)
    .toISOString()
    .split("T")[0];

  return (
    <>
      <div className="bg-white dark:bg-[#060b15] rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t("header.contactReports")}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {t("header.totalReportsFound", { totalItems })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <span className="text-sm text-gray-600">
                {t("header.reportsManagement")}
              </span>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative md:col-span-2">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder={t("inputs.searchReports")}
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
              <option value="">{t("filters.allStatus")}</option>
              <option value="pending">{t("status.pending")}</option>
              <option value="reviewed">{t("status.reviewed")}</option>
              <option value="resolved">{t("status.resolved")}</option>
              <option value="rejected">{t("status.rejected")}</option>
            </select>
            <select
              value={dateFilter}
              onChange={handleDateFilter}
              className="dark:bg-[#060b15] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t("filters.allDates")}</option>
              <option value={today}>{t("filters.today")}</option>
              <option value={yesterday}>{t("filters.yesterday")}</option>
              <option value={lastWeek}>{t("filters.lastWeek")}</option>
              <option value={lastMonth}>{t("filters.lastMonth")}</option>
            </select>
            <select
              value={sortBy}
              onChange={handleSort}
              className="dark:bg-[#060b15] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="-createdAt">{t("sort.newestFirst")}</option>
              <option value="createdAt">{t("sort.oldestFirst")}</option>
              <option value="firstName">{t("sort.nameAZ")}</option>
              <option value="-firstName">{t("sort.nameZA")}</option>
              <option value="email">{t("sort.emailAZ")}</option>
            </select>
          </div>

          {(searchKeyword || statusFilter || dateFilter || sortBy !== "-createdAt") && (
            <button
              onClick={clearFilters}
              className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <X size={16} />
              {t("buttons.clearAllFilters")}
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    i18n.language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t("table.user")}
                </th>
                <th
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    i18n.language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t("table.message")}
                </th>
                {/* <th
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    i18n.language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t("table.replies")}
                </th> */}
                <th
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    i18n.language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t("table.status")}
                </th>
                <th
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    i18n.language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t("table.date")}
                </th>
                <th
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    i18n.language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t("table.actions")}
                </th>
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-[#060b15] divide-y divide-gray-200">
              {reports.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {t("table.noReportsFound")}
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr
                    key={report._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {report.firstName?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {report.firstName} {report.lastName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail size={12} />
                            {report.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-900 line-clamp-2">
                          {report.message}
                        </p>
                        {report.message.length > 100 && (
                          <span className="text-xs text-gray-500">
                            {t("table.clickToViewFull")}
                          </span>
                        )}
                      </div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <MessageSquare size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {report.adminReplies?.length || 0}
                        </span>
                        <span className="text-xs text-gray-500">
                          {t("table.replies")}
                        </span>
                      </div>
                      {report.adminReplies?.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {t("table.lastReply")}:{" "}
                          {formatTime(
                            report.adminReplies[report.adminReplies.length - 1]
                              .repliedAt
                          )}
                        </div>
                      )}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {getStatusIcon(report.status)}
                          {t(`status.${report.status}`)}
                        </span>
                      </div>
                      {report.adminNotes && (
                        <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                          {report.adminNotes}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(report.createdAt)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTime(report.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/admin/reports/${report._id}`}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          title={t("buttons.viewDetails")}
                        >
                          <Eye size={18} />
                        </Link>
                        {/* <Link
                          to={`mailto:${report.email}`}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                          title={t("buttons.sendEmail")}
                        >
                          <Mail size={18} />
                        </Link> */}
                        <button
                          onClick={() => openDeleteModal(report)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                          title={t("buttons.deleteReport")}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
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
            {t("pagination.showingPage", {
              currentPage,
              totalPages,
            })}
          </div>
          <div className="flex gap-2">
            {i18n.language === "ar" ? (
              <>
                <button
                  onClick={() => goToPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
                <button
                  onClick={() =>
                    goToPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => goToPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() =>
                    goToPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <AlertTriangle className="text-red-600" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t("modals.deleteReport")}
                  </h3>
                </div>
                <button
                  onClick={closeDeleteModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="mb-6">
                <p className="text-gray-600 mb-2">
                  {t("modals.confirmDelete")}
                </p>
                {reportToDelete && (
                  <div className="bg-gray-50 p-3 rounded-lg mt-3">
                    <p className="text-sm font-medium text-gray-900">
                      {reportToDelete.firstName} {reportToDelete.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {reportToDelete.email}
                    </p>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {reportToDelete.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          reportToDelete.status
                        )}`}
                      >
                        {t(`status.${reportToDelete.status}`)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(reportToDelete.createdAt)}
                      </span>
                    </div>
                  </div>
                )}
                <p className="text-sm text-red-600 mt-3 font-medium">
                  {t("modals.cannotUndo")}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t("buttons.cancel")}
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t("buttons.delete")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}