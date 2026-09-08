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


/* =========================
   PROTECTED ROUTE
========================= */

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}


/* =========================
   APP
========================= */

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
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* =========================
            POST RIDE
        ========================= */}

        <Route
          path="/post-ride"
          element={
            <ProtectedRoute>
              <PostRide />
            </ProtectedRoute>
          }
        />


        {/* =========================
            SEARCH RIDES
        ========================= */}

        <Route
          path="/search-rides"
          element={
            <ProtectedRoute>
              <SearchRides />
            </ProtectedRoute>
          }
        />


        {/* =========================
            MY RIDES
        ========================= */}

        <Route
          path="/my-rides"
          element={
            <ProtectedRoute>
              <MyRides />
            </ProtectedRoute>
          }
        />


        {/* =========================
            MY BOOKINGS
        ========================= */}

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />


        {/* =========================
            RIDE BOOKINGS
        ========================= */}

        <Route
          path="/ride-bookings/:rideId"
          element={
            <ProtectedRoute>
              <RideBookings />
            </ProtectedRoute>
          }
        />


        {/* =========================
            POST RENTAL VEHICLE
        ========================= */}

        <Route
          path="/post-rental-vehicle"
          element={
            <ProtectedRoute>
              <PostRentalVehicle />
            </ProtectedRoute>
          }
        />


        {/* =========================
            RENTAL BOOKING
        ========================= */}

        <Route
          path="/rental-booking/:rentalId"
          element={
            <ProtectedRoute>
              <RentalBooking />
            </ProtectedRoute>
          }
        />


        {/* =========================
            UNKNOWN ROUTES
        ========================= */}

        <Route
          path="*"
          element={
            <Navigate to="/" replace />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;