import React from "react";

const AboutUs = () => (
  <div className="footer-page-wrapper">
    <div className="footer-page-container">
      <h1 className="footer-page-title">About Hidden Gems</h1>
      <div className="footer-page-content">
        <p className="leading-relaxed">
          At gemsy, we help people connect with the best local businesses and
          experiences that might otherwise go unnoticed. Our goal is to make it
          easy for everyone to find, share, and celebrate unique places in their
          community.
        </p>

        {/* Relevance */}
        <div>
          <h3 className="text-xl font-semibold text-[#DD0303]">Our Mission</h3>
          <p className="leading-relaxed">
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
          <p className="leading-relaxed">
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
          <div className="leading-relaxed">
            <ul>
              <li>Find unique and memorable local spots.</li>
              <li>Share your experiences with others.</li>
              <li>Support local businesses and communities.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AboutUs;
