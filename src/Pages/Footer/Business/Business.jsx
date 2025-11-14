import React from 'react'

const Business = () => {
  return (
  <div className="min-h-screen bg-white py-8 px-4">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-6xl font-bold mb-8">For Businesses</h1>
      <div className="space-y-2 text-lg text-gray-700">
        <p>
          Claim your business on Gemsy to connect with customers, manage your
          reputation, and grow your business.
        </p>

        <h2 className="text-2xl font-semibold mt-3 text-[#DD0303]">Benefits</h2>
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
}

export default Business
