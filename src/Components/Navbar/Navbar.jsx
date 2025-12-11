import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Menu, X, Search, User, Moon, Sun, Star } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode } from "../../redux/darkModeSlice";
import { logoutUser } from "../../redux/userSlice";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useTranslation } from "react-i18next";
import TranslateTwoToneIcon from "@mui/icons-material/TranslateTwoTone";
import { Link as LinkScroll, scroller } from "react-scroll";
import { Heart } from "lucide-react";
import { fetchWishlistCount } from "../../redux/wishlistSlice";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const { isLoggedIn: isloggedin, userInfo: user } = useSelector(
    (state) => state.user
  );
  const wishlistCount = useSelector((state) => state.wishlist.count);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const dropdownRef = useRef(null);

  const dark = useSelector((state) => state.darkMode.enabled);
  const handleDarkToggle = () => dispatch(toggleDarkMode());

  // Sticky navbar on scroll
  useEffect(() => {
    const scrollFunction = () => {
      const header = document.getElementById("nav");
      if (!header) return;
      if (window.scrollY > 900) {
        header.classList.add("sticky");
        header.classList.remove("normal");
      } else {
        header.classList.remove("sticky");
        header.classList.add("normal");
      }
    };
    window.addEventListener("scroll", scrollFunction);
    return () => window.removeEventListener("scroll", scrollFunction);
  }, []);

  // Dark mode class
  useEffect(() => {
    if (dark) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  }, [dark]);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isloggedin) {
      dispatch(fetchWishlistCount());
    }
  }, [dispatch, isloggedin]);

  // Handle scrolling after navigation (for deep linking)
  useEffect(() => {
    const hash = location.hash;
    if (hash === "#categories" && location.pathname === "/") {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        scroller.scrollTo("categories", {
          duration: 800,
          delay: 0,
          smooth: "easeInOutQuart",
          offset: -80, // Adjust for navbar height
        });
      }, 100);
    }
  }, [location]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      setUserDropdown(false);

      toast.success(t("Signed out successfully"), {
        position: "top-center",
        duration: 2000,
        style: {
          background: "#DD0303",
          color: "white",
        },
       
        id: "logout-toast",
        ariaProps: { role: "status", "aria-live": "polite" },
        icon: "👋",
      });

      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to sign out");
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  // Handler for Categories link - works from any page
  const handleCategoriesClick = (e) => {
    e.preventDefault();
    
    if (location.pathname === "/") {
      // Already on home page, just scroll
      scroller.scrollTo("categories", {
        duration: 800,
        delay: 0,
        smooth: "easeInOutQuart",
        offset: -80, // Adjust based on your navbar height
      });
    } else {
      // Navigate to home page with hash, then scroll
      navigate("/#categories");
    }
    
    // Close mobile menu if open
    setIsOpen(false);
  };

  return (
    <nav id="nav" className="navbar normal">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Gemsy
        </Link>

        <ul className="navbar-links">
          <li>
            <NavLink to="/places">{t("nav_link_places")}</NavLink>
          </li>
          {/* <li>
            <NavLink to="/surprise">{t("nav_link_surprise")}</NavLink>
          </li> */}
          <li>
            <a
              href="#categories"
              onClick={handleCategoriesClick}
              style={{ cursor: "pointer" }}
            >
              {t("nav_link_categories")}
            </a>
          </li>
          <li>
            <NavLink to="/contact-us">{t("nav_link_contact")}</NavLink>
          </li>
          <li>
            <NavLink to="/about/aboutUS">{t("nav_link_about")}</NavLink>
          </li>
        </ul>

        <div className="navbar-actions">
          {isloggedin && (
            <>
              <Link to="/wishlist" className="icon-btn relative">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

=           {isloggedin && (
                <div
                  onClick={() => navigate("/profile")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    background: dark ? "#000000" : "#ffffff",
                    borderRadius: "20px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: dark ? "0 2px 8px rgba(0, 0, 0, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = dark 
                      ? "0 4px 12px rgba(0, 0, 0, 0.5)" 
                      : "0 4px 12px rgba(0, 0, 0, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = dark 
                      ? "0 2px 8px rgba(0, 0, 0, 0.3)" 
                      : "0 2px 8px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <Star size={18} fill={dark ? "#ffffff" : "#000000"} color={dark ? "#ffffff" : "#000000"} />
                  <span style={{ fontWeight: "700", color: dark ? "#ffffff" : "#000000", fontSize: "14px" }}>
                    {user?.points?.toLocaleString() || "0"}
                  </span>
                </div>
              )}
            </>
          )}
          
          <TranslateTwoToneIcon
            style={{ cursor: "pointer", marginRight: "10px" }}
            onClick={() => {
              const newLang = i18n.language === "en" ? "ar" : "en";
              i18n.changeLanguage(newLang);
            }}
          />
          <button className="icon-btn" onClick={handleDarkToggle}>
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {!isloggedin ? (
            <>
              <Link to="/login" className="auth-btn login-btn">
                {t("nav_auth_login")}
              </Link>
              <Link to="/signUp" className="auth-btn signup-btn">
                {t("nav_auth_signup")}
              </Link>
            </>
          ) : (
            <div className="user-dropdown-wrapper" ref={dropdownRef}>
              <button
                className="icon-btn user-btn"
                onClick={() => setUserDropdown(!userDropdown)}
              >
                <User size={20} />
                {user && <p style={{ marginLeft: "6px" }}>{user.firstName}</p>}
              </button>

              {userDropdown && (
                <div className="user-dropdown-menu">
                  {user && (
                    <p
                      style={{
                        padding: "8px 10px",
                        opacity: 0.8,
                      }}
                    >
                      Hi {user.firstName}
                    </p>
                  )}
                  <button onClick={() => navigate("/profile")}>
                    {t("Profile")}
                  </button>
                  {user && user.role !== "admin" && user.role !== "owner" && (
                    <>
                      <button onClick={() => navigate("/vouchers")}>
                        {t("Vouchers")}
                      </button>
                      <button onClick={() => navigate("/transactions")}>
                        Transactions
                      </button>
                    </>
                  )}
                
                  {user && user.role !== "admin" && user.role !== "owner" && (
                    <button onClick={() => navigate("/created-by-you")}>
                      {t("My Gems")}
                    </button>
                  )}
                  {user && user.role === "admin" && (
                    <button onClick={() => navigate("/admin")}>
                      {t("Admin Dashboard")}
                    </button>
                  )}
                  {user && user.role === "owner" && (
                    <button onClick={() => navigate("/owner/dashboard")}>
                      {t("Owner Dashboard")}
                    </button>
                  )}
                  <button onClick={handleLogout}>
                    {t("Sign Out")}
                  </button>
                </div>
              )}
            </div>
          )}

          <button className="hamburger" onClick={toggleMenu}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <ul className="mobile-menu">
=     {isloggedin && (
                <div
                  onClick={() => navigate("/profile")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    background: dark ? "#000000" : "#ffffff",
                    borderRadius: "20px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: dark ? "0 2px 8px rgba(0, 0, 0, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = dark 
                      ? "0 4px 12px rgba(0, 0, 0, 0.5)" 
                      : "0 4px 12px rgba(0, 0, 0, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = dark 
                      ? "0 2px 8px rgba(0, 0, 0, 0.3)" 
                      : "0 2px 8px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <Star size={18} fill={dark ? "#ffffff" : "#000000"} color={dark ? "#ffffff" : "#000000"} />
                  <span style={{ fontWeight: "700", color: dark ? "#ffffff" : "#000000", fontSize: "14px" }}>
                    {user?.points?.toLocaleString() || "0"}
                  </span>
                </div>
              )}
          
          <li>
            <NavLink to="/places" onClick={() => setIsOpen(false)}>
              {t("nav_link_places")}
            </NavLink>
          </li>
          {/* <li>
            <NavLink to="/surprise" onClick={() => setIsOpen(false)}>
              {t("nav_link_surprise")}
            </NavLink>
          </li> */}
          <li>
            <a
              href="#categories"
              onClick={handleCategoriesClick}
              style={{ cursor: "pointer" }}
            >
              {t("nav_link_categories")}
            </a>
          </li>
          <li>
            <NavLink to="/contact-us" onClick={() => setIsOpen(false)}>
              {t("nav_link_contact")}
            </NavLink>
          </li>
          <li>
            <NavLink to="/about/aboutUS" onClick={() => setIsOpen(false)}>
              {t("nav_link_about")}
            </NavLink>
          </li>

          {!isloggedin && (
            <>
              <li>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  {t("nav_auth_login")}
                </Link>
              </li>
              <li>
                <Link to="/signUp" onClick={() => setIsOpen(false)}>
                  {t("nav_auth_signup")}
                </Link>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
}