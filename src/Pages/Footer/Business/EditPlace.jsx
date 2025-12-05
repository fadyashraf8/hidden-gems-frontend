import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { getGemByIdAPI } from "../../../Services/GemsAuth";

const BASE_URL = import.meta.env.VITE_Base_URL;

const EditPlace = () => {
  const { gemId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("AddPlace");
  
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  
  const [formData, setFormData] = useState({
    name: "",
    gemLocation: "",
    category: "",
    description: "",
    images: [],
  });

  // Fetch Gem Details
  useEffect(() => {
    async function fetchGemDetails() {
      try {
        const data = await getGemByIdAPI(gemId);
        if (data.result) {
          const gem = data.result;
          setFormData({
            name: gem.name || "",
            gemLocation: gem.gemLocation || "",
            category: gem.category?._id || "",
            description: gem.description || "",
            images: [],
          });
          setExistingImages(gem.images || []);
        } else {
          toast.error("Failed to load gem details");
          navigate("/created-by-you");
        }
      } catch (err) {
        console.error("Error loading gem:", err);
        toast.error("Error loading gem details");
        navigate("/created-by-you");
      }
    }
    fetchGemDetails();
  }, [gemId, navigate]);

  // --- FIXED UPDATE FUNCTION ---
  async function updateGem(gemId, gemData) {
    try {
      const token = localStorage.getItem("token"); // 1. Get Token
      
      const response = await fetch(`${BASE_URL}/gems/${gemId}`, {
        method: "PUT",
        // headers: {
        //     "Authorization": `Bearer ${token}` // 2. Add Token Header
        //     // Do NOT add Content-Type here, browser handles it for FormData
        // },
        body: gemData,
        credentials: "include"
      });

      const res = await response.json(); // 3. Await json()

      // 4. Return a consistent structure
      if (response.ok) {
        return { success: true, message: res.message || "Gem updated successfully" };
      } else {
        return { success: false, message: res.message || res.error || "Update failed" };
      }
    } catch (error) {
      console.log("Failed to update " + error);
      return { success: false, message: "Network error" };
    }
  }  

  // Fetch Categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${BASE_URL}/categories`);
        if (res.ok) {
          const data = await res.json();
          setCategories(data.result || []);
        }
      } catch (err) {
        console.error("Error loading categories", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const removeNewImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const removeExistingImage = (imageName) => {
    setExistingImages(existingImages.filter((img) => img !== imageName));
    setImagesToDelete([...imagesToDelete, imageName]);
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

    setSubmitting(true);
    try {
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("gemLocation", formData.gemLocation);
      dataToSend.append("category", formData.category);
      dataToSend.append("description", formData.description || "");
      
      if (existingImages.length > 0) {
        dataToSend.append("existingImages", JSON.stringify(existingImages));
      }
      
      if (imagesToDelete.length > 0) {
        dataToSend.append("imagesToDelete", JSON.stringify(imagesToDelete));
      }
      
      formData.images.forEach((file) => {
        dataToSend.append("images", file);
      });

      // --- FIXED LOGIC ---
      const result = await updateGem(gemId, dataToSend);
      
      // Now checking result.success specifically
      if (result.success) {
        toast.success("Place updated successfully!");
        navigate("/created-by-you");
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error("Error updating gem:", err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="footer-page-wrapper">
        <div className="footer-page-container">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DD0303]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        <h1 className="footer-page-title">Edit Place</h1>

        <div className="footer-page-content">
          <p className="mb-6">Update your place information</p>

          <form onSubmit={handleSubmit}>
            <div className="bg-gray-50 p-6 rounded-lg addPlace">
              <h2 className="text-2xl font-semibold mb-4 text-[#DD0303]">
                {t("Information-title")}
              </h2>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter business name"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#DD0303] ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="gemLocation"
                    value={formData.gemLocation}
                    onChange={handleInputChange}
                    placeholder="Enter address"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#DD0303] ${
                      errors.gemLocation ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.gemLocation && <p className="text-red-500 text-sm mt-1">{errors.gemLocation}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#DD0303] ${
                      errors.category ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Add a description (optional)"
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DD0303]"
                  />
                </div>

                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Images
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {existingImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={`${BASE_URL}/uploads/gem/${image}`}
                            alt={`Existing ${index}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(image)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add New Images (Optional)
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    accept="image/*"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DD0303]"
                  />
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {formData.images.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`New ${index}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#DD0303] text-white py-3 rounded-lg font-semibold hover:bg-[#b90202] transition disabled:opacity-50"
                >
                  {submitting ? "Updating..." : "Update Place"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/created-by-you")}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPlace;