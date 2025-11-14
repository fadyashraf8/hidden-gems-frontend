import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../../redux/userSlice";
import { Menu, X, Search, User, Moon, Sun } from "lucide-react";
import { toggleDarkMode } from "../../redux/darkModeSlice";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const dark = useSelector((state) => state.darkMode.enabled);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const handleDarkToggle = () => {
    dispatch(toggleDarkMode());
  };

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

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [dark]);

  const handleLogin = () => {
    dispatch(login());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav id="nav" className="navbar normal">
      <div className="navbar-container">
        {/* Logo */}
        <a href="/" className="navbar-logo">
          Gemsy
        </a>

        {/* Search - Desktop only */}
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
          {/* Dark Mode */}
          <button className="icon-btn" onClick={handleDarkToggle}>
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Login/Logout */}
          {!isLoggedIn ? (
            <>
              <button className="auth-btn login-btn" onClick={handleLogin}>
                Login
              </button>
              <a href="/signup" className="auth-btn signup-btn">
                Sign Up
              </a>
            </>
          ) : (
            <button className="icon-btn user-btn" onClick={handleLogout}>
              <User size={20} />
            </button>
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

          {/* Login/Signup */}
          {!isLoggedIn && (
            <>
              <li>
                <a href="/login">Login</a>
              </li>
              <li>
                <a href="/signup">Sign Up</a>
              </li>
            </>
          )}

          {/* Mobile Search */}
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
