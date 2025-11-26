import React, { useEffect, useState } from "react";
import LoadingScreen from "../LoadingScreen";
import "./Admin.css";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import GemForm from "./GemForm";
import DeleteGemModal from "./DeleteGemModal";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [gemToDelete, setGemToDelete] = useState(null);
  const [editGem, setEditGem] = useState(null);

  // Modal wrapper style
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
        // Build query params
        const params = new URLSearchParams();
        params.append("page", currentPage);
        if (sortOrder) params.append("sort", sortOrder);

        // Fetch Gems
        const gemsRes = await fetch(`${baseURL}/gems?${params.toString()}`, {
          credentials: "include",
        });
        if (!gemsRes.ok) throw new Error("Failed to fetch gems");
        const gemsData = await gemsRes.json();

        setGems(gemsData.result || []);
        setTotalPages(gemsData.totalPages || 1);

        // Fetch Categories
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

  // ==================== HANDLERS ====================
  const handleSortChange = (e) => setSortOrder(e.target.value);
  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));


// ==================== CREATE GEM ====================
const handleCreateGem = async (formData) => {
  const data = new FormData();
  
  // Append all form fields EXCEPT images first
  Object.entries(formData).forEach(([key, value]) => {
    if (key !== "images") {
      data.append(key, value);
    }
  });

  // Handle images separately - FileList is not a regular array
  if (formData.images && formData.images.length > 0) {
    // Convert FileList to array and append each file
    Array.from(formData.images).forEach((file) => {
      data.append("images", file);
    });
  }

  try {
    const res = await fetch(`${baseURL}/gems`, {
      method: "POST",
      credentials: "include",
      body: data,
    });

    const responseData = await res.json();
    
    // Debug: Log FormData entries
    console.log("FormData entries:");
    for (let pair of data.entries()) {
      console.log(pair[0] + ': ', pair[1]);
    }
    
    if (!res.ok) {
      const errorMessage = responseData.error || responseData.message || "Failed to create Gem";
      if (res.status === 400 && errorMessage.includes("already exists")) {
        throw new Error("A gem with this name already exists. Please choose a different name.");
      }
      throw new Error(errorMessage);
    }

    toast.success("Gem created successfully!");
    
    if (gems.length === 0) {
      setRefreshTrigger((prev) => prev + 1);
    } else {
      setGems((prev) => [responseData.result, ...prev]);
    }
    
    setShowCreateModal(false);
  } catch (err) {
    console.error("Error creating gem:", err);
    toast.error(err.message);
  }
};
  // ==================== DELETE GEM ====================
  const handleDeleteGem = (gem) => {
    setGemToDelete(gem);
    setShowDeleteModal(true);
  };

  const confirmDeleteGem = async () => {
    if (!gemToDelete) return;

    try {
      const res = await fetch(`${baseURL}/gems/${gemToDelete._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete gem");
      }

      toast.success("Gem deleted successfully");
      
      // Check if we need to go back a page (if this was the last gem on the current page)
      if (gems.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        // Otherwise, just refresh the current page
        setRefreshTrigger((prev) => prev + 1);
      }
      
      setShowDeleteModal(false);
      setGemToDelete(null);
    } catch (err) {
      console.error("Error deleting gem:", err);
      toast.error(err.message || "Failed to delete gem");
    }
  };

  // ==================== EDIT GEM ====================
  const openEditModal = (gem) => {
    setEditGem(gem);
    setShowEditModal(true);
  };

 // ==================== EDIT GEM ====================
const handleEditSubmit = async (formData) => {
  try {
    const data = new FormData();
    
    // Append all form fields EXCEPT images first
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "images") {
        data.append(key, value);
      }
    });

    // Handle images separately - FileList is not a regular array
    if (formData.images && formData.images.length > 0) {
      Array.from(formData.images).forEach((file) => {
        data.append("images", file);
      });
    }

    const res = await fetch(`${baseURL}/gems/${editGem._id}`, {
      method: "PUT",
      credentials: "include",
      body: data,
    });

    const responseData = await res.json();
    if (!res.ok)
      throw new Error(responseData.error || responseData.message || "Failed to update Gem");

    setGems((prev) =>
      prev.map((g) => (g._id === editGem._id ? responseData.result : g))
    );
    toast.success("Gem updated successfully");
    setShowEditModal(false);
  } catch (err) {
    console.error("Error updating gem:", err);
    toast.error(err.message || "Failed to update gem");
  }
};
  // ==================== ACCESS CONTROL ====================
  if (!isloggedin || !user || user.role !== "admin") {
    return (
      <div className="admin-access-denied">Access denied. Admins only.</div>
    );
  }

  // ==================== RENDER ====================
  return (
    <>
      {loading && gems.length === 0 ? (
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
                  <label style={{ color: "#333" }}>Sort by:</label>
                  <select
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="admin-sort-select"
                  >
                    <option value="">Default</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="-name">Name (Z-A)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* TABLE */}
            {error ? (
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
                      <th>Location</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Subscribed</th>
                      <th>Disc. / Gold / Plat.</th>
                      <th>Created By</th>
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
                            {g.discount}% / {g.discountGold || 0}% / {g.discountPlatinum || 0}%
                          </td>
                          <td>{g.createdBy?.email || "N/A"}</td>
                          <td>
                            <button
                              className="admin-btn"
                              onClick={() => openEditModal(g)}
                            >
                              ✎
                            </button>
                            <button
                              className="admin-btn admin-btn-delete"
                              onClick={() => handleDeleteGem(g)}
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
              <p className="pagination-info" style={{ color: "#666" }}>
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
                  <GemForm
                    categories={categories}
                    onSubmit={handleCreateGem}
                    onCancel={() => setShowCreateModal(false)}
                    isEdit={false}
                  />
                </div>
              </div>
            )}

            {/* ================= EDIT MODAL ================= */}
            {showEditModal && editGem && (
              <div className="modal-overlay">
                <div className="modal" style={modalStyle}>
                  <h2 style={{ color: "black", marginTop: 0 }}>Edit Gem</h2>
                  <GemForm
                    initialData={editGem}
                    categories={categories}
                    onSubmit={handleEditSubmit}
                    onCancel={() => setShowEditModal(false)}
                    isEdit={true}
                  />
                </div>
              </div>
            )}

            {/* ================= DELETE MODAL ================= */}
            {showDeleteModal && gemToDelete && (
              <DeleteGemModal
                gemName={gemToDelete.name}
                onConfirm={confirmDeleteGem}
                onCancel={() => {
                  setShowDeleteModal(false);
                  setGemToDelete(null);
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}