import { useNavigate } from 'react-router-dom';
import { THEME } from './constants';
import { useEffect, useState } from 'react';

import WishlistButton from '../wishlistButton/wishlistButton';
const PlaceCard = ({ gem, rank }) => {
  const BASE_URL = import.meta.env.VITE_Base_URL
  const navigate = useNavigate(); 
  const [ ratingsCount, setRatingsCount ] = useState(0);
    useEffect(() => {
      const fetchRatingGems = async () => {
        try {
          const response = await fetch(`${BASE_URL}/ratings/gem/${gem._id}`,{
            credentials: 'include',
          });
          const data = await response.json();
          if(data.message === "success" && Array.isArray(data.ratings)){
            setRatingsCount(data.ratings.length)
             console.log("Gem ID:", data.ratings.length)
          }
        } catch (error) {
          console.log("gemid", gem._id);
          console.error("Failed to fetch rating count", error);
        }
      }
      if(gem._id){
         fetchRatingGems();
       
      }else{
        console.error("Gem is not passed correctly to GemCard")
      }
      
    },[gem._id])
  const handleCardClick = () => {
    navigate(`/gems/${gem._id}`);
  };

  const mainImage = gem.images && gem.images.length > 0 
    ? `${gem.images[0]}` 
    : "https://via.placeholder.com/600x400?text=No+Image";

  const categoryName = gem.category?.categoryName || "Uncategorized";

  // Star rating component
  const StarRating = ({ value }) => {
    const stars = [];
    const fullStars = Math.floor(value);
    const hasHalfStar = value % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} style={{ color: THEME.RED }}>★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} style={{ color: THEME.RED }}>⯨</span>);
      } else {
        stars.push(<span key={i} style={{ color: '#e0e0e0' }}>★</span>);
      }
    }
    return <div style={{ fontSize: '1.2rem', letterSpacing: '2px' }}>{stars}</div>;
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.2s",
        backgroundColor: "white",
        display: "flex",
        flexDirection: window.innerWidth < 640 ? "column" : "row",
      }}
      className="place-card"
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <style>{`
        @media (max-width: 639px) {
          .place-card {
            flex-direction: column !important;
          }
          .place-card-image {
            width: 100% !important;
            min-width: 100% !important;
            height: 200px !important;
          }
        }
        @media (min-width: 640px) {
          .place-card {
            flex-direction: row !important;
          }
          .place-card-image {
            width: 300px !important;
            min-width: 300px !important;
            height: 220px !important;
          }
        }
          .wishlist-button-container {
            position: relative;
            z-index: 20;
        }
          .wishlist-button-container button {
            pointer-events: auto;
        } 
      `}</style>

      {/* Image Section */}
      <div
        className="place-card-image"
        style={{
          flexShrink: 0,
        }}
      >
        <img
          src={mainImage}
          alt={gem.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      <div
        style={{ position: "absolute", top: "10px", right: "10px", zIndex: 20 }}
      >
        <WishlistButton gemId={data._id} size={18} />
      </div>

      {/* Content Section */}
      <div
        style={{
          padding: "20px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2
          style={{
            fontWeight: 800,
            color: THEME.DARK,
            marginBottom: "8px",
            fontSize: "1.5rem",
            margin: "0 0 8px 0",
          }}
        >
          {gem.name}
        </h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <StarRating value={gem.avgRating || 0} />
          <span
            style={{
              marginLeft: "10px",
              color: THEME.DARK,
              fontWeight: 700,
              fontSize: "0.875rem",
            }}
          >
            {ratingsCount} Reviews
          </span>
        </div>

        <div
          style={{
            color: THEME.DARK,
            marginBottom: "8px",
            fontSize: "0.875rem",
          }}
        >
          <span style={{ fontWeight: 600 }}>{categoryName}</span>
          {/* <span style={{ margin: "0 6px", color: THEME.GREY }}>•</span>
          {gem.price || "$$"}*/
          <span style={{ margin: "0 6px", color: THEME.GREY }}>•</span> }
          {gem.gemLocation}
        </div>

        <div style={{ marginTop: "12px" }}>
          <p
            style={{
              color: THEME.GREY,
              fontSize: "0.9rem",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            "{gem.description ? gem.description.substring(0, 100) : ""}..."
            <span
              style={{
                color: THEME.RED,
                fontWeight: 600,
                cursor: "pointer",
                marginLeft: "5px",
              }}
            >
              more
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;