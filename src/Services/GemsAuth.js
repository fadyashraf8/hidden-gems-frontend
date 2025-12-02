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

export async function getGemsAPI(params = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    console.log("Fetching Gems with params:", queryString);
    const { data } = await axios.get(baseURL + `/gems?${queryString}`);
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return error.response ? error.response.data : { error: "Network error" };
  }
}

export async function updateGemAPI(gemId, gemData) {
  try {
    const { data } = await axios.put(baseURL + `/gems/${gemId}`, gemData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return error.response ? error.response.data : { error: "Network error" };
  }
}

export async function deleteGemAPI(gemId) {
  try {
    const { data } = await axios.delete(baseURL + `/gems/${gemId}`);
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return error.response ? error.response.data : { error: "Network error" };
  }
}
