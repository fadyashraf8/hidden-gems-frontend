import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Edit, Trash2, X, AlertTriangle, Search } from 'lucide-react';
import axios from 'axios';

export default function AllCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Search & Sort States
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState('');

  const baseURL = import.meta.env.VITE_Base_URL;

  // URL query params
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromURL = parseInt(searchParams.get('page')) || 1;
  const searchFromURL = searchParams.get('keyword') || '';
  const sortFromURL = searchParams.get('sort') || '';

  useEffect(() => {
    setCurrentPage(pageFromURL);
    setSearchKeyword(searchFromURL);
    setSortBy(sortFromURL);
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = {};
    if (currentPage) params.page = currentPage;
    if (searchKeyword) params.keyword = searchKeyword;
    if (sortBy) params.sort = sortBy;
    setSearchParams(params);
  }, [currentPage, searchKeyword, sortBy]);

  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchKeyword, sortBy]);

  const fetchCategories = () => {
    setLoading(true);

    const params = { page: currentPage };
    if (searchKeyword) params.keyword = searchKeyword;
    if (sortBy) params.sort = sortBy;

    axios
      .get(`${baseURL}/categories`, { params, withCredentials: true })
      .then((res) => {
        const data = res.data;
        if (data.message === 'success') {
          setCategories(data.result);
          setTotalPages(data.totalPages);
          setTotalItems(data.totalItems);
        }
      })
      .catch((err) => {
        console.error('Error fetching categories:', err);
        showToast('Failed to load categories', 'error');
      })
      .finally(() => setLoading(false));
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const handleDelete = () => {
    if (!categoryToDelete) return;

    axios
      .delete(`${baseURL}/categories/${categoryToDelete._id}`, { withCredentials: true })
      .then(() => {
        showToast('Category deleted successfully', 'success');
        closeDeleteModal();
        fetchCategories();
      })
      .catch((err) => {
        console.error('Error deleting category:', err);
        showToast('Failed to delete category', 'error');
      });
  };

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchKeyword('');
    setSortBy('');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
              <p className="text-sm text-gray-600 mt-1">Total {totalItems} categories found</p>
            </div>
            <Link
              to="/admin/categories/add"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Category
            </Link>
          </div>

          {/* Search & Sort */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchKeyword}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={sortBy}
              onChange={handleSort}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sort By</option>
              <option value="categoryName">Name (A-Z)</option>
              <option value="-categoryName">Name (Z-A)</option>
              <option value="createdAt">Oldest First</option>
              <option value="-createdAt">Newest First</option>
            </select>
          </div>

          {(searchKeyword || sortBy) && (
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No categories found</td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={`${cat.categoryImage}`}
                        alt={cat.categoryName}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{cat.categoryName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 text-sm">
                      {cat.createdBy ? `${cat.createdBy.email}` : 'Null'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                      <Link
                        to={`/admin/categories/${cat._id}`}
                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => openDeleteModal(cat)}
                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={18} />
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
            Showing page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              &lt;
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              &gt;
            </button>
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
                  <h3 className="text-lg font-semibold text-gray-900">Delete Category</h3>
                </div>
                <button
                  onClick={closeDeleteModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-2">Are you sure you want to delete this category?</p>
                {categoryToDelete && (
                  <div className="bg-gray-50 p-3 rounded-lg mt-3">
                    <p className="text-sm font-medium text-gray-900">{categoryToDelete.categoryName}</p>
                  </div>
                )}
                <p className="text-sm text-red-600 mt-3 font-medium">This action cannot be undone.</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div
            className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
              toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => setToast({ show: false, message: '', type: '' })}
              className="hover:opacity-80 transition-opacity"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
