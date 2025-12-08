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
      console.log("ok");
      
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
      console.log("error", error);
      
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

return (
  <button
    onClick={handleWishlistToggle}
    disabled={loading}
    style={{
      position: 'absolute',
      top: '12px',
      right: '12px',
      zIndex: 10,
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(4px)',
      padding: '8px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.2s',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    }}
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
