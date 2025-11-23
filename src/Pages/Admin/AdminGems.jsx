import React, { useEffect, useState } from "react";
import LoadingScreen from "../LoadingScreen";
import "./Admin.css";
import { useSelector } from "react-redux";
export default function AdminGems() {

  const { userInfo: user, isLoggedIn: isloggedin } = useSelector(
    (state) => state.user
  );

  const [gems, setGems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination & Sort
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const baseURL = import.meta.env.VITE_Base_URL;

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Forms
  const [newGem, setNewGem] = useState({});

  const [editGem, setEditGem] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [editFormErrors, setEditFormErrors] = useState({});

  // Styles for Inputs to ensure visibility (Black text on White background)
  const inputStyle = {
    color: "black",
    // backgroundColor: "white",
    border: "1px solid #ccc",
  };

  // Styles for the Modal to be 90% height and responsive
  const modalStyle = {
    width: "90%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflowY: "auto",
    color: "black",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  };

  // ==================== FETCH DATA ====================

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        // 1. Fetch Gems (For the Table)
        const gemsRes = await fetch(
          `${baseURL}/gems`,
          { credentials: "include" }
        );
        if (!gemsRes.ok) throw new Error("Failed to fetch gems");
        const gemsData = await gemsRes.json();

        setGems(gemsData.result || []);
        setTotalPages(gemsData.totalPages || 1);
        const catRes = await fetch(`${baseURL}/categories`, {
          credentials: "include",
        });
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.result || []);
        }
      } catch (err) {
        setError(err.message || "Error loading data");
      }
      setLoading(false);
    }

    fetchData();
  }, [currentPage, refreshTrigger, sortOrder, baseURL]);


  const handleSortChange = (e) => setSortOrder(e.target.value);
  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // ==================== ACTIONS ====================
  const validateGemForm = (gemData) => {
    const errors = {};
    if (!gemData.name) errors.name = "Name is required";
    if (!gemData.gemLocation) errors.gemLocation = "Location is required";
    if (!gemData.category) errors.category = "Category is required";
    if (!gemData.description) errors.description = "Description is required";
    return errors;
  };

  const handleCreateGem = async (e) => {
    e.preventDefault();
    const errors = validateGemForm(newGem);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const formData = new FormData();
      Object.keys(newGem).forEach((key) => {
        if (key !== "images") formData.append(key, newGem[key]);
      });
      if (newGem.images && newGem.images.length > 0) {
        for (let i = 0; i < newGem.images.length; i++) {
          formData.append("images", newGem.images[i]);
        }
      }

      // const res = await fetch(`${baseURL}/info`, {
      //   method: "POST",
      //   credentials: "include",
      //   body: formData,
      // });
      // // CHANGE THIS:
const res = await fetch(`${baseURL}/gems`, { // Changed path and ID format
  method: "POST",
  credentials: "include",
  body: formData,
});
    
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create Gem");

      setShowCreateModal(false);
      setRefreshTrigger((prev) => prev + 1);
      setNewGem({
        name: "",
        images: [],
        gemLocation: "",
        status: "pending",
        isSubscribed: false,
        category: "",
        discount: 0,
        discountPremium: 0,
        description: "",
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteGem = async (gemId) => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;
    try {
      const res = await fetch(`${baseURL}/gems/${gemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete gem");
      setGems((prev) => prev.filter((g) => g._id !== gemId));
    } catch (err) {
      alert(err.message);
    }
  };

  const openEditModal = (gem) => {
    setEditGem({
      ...gem,
      category: gem.category,
      images: [],
    });
    setEditFormErrors({});
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const errors = validateGemForm(editGem);
    setEditFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const formData = new FormData();
      formData.append("name", editGem.name);
      formData.append("gemLocation", editGem.gemLocation);
      formData.append("status", editGem.status);
      formData.append("isSubscribed", editGem.isSubscribed);
      formData.append("category", editGem.category);
      formData.append("discount", editGem.discount);
      formData.append("discountPremium", editGem.discountPremium);
      formData.append("description", editGem.description);

      if (editGem.images && editGem.images.length > 0) {
        for (let i = 0; i < editGem.images.length; i++) {
          formData.append("images", editGem.images[i]);
        }
      }

      const res = await fetch(`${baseURL}/gems/${editGem._id}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update Gem");

      setGems((prev) =>
        prev.map((g) => (g._id === editGem._id ? data.result : g))
      );
      setShowEditModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isloggedin || !user || user.role !== "admin") {
    return <div className="admin-access-denied">Access denied. Admins only.</div>;
  }

  return (
    <>
    
    {loading ? (
        <LoadingScreen />
    ) : (
        <div className="admin-page">
        <div className="admin-dashboard">
            {/* HEADER */}
            <div className="admin-header-actions">
            <h1 className="admin-title">Gems Management</h1>
            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                <button
                className="admin-btn create-user-button"
                onClick={() => setShowCreateModal(true)}
                style={{ marginTop: 0 }}
                >
                Create Gem
                </button>
                <div className="admin-sort-wrapper">
                <label style={{color: "#333"}}>Sort by:</label>
                <select
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="admin-sort-select"
                    style={inputStyle}
                >
                    <option value="">Default</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="-name">Name (Z-A)</option>
                </select>
                </div>
            </div>
            </div>

            {/* TABLE */}
            {loading && gems.length === 0 ? (
            <p className="admin-loading">Loading Gems...</p>
            ) : error ? (
            <p className="admin-error">{error}</p>
            ) : (
            <div className="admin-table-wrapper">
                <table className="admin-table">
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Subscribed</th>
                    <th>Disc. / Prem.</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {gems.map((g) =>
                    g && g._id ? (
                        <tr key={g._id}>
                        <td>{g.name}</td>
                        <td>{g.gemLocation}</td>
                        <td>{g.category?.categoryName || "N/A"}</td>
                        <td>
                            <span
                            style={{
                                color: g.status === "accepted" ? "green" : "red",
                                fontWeight: "bold",
                                textTransform: "capitalize",
                            }}
                            >
                            {g.status}
                            </span>
                        </td>
                        <td>{g.isSubscribed ? "✅" : "❌"}</td>
                        <td>
                            {g.discount}% / {g.discountPremium || 0}%
                        </td>
                        <td>
                            <button className="admin-btn" onClick={() => openEditModal(g)}>
                            ✎
                            </button>
                            <button
                            className="admin-btn admin-btn-delete"
                            onClick={() => handleDeleteGem(g._id)}
                            >
                            🗑️
                            </button>
                        </td>
                        </tr>
                    ) : null
                    )}
                </tbody>
                </table>
            </div>
            )}

            {/* PAGINATION */}
            <div className="pagination-container">
            <p className="pagination-info" style={{color: '#666'}}>
                Page {currentPage} of {totalPages}
            </p>
            <div className="pagination-buttons">
                <button
                className="pagination-btn"
                onClick={prevPage}
                disabled={currentPage === 1 || loading}
                >
                Previous
                </button>
                <button
                className="pagination-btn"
                onClick={nextPage}
                disabled={currentPage === totalPages || loading}
                >
                Next
                </button>
            </div>
            </div>

            {/* ================= CREATE MODAL ================= */}
            {showCreateModal && (
            <div className="modal-overlay">
                <div className="modal" style={modalStyle}>
                <h2 style={{ color: "black", marginTop: 0 }}>Create New Gem</h2>
                <form onSubmit={handleCreateGem}>
                    <div className="form-grid">
                    <label style={{ color: "#333" }}>
                        Name:
                        <input
                        type="text"
                        value={newGem.name}
                        style={inputStyle}
                        onChange={(e) => setNewGem({ ...newGem, name: e.target.value })}
                        />
                        {formErrors.name && <span className="error">{formErrors.name}</span>}
                    </label>

                    <label style={{ color: "#333" }}>
                        Location:
                        <input
                        type="text"
                        value={newGem.gemLocation}
                        style={inputStyle}
                        onChange={(e) => setNewGem({ ...newGem, gemLocation: e.target.value })}
                        />
                    </label>

                    <label style={{ color: "#333" }}>
                        Category:
                        <select
                        value={newGem.category}
                        style={inputStyle}
                        onChange={(e) => setNewGem({ ...newGem, category: e.target.value })}
                        >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                            {cat.categoryName}
                            </option>
                        ))}
                        </select>
                        {formErrors.category && <span className="error">{formErrors.category}</span>}
                    </label>

                    <label style={{ color: "#333" }}>
                        Status:
                        <select
                        value={newGem.status}
                        style={inputStyle}
                        onChange={(e) => setNewGem({ ...newGem, status: e.target.value })}
                        >
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                        <option value="accepted">Accepted</option>
                        </select>
                    </label>
                    </div>

                    <div className="form-grid">
                    <label style={{ color: "#333" }}>
                        Standard Discount (%):
                        <input
                        type="number"
                        value={newGem.discount}
                        style={inputStyle}
                        onChange={(e) => setNewGem({ ...newGem, discount: e.target.value })}
                        />
                    </label>
                    <label style={{ color: "#333" }}>
                        Premium Discount (%):
                        <input
                        type="number"
                        value={newGem.discountPremium}
                        style={inputStyle}
                        onChange={(e) => setNewGem({ ...newGem, discountPremium: e.target.value })}
                        />
                    </label>
                    </div>

                    <label style={{ color: "#333" }}>
                    Description:
                    <textarea
                        rows="3"
                        value={newGem.description}
                        style={inputStyle}
                        onChange={(e) => setNewGem({ ...newGem, description: e.target.value })}
                    />
                    {formErrors.description && <span className="error">{formErrors.description}</span>}
                    </label>

                    <label style={{ flexDirection: "row", alignItems: "center", gap: "10px", color: "#333" }}>
                    <input
                        type="checkbox"
                        checked={newGem.isSubscribed}
                        onChange={(e) => setNewGem({ ...newGem, isSubscribed: e.target.checked })}
                        style={{ width: "auto" }}
                    />
                    Is Subscribed?
                    </label>

                    <label style={{ color: "#333" }}>
                    Images (Multiple):
                    <input
                        type="file"
                        multiple
                        style={inputStyle}
                        onChange={(e) => setNewGem({ ...newGem, images: e.target.files })}
                    />
                    </label>

                    <div className="modal-actions">
                    <button className="admin-btn" type="submit">Create</button>
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

            {/* ================= EDIT MODAL ================= */}
            {showEditModal && editGem && (
            <div className="modal-overlay">
                <div className="modal" style={modalStyle}>
                <h2 style={{ color: "black", marginTop: 0 }}>Edit Gem</h2>
                <form onSubmit={handleEditSubmit}>
                    <div className="form-grid">
                    <label style={{ color: "#333" }}>
                        Name:
                        <input
                        type="text"
                        value={editGem.name}
                        style={inputStyle}
                        onChange={(e) => setEditGem({ ...editGem, name: e.target.value })}
                        />
                    </label>
                    
                    <label style={{ color: "#333" }}>
                        Location:
                        <input
                        type="text"
                        value={editGem.gemLocation}
                        style={inputStyle}
                        onChange={(e) => setEditGem({ ...editGem, gemLocation: e.target.value })}
                        />
                    </label>

                    <label style={{ color: "#333" }}>
                        Category:
                        <select
                        value={editGem.category}
                        style={inputStyle}
                        onChange={(e) => setEditGem({ ...editGem, category: e.target.value })}
                        >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                            {cat.categoryName}
                            </option>
                        ))}
                        </select>
                    </label>

                    <label style={{ color: "#333" }}>
                        Status:
                        <select
                        value={editGem.status}
                        style={inputStyle}
                        onChange={(e) => setEditGem({ ...editGem, status: e.target.value })}
                        >
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="pending">Pending</option>
                        </select>
                    </label>
                    </div>

                    <div className="form-grid">
                    <label style={{ color: "#333" }}>
                        Standard Disc (%):
                        <input
                        type="number"
                        value={editGem.discount}
                        style={inputStyle}
                        onChange={(e) => setEditGem({ ...editGem, discount: e.target.value })}
                        />
                    </label>
                    <label style={{ color: "#333" }}>
                        Premium Disc (%):
                        <input
                        type="number"
                        value={editGem.discountPremium}
                        style={inputStyle}
                        onChange={(e) => setEditGem({ ...editGem, discountPremium: e.target.value })}
                        />
                    </label>
                    </div>

                    <label style={{ color: "#333" }}>
                    Description:
                    <textarea
                        rows="3"
                        value={editGem.description}
                        style={inputStyle}
                        onChange={(e) => setEditGem({ ...editGem, description: e.target.value })}
                    />
                    </label>

                    <label style={{ flexDirection: "row", alignItems: "center", gap: "10px", color: "#333" }}>
                    <input
                        type="checkbox"
                        checked={editGem.isSubscribed}
                        onChange={(e) => setEditGem({ ...editGem, isSubscribed: e.target.checked })}
                        style={{ width: "auto" }}
                    />
                    Is Subscribed?
                    </label>

                    <label style={{ color: "#333" }}>
                    Update Images (Overrides existing):
                    <input
                        type="file"
                        multiple
                        style={inputStyle}
                        onChange={(e) => setEditGem({ ...editGem, images: e.target.files })}
                    />
                    </label>

                    <div className="modal-actions">
                    <button className="admin-btn" type="submit">Save Changes</button>
                    <button
                        className="admin-btn admin-btn-delete"
                        type="button"
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
    )}
    </>
  );
}