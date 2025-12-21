import React, { useState, useEffect } from "react";
import {
  Users,
  Layers,
  Gem,
  TrendingUp,
  Activity,
  BarChart3,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import LoadingScreen from "../../LoadingScreen";
import { useTranslation } from "react-i18next";

export default function HomeAdmin() {
  const { t } = useTranslation("AdminDashboard");

  const [stats, setStats] = useState({
    users: { total: 0, loading: true },
    categories: { total: 0, loading: true },
    gems: { total: 0, loading: true },
  });

  const [recentCategories, setRecentCategories] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const baseUrl = import.meta.env.VITE_Base_URL;

  useEffect(() => {
    const darkMode = document.body.classList.contains("dark-mode");
    setIsDark(darkMode);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const usersRes = await fetch(`${baseUrl}/users`, {
        credentials: 'include'
      });
      const usersData = await usersRes.json();
      // console.log("usersData", usersData);

      const categoriesRes = await fetch(`${baseUrl}/categories`, {
        credentials: 'include'
      });
      const categoriesData = await categoriesRes.json();
      // console.log("categoriesData", categoriesData);

      const AllCategoriesData = await fetch(`${baseUrl}/categories`, {
        credentials: 'include'
      });
      const AllCategoriesDataaaaaa = await AllCategoriesData.json();
      // console.log("categoriesData", categoriesData);

      const gemsRes = await fetch(`${baseUrl}/gems`, {
        credentials: 'include'
      });
      const gemsData = await gemsRes.json();
      // console.log("gemsData", gemsData);

      setStats({
        users: { total: usersData.totalItems || 0, loading: false },
        categories: { total: categoriesData.totalItems || 0, loading: false },
        gems: { total: gemsData.totalItems || 0, loading: false },
      });

      setRecentCategories(AllCategoriesDataaaaaa.result || []);
    } catch (error) {
      console.error("Error:", error);
      setStats({
        users: { total: 0, loading: false },
        categories: { total: 0, loading: false },
        gems: { total: 0, loading: false },
      });
    }
  };

  // تحويل البيانات الحالية لشكل مناسب للـ Chart
  const chartData = [
    {
      name: t("total_users") || "المستخدمين",
      value: stats.users.total,
      color: "#667eea",
    },
    {
      name: t("total_categories") || "الفئات",
      value: stats.categories.total,
      color: "#f093fb",
    },
    {
      name: t("total_gems") || "الجواهر",
      value: stats.gems.total,
      color: "#4facfe",
    },
  ];

  const StatCard = ({ icon: Icon, title, value, loading, gradient }) => (
    <div
      style={{
        background: isDark ? "var(--dm-card-bg)" : "#ffffff",
        borderRadius: "12px",
        padding: "24px",
        border: isDark
          ? "1px solid rgba(255,255,255,0.1)"
          : "1px solid #e5e7eb",
        transition: "all 0.2s",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "14px",
              color: isDark ? "var(--dm-subtext)" : "#6b7280",
              marginBottom: "8px",
              fontWeight: "500",
            }}
          >
            {t(title)}
          </div>

          {loading ? (
            <LoadingScreen />
          ) : (
            <div
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: isDark ? "var(--dm-text)" : "#111827",
              }}
            >
              {value.toLocaleString()}
            </div>
          )}
        </div>

        <div
          style={{
            background: gradient,
            padding: "12px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={24} color="#ffffff" />
        </div>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: isDark ? "var(--dm-card-bg)" : "#ffffff",
            padding: "12px 16px",
            borderRadius: "8px",
            border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e5e7eb",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ 
            color: isDark ? "var(--dm-text)" : "#111827", 
            fontWeight: "600", 
            marginBottom: "4px",
            fontSize: "14px"
          }}>
            {payload[0].payload.name}
          </p>
          <p
            style={{
              color: payload[0].payload.color,
              fontSize: "18px",
              fontWeight: "700",
              margin: "0",
            }}
          >
            {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: isDark ? "var(--dm-bg)" : "#f9fafb",
        padding: "32px 24px",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: isDark ? "var(--dm-text)" : "#111827",
              marginBottom: "6px",
            }}
          >
            {t("dashboard_title")}
          </h1>

          <p
            style={{
              fontSize: "14px",
              color: isDark ? "var(--dm-subtext)" : "#6b7280",
            }}
          >
            {t("dashboard_subtitle")}
          </p>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <StatCard
            icon={Users}
            title="total_users"
            value={stats.users.total}
            loading={stats.users.loading}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />

          <StatCard
            icon={Layers}
            title="total_categories"
            value={stats.categories.total}
            loading={stats.categories.loading}
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          />

          <StatCard
            icon={Gem}
            title="total_gems"
            value={stats.gems.total}
            loading={stats.gems.loading}
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          />
        </div>

        {/* Chart Section - Using Real Data */}
        <div
          style={{
            background: isDark ? "var(--dm-card-bg)" : "#ffffff",
            borderRadius: "12px",
            padding: "24px",
            border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e5e7eb",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <BarChart3 size={20} color="#ffffff" />
            </div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: isDark ? "var(--dm-text)" : "#111827",
              }}
            >
              {t("platform_statistics") || "إحصائيات المنصة"}
            </h2>
          </div>

          {stats.users.loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <LoadingScreen />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={isDark ? "#374151" : "#e5e7eb"} 
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke={isDark ? "var(--dm-subtext)" : "#6b7280"}
                  style={{ fontSize: "13px" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke={isDark ? "var(--dm-subtext)" : "#6b7280"} 
                  style={{ fontSize: "12px" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }} />
                <Bar 
                  dataKey="value" 
                  radius={[8, 8, 0, 0]}
                  maxBarSize={80}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Categories */}
        <div
          style={{
            background: isDark ? "var(--dm-card-bg)" : "#ffffff",
            borderRadius: "12px",
            padding: "24px",
            border: isDark
              ? "1px solid rgba(255,255,255,0.1)"
              : "1px solid #e5e7eb",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: isDark ? "var(--dm-text)" : "#111827",
              }}
            >
              {t("latest_categories")}
            </h2>

            <span
              style={{
                fontSize: "13px",
                color: isDark ? "var(--dm-subtext)" : "#9ca3af",
                background: isDark ? "rgba(255,255,255,0.05)" : "#f3f4f6",
                padding: "4px 12px",
                borderRadius: "20px",
              }}
            >
              {recentCategories.length} {t("category")}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "16px",
            }}
          >
            {recentCategories.map((category) => (
              <div
                key={category._id}
                style={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.1)"
                    : "1px solid #e5e7eb",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-4px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div style={{ position: "relative", paddingTop: "100%" }}>
                  <img
                    src={category.categoryImage}
                    alt={category.categoryName}
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
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                      padding: "12px",
                    }}
                  >
                    <div
                      style={{
                        color: "#fff",
                        fontSize: "14px",
                        fontWeight: "600",
                        marginBottom: "2px",
                      }}
                    >
                      {category.categoryName}
                    </div>

                    {category.createdBy && (
                      <div
                        style={{
                          color: "rgba(255,255,255,0.8)",
                          fontSize: "11px",
                        }}
                      >
                        {category.createdBy.firstName}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {recentCategories.length === 0 && !stats.categories.loading && (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: isDark ? "var(--dm-subtext)" : "#9ca3af",
              }}
            >
              <Layers
                size={48}
                style={{ opacity: 0.3, marginBottom: "12px" }}
              />
              <div>{t("no_categories")}</div>
            </div>
          )}
        </div>

        {/* Additional Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Activity */}
          <div
            style={{
              background: isDark ? "var(--dm-card-bg)" : "#ffffff",
              borderRadius: "12px",
              padding: "24px",
              border: isDark
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                  padding: "10px",
                  borderRadius: "8px",
                }}
              >
                <Activity size={20} color="#ffffff" />
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "13px",
                    color: isDark ? "var(--dm-subtext)" : "#6b7280",
                  }}
                >
                  {t("activity")}
                </div>

                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: isDark ? "var(--dm-text)" : "#111827",
                  }}
                >
                  {t("active")}
                </div>
              </div>
            </div>

            <div
              style={{
                fontSize: "13px",
                color: isDark ? "var(--dm-subtext)" : "#6b7280",
              }}
            >
              {t("all_categories_active")}
            </div>
          </div>

          {/* Growth */}
          <div
            style={{
              background: isDark ? "var(--dm-card-bg)" : "#ffffff",
              borderRadius: "12px",
              padding: "24px",
              border: isDark
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
                  padding: "10px",
                  borderRadius: "8px",
                }}
              >
                <BarChart3 size={20} color="#ffffff" />
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "13px",
                    color: isDark ? "var(--dm-subtext)" : "#6b7280",
                  }}
                >
                  {t("growth_rate")}
                </div>

                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: isDark ? "var(--dm-text)" : "#111827",
                  }}
                >
                  +12.5%
                </div>
              </div>
            </div>

            <div
              style={{
                fontSize: "13px",
                color: isDark ? "var(--dm-subtext)" : "#6b7280",
              }}
            >
              {t("compared_last_month")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}