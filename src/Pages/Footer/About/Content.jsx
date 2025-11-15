import React from "react";

const Content = () => {
  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}

        <h1 className="text-6xl font-bold  mb-4">
          Content Guidelines
        </h1>

        {/* General Guidelines */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#DD0303]   ">
            General Guidelines
          </h2>
          <p className="text-gray-700 leading-relaxed">
            People come to Gemsy to connect with great local businesses. We know
            that people won’t always agree, but we expect everyone on the site
            to treat one another and the platform with honesty and respect.
            We’ve put together these general guidelines to help set the tone for
            discourse on the site—just in case. Please also read the additional
            guidelines below for specific types of content that you might
            contribute to the site.{" "}
          </p>

          {/* Relevance */}
          <div>
            <h3 className="text-xl font-semibold text-[#DD0303]">Relevance</h3>
            <p className="text-gray-700 leading-relaxed">
              Only post content about your experience with the business.
            </p>
          </div>

          {/* Inappropriate Content */}
          <div>
            <h3 className="text-xl font-semibold text-[#DD0303] mb-3">
              Inappropriate Content
            </h3>
            <p className="text-gray-700 leading-relaxed">
              No threats, harassment, hate speech, or offensive behavior.
            </p>
          </div>

          {/* Conflicts of Interest */}
          <div>
            <h3 className="text-xl font-semibold text-[#DD0303] mb-3">
              Conflicts of Interest
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Don’t review your own, friends’, or competitors’ businesses.{" "}
              <span className="font-medium">
                Businesses should never ask customers to write reviews.
              </span>
            </p>
          </div>

          {/* Privacy */}
          <div>
            <h3 className="text-xl font-semibold text-[#DD0303] mb-3">
              Privacy
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Don’t share others’ personal info or media without permission.
            </p>
          </div>

          {/* Promotional Content */}
          <div>
            <h3 className="text-xl font-semibold text-[#DD0303] mb-3">
              Promotional Content
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Only post ads through official gesmy Business Accounts.
            </p>
          </div>

          {/* Post Your Own Content */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-[#DD0303] mb-3">
              Post Your Own Content
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Share your own words, photos, and videos; no AI or copied content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
