import React from 'react'

const Blog = () => {
  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold mb-8">Gemsy Blog</h1>
        <div className="space-y-8">
          <div className="border-b pb-8">
            <h2 className="text-2xl font-semibold mb-2 text-[#DD0303]">
              Top 10 Hidden Cafes in NYC
            </h2>
            <p className="text-gray-600 mb-4">January 15, 2024</p>
            <p className="text-gray-700">
              Discover the coziest, most unique coffee spots that most tourists
              never find...
            </p>
          </div>

            <h2 className="text-2xl font-semibold mb-2 text-[#DD0303]">
              How to Write Helpful Reviews
            </h2>
            <p className="text-gray-600 mb-4">January 10, 2024</p>
            <p className="text-gray-700">
              Tips for writing reviews that actually help other people make
              decisions...
            </p>
        </div>
      </div>
    </div>
  );
}

export default Blog
