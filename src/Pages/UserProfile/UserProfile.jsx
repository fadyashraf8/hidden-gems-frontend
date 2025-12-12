import { useState, useEffect } from "react";
import userImage from "../../assets/userImage.png";
import LoadingScreen from "../LoadingScreen";
import { useTranslation } from "react-i18next";
import UserActivity from "./UserActivity";
import ProfileInfo from "./ProfileInfo";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation("UserProfile");
  const baseURL = import.meta.env.VITE_Base_URL;

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(baseURL + "/auth/me", {
          credentials: "include",
        });

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();
        setUser(data.user);
        console.log("data.user", data.user);
        
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const handleUserUpdate = (updatedFields) => {
    setUser((prev) => ({
      ...prev,
      ...updatedFields
    }));
  };

  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const textAlign = i18n.language === "ar" ? "text-right" : "text-left";

  const [activeTab, setActiveTab] = useState("info");

  return loading ? (
    <LoadingScreen />
  ) : !user ? (
    <div
      className={`flex justify-center items-center h-screen text-red-500 ${textAlign}`}
    >
      {t("no-user")}
    </div>
  ) : (
    <div className={`max-w-5xl mx-auto mt-16 p-6 profile`} dir={direction}>
      <h2 className={`text-lg font-semibold text-[#DD0303] mb-6 ${textAlign}`}>
        {t("title")}
      </h2>

      <div className={`flex flex-col md:flex-row gap-10 items-start user`}>
        {/* Left: Photo */}
        <div className="flex flex-col items-center gap-4">
          <img
            onError={(e) => (e.target.src = userImage)}
            className="rounded-xl object-cover user-img w-48 h-48"
            src={`${user.image}`}
            alt="User Profile"
          />

          {/* Tabs for Mobile (or Sidebar for Desktop) */}
          <div className="flex md:flex-col gap-2 w-full">
            <button
              onClick={() => setActiveTab("info")}
              className={`px-4 py-2 rounded-lg text-sm cursor-pointer font-semibold transition-all ${
                activeTab === "info"
                  ? "bg-[#DD0303] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t("profile-info")}
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-semibold transition-all ${
                activeTab === "activity"
                  ? "bg-[#DD0303] text-white shadow-md cursor-pointer"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
              }`}
            >
              {t("activity-log")}
            </button>
          </div>
        </div>

        {/* Right: Content Area */}
        <div className="w-full space-y-8">
          {activeTab === "info" ? (
            <ProfileInfo user={user} onUpdateUser={handleUserUpdate} />
        
          ) : (
            <div className="bg-white rounded-2xl  cursor-pointer p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg cursor-pointer font-bold text-gray-800 mb-6 border-b pb-4">
                {t("recent-activity") || "Recent Activity"}
              </h3>
              <UserActivity userId={user._id || user.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}