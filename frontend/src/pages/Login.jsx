import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../services/authService.js";

function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setMessage("");

    // Validate Indian 10-digit mobile number
    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      setMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Add +91 automatically
    const formattedPhoneNumber = `+91${phoneNumber}`;

    try {
      setLoading(true);

      const response = await sendOtp(formattedPhoneNumber);

      console.log("Send OTP response:", response);

      // Pass the same formatted number to OTP verification page
      navigate("/verify-otp", {
        state: {
          phoneNumber: formattedPhoneNumber,
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

        <div className="phone-input-container">

          <span className="country-code">
            +91
          </span>

          <input
            type="tel"
            placeholder="Enter phone number"
            value={phoneNumber}
            maxLength={10}
            onChange={(e) => {
              // Allow only numbers
              const value = e.target.value.replace(/\D/g, "");

              // Allow maximum 10 digits
              setPhoneNumber(value.slice(0, 10));
            }}
          />

        </div>

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

