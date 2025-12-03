import LoadingScreen from "@/Pages/LoadingScreen";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function VoucherRedeem() {
  const { id } = useParams();
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true); // ← جديد

  const getVoucherDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_Base_URL}/vouchers/details/${id}`,
        { withCredentials: true }
      );
      setVoucher(response.data.voucher || null); // ← لو مش موجود حط null
    } catch (error) {
      console.error("Error fetching voucher details:", error.response?.data?.error);
      setVoucher(null); // ← لو فيه error برضه نخلي null
    } finally {
      setLoading(false); // ← خلصنا التحميل
    }
  };

  const redeemVoucher = async (action) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_Base_URL}/vouchers/redeem/${id}`,
        { desicion: action },
        { withCredentials: true }
      );
      console.log("Voucher redeemed:", response.data);
    } catch (error) {
      console.error("Error redeeming voucher:", error.response?.data?.error);
    }
  };

  useEffect(() => {
    getVoucherDetails();
  }, []);

  if (loading) return <LoadingScreen />; // ← لسة بيحمل

  if (!voucher)
    return (
      <div className="flex justify-center items-center h-screen text-lg dark:text-white">
        Voucher Not Found
      </div>
    );

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-zinc-900 p-4 space-y-4">
      {/* Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={() => redeemVoucher("accept")}
          className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg shadow-md 
                     hover:from-green-500 hover:to-green-600 transition-all duration-300"
        >
          Accept
        </button>
        <button
          onClick={() => redeemVoucher("reject")}
          className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-lg shadow-md 
                     hover:from-red-500 hover:to-red-600 transition-all duration-300"
        >
          Reject
        </button>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-zinc-800 shadow-md rounded-xl p-4 w-full max-w-md">
        <h2 className="text-xl font-bold mb-3 text-center dark:text-white">
          Voucher Details
        </h2>

        <div className="space-y-2">
          <Detail label="Code" value={voucher.code} />
          <Detail
            label="Created At"
            value={new Date(voucher.createdAt).toLocaleString()}
          />
          <Detail label="Discount" value={`${voucher.discount}%`} />
          <Detail
            label="Expiry Date"
            value={new Date(voucher.expiryDate).toLocaleString()}
          />

          <hr className="my-3 border-gray-300 dark:border-zinc-700" />

          <h3 className="text-lg font-semibold dark:text-white">Gem Info</h3>
          <Detail label="Gem Name" value={voucher.gemId?.name} />

          <hr className="my-3 border-gray-300 dark:border-zinc-700" />

          <h3 className="text-lg font-semibold dark:text-white">User Info</h3>
          <Detail
            label="Full Name"
            value={`${voucher.userId?.firstName} ${voucher.userId?.lastName}`}
          />
          <Detail label="Email" value={voucher.userId?.email} />
        </div>
      </div>
    </div>
  );
}

const Detail = ({ label, value }) => (
  <div className="flex justify-between bg-gray-50 dark:bg-zinc-700 p-2 rounded-md">
    <span className="font-medium text-gray-700 dark:text-gray-300">
      {label}
    </span>
    <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
  </div>
);
