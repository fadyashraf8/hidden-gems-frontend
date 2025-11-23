import React from "react";

const Support = () => {
  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        <h1 className="footer-page-title">Support</h1>
        <div className="footer-page-content">
          <div className="text-lg">
            <p>
              Need help with your Gemsy account? Have questions about how to use
              our platform? We're here to help.
            </p>

            <h2 className="text-2xl font-semibold mt-8 text-[#DD0303]">
              Contact Us
            </h2>
            <p>
              {" "}
              <strong>Email:</strong> support@gemsy.com
            </p>
            <p>
              {" "}
              <strong>Response time:</strong> Within 24 hours
            </p>

            <h2 className="text-2xl font-semibold mt-8">FAQs</h2>
            <p>
              <strong className="text-[#DD0303]">
                How do I reset my password?
              </strong>
            </p>
            <p>
              Click "Forgot Password" on the login page and follow the
              instructions.
            </p>

            <p>
              <strong className="text-[#DD0303]">
                How do I report a review?
              </strong>
            </p>
            <p>
              Click the flag icon next to any review to report it to our
              moderation team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
