import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../../redux/userSlice";
import { Menu, X, Search, User, Moon, Sun } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const dispatch = useDispatch(); 
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const handleLogin = () => {
    dispatch(login()); 
  };

  const handleLogout = () => {
    dispatch(logout()); 
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark-mode");
  };

  return (
    <nav className="navbar">
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
          <button className="icon-btn" onClick={toggleDarkMode}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
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
