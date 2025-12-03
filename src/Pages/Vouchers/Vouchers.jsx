import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingScreen from "@/Pages/LoadingScreen"; 
import QRCodeModal from "@/Components/QRCodeModal/QRCodeModal";

export default function Vouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  // مودال وVoucher محدد
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAllVouchers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_Base_URL}/vouchers`, {
        withCredentials: true,
      });
      setVouchers(res.data || []); 
    } catch (err) {
      console.error("Error fetching vouchers:", err);
      toast.error(err.response?.data?.error || "Failed to fetch vouchers.");
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllVouchers();
  }, []);

  if (loading) return <LoadingScreen />;

  if (!vouchers.length)
    return (
      <div className="flex justify-center items-center h-screen text-lg dark:text-white">
        No Vouchers Found
      </div>
    );

  return (
    <div className="mt-15 p-4">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Vouchers List</h2>
      <ul className="space-y-2">
        {vouchers.map((voucher) => (
          <li
            key={voucher._id}
            className="p-3 bg-white dark:bg-zinc-800 rounded-lg shadow-md flex justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
            onClick={() => {
              setSelectedVoucher(voucher);
              setIsModalOpen(true);
            }}
          >
            <span className="font-semibold dark:text-white">{voucher.code}</span>
            <span className="text-gray-500 dark:text-gray-300">
              {voucher.discount}% 
            </span>
          </li>
        ))}
      </ul>

      {/* مودال الـQRCode */}
      <QRCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        voucherData={selectedVoucher}
        qrCode={selectedVoucher?.qrCode} // لو عندك QR code في البيانات
      />
    </div>
  );
}
