import React from "react";

const Advertising = () => {
  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        <h1 className="footer-page-title">Advertising</h1>
        <div className="footer-page-content">
          <p>
            Reach engaged customers who are actively looking for businesses like
            yours.
          </p>

          <h2 className="text-2xl font-semibold mt-4 text-[#DD0303]">
            Advertising Solutions
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Sponsored listings in search results</li>
            <li>Featured business placements</li>
            <li>Targeted advertising by location and category</li>
            <li>Campaign performance analytics</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-4 text-[#DD0303]">
            Get Started
          </h2>
          <p>
            Contact our advertising team to learn more about reaching customers
            on Gemsy.
          </p>
          <p>Email: advertising@gemsy.com</p>
        </div>
      </div>
    </div>
  );
};

export default Advertising;
