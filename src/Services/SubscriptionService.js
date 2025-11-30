import axios from "axios";

const baseURL = import.meta.env.VITE_Base_URL;

export const checkoutOwner = async () => {
  const { data } = await axios.post(
    `${baseURL}/auth/checkout/owner`,
    {},
    { withCredentials: true }
  );

  // Redirect directly to Stripe Checkout URL
  if (data.session?.url) {
    window.location.href = data.session.url;
  } else {
    throw new Error("No checkout URL returned");
  }
};

export const checkoutGold = async () => {
  const { data } = await axios.post(
    `${baseURL}/auth/checkout/gold`,
    {},
    { withCredentials: true }
  );

  if (data.session?.url) {
    window.location.href = data.session.url;
  } else {
    throw new Error("No checkout URL returned");
  }
};

export const checkoutPlatinum = async () => {
  const { data } = await axios.post(
    `${baseURL}/auth/checkout/platinum`,
    {},
    { withCredentials: true }
  );

  if (data.session?.url) {
    window.location.href = data.session.url;
  } else {
    throw new Error("No checkout URL returned");
  }
};

export const checkoutChange = async () => {
  const { data } = await axios.post(
    `${baseURL}/auth/checkout/change`,
    {},
    { withCredentials: true }
  );

  // This returns a portal URL, not a session
  if (data.url) {
    window.location.href = data.url;
  } else {
    throw new Error("No portal URL returned");
  }
};
