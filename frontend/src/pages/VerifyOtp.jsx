import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../services/authService.js";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const phoneNumber = location.state?.phoneNumber;

  const handleVerifyOtp = async () => {
    console.log("Verify button clicked");

    if (!phoneNumber) {
      setMessage("Phone number is missing. Please login again.");
      return;
    }

    if (!otp.trim()) {
      setMessage("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      console.log("Calling verify OTP API...");

      const response = await verifyOtp(phoneNumber, otp);

      console.log("Backend response:", response);

      const token = response?.token;

      if (!token) {
        setMessage("JWT token was not received from the backend.");
        return;
      }

      // Save JWT permanently in browser storage
      localStorage.setItem("token", token);

      console.log("JWT saved successfully");
      console.log("Token exists:", !!localStorage.getItem("token"));

      // Go directly to dashboard
      navigate("/dashboard", { replace: true });

    } catch (error) {
      console.error("OTP verification failed:", error);

      setMessage(
        error.response?.data?.message ||
        "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1>Verify OTP</h1>

        <p>Enter the OTP sent to your mobile number</p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          maxLength={6}
          onChange={(event) => {
            const value = event.target.value.replace(/\D/g, "");
            setOtp(value.slice(0, 6));
          }}
        />

        <button
          type="button"
          onClick={handleVerifyOtp}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {message && (
          <p className="message">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}

export default VerifyOtp;