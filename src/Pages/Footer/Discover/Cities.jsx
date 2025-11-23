import React from "react";

const Cities = () => {
  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        <h1 className="footer-page-title">Explore Cities</h1>
        <div className="footer-page-content">
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
    </div>
  );
};

export default Cities;
