// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCredentials } from "../../redux/userSlice";
import { logoutApi } from "../../services/authService";
import { Menu, X, Search, User, Moon, Sun } from "lucide-react";
import { toggleDarkMode } from "../../redux/darkModeSlice";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const dark = useSelector((state) => state.darkMode.enabled);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const userInfo = useSelector((state) => state.user.userInfo);

  // Dark mode toggle effect
  useEffect(() => {
    document.body.classList.toggle("dark-mode", dark);
  }, [dark]);

  // Sticky header on scroll
  useEffect(() => {
    const scrollFunction = () => {
      const header = document.getElementById("nav");
      if (!header) return;
      header.classList.toggle("sticky", window.scrollY > 900);
      header.classList.toggle("normal", window.scrollY <= 900);
    };
    window.addEventListener("scroll", scrollFunction);
    return () => window.removeEventListener("scroll", scrollFunction);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi(); // call backend logout if exists
    } catch (err) {
      console.warn("Logout failed:", err);
    } finally {
      dispatch(clearCredentials());
    }
  };

  return (
    <nav id="nav" className="navbar normal">
      <div className="navbar-container">
        {/* Logo */}
        <a href="/" className="navbar-logo">
          Gemsy
        </a>

        {/* Search box */}
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search places…" />
        </div>

        {/* Desktop links */}
        <ul className="navbar-links">
          <li>
            <a href="/places">Places</a>
          </li>
          <li>
            <a href="/surprise">Surprise Me</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Dark Mode Toggle */}
          <button
            className="icon-btn"
            onClick={() => dispatch(toggleDarkMode())}
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {!isLoggedIn ? (
            <>
              <a href="/login" className="auth-btn login-btn">
                Login
              </a>
              <a href="/signUp" className="auth-btn signup-btn">
                Sign Up
              </a>
            </>
          ) : (
            <>
              {userInfo?.image ? (
                <img
                  src={userInfo.image}
                  alt={userInfo.firstName || "User"}
                  className="rounded-full w-8 h-8 object-cover"
                />
              ) : (
                <User size={20} className="icon-btn user-btn" />
              )}
              <span className="user-name">{userInfo?.firstName || "User"}</span>
              <button className="auth-btn login-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <ul className="mobile-menu">
          <li>
            <a href="/places">Places</a>
          </li>
          <li>
            <a href="/surprise">Surprise Me</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>

          {!isLoggedIn && (
            <>
              <li>
                <a href="/login">Login</a>
              </li>
              <li>
                <a href="/signUp">Sign Up</a>
              </li>
            </>
          )}

          <li>
            <div className="mobile-search">
              <Search size={18} />
              <input type="text" placeholder="Search places…" />
            </div>
          </li>
        </ul>
      )}
    </nav>
  );
}
