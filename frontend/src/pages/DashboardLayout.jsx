import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeMenu, setActiveMenu] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const navigateTo = (path) => {
    setActiveMenu(null);
    navigate(path);
  };

  const handleBottomMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="dashboard-layout">

      {/* =========================
          MOBILE APP HEADER
      ========================= */}

      <header className="mobile-app-header">

        <div className="app-brand">

          <div className="app-logo">
            A
          </div>

          <div>
            <h2>Alrides</h2>
            <span>Ride Sharing Made Easy</span>
          </div>

        </div>

      </header>


      {/* =========================
          PAGE CONTENT
      ========================= */}

      <main className="dashboard-content">

        <Outlet />

      </main>


      {/* =========================
          RIDES POPUP
      ========================= */}

      {activeMenu === "rides" && (

        <div className="bottom-popup">

          <button
            onClick={() =>
              navigateTo("/post-ride")
            }
          >
            <span>🚗</span>
            Post Ride
          </button>

          <button
            onClick={() =>
              navigateTo("/search-rides")
            }
          >
            <span>🔍</span>
            Search Rides
          </button>

          <button
            onClick={() =>
              navigateTo("/my-rides")
            }
          >
            <span>📋</span>
            My Posted Rides
          </button>

        </div>

      )}


      {/* =========================
          RENTALS POPUP
      ========================= */}

      {activeMenu === "rentals" && (

        <div className="bottom-popup">

          <button
            onClick={() =>
              navigateTo("/post-rental-vehicle")
            }
          >
            <span>🚙</span>
            Post Rental
          </button>

          <button
            onClick={() =>
              navigateTo("/rental-vehicles")
            }
          >
            <span>🔍</span>
            Search Rental
          </button>

          <button
            onClick={() =>
              navigateTo("/my-rentals")
            }
          >
            <span>🚘</span>
            My Rentals
          </button>

          <button
            onClick={() =>
              navigateTo("/rental-booking-history")
            }
          >
            <span>📋</span>
            Rental Bookings
          </button>

        </div>

      )}


      {/* =========================
          PROFILE POPUP
      ========================= */}

      {activeMenu === "profile" && (

        <div className="bottom-popup profile-popup">

          <button
            onClick={() =>
              navigateTo("/my-profile")
            }
          >
            <span>👤</span>
            My Profile
          </button>

          <button
            onClick={() =>
              navigateTo("/my-activity")
            }
          >
            <span>📊</span>
            My Activity
          </button>

          <button
            onClick={() =>
              navigateTo("/settings")
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


      {/* =========================
          BOTTOM NAVIGATION
      ========================= */}

      <nav className="bottom-navigation">

        {/* HOME */}

        <button
          className={
            isActive("/dashboard")
              ? "bottom-nav-item active"
              : "bottom-nav-item"
          }
          onClick={() =>
            navigateTo("/dashboard")
          }
        >
          <span className="nav-icon">⌂</span>
          <span>Home</span>
        </button>


        {/* RIDES */}

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


        {/* RENTALS */}

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


        {/* BOOKINGS */}

        <button
          className={
            isActive("/my-bookings")
              ? "bottom-nav-item active"
              : "bottom-nav-item"
          }
          onClick={() =>
            navigateTo("/my-bookings")
          }
        >
          <span className="nav-icon">📋</span>
          <span>Bookings</span>
        </button>


        {/* PROFILE */}

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

export default DashboardLayout;