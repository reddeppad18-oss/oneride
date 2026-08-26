import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../services/authService.js";

function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!phoneNumber.trim()) {
      setMessage("Please enter your phone number.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await sendOtp(phoneNumber);

      console.log("Send OTP response:", response);

      navigate("/verify-otp", {
        state: {
          phoneNumber: phoneNumber,
        },
      });

    } catch (error) {
      console.error("Send OTP error:", error);

      setMessage(
        error.response?.data?.message ||
        "Failed to send OTP."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1>One Ride</h1>

        <p>Ride Sharing Made Easy</p>

        <input
          type="tel"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        <button
          onClick={handleSendOtp}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send OTP"}
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

export default Login;