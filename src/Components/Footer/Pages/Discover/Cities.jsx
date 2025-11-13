import React from 'react'

const Cities = () => {
  return (

   <div className="min-h-screen bg-white py-8 px-4">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-6xl font-bold mb-8">Explore Cities</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 ">
        {[
          "New York",
          "Los Angeles",
          "Chicago",
          "Miami",
          "San Francisco",
          "Boston",
          "Seattle",
          "Austin",
          "Denver",
          "Atlanta",
          "Portland",
          "Nashville",
        ].map((city) => (
          <a
            key={city}
            href={`/city/${city.toLowerCase().replace(" ", "-")}`}
            className="p-4 border rounded-lg hover:bg-[#DD0303] hover:text-amber-50 text-center "
          >
            {city}
          </a>
        ))}
      </div>
    </div>
  </div>
  );
}

export default Cities
