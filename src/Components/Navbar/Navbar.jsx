import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/userSlice";
import { Menu, X, Search, User } from "lucide-react";
import "./Navbar.css";
import ModeToggle from "../mode-toggle.tsx";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const header = document.getElementById("nav");

    const scrollFunction = () => {
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

  return (
    <nav id="nav" className="navbar normal">
      <div className="navbar-container">
        {/* Logo */}
        <a href="/" className="navbar-logo">
          Gemsy
        </a>

        {/* Search */}
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search places…" />
        </div>

        {/* Desktop Menu */}
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
          {/* Dark/Light/System Toggle */}
          <ModeToggle />

          {/* If NOT logged in */}
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
            // Logged in → Dropdown
            <div className="profile-dropdown-container">
              <button
                className="icon-btn user-btn"
                onClick={() => setShowProfileMenu((prev) => !prev)}
              >
                <User size={20} />
              </button>

              {showProfileMenu && (
                <div className="profile-dropdown">
                  <a href="/profile">Profile</a>
                  <button onClick={() => dispatch(logout())}>Logout</button>
                </div>
              )}
            </div>
          )}

          {/* Hamburger */}
          <button className="hamburger" onClick={toggleMenu}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
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
