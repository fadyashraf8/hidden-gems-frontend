import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle,
  Search,
  Star,
  MapPin,
} from "lucide-react";
import axios from "axios";
<<<<<<< HEAD
import { useTranslation } from "react-i18next";
=======
import { useSelector } from "react-redux";
>>>>>>> b238bdf32695d8580698679c1a3d912d558c392e

export default function AllGems() {
  const { t , i18n} = useTranslation("AdminGems");

  const [gems, setGems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [gemToDelete, setGemToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Search & Filter States
  const [searchKeyword, setSearchKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

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
    fetchGems();
    fetchCategories();
  }, [currentPage, searchKeyword, categoryFilter, statusFilter, sortBy]);

  const fetchGems = () => {
    setLoading(true);

    const params = { page: currentPage };
    if (searchKeyword) params.keyword = searchKeyword;
    if (categoryFilter) params.category = categoryFilter;
    if (statusFilter) params.status = statusFilter;
    if (sortBy) params.sort = sortBy;

    axios
      .get(`${baseURL}/gems`, { params, withCredentials: true })
      .then((response) => {
        const data = response.data;
        if (data.message === "success") {
          setGems(data.result);
          setTotalPages(data.totalPages);
          setTotalItems(data.totalItems);
        }
      })
      .catch((error) => {
        console.error("Error fetching gems:", error);
        showToast(t("toast.failedToLoadGems"), "error");
      })
      .finally(() => setLoading(false));
  };

  const fetchCategories = () => {
    axios
      .get(`${baseURL}/categories`, { withCredentials: true })
      .then((response) => {
        if (response.data.message === "success") {
          setCategories(response.data.result);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const openDeleteModal = (gem) => {
    setGemToDelete(gem);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setGemToDelete(null);
  };

  const handleDelete = () => {
    if (!gemToDelete) return;
    axios
      .delete(`${baseURL}/gems/${gemToDelete._id}`, { withCredentials: true })
<<<<<<< HEAD
      .then(() => {
        showToast(t("toast.gemDeleted"), "success");
=======
      .then(async () => {
        showToast("Gem deleted successfully", "success");
>>>>>>> b238bdf32695d8580698679c1a3d912d558c392e
        closeDeleteModal();
        fetchGems();
      })
      .catch((error) => {
        console.error("Error deleting gem:", error);
        showToast(t("toast.failedToDeleteGem"), "error");
      });
  };

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (e) => {
    setCategoryFilter(e.target.value);
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
    setCategoryFilter("");
    setStatusFilter("");
    setSortBy("");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const goToPage = (page) => setCurrentPage(page);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t("header.hiddenGemsManagement")}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {t("header.totalGemsFound", { totalItems })}
              </p>
            </div>
            <Link
              to="/admin/gems/add"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t("buttons.addHiddenGem")}
            </Link>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder={t("inputs.searchGems")}
                value={searchKeyword}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={handleCategoryFilter}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t("filters.allCategories")}</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={handleStatusFilter}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t("filters.allStatus")}</option>
              <option value="pending">{t("status.pending")}</option>
              <option value="accepted">{t("status.accepted")}</option>
              <option value="rejected">{t("status.rejected")}</option>
            </select>
            <select
              value={sortBy}
              onChange={handleSort}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t("filters.sortBy")}</option>
              <option value="name">{t("sort.nameAZ")}</option>
              <option value="-name">{t("sort.nameZA")}</option>
              <option value="-avgRating">{t("sort.highestRating")}</option>
              <option value="avgRating">{t("sort.lowestRating")}</option>
              <option value="createdAt">{t("sort.oldestFirst")}</option>
              <option value="-createdAt">{t("sort.newestFirst")}</option>
            </select>
          </div>

          {(searchKeyword || categoryFilter || statusFilter || sortBy) && (
            <button
              onClick={clearFilters}
              className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {t("buttons.clearAllFilters")}
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 m-auto">
              <tr>
                <th
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    i18n.language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t("table.gem")}
                </th>
                <th
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    i18n.language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t("table.category")}
                </th>
                <th
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    i18n.language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t("table.rating")}
                </th>
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
                  {t("table.actions")}
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {gems.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {t("table.noGemsFound")}
                  </td>
                </tr>
              ) : (
                gems.map((gem) => (
                  <tr
                    key={gem._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden ">
                          {gem.images && gem.images.length > 0 ? (
                            <img
                              className="h-16 w-16 object-cover"
                              src={`${gem.images[0]}`}
                              alt={gem.name}
                            />
                          ) : (
                            <div className="h-16 w-16 bg-gray-200   flex items-center justify-center">
                              <span className="text-gray-400 text-xs">
                                {t("table.noImage")}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4 ">
                          <div className="text-sm font-medium text-gray-900 pr-1">
                            {gem.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center pr-1">
                            <MapPin size={14} />
                            {gem.gemLocation}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {gem.category?.categoryName || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star
                          size={16}
                          className="text-yellow-400 fill-current"
                        />
                        <span className="ml-1 text-sm text-gray-900">
                          {gem.avgRating?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          gem.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : gem.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {t(`status.${gem.status}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/admin/gems/edit/${gem._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(gem)}
                          className="text-red-600 hover:text-red-900"
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
<<<<<<< HEAD
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
                {/* Previous button on right */}
                <button
                  onClick={() => goToPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border  cursor-pointer border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
                {/* Next button on left */}
                <button
                  onClick={() =>
                    goToPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border cursor-pointer border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
              </>
            ) : (
              <>
                {/* Previous button on left */}
                <button
                  onClick={() => goToPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                {/* Next button on right */}
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
=======
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
>>>>>>> b238bdf32695d8580698679c1a3d912d558c392e
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
<<<<<<< HEAD
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <AlertTriangle className="text-red-600" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t("modals.deleteGem")}
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
                {gemToDelete && (
                  <div className="bg-gray-50 p-3 rounded-lg mt-3">
                    <p className="text-sm font-medium text-gray-900">
                      {gemToDelete.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {gemToDelete.gemLocation}
                    </p>
                  </div>
                )}
                <p className="text-sm text-red-600 mt-3 font-medium">
                  {t("modals.cannotUndo")}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 px-4 py-2 border  cursor-pointer border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t("buttons.cancel")}
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2  cursor-pointer bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t("buttons.delete")}
                </button>
              </div>
=======
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete Gem?</h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone
                </p>
              </div>
              <button
                onClick={closeDeleteModal}
                className="ml-auto text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {gemToDelete?.name}
              </span>
              ? All data associated with this gem will be permanently removed.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Delete Gem
              </button>
>>>>>>> b238bdf32695d8580698679c1a3d912d558c392e
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
<<<<<<< HEAD
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <div
            className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => setToast({ show: false, message: "", type: "" })}
              className="hover:opacity-80 transition-opacity"
            >
              <X size={18} />
            </button>
          </div>
=======
        <div
          className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 z-50 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
>>>>>>> b238bdf32695d8580698679c1a3d912d558c392e
        </div>
      )}
    </>
  );
}
