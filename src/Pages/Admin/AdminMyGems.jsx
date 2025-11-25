import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getGemsAPI } from "../../Services/GemsAuth";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../LoadingScreen";
import "../Admin/Admin.css";

const baseURL = import.meta.env.VITE_Base_URL;

export default function AdminMyGems() {
  const { userInfo } = useSelector((state) => state.user);
  const [gems, setGems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAdminGems() {
      if (!userInfo?.id) return;

      setLoading(true);
      try {
        const data = await getGemsAPI({ createdBy: userInfo.id });

        if (data.result) {
          setGems(data.result);
        } else {
          setGems([]);
        }
      } catch (err) {
        console.error("Error fetching admin gems:", err);
        setError("Failed to load your gems.");
      } finally {
        setLoading(false);
      }
    }

    if (userInfo) {
      fetchAdminGems();
    }
  }, [userInfo]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>My Gems</h1>
        <p className="admin-subtitle">
          Gems you've personally created ({gems.length})
        </p>
      </div>

      {error && (
        <div
          className="error-message"
          style={{ color: "red", padding: "1rem" }}
        >
          {error}
        </div>
      )}

      {!loading && gems.length === 0 ? (
        <div
          className="empty-state"
          style={{ textAlign: "center", padding: "3rem" }}
        >
          <h3>No gems created yet</h3>
          <p style={{ color: "#666", marginTop: "0.5rem" }}>
            You haven't created any gems personally.
          </p>
        </div>
      ) : (
        <div
          className="gems-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
            padding: "1rem",
          }}
        >
          {gems.map((gem) => (
            <div
              key={gem._id}
              className="gem-card"
              style={{
                backgroundColor: "var(--card-bg)",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onClick={() => navigate(`/gems/${gem._id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
              }}
            >
              <div
                style={{
                  position: "relative",
                  paddingTop: "60%",
                  overflow: "hidden",
                }}
              >
                <img
                  src={
                    gem.images?.[0]
                      ? `${baseURL}/uploads/gem/${gem.images[0]}`
                      : "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={gem.name}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "0.5rem",
                    right: "0.5rem",
                    backgroundColor:
                      gem.status === "accepted" ? "#10b981" : "#f59e0b",
                    color: "white",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                  }}
                >
                  {gem.status}
                </div>
              </div>
              <div style={{ padding: "1rem" }}>
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {gem.name}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#666",
                    marginBottom: "0.5rem",
                  }}
                >
                  📍 {gem.gemLocation}
                </p>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#666",
                  }}
                >
                  ⭐ {gem.avgRating?.toFixed(1) || "N/A"} •{" "}
                  {gem.reviews?.length || 0} reviews
                </p>
                {(gem.discount > 0 || gem.discountPremium > 0) && (
                  <div
                    style={{
                      marginTop: "0.75rem",
                      display: "flex",
                      gap: "0.5rem",
                    }}
                  >
                    {gem.discount > 0 && (
                      <span
                        style={{
                          backgroundColor: "#10b981",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                        }}
                      >
                        {gem.discount}% OFF
                      </span>
                    )}
                    {gem.discountPremium > 0 && (
                      <span
                        style={{
                          backgroundColor: "#DD0303",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                        }}
                      >
                        {gem.discountPremium}% PREMIUM
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
