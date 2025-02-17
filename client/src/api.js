import axios from "axios";

export const apiRequest = async (method, endpoint, data = {}, token = "") => {
  try {
    const url = `${process.env.REACT_APP_API_URL}${endpoint}`;
    const headers = { Authorization: `Bearer ${token}` };

    let response;
    if (method === "GET") {
      response = await axios.get(url, { headers });
    } else if (method === "POST") {
      response = await axios.post(url, data, { headers });
    } else if (method === "PUT") {
      response = await axios.put(url, data, { headers });
    } else if (method === "DELETE") {
      response = await axios.delete(url, { headers, data });
    }

    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Something went wrong";
  }
};

export const createMedicalCondition = (data, token) =>
  apiRequest("POST", "/user/medicalcondition", data, token);
export const getMedicalCondition = (id, token) =>
  apiRequest("GET", `/user/medicalcondition/${id}`, {}, token);
export const updateMedicalCondition = (id, data, token) =>
  apiRequest("PUT", `/user/medicalcondition/${id}`, data, token);
export const deleteMedicalCondition = (id, token) =>
  apiRequest("DELETE", `/user/medicalcondition/${id}`, {}, token);
