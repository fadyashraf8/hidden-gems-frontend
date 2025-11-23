import axios from "axios";
const baseURL = import.meta.env.VITE_Base_URL;
export async function registerAPI(formData) {
    try {
            const { data } = await axios.post(
              baseURL + "/auth/signUp",
              formData
            );
        return data

    } catch (error) {
        return error.response.data;
      
    }
    
}