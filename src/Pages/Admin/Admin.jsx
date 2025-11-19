import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./Admin.css";

export default function Admin() {
  const { userInfo: user, isLoggedIn: isloggedin } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    image: null,
  });
  const [formErrors, setFormErrors] = useState({});

  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormErrors, setEditFormErrors] = useState({});

  // Fetch users
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:3000/users", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data.result || []);
      } catch (err) {
        setError(err.message || "Error fetching users");
      }
      setLoading(false);
    }
    fetchUsers();
  }, []);

  // ==================== CREATE USER ====================
  const validateNewUser = () => {
    const errors = {};
    if (!newUser.firstName) errors.firstName = "First name is required";
    if (!newUser.lastName) errors.lastName = "Last name is required";
    if (!newUser.phoneNumber) errors.phoneNumber = "Phone number is required";
    if (!newUser.email) errors.email = "Email is required";
    if (!newUser.password) errors.password = "Password is required";
    return errors;
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const errors = validateNewUser();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const formData = new FormData();
      Object.entries(newUser).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const res = await fetch("http://localhost:3000/auth/signUp", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setFormErrors(data.errors); // backend field errors
        } else {
          throw new Error(data.message || "Failed to create user");
        }
        return;
      }

      setUsers((prev) => [...prev, data.result]);
      setShowModal(false);
      setNewUser({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
        image: null,
      });
      setFormErrors({});
    } catch (err) {
      alert(err.message);
    }
  };

  // ==================== DELETE USER ====================
  const handleDeleteUser = async (userId) => {
    try {
      const res = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete user");
      }
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert(err.message);
    }
  };

  // ==================== EDIT USER ====================
  const openEditModal = (user) => {
    setEditUser(user);
    setEditFormErrors({});
    setShowEditModal(true);
  };

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!editUser.phoneNumber) errors.phoneNumber = "Phone number is required";
    if (!editUser.email) errors.email = "Email is required";
    setEditFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const allowedUpdates = ["phoneNumber", "email", "password", "image"];
    let body, headers;
    const isFile = editUser.image instanceof File;
    const isPassword = !!editUser.password;

    if (isFile || isPassword) {
      body = new FormData();
      allowedUpdates.forEach((key) => {
        if (editUser[key]) {
          if (key === "image" && isFile) body.append("image", editUser.image);
          else body.append(key, editUser[key]);
        }
      });
      headers = undefined;
    } else {
      const payload = {};
      allowedUpdates.forEach((key) => {
        if (editUser[key] !== undefined) payload[key] = editUser[key];
      });
      body = JSON.stringify(payload);
      headers = { "Content-Type": "application/json" };
    }

    try {
      const res = await fetch(`http://localhost:3000/users/${editUser._id}`, {
        method: "PUT",
        credentials: "include",
        headers,
        body,
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.errors) setEditFormErrors(data.errors);
        else throw new Error(data.message || "Failed to edit user");
        return;
      }

      setUsers((prev) =>
        prev.map((u) => (u._id === editUser._id ? data.result : u))
      );
      setShowEditModal(false);
      setEditFormErrors({});
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isloggedin || !user || user.role !== "admin") {
    return (
      <div className="admin-access-denied">Access denied. Admins only.</div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-dashboard">
        <h1 className="admin-title">Admin Dashboard</h1>
        <h2 className="admin-subtitle">User Management</h2>

        {loading ? (
          <p className="admin-loading">Loading users...</p>
        ) : error ? (
          <p className="admin-error">{error}</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) =>
                  u && u._id ? (
                    <tr key={u._id}>
                      <td>{u._id}</td>
                      <td>
                        {u.firstName} {u.lastName}
                      </td>
                      <td>{u.email}</td>
                      <td>{u.phoneNumber}</td>
                      <td>
                        <button
                          className="admin-btn"
                          onClick={() => openEditModal(u)}
                        >
                          Edit
                        </button>
                        <button
                          className="admin-btn admin-btn-delete"
                          onClick={() => handleDeleteUser(u._id)}
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
        )}

        {/* CREATE USER */}
        <div className="admin-create-user">
          <h3>Create New User</h3>
          <button className="admin-btn" onClick={() => setShowModal(true)}>
            Create User
          </button>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Create User</h2>
              <form onSubmit={handleCreateUser}>
                {[
                  "firstName",
                  "lastName",
                  "phoneNumber",
                  "email",
                  "password",
                ].map((field) => (
                  <label key={field}>
                    {field
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    :
                    <input
                      type={
                        field === "email"
                          ? "email"
                          : field === "password"
                          ? "password"
                          : "text"
                      }
                      value={newUser[field]}
                      onChange={(e) =>
                        setNewUser({ ...newUser, [field]: e.target.value })
                      }
                    />
                    {formErrors[field] && (
                      <span className="error">{formErrors[field]}</span>
                    )}
                  </label>
                ))}
                <label>
                  Image:
                  <input
                    type="file"
                    onChange={(e) =>
                      setNewUser({ ...newUser, image: e.target.files[0] })
                    }
                  />
                  {formErrors.image && (
                    <span className="error">{formErrors.image}</span>
                  )}
                </label>
                <div className="modal-actions">
                  <button className="admin-btn" type="submit">
                    Create
                  </button>
                  <button
                    className="admin-btn admin-btn-delete"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT USER */}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Edit User</h2>
              <form onSubmit={handleEditUserSubmit}>
                {["phoneNumber", "email", "password"].map((field) => (
                  <label key={field}>
                    {field
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    :
                    <input
                      type={
                        field === "email"
                          ? "email"
                          : field === "password"
                          ? "password"
                          : "text"
                      }
                      value={editUser[field] || ""}
                      onChange={(e) =>
                        setEditUser({ ...editUser, [field]: e.target.value })
                      }
                    />
                    {editFormErrors[field] && (
                      <span className="error">{editFormErrors[field]}</span>
                    )}
                  </label>
                ))}
                <label>
                  Image:
                  <input
                    type="file"
                    onChange={(e) =>
                      setEditUser({ ...editUser, image: e.target.files[0] })
                    }
                  />
                  {editFormErrors.image && (
                    <span className="error">{editFormErrors.image}</span>
                  )}
                </label>
                <div className="modal-actions">
                  <button className="admin-btn" type="submit">
                    Save Changes
                  </button>
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
  );
}
