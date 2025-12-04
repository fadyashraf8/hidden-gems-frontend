import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Rating, Box, Typography } from "@mui/material"; // Added Box and Typography

const BASE_URL = "http://localhost:3000";

const RateGem = ({ gemId }) => {
  const navigate = useNavigate();
  const [reviewData, setReviewData] = useState({
    rating: 0, // Initial rating
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation
    if (reviewData.rating === 0 && !reviewData.description.trim()) {
      return toast.error("Please provide a rating or a review description.");
    }

    const userId = localStorage.getItem("userId") || "placeholder_user_id";
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const promises = [];

      // 2. Conditional Request: Send RATING
      if (reviewData.rating > 0) {
        const ratingRequest = fetch(`${BASE_URL}/ratings`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            gem: gemId,
            rating: reviewData.rating.toString(), // e.g. "4.5"
          }),
        }).then(async (res) => {
          if (!res.ok) throw new Error("Failed to save rating");
        });
        promises.push(ratingRequest);
      }

      // 3. Conditional Request: Send REVIEW
      if (reviewData.description.trim()) {
        const reviewRequest = fetch(`${BASE_URL}/review`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            userId: userId,
            gemId: gemId,
            description: reviewData.description,
            images: [],
          }),
        }).then(async (res) => {
          if (!res.ok) throw new Error("Failed to save review");
        });
        promises.push(reviewRequest);
      }

      await Promise.all(promises);

      toast.success("Feedback submitted! Redirecting...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error submitting feedback");
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-gray-50 p-6 rounded-lg addPlace text-center">
        {/* --- CHANGED SECTION START --- */}
        <div className="mb-6 flex flex-col items-center justify-center">
          {/* <Typography component="legend" className="mb-2 font-medium text-gray-700">
             {reviewData.rating}
          </Typography> */}

          <Rating
            name="gem-rating"
            size="large"
            value={reviewData.rating}
            precision={0.5} // <--- This enables half stars
            onChange={(event, newValue) => {
              setReviewData({ ...reviewData, rating: newValue });
            }}
          />

          {/* View the value to the user */}
          <Box sx={{ mt: 1, minHeight: "24px" }}>
            {reviewData.rating > 0 && (
              <span className="text-[#DD0303] font-bold text-lg">
                {reviewData.rating} / 5
              </span>
            )}
          </Box>
        </div>
        {/* --- CHANGED SECTION END --- */}

        <div className="text-left space-y-4">
          <div>
            <label className="block font-medium">
              Write a Review (Optional)
            </label>
            <textarea
              rows="4"
              className="w-full p-2 border rounded"
              placeholder="Tell us what you liked..."
              value={reviewData.description}
              onChange={(e) =>
                setReviewData({ ...reviewData, description: e.target.value })
              }
            ></textarea>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={handleSkip}
          className="text-gray-500 hover:text-gray-700 px-4 py-2"
        >
          Skip
        </button>
        <button
          type="submit"
          className="bg-[#DD0303] text-white px-6 py-2 rounded cursor-pointer hover:bg-red-700 transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default RateGem;
