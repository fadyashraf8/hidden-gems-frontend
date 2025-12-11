import { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/react";
import userImage from "../../assets/userImage.png";
import LoadingScreen from "../LoadingScreen";
import { useTranslation } from "react-i18next";
import SubscriptionPlans from "../../Components/Subscription/SubscriptionPlans";
import UserActivity from "./UserActivity";

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
            <>
              <Card className="w-full shadow-sm p-4 bg-white user-info">
                <CardBody className="space-y-5">
                  {/* First Name */}
                  <div className="group">
                    <p
                      className={`text-gray-500 text-sm font-semibold mb-1 group-hover:text-[#DD0303] transition ${textAlign}`}
                    >
                      {t("firstName-label")}
                    </p>
                    <p
                      className={`bg-gray-100 p-3 rounded-xl border border-gray-200 
                         group-hover:text-[#DD0303] group-hover:bg-blue-50 
                         transition shadow-sm ${textAlign}`}
                    >
                      {user.firstName}
                    </p>
                  </div>

                  {/* Last Name */}
                  <div className="group">
                    <p
                      className={`text-gray-500 text-sm font-semibold mb-1 group-hover:text-[#DD0303] transition ${textAlign}`}
                    >
                      {t("lastName-label")}
                    </p>
                    <p
                      className={`bg-gray-100 p-3 rounded-xl border border-gray-200
                         group-hover:text-[#DD0303] group-hover:bg-blue-50
                         transition shadow-sm ${textAlign}`}
                    >
                      {user.lastName}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="group">
                    <p
                      className={`text-gray-500 text-sm font-semibold mb-1 group-hover:text-[#DD0303] transition ${textAlign}`}
                    >
                      {t("email-label")}
                    </p>
                    <p
                      className={`bg-gray-100 p-3 rounded-xl border border-gray-200
                         group-hover:text-[#DD0303] group-hover:bg-blue-50
                         transition shadow-sm break-all ${textAlign}`}
                    >
                      {user.email}
                    </p>
                  </div>

                  {/* Points Display */}
                  <div className="group">
                    <p
                      className={`text-gray-500 text-sm font-semibold mb-1 group-hover:text-[#DD0303] transition ${textAlign}`}
                    >
                      {t("points-label") || "Points"}
                    </p>
                    <div
                      className={`bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl border-2 border-amber-200
                         group-hover:from-amber-100 group-hover:to-yellow-100 group-hover:border-amber-300
                         transition shadow-sm ${textAlign} flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
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

                  {/* Subscription */}
                  {user?.role !== "admin" && (
                    <div className="group">
                      <p
                        className={`text-gray-500  text-sm font-semibold mb-1 group-hover:text-[#DD0303] transition ${textAlign}`}
                      >
                        {t("subscription-label")}
                      </p>
                      <p
                        className={`bg-gray-100 p-3 rounded-xl border border-gray-200 
                           group-hover:text-[#DD0303] group-hover:bg-blue-50
                           transition shadow-sm ${textAlign}`}
                      >
                        {user.subscription}
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Subscription Plans */}
              {user?.role !== "admin" && (
                <div className="mt-8">
                  <h3
                    className={`text-lg  font-semibold text-[#DD0303] mb-4 ${textAlign}`}
                  >
                    {t("Manage-Subscription")}
                  </h3>
                  <SubscriptionPlans />
                </div>
              )}
            </>
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