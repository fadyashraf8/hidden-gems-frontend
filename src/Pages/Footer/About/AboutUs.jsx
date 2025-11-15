import React from "react";

const AboutUs = () => (
  <div className="min-h-screen bg-white py-8 px-4">
    <div className="max-w-4xl mx-auto">
      {/* Header */}

      <h1 className="text-6xl font-bold  mb-4">About Us</h1>

      {/* General Guidelines */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#DD0303]   ">
          Discover Hidden Gems Near You
        </h2>
        <p className="text-gray-700 leading-relaxed">
          At gemsy, we help people connect with the best local businesses and
          experiences that might otherwise go unnoticed. Our goal is to make it
          easy for everyone to find, share, and celebrate unique places in their
          community.
        </p>

        {/* Relevance */}
        <div>
          <h3 className="text-xl font-semibold text-[#DD0303]">Our Mission</h3>
          <p className="text-gray-700 leading-relaxed">
            We believe every great local business deserves to be discovered. By
            highlighting hidden gems, we aim to support small businesses,
            inspire exploration, and help you make informed decisions.{" "}
          </p>
        </div>

        {/* Inappropriate Content */}
        <div>
          <h3 className="text-xl font-semibold text-[#DD0303] mb-3">
            Our Community
          </h3>
          <p className="text-gray-700 leading-relaxed">
            gemsy is built on honest reviews and genuine experiences. We
            encourage our users to share their thoughts respectfully and
            thoughtfully, helping everyone enjoy the best their city has to
            offer.{" "}
          </p>
        </div>

        {/* Conflicts of Interest */}
        <div>
          <h3 className="text-xl font-semibold text-[#DD0303] mb-3">
            Why gemsy?{" "}
          </h3>
          <p className="text-gray-700 leading-relaxed">
            <ul>
              <li>Find unique and memorable local spots.</li>
              <li>Share your experiences with others.</li>
              <li>Support local businesses and communities.</li>
            </ul>
          </p>
        </div>


      </div>
    </div>
  </div>
);

export default AboutUs;
