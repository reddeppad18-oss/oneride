import api from "../api/axios.js";

export const sendOtp = async (phoneNumber) => {
const response = await api.post("/auth/send-otp", {
phoneNumber: phoneNumber,
});

return response.data;
};

export const verifyOtp = async (phoneNumber, otp) => {
const response = await api.post("/auth/verify-otp", {
phoneNumber: phoneNumber,
otp: otp,
});

return response.data;
};
