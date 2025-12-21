import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../../redux/userSlice";

const Success = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.darkMode.enabled);

  useEffect(() => {
    // Refresh user data to get updated subscription status
    // dispatch(checkAuth());

    const timer = setTimeout(() => {
      navigate("/profile");
    }, 6000);
    return () => clearTimeout(timer);
  }, [navigate, dispatch]);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        isDarkMode
          ? "bg-gradient-to-br from-green-950 via-gray-900 to-green-950"
          : "bg-gradient-to-br from-green-50 via-white to-green-50"
      } relative overflow-hidden`}
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: isDarkMode ? 0.05 : 0.1, scale: 1 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-10 left-10 w-64 h-64 bg-green-300 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: isDarkMode ? 0.05 : 0.1, scale: 1.2 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5,
          }}
          className="absolute bottom-10 right-10 w-96 h-96 bg-green-400 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.8,
          }}
          className="mb-8 inline-block"
        >
          <div className="relative">
            <div
              className={`absolute inset-0 ${
                isDarkMode ? "bg-green-900" : "bg-green-100"
              } rounded-full blur-xl animate-pulse`}
            ></div>
            <CheckCircle
              className="w-32 h-32 text-green-500 relative z-10 drop-shadow-xl"
              strokeWidth={1.5}
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`text-5xl md:text-6xl font-extrabold ${
            isDarkMode ? "text-white" : "text-gray-900"
          } mb-6 tracking-tight`}
        >
          Payment <span className="text-green-500">Successful!</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className={`text-xl ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          } mb-10 leading-relaxed`}
        >
          Welcome to the club! Your subscription is now active.{" "}
          <br className="hidden md:block" />
          Get ready to explore hidden gems like never before.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/profile"
            className="group relative px-8 py-4 bg-green-500 text-white rounded-full font-bold text-lg shadow-lg hover:bg-green-600 hover:shadow-green-500/30 transition-all transform hover:-translate-y-1 flex items-center gap-2"
          >
            Go to Profile
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/"
            className={`px-8 py-4 ${
              isDarkMode
                ? "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            } border rounded-full font-bold text-lg shadow-sm transition-all transform hover:-translate-y-1 flex items-center gap-2`}
          >
            <Home className="w-5 h-5" />
            Back Home
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className={`mt-12 text-sm ${
            isDarkMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          Redirecting automatically in a few seconds...
        </motion.p>
      </div>
    </div>
  );
};

export default Success;
