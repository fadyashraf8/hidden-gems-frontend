import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Menu, X, Search, User, Moon, Sun } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode } from "../../redux/darkModeSlice";
import { logoutUser } from "../../redux/userSlice";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useTranslation } from "react-i18next";
import TranslateTwoToneIcon from "@mui/icons-material/TranslateTwoTone";
import {Link as LinkScroll} from "react-scroll"
export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [searchElement, setSearchElement] = useState("");

  const { isLoggedIn: isloggedin, userInfo: user } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  const dropdownRef = useRef(null);

  const dark = useSelector((state) => state.darkMode.enabled);
  const handleDarkToggle = () => dispatch(toggleDarkMode());

  const navigate = useNavigate();

  const handleSearchChage = (e) => {
    setSearchElement(e.target.value);
  }

  const handlePressingEnter = (e) => {
    if(e.key === "Enter") {
      console.log("enter pressed");
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if(searchElement.trim() == "") {
      navigate("/places");
    }
    else {
      navigate(`/places?title=${searchElement}`);
      setSearchElement("");
    }
    
  }
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

 const handleLogout = async () => {
   try {
     await dispatch(logoutUser()).unwrap();
     setUserDropdown(false);

     toast.success(t("signed-out-successfully"), {
       position: "top-center",
       duration: 2000,
       className: "custom-toast",
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

  return (
    <nav id="nav" className="navbar normal">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          {/* {t("app_name")} */}
          Gemsy
        </Link>

        <div className="search-box">
          <Search size={18} onClick={handleSearchSubmit}/>
          <input type="text" onKeyDown={handlePressingEnter} onChange={handleSearchChage} value={searchElement} placeholder={t("nav_search_placeholder")} />
        </div>

        <ul className="navbar-links">
          <li>
            <NavLink to="/places">{t("nav_link_places")}</NavLink>
          </li>
          <li>
            <NavLink to="/surprise">{t("nav_link_surprise")}</NavLink>
          </li>
          <li>
            <LinkScroll to="categories" smooth={true}>
              {t("nav_link_categories")}
            </LinkScroll>
          </li>
          <li>
            <NavLink to="/contact-us">{t("nav_link_contact")}</NavLink>
          </li>
          <li>
            <NavLink to="/about/aboutUS">{t("nav_link_about")}</NavLink>
          </li>
        </ul>

        <div className="navbar-actions">
          {/* Dark Mode */}
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
                  <button onClick={() => navigate("/profile")}>Profile</button>
                  {user && user.role !== "admin" && user.role !== "owner" && (
                    <button onClick={() => navigate("/created-by-you")}>
                      My Gems
                    </button>
                  )}
                  {user && user.role === "admin" && (
                    <button onClick={() => navigate("/admin")}>
                      Admin Dashboard
                    </button>
                  )}
                  {user && user.role === "owner" && (
                    <button onClick={() => navigate("/owner/dashboard")}>
                      Owner Dashboard
                    </button>
                  )}
                  <button onClick={handleLogout}>Sign Out</button>
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
          <li>
            <NavLink to="/places">{t("nav_link_places")}</NavLink>
          </li>
          <li>
            <NavLink to="/surprise">{t("nav_link_surprise")} </NavLink>
          </li>
          <li>
            <LinkScroll to="categories" smooth={true}>
              {t("nav_link_categories")}
            </LinkScroll>
          </li>
          <li>
            <NavLink to="/contact">{t("nav_link_contact")}</NavLink>
          </li>
          <li>
            <NavLink to="/about/aboutUS">{t("nav_link_about")}</NavLink>
          </li>

          {!isloggedin && (
            <>
              <li>
                <Link to="/login">{t("nav_auth_login")}</Link>
              </li>
              <li>
                <Link to="/signUp">{t("nav_auth_signup")}</Link>
              </li>
            </>
          )}
          <li>
            <div className="mobile-search">
              <Search size={18} />
              <input type="text" placeholder={t("nav_search_placeholder")} />
            </div>
          </li>
        </ul>
      )}
    </nav>
  );
}
