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
import { useSelector } from "react-redux";

export default function AllGems() {
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
        showToast("Failed to load gems", "error");
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
      .then(async () => {
        showToast("Gem deleted successfully", "success");
        closeDeleteModal();
        fetchGems();
      })
      .catch((error) => {
        console.error("Error deleting gem:", error);
        showToast("Failed to delete gem", "error");
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
                Hidden Gems Management
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Total {totalItems} gems found
              </p>
            </div>
            <Link
              to="/admin/gems/add"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Hidden Gem
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
                placeholder="Search gems..."
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
              <option value="">All Categories</option>
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
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={sortBy}
              onChange={handleSort}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sort By</option>
              <option value="name">Name (A-Z)</option>
              <option value="-name">Name (Z-A)</option>
              <option value="-avgRating">Highest Rating</option>
              <option value="avgRating">Lowest Rating</option>
              <option value="createdAt">Oldest First</option>
              <option value="-createdAt">Newest First</option>
            </select>
          </div>

          {(searchKeyword || categoryFilter || statusFilter || sortBy) && (
            <button
              onClick={clearFilters}
              className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
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
                    No gems found
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
                        <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden">
                          {gem.images && gem.images.length > 0 ? (
                            <img
                              className="h-16 w-16 object-cover"
                              src={`${gem.images[0]}`}
                              alt={gem.name}
                            />
                          ) : (
                            <div className="h-16 w-16 bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">
                                No Image
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {gem.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
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
                        {gem.status}
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
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
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
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 z-50 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </>
  );
}
