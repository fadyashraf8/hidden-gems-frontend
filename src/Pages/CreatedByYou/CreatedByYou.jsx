import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getGemsAPI } from "../../Services/GemsAuth";
import GemCard from "../../Components/Gems/GemCard";
import LoadingScreen from "../LoadingScreen";
import { useTranslation } from "react-i18next";
import { Plus, Sparkles } from "lucide-react";
import "./CreatedByYou.css";

const CreatedByYou = () => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const [gems, setGems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUserGems() {
      if (!userInfo?.id) return;

      setLoading(true);
      try {
        // Fetch gems created by the current user
        const data = await getGemsAPI({ createdBy: userInfo.id });

        if (data.result) {
          setGems(data.result);
        } else {
          setGems([]);
        }
      } catch (err) {
        console.error("Error fetching user gems:", err);
        setError("Failed to load your gems.");
      } finally {
        setLoading(false);
      }
    }

    if (userInfo) {
      fetchUserGems();
    }
  }, [userInfo]);

  // Handle gem deletion
  const handleGemDeleted = (deletedGemId) => {
    setGems((prevGems) => prevGems.filter((gem) => gem._id !== deletedGemId));
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 w-full hero">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#DD0303] to-[#b90202] text-white py-12 md:py-16 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-7 h-7 md:w-8 md:h-8 flex-shrink-0" />
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold break-words">
                  My Hidden Gems
                </h1>
              </div>
              <p className="text-white/90 text-base md:text-lg">
                {gems.length === 0
                  ? "Start sharing your favorite places with the world"
                  : `You've shared ${gems.length} amazing ${
                      gems.length === 1 ? "place" : "places"
                    }`}
              </p>
            </div>
            <button
              onClick={() => navigate("/business/addPlace")}
              className="bg-white text-[#DD0303] px-5 md:px-6 py-2.5 md:py-3 rounded-xl font-bold text-base md:text-lg hover:bg-gray-100 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 whitespace-nowrap flex-shrink-0"
            >
              <Plus className="w-5 h-5" />
              Add New Gem
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto w-full">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-8">
              {error}
            </div>
          )}

          {!loading && gems.length === 0 ? (
            <div className="text-center py-16 md:py-20 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm">
              <div className="max-w-md mx-auto px-4">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 dark:bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  No Gems Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm md:text-base">
                  Share your favorite hidden spots and help others discover
                  amazing places!
                </p>
                <button
                  onClick={() => navigate("/business/addPlace")}
                  className="bg-[#DD0303] text-white px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-bold hover:bg-[#b90202] transition inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Gem
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {gems.map((gem) => (
                <GemCard 
                  key={gem._id} 
                  gem={gem} 
                  isUserGem={true}
                  onGemDeleted={handleGemDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatedByYou;
