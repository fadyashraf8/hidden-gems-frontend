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
  
  const [formData, setFormData] = useState({
    name: "",
    gemLocation: "",
    category: "",
    description: "",
    images: [],
  });

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

  async function updateGem(gemId, gemData) {
    try {
      
      const response = await fetch(`${BASE_URL}/gems/${gemId}`, {
        method: "PUT",
      
        body: gemData,
        credentials: "include"
      });

      const res = await response.json();

      if (response.ok) {
        return { 
          success: true, 
          message: res.message || "Gem updated successfully" 
        };
      } else {
        return { 
          success: false, 
          message: res.message || res.error || "Update failed" 
        };
      }
    } catch (error) {
      console.error("Failed to update:", error);
      return { 
        success: false, 
        message: "Network error" 
      };
    }
  }

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
    
    if (!validateForm()) {
      toast.error("Please fix the errors");
      return;
    }

    setSubmitting(true);

    try {
      const dataToSend = new FormData();
      
      dataToSend.append("name", formData.name);
      dataToSend.append("gemLocation", formData.gemLocation);
      dataToSend.append("category", formData.category);
      dataToSend.append("description", formData.description || "");

      existingImages.forEach((image) => {
        dataToSend.append("oldImages", image);
      });

      formData.images.forEach((file) => {
        dataToSend.append("images", file);
      });

      const result = await updateGem(gemId, dataToSend);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Edit Place</h1>
            <p className="text-gray-600 mt-2">Update your place information</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700">
                {t("Information-title")}
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DD0303]"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="gemLocation"
                  value={formData.gemLocation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DD0303]"
                />
                {errors.gemLocation && (
                  <p className="text-red-500 text-sm mt-1">{errors.gemLocation}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DD0303]"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DD0303]"
                />
              </div>

              {existingImages.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Images
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPlace;