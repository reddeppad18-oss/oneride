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
  const [activeMenu, setActiveMenu] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleMenuClick = (section) => {
    setActiveSection(section);
    setActiveMenu(null);
  };

  const handleBottomMenu = (menu) => {
    if (activeMenu === menu) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menu);
    }
  };

  return (
    <div className="dashboard-layout">

      <header className="mobile-app-header">
        <div className="app-brand">
          <div className="app-logo">O</div>

          <div>
            <h2>OneRide</h2>
            <span>Ride Sharing Made Easy</span>
          </div>
        </div>
      </header>

      <main className="dashboard-content">

        {activeSection === "dashboard" && (
          <>
            <header className="dashboard-header">
              <div>
                <h1>Welcome to OneRide</h1>

                <p>
                  Find a ride, share a ride,
                  or rent a vehicle.
                </p>
              </div>
            </header>

            <section className="dashboard-cards">

              <div className="dashboard-card">
                <div className="card-icon">🚗</div>

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

              <div className="dashboard-card">
                <div className="card-icon">🔍</div>

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

              <div className="dashboard-card">
                <div className="card-icon">📋</div>

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

              <div className="dashboard-card">
                <div className="card-icon">🚙</div>

                <h3>Rental Vehicles</h3>

                <p>
                  Find available rental vehicles
                  or post your own vehicle.
                </p>

                <button
                  onClick={() =>
                    handleMenuClick("rental-vehicles")
                  }
                >
                  View Vehicles
                </button>
              </div>

              <div className="dashboard-card">
                <div className="card-icon">🔑</div>

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

        {activeSection === "post-ride" && (
          <PostRide />
        )}

        {activeSection === "search-rides" && (
          <SearchRides />
        )}

        {activeSection === "my-bookings" && (
          <MyBookings />
        )}

        {activeSection === "my-rides" && (
          <MyRides />
        )}

        {activeSection === "rental-vehicles" && (
          <RentalVehicles />
        )}

        {activeSection === "my-rentals" && (
          <MyRentals />
        )}

        {activeSection === "rental-booking-history" && (
          <RentalBookingHistory />
        )}

        {activeSection === "my-activity" && (
          <MyActivity />
        )}

        {activeSection === "my-profile" && (
          <MyProfile />
        )}

        {activeSection === "settings" && (
          <div className="page-container">
            <div className="form-card">
              <h1>Settings</h1>

              <p className="page-description">
                Application settings will be available here.
              </p>
            </div>
          </div>
        )}

      </main>

      {activeMenu === "rides" && (
        <div className="bottom-popup">
          <button
            onClick={() =>
              handleMenuClick("post-ride")
            }
          >
            <span>🚗</span>
            Post Ride
          </button>

          <button
            onClick={() =>
              handleMenuClick("search-rides")
            }
          >
            <span>🔍</span>
            Search Rides
          </button>

          <button
            onClick={() =>
              handleMenuClick("my-rides")
            }
          >
            <span>📋</span>
            My Posted Rides
          </button>
        </div>
      )}

      {activeMenu === "rentals" && (
        <div className="bottom-popup">
          <button
            onClick={() =>
              handleMenuClick("rental-vehicles")
            }
          >
            <span>🚙</span>
            Post Rental
          </button>

          <button
            onClick={() =>
              handleMenuClick("rental-vehicles")
            }
          >
            <span>🔍</span>
            Search Rental
          </button>

          <button
            onClick={() =>
              handleMenuClick("my-rentals")
            }
          >
            <span>🚘</span>
            My Rentals
          </button>

          <button
            onClick={() =>
              handleMenuClick("rental-booking-history")
            }
          >
            <span>📋</span>
            Rental Bookings
          </button>
        </div>
      )}

      {activeMenu === "profile" && (
        <div className="bottom-popup profile-popup">

          <button
            onClick={() =>
              handleMenuClick("my-profile")
            }
          >
            <span>👤</span>
            My Profile
          </button>

          <button
            onClick={() =>
              handleMenuClick("my-activity")
            }
          >
            <span>📊</span>
            My Activity
          </button>

          <button
            onClick={() =>
              handleMenuClick("settings")
            }
          >
            <span>⚙️</span>
            Settings
          </button>

          <button
            className="popup-logout"
            onClick={handleLogout}
          >
            <span>🚪</span>
            Logout
          </button>

        </div>
      )}

      <nav className="bottom-navigation">

        <button
          className={
            activeSection === "dashboard"
              ? "bottom-nav-item active"
              : "bottom-nav-item"
          }
          onClick={() =>
            handleMenuClick("dashboard")
          }
        >
          <span className="nav-icon">⌂</span>
          <span>Home</span>
        </button>

        <button
          className={
            activeMenu === "rides"
              ? "bottom-nav-item active"
              : "bottom-nav-item"
          }
          onClick={() =>
            handleBottomMenu("rides")
          }
        >
          <span className="nav-icon">🚗</span>
          <span>Rides</span>
        </button>

        <button
          className={
            activeMenu === "rentals"
              ? "bottom-nav-item active"
              : "bottom-nav-item"
          }
          onClick={() =>
            handleBottomMenu("rentals")
          }
        >
          <span className="nav-icon">🚙</span>
          <span>Rentals</span>
        </button>

        <button
          className={
            activeSection === "my-bookings"
              ? "bottom-nav-item active"
              : "bottom-nav-item"
          }
          onClick={() =>
            handleMenuClick("my-bookings")
          }
        >
          <span className="nav-icon">📋</span>
          <span>Bookings</span>
        </button>

        <button
          className={
            activeMenu === "profile"
              ? "bottom-nav-item active"
              : "bottom-nav-item"
          }
          onClick={() =>
            handleBottomMenu("profile")
          }
        >
          <span className="nav-icon">👤</span>
          <span>Profile</span>
        </button>

      </nav>

    </div>
  );
}

export default Dashboard;