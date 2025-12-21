import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function HomeOwner() {
  const baseURL = import.meta.env.VITE_Base_URL;
  const { userInfo } = useSelector((state) => state.user || {});
  const [gems, setGems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyGems = useCallback(async () => {
    if (!userInfo?.id) return;

    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/gems/user/${userInfo.id}`, {
        withCredentials: true,
      });

      // console.log("HomeOwner gem fetch response:", response.data);

      if (
        response.data.message === "success" &&
        Array.isArray(response.data.result)
      ) {
        setGems(response.data.result);
      } else {
        setGems([]);
      }
    } catch (error) {
      console.error("Error fetching gems:", error);
      setGems([]);
    } finally {
      setLoading(false);
    }
  }, [baseURL, userInfo]);

  useEffect(() => {
    fetchMyGems();
  }, [fetchMyGems]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Gems</h2>
      {loading ? (
        <p>Loading...</p>
      ) : gems.length > 0 ? (
        <div>
          {gems.map((gem) => (
            <div
              key={gem._id}
              className="mb-4 p-4 border rounded shadow-sm bg-white"
            >
              <h4 className="font-bold text-lg">{gem.name}</h4>
              <p className="text-gray-600">
                Total Visits: {gem.visitsCount || 0}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No gems found.</p>
      )}
    </div>
  );
}
