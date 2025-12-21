import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import { getGemByIdAPI } from "../../Services/GemsAuth";
import LoadingScreen from "../LoadingScreen";
import { useTranslation } from "react-i18next";
import RatingStars from "../../Components/RatingStars/RatingStars";
import { MapPin, Phone, Globe, ChevronDown, Edit2, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import "./GemDetails.css";
import ImageCarouselModal from "../../Components/ImageCarouselModal/ImageCarouselModal.jsx";
import SubscriptionPlans from "../../Components/Subscription/SubscriptionPlans";
import QRCodeModal from "../../Components/QRCodeModal/QRCodeModal.jsx";
import toast from "react-hot-toast";
import SurpriseButton from "../../Components/SurpriseButton/SurpriseButton";
// 1. Ensure these are imported
import { Avatar, FormControlLabel, Switch } from "@mui/material";
import { set } from "zod";
import { user } from "@heroui/react";

const BASE_URL = import.meta.env.VITE_Base_URL;
const COLLAPSED_ABOUT_HEIGHT = 150;

const normalizeId = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object" && value._id) {
    return String(value._id);
  }
  return null;
};

const getReviewUserId = (item) => {
  if (!item) return null;
  if (item.userId) return normalizeId(item.userId);
  if (item.createdBy) return normalizeId(item.createdBy);
  return null;
};

const ToggleButton = ({ expanded, onClick, collapsedLabel, expandedLabel }) => (
  <button
    type="button"
    className="toggle-button inline-flex items-center gap-2 text-sm font-semibold text-[#DD0303] border border-[#DD0303]/30 rounded-full px-4 py-1.5 transition hover:bg-[#DD0303]/10 focus:outline-none focus:ring-2 focus:ring-[#DD0303]/40"
    onClick={onClick}
  >
    <span>{expanded ? expandedLabel : collapsedLabel}</span>
    <ChevronDown
      className={`h-4 w-4 transition-transform ${
        expanded ? "rotate-180" : "rotate-0"
      }`}
    />
  </button>
);

const GemDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation("common");
  const { isLoggedIn, userInfo } = useSelector((state) => state.user || {});
  const userId = userInfo?._id || userInfo?.id;

  const [gem, setGem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pointsAmount, setPointsAmount] = useState(0);
  const [showPointsInput, setShowPointsInput] = useState(false);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselInitialIndex, setCarouselInitialIndex] = useState(0);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [aboutToggleVisible, setAboutToggleVisible] = useState(false);
  const [galleryExpanded, setGalleryExpanded] = useState(false);
  const [reviewsExpanded, setReviewsExpanded] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [gemRatings, setGemRatings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voucherQR, setVoucherQR] = useState(null);
  const [voucherType, setVoucherType] = useState(null);
  const [voucherData, setVoucherData] = useState(null);
  const [isCreatingVoucher, setIsCreatingVoucher] = useState(false);

  // --- 2. New State for Anonymity ---
  const [isAnonymous, setIsAnonymous] = useState(false);

  const recordVisit = useCallback(async () => {
    try {
      await axios.post(
        `${BASE_URL}/gems/${id}/visit`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      // console.log(error);
    }
  }, [id]);

  useEffect(() => {
    recordVisit();
  }, [recordVisit]);

  const createVoucher = async () => {
    setIsCreatingVoucher(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/vouchers/create/${id}`,
        {},
        { withCredentials: true }
      );

      setVoucherQR(response?.data?.createdVoucher?.qrCode);
      setVoucherType("standard");
      setVoucherData(response?.data?.createdVoucher);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error creating voucher:", err.response?.data?.error);
      toast.error(err.response?.data?.error || "Failed to create voucher.");
    } finally {
      setIsCreatingVoucher(false);
    }
  };

  // Update the createVoucherByPoints function
  const createVoucherByPoints = async () => {
    if (!pointsAmount || pointsAmount < 1) {
      toast.error("Please enter a valid points amount.");
      return;
    }

    setIsCreatingVoucher(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/vouchers/createByPoints/${id}`,
        { points: pointsAmount },
        { withCredentials: true }
      );

      setVoucherQR(response?.data?.createdVoucher?.qrCode);
      setVoucherType("points");
      setVoucherData(response?.data?.createdVoucher);
      setIsModalOpen(true);
      setShowPointsInput(false);
      toast.success(`Voucher created! ${pointsAmount} points deducted.`);
    } catch (err) {
      console.error("Error creating voucher by points:", err);
      toast.error(
        err.response?.data?.error ||
          "Failed to create voucher. Check your points balance."
      );
    } finally {
      setIsCreatingVoucher(false);
    }
  };
  const fetchGemRatings = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/ratings/gem/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.ratings) {
        setGemRatings(data.ratings);
      }
    } catch (error) {
      console.error("Failed to fetch gem ratings", error);
    }
  }, [id]);

  useEffect(() => {
    fetchGemRatings();
    console.log("userInfo",userInfo);

  }, [fetchGemRatings,userInfo]);

  // --- Review State ---
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // IDs for the currently logged in user's interactions
  const [userRatingId, setUserRatingId] = useState(null);
  const [userReviewId, setUserReviewId] = useState(null);

  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewDeleting, setReviewDeleting] = useState(false);

  const aboutRef = useRef(null);
  const composerRef = useRef(null);
  const [aboutMaxHeight, setAboutMaxHeight] = useState(0);

  const copy = useMemo(
    () => ({
      seeMore: t("see_more", { defaultValue: "See more" }),
      seeLess: t("see_less", { defaultValue: "See less" }),
      aboutTitle: t("gem_about_title", { defaultValue: "About" }),
      aboutCaption: t("gem_about_caption", { defaultValue: "What to expect" }),
      aboutPlaceholder: t("gem_about_placeholder", {
        defaultValue: "Details for this gem are coming soon.",
      }),
      galleryTitle: t("gem_gallery_title", { defaultValue: "Gallery" }),
      galleryCount: (count) =>
        t("gem_gallery_count", { count, defaultValue: `${count} photos` }),
      galleryAlt: (index) =>
        t("gem_gallery_alt", {
          index,
          defaultValue: `Gallery image ${index}`,
        }),
      galleryEmpty: t("gem_gallery_empty", {
        defaultValue: "Gallery will be updated soon.",
      }),
      reviewsTitle: t("gem_reviews_title", {
        defaultValue: "Reviews & ratings",
      }),
      reviewsCaption: t("gem_reviews_caption", {
        defaultValue: "Latest impressions from the community",
      }),
      ratingsTotal: (count) =>
        t("gem_ratings_total", { count, defaultValue: `${count} ratings` }),
      ratingsEmpty: t("gem_ratings_empty", {
        defaultValue: "No ratings yet. Be the first to share your experience.",
      }),
      reviewsAnonymous: t("gem_reviews_anonymous", {
        defaultValue: "Explorer",
      }),
      reviewsRecent: t("gem_reviews_recent", { defaultValue: "Recently" }),
      reviewsDefaultTitle: t("gem_reviews_default_title", {
        defaultValue: "Visitor feedback",
      }),
    }),
    [t]
  );

  const normalizedUserId = useMemo(
    () => (userId ? String(userId) : null),
    [userId]
  );

  const fetchGemDetails = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getGemByIdAPI(id);
      if (data.error) {
        setError(data.error);
        setGem(null);
      } else {
        const gemData = data.gem || data.result || data;
        setGem(gemData);
        // console.log(gemData);
      }
    } catch {
      setError("Failed to load this gem. Please try again.");
      setGem(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGemDetails();
    
  }, [fetchGemDetails]);

  const fetchReviews = useCallback(async () => {
    setReviewsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/review/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      let fetched = [];
      if (Array.isArray(data)) {
        fetched = data;
      } else if (Array.isArray(data?.result)) {
        fetched = data.result;
      }
      setReviews(fetched);
    } catch {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const fetchUserRating = useCallback(
    async ({ preserveComposerValue = false } = {}) => {
      if (!isLoggedIn || !userId) {
        setUserRatingId(null);
        if (!preserveComposerValue) setReviewRating(0);
        return null;
      }
      try {
        const { data } = await axios.get(
          `${BASE_URL}/ratings/user/${userId}/gem/${id}`,
          { withCredentials: true }
        );
        if (data?.rating) {
          setUserRatingId(data.rating._id);
          if (!preserveComposerValue) {
            setReviewRating(Number(data.rating.rating) || 0);
          }
          return data.rating._id;
        } else {
          setUserRatingId(null);
          if (!preserveComposerValue) setReviewRating(0);
        }
      } catch {
        setUserRatingId(null);
      }
      return null;
    },
    [id, isLoggedIn, userId]
  );

  useEffect(() => {
    fetchUserRating();
  }, [fetchUserRating]);

  const resolveImageSrc = useCallback((path) => {
    if (!path) return "/images/Gem.png";
    if (/^https?:\/\//i.test(path)) return path;
    if (path.startsWith("/images")) return path;

    const normalizedBase = (BASE_URL || "").replace(/\/$/, "");

    if (path.startsWith("/uploads")) {
      return normalizedBase ? `${normalizedBase}${path}` : path;
    }

    if (path.startsWith("/")) {
      return normalizedBase ? `${normalizedBase}${path}` : path;
    }

    if (!normalizedBase) {
      return `/uploads/gem/${path}`;
    }

    return `${normalizedBase}/uploads/gem/${path}`;
  }, []);

  const userReview = useMemo(() => {
    if (!normalizedUserId) return null;
    return reviews.find(
      (review) => getReviewUserId(review) === normalizedUserId
    );
  }, [normalizedUserId, reviews]);

  useEffect(() => {
    if (userReview) {
      setUserReviewId(userReview._id || userReview.id || null);
    } else if (!isEditingReview) {
      setUserReviewId(null);
      setReviewText("");
    }
  }, [userReview, isEditingReview]);

  const aboutText = useMemo(() => {
    if (gem?.description?.trim()) return gem.description.trim();
    return copy.aboutPlaceholder;
  }, [gem?.description, copy]);

  const galleryImages = useMemo(() => {
    if (Array.isArray(gem?.images) && gem.images.length > 0) return gem.images;
    if (gem?.image) return [gem.image];
    return [];
  }, [gem?.images, gem?.image]);

  const visibleGallery = galleryExpanded
    ? galleryImages
    : galleryImages.slice(0, 6);

  const combinedFeedback = useMemo(() => {
    const feedbackMap = new Map();

    reviews.forEach((review) => {
      const uid = getReviewUserId(review);
      if (uid) {
        if (!feedbackMap.has(uid)) {
          feedbackMap.set(uid, { userId: uid });
        }
        feedbackMap.get(uid).review = review;
      }
    });

    gemRatings.forEach((rating) => {
      const uid = getReviewUserId(rating);
      if (uid) {
        if (!feedbackMap.has(uid)) {
          feedbackMap.set(uid, { userId: uid });
        }
        feedbackMap.get(uid).rating = rating;
      }
    });

    return Array.from(feedbackMap.values());
  }, [gemRatings, reviews]);

  const totalRatingsCount = gemRatings?.length || 0;

  const visibleFeedback = reviewsExpanded
    ? combinedFeedback
    : combinedFeedback.slice(0, 3);

  const averageRatingValue = useMemo(() => {
    if (typeof gem?.avgRating === "number") return Number(gem.avgRating);
    if (typeof gem?.rating === "number") return Number(gem.rating);
    const derived = reviews
      .map((review) =>
        Number(
          review.rating ?? review.stars ?? review.value ?? review.score ?? 0
        )
      )
      .filter((value) => !Number.isNaN(value) && value > 0);
    if (derived.length) {
      return derived.reduce((acc, value) => acc + value, 0) / derived.length;
    }
    return 0;
  }, [gem?.avgRating, reviews, gemRatings]);

  const averageRatingLabel = averageRatingValue.toFixed(1);

  useLayoutEffect(() => {
    if (!aboutRef.current) {
      setAboutToggleVisible(false);
      return;
    }

    const el = aboutRef.current;
    setAboutMaxHeight(el.scrollHeight);

    if (aboutExpanded) {
      setAboutToggleVisible(true);
      return;
    }

    const needsToggle = el.scrollHeight - el.clientHeight > 2;
    setAboutToggleVisible(needsToggle);
  }, [aboutExpanded, aboutText]);

  const heroImage = useMemo(() => {
    if (gem?.images?.length) {
      return resolveImageSrc(gem.images[0]);
    }
    if (gem?.image) {
      return resolveImageSrc(gem.image);
    }
    return "/images/Gem.png";
  }, [gem?.images, gem?.image, resolveImageSrc]);

  const formatReviewAuthor = (feedback) => {
    let userObj = null;

    if (
      feedback.review &&
      feedback.review.userId &&
      typeof feedback.review.userId === "object"
    ) {
      userObj = feedback.review.userId;
    } else if (
      feedback.rating &&
      feedback.rating.createdBy &&
      typeof feedback.rating.createdBy === "object"
    ) {
      userObj = feedback.rating.createdBy;
    }

    // --- 3. Check for Anonymous Flag in Display ---
    // Assuming backend returns an 'isAnonymous' flag on the review/rating object
    const isReviewAnonymous =
      feedback.review?.isAnonymous || feedback.rating?.isAnonymous;
    if (isReviewAnonymous) return copy.reviewsAnonymous;

    if (userObj) {
      const first = userObj.firstName || "";
      const last = userObj.lastName || "";
      const combined = `${first} ${last}`.trim();
      if (combined) return combined;
      if (userObj.name) return userObj.name;
    }

    if (feedback.review?.author) return feedback.review.author;
    return copy.reviewsAnonymous;
  };

  const formatReviewDate = (feedbackItem) => {
    const item = feedbackItem.review || feedbackItem.rating;
    if (!item) return copy.reviewsRecent;

    if (item.date) return item.date;

    if (item.createdAt) {
      const date = new Date(item.createdAt);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60)
        return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
      if (diffHours < 24)
        return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    return copy.reviewsRecent;
  };

  const formatReviewTitle = (feedbackItem) => {
    const review = feedbackItem.review;
    if (!review) return copy.reviewsDefaultTitle;
    return review.title || review.headline || copy.reviewsDefaultTitle;
  };

  const formatReviewContent = (feedbackItem) => {
    const review = feedbackItem.review;
    if (!review) return "";
    return review.content || review.description || review.comment || "";
  };

  const handleEditReviewClick = (feedback) => {
    if (feedback.userId !== normalizedUserId) return;

    setIsEditingReview(true);

    if (feedback.review) {
      setUserReviewId(feedback.review._id);
      setReviewText(formatReviewContent(feedback));
      // If editing, check if previous review was anonymous
      // if(feedback.review.isAnonymous) setIsAnonymous(true);
    } else {
      setUserReviewId(null);
      setReviewText("");
    }

    if (feedback.rating) {
      const stars =
        typeof feedback.rating === "object"
          ? feedback.rating.rating
          : feedback.rating;
      setReviewRating(Number(stars) || 0);
      if (feedback.rating._id) {
        setUserRatingId(feedback.rating._id);
      }
    } else {
      setUserRatingId(null);
      setReviewRating(0);
    }

    setReviewError("");
    setReviewMessage("");
    composerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const handleCancelEdit = () => {
    setIsEditingReview(false);
    setReviewText("");
    setReviewMessage("");
    setReviewError("");
    setIsAnonymous(false); // Reset toggle
    setReviewRating(0);
    fetchUserRating();
  };

  const handleDelete = async (feedback) => {
    if (!feedback.review && !feedback.rating) return;
    setReviewError("");
    setReviewMessage("");
    setReviewDeleting(true);
    let deletedItems = [];

    try {
      if (feedback.review && feedback.review._id) {
        await axios.delete(`${BASE_URL}/review/${feedback.review._id}`, {
          withCredentials: true,
        });
        deletedItems.push("review");
      }
      if (feedback.rating && feedback.rating._id) {
        await axios.delete(`${BASE_URL}/ratings/${feedback.rating._id}`, {
          withCredentials: true,
        });
        deletedItems.push("rating");
      }
      setUserReviewId(null);
      setUserRatingId(null);
      setReviewRating(0);
      setReviewText("");
      setIsEditingReview(false);
      setIsAnonymous(false);

      if (deletedItems.includes("review") && deletedItems.includes("rating")) {
        setReviewMessage("Your feedback has been completely removed.");
      } else if (deletedItems.includes("review")) {
        setReviewMessage("Your review text was deleted.");
      } else if (deletedItems.includes("rating")) {
        setReviewMessage("Your rating was removed.");
      }

      fetchGemRatings();
      fetchReviews();
      fetchGemDetails();
    } catch (error) {
      setReviewError(
        error?.response?.data?.message || "Failed to delete your review."
      );
    } finally {
      setReviewDeleting(false);
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    setReviewError("");
    setReviewMessage("");

    // 1. Validation Checks
    if (!isLoggedIn || !userId) {
      setReviewError("Please sign in to share a review.");
      return;
    }

    if (!isEditingReview && (userReviewId || userRatingId)) {
      toast.error(
        "You have already reviewed this place. Please edit your previous review."
      );
      return;
    }

    const hasReviewText = reviewText.trim().length >= 5;
    const hasRating = reviewRating > 0;

    if (!hasReviewText && !hasRating) {
      setReviewError("Please add a review or select a rating to submit.");
      return;
    }

    if (reviewText.trim().length > 0 && !hasReviewText) {
      setReviewError(
        "Your review needs at least 5 characters (or leave it empty to just rate)."
      );
      return;
    }

    setSubmittingReview(true);
    const editingExisting = isEditingReview && userReviewId;
    let updatedReview = null;

    // 2. Handle Review Text Submission
    if (hasReviewText) {
      try {
        let response;
        if (editingExisting) {
          response = await axios.patch(
            `${BASE_URL}/review/${userReviewId}`,
            // Added isAnonymous flag
            { description: reviewText.trim(), isAnonymous: isAnonymous },
            { withCredentials: true }
          );
        } else {
          response = await axios.post(
            `${BASE_URL}/review`,
            {
              description: reviewText.trim(),
              gemId: id,
              userId,
              // Added isAnonymous flag
              isAnonymous: isAnonymous,
            },
            { withCredentials: true }
          );
        }

        const savedReview =
          response.data.result || response.data.review || response.data;

        if (savedReview) {
          updatedReview = savedReview;
          setReviews((prevReviews) => {
            if (editingExisting) {
              return prevReviews.map((r) =>
                r._id === savedReview._id || r.id === savedReview.id
                  ? savedReview
                  : r
              );
            } else {
              return [savedReview, ...prevReviews];
            }
          });
        }
      } catch (error) {
        setReviewError(
          error?.response?.data?.message ||
            "We couldn't save your review. Please try again."
        );
        setSubmittingReview(false);
        return;
      }
    } else if (
      editingExisting &&
      reviewText.trim().length === 0 &&
      !hasRating
    ) {
      setReviewError(
        "You must have either review text or a rating. Use 'Delete' to remove everything."
      );
      setSubmittingReview(false);
      return;
    }

    // 3. Handle Star Rating Submission
    if (hasRating) {
      try {
        let effectiveRatingId = userRatingId;
        if (!effectiveRatingId) {
          effectiveRatingId = await fetchUserRating({
            preserveComposerValue: true,
          });
        }

        if (effectiveRatingId) {
          // Update existing rating
          await axios.put(
            `${BASE_URL}/ratings/${effectiveRatingId}`,
            // Added isAnonymous flag
            { rating: reviewRating, isAnonymous: isAnonymous },
            { withCredentials: true }
          );
          setUserRatingId(effectiveRatingId);
        } else {
          // Create new rating
          const { data } = await axios.post(
            `${BASE_URL}/ratings`,
            // Added isAnonymous flag
            { gem: id, rating: reviewRating, isAnonymous: isAnonymous },
            { withCredentials: true }
          );
          if (data?.rating?._id) {
            setUserRatingId(data.rating._id);
          }
        }
      } catch (error) {
        setReviewError(
          error?.response?.data?.message ||
            "We couldn't save your rating. Try again."
        );
        setSubmittingReview(false);
        return;
      }
    }

    // 4. Success Messages
    if (!hasRating) {
      setReviewText("");
    } else if (hasReviewText) {
      setReviewText("");
    }

    if (editingExisting) {
      setReviewMessage("Your feedback was updated.");
    } else if (hasReviewText && hasRating) {
      setReviewMessage("Thanks for your review and rating!");
    } else if (hasReviewText) {
      setReviewMessage("Thanks for sharing your thoughts!");
    } else {
      setReviewMessage("Thanks for your rating!");
    }

    // 5. Cleanup and Reset Logic
    setIsEditingReview(false);
    setSubmittingReview(false);

    // --- Key Reset Steps ---
    setIsAnonymous(false); // Turn off the toggle
    setReviewText(""); // clear text
    setReviewRating(0); // clear stars

    // Fetch IDs but DO NOT overwrite the 0 stars we just set
    await fetchUserRating({ preserveComposerValue: true });

    fetchGemRatings();
    setTimeout(() => {
      fetchGemDetails();
    }, 500);
  };

  const handleRatingChange = (value) => {
    if (!isLoggedIn || !userId) {
      setReviewError("Please sign in to rate this gem.");
      return;
    }
    setReviewRating(value);
    setReviewError("");
    setReviewMessage("");
  };

  const canSubmitReview =
    (reviewText.trim().length >= 5 || reviewRating > 0) && !submittingReview;

  if (loading) return <LoadingScreen />;
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!gem) return <div className="text-center mt-10">Gem not found</div>;

  return (
    <>
      <SurpriseButton
        style={{
          position: "fixed",
          top: "120px",
          right: "2rem",
          left: "auto",
          zIndex: 999,
        }}
      />
      <div className="min-h-screen bg-white dark:bg-zinc-900 pb-12 gem-details">
        {/* Hero Image Section - Full Width */}
        <div className="relative h-[50vh] md:h-[60vh] w-full">
          <img
            src={heroImage}
            alt={gem.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {gem.name}
              </h1>
              <div className="flex items-center gap-4 text-lg">
                <div className="flex items-center gap-1">
                  <RatingStars
                    rating={averageRatingValue}
                    readOnly
                    showLabel={false}
                  />
                  <span className="font-medium">
                    ({totalRatingsCount} reviews)
                  </span>
                </div>
                {gem.category && (
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium">
                    {gem.category.categoryName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - Centered Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-zinc-700 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold dark:text-white">
                    {copy.aboutTitle}
                  </h2>
                  <span className="text-sm text-gray-400 dark:text-gray-500">
                    {copy.aboutCaption}
                  </span>
                </div>
                <p
                  ref={aboutRef}
                  className={`about-text text-gray-600 dark:text-gray-300 leading-relaxed text-lg ${
                    aboutExpanded ? "expanded" : "collapsed"
                  }`}
                  style={{
                    maxHeight: aboutExpanded
                      ? Math.max(aboutMaxHeight, COLLAPSED_ABOUT_HEIGHT)
                      : COLLAPSED_ABOUT_HEIGHT,
                  }}
                >
                  {aboutText}
                </p>
                {aboutToggleVisible && (
                  <div className="flex justify-end">
                    <ToggleButton
                      expanded={aboutExpanded}
                      onClick={() => setAboutExpanded((prev) => !prev)}
                      collapsedLabel={copy.seeMore}
                      expandedLabel={copy.seeLess}
                    />
                  </div>
                )}
              </div>

              {/* Gallery */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">
                  {copy.galleryTitle}
                </h2>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>{copy.galleryCount(galleryImages.length)}</span>
                </div>
                {galleryImages.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {copy.galleryEmpty}
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.slice(0, 6).map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => {
                          setCarouselInitialIndex(index);
                          setCarouselOpen(true);
                        }}
                        className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 hover:ring-2 hover:ring-[#DD0303] transition cursor-pointer"
                      >
                        <img
                          src={resolveImageSrc(image)}
                          alt={copy.galleryAlt(index + 1)}
                          className="w-full h-full object-cover hover:scale-105 transition"
                          onError={(e) => (e.target.src = "/images/Gem.png")}
                        />
                      </button>
                    ))}
                    {galleryImages.length > 6 && (
                      <button
                        type="button"
                        onClick={() => {
                          setCarouselInitialIndex(0);
                          setCarouselOpen(true);
                        }}
                        className="aspect-square rounded-xl overflow-hidden bg-gray-900/80 dark:bg-zinc-700/80 flex items-center justify-center hover:bg-gray-900 transition cursor-pointer"
                      >
                        <span className="text-white text-2xl font-bold">
                          +{galleryImages.length - 6}
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>
              {/* Reviews */}
              <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-zinc-700 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold dark:text-white">
                      {copy.reviewsTitle}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {copy.reviewsCaption}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-900 px-4 py-2 rounded-full">
                    <span className="text-2xl font-bold text-[#DD0303]">
                      {averageRatingLabel}
                    </span>
                    <RatingStars
                      rating={averageRatingValue}
                      readOnly
                      showLabel={false}
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {copy.ratingsTotal(totalRatingsCount)}
                    </span>
                  </div>
                </div>

                <div
                  ref={composerRef}
                  className="rounded-2xl border border-dashed border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/40 p-5"
                >
                  {isLoggedIn ? (
                    <form className="space-y-4" onSubmit={handleReviewSubmit}>
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-100 mb-2">
                            {isEditingReview
                              ? "Edit your review"
                              : "Add your review"}
                          </p>

                          {/* --- 6. New User Identity Section with Toggle --- */}
                          <div className="flex items-center gap-3 mb-2 bg-white dark:bg-zinc-800 p-2 rounded-xl border border-gray-100 dark:border-zinc-700 w-fit">
                            <Avatar
                              src={
                                isAnonymous
                                  ? "/images/anonymous-placeholder.png"
                                  : resolveImageSrc(userInfo?.profilePic)
                              }
                              alt={
                                isAnonymous ? "Anonymous" : userInfo?.firstName
                              }
                              sx={{ width: 32, height: 32 }}
                            />
                            <div className="flex flex-col">
                              <span
                                className={`text-sm font-bold ${
                                  isAnonymous
                                    ? "text-gray-500"
                                    : "text-gray-900 dark:text-white"
                                }`}
                              >
                                {isAnonymous
                                  ? "Anonymous Explorer"
                                  : `${userInfo?.firstName} ${userInfo?.lastName}`}
                              </span>
                            </div>
                            <div className="h-4 w-[1px] bg-gray-300 mx-1"></div>
                            <FormControlLabel
                              control={
                                <Switch
                                  size="small"
                                  checked={isAnonymous}
                                  onChange={(e) =>
                                    setIsAnonymous(e.target.checked)
                                  }
                                  sx={{
                                    "& .MuiSwitch-switchBase.Mui-checked": {
                                      color: "#DD0303",
                                    },
                                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                      {
                                        backgroundColor: "#DD0303",
                                      },
                                  }}
                                />
                              }
                              label={
                                <span className="text-xs text-gray-500">
                                  Post Anonymously
                                </span>
                              }
                              className="m-0"
                            />
                          </div>
                          {/* ----------------------------------------------- */}

                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {isEditingReview
                              ? "Update your previous feedback below."
                              : "Choose a rating then share a quick highlight."}
                          </p>
                        </div>
                        <RatingStars
                          value={reviewRating ? reviewRating : 0}
                          onChange={handleRatingChange}
                          showLabel={false}
                        />
                      </div>
                      {isEditingReview && (
                        <div className="flex items-center gap-4 text-xs font-semibold">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                          >
                            Cancel edit
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete({
                                review: { _id: userReviewId },
                                rating: { _id: userRatingId },
                              })
                            }
                            disabled={reviewDeleting}
                            className="text-red-500 hover:text-red-600 disabled:opacity-60"
                          >
                            {reviewDeleting ? "Deleting..." : "Delete review"}
                          </button>
                        </div>
                      )}

                      <textarea
                        className="w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-3 text-sm text-gray-700 dark:text-gray-100 focus:border-[#DD0303] focus:ring-1 focus:ring-[#DD0303] transition"
                        rows={4}
                        maxLength={600}
                        placeholder="Tell others what stood out for you..."
                        value={reviewText}
                        onChange={(event) => {
                          setReviewText(event.target.value);
                          setReviewError("");
                          setReviewMessage("");
                        }}
                      />

                      {reviewError && (
                        <p className="text-sm text-red-500">{reviewError}</p>
                      )}
                      {reviewMessage && (
                        <p className="text-sm text-green-600">
                          {reviewMessage}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={!canSubmitReview}
                        className={`w-full md:w-auto px-6 py-2 rounded-full font-semibold text-sm transition ${
                          canSubmitReview
                            ? "bg-[#DD0303] text-white hover:bg-[#b90202] shadow-lg shadow-[#dd0303]/30"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {submittingReview ? "Sharing..." : "Share review"}
                      </button>
                    </form>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Sign in to add your rating and review for this place.
                    </p>
                  )}
                </div>

                {visibleFeedback.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {reviewsLoading ? "Loading reviews…" : copy.reviewsEmpty}
                  </p>
                ) : (
                  <>
                    <div className="space-y-4">
                      {visibleFeedback.map((feedback, index) => {
                        const ratingValue = feedback.rating
                          ? feedback.rating.rating
                          : 0;

                        return (
                          <article
                            key={
                              feedback.review?._id || feedback.userId || index
                            }
                            className={`review-card border border-gray-100 dark:border-zinc-700 rounded-2xl p-5 space-y-2 ${
                              reviewsExpanded && index >= 3
                                ? "review-card-new"
                                : ""
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {formatReviewTitle(feedback)}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatReviewAuthor(feedback)} ·{" "}
                                  {formatReviewDate(feedback)}
                                </p>
                              </div>
                              {ratingValue > 0 && (
                                <RatingStars rating={ratingValue} readOnly />
                              )}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 review-text">
                              {formatReviewContent(feedback)}
                            </p>

                            {normalizedUserId &&
                              feedback.userId === normalizedUserId && (
                                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-zinc-700/50 mt-3">
                                  <button
                                    type="button"
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-[#DD0303] text-gray-700 hover:text-white rounded-xl transition-all text-sm font-semibold shadow-sm"
                                    onClick={() =>
                                      handleEditReviewClick(feedback)
                                    }
                                    title="Edit review"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    type="button"
                                    className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-xl transition-all text-sm font-semibold shadow-sm"
                                    onClick={() => handleDelete(feedback)}
                                    disabled={reviewDeleting}
                                    title="Delete review"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                          </article>
                        );
                      })}
                    </div>
                    {totalRatingsCount > 3 && (
                      <div className="flex justify-center pt-2">
                        <ToggleButton
                          expanded={reviewsExpanded}
                          onClick={() => setReviewsExpanded((prev) => !prev)}
                          collapsedLabel={copy.seeMore}
                          expandedLabel={copy.seeLess}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg border border-gray-500 dark:border-zinc-700  top-24 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 dark:text-white">
                    Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                      <MapPin className="w-5 h-5 mt-1 text-[#DD0303]" />
                      <span>{gem.gemLocation || "Location not available"}</span>
                    </div>
                    {gem?.gemPhone && (
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                        <Phone className="w-5 h-5 text-[#DD0303]" />
                        <span>{gem?.gemPhone || "ok"}</span>
                      </div>
                    )}

                    {/* <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <Globe className="w-5 h-5 text-[#DD0303]" />
                      <a href="#" className="hover:underline">
                        Visit Website
                      </a>
                    </div> */}
                    {/* Discount Section */}
                    {(gem.discount > 0 ||
                      gem.discountGold > 0 ||
                      gem.discountPlatinum > 0) && (
                      <div className="pt-4 border-t border-gray-200 dark:border-zinc-700">
                        <h4 className="font-semibold mb-3 text-gray-800 dark:text-white">
                          Discounts
                        </h4>

                        {/* Standard */}
                        {gem.discount > 0 && (
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-green-700 dark:text-green-400">
                              Standard Discount
                            </span>
                            <span className="font-bold text-green-700 dark:text-green-400">
                              {gem.discount}%
                            </span>
                          </div>
                        )}

                        {/* Gold */}
                        {gem.discountGold > 0 && (
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-yellow-700 dark:text-yellow-400">
                              Gold Discount
                            </span>
                            <span className="font-bold text-yellow-700 dark:text-yellow-400">
                              {gem.discountGold}%
                            </span>
                          </div>
                        )}

                        {/* Platinum */}
                        {gem.discountPlatinum > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-purple-700 dark:text-purple-400">
                              Platinum Discount
                            </span>
                            <span className="font-bold text-purple-700 dark:text-purple-400">
                              {gem.discountPlatinum}%
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Subscribtion Info */}

                {(gem?.discount > 0 ||
                  gem?.discountPlatinum > 0 ||
                  gem?.discountGold > 0) && (
                  <div className="pt-6 border-t border-gray-100 dark:border-zinc-700 space-y-3">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                      Get Your Discount
                    </h4>

                    {/* Subscription Voucher */}
                    {userInfo?.subscription === "gold" ||
                    userInfo?.subscription === "platinum" ? (
                      <button
                        onClick={createVoucher}
                        disabled={isCreatingVoucher}
                        className="w-full bg-gradient-to-r from-[#DD0303] to-[#FF4444] text-white px-4 py-3 rounded-xl font-semibold text-sm hover:from-[#b90202] hover:to-[#DD0303] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                          />
                        </svg>
                        <span>
                          {isCreatingVoucher
                            ? "Creating..."
                            : "Subscriber Voucher"}
                        </span>
                      </button>
                    ) : (
                      <>
                        <h2 className="font-semibold text-red-800 dark:text-white mb-3">
                          Subscribe to enable this
                        </h2>
                        <button
                          // onClick={createVoucher}
                          disabled={true}
                          className="w-full bg-gradient-to-r from-[#DD0303] to-[#FF4444] text-white px-4 py-3 rounded-xl font-semibold text-sm hover:from-[#b90202] hover:to-[#DD0303] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                            />
                          </svg>
                          <span>
                            {isCreatingVoucher
                              ? "Creating..."
                              : "Subscriber Voucher"}
                          </span>
                        </button>
                      </>
                    )}

                    {/* Points Voucher Section */}

                    {userInfo?.points > 50 ? (
                      <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-xl p-4 border border-gray-200 dark:border-zinc-700 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-gray-900 dark:text-white text-sm">
                            Redeem with Points
                          </h5>
                          <svg
                            className="w-5 h-5 text-yellow-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </div>

                        {showPointsInput ? (
                          <>
                            <div className="flex gap-2">
                              <input
                                type="number"
                                min="1"
                                value={pointsAmount}
                                onChange={(e) =>
                                  setPointsAmount(Number(e.target.value))
                                }
                                placeholder="Enter points"
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#DD0303] focus:border-transparent"
                              />
                              <button
                                onClick={createVoucherByPoints}
                                disabled={isCreatingVoucher || !pointsAmount}
                                className="px-4 py-2 bg-[#DD0303] text-white rounded-lg font-semibold text-sm hover:bg-[#b90202] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isCreatingVoucher ? "..." : "✓"}
                              </button>
                              <button
                                onClick={() => {
                                  setShowPointsInput(false);
                                  setPointsAmount(0);
                                }}
                                className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-300 dark:hover:bg-zinc-600 transition-all"
                              >
                                x
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Enter the number of points you want to use
                            </p>
                          </>
                        ) : (
                          <button
                            onClick={() => setShowPointsInput(true)}
                            disabled={isCreatingVoucher}
                            className="w-full bg-white dark:bg-zinc-800 text-[#DD0303] border-2 border-[#DD0303] px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#DD0303] hover:text-white transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Use Points
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-xl p-4 border border-gray-200 dark:border-zinc-700 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-gray-900 dark:text-white text-sm">
                            You should have at least 50 points to redeem a
                            voucher
                          </h5>
                          <svg
                            className="w-5 h-5 text-yellow-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </div>

                        {showPointsInput ? (
                          <>
                            <div className="flex gap-2">
                              <input
                                type="number"
                                min="1"
                                value={pointsAmount}
                                onChange={(e) =>
                                  setPointsAmount(Number(e.target.value))
                                }
                                placeholder="Enter points"
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#DD0303] focus:border-transparent"
                              />
                              <button
                                onClick={createVoucherByPoints}
                                disabled={isCreatingVoucher || !pointsAmount}
                                className="px-4 py-2 bg-[#DD0303] text-white rounded-lg font-semibold text-sm hover:bg-[#b90202] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isCreatingVoucher ? "..." : "✓"}
                              </button>
                              <button
                                onClick={() => {
                                  setShowPointsInput(false);
                                  setPointsAmount(0);
                                }}
                                className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-300 dark:hover:bg-zinc-600 transition-all"
                              >
                                x
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Enter the number of points you want to use
                            </p>
                          </>
                        ) : (
                          <button
                            // onClick={() => setShowPointsInput(true)}
                            disabled={true}
                            className="w-full bg-white dark:bg-zinc-800 text-[#DD0303] border-2 border-[#DD0303] px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#DD0303] hover:text-white transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Use Points
                          </button>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                      Choose how you'd like to redeem your discount
                    </p>
                  </div>
                )}

                {(!userInfo?.subscription ||
                  userInfo?.subscription === "free") &&
                  userInfo?.role !== "admin" && (
                    <div className="pt-6 border-t border-gray-100 dark:border-zinc-700">
                      <SubscriptionPlans compact />
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <QRCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        qrCode={voucherQR}
        type={voucherType}
        voucherData={voucherData}
      />

      <ImageCarouselModal
        isOpen={carouselOpen}
        onClose={() => setCarouselOpen(false)}
        images={galleryImages}
        initialIndex={carouselInitialIndex}
        resolveImageSrc={resolveImageSrc}
      />
    </>
  );
};

export default GemDetails;
