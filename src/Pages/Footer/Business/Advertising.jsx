import React from 'react'

const Advertising = () => {
  return (
    <div className="min-h-screen bg-white py-8 px-4">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-6xl font-bold mb-8 ">Advertising</h1>
      <div className="space-y-2 text-lg text-gray-700">
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
          Contact our advertising team to learn more about reaching customers on
          Gemsy.
        </p>
        <p>Email: advertising@gemsy.com</p>
      </div>
    </div>
  </div>
  );
}

export default Advertising
