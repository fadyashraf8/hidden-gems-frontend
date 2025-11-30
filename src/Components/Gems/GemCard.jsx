import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Rating } from "@mui/material";
import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_Base_URL;


const GemCard = ({ gem }) => {
  const imagesList = gem.images?.[0];
  const ratingValue = gem.avgRating || gem.rating || 0;
  const [ ratingsCount, setRatingsCount ] = useState(0)
  useEffect(() => {
    const fetchRatingGems = async () => {
      try {
        const response = await fetch(`${BASE_URL}/ratings/gem/${gem._id}`,{
          credentials: "include"
        });
        const data = await response.json();
        if(data.message === "success" && Array.isArray(data.ratings)){
          setRatingsCount(data.ratings.length)
        }
      } catch (error) {
        console.error("Failed to fetch rating count", error);
      }
    }
    if(gem._id){
      fetchRatingGems();
    }else{
      console.error("Gem is not passed correctly to GemCard")
    }
  },[gem._id])
  return (
    <Link to={`/gems/${gem._id}`} className="block group">
      <div className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-zinc-700">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={
              `${BASE_URL}/uploads/gem/${imagesList}` ||
              gem.image ||
              "https://via.placeholder.com/400x300"
            }
            alt={gem.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-medium shadow-sm">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>{gem.avgRating || gem.rating || 0}</span>
          </div> */}
          {(gem.discount > 0 || gem.discountPremium > 0) && (
            <div className="absolute top-3 left-3 bg-[#DD0303] text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
              {gem.discountPremium > 0
                ? `-${gem.discountPremium}% Premium`
                : `-${gem.discount}%`}
            </div>
          )}
        </div>

        <div className="p-4 card-body">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1 group-hover:text-[#DD0303] transition-colors">
              {gem.name}
            </h3>
          </div>
           <div className=" dark:bg-black/80 py-1.5 rounded-lg flex items-center gap-2 min-w-[50px] shrink-0">
               <Rating name="half-rating-read size-small" defaultValue={Number(ratingValue)} precision={0.1} readOnly />
               {/* <span className="text-xs font-bold text-gray-900 dark:text-white leading-none mb-0.5">
                 {Number(ratingValue).toFixed(1)}
               </span> */}
               <span className="text-xs font-bold text-gray-900 dark:text-white leading-none mb-0.5">
                  ( {ratingsCount} )
              </span>
            </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-3">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">
              {gem.gemLocation || gem.location}
            </span>
          </div>

          {gem.category && (
            <div className="inline-block bg-gray-100 dark:bg-zinc-700 px-3 py-1 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
              {gem.category.categoryName || gem.category}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default GemCard;
