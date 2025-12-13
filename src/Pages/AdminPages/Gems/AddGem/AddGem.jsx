import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  MapPin,
  Upload,
  X,
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  Phone,
} from "lucide-react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function AddGem() {
  const { t, i18n } = useTranslation("AdminAddGem");
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_Base_URL;
  const { userInfo } = useSelector((state) => state.user || {});

  const isAdmin = userInfo?.role === "admin";
  const isOwner = userInfo?.role === "owner";

  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    gemLocation: "",
    description: "",
    gemPhone: "",
    category: "",
    discount: 0,
    discountGold: 0,
    discountPlatinum: 0,
    ...(isAdmin && { isSubscribed: false }),
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});

  const backPath = isAdmin ? "/admin/gems" : "/owner/gems";

  useEffect(() => {
    fetchCategories();
  }, []);

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
      toast.error(t("failedToLoadCategories")); // ✅ استخدام الترجمة
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = images.length + files.length;

    if (totalImages > 10) {
      toast.error(t("maxImagesError"));
      return;
    }

    const validFiles = [];
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("fileTooLarge", { fileName: file.name }));
        return;
      }
      validFiles.push(file);
    });

    setImages((prev) => [...prev, ...validFiles]);

    const previews = validFiles.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(previews).then((results) =>
      setImagePreviews((prev) => [...prev, ...results])
    );
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));

    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = t("nameRequired");
    else if (formData.name.length < 3)
      newErrors.name = t("nameMinChars", { count: 3 });

    if (!formData.gemLocation.trim())
      newErrors.gemLocation = t("locationRequired");

    if (!formData.description.trim())
      newErrors.description = t("descriptionRequired");
    else if (formData.description.length < 10)
      newErrors.description = t("descriptionMinChars", { count: 10 });

    if (!formData.category) newErrors.category = t("categoryRequired");

    if (formData.discount < 0 || formData.discount > 100)
      newErrors.discount = t("discountRange");
    if (formData.discountGold < 0 || formData.discountGold > 100)
      newErrors.discountGold = t("discountRange");
    if (formData.discountPlatinum < 0 || formData.discountPlatinum > 100)
      newErrors.discountPlatinum = t("discountRange");

    if (images.length === 0) newErrors.images = t("atLeastOneImage");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t("fixErrors"));
      return;
    }

    try {
      setSaving(true);
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        submitData.append(key, value)
      );
      images.forEach((image) => submitData.append("images", image));

      await axios.post(`${baseURL}/gems`, submitData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(t("gemCreated"));

      setTimeout(() => {
        navigate(backPath);
      }, 1500);
    } catch (error) {
      console.error("Error creating gem:", error);
      const errorMsg = error.response?.data?.message;
      const msg = errorMsg
        ? i18n.exists(errorMsg)
          ? t(errorMsg)
          : errorMsg
        : t("failedToCreateGem");

      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          to={backPath}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          {t("backToGems")}
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          {t("addHiddenGem")}
        </h1>
        <p className="text-gray-600 mt-2">{t("createNewGem")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-blue-600" />
              {t("imagesCount", { count: images.length })}
              <span className="text-red-500">*</span>
            </h3>

            {errors.images && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <AlertTriangle size={16} />
                  {errors.images}
                </p>
              </div>
            )}

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-blue-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length < 10 && (
              <label className="w-full block">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer border-2 border-blue-200">
                  <Upload size={20} />
                  <span className="font-medium">
                    {images.length === 0
                      ? t("uploadImages")
                      : t("addMoreImages")}
                  </span>
                </div>
              </label>
            )}

            <p className="text-xs text-gray-500 mt-3 text-center">
              {t("imageRequirements")}
            </p>
          </div>
        </div>

        {/* Right Column - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-blue-600" />
              {t("basicInformation")}
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
                  {t("gemPhone")} <span className="text-red-500">*</span>
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
                    placeholder={t("enterGemPhone")}
                  />
                </div>
                {errors.gemPhone && (
                  <p className="text-red-500 text-xs mt-1">{errors.gemPhone}</p>
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
                  <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                )}
              </div>
            </div>
          </div>

          {/* Discounts & Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("discountSettings")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("freeTierDiscount")}
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
                  placeholder="0"
                />
                {errors.discount && (
                  <p className="text-red-500 text-xs mt-1">{errors.discount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("goldTierDiscount")}
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
                  placeholder="0"
                />
                {errors.discountGold && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.discountGold}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("platinumTierDiscount")}
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
                  placeholder="0"
                />
                {errors.discountPlatinum && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.discountPlatinum}
                  </p>
                )}
              </div>
            </div>

            {isAdmin && (
              <div className="pt-4 border-t">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isSubscribed"
                    checked={formData.isSubscribed}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    {t("subscriptionActive")}
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 flex items-center cursor-pointer justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {t("creating")}
                </>
              ) : (
                <>
                  <Save size={20} />
                  {t("createGem")}
                </>
              )}
            </button>

            <Link
              to={backPath}
              className="px-6 py-3 border cursor-pointer border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              {t("cancel")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
