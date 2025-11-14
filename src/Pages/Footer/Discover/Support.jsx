import React from 'react'

const Support = () => {
  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold mb-8">Support</h1>
        <div className="text-lg text-gray-700">
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
          <p> <strong >Response time:</strong> Within 24 hours</p>

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
  );
}

export default Support
