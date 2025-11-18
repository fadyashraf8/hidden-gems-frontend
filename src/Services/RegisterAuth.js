import axios from "axios";
const baseURL = "http://localhost:3000";
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