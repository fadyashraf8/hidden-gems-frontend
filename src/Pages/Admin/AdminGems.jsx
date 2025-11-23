import React, { useEffect, useState } from "react";
import "./Admin.css";
import LoadingScreen from "../LoadingScreen";
import axios from "axios";

export default function AdminGems() {
  const [gems, setGems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [gemsPerPage, setGemsPerPage] = useState(0);
  const [error, setError] = useState(null);
  const [editGem, setEditGem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [createFormErrors, setCreateFormErrors] = useState({});
  const [newGem, setNewGem] = useState({
    name: "",
    images: [],
    location: "",
    status: "",
    isSubscribed: false, //switch
    category: "",
    discount: "",
    premiumDiscount: "",
    avgRating: "",
    description: "",
  });
  const baseURL = import.meta.env.VITE_Base_URL;

  useEffect(() => {
    // Fetch gems data from the server
    async function fetchGems() {
    setLoading(true);

    const res = await axios(baseURL + "/gems", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok){
          setError("Failed to fetch gems data");
        }
        return res.json();
      })
      .then((data) => {
        setGems(data.result || []);
        setTotalPages(data.totalPages || 1);
        setGemsPerPage(Math.ceil(data.result.length/data.totalPages) || 1);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    }
    fetchGems();
  }, []);

  const handleDeleteGem = (gemId) => {
    setGems((prevGems) => prevGems.filter((g) => g._id !== gemId))
  }
  if(loading){
    return <LoadingScreen/>;
  }
  return (
    <div className="admin-page">
      <div className="admin-dashboard">
        {/* <h1 className="admin-title">Gems Management</h1>
        <p className="admin-placeholder">Coming Soon...</p> */}
        <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Premium Discount</th>
                </tr>
              </thead>
              <tbody>
                {gems.map((g) =>
                  g && g._id ? (
                    <tr key={g._id}>
                      <td>
                        {g.name}
                      </td>
                      <td>{g.location}</td>
                      <td>{g.status}</td>
                      <td>
                        <button
                          className="admin-btn"
                          onClick={() => openEditModal(g)}
                        >
                          Edit
                        </button>
                        <button
                          className="admin-btn admin-btn-delete"
                          onClick={() => handleDeleteUser(g._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ) : null
                )}
              </tbody>
            </table>
      </div>
    </div>
  );
}
