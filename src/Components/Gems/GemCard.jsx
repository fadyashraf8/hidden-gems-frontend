import { Link, useNavigate } from "react-router-dom";
import { MapPin, Edit2, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import { Rating } from "@mui/material";
import { useEffect, useState } from "react";
import { deleteGemAPI } from "../../Services/GemsAuth";
import WishlistButton from "../wishlistButton/wishlistButton";

import "./GemCard.css";

const BASE_URL = import.meta.env.VITE_Base_URL;

const GemCard = ({
  gem,
  isUserGem = false,
  onGemDeleted = null,
  darkMode = false,
}) => {
  const navigate = useNavigate();
  const imagesList = gem.images?.[0];
  const ratingValue = gem.avgRating || gem.rating || 0;
  const [ratingsCount, setRatingsCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchRatingGems = async () => {
      try {
        const response = await fetch(`${BASE_URL}/ratings/gem/${gem._id}`, {
          credentials: "include",
        });
        const data = await response.json();
        if (data.message === "success" && Array.isArray(data.ratings)) {
          setRatingsCount(data.ratings.length);
        }
      } catch (error) {
        console.error("Failed to fetch rating count", error);
      }
    };
    if (gem._id) {
      fetchRatingGems();
    } else {
      console.error("Gem is not passed correctly to GemCard");
    }
  }, [gem._id]);

  if (!gem) {
    console.error("GemCard received null gem prop");
    return (
      // Added 'gem-card' class here too for consistency
      <div className="gem-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        </div>
        <div className="p-4">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const getStatusBadge = () => {
    const status = gem.status || "pending";
    return status.toLowerCase() === "accepted" ? (
      <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 z-10">
        <CheckCircle className="w-3 h-3" />
        Accepted
      </div>
    ) : (
      <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 z-10">
        <AlertCircle className="w-3 h-3" />
        Pending
      </div>
    );
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this gem?")) {
      setIsDeleting(true);
      try {
        const result = await deleteGemAPI(gem._id);
        if (result.message === "success" || result.success) {
          if (onGemDeleted) {
            onGemDeleted(gem._id);
          }
        } else {
          alert("Failed to delete gem");
        }
      } catch (error) {
        console.error("Error deleting gem:", error);
        alert("Error deleting gem");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    navigate(`/business/editPlace/${gem._id}`);
  };

  return (
    <div dir="ltr" className={`group h-full ${darkMode ? "dark" : ""}`}>
      {/* UPDATES HERE: 
          1. Added 'gem-card' class.
          2. Removed 'dark:bg-zinc-800' and 'dark:border-zinc-700' (CSS handles it now).
      */}
      <div className="gem-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Link to={`/gems/${gem._id}`} className="block w-full h-full">
            <img
              src={
                `${imagesList}` ||
                gem.image ||
                "https://via.placeholder.com/400x300"
              }
              alt={gem.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </Link>

          {isUserGem && getStatusBadge()}

          <div className="absolute top-3 right-3 z-20">
            <WishlistButton gemId={gem._id} size={24} />
          </div>

          {(gem.discount > 0 || gem.discountPremium > 0) && (
            <div className="absolute top-3 left-3 bg-[#DD0303] text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
              {gem.discountPremium > 0
                ? `-${gem.discountPremium}% Premium`
                : `-${gem.discount}%`}
            </div>
          )}

          {isUserGem && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2 justify-end">
              <button
                onClick={handleEdit}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                title="Edit gem"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                title="Delete gem"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="p-4 card-body flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <Link to={`/gems/${gem._id}`} className="flex-1">
              {/* Removed conflicting text dark classes, CSS handles it */}
              <h3
                className={`font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-[#DD0303] transition-colors`}
              >
                {gem.name}
              </h3>
            </Link>
          </div>

          {/* Rating Section */}
          <div className="py-1.5 rounded-lg flex items-center gap-2 min-w-[50px] shrink-0">
            <Rating
              name="half-rating-read size-small"
              defaultValue={Number(ratingValue)}
              precision={0.1}
              readOnly
            />
            <span className="text-xs font-bold text-gray-900 leading-none mb-0.5">
              ( {ratingsCount} )
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-500 text-sm mt-3 mb-3">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">
              {gem.gemLocation || gem.location}
            </span>
          </div>

          {gem.category && (
            <div className="inline-block  px-3 py-1 rounded-full text-xs font-medium text-white bg-[#DD0303] self-start mt-auto">
              {gem.category.categoryName || gem.category}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GemCard;
