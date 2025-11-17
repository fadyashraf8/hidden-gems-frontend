import { useState, useEffect, useContext, useRef } from "react";
import { Menu, X, Search, User, Moon, Sun } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode } from "../../redux/darkModeSlice";
import AuthContext from "../../Context/AuthContext";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const dark = useSelector((state) => state.darkMode.enabled);
  const handleDarkToggle = () => dispatch(toggleDarkMode());

  const { isloggedin, setisloggedin } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setisloggedin(false);
    setUserDropdown(false);
    navigate("/");
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav id="nav" className="navbar normal">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Gemsy
        </Link>

        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search places…" />
        </div>

        <ul className="navbar-links">
          <li>
            <NavLink to="/places">Places</NavLink>
          </li>
          <li>
            <NavLink to="/surprise">Surprise Me</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>
        </ul>

        <div className="navbar-actions">
          <button className="icon-btn" onClick={handleDarkToggle}>
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {!isloggedin ? (
            <>
              <Link to="/login" className="auth-btn login-btn">
                Login
              </Link>
              <Link to="/signUp" className="auth-btn signup-btn">
                Sign Up
              </Link>
            </>
          ) : (
            <div className="user-dropdown-wrapper" ref={dropdownRef}>
              <button
                className="icon-btn user-btn"
                onClick={() => setUserDropdown(!userDropdown)}
              >
                <User size={20} />
              </button>
              {userDropdown && (
                <div className="user-dropdown-menu">
                  <button onClick={() => navigate("/profile")}>Profile</button>
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
            <NavLink to="/places">Places</NavLink>
          </li>
          <li>
            <NavLink to="/surprise">Surprise Me</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>
          {!isloggedin && (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signUp">Sign Up</Link>
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
