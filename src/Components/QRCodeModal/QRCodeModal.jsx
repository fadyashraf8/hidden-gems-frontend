import React from "react";
import { X, Download } from "lucide-react";
import { useTranslation } from "react-i18next";

const QRCodeModal = ({ isOpen, onClose, qrCode, voucherData,type }) => {
  const { t } = useTranslation("qrModal");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-xs bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 mt-10">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#DD0303] to-[#b90202] p-2 text-white">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/20 transition"
          >
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-xl font-bold mb-1">{t("qrModal.title")}</h2>
          <p className="text-xs text-white/90">{t("qrModal.subtitle")}</p>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* QR Code */}
          <div className="bg-white p-3 rounded-xl shadow-md border-2 border-gray-100 dark:border-zinc-700 flex justify-center">
            <img
              src={qrCode}
              alt={t("qrModal.qrAlt")}
              className="w-40 h-40 object-contain"
            />
          </div>

          {/* Voucher Details */}
          {voucherData && (
            <div className="space-y-2 bg-gray-50 dark:bg-zinc-900/50 p-3 rounded-xl text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  {t("qrModal.code")}
                </span>
                <span className="font-bold text-[#DD0303]">
                  {voucherData.code}
                </span>
              </div>

              {voucherData.discount && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    {t("qrModal.discount")}
                  </span>
                  <span className="font-bold text-green-600">
                    
                    {voucherData.discount}{type==="points"?" Pound ":`% {t("qrModal.off")}`} 
                  </span>
                </div>
              )}

              {voucherData.expiryDate && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    {t("qrModal.expires")}
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {new Date(voucherData.expiryDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-xs">
            <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
              📱 <strong>{t("qrModal.howToUse")}:</strong>{" "}
              {t("qrModal.instructions")}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 bg-[#DD0303] text-white py-2.5 rounded-lg font-semibold hover:bg-[#b90202] transition shadow-lg text-sm"
            >
              {t("common.done")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
