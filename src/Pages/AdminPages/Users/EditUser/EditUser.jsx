import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  Shield,
  Upload,
  X,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import LoadingScreen from "@/Pages/LoadingScreen";

export default function EditUser() {
  const { t } = useTranslation("AdminEditUser");
  const { id } = useParams();
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_Base_URL;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "user",
    verified: false,
    subscription: "free",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/users/${id}`, {
        withCredentials: true,
      });
      if (response.data.message === "Success") {
        
        const user = response.data.result;
        // console.log("user",user.subscription);
        setFormData({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          verified: user.verified,
          subscription: user.subscription,
        });
        if (user.image)
          setImagePreview(`${user.image}`);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error(t("failedToLoadUser"));
    } finally {
      setLoading(false);
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
    if (!formData.firstName.trim())
      newErrors.firstName = t("firstNameRequired");
    if (!formData.lastName.trim()) newErrors.lastName = t("lastNameRequired");
    if (!formData.email.trim()) newErrors.email = t("emailRequired");
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = t("emailInvalid");
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = t("phoneRequired");
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
      if (imageFile) submitData.append("image", imageFile);

      await axios.put(`${baseURL}/users/${id}`, submitData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(t("userUpdated"));
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(
        error.response?.data?.errors?.join("\n") || t("failedToUpdateUser")
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingScreen />;


  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          to="/admin/users"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          {t("backToUsers")}
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{t("editUser")}</h1>
        <p className="text-gray-600 mt-2">{t("updateUserInfo")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Image */}
        <div className="lg:col-span-1">
          <div className="bg-red-50 dark:bg-[#060b15] rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("profilePicture")}
            </h3>
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-64 h-64 rounded-lg object-cover border-4 border-gray-200"
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
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                    <User size={48} className="text-gray-400" />
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
                  <span className="font-medium">{t("uploadPhoto")}</span>
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

        {/* Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <div className="bg-white dark:bg-[#060b15] rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              {t("personalInfo")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("firstName")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t("enterFirstName")}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("lastName")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t("enterLastName")}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white dark:bg-[#060b15] rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Mail size={20} className="text-blue-600" />
              {t("contactInfo")}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("email")} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="user@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("phoneNumber")} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.phoneNumber ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="01234567890"
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white dark:bg-[#060b15] rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield size={20} className="text-blue-600" />
              {t("accountSettings")}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("role")}
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="dark:bg-[#060b15] w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="user">{t("user")}</option>
                  <option value="admin">{t("admin")}</option>
                  <option value="owner">{t("owner")}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("subscription")}
                </label>
                <select
                  name="subscription"
                  value={formData.subscription}
                  onChange={handleInputChange}
                  className="dark:bg-[#060b15] w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="free">{t("free")}</option>
                  <option value="gold">{t("gold")}</option>
                  <option value="platinum">{t("platinum")}</option>
                </select>
              </div>
              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  name="verified"
                  id="verified"
                  checked={formData.verified}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="verified"
                  className="ml-3 text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <CheckCircle size={16} className="text-green-600" />{" "}
                  {t("verifiedAccount")}
                </label>
              </div>
            </div>
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
              to="/admin/users"
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
