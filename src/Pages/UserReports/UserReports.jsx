import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  MessageSquare,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Mail,
  XCircle,
  CheckCheck,
} from "lucide-react";
import LoadingScreen from "../LoadingScreen";

const UserReports = () => {
  const { t, i18n } = useTranslation("UserReports");
  const { isLoggedIn: isloggedin, userInfo: user } = useSelector(
    (state) => state.user
  );
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const baseURL = import.meta.env.VITE_Base_URL;

  const isRTL = i18n.language === "ar";

  const fetchReports = async (page = 1) => {
    if (!user?.email) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}/contactus/user/${user.email}`,
        {
          params: { page },
          withCredentials: true,
        }
      );

      setReports(response.data.result || []);
      setCurrentPage(response.data.page || 1);
      setTotalPages(response.data.totalPages || 1);
      setTotalItems(response.data.totalItems || 0);
      setError(null);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(t("errors.fetchReportsFailed") || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchReports(currentPage);
    }
  }, [currentPage, user?.email]);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const goToPreviousPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  const getStatusColor = (status) => {
    switch (status) {
      case "reviewed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "resolved":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "reviewed":
        return <CheckCircle className="w-4 h-4" />;
      case "resolved":
        return <CheckCheck className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  if (loading) return <LoadingScreen />;

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  if (!user?.email) {
    return (
      <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <MessageSquare className="w-10 h-10 mx-auto mb-3 text-gray-300" />
        <p>{t("no-user-email") || "User email not found"}</p>
      </div>
    );
  }

  if (reports.length === 0 && currentPage === 1) {
    return (
      <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <MessageSquare className="w-10 h-10 mx-auto mb-3 text-gray-300" />
        <p>{t("no-reports") || "No reports found"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report?._id}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex gap-4 items-start">
              <div className="bg-red-50 p-2 rounded-full shrink-0">
                <MessageSquare className="w-5 h-5 text-[#DD0303]" />
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      {t("report-from") || "Report from"} {report.firstName}{" "}
                      {report.lastName}
                    </h4>
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {getStatusIcon(report.status)}
                      <span className="capitalize">{report.status}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-700 text-sm">{report.message}</p>
                </div>

                {report.adminReplies && report.adminReplies.length > 0 && (
                  <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Mail className="w-4 h-4 text-[#DD0303]" />
                      <span>{t("admin-replies") || "Admin Replies"}</span>
                    </div>
                    {report.adminReplies.map((reply) => (
                      <div
                        key={reply?._id}
                        className="bg-blue-50 p-3 rounded-lg space-y-2"
                      >
                        <p className="text-gray-700 text-sm">{reply.message}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(reply.repliedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(reply.repliedAt).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                          {reply.sentEmail && (
                            <span className="flex items-center gap-1 text-green-600">
                              <Mail className="w-3 h-3" />
                              {t("sent-email") || "Email sent"}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(report.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-600">
            {t("showing") || "Showing"} {(currentPage - 1) * 10 + 1}{" "}
            {t("to") || "to"} {Math.min(currentPage * 10, totalItems)}{" "}
            {t("of") || "of"} {totalItems} {t("reports") || "reports"}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border cursor-pointer border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={t("previous") || "Previous"}
            >
              {isRTL ? (
                <ChevronRight className="w-5 h-5" size={18} />
              ) : (
                <ChevronLeft className="w-5 h-5" size={18} />
              )}
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => {
                  const showPage =
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

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
                      className={`min-w-[40px] h-10 px-3 rounded-lg cursor-pointer font-medium transition-colors ${
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
              title={t("next") || "Next"}
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
  );
};

export default UserReports;