import LoadingScreen from "@/Pages/LoadingScreen";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function VoucherRedeem() {
    const { t } = useTranslation("Vouchers");
  const navigate = useNavigate();
  const { id } = useParams();
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);  
  const { isLoggedIn: isloggedin, userInfo: user } = useSelector(
    (state) => state.user
  );

  
  const getVoucherDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_Base_URL}/vouchers/details/${id}`,
        { withCredentials: true }
      );
      setVoucher(response.data.voucher || null);   
      // console.log(response.data.voucher);
         
    } catch (error) {
      console.error("Error fetching voucher details:", error.response?.data?.error);
      setVoucher(null); 
    } finally {
      setLoading(false); 
    }
  };

  const redeemVoucher = async (action) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_Base_URL}/vouchers/redeem/${id}`,
        { desicion: action },
        { withCredentials: true }
      );
      // console.log("Voucher redeemed:", response.data);
      toast.success(`${action}`)
      navigate('/owner/transactions');
    } catch (error) {
      console.error("Error redeeming voucher:", error.response?.data?.error);
    }
  };

  useEffect(() => {
    getVoucherDetails();


    
  }, []);

  if (loading) return <LoadingScreen />;  

  if (!voucher)
    return (
      <div className="flex justify-center items-center h-screen text-lg dark:text-white">
        {t(" Voucher Not Found")}
      </div>
    );

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-zinc-900 p-4 space-y-4">
      {/* Buttons */}

      {user.role === "owner" && (
        <div className="flex space-x-3">
          <button
            onClick={() => redeemVoucher("accept")}
            className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg shadow-md 
                     hover:from-green-500 hover:to-green-600 transition-all duration-300"
          >
            {t("Accept")}
          </button>
          <button
            onClick={() => redeemVoucher("reject")}
            className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-lg shadow-md 
                     hover:from-red-500 hover:to-red-600 transition-all duration-300"
          >
            {t("Reject")}
          </button>
        </div>
      )}

      {/* Card */}
      <div className="bg-white dark:bg-zinc-800 shadow-md rounded-xl p-4 w-full max-w-md">
        <h2 className="text-xl font-bold mb-3 text-center dark:text-white">
          {t("Voucher Details")}
        </h2>

        <div className="space-y-2">
          <Detail label={`${t("Code")}`} value={voucher.code} />
          <Detail
            label={`${t("Created At")}`}
            value={new Date(voucher.createdAt).toLocaleString()}
          />
          <Detail label={`${t("Discount")}`} value={`${voucher.discount} ${voucher.voucherType==="points"? "Pound" :"%" }   `} />
          <Detail
            label={`${t("Expiry Date")}`}
            value={new Date(voucher.expiryDate).toLocaleString()}
          />

          <hr className="my-3 border-gray-300 dark:border-zinc-700" />

          <h3 className="text-lg font-semibold text-center dark:text-white">
            {t("Gem Info")}
          </h3>
          <Detail label={`${t("Gem Name")}`} value={voucher.gemId?.name} />

          <hr className="my-3 border-gray-300 dark:border-zinc-700" />

          <h3 className="text-lg font-semibold text-center dark:text-white">
            {t("User Info")}
          </h3>
          <Detail
            label={`${t("Full Name")}`}
            value={`${voucher.userId?.firstName} ${voucher.userId?.lastName}`}
          />
          <Detail label={`${t("Email")}`} value={voucher.userId?.email} />
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
