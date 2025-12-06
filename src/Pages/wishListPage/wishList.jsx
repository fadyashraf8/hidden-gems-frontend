import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  fetchWishlistItems,
  clearWishlist,
} from "../../redux/wishlistSlice";
import GemCard from "../../Components/Gems/GemCard";
import {
  Heart,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import LoadingScreen from "../LoadingScreen";
import { useTranslation } from "react-i18next";

// IMPORTANT: Import your CSS file here
import "./wishList.css"; 

const Wishlist = () => {
  const { t, i18n } = useTranslation("Wishlist");
  const isRTL = i18n.language === "ar";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, count } = useSelector((state) => state.wishlist);
  const { isLoggedIn } = useSelector((state) => state.user);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    dispatch(fetchWishlistItems());
    setCurrentPage(1);
  }, [dispatch, isLoggedIn, navigate]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const handleClearWishlist = async () => {
    if (window.confirm(t("wishlist.confirmClear"))) {
      try {
        await dispatch(clearWishlist()).unwrap();
        setCurrentPage(1);
        toast.success(t("wishlist.clearSuccess"));
      } catch (error) {
        toast.error(t("wishlist.clearFail"));
      }
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      pageNumbers.push(1);

      if (startPage > 2) {
        pageNumbers.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  if (loading) return <LoadingScreen />;
  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Home (Top) */}
        <div className="mb-6">
          <Link
            to="/"
            className="back-home-btn inline-flex items-center gap-2 text-gray-600 hover:text-[#DD0303] transition-colors"
          >
            <ArrowLeft size={20} />
            <span>{t("wishlist.backToHome")}</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {t("wishlist.title")}
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-full shadow-sm">
                <Heart className="text-red-500" size={20} />
                <span className="font-semibold text-gray-900">
                  {count} {count === 1 ? t("wishlist.item") : t("wishlist.items")}
                </span>
              </div>

              {items.length > 0 && (
                <button
                  onClick={handleClearWishlist}
                  className="flex items-center gap-2 cursor-pointer bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={18} />
                  <span className="font-medium">{t("wishlist.clearAll")}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="wishlist-empty-state flex flex-col cursor-pointer items-center justify-center py-16 text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-6">
              <Heart className="text-gray-400 cursor-pointer" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("wishlist.emptyTitle")}
            </h2>
            <p className="text-gray-600 mb-6 max-w-md">
              {t("wishlist.emptySubtitle")}
            </p>
            <div className="flex gap-4">
              
              {/* Explore Button */}
              <Link 
                to="/places" 
                className="explore-btn bg-[#DD0303] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#b90202] transition-colors flex items-center gap-2"
              >
                <ShoppingBag size={20} />
                {t("wishlist.explore")}
              </Link>

              {/* Go Home Button - Fixed Light Mode Classes */}
              <Link 
                to="/" 
                className="back-home-btn bg-white text-gray-900 border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                {t("wishlist.goHome")}
              </Link>

            </div>
          </div>
        ) : (
          <>
            {/* List Grid */}
            <div className="wishlist-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((wishlistItem) =>
                wishlistItem.gemId ? (
                  <div key={wishlistItem._id} className="relative wishlist-item-enter">
                    <div className="wishlist-card h-full rounded-xl"> 
                       <GemCard gem={wishlistItem.gemId} />
                    </div>
                  </div>
                ) : null
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  {t("wishlist.showing")} {indexOfFirstItem + 1}{" "}
                  {t("wishlist.to")} {Math.min(indexOfLastItem, items.length)}{" "}
                  {t("wishlist.of")} {items.length} {t("wishlist.items")}
                </div>

                <div className="pagination-container">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="pagination-btn flex items-center"
                  >
                    {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                  </button>

                  {getPageNumbers().map((pageNumber, index) =>
                    pageNumber === "..." ? (
                      <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                        ...
                      </span>
                    ) : (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`pagination-btn ${
                          currentPage === pageNumber ? "active" : ""
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )
                  )}

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="pagination-btn flex items-center"
                  >
                    {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                  </button>
                </div>

                <div className="sm:hidden cursor-pointer text-sm text-gray-600">
                  {t("wishlist.page")} {currentPage} {t("wishlist.of")} {totalPages}
                </div>
              </div>
            )}

            <div className={`${totalPages > 1 ? "mt-8" : "mt-12"} pt-8 border-t border-gray-200`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600">
                    {t("wishlist.youHave")} {items.length} {t("wishlist.gems")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t("wishlist.showingPerPage", { num: itemsPerPage })}
                  </p>
                </div>

                <button
                  onClick={handleClearWishlist}
                  className="flex items-center cursor-pointer gap-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={18} />
                  <span>{t("wishlist.clearWishlist")}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;