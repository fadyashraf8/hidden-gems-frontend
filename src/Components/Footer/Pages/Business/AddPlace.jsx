import React from 'react'
import { useNavigate } from "react-router-dom";

const AddPlace = () => {
   const navigate = useNavigate();
   
  const handleSubmit = () => {
    navigate("/Login");
  };
  return (
    <div className="min-h-screen bg-white py-8 px-4">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-6xl font-bold mb-8">Add Your Place</h1>
      <div className="space-y-6 text-lg text-gray-700">
        <p>
          Is your business missing from Gemsy? Add it now to start connecting
          with customers.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-[#DD0303]">
            Business Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block font-medium">Business Name</label>
              <input type="text" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block font-medium">Address</label>
              <input type="text" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block font-medium">Category</label>
              <select className="w-full p-2 border rounded">
                <option>Restaurant</option>
                <option>Retail</option>
                <option>Service</option>
                <option>Entertainment</option>
              </select>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <button className="bg-[#DD0303] text-white px-6 py-2 rounded ml-80 cursor-pointer">
            Submit
          </button>
        </form>
      </div>
    </div>
  </div>
  );
}

export default AddPlace
