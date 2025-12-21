import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { deleteUserActivity } from "../../Services/ActivityService";
import {
  Activity,
  Calendar,
  Clock,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import LoadingScreen from "../LoadingScreen";

const UserActivity = () => {
  const { t, i18n } = useTranslation("UserActivity");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const baseURL = import.meta.env.VITE_Base_URL;
  const isDarkMode = useSelector((state) => state.darkMode.enabled);

  const isRTL = i18n.language === "ar";
  const fetchActivities = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/activity`, {
        params: { page },
        withCredentials: true,
      });

      setActivities(response.data.result || []);
      setCurrentPage(response.data.page || 1);
      setTotalPages(response.data.totalPages || 1);
      setTotalItems(response.data.totalItems || 0);
      setError(null);
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError(t("errors.fetchActivityFailed") || "Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities(currentPage);
  }, [currentPage]);

  const openDeleteModal = (activity) => {
    setActivityToDelete(activity);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setActivityToDelete(null);
  };

  const confirmDelete = async () => {
    if (!activityToDelete) return;

    try {
      await deleteUserActivity(activityToDelete._id);
      toast.success(t("activityDeleted"));
      closeDeleteModal();

      await fetchActivities(currentPage);

      if (activities.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      toast.error(t("errors.deleteFailed"));
      closeDeleteModal();
    }
  };

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const goToPreviousPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  if (loading) return <LoadingScreen />;

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  if (activities.length === 0 && currentPage === 1) {
    return (
      <div
        className={`text-center py-10 rounded-xl border border-dashed ${
          isDarkMode
            ? "text-gray-400 bg-gray-800/50 border-gray-700"
            : "text-gray-500 bg-gray-50 border-gray-200"
        }`}
      >
        <Activity
          className={`w-10 h-10 mx-auto mb-3 ${
            isDarkMode ? "text-gray-600" : "text-gray-300"
          }`}
        />
        <p>{t("no-activity")}</p>
      </div>
    );
  }

  return (
    <>
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-lg shadow-xl max-w-md w-full p-6 border ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-600" />
              </div>

              <div>
                <h3
                  className={`text-lg font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t("deleteActivityTitle")}
                </h3>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {t("deleteActivitySubtitle")}
                </p>
              </div>

              <button
                onClick={closeDeleteModal}
                className="ml-auto text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <p
              className={
                isDarkMode ? "text-gray-300 mb-6" : "text-gray-600 mb-6"
              }
            >
              {t("deleteConfirmMessage")}{" "}
              <span
                className={`font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {activityToDelete?.text}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                {t("cancel")}
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6 justify-start">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className={`p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow flex gap-4 items-start group relative ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-100"
              }`}
            >
              <div className="bg-red-50 p-2 rounded-full shrink-0">
                <Activity className="w-5 h-5 text-[#DD0303]" />
              </div>

              <div className="flex-1">
                <h4
                  className={`font-semibold mb-1 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {activity.text}
                </h4>

                <p
                  className={`text-sm mb-2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {activity.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1 w-auto md:w-24">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(
                        activity.createdAt || "2022-01-01"
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(
                        activity.createdAt || Date.now()
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => openDeleteModal(activity)}
                className="absolute top-4 cursor-pointer right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                title={t("deleteActivity")}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div
            className={`flex items-center justify-between p-4 rounded-xl border shadow-sm ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            }`}
          >
            <div
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {t("showing")} {(currentPage - 1) * 10 + 1} {t("to")}{" "}
              {Math.min(currentPage * 10, totalItems)} {t("of")} {totalItems}{" "}
              {t("activities")}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border cursor-pointer border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title={t("previous")}
              >
                {isRTL ? (
                  <ChevronRight className="w-5 h-5" size={18} />
                ) : (
                  <ChevronLeft className="w-5 h-5" size={18} />
                )}
              </button>

              <div className="flex items-center gap-1 ">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => {
                    const showPage =
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 &&
                        pageNum <= currentPage + 1);

                    const showEllipsis =
                      (pageNum === 2 && currentPage > 3) ||
                      (pageNum === totalPages - 1 &&
                        currentPage < totalPages - 2);

                    if (showEllipsis) {
                      return (
                        <span key={pageNum} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }

                    if (!showPage) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`min-w-[40px] h-10 px-3 rounded-lg cursor-pointer  font-medium transition-colors ${
                          currentPage === pageNum
                            ? "bg-[#DD0303] text-white"
                            : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
              </div>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border cursor-pointer border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title={t("next")}
              >
                {isRTL ? (
                  <ChevronLeft className="w-5 h-5" size={18} />
                ) : (
                  <ChevronRight className="w-5 h-5" size={18} />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserActivity;
