import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Owner.css";

export default function AddRestaurant() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Egyptian",
    location: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRestaurant = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
    };

    const updatedData = [newRestaurant];
    localStorage.setItem("ownerRestaurants", JSON.stringify(updatedData));

    toast.success("Restaurant added successfully!");
    navigate("/owner/dashboard");
  };

  return (
    <div className="owner-dashboard">
      <h1 className="owner-title">Add Your Restaurant</h1>
      <p className="owner-subtitle">
        Fill in the details below to list your place.
      </p>

      <div className="owner-form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Restaurant Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Koshary El Tahrir"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Egyptian">Egyptian</option>
              <option value="Italian">Italian</option>
              <option value="Syrian">Syrian</option>
              <option value="Asian">Asian</option>
              <option value="Cafe">Cafe</option>
              <option value="Fast Food">Fast Food</option>
            </select>
          </div>

          <div className="form-group">
            <label>Location / Address</label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Downtown, Cairo"
            />
          </div>

          <div className="form-group">
            <label>Image URL (Optional)</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about your restaurant..."
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">
            Add Restaurant
          </button>
        </form>
      </div>
    </div>
  );
}
