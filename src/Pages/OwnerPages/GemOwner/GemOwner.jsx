import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  MapPin,
  Upload,
  X,
  Image,
  AlertTriangle,
  Star,
  User,
  Mail,
  CheckCircle,
  AlertCircle,
  Trash,
  Phone,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import LoadingScreen from "@/Pages/LoadingScreen";

export default function GemOwner() {
  const baseURL = import.meta.env.VITE_Base_URL;
  const { userInfo } = useSelector((state) => state.user || {});
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [hasGem, setHasGem] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    gemLocation: "",
    description: "",
    category: "",
    discount: 0,
    discountGold: 0,
    discountPlatinum: 0,
  });

  const [oldImages, setOldImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  const [gemInfo, setGemInfo] = useState({
    status: "pending",
    avgRating: 0,
    isSubscribed: false,
    createdAt: "",
    updatedAt: "",
    _id: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchOwnerGem();
    fetchCategories();
  }, []);

  const fetchOwnerGem = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/gems/user/${userInfo.id}`, {
        withCredentials: true,
      });
      console.log("response", response);

      if (
        response.data.message === "success" &&
        response.data.result.length > 0
      ) {
        const gem = response.data.result[0];
        setHasGem(true);

        setFormData({
          name: gem.name,
          gemLocation: gem.gemLocation,
          description: gem.description,
          gemPhone: gem?.gemPhone,
          category: gem.category?._id,
          discount: gem.discount,
          discountGold: gem.discountGold,
          discountPlatinum: gem.discountPlatinum,
        });

        setOldImages(gem.images || []);
        setGemInfo({
          status: gem.status,
          avgRating: gem.avgRating,
          isSubscribed: gem.isSubscribed,
          createdAt: gem.createdAt,
          updatedAt: gem.updatedAt,
          _id: gem?._id,
        });
      } else {
        setHasGem(false);
      }
    } catch (error) {
      console.error("Error fetching gem:", error);
      setHasGem(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseURL}/categories`, {
        withCredentials: true,
      });
      if (response.data.message === "success") {
        setCategories(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleNewImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = oldImages.length + newImages.length + files.length;

    if (totalImages > 10) {
      toast.error("Maximum 10 images allowed in total");
      return;
    }

    const validFiles = [];
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        return;
      }
      validFiles.push(file);
    });

    setNewImages((prev) => [...prev, ...validFiles]);

    const previews = validFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previews).then((results) => {
      setNewImagePreviews((prev) => [...prev, ...results]);
    });
  };

  const removeOldImage = (index) => {
    setOldImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.gemLocation.trim()) {
      newErrors.gemLocation = "Location is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (formData.discount < 0 || formData.discount > 100) {
      newErrors.discount = "Discount must be between 0 and 100";
    }

    if (formData.discountGold < 0 || formData.discountGold > 100) {
      newErrors.discountGold = "Gold discount must be between 0 and 100";
    }

    if (formData.discountPlatinum < 0 || formData.discountPlatinum > 100) {
      newErrors.discountPlatinum =
        "Platinum discount must be between 0 and 100";
    }

    const totalImages = oldImages.length + newImages.length;
    if (totalImages === 0) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix all errors");
      return;
    }

    try {
      setSaving(true);

      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("gemLocation", formData.gemLocation);
      submitData.append("description", formData.description);
      submitData.append("gemPhone", formData.gemPhone);
      submitData.append("category", formData.category);
      submitData.append("discount", formData.discount);
      submitData.append("discountGold", formData.discountGold);
      submitData.append("discountPlatinum", formData.discountPlatinum);

      oldImages.forEach((imageName) => {
        submitData.append("oldImages[]", imageName);
      });

      newImages.forEach((imageFile) => {
        submitData.append("images", imageFile);
      });

      await axios.put(`${baseURL}/gems/${gemInfo?._id}`, submitData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Gem updated successfully");

      setNewImages([]);
      setNewImagePreviews([]);
      fetchOwnerGem();
    } catch (error) {
      console.error("Error updating gem:", error);
      toast.error(error.response?.data?.message || "Failed to update gem");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGem = async () => {
    try {
      setDeleting(true);

      await axios.delete(`${baseURL}/gems/${gemInfo?._id}`, {
        withCredentials: true,
      });

      toast.success("Gem deleted successfully");

      if (userInfo.stripeCustomerId) {
        try {
          await axios.post(
            `${baseURL}/payment/cancel-owner-subscription`,
            {},
            {
              withCredentials: true,
            }
          );
          toast.success("Owner subscription cancelled");
        } catch (error) {
          console.error("Error cancelling subscription:", error);
          toast.error("Gem deleted but failed to cancel subscription");
        }
      }

      setShowDeleteModal(false);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error deleting gem:", error);
      toast.error(error.response?.data?.message || "Failed to delete gem");
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      accepted: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };
    return styles[status] || styles.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <LoadingScreen />;

  if (!hasGem) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <AlertCircle size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Gem Found
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't created any hidden gem yet.
          </p>
          <Link
            to={"/owner/gem/add"}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Create Your First Gem
          </Link>
        </div>
      </div>
    );
  }

  const totalImages = oldImages.length + newImages.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete Gem?</h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800 mb-2">
                <strong>Warning:</strong> Deleting your gem will:
              </p>
              <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                <li>Permanently remove all gem data and images</li>
                <li>Cancel your owner subscription</li>
                <li>Downgrade your account to regular user</li>
                <li>Remove all reviews and ratings</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGem}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash size={18} />
                    Delete Forever
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Hidden Gem</h1>
        <p className="text-gray-600">Manage and update your gem information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images & Read-Only Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Gem Status
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                    gemInfo.status
                  )}`}
                >
                  {gemInfo.status.charAt(0).toUpperCase() +
                    gemInfo.status.slice(1)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400 fill-current" size={20} />
                  <span className="font-medium text-gray-900">
                    Average Rating
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {gemInfo.avgRating?.toFixed(1) || "0.0"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className={
                      gemInfo.isSubscribed ? "text-green-500" : "text-gray-400"
                    }
                    size={20}
                  />
                  <span className="font-medium text-gray-900">
                    Subscription
                  </span>
                </div>
                <span
                  className={`text-sm font-medium ${
                    gemInfo.isSubscribed ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {gemInfo.isSubscribed ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* Images Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Image size={20} className="text-blue-600" />
              Images ({totalImages}/10) <span className="text-red-500">*</span>
            </h3>

            {errors.images && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <AlertTriangle size={16} />
                  {errors.images}
                </p>
              </div>
            )}

            {/* Old Images */}
            {oldImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Current Images
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {oldImages.map((image, index) => (
                    <div key={`old-${index}`} className="relative group">
                      <img
                        src={`${image}`}
                        alt={`Gem ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeOldImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            {newImagePreviews.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  New Images
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {newImagePreviews.map((preview, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <img
                        src={preview}
                        alt={`New ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-blue-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {totalImages < 10 && (
              <label className="w-full block">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleNewImagesChange}
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer border-2 border-blue-200">
                  <Upload size={20} />
                  <span className="font-medium">Add More Images</span>
                </div>
              </label>
            )}
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              History
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Created:</span>
                <span>{formatDate(gemInfo.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span>{formatDate(gemInfo.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full py-3 px-4 bg-white border-2 border-red-100 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Trash size={20} />
            Delete Gem
          </button>
        </div>

        {/* Right Column - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Image size={20} className="text-blue-600" />
              Basic Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gem Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter gem name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="gemLocation"
                    value={formData.gemLocation}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.gemLocation ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter location"
                  />
                </div>
                {errors.gemLocation && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.gemLocation}
                  </p>
                )}
              </div>

   <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gem Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="gemPhone"
                    value={formData.gemPhone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.gemPhone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter Gem Phone Number"
                  />
                </div>
                {errors.gemPhone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.gemPhone}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="6"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter detailed description"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat?._id} value={cat?._id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                )}
              </div>
            </div>
          </div>

          {/* Discounts & Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Discount Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Free Tier (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.discount ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.discount && (
                  <p className="text-red-500 text-xs mt-1">{errors.discount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gold Tier (%)
                </label>
                <input
                  type="number"
                  name="discountGold"
                  value={formData.discountGold}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.discountGold ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.discountGold && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.discountGold}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platinum Tier (%)
                </label>
                <input
                  type="number"
                  name="discountPlatinum"
                  value={formData.discountPlatinum}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.discountPlatinum
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.discountPlatinum && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.discountPlatinum}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>

            <Link
              to="/"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
