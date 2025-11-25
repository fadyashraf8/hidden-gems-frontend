import axios from "axios";
const baseURL = import.meta.env.VITE_Base_URL;

export async function registerAPI(formData) {
  try {
    const { data } = await axios.post(baseURL + "/auth/signUp", formData);
    return data;
  } catch (error) {
    return error.response.data;
  }
}

export async function verifyEmailAPI(data) {
  try {
    const response = await axios.post(baseURL + "/auth/verify", data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
