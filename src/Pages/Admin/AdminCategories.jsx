import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./Admin.css";
import LoadingScreen from "../LoadingScreen";

export default function AdminCategories() {
  const { userInfo: user, isLoggedIn: isloggedin } = useSelector(
    (state) => state.user
  );

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Sorting
  const [sortOrder, setSortOrder] = useState("");

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newCategory, setNewCategory] = useState({
    categoryName: "",
    categoryImage: null,
  });

  const [editCategory, setEditCategory] = useState(null);

  const [formErrors, setFormErrors] = useState({});
  const [editFormErrors, setEditFormErrors] = useState({});

  // ===================== FETCH =====================
  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `http://localhost:3000/categories?page=${currentPage}&sort=${sortOrder}`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Failed to fetch categories");

        const data = await res.json();

        setCategories(data.result || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError(err.message || "Error loading categories");
      }

      setLoading(false);
    }

    fetchCategories();
  }, [currentPage, refreshTrigger, sortOrder]);

  // sort handler
  const handleSortChange = (e) => setSortOrder(e.target.value);

  const nextPage = () => setCurrentPage((p) => p + 1);
  const prevPage = () => setCurrentPage((p) => Math.max(1, p - 1));

  // ===================== CREATE =====================
  const validateNewCategory = () => {
    const errors = {};
    if (!newCategory.categoryName)
      errors.categoryName = "Category name is required";
    if (!newCategory.categoryImage)
      errors.categoryImage = "Category image is required";
    return errors;
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    const errors = validateNewCategory();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const formData = new FormData();
      formData.append("categoryName", newCategory.categoryName);
      formData.append("categoryImage", newCategory.categoryImage);

      const res = await fetch("http://localhost:3000/categories", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create category");
      }

      setShowCreateModal(false);
      setNewCategory({ categoryName: "", categoryImage: null });
      setFormErrors({});
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      alert(err.message);
    }
  };

  // ===================== DELETE =====================
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete category");
      }

      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // ===================== EDIT =====================
  const openEditModal = (category) => {
    setEditCategory(category);
    setEditFormErrors({});
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!editCategory.categoryName)
      errors.categoryName = "Category name is required";
    setEditFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const formData = new FormData();
      formData.append("categoryName", editCategory.categoryName);

      if (editCategory.categoryImage instanceof File) {
        formData.append("categoryImage", editCategory.categoryImage);
      }

      const res = await fetch(
        `http://localhost:3000/categories/${editCategory._id}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update category");
      }

      setCategories((prev) =>
        prev.map((c) => (c._id === editCategory._id ? data.result : c))
      );

      setShowEditModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isloggedin || !user || user.role !== "admin") {
    return (
      <div className="admin-access-denied">Access denied. Admins only.</div>
    );
  }

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className="admin-page">
      <div className="admin-dashboard">
        <div className="admin-header-actions">
          <h1 className="admin-title">Category Management</h1>

          <div className="admin-sort-wrapper">
            <label>Sort by:</label>
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="admin-sort-select"
            >
              <option value="">Default</option>
              <option value="categoryName">Name (A-Z)</option>
              <option value="-categoryName">Name (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {loading && categories.length === 0 ? (
          <p className="admin-loading">Loading categories...</p>
        ) : error ? (
          <p className="admin-error">{error}</p>
        ) : (
          <div
            className="admin-table-wrapper"
            style={{
              opacity: loading ? 0.5 : 1,
              pointerEvents: loading ? "none" : "auto",
              transition: "opacity 0.2s",
            }}
          >
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Created By</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id}>
                    <td>{cat.categoryName}</td>

                    <td>
                      <img
                        src={`http://localhost:3000/uploads/category/${cat.categoryImage}`}
                        alt=""
                        width="120"
                        height="120"
                        style={{
                          borderRadius: "8px",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                    </td>

                    <td>{cat.createdBy}</td>

                    <td>
                      <button
                        className="admin-btn"
                        onClick={() => openEditModal(cat)}
                      >
                        Edit
                      </button>

                      <button
                        className="admin-btn admin-btn-delete"
                        onClick={() => handleDelete(cat._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination-container">
              <p className="pagination-info">
                Page {currentPage} of {totalPages}
              </p>

              <div className="pagination-buttons">
                <button
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={prevPage}
                >
                  Previous
                </button>

                <button
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={nextPage}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CREATE Category */}
        <div className="admin-create-user">
          <h3>Create New Category</h3>
          <button
            className="admin-btn"
            onClick={() => setShowCreateModal(true)}
          >
            Create Category
          </button>
        </div>

        {/* CREATE MODAL */}
        {showCreateModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Create Category</h2>

              <form onSubmit={handleCreate}>
                <label>
                  Category Name:
                  <input
                    type="text"
                    value={newCategory.categoryName}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        categoryName: e.target.value,
                      })
                    }
                  />
                  {formErrors.categoryName && (
                    <span className="error">{formErrors.categoryName}</span>
                  )}
                </label>

                <label>
                  Image:
                  <input
                    type="file"
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        categoryImage: e.target.files[0],
                      })
                    }
                  />
                  {formErrors.categoryImage && (
                    <span className="error">{formErrors.categoryImage}</span>
                  )}
                </label>

                <div className="modal-actions">
                  <button className="admin-btn" type="submit">
                    Create
                  </button>
                  <button
                    className="admin-btn admin-btn-delete"
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Edit Category</h2>

              <form onSubmit={handleEditSubmit}>
                <label>
                  Category Name:
                  <input
                    type="text"
                    value={editCategory.categoryName}
                    onChange={(e) =>
                      setEditCategory({
                        ...editCategory,
                        categoryName: e.target.value,
                      })
                    }
                  />
                  {editFormErrors.categoryName && (
                    <span className="error">{editFormErrors.categoryName}</span>
                  )}
                </label>

                <label>
                  Change Image:
                  <input
                    type="file"
                    onChange={(e) =>
                      setEditCategory({
                        ...editCategory,
                        categoryImage: e.target.files[0],
                      })
                    }
                  />
                </label>

                <div className="modal-actions">
                  <button className="admin-btn" type="submit">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-delete"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
