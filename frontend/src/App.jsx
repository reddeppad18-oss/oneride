import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";

import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./pages/DashboardLayout";

import PostRide from "./pages/PostRide";
import SearchRides from "./pages/SearchRides";
import MyRides from "./pages/MyRides";

import MyBookings from "./pages/MyBookings";
import RideBookings from "./pages/RideBookings";

import PostRentalVehicle from "./pages/PostRentalVehicle";
import RentalVehicles from "./pages/RentalVehicles";
import RentalBooking from "./pages/RentalBooking";
import RentalBookingHistory from "./pages/RentalBookingHistory";
import MyRentals from "./pages/MyRentals";

import MyProfile from "./pages/MyProfile";
import MyActivity from "./pages/MyActivity";


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
   SETTINGS
========================= */

function Settings() {

  return (

    <div className="page-container">

      <div className="form-card">

        <h1>Settings</h1>

        <p className="page-description">
          Application settings will be available here.
        </p>

      </div>

    </div>

  );
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
            PROTECTED APPLICATION
        ========================= */}

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >

          {/* DASHBOARD */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />


          {/* =========================
              RIDES
          ========================= */}

          <Route
            path="/post-ride"
            element={<PostRide />}
          />

          <Route
            path="/search-rides"
            element={<SearchRides />}
          />

          <Route
            path="/my-rides"
            element={<MyRides />}
          />

          <Route
            path="/my-bookings"
            element={<MyBookings />}
          />

          <Route
            path="/ride-bookings/:rideId"
            element={<RideBookings />}
          />


          {/* =========================
              RENTALS
          ========================= */}

          <Route
            path="/post-rental-vehicle"
            element={<PostRentalVehicle />}
          />

          <Route
            path="/rental-vehicles"
            element={<RentalVehicles />}
          />

          <Route
            path="/my-rentals"
            element={<MyRentals />}
          />

          <Route
            path="/rental-booking/:rentalId"
            element={<RentalBooking />}
          />

          <Route
            path="/rental-booking-history"
            element={<RentalBookingHistory />}
          />


          {/* =========================
              PROFILE
          ========================= */}

          <Route
            path="/my-profile"
            element={<MyProfile />}
          />

          <Route
            path="/my-activity"
            element={<MyActivity />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>


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