import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
const BASE_URL = import.meta.env.VITE_Base_URL;

const CreateGem = ({ onGemCreated }) => {
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
    const { t } = useTranslation("AddPlace");
  // 1. Initialize images as an empty array
  const [formData, setFormData] = useState({
    name: "",
    gemLocation: "",
    category: "",
    images: [], 
  });

  // Fetch Categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${BASE_URL}/categories`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setCategories(data.result || []);
        }
      } catch (err) {
        console.error("Error loading categories", err);
      }
    }
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  // 2. Handle Multiple Files Selection
  const handleImageChange = (e) => {
    // e.target.files is a "FileList", we convert it to a normal Array
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Business Name is required";
    if (!formData.gemLocation.trim()) newErrors.gemLocation = "Address is required";
    if (!formData.category) newErrors.category = "Please select a category";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return toast.error("Please fix the errors");

    try {
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("gemLocation", formData.gemLocation);
      dataToSend.append("category", formData.category);
      dataToSend.append("status", "pending");
      dataToSend.append("description", "kalaaam to be removed"); ////
      // 3. Append each selected file to FormData
      formData.images.forEach((file) => {
        dataToSend.append("images", file);
      });

      const res = await fetch(`${BASE_URL}/gems`, {
        method: "POST",
        credentials: "include",
        body: dataToSend, // Browser sets Content-Type to multipart/form-data automatically
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create Gem");

      toast.success("Place added! Now add a review.");
      
      // Pass ID and Name back to the Wizard
      onGemCreated(data.result._id || data._id, formData.name);

    } catch (err) {
      console.error("Error creating gem:", err);
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-gray-50 p-6 rounded-lg addPlace">
        <h2 className="text-2xl font-semibold mb-4 text-[#DD0303]">
          {t("Information-title")}
        </h2>
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block font-medium">
              {t("Information-l1")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${
                errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block font-medium">
              {t("Information-l2")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="gemLocation"
              value={formData.gemLocation}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${
                errors.gemLocation
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            />
            {errors.gemLocation && (
              <p className="text-red-500 text-xs mt-1">{errors.gemLocation}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium">
              {t("Information-l3")} <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded placeSelect ${
                errors.category ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            >
              <option value="">{t("Information-l3.1")}</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName || cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          {/* 4. Image Upload Input */}
          <div>
            <label className="block font-medium">{t("Information-l4")}</label>
            <input
              type="file"
              multiple // <--- ALLOWS MULTIPLE SELECTION
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded bg-white"
            />
            {/* Show how many files are selected */}
            <p className="text-xs text-gray-500 mt-1">
              {formData.images.length > 0
                ? `${formData.images.length} files selected`
                : "No files selected"}
            </p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="bg-[#DD0303] text-white px-6 py-2 rounded mt-6 ml-auto block cursor-pointer hover:bg-red-700 transition"
      >
        {t("btn")}
      </button>
    </form>
  );
};

export default CreateGem;