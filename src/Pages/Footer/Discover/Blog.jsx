import React from "react";

const Blog = () => {
  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        <h1 className="footer-page-title">Gemsy Blog</h1>
        <div className="footer-page-content">
          <div className="space-y-8">
            <div className="border-b pb-8">
              <h2 className="text-2xl font-semibold mb-2 text-[#DD0303]">
                Top 10 Hidden Cafes in NYC
              </h2>
              <p className="mb-4">January 15, 2024</p>
              <p>
                Discover the coziest, most unique coffee spots that most
                tourists never find...
              </p>
            </div>

            <div className="border-b pb-8">
              <h2 className="text-2xl font-semibold mb-2 text-[#DD0303]">
                How to Write Helpful Reviews
              </h2>
              <p className="mb-4">January 10, 2024</p>
              <p>
                Tips for writing reviews that actually help other people make
                decisions...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
