import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./Admin.css";
import LoadingScreen from "../LoadingScreen";
import { useTranslation } from "react-i18next";

export default function AdminUsers() {
  const { t } = useTranslation("AdminUsers");

  const { userInfo: user, isLoggedIn: isloggedin } = useSelector(
    (state) => state.user
  );

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sortOrder, setSortOrder] = useState("");

  const baseURL = import.meta.env.VITE_Base_URL;

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${baseURL}/users?page=${currentPage}&sort=${sortOrder}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error(t("fetch-failed"));
        const data = await res.json();
        setUsers(data.result || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError(err.message || t("fetch-error"));
      }
      setLoading(false);
    }
    fetchUsers();
  }, [currentPage, refreshTrigger, sortOrder, t]);

  const handleSortChange = (e) => setSortOrder(e.target.value);

  const nextPage = () => setCurrentPage((p) => p + 1);
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

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

  // ========== CREATE ==========
  const validateNewUser = () => {
    const errors = {};
    if (!newUser.firstName) errors.firstName = t("error-firstName");
    if (!newUser.lastName) errors.lastName = t("error-lastName");
    if (!newUser.phoneNumber) errors.phoneNumber = t("error-phone");
    if (!newUser.email) errors.email = t("error-email");
    if (!newUser.password) errors.password = t("error-password");
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

      const res = await fetch(`${baseURL}/users`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) setFormErrors(data.errors);
        else throw new Error(data.error || t("create-failed"));
        return;
      }

      setRefreshTrigger((p) => p + 1);
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

  // ========== DELETE ==========
  const handleDeleteUser = async (userId) => {
    if (!window.confirm(t("delete-confirm"))) return;

    try {
      const res = await fetch(`${baseURL}/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || t("delete-failed"));
      }

      if (users.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      } else {
        setRefreshTrigger((p) => p + 1);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // ========== EDIT ==========
  const openEditModal = (user) => {
    setEditUser(user);
    setEditFormErrors({});
    setShowEditModal(true);
  };

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!editUser.phoneNumber) errors.phoneNumber = t("error-phone");
    if (!editUser.email) errors.email = t("error-email");
    setEditFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    const allowedUpdates = ["phoneNumber", "email", "image"];

    let body, headers;
    const isFile = editUser.image instanceof File;

    if (isFile) {
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
      const res = await fetch(`${baseURL}/users/${editUser._id}`, {
        method: "PUT",
        credentials: "include",
        headers,
        body,
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.errors) setEditFormErrors(data.errors);
        else throw new Error(data.error || data.message || t("edit-failed"));
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
    return <div className="admin-access-denied">{t("admin-only")}</div>;
  }

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className="admin-page">
      <div className="admin-dashboard">
        <div className="admin-header-actions">
          <h1 className="admin-title">{t("title")}</h1>

          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <button
              className="admin-btn create-user-button"
              onClick={() => setShowModal(true)}
              style={{ marginTop: 0 }}
            >
              {t("create-user")}
            </button>

            <div className="admin-sort-wrapper">
              <label htmlFor="sortUsers">{t("sort-by")}</label>
              <select
                id="sortUsers"
                value={sortOrder}
                onChange={handleSortChange}
                className="admin-sort-select"
              >
                <option value="">{t("default")}</option>
                <option value="firstName">{t("name-asc")}</option>
                <option value="-firstName">{t("name-desc")}</option>
              </select>
            </div>
          </div>
        </div>

        {loading && users.length === 0 ? (
          <p className="admin-loading">{t("loading")}</p>
        ) : error ? (
          <p className="admin-error">{error}</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t("name")}</th>
                  <th>{t("email")}</th>
                  <th>{t("phone")}</th>
                  <th>{t("actions")}</th>
                </tr>
              </thead>

              <tbody>
                {users.map(
                  (u) =>
                    u &&
                    u._id && (
                      <tr key={u._id}>
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
                            ✎
                          </button>

                          <button
                            className="admin-btn admin-btn-delete"
                            onClick={() => handleDeleteUser(u._id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="pagination-container">
          <p className="pagination-info">
            {t("page")} {currentPage} {t("of")} {totalPages}
          </p>

          <div className="pagination-buttons">
            <button
              className="pagination-btn"
              onClick={prevPage}
              disabled={currentPage === 1 || loading}
            >
              {t("previous")}
            </button>

            <button
              className="pagination-btn"
              onClick={nextPage}
              disabled={currentPage === totalPages || loading}
            >
              {t("next")}
            </button>
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>{t("create-user")}</h2>
              <form onSubmit={handleCreateUser}>
                {[
                  "firstName",
                  "lastName",
                  "phoneNumber",
                  "email",
                  "password",
                ].map((field) => (
                  <label key={field}>
                    {t(field)}
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
                  {t("image")}
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
                    {t("create")}
                  </button>
                  <button
                    className="admin-btn admin-btn-delete"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    {t("cancel")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>{t("edit-user")}</h2>
              <form onSubmit={handleEditUserSubmit}>
                {["phoneNumber", "email"].map((field) => (
                  <label key={field}>
                    {t(field)}
                    <input
                      type={field === "email" ? "email" : "text"}
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
                  {t("image")}
                  <input
                    type="file"
                    onChange={(e) =>
                      setEditUser({ ...editUser, image: e.target.files[0] })
                    }
                  />
                </label>

                <div className="modal-actions">
                  <button className="admin-btn" type="submit">
                    {t("save")}
                  </button>

                  <button
                    className="admin-btn admin-btn-delete"
                    type="button"
                    onClick={() => setShowEditModal(false)}
                  >
                    {t("cancel")}
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
  