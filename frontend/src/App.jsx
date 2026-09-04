import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import Dashboard from "./pages/Dashboard";

import PostRide from "./pages/PostRide";
import SearchRides from "./pages/SearchRides";
import MyRides from "./pages/MyRides";

import MyBookings from "./pages/MyBookings";
import RideBookings from "./pages/RideBookings";

import PostRentalVehicle from "./pages/PostRentalVehicle";
import RentalBooking from "./pages/RentalBooking";

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
              <Navigate to="/dashboard" replace />
            ) : (
              <Login />
            )
          }
        />

        {/* =========================
            VERIFY OTP
        ========================= */}
        <Route
          path="/verify-otp"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
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
              <Navigate to="/" replace />
            )
          }
        />

        {/* =========================
            POST RIDE
        ========================= */}
        <Route
          path="/post-ride"
          element={
            token ? (
              <PostRide />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* =========================
            SEARCH RIDES
        ========================= */}
        <Route
          path="/search-rides"
          element={
            token ? (
              <SearchRides />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* =========================
            MY RIDES
        ========================= */}
        <Route
          path="/my-rides"
          element={
            token ? (
              <MyRides />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* =========================
            MY BOOKINGS
        ========================= */}
        <Route
          path="/my-bookings"
          element={
            token ? (
              <MyBookings />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* =========================
            RIDE BOOKINGS
        ========================= */}
        <Route
          path="/ride-bookings/:rideId"
          element={
            token ? (
              <RideBookings />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* =========================
            POST RENTAL VEHICLE
        ========================= */}
        <Route
          path="/post-rental-vehicle"
          element={
            token ? (
              <PostRentalVehicle />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* =========================
            RENTAL BOOKING
        ========================= */}
        <Route
          path="/rental-booking/:rentalId"
          element={
            token ? (
              <RentalBooking />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* =========================
            UNKNOWN ROUTES
        ========================= */}
        <Route
          path="*"
          element={
            <Navigate to="/dashboard" replace />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;