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
console.log("1. Verify button clicked");
console.log("2. verifyOtp type:", typeof verifyOtp);
console.log("3. navigate type:", typeof navigate);
console.log("4. setLoading type:", typeof setLoading);
console.log("5. setMessage type:", typeof setMessage);

if (!phoneNumber) {
  setMessage("Phone number is missing. Please login again.");
  return;
}

if (!otp.trim()) {
  setMessage("Please enter the OTP.");
  return;
}

try {
  console.log("6. Starting verification");

  setLoading(true);

  console.log("7. Loading state updated");

  setMessage("");

  console.log("8. Calling backend");

  const response = await verifyOtp(phoneNumber, otp);

  console.log("9. Backend response:", response);

  const token = response.token;

  if (!token) {
    setMessage("JWT token was not received from the backend.");
    return;
  }

  localStorage.setItem("token", token);

  console.log("10. JWT saved");

  navigate("/dashboard");

  console.log("11. Navigation called");

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

return ( <div className="login-container"> <div className="login-card"> <h1>Verify OTP</h1>

    <p>Enter the OTP sent to your mobile number</p>

    <input
      type="text"
      placeholder="Enter OTP"
      value={otp}
      maxLength="6"
      onChange={(event) => setOtp(event.target.value)}
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
