import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function EditCategory() {
  const { t } = useTranslation("AdminEditCategory");
  const { id } = useParams();
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_Base_URL;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    categoryName: "",
    createdBy: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseURL}/categories/${id}`, {
        withCredentials: true,
      });
      if (res.data.message === "Success") {
        const category = res.data.result;
        setFormData({
          categoryName: category.categoryName,
          createdBy: category.createdBy,
        });
        if (category.categoryImage)
          setImagePreview(`${category.categoryImage}`);
      }
    } catch (err) {
      console.error("Error fetching category:", err);
      toast.error(t("failedToLoadCategory"));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("imageSizeError"));
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.categoryName.trim())
      newErrors.categoryName = t("categoryNameRequired");
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
      submitData.append("categoryName", formData.categoryName);
      if (imageFile) submitData.append("categoryImage", imageFile);

      await axios.put(`${baseURL}/categories/${id}`, submitData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(t("categoryUpdated"));
      navigate("/admin/categories");
    } catch (err) {
      console.error("Error updating category:", err);
      toast.error(
        err.response?.data?.errors?.join("\n") || t("failedToUpdateCategory")
      );
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          to="/admin/categories"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          {t("backToCategories")}
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          {t("editCategory")}
        </h1>
        <p className="text-gray-600 mt-2">{t("updateCategoryInfo")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Image */}
        <div className="lg:col-span-1">
          <div className="bg-red-100 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("categoryImage")}
            </h3>
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Category"
                      className="w-82 h-82 rounded-lg object-cover border-4 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                    <Upload size={48} className="text-gray-400" />
                  </div>
                )}
              </div>

              <label className="w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer border-2 border-blue-200">
                  <Upload size={18} />
                  <span className="font-medium">{t("uploadImage")}</span>
                </div>
              </label>

              <p className="text-xs text-gray-500 mt-3 text-center">
                {t("maxSize")}: 5MB
                <br />
                {t("format")}: JPG, PNG, GIF
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("categoryInfo")}
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("categoryName")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.categoryName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={t("enterCategoryName")}
              />
              {errors.categoryName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.categoryName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("createdBy")}
              </label>
              <input
                type="text"
                name="categoryName"
                value={formData?.createdBy?.email}
                disabled
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 flex cursor-pointer items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {t("saving")}...
                </>
              ) : (
                <>
                  <Save size={20} />
                  {t("saveChanges")}
                </>
              )}
            </button>

            <Link
              to="/admin/categories"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              {t("cancel")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
