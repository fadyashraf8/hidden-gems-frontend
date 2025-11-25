import axios from "axios";
const baseURL = import.meta.env.VITE_Base_URL;

export async function getGemByIdAPI(id) {
  try {
    console.log("Fetching Gem ID:", id);
    console.log("URL:", baseURL + `/gems/${id}`);
    const { data } = await axios.get(baseURL + `/gems/${id}`);
    console.log("API Response:", data);
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return error.response ? error.response.data : { error: "Network error" };
  }
}
