import React from "react";

const Partners = () => {
  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        <h1 className="footer-page-title">Partner With Us</h1>
        <div className="footer-page-content">
          <p>
            Interested in partnering with Gemsy? We work with various
            organizations to help people discover great local businesses.
          </p>

          <h2 className="text-2xl font-semibold mt-2 text-[#DD0303]">
            Partnership Opportunities
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Tourism boards and visitor bureaus</li>
            <li>Local business associations</li>
            <li>Event organizers and festivals</li>
            <li>Media and content creators</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-2 text-[#DD0303]">
            Contact Our Partnerships Team
          </h2>
          <p>Email: partnerships@gemsy.com</p>
        </div>
      </div>
    </div>
  );
};

export default Partners;
