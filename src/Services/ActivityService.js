import axios from "axios";

const BASE_URL = import.meta.env.VITE_Base_URL;

export const deleteUserActivity = async (activityId) => {
  if (!activityId) return;
  try {
    await axios.delete(`${BASE_URL}/activity/${activityId}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Failed to delete activity:", error);
    throw error;
  }
};
