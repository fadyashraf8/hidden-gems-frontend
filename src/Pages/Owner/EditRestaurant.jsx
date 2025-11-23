import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Owner.css";

export default function EditRestaurant() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    category: "Egyptian",
    location: "",
    image: "",
    createdAt: "",
  });

  useEffect(() => {
    const storedData = localStorage.getItem("ownerRestaurants");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      let restaurantToEdit = null;

      if (Array.isArray(parsedData) && parsedData.length > 0) {
        restaurantToEdit = parsedData[0];
      } else if (!Array.isArray(parsedData) && parsedData.id) {
        restaurantToEdit = parsedData;
      }

      if (restaurantToEdit) {
        setFormData(restaurantToEdit);
      } else {
        toast.error("No restaurant found to edit.");
        navigate("/owner/dashboard");
      }
    } else {
      toast.error("No restaurant found to edit.");
      navigate("/owner/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Update localStorage
    // Since we only have one restaurant, we just overwrite the array with this single updated object
    const updatedData = [formData];
    localStorage.setItem("ownerRestaurants", JSON.stringify(updatedData));

    toast.success("Restaurant updated successfully!");
    navigate("/owner/dashboard");
  };

  return (
    <div className="owner-dashboard">
      <h1 className="owner-title">Edit Restaurant</h1>

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
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" className="submit-btn">
              Save Changes
            </button>
            <button
              type="button"
              className="submit-btn"
              style={{ backgroundColor: "#6c757d" }}
              onClick={() => navigate("/owner/dashboard")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
