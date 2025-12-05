import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlistItems,
} from "../../redux/wishlistSlice.js";
import toast from "react-hot-toast";

const WishlistButton = ({ gemId, size = 20 }) => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.wishlist);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkWishlistStatus = () => {
      const isGemInWishlist = items.some(
        (item) => item.gemId?._id === gemId || item.gemId === gemId
      );
      setIsInWishlist(isGemInWishlist);
    };

    checkWishlistStatus();
  }, [items, gemId]);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.error("Please login to add to wishlist");
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(gemId)).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await dispatch(addToWishlist(gemId)).unwrap();
        toast.success("Added to wishlist");
      }
      dispatch(fetchWishlistItems());
    } catch (error) {
      toast.error(error.message || "Failed to update wishlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleWishlistToggle}
      disabled={loading}
      className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm p-2 rounded-full shadow-sm hover:shadow-md transition-all z-10"
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        size={size}
        className={`transition-colors ${
          isInWishlist
            ? "fill-red-500 text-red-500"
            : "text-gray-500 hover:text-red-500"
        } ${loading ? "opacity-50" : ""}`}
      />
    </button>
  );
};

export default WishlistButton;
