import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGemByIdAPI } from "../../Services/GemsAuth";
import LoadingScreen from "../LoadingScreen";
import { useTranslation } from "react-i18next";
import RatingStars from "../../Components/RatingStars/RatingStars";
import { MapPin, Phone, Globe } from "lucide-react";

const GemDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation("common");
  const [gem, setGem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchGem() {
      setLoading(true);
      console.log("GemDetails: Fetching for ID:", id);
      const data = await getGemByIdAPI(id);
      console.log("GemDetails: Received data:", data);

      if (data.error) {
        setError(data.error);
      } else {
        const gemData = data.gem || data.result || data;
        console.log("GemDetails: Setting gem state to:", gemData);
        setGem(gemData);
      }
      setLoading(false);
    }
    fetchGem();
  }, [id]);

  if (loading) return <LoadingScreen />;
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!gem) return <div className="text-center mt-10">Gem not found</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 pb-12">
      {/* Hero Image Section - Full Width */}
      <div className="relative h-[50vh] md:h-[60vh] w-full">
        <img
          src={gem.image || "https://via.placeholder.com/1200x600"}
          alt={gem.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{gem.name}</h1>
            <div className="flex items-center gap-4 text-lg">
              <div className="flex items-center gap-1">
                <RatingStars
                  rating={gem.rating || 0}
                  readOnly={true}
                  color="#FFD700"
                />
                <span className="font-medium">
                  ({gem.reviews?.length || 0} reviews)
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
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-zinc-700">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">About</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                {gem.description || "No description available."}
              </p>
            </div>

            {/* Gallery (Placeholder) */}
            <div>
              <h2 className="text-2xl font-bold mb-6 dark:text-white">
                Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800"
                  >
                    <img
                      src={`https://via.placeholder.com/400?text=Image+${i}`}
                      alt="Gallery"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-zinc-700 sticky top-24 space-y-6">
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
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-zinc-700">
                <button className="w-full bg-[#DD0303] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#b90202] transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GemDetails;
