import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Save,
  MapPin,
  Upload,
  X,
  Image as ImageIcon,
  Star,
  User,
  Mail,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function EditGem() {
  const { t } = useTranslation("AdminEditGem");
  const { id } = useParams();
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_Base_URL;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    gemLocation: "",
    description: "",
    category: "",
    status: "pending",
    discount: 0,
    discountGold: 0,
    discountPlatinum: 0,
    isSubscribed: false,
  });

  const [oldImages, setOldImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  const [gemInfo, setGemInfo] = useState({
    avgRating: 0,
    createdBy: {},
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchGem();
    fetchCategories();
  }, [id]);

  const fetchGem = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/gems/${id}`, {
        withCredentials: true,
      });
      if (response.data.message === "success") {
        const gem = response.data.result;
        setFormData({
          name: gem.name,
          gemLocation: gem.gemLocation,
          description: gem.description,
          category: gem.category?._id,
          status: gem.status,
          discount: gem.discount,
          discountGold: gem.discountGold,
          discountPlatinum: gem.discountPlatinum,
          isSubscribed: gem.isSubscribed,
        });
        setOldImages(gem.images || []);
        setGemInfo({
          avgRating: gem.avgRating,
          createdBy: gem.createdBy,
        });
      }
    } catch (error) {
      console.error("Error fetching gem:", error);
      toast.error(t("toast.failedLoad"));
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNewImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = oldImages.length + newImages.length + files.length;

    if (totalImages > 10) {
      toast.error(t("toast.maxImages"));
      return;
    }

    const validFiles = [];
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("toast.imageTooLarge", { name: file.name }));
        return;
      }
      validFiles.push(file);
    });

    setNewImages((prev) => [...prev, ...validFiles]);

    const previews = validFiles.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(previews).then((results) =>
      setNewImagePreviews((prev) => [...prev, ...results])
    );
  };

  const removeOldImage = (index) =>
    setOldImages((prev) => prev.filter((_, i) => i !== index));
  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t("errors.name");
    if (!formData.gemLocation.trim())
      newErrors.gemLocation = t("errors.location");
    if (!formData.description.trim())
      newErrors.description = t("errors.description");
    if (!formData.category) newErrors.category = t("errors.category");
    if (formData.discount < 0 || formData.discount > 100)
      newErrors.discount = t("errors.discount");
    if (formData.discountGold < 0 || formData.discountGold > 100)
      newErrors.discountGold = t("errors.discountGold");
    if (formData.discountPlatinum < 0 || formData.discountPlatinum > 100)
      newErrors.discountPlatinum = t("errors.discountPlatinum");
    if (oldImages.length + newImages.length === 0)
      newErrors.images = t("errors.images");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error(t("toast.fixErrors"));
      return;
    }

    try {
      setSaving(true);
      const submitData = new FormData();
      Object.keys(formData).forEach((key) =>
        submitData.append(key, formData[key])
      );
      oldImages.forEach((imageName) =>
        submitData.append("oldImages[]", imageName)
      );
      newImages.forEach((imageFile) => submitData.append("images", imageFile));

      await axios.put(`${baseURL}/gems/${id}`, submitData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(t("toast.updated"));
    } catch (error) {
      console.error("Error updating gem:", error);
      toast.error(error.response?.data?.message || t("toast.failedUpdate"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalImages = oldImages.length + newImages.length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <Link
          to="/admin/gems"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          {t("backToGems")}
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{t("editGem")}</h1>
        <p className="text-gray-600 mt-2">{t("updateGemInfo")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ImageIcon size={20} className="text-blue-600" />
                {t("images")} ({totalImages}/10)
              </h3>
            </div>

            {errors.images && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.images}</p>
              </div>
            )}

            {oldImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {t("currentImages")}
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

            {newImagePreviews.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {t("newImages")}
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
                  <span className="font-medium">{t("addMoreImages")}</span>
                </div>
              </label>
            )}
            <p className="text-xs text-gray-500 mt-3 text-center">
              {t("maxImages")}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("gemStats")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <Star size={16} className="text-yellow-500" />
                  {t("averageRating")}
                </span>
                <span className="font-semibold text-gray-900">
                  {gemInfo.avgRating.toFixed(1)} / 5.0
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {t("createdBy")}
                  </span>
                </div>
                <p className="text-sm text-gray-900">
                  {gemInfo.createdBy.firstName} {gemInfo.createdBy.lastName}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <Mail size={12} /> {gemInfo.createdBy.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-blue-600" />
              {t("basicInfo")}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("gemName")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t("enterGemName")}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("location")} <span className="text-red-500">*</span>
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
                    placeholder={t("enterLocation")}
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
                  {t("description")} <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="6"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t("enterDescription")}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("category")} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.category ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">{t("selectCategory")}</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("status")}
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="pending">{t("pending")}</option>
                    <option value="accepted">{t("accepted")}</option>
                    <option value="rejected">{t("rejected")}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("discountSettings")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("freeDiscount")}
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
                  {t("goldDiscount")}
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
                  {t("platinumDiscount")}
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

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isSubscribed"
                checked={formData.isSubscribed}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700">
                {t("isSubscribed")}
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 cursor-pointer border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="px-6 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={16} /> {t("save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
