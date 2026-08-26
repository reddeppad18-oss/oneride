import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PostRide from "./pages/PostRide.jsx";
import SearchRides from "./pages/SearchRides.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import MyRides from "./pages/MyRides.jsx";
import RideBookings from "./pages/RideBookings.jsx";
import RentalVehicles from "./pages/RentalVehicles.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import PostRentalVehicle from "./pages/PostRentalVehicle.jsx";
import MyRentals from "./pages/MyRentals.jsx";
import RentalBooking from "./pages/RentalBooking.jsx";
import MyRentalBookings from "./pages/MyRentalBookings.jsx";
import RentalBookingRequests from "./pages/RentalBookingRequests.jsx";
import RentalBookingHistory from "./pages/RentalBookingHistory.jsx";
import MyActivity from "./pages/MyActivity.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/post-ride" element={<PostRide />} />
        <Route path="/search-rides" element={<SearchRides />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/my-rides" element={<MyRides />} />
        <Route path="/ride-bookings/:rideId" element={<RideBookings />}/>
        <Route path="/post-rental-vehicle" element={<PostRentalVehicle />}/>
        <Route path="/rental-vehicles" element={<RentalVehicles />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-rentals" element={<MyRentals />}/>
        <Route path="/rental-booking/:rentalId" element={<RentalBooking />}/>
        <Route path="/my-rental-bookings" element={<MyRentalBookings />}/>
        <Route path="/rental-booking-requests/:rentalId" element={<RentalBookingRequests />}/>
        <Route path="/rental-booking-history" element={<RentalBookingHistory />}/>
        <Route path="/my-activity" element={<MyActivity />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;