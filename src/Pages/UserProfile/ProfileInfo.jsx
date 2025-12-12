import { useState, useRef } from "react";
import { Card, CardBody, Input, Button } from "@heroui/react";
import SubscriptionPlans from "../../Components/Subscription/SubscriptionPlans";
import { useTranslation } from "react-i18next";

export default function ProfileInfo({ user, onUpdateUser }) {
  const { t, i18n } = useTranslation("UserProfile");
  const baseURL = import.meta.env.VITE_Base_URL;
  
  // Ref for file input
  const fileInputRef = useRef(null);

  // States
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // To show selected image

  // Form Data State
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    password: "",
    confirmPassword: "",
    image: null, // Stores the actual file object
  });

  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const textAlign = i18n.language === "ar" ? "text-right" : "text-left";

  // Handle Text Inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      // Create a local URL to preview the image immediately
      setPreviewImage(URL.createObjectURL(file));
    }
  };
    // Handle Edit Click
  const handleEditClick = () => {
    setFormData({
        firstName: user?.firstName || "",   
        lastName: user?.lastName || "",
        password: "",
        confirmPassword: "",
        image: null,
    })
    setPreviewImage(null);
    setIsEditing(true);
  };
  // Handle Save
  const handleSave = async () => {
    // Basic Validation
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert(t("passwords-do-not-match") || "Passwords do not match!");
      return;
    }

    setIsSaving(true);

    try {
      // --- FIX START: Get the ID safely ---
      const userId = user._id || user.id; 
      
      if (!userId) {
        console.error("User ID is missing from the user object");
        alert("Cannot update: User ID not found.");
        setIsSaving(false);
        return;
      }
      // --- FIX END ---

      // 1. Create FormData object
      const dataToSend = new FormData();
      dataToSend.append("firstName", formData.firstName);
      dataToSend.append("lastName", formData.lastName);
      
      if (formData.password) {
        dataToSend.append("password", formData.password);
      }
      
      if (formData.image) {
        dataToSend.append("image", formData.image);
      }

      // 2. Send Request using the safe userId
      const res = await fetch(`${baseURL}/users/${userId}`, {
        method: "PUT", 
        body: dataToSend,
        credentials: "include"
      });

      if (!res.ok) throw new Error("Failed to update");
      
      const updatedUser = await res.json();

      // 3. Update Parent State
      onUpdateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        image: updatedUser.image || previewImage || user.image 
      });

      setIsEditing(false);
      setPreviewImage(null); 
      setFormData(prev => ({...prev, password: "", confirmPassword: "", image: null}));

    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };
  const handleCancel = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      password: "",
      confirmPassword: "",
      image: null
    });
    setPreviewImage(null);
    setIsEditing(false);
  };

  return (
    <>
      <Card className="w-full shadow-sm p-4 bg-white user-info">
        <CardBody className="space-y-5">
          
          <div className={`flex justify-between items-center mb-2 ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">
               {t("personal-details") || "Personal Details"}
            </h3>
            {!isEditing && (
              <Button 
                size="sm" 
                variant="light" 
                color="primary"
                className="font-semibold text-[#DD0303]"
                onPress={handleEditClick}
              >
                {t("edit") || "Edit"}
              </Button>
            )}
          </div>

          {/* --- EDIT MODE --- */}
          {isEditing ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Image Upload Field */}
              <div className={`flex flex-col gap-2 ${textAlign}`}>
                 <label className="text-sm font-semibold text-gray-500">
                    {t("profile-image") || "Profile Image"}
                 </label>
                 
                 <div className="flex items-center gap-4">
                    {/* Hidden Input */}
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    <Button 
                      size="sm" 
                      variant="bordered"
                      onPress={() => fileInputRef.current.click()}
                    >
                      {t("choose-file") || "Choose File"}
                    </Button>
                    
                    <span className="text-xs text-gray-400">
                      {formData.image ? formData.image.name : (t("no-file-chosen") || "No file chosen")}
                    </span>
                 </div>

                 {/* Preview */}
                 {previewImage && (
                   <div className="mt-2">
                     <img src={previewImage} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-gray-300"/>
                   </div>
                 )}
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t("firstName-label")}
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  variant="bordered"
                />
                <Input
                  label={t("lastName-label")}
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  variant="bordered"
                />
              </div>

              {/* Password Fields */}
              <div className="pt-4 border-t border-gray-100">
                 <p className={`text-xs text-gray-400 mb-3 ${textAlign}`}>
                    {t("leave-empty-password") || "Leave empty to keep current password"}
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={t("new-password") || "New Password"}
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    variant="bordered"
                  />
                  <Input
                    label={t("confirm-password") || "Confirm Password"}
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    variant="bordered"
                    errorMessage={
                      formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword 
                      ? "Passwords do not match" : ""
                    }
                    isInvalid={formData.password !== formData.confirmPassword && formData.confirmPassword !== ""}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`flex gap-3 mt-4 ${textAlign === "text-right" ? "justify-start" : "justify-end"}`}>
                <Button className="text-[#DD0303] bg-white" variant="flat" onPress={handleCancel} isDisabled={isSaving}>
                  {t("cancel")}
                </Button>
                <Button className="bg-[#DD0303] text-white" onPress={handleSave} isLoading={isSaving}>
                  {t("save")}
                </Button>
              </div>
            </div>
          ) : (
            /* --- VIEW MODE --- */
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="group">
                <p className={`text-gray-500 text-sm font-semibold mb-1 ${textAlign}`}>
                  {t("firstName-label")}
                </p>
                <p className={`bg-gray-100 p-3 rounded-xl border border-gray-200 ${textAlign}`}>
                  {user.firstName}
                </p>
              </div>

              <div className="group">
                <p className={`text-gray-500 text-sm font-semibold mb-1 ${textAlign}`}>
                  {t("lastName-label")}
                </p>
                <p className={`bg-gray-100 p-3 rounded-xl border border-gray-200 ${textAlign}`}>
                  {user.lastName}
                </p>
              </div>
            </div>
          )}

          {/* Email (Read Only) */}
          <div className="group pt-2 border-t border-gray-100">
             <p className={`text-gray-500 text-sm font-semibold mb-1 mt-2 ${textAlign}`}>
               {t("email-label")}
             </p>
             <p className={`bg-gray-50 text-gray-500 p-3 rounded-xl border border-gray-200 ${textAlign}`}>
               {user.email} <span className="text-xs text-gray-400 ml-2">({t("read-only")})</span>
             </p>
          </div>

          {/* Points (Read Only) */}
           <div className="group">
            <p className={`text-gray-500 text-sm font-semibold mb-1 group-hover:text-[#DD0303] transition ${textAlign}`}>
              {t("points-label") || "Points"}
            </p>
            <div className={`bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl border-2 border-amber-200 group-hover:from-amber-100 group-hover:to-yellow-100 group-hover:border-amber-300 transition shadow-sm ${textAlign} flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-gray-800">
                  {user.points?.toLocaleString() || "0"}
                </span>
              </div>
              <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                {t("points-badge") || "Total Points"}
              </span>
            </div>
          </div>

          {/* Subscription (Read Only) */}
          {user?.role !== "admin" && (
            <div className="group">
              <p className={`text-gray-500 text-sm font-semibold mb-1 ${textAlign}`}>
                {t("subscription-label")}
              </p>
              <p className={`bg-gray-100 p-3 rounded-xl border border-gray-200 ${textAlign}`}>
                {user.subscription}
              </p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Subscription Plans */}
      {user?.role !== "admin" && (
        <div className="mt-8">
          <h3 className={`text-lg font-semibold text-[#DD0303] mb-4 ${textAlign}`}>
            {t("Manage-Subscription")}
          </h3>
          <SubscriptionPlans />
        </div>
      )}
    </>
  );
}