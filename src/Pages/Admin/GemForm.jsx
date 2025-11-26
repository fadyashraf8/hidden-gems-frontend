import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Added default empty array for categories to prevent map errors
const GemForm = ({ initialData = {}, categories = [], onSubmit, onCancel, isEdit = false }) => {
  // Default empty state matching your schema
  const defaultState = {
    name: "",
    gemLocation: "",
    status: "pending",
    isSubscribed: false,
    category: "", // This will store the ID string
    discount: 0,
    discountGold: 0,
    discountPlatinum: 0,
    description: "",
    images: [], // Array for new file uploads
  };

  const [formData, setFormData] = useState(defaultState);
  const [errors, setErrors] = useState({});

  // Populate form if editing
  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        ...defaultState,
        // Spread initial data (name, location, etc.)
        ...initialData,
        // Safely extract category ID
        // Use optional chaining to prevent crashes if initialData.category is null/undefined
        category: initialData.category?._id || initialData.category || "", 
        // Reset images array because we can't pre-fill <input type="file">
        images: [], 
      });
    }
  }, [initialData, isEdit]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.gemLocation) newErrors.gemLocation = "Location is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    console.log(formData)
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all required fields");
      return;
    }
    onSubmit(formData);
  };

  const inputStyle = { color: "black", border: "1px solid #ccc" };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        {/* Name */}
        <label style={{ color: "#333" }}>
          Name:
          <input
            type="text"
            style={inputStyle}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {errors.name && <span className="error" style={{ color: "red" }}>{errors.name}</span>}
        </label>

        {/* Location */}
        <label style={{ color: "#333" }}>
          Location:
          <input
            type="text"
            style={inputStyle}
            value={formData.gemLocation}
            onChange={(e) => setFormData({ ...formData, gemLocation: e.target.value })}
          />
          {errors.gemLocation && <span className="error" style={{ color: "red" }}>{errors.gemLocation}</span>}
        </label>

        {/* Category */}
        <label style={{ color: "#333" }}>
          Category:
          <select
            style={inputStyle}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="">Select Category</option>
            {/* Safely map over categories with optional chaining */}
            {categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.categoryName}
              </option>
            ))}
          </select>
          {errors.category && <span className="error" style={{ color: "red" }}>{errors.category}</span>}
        </label>

        {/* Status */}
        <label style={{ color: "#333" }}>
          Status:
          <select
            style={inputStyle}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
      </div>

      {/* Discounts */}
      <div className="form-grid">
        <label style={{ color: "#333" }}>
          Standard Discount (%):
          <input
            type="number"
            style={inputStyle}
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
          />
        </label>
        <label style={{ color: "#333" }}>
          Gold Discount (%):
          <input
            type="number"
            style={inputStyle}
            value={formData.discountGold}
            onChange={(e) => setFormData({ ...formData, discountGold: e.target.value })}
          />
        </label>
        <label style={{ color: "#333" }}>
          Platinum Discount (%):
          <input
            type="number"
            style={inputStyle}
            value={formData.discountPlatinum}
            onChange={(e) => setFormData({ ...formData, discountPlatinum: e.target.value })}
          />
        </label>
      </div>

      {/* Description */}
      <label style={{ color: "#333" }}>
        Description:
        <textarea
          rows="3"
          style={inputStyle}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        {errors.description && <span className="error" style={{ color: "red" }}>{errors.description}</span>}
      </label>

      {/* Is Subscribed */}
      <label style={{ display: "flex", alignItems: "center", gap: "10px", color: "#333" }}>
        <input
          type="checkbox"
          style={{ width: "auto" }}
          checked={formData.isSubscribed}
          onChange={(e) => setFormData({ ...formData, isSubscribed: e.target.checked })}
        />
        Is Subscribed?
      </label>

      {/* Images */}
      <label style={{ color: "#333" }}>
        {isEdit ? "Update Images (Overrides existing):" : "Images (Multiple):"}
        <input
          type="file"
          multiple
          style={inputStyle}
          onChange={(e) => setFormData({ ...formData, images: e.target.files })}
        />
      </label>

      {/* Actions */}
      <div className="modal-actions">
        <button className="admin-btn" type="submit">
          {isEdit ? "Save Changes" : "Create Gem"}
        </button>
        <button
          className="admin-btn admin-btn-delete"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default GemForm;