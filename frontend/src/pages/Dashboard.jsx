import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PostRide from "./PostRide.jsx";
import SearchRides from "./SearchRides.jsx";
import MyBookings from "./MyBookings.jsx";
import RentalVehicles from "./RentalVehicles.jsx";
import RentalBookingHistory from "./RentalBookingHistory.jsx";
import MyProfile from "./MyProfile.jsx";
import MyActivity from "./MyActivity.jsx";
import MyRides from "./MyRides.jsx";
import MyRentals from "./MyRentals.jsx";

function Dashboard() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleMenuClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="dashboard-layout">

      {/* ========================= */}
      {/* LEFT SIDEBAR */}
      {/* ========================= */}

      <aside className="sidebar">

        <div className="logo">
          <h2>One Ride</h2>
          <p>Ride Sharing Made Easy</p>
        </div>

        <nav className="sidebar-menu">

          {/* Dashboard */}
          <button
            className={`menu-item ${
              activeSection === "dashboard" ? "active" : ""
            }`}
            onClick={() => handleMenuClick("dashboard")}
          >
            Dashboard
          </button>

          {/* Post Ride */}
          <button
            className={`menu-item ${
              activeSection === "post-ride" ? "active" : ""
            }`}
            onClick={() => handleMenuClick("post-ride")}
          >
            Post a Ride
          </button>

          {/* Search Rides */}
          <button
            className={`menu-item ${
              activeSection === "search-rides" ? "active" : ""
            }`}
            onClick={() => handleMenuClick("search-rides")}
          >
            Search Rides
          </button>

          {/* My Bookings */}
          <button
            className={`menu-item ${
              activeSection === "my-bookings" ? "active" : ""
            }`}
            onClick={() => handleMenuClick("my-bookings")}
          >
            Ride Booking History
          </button>

          {/* My Rides */}
          <button
            className={`menu-item ${
              activeSection === "my-rides" ? "active" : ""
            }`}
            onClick={() => handleMenuClick("my-rides")}
          >
            My Posted Rides
          </button>

          {/* Rental Vehicles */}
          <button
            className={`menu-item ${
              activeSection === "rental-vehicles"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleMenuClick("rental-vehicles")
            }
          >
            Rental Vehicles
          </button>

          {/* My Rentals */}
          <button
            className={`menu-item ${
              activeSection === "my-rentals"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleMenuClick("my-rentals")
            }
          >
            My Rental Vehicles
          </button>

          {/* Rental Booking History */}
          <button
            className={`menu-item ${
              activeSection === "rental-booking-history"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleMenuClick(
                "rental-booking-history"
              )
            }
          >
            Rental Booking History
          </button>

          {/* My Activity */}
          <button
            className={`menu-item ${
              activeSection === "my-activity"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleMenuClick("my-activity")
            }
          >
            My Activity
          </button>

          {/* My Profile */}
          <button
            className={`menu-item ${
              activeSection === "my-profile"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleMenuClick("my-profile")
            }
          >
            My Profile
          </button>

        </nav>

        {/* Logout */}
        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </aside>

      {/* ========================= */}
      {/* RIGHT CONTENT */}
      {/* ========================= */}

      <main className="dashboard-content">

        {/* ========================= */}
        {/* DASHBOARD HOME */}
        {/* ========================= */}

        {activeSection === "dashboard" && (
          <>
            <header className="dashboard-header">

              <div>
                <h1>Welcome to One Ride</h1>

                <p>
                  Find a ride, share a ride,
                  or rent a vehicle.
                </p>
              </div>

            </header>

            <section className="dashboard-cards">

              {/* Post Ride */}
              <div className="dashboard-card">

                <h3>Post a Ride</h3>

                <p>
                  Share your journey and allow
                  other users to book available
                  seats.
                </p>

                <button
                  onClick={() =>
                    handleMenuClick("post-ride")
                  }
                >
                  Post Ride
                </button>

              </div>

              {/* Search Rides */}
              <div className="dashboard-card">

                <h3>Search Rides</h3>

                <p>
                  Search for rides based on your
                  source, destination, and travel
                  date.
                </p>

                <button
                  onClick={() =>
                    handleMenuClick("search-rides")
                  }
                >
                  Search Rides
                </button>

              </div>

              {/* My Posted Rides */}
              <div className="dashboard-card">

                <h3>My Posted Rides</h3>

                <p>
                  View your posted rides and
                  manage passenger booking
                  requests.
                </p>

                <button
                  onClick={() =>
                    handleMenuClick("my-rides")
                  }
                >
                  Manage Rides
                </button>

              </div>

              {/* Rental Vehicles */}
              <div className="dashboard-card">

                <h3>Rental Vehicles</h3>

                <p>
                  Find available rental vehicles
                  or post your own vehicle.
                </p>

                <button
                  onClick={() =>
                    handleMenuClick(
                      "rental-vehicles"
                    )
                  }
                >
                  View Vehicles
                </button>

              </div>

              {/* My Rentals */}
              <div className="dashboard-card">

                <h3>My Rental Vehicles</h3>

                <p>
                  Manage your rental vehicles
                  and customer booking requests.
                </p>

                <button
                  onClick={() =>
                    handleMenuClick("my-rentals")
                  }
                >
                  Manage Rentals
                </button>

              </div>

            </section>
          </>
        )}

        {/* ========================= */}
        {/* POST RIDE */}
        {/* ========================= */}

        {activeSection === "post-ride" && (
          <PostRide />
        )}

        {/* ========================= */}
        {/* SEARCH RIDES */}
        {/* ========================= */}

        {activeSection === "search-rides" && (
          <SearchRides />
        )}

        {/* ========================= */}
        {/* MY BOOKINGS */}
        {/* ========================= */}

        {activeSection === "my-bookings" && (
          <MyBookings />
        )}

        {/* ========================= */}
        {/* MY POSTED RIDES */}
        {/* ========================= */}

        {activeSection === "my-rides" && (
          <MyRides />
        )}

        {/* ========================= */}
        {/* RENTAL VEHICLES */}
        {/* ========================= */}

        {activeSection === "rental-vehicles" && (
          <RentalVehicles />
        )}

        {/* ========================= */}
        {/* MY RENTAL VEHICLES */}
        {/* ========================= */}

        {activeSection === "my-rentals" && (
          <MyRentals />
        )}

        {/* ========================= */}
        {/* RENTAL BOOKING HISTORY */}
        {/* ========================= */}

        {activeSection === "rental-booking-history" && (
          <RentalBookingHistory />
        )}

        {/* ========================= */}
        {/* MY ACTIVITY */}
        {/* ========================= */}

        {activeSection === "my-activity" && (
          <MyActivity />
        )}

        {/* ========================= */}
        {/* MY PROFILE */}
        {/* ========================= */}

        {activeSection === "my-profile" && (
          <MyProfile />
        )}

      </main>

    </div>
  );
}

export default Dashboard;