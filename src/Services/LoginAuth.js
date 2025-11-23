import axios from "axios";
const baseURL = import.meta.env.VITE_Base_URL;
export async function loginAPI(formData) {
  try {
    const { data } = await axios.post(baseURL + "/auth/signIn", formData, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    console.log("error",error);
    
    // Prefer returning the backend's response body when available
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { error: error.message };
  }
}


