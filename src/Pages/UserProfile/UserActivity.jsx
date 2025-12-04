import React, { useEffect, useState } from "react";
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

const UserActivity = () => {
  const { t } = useTranslation("UserProfile");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const baseURL = import.meta.env.VITE_Base_URL;

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
      toast.success("Activity deleted");
      closeDeleteModal();

      // Refetch current page
      await fetchActivities(currentPage);

      // If current page is now empty and not the first page, go to previous page
      if (activities.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      toast.error("Failed to delete activity");
      closeDeleteModal();
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#DD0303]"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  if (activities.length === 0 && currentPage === 1) {
    return (
      <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <Activity className="w-10 h-10 mx-auto mb-3 text-gray-300" />
        <p>{t("no-activity") || "No recent activity found."}</p>
      </div>
    );
  }

  return (
    <>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Delete Activity?
                </h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone
                </p>
              </div>
              <button
                onClick={closeDeleteModal}
                className="ml-auto text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this activity:{" "}
              <span className="font-semibold text-gray-900">
                {activityToDelete?.text}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Activities List */}
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex gap-4 items-start group relative"
            >
              <div className="bg-red-50 p-2 rounded-full shrink-0">
                <Activity className="w-5 h-5 text-[#DD0303]" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">
                  {activity.text}
                </h4>
                <p className="text-gray-600 text-sm mb-2">
                  {activity.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(
                        activity.createdAt || Date.now()
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
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                title="Delete activity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * 10 + 1} to{" "}
              {Math.min(currentPage * 10, totalItems)} of {totalItems}{" "}
              activities
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1">
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
                        className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition-colors ${
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
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserActivity;
