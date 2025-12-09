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
  if (item.userId) {
    return normalizeId(item.userId);
  }
  if (item.createdBy) {
    return normalizeId(item.createdBy);
  }
  if (item.userId && typeof item.userId === "string") {
    return item.userId; // Combined object
  }
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
  const [voucherData, setVoucherData] = useState(null);
  const [isCreatingVoucher, setIsCreatingVoucher] = useState(false);

  const createVoucher = async () => {
    setIsCreatingVoucher(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/vouchers/create/${id}`,
        {},
        { withCredentials: true }
      );

      setVoucherQR(response?.data?.createdVoucher?.qrCode);
      setVoucherData(response?.data?.createdVoucher);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error creating voucher:", err.response?.data?.error);
      toast.error(err.response?.data?.error || "Failed to create voucher.");
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
  }, [fetchGemRatings]);

  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userRatingId, setUserRatingId] = useState(null);
  const [userReviewId, setUserReviewId] = useState(null);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewAuthors, setReviewAuthors] = useState({});
  const [reviewDeleting, setReviewDeleting] = useState(false);

  const aboutRef = useRef(null);
  const composerRef = useRef(null);
  const [aboutMaxHeight, setAboutMaxHeight] = useState(0);
  const copy = useMemo(
    () => ({
      seeMore: t("see_more", { defaultValue: "See more" }),
      seeLess: t("see_less", { defaultValue: "See less" }),
      aboutTitle: t("gem_about_title", { defaultValue: "About" }),
      aboutCaption: t("gem_about_caption", {
        defaultValue: "What to expect",
      }),
      aboutPlaceholder: t("gem_about_placeholder", {
        defaultValue: "Details for this gem are coming soon.",
      }),
      galleryTitle: t("gem_gallery_title", { defaultValue: "Gallery" }),
      galleryCount: (count) =>
        t("gem_gallery_count", {
          count,
          defaultValue: `${count} photos`,
        }),
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
      reviewsTotal: (count) =>
        t("gem_reviews_total", {
          count,
          defaultValue: `${count} reviews`,
        }),
      reviewsEmpty: t("gem_reviews_empty", {
        defaultValue: "No reviews yet. Be the first to share your experience.",
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

  const allUserIds = useMemo(() => {
    const reviewUserIds = reviews.map((review) => getReviewUserId(review));
    const ratingUserIds = gemRatings.map((rating) => getReviewUserId(rating));

    return Array.from(new Set([...reviewUserIds, ...ratingUserIds])).filter(
      Boolean
    );
  }, [gemRatings, reviews]);

  const enrichReviewAuthors = useCallback(
    async (list) => {
      if (!isLoggedIn || !list?.length) return;
      const uniqueIds = [
        ...new Set(list.map((item) => getReviewUserId(item)).filter(Boolean)),
      ];
      const missing = uniqueIds.filter((id) => !(id in reviewAuthors));
      if (!missing.length) return;

      const entries = await Promise.all(
        missing.map(async (id) => {
          try {
            const response = await fetch(`${BASE_URL}/user/${id}`, {
              credentials: "include",
            });
            if (!response.ok) {
              throw new Error("Failed to load author");
            }
            const data = await response.json();
            const profile = data.result || data.user || data;
            return [id, profile];
          } catch {
            return [id, null];
          }
        })
      );

      setReviewAuthors((prev) => {
        const next = { ...prev };
        entries.forEach(([id, profile]) => {
          if (profile) {
            next[id] = profile;
          } else if (!(id in next)) {
            next[id] = null;
          }
        });
        return next;
      });
    },
    [isLoggedIn, reviewAuthors]
  );

  useEffect(() => {
    if (!normalizedUserId || !userInfo) return;
    setReviewAuthors((prev) =>
      prev[normalizedUserId]
        ? prev
        : {
            ...prev,
            [normalizedUserId]: userInfo,
          }
    );
  }, [normalizedUserId, userInfo]);

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
      enrichReviewAuthors(fetched);
    } catch {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }, [id, enrichReviewAuthors]);

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
    return [...allUserIds].map((userId) => {
      const review = reviews.find((r) => getReviewUserId(r) === userId);
      const rating = gemRatings.find(
        (rate) => getReviewUserId(rate) === userId
      );

      return { userId, review, rating };
    });
  }, [gemRatings, reviews, allUserIds]);

  const totalFeedbackCount = combinedFeedback.length;

  useEffect(() => {
    if (combinedFeedback?.length) {
      enrichReviewAuthors(combinedFeedback);
    }
  }, [combinedFeedback, enrichReviewAuthors]);

  const visibleFeedback = reviewsExpanded
    ? combinedFeedback
    : combinedFeedback.slice(0, 3);

  const totalReviewsCount = totalFeedbackCount;

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

  const getProfileDisplayName = (profile) => {
    if (!profile) return null;
    const first = profile.firstName ?? profile.first_name ?? "";
    const last = profile.lastName ?? profile.last_name ?? "";
    const combined = `${first} ${last}`.trim();
    if (combined) return combined;
    if (profile.name) return profile.name;
    if (profile.userName) return profile.userName;
    if (profile.email) return profile.email?.split("@")[0];
    return null;
  };

  const formatReviewAuthor = (review) => {
    const resolvedId = getReviewUserId(review);
    if (resolvedId && reviewAuthors[resolvedId]) {
      const friendly = getProfileDisplayName(reviewAuthors[resolvedId]);
      if (friendly) return friendly;
    }
    if (review.author) return review.author;
    if (review.userName) return review.userName;
    if (review.user?.firstName || review.user?.lastName) {
      return `${review.user?.firstName ?? ""} ${
        review.user?.lastName ?? ""
      }`.trim();
    }
    if (
      typeof review.userId === "object" &&
      review.userId !== null &&
      (review.userId.firstName || review.userId.lastName)
    ) {
      return `${review.userId.firstName ?? ""} ${
        review.userId.lastName ?? ""
      }`.trim();
    }
    return copy.reviewsAnonymous;
  };

  const formatReviewDate = (review) => {
    if (review.date) return review.date;

    if (review.createdAt) {
      const date = new Date(review.createdAt);
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

  const formatReviewTitle = (review) => {
    return review.title || review.headline || copy.reviewsDefaultTitle;
  };

  const formatReviewContent = (review) => {
    return review.content || review.description || review.comment || "";
  };

  const handleEditReviewClick = (feedback) => {
    // 1. Validation: Ensure the user owns this feedback
    if (feedback.userId !== normalizedUserId) return;

    setIsEditingReview(true);

    // 2. Set Review Data (if exists)
    if (feedback.review) {
      setUserReviewId(feedback.review._id);
      setReviewText(formatReviewContent(feedback.review));
    } else {
      setUserReviewId(null);
      setReviewText("");
    }

    // 3. Set Rating Data (if exists)
    if (feedback.rating) {
      // Access the number inside the rating object
      const stars = typeof feedback.rating === 'object' ? feedback.rating.rating : feedback.rating;
      setReviewRating(Number(stars) || 0);
      
      // Store the Rating ID so we update it instead of creating a new one
      if (feedback.rating._id) {
        setUserRatingId(feedback.rating._id);
      }
    } else {
      setUserRatingId(null);
      setReviewRating(0);
    }

    // 4. Clear errors
    setReviewError("");
    setReviewMessage("");

    // 5. Scroll to the "Write Review" section
    composerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleCancelEdit = () => {
    setIsEditingReview(false);
    setReviewText("");
    setReviewMessage("");
    setReviewError("");
    fetchUserRating(); // Reset rating stars to database value
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

    if (!isLoggedIn || !userId) {
      setReviewError("Please sign in to share a review.");
      return;
    }

       if (!isEditingReview && (userReviewId || userRatingId)) {
        toast.error("You have already reviewed this place. Please edit your previous review.");
        return;
    }
    // ---------------------------------------

    if (reviewRating <= 0) {
      setReviewError("Pick a rating before submitting.");
      return;
    }

    const hasReviewText = reviewText.trim().length >= 5;
    if (reviewText.trim().length > 0 && !hasReviewText) {
      setReviewError(
        "Your review needs at least a few words (or leave it empty to just rate)."
      );
      return;
    }

    setSubmittingReview(true);
    const editingExisting = isEditingReview && userReviewId;
    let updatedReview = null;

    if (hasReviewText) {
      try {
        let response;
        if (editingExisting) {
          response = await axios.patch(
            `${BASE_URL}/review/${userReviewId}`,
            {
              description: reviewText.trim(),
            },
            { withCredentials: true }
          );
        } else {
          response = await axios.post(
            `${BASE_URL}/review`,
            {
              description: reviewText.trim(),
              gemId: id,
              userId,
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
          enrichReviewAuthors([savedReview]);
        }
      } catch (error) {
        setReviewError(
          error?.response?.data?.message ||
            "We couldn't save your review. Please try again."
        );
        setSubmittingReview(false);
        return;
      }
    } else if (editingExisting && reviewText.trim().length === 0) {
      if (editingExisting) {
        setReviewError(
          "You cannot remove the text from an existing review. Use 'Delete' instead."
        );
        setSubmittingReview(false);
        return;
      }
    }

    console.log("Submitting rating:", { userRatingId, reviewRating, id });

    try {
      let effectiveRatingId = userRatingId;
      if (!effectiveRatingId) {
        effectiveRatingId = await fetchUserRating({
          preserveComposerValue: true,
        });
        console.log("Fetched effectiveRatingId:", effectiveRatingId);
      }

      if (effectiveRatingId) {
        await axios.put(
          `${BASE_URL}/ratings/${effectiveRatingId}`,
          { rating: reviewRating },
          { withCredentials: true }
        );
        setUserRatingId(effectiveRatingId);
      } else {
        const { data } = await axios.post(
          `${BASE_URL}/ratings`,
          { gem: id, rating: reviewRating },
          { withCredentials: true }
        );
        if (data?.rating?._id) {
          console.log("Created new rating with ID:", data.rating);
          setUserRatingId(data.rating._id);
        }
      }
    } catch (error) {
      console.error("Rating submission error:", error);
      setReviewError(
        error?.response?.data?.message ||
          "We saved your words but not the rating. Try again."
      );
      setSubmittingReview(false);
      return;
    }

    setReviewText("");
    setReviewMessage(
      editingExisting
        ? "Your review was updated."
        : hasReviewText
        ? "Thanks for sharing your thoughts!"
        : "Thanks for your rating!"
    );
    setIsEditingReview(false);
    setSubmittingReview(false);
    setReviewRating(0);
    fetchUserRating();
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
    (reviewText.trim().length >= 5 ||
      (reviewText.trim().length === 0 && reviewRating > 0)) &&
    !submittingReview;

  if (loading) return <LoadingScreen />;
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!gem) return <div className="text-center mt-10">Gem not found</div>;

  return (
    <>
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
                    ({totalReviewsCount} reviews)
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
                      {copy.reviewsTotal(totalReviewsCount)}
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
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-100">
                            {isEditingReview
                              ? "Edit your review"
                              : "Add your review"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {isEditingReview
                              ? "Update your previous feedback below."
                              : "Choose a rating then share a quick highlight."}
                          </p>
                        </div>
                        <RatingStars
                          value={isEditingReview ? reviewRating : 0}
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
                            onClick={handleDelete}
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
                                  {formatReviewTitle(
                                    feedback.review || feedback.rating
                                  )}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatReviewAuthor(
                                    feedback.review || feedback.rating
                                  )}{" "}
                                  ·{" "}
                                  {formatReviewDate(
                                    feedback.review || feedback.rating
                                  )}
                                </p>
                              </div>
                              {ratingValue > 0 && (
                                <RatingStars rating={ratingValue} readOnly />
                              )}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 review-text">
                              {formatReviewContent(
                                feedback.review || feedback.rating
                              )}
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
                    {totalReviewsCount > 3 && (
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
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <Phone className="w-5 h-5 text-[#DD0303]" />
                      <span>+1 234 567 890</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <Globe className="w-5 h-5 text-[#DD0303]" />
                      <a href="#" className="hover:underline">
                        Visit Website
                      </a>
                    </div>
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

                <div className="pt-6 border-t border-gray-100 dark:border-zinc-700">
                  <button
                    onClick={createVoucher}
                    disabled={isCreatingVoucher}
                    className="w-full bg-[#DD0303] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#b90202] transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreatingVoucher
                      ? "Creating Voucher..."
                      : "Ask For A Voucher"}
                  </button>
                </div>

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