import { toast } from "react-hot-toast";
import i18n from "../i18n";

// Mapping لو الرسائل جاية من السيرفر كنص إنجليزي
const toastMap = {
  "Invalid code or email": "errors.invalidCodeOrEmail",
  "Something went wrong": "errors.somethingWrong",
  "Password changed successfully": "success.passwordChanged",
  "Request sent successfully": "success.requestSent",
  "Email is required": "errors.emailRequired",
};

export function tToast(type, message) {
  // 1) لو السيرفر رجع key
  if (i18n.exists(message)) {
    return type === "error"
      ? toast.error(i18n.t(message))
      : toast.success(i18n.t(message));
  }

  // 2) لو السيرفر رجع نص إنجليزي نعمله mapping
  if (toastMap[message]) {
    const translated = i18n.t(toastMap[message]);
    return type === "error"
      ? toast.error(translated)
      : toast.success(translated);
  }

  // 3) fallback — نعرضه زي ما هو
  return type === "error" ? toast.error(message) : toast.success(message);
}
