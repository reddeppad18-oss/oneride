
import { useEffect, useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Bell,
  Home,
  CarFront,
  Search,
  ClipboardList,
  KeyRound,
  UserRound,
  Settings as SettingsIcon,
  Activity,
  Handshake,
  History,
  MessageCircle,
} from "lucide-react";

import { getUnreadCount } from "../api/notificationService";

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeMenu, setActiveMenu] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Theme synchronization
// Theme synchronization
useEffect(() => {
  const applySavedTheme = () => {
    const savedTheme =
      localStorage.getItem("alrides-theme") || "system";

    document.documentElement.setAttribute(
      "data-theme",
      savedTheme
    );

    document.documentElement.style.colorScheme =
      savedTheme === "dark"
        ? "dark"
        : savedTheme === "light"
        ? "light"
        : "light dark";
  };

  applySavedTheme();

  window.addEventListener("storage", applySavedTheme);

  return () => {
    window.removeEventListener("storage", applySavedTheme);
  };
}, []);

  // Load unread notification count
  const loadUnreadCount = async () => {
    try {
      const count = await getUnreadCount();

      setUnreadCount(
        typeof count === "number" ? count : 0
      );
    } catch (error) {
      console.error(
        "Failed to load notification count:",
        error
      );
    }
  };

  // Refresh notifications every 30 seconds
  useEffect(() => {
    loadUnreadCount();

    const interval = setInterval(
      loadUnreadCount,
      30000
    );

    return () => clearInterval(interval);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/", {
      replace: true,
    });
  };

  // Navigation helpers
  const navigateTo = (path) => {
    setActiveMenu(null);
    navigate(path);
  };

  const handleBottomMenu = (menu) => {
    setActiveMenu((current) =>
      current === menu ? null : menu
    );
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isRouteActive = (paths) => {
    return paths.some((path) =>
      location.pathname.startsWith(path)
    );
  };

  const handleNotifications = () => {
    setActiveMenu(null);
    navigate("/notifications");
  };

  const handleChat = () => {
    setActiveMenu(null);
    navigate("/chat");
  };

  return (
    <div className="dashboard-layout">

      {/* MOBILE APP HEADER */}
      <header
        className="mobile-app-header"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {/* APP BRAND */}
        <div
          className="app-brand"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flex: "1 1 auto",
            minWidth: 0,
          }}
        >
          <div className="app-logo">A</div>

          <div>
            <h2>Alridez</h2>
            <span>Ride Sharing Made Easy</span>
          </div>
        </div>

        {/* HEADER ACTIONS */}
        <div
          className="header-actions"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "12px",
            flexShrink: 0,
            marginLeft: "auto",
          }}
        >
          {/* CHAT BUTTON */}
          <button
            type="button"
            className="notification-header-button"
            onClick={handleChat}
            aria-label="Chat messages"
            title="Messages"
          >
            <MessageCircle size={23} />
          </button>

          {/* NOTIFICATIONS BUTTON */}
          <button
            type="button"
            className="notification-header-button"
            onClick={handleNotifications}
            aria-label={`Notifications${
              unreadCount > 0
                ? `, ${unreadCount} unread`
                : ""
            }`}
            title="Notifications"
          >
            <Bell size={23} />

            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* MAIN PAGE CONTENT */}
      <main className="dashboard-content">
        <Outlet />
      </main>

      {/* RIDES MENU */}
      {activeMenu === "rides" && (
        <div className="bottom-popup">

          <button
            type="button"
            onClick={() =>
              navigateTo("/post-ride")
            }
          >
            <CarFront size={19} />
            Post Ride
          </button>

          <button
            type="button"
            onClick={() =>
              navigateTo("/search-rides")
            }
          >
            <Search size={19} />
            Search Rides
          </button>

          <button
            type="button"
            onClick={() =>
              navigateTo("/my-rides")
            }
          >
            <ClipboardList size={19} />
            My Posted Rides
          </button>

          <button
            type="button"
            onClick={() =>
              navigateTo("/my-ride-requests")
            }
          >
            <History size={19} />
            My Ride Requests
          </button>

          <button
            type="button"
            onClick={() =>
              navigateTo("/provider-ride-requests")
            }
          >
            <Handshake size={19} />
            Provider Ride Requests
          </button>

        </div>
      )}

      {/* RENTALS MENU */}
      {activeMenu === "rentals" && (
        <div className="bottom-popup">

          <button
            type="button"
            onClick={() =>
              navigateTo("/post-rental-vehicle")
            }
          >
            <KeyRound size={19} />
            Post Rental Vehicle
          </button>

          <button
            type="button"
            onClick={() =>
              navigateTo("/rental-vehicles")
            }
          >
            <Search size={19} />
            Search Rental Vehicles
          </button>

          <button
            type="button"
            onClick={() =>
              navigateTo("/my-rentals")
            }
          >
            <CarFront size={19} />
            My Rental Vehicles
          </button>

          <button
            type="button"
            onClick={() =>
              navigateTo("/rental-booking-history")
            }
          >
            <ClipboardList size={19} />
            Rental Booking History
          </button>

        </div>
      )}

      {/* PROFILE MENU */}
      {activeMenu === "profile" && (
        <div className="bottom-popup profile-popup">

          <button
            type="button"
            onClick={() =>
              navigateTo("/my-profile")
            }
          >
            <UserRound size={19} />
            My Profile
          </button>

          <button
            type="button"
            onClick={() =>
              navigateTo("/my-activity")
            }
          >
            <Activity size={19} />
            My Activity
          </button>

          <button
            type="button"
            onClick={() =>
              navigateTo("/settings")
            }
          >
            <SettingsIcon size={19} />
            Settings
          </button>

          <button
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>
      )}

      {/* BOTTOM NAVIGATION */}
      <nav className="bottom-navigation">

        {/* HOME */}
        <button
          type="button"
          className={
            isActive("/dashboard")
              ? "bottom-nav-item active"
              : "bottom-nav-item"
          }
          onClick={() =>
            navigateTo("/dashboard")
          }
        >
          <Home size={22} />
          <span>Home</span>
        </button>

        {/* RIDES */}
        <button
          type="button"
          className={
            activeMenu === "rides" ||
            isRouteActive([
              "/post-ride",
              "/search-rides",
              "/my-rides",
              "/my-ride-requests",
              "/provider-ride-requests",
            ])
              ? "bottom-nav-item active"
              : "bottom-nav-item"
          }
          onClick={() =>
            handleBottomMenu("rides")
          }
        >
          <CarFront size={22} />
          <span>Rides</span>
        </button>

        {/* RENTALS */}
        <button
          type="button"
          className={
            activeMenu === "rentals" ||
            isRouteActive([
              "/post-rental-vehicle",
              "/rental-vehicles",
              "/my-rentals",
              "/rental-booking",
              "/rental-booking-history",
              "/rental-booking-requests",
            ])
              ? "bottom-nav-item active"
              : "bottom-nav-item"
          }
          onClick={() =>
            handleBottomMenu("rentals")
          }
        >
          <KeyRound size={22} />
          <span>Rentals</span>
        </button>

        {/* BOOKINGS */}
        <button
          type="button"
          className={
            isRouteActive([
              "/my-bookings",
              "/ride-bookings",
            ])
              ? "bottom-nav-item active"
              : "bottom-nav-item"
          }
          onClick={() =>
            navigateTo("/my-bookings")
          }
        >
          <ClipboardList size={22} />
          <span>Bookings</span>
        </button>

        {/* MESSAGES */}
        <button
          type="button"
          className={
            isActive("/chat")
              ? "bottom-nav-item active"
              : "bottom-nav-item"
          }
          onClick={handleChat}
        >
          <MessageCircle size={22} />
          <span>Messages</span>
        </button>

        {/* PROFILE */}
        <button
          type="button"
          className={
            activeMenu === "profile" ||
            isRouteActive([
              "/my-profile",
              "/my-activity",
              "/settings",
            ])
              ? "bottom-nav-item active"
              : "bottom-nav-item"
          }
          onClick={() =>
            handleBottomMenu("profile")
          }
        >
          <UserRound size={22} />
          <span>Profile</span>
        </button>

      </nav>
    </div>
  );
}

export default DashboardLayout;
