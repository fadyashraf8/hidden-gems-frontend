import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Calendar,
  Clock,
  User,
  MessageSquare,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  AlertTriangle,
  X,
  Send,
  Eye,
  Clock as PendingIcon,
  Check,
  RefreshCw,
  Paperclip,
} from "lucide-react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import LoadingScreen from "@/Pages/LoadingScreen";
import toast from "react-hot-toast";

export default function ReportDetails() {
  const { t, i18n } = useTranslation("AdminReports");
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [sendingReply, setSendingReply] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  const baseURL = import.meta.env.VITE_Base_URL;
  const { userInfo } = useSelector((state) => state.user || {});

  useEffect(() => {
    fetchReportDetails();
  }, [id]);

  const fetchReportDetails = () => {
    setLoading(true);
    axios
      .get(`${baseURL}/contactus/admin/${id}`, { withCredentials: true })
      .then((response) => {
        if (response.data.message === "success") {
          setReport(response.data.result);
          setAdminNotes(response.data.result.adminNotes || "");
        }
      })
      .catch((error) => {
        console.error("Error fetching report details:", error);
        toast.error(t("details.toast.failedToLoad"));
        navigate("/admin/reports");
      })
      .finally(() => setLoading(false));
  };



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(i18n.language === "ar" ? "ar-EG" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "reviewed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <PendingIcon size={16} />;
      case "reviewed":
        return <Eye size={16} />;
      case "rejected":
        return <XCircle size={16} />;
      case "resolved":
        return <CheckCircle size={16} />;
      default:
        return null;
    }
  };

  const updateStatus = (newStatus) => {
    setUpdatingStatus(true);
    axios
      .put(
        `${baseURL}/contactus/admin/${id}`,
        { status: newStatus },
        { withCredentials: true }
      )
      .then(() => {
          toast.success(t("details.toast.statusUpdated"));
        setReport({ ...report, status: newStatus });
      })
      .catch((error) => {
          toast.error(t("details.toast.failedToUpdateStatus"));
        console.error("Error updating status:", error);
      })
      .finally(() => setUpdatingStatus(false));
  };

  const updateAdminNotes = () => {
    axios
      .put(
        `${baseURL}/contactus/admin/${id}`,
        { adminNotes: adminNotes },
        { withCredentials: true }
      )
      .then(() => {
          setReport({ ...report, adminNotes: adminNotes });
          setEditingNotes(false);
          toast.success(t("details.toast.notesUpdated"));
      })
      .catch((error) => {
        console.error("Error updating notes:", error);
        toast.error(t("details.toast.failedToUpdateNotes"));
      });
  };

  const updateStatusAndNotes = (newStatus) => {
    setUpdatingStatus(true);
    const updateData = { status: newStatus };
    
    if (adminNotes.trim() !== "") {
      updateData.adminNotes = adminNotes;
    }
    
    axios
      .put(
        `${baseURL}/contactus/admin/${id}`,
        updateData,
        { withCredentials: true }
      )
      .then(() => {
        setReport({ 
          ...report, 
          status: newStatus,
          adminNotes: adminNotes 
        });
        setEditingNotes(false);
        toast.success(t("details.toast.statusAndNotesUpdated"));
      })
      .catch((error) => {
        console.error("Error updating status and notes:", error);
        toast.error(t("details.toast.failedToUpdateStatusAndNotes"));
      })
      .finally(() => setUpdatingStatus(false));
  };

  const submitReply = () => {
    if (!replyMessage.trim()) {
      toast.error(t("details.toast.replyRequired"));
      return;
    }

    setSendingReply(true);

    axios
      .post(
        `${baseURL}/contactus/admin/${id}/reply`,
        {
          message: replyMessage,
          sentEmail: sendEmail,
        },
        { withCredentials: true }
      )
      .then((response) => {
          console.log("ooooooooo",response);

     
          // Add the new reply to the existing replies

          
          const newReply = {
            ...response.data.result,
       
          };
          
          setReport({
            ...report,
            adminReplies: [newReply, ...(report.adminReplies || [])],
            status: "reviewed", // Auto-update status to reviewed when replying
          });
          
          setReplyMessage("");
          setShowReplyModal(false);
          toast.success(
            sendEmail 
              ? t("details.toast.replySentWithEmail") 
              : t("details.toast.replySent")
          );
        
      })
      .catch((error) => {
        console.error("Error sending reply:", error);
        toast.error(t("details.toast.failedToSendReply"));
      })
      .finally(() => setSendingReply(false));
  };

  const deleteReport = () => {
    axios
      .delete(`${baseURL}/contactus/admin/${id}`, { withCredentials: true })
      .then(() => {
        toast.success(t("details.toast.reportDeleted"));
        navigate("/admin/reports");
      })
      .catch((error) => {
        console.error("Error deleting report:", error);
        toast.error(t("details.toast.failedToDelete"));
      });
  };

  // Get user initials for avatar
  const getUserInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Get current user name for replies
  const getCurrentUserName = () => {
    return userInfo?.firstName || t("details.admin");
  };

  if (loading) return <LoadingScreen />;

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {t("details.notFound.title")}
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            {t("details.notFound.description")}
          </p>
          <div className="mt-6">
            <Link
              to="/admin/reports"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft size={18} />
              {t("details.buttons.backToReports")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/admin/reports"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={18} />
            {t("details.buttons.backToReports")}
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t("details.title")}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {t("details.subtitle")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowReplyModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MessageSquare size={18} />
                {t("details.buttons.reply")}
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 size={18} />
                {t("details.buttons.delete")}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Report Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-lg">
                        {getUserInitials(report.firstName, report.lastName)}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {report.firstName} {report.lastName}
                      </h2>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail size={14} />
                          {report.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar size={14} />
                          {formatDate(report.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 inline-flex items-center gap-2 text-sm font-medium rounded-full border ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {getStatusIcon(report.status)}
                      {t(`status.${report.status}`)}
                    </span>
                    <div className="text-xs text-gray-500">
                      ID: {report._id.substring(0, 8)}...
                    </div>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => updateStatus("pending")}
                    disabled={updatingStatus || report.status === "pending"}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      report.status === "pending"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-300"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {t("details.buttons.markPending")}
                  </button>
                  <button
                    onClick={() => updateStatus("reviewed")}
                    disabled={updatingStatus || report.status === "reviewed"}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      report.status === "reviewed"
                        ? "bg-blue-50 text-blue-700 border-blue-300"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {t("details.buttons.markReviewed")}
                  </button>
                  <button
                    onClick={() => updateStatus("resolved")}
                    disabled={updatingStatus || report.status === "resolved"}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      report.status === "resolved"
                        ? "bg-green-50 text-green-700 border-green-300"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {t("details.buttons.markResolved")}
                  </button>
                  <button
                    onClick={() => updateStatus("rejected")}
                    disabled={updatingStatus || report.status === "rejected"}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      report.status === "rejected"
                        ? "bg-red-50 text-red-700 border-red-300"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {t("details.buttons.markRejected")}
                  </button>
                </div>
              </div>

              {/* Message Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    {t("details.messageTitle")}
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {report.message}
                    </p>
                  </div>
                </div>

                {/* Admin Notes */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700">
                      {t("details.adminNotes")}
                    </h3>
                    {editingNotes ? (
                      <div className="flex gap-2">
                        <button
                          onClick={updateAdminNotes}
                          className="text-sm text-green-600 hover:text-green-700 font-medium"
                        >
                          {t("details.buttons.save")}
                        </button>
                        <button
                          onClick={() => {
                            setEditingNotes(false);
                            setAdminNotes(report.adminNotes || "");
                          }}
                          className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                        >
                          {t("details.buttons.cancel")}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingNotes(true)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                      >
                        <Edit size={14} />
                        {t("details.buttons.editNotes")}
                      </button>
                    )}
                  </div>
                  {editingNotes ? (
                    <div className="space-y-3">
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="4"
                        placeholder={t("details.notesPlaceholder")}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={updateAdminNotes}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          {t("details.buttons.saveNotes")}
                        </button>
                        <button
                          onClick={() => updateStatusAndNotes("reviewed")}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          {t("details.buttons.saveAndMarkReviewed")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-50 rounded-lg p-4 min-h-[100px]">
                      {report.adminNotes ? (
                        <p className="text-gray-900 whitespace-pre-wrap">
                          {report.adminNotes}
                        </p>
                      ) : (
                        <p className="text-gray-500 italic">
                          {t("details.noNotes")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Replies Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MessageSquare size={20} />
                    {t("details.replies")} ({report.adminReplies?.length || 0})
                  </h3>
                  <button
                    onClick={() => setShowReplyModal(true)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Send size={14} />
                    {t("details.buttons.newReply")}
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {report.adminReplies && report.adminReplies.length > 0 ? (
                  report.adminReplies
                    .sort((a, b) => new Date(b.repliedAt) - new Date(a.repliedAt))
                    .map((reply) => (
                      <div
                        key={reply._id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-xs">
                                {getUserInitials(
                                  reply.repliedBy?.firstName,
                                  reply.repliedBy?.lastName
                                )}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-900">
                                {reply.repliedBy?.firstName || t("details.admin")}
                              </span>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock size={12} />
                                {formatDate(reply.repliedAt)} at{" "}
                                {formatTime(reply.repliedAt)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {reply.sentEmail && (
                              <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <Mail size={12} />
                                {t("details.emailSent")}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-900 whitespace-pre-wrap mt-2">
                          {reply.message}
                        </p>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-4 text-sm font-medium text-gray-900">
                      {t("details.noReplies.title")}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {t("details.noReplies.description")}
                    </p>
                    <button
                      onClick={() => setShowReplyModal(true)}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Send size={14} />
                      {t("details.buttons.sendFirstReply")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Details & Actions */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("details.summary")}
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <div className="text-sm text-gray-600">
                    {t("details.reportId")}
                  </div>
                  <div className="text-sm font-mono text-gray-900 mt-1">
                    {report._id}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">
                    {t("details.created")}
                  </div>
                  <div className="text-sm text-gray-900 mt-1 flex items-center gap-2">
                    <Calendar size={14} />
                    {formatDate(report.createdAt)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    <Clock size={12} />
                    {formatTime(report.createdAt)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">
                    {t("details.lastUpdated")}
                  </div>
                  <div className="text-sm text-gray-900 mt-1">
                    {formatDate(report.updatedAt)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatTime(report.updatedAt)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">
                    {t("details.repliesCount")}
                  </div>
                  <div className="text-sm text-gray-900 mt-1">
                    {report.adminReplies?.length || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("details.quickActions")}
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <a
                  href={`mailto:${report.email}?subject=Re: Your Contact Report&body=Dear ${report.firstName},`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Mail size={18} />
                  {t("details.buttons.sendEmail")}
                </a>
                <button
                  onClick={() => setShowReplyModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <MessageSquare size={18} />
                  {t("details.buttons.sendReply")}
                </button>
                <button
                  onClick={fetchReportDetails}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <RefreshCw size={18} />
                  {t("details.buttons.refresh")}
                </button>
              </div>
            </div>

            {/* User Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("details.userInfo")}
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <div>
                  <div className="text-sm text-gray-600">
                    {t("details.fullName")}
                  </div>
                  <div className="text-sm text-gray-900 mt-1">
                    {report.firstName} {report.lastName}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">
                    {t("details.email")}
                  </div>
                  <div className="text-sm text-gray-900 mt-1">
                    {report.email}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">
                    {t("details.messageLength")}
                  </div>
                  <div className="text-sm text-gray-900 mt-1">
                    {report.message?.length || 0} {t("details.characters")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <MessageSquare className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t("details.replyModal.title")}
                  </h3>
                </div>
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  {t("details.replyModal.description")}
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("details.replyModal.message")}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="6"
                    placeholder={t("details.replyModal.placeholder")}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {replyMessage.length} {t("details.characters")}
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <input
                    type="checkbox"
                    id="sendEmail"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="sendEmail"
                    className="text-sm text-gray-700 cursor-pointer flex items-center gap-1"
                  >
                    <Mail size={14} />
                    {t("details.replyModal.sendEmail")}
                  </label>
                </div>
                {sendEmail && (
                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-blue-700">
                      {t("details.replyModal.emailWillBeSent", {
                        email: report.email
                      })}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={sendingReply}
                >
                  {t("details.buttons.cancel")}
                </button>
                <button
                  onClick={submitReply}
                  disabled={!replyMessage.trim() || sendingReply}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingReply ? (
                    <>
                      <RefreshCw className="animate-spin" size={18} />
                      {t("details.buttons.sending")}
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      {sendEmail 
                        ? t("details.buttons.sendReplyAndEmail") 
                        : t("details.buttons.sendReply")
                      }
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <AlertTriangle className="text-red-600" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t("details.deleteModal.title")}
                  </h3>
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="mb-6">
                <p className="text-gray-600 mb-2">
                  {t("details.deleteModal.description")}
                </p>
                <div className="bg-gray-50 p-3 rounded-lg mt-3">
                  <p className="text-sm font-medium text-gray-900">
                    {report.firstName} {report.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{report.email}</p>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {report.message}
                  </p>
                </div>
                <p className="text-sm text-red-600 mt-3 font-medium">
                  {t("details.deleteModal.cannotUndo")}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t("details.buttons.cancel")}
                </button>
                <button
                  onClick={deleteReport}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t("details.buttons.delete")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

  
    </>
  );
}