```jsx
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import Dashboard from "./pages/Dashboard";
import MyBookings from "./pages/MyBookings";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            LOGIN
        ========================= */}

        <Route
          path="/"
          element={
            token ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Login />
            )
          }
        />


        {/* =========================
            OTP VERIFICATION
        ========================= */}

        <Route
          path="/verify-otp"
          element={
            token ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <VerifyOtp />
            )
          }
        />


        {/* =========================
            DASHBOARD
        ========================= */}

        <Route
          path="/dashboard"
          element={
            token ? (
              <Dashboard />
            ) : (
              <Navigate
                to="/"
                replace
              />
            )
          }
        />


        {/* =========================
            MY RIDE BOOKINGS
        ========================= */}

        <Route
          path="/my-bookings"
          element={
            token ? (
              <MyBookings />
            ) : (
              <Navigate
                to="/"
                replace
              />
            )
          }
        />


        {/* =========================
            UNKNOWN URL
        ========================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
```
