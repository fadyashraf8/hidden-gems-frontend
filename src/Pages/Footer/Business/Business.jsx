import React from "react";

const Business = () => {
  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        <h1 className="footer-page-title">For Businesses</h1>
        <div className="footer-page-content">
          <p>
            Claim your business on Gemsy to connect with customers, manage your
            reputation, and grow your business.
          </p>

          <h2 className="text-2xl font-semibold mt-3 text-[#DD0303]">
            Benefits
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Respond to customer reviews</li>
            <li>Update business information</li>
            <li>Add photos and special offers</li>
            <li>Access business analytics</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-2 text-[#DD0303]">
            Get Started
          </h2>
          <p>
            Search for your business and claim it, or add your business if it's
            not already listed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Business;
