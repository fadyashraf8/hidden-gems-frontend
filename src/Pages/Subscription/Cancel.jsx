import React from "react";
import { Link } from "react-router-dom";
import { XCircle, RefreshCcw, Home } from "lucide-react";
import { motion } from "framer-motion";

const Cancel = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-20 right-20 w-72 h-72 bg-red-300 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.1, scale: 1.2 }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5,
          }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-red-400 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 15,
            duration: 0.6,
          }}
          className="mb-8 inline-block"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{
              delay: 0.5,
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 3,
            }}
            className="relative"
          >
            <div className="absolute inset-0 bg-red-100 rounded-full blur-xl"></div>
            <XCircle
              className="w-32 h-32 text-red-500 relative z-10 drop-shadow-xl"
              strokeWidth={1.5}
            />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight"
        >
          Payment <span className="text-red-500">Cancelled</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl text-gray-600 mb-10 leading-relaxed"
        >
          It looks like you cancelled the payment process.{" "}
          <br className="hidden md:block" />
          No worries, no charges were made to your account.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/profile"
            className="group px-8 py-4 bg-[#DD0303] text-white rounded-full font-bold text-lg shadow-lg hover:bg-[#b90202] hover:shadow-red-500/30 transition-all transform hover:-translate-y-1 flex items-center gap-2"
          >
            <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </Link>

          <Link
            to="/"
            className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-bold text-lg shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all transform hover:-translate-y-1 flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Cancel;
