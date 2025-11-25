import React, { useEffect, useState, useRef } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import { MapPin, Phone, Globe, Camera, Save } from "lucide-react";
import toast from "react-hot-toast";
import RatingStars from "../../Components/RatingStars/RatingStars";
import LoadingScreen from "../LoadingScreen";
import axios from "axios";
import { useSelector } from "react-redux";

const baseURL = import.meta.env.VITE_Base_URL;

export default function OwnerDashboard() {
  const { userInfo } = useSelector((state) => state.user);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const imageInputRef = useRef(null);

  // Fetch the owner's restaurant
  useEffect(() => {
    async function fetchOwnerRestaurant() {
      if (!userInfo?.id) return;
      setLoading(true);
      try {
        // Fetch gems created by this owner. Assuming owner has one restaurant for now based on previous context
        // If multiple, we might need a list, but user said "the owner dashboard editing part of the resturant" (singular)
        const res = await axios.get(`${baseURL}/gems?createdBy=${userInfo.id}`);
        if (res.data.result && res.data.result.length > 0) {
          setRestaurant(res.data.result[0]);
        } else {
          // Initialize with empty structure if nothing exists
          setRestaurant({
            name: "",
            category: "", // Will need ID or object
            gemLocation: "",
            description: "",
            image: "",
            discount: 0,
            discountPremium: 0,
          });
        }
      } catch (error) {
        console.error("Error fetching restaurant:", error);
        toast.error("Failed to load restaurant details");
      } finally {
        setLoading(false);
      }
    }
    fetchOwnerRestaurant();
  }, [userInfo]);

  const handleFieldChange = (field, value) => {
    setRestaurant((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // For preview
    const url = URL.createObjectURL(file);
    setRestaurant((prev) => ({ ...prev, image: url, imageFile: file }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", restaurant.name);
      formData.append("gemLocation", restaurant.gemLocation);
      formData.append("description", restaurant.description);
      formData.append("discount", restaurant.discount);
      formData.append("discountPremium", restaurant.discountPremium);

      // Handle Category: if it's an object (from populate), get ID, else use value
      if (restaurant.category && typeof restaurant.category === "object") {
        formData.append("category", restaurant.category._id);
      } else if (restaurant.category) {
        formData.append("category", restaurant.category);
      }

      if (restaurant.imageFile) {
        formData.append("images", restaurant.imageFile);
      }

      let res;
      if (restaurant._id) {
        // Update existing
        res = await axios.put(`${baseURL}/gems/${restaurant._id}`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Create new
        res = await axios.post(`${baseURL}/gems`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.status === 200 || res.status === 201) {
        toast.success("Restaurant saved successfully!");
        // Update local state with response to ensure sync
        setRestaurant((prev) => ({ ...prev, ...res.data.result }));
      }
    } catch (error) {
      console.error("Error saving restaurant:", error);
      console.error("Error response:", error.response);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to save changes";
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 pb-12 relative">
      {/* Save Button Floating */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          variant="contained"
          color="error"
          size="large"
          startIcon={<Save />}
          onClick={handleSave}
          disabled={saving}
          sx={{
            borderRadius: 4,
            padding: "12px 24px",
            boxShadow: "0 4px 20px rgba(221, 3, 3, 0.3)",
            backgroundColor: "#DD0303",
            "&:hover": { backgroundColor: "#b90202" },
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Hero Image Section - Editable */}
      <div
        className="relative h-[50vh] md:h-[60vh] w-full group cursor-pointer"
        onClick={() => imageInputRef.current.click()}
      >
        <img
          src={
            restaurant?.image ||
            restaurant?.images?.[0] ||
            "https://via.placeholder.com/1200x600?text=Upload+Image"
          }
          alt={restaurant?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all flex items-center justify-center">
          <div className="text-white flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={48} />
            <span className="mt-2 font-medium">Change Cover Image</span>
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          className="hidden"
          onChange={handleImageUpload}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end pointer-events-none">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 text-white pointer-events-auto">
            <input
              type="text"
              value={restaurant?.name || ""}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Restaurant Name"
              className="text-4xl md:text-6xl font-bold mb-4 bg-transparent border-b border-white/30 focus:border-white outline-none w-full placeholder-white/50"
            />
            <div className="flex items-center gap-4 text-lg">
              <div className="flex items-center gap-1">
                <RatingStars
                  rating={restaurant?.avgRating || 0}
                  readOnly={true}
                  color="#FFD700"
                />
                <span className="font-medium">
                  ({restaurant?.reviews?.length || 0} reviews)
                </span>
              </div>
              {/* Category Selector would go here, maybe a dropdown */}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-zinc-700">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">About</h2>
              <TextField
                multiline
                rows={6}
                fullWidth
                variant="outlined"
                placeholder="Describe your restaurant..."
                value={restaurant?.description || ""}
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(0,0,0,0.1)" },
                    "&:hover fieldset": { borderColor: "#DD0303" },
                    "&.Mui-focused fieldset": { borderColor: "#DD0303" },
                  },
                  backgroundColor: "transparent",
                }}
              />
            </div>

            {/* Gallery Section */}
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-zinc-700">
              <h2 className="text-2xl font-bold mb-6 dark:text-white">
                Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors cursor-pointer flex items-center justify-center group"
                  >
                    {restaurant?.images?.[i - 1] ? (
                      <img
                        src={`${baseURL}/uploads/gem/${
                          restaurant.images[i - 1]
                        }`}
                        alt={`Gallery ${i}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-center">
                        <span className="text-gray-400 text-sm">
                          + Add Image
                        </span>
                        <span className="text-gray-300 text-xs block mt-1">
                          {i}/10
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Click any slot to add or change images.{" "}
                {restaurant?.images?.length || 0} of 10 uploaded.
              </p>
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
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <MapPin className="w-5 h-5 text-[#DD0303] flex-shrink-0" />
                    <input
                      type="text"
                      value={restaurant?.gemLocation || ""}
                      onChange={(e) =>
                        handleFieldChange("gemLocation", e.target.value)
                      }
                      placeholder="Location"
                      className="bg-transparent border-b border-gray-200 focus:border-[#DD0303] outline-none w-full py-1"
                    />
                  </div>

                  {/* Discounts Section - Editable */}
                  <div className="pt-4 border-t border-gray-100 dark:border-zinc-700">
                    <h4 className="font-semibold mb-3 dark:text-white">
                      Discounts
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">
                          Standard Discount (%)
                        </label>
                        <input
                          type="number"
                          value={restaurant?.discount || 0}
                          onChange={(e) =>
                            handleFieldChange(
                              "discount",
                              Number(e.target.value)
                            )
                          }
                          className="w-full bg-gray-50 dark:bg-zinc-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#DD0303]"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#DD0303] mb-1 block font-medium">
                          Premium Discount (%)
                        </label>
                        <input
                          type="number"
                          value={restaurant?.discountPremium || 0}
                          onChange={(e) =>
                            handleFieldChange(
                              "discountPremium",
                              Number(e.target.value)
                            )
                          }
                          className="w-full bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#DD0303]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
