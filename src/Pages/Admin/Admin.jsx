import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import "./Admin.css";

export default function Admin() {
  const { user, isloggedin } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "", // Adjusted position of phoneNumber
    email: "",
    password: "",
    image: null, // Added image field
  });

  // State for editing user
  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch all users
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

  // Create user
  const handleCreateUser = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log("Creating user with data:", newUser); // Debugging log
    try {
      const formData = new FormData();
      formData.append("firstName", newUser.firstName);
      formData.append("lastName", newUser.lastName);
      formData.append("phoneNumber", newUser.phoneNumber);
      formData.append("email", newUser.email);
      formData.append("password", newUser.password);
      if (newUser.image) {
        formData.append("image", newUser.image);
      }

      const res = await fetch("http://localhost:3000/auth/signUp", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      console.log("Response status:", res.status); // Debugging log
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Backend error details:", errorData);
        throw new Error("Failed to create user");
      }
      const data = await res.json();
      console.log("User created successfully:", data); // Debugging log

      // Ensure the new user object has all required properties
      if (data.result && data.result._id) {
        setUsers((prev) => [...prev, data.result]);
      } else {
        console.error("Invalid user data returned from API:", data);
      }

      setShowModal(false);
      setNewUser({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
        image: null,
      });
    } catch (err) {
      console.error("Error creating user:", err); // Debugging log
      alert(err.message);
    }
  };

  // Function to delete a user
  const handleDeleteUser = async (userId) => {
    try {
      const res = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error deleting user:", errorData);
        throw new Error("Failed to delete user");
      }

      setUsers((prev) => prev.filter((user) => user._id !== userId));
      console.log("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(err.message);
    }
  };

  // Function to edit a user
  const openEditModal = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    const allowedUpdates = ["phoneNumber", "email", "password", "image"];
    const payload = {};
    allowedUpdates.forEach((key) => {
        if (editUser[key] !== undefined) payload[key] = editUser[key];
    });
    // In handleEditUserSubmit, use FormData if image or password is present
    const isFile = editUser.image instanceof File;
    const isPassword = !!editUser.password;
    let body, headers;
    if (isFile || isPassword) {
        body = new FormData();
        allowedUpdates.forEach((key) => {
            if (editUser[key] !== undefined && editUser[key] !== "") {
                if (key === "image" && isFile) {
                    body.append("image", editUser.image);
                } else {
                    body.append(key, editUser[key]);
                }
            }
        });
        headers = undefined; // Let browser set multipart/form-data
    } else {
        body = JSON.stringify(payload);
        headers = { "Content-Type": "application/json" };
    }
    try {
        const res = await fetch(`http://localhost:3000/users/${editUser._id}`, {
            method: "PUT",
            headers,
            credentials: "include",
            body,
        });
        if (!res.ok) {
            const errorData = await res.json();
            console.error("Error editing user:", errorData);
            throw new Error("Failed to edit user");
        }
        const data = await res.json();
        setUsers((prev) => prev.map((user) => (user._id === editUser._id ? data.result : user)));
        setShowEditModal(false);
    } catch (err) {
        console.error("Error editing user:", err);
        alert(err.message);
    }
  };

  if (!isloggedin || !user || user.role !== "admin") {
    return (
      <div className="admin-access-denied">Access denied. Admins only.</div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">Admin Dashboard</h1>
      <h2 className="admin-subtitle">User Management</h2>
      {loading ? (
        <p className="admin-loading">Loading users...</p>
      ) : error ? (
        <p className="admin-error">{error}</p>
      ) : (
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
            {users.map((u) => (
                u && u._id ? (
                    <tr key={u._id}>
                        <td>{u._id}</td>
                        <td>{u.firstName} {u.lastName}</td>
                        <td>{u.email}</td>
                        <td>{u.phoneNumber}</td>
                        <td>
                            <button className="admin-btn" onClick={() => openEditModal(u)}>Edit</button>
                            <button className="admin-btn admin-btn-delete" onClick={() => handleDeleteUser(u._id)}>Delete</button>
                        </td>
                    </tr>
                ) : null
            ))}
          </tbody>
        </table>
      )}
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
              <label>
                First Name:
                <input
                  type="text"
                  value={newUser.firstName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, firstName: e.target.value })
                  }
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  value={newUser.lastName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, lastName: e.target.value })
                  }
                />
              </label>
              <label>
                Phone Number:
                <input
                  type="text"
                  value={newUser.phoneNumber}
                  onChange={(e) =>
                    setNewUser({ ...newUser, phoneNumber: e.target.value })
                  }
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
              </label>
              <label>
                Image:
                <input
                  type="file"
                  onChange={(e) =>
                    setNewUser({ ...newUser, image: e.target.files[0] })
                  }
                />
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

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit User</h2>
            <form onSubmit={handleEditUserSubmit}>
              <label>
                Phone Number:
                <input
                  type="text"
                  value={editUser.phoneNumber}
                  onChange={(e) => setEditUser({ ...editUser, phoneNumber: e.target.value })}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  value={editUser.password || ""}
                  onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                />
              </label>
              <label>
                Image:
                <input
                  type="file"
                  onChange={(e) => setEditUser({ ...editUser, image: e.target.files[0] })}
                />
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
  );
}
