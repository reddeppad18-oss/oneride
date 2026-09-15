import React, { useState } from "react";
import {
  FiBell,
  FiShield,
  FiGlobe,
  FiSettings,
  FiHelpCircle,
  FiInfo,
  FiLogOut,
  FiChevronRight,
  FiCheck,
} from "react-icons/fi";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [bookingNotifications, setBookingNotifications] =
    useState(true);
  const [rideNotifications, setRideNotifications] =
    useState(true);

  const [language, setLanguage] = useState("English");

  const [showPhoneNumber, setShowPhoneNumber] =
    useState(true);

  const [success, setSuccess] = useState("");

  const showSuccess = (message) => {
    setSuccess(message);

    setTimeout(() => {
      setSuccess("");
    }, 2500);
  };

  const handleNotificationToggle = () => {
    const newValue = !notifications;

    setNotifications(newValue);

    if (!newValue) {
      setBookingNotifications(false);
      setRideNotifications(false);
    }

    showSuccess(
      newValue
        ? "Notifications enabled."
        : "Notifications disabled."
    );
  };

  const handleBookingNotificationToggle = () => {
    const newValue = !bookingNotifications;

    setBookingNotifications(newValue);

    showSuccess(
      newValue
        ? "Booking notifications enabled."
        : "Booking notifications disabled."
    );
  };

  const handleRideNotificationToggle = () => {
    const newValue = !rideNotifications;

    setRideNotifications(newValue);

    showSuccess(
      newValue
        ? "Ride notifications enabled."
        : "Ride notifications disabled."
    );
  };

  const handleLanguageChange = (event) => {
    const value = event.target.value;

    setLanguage(value);

    showSuccess(
      `Language changed to ${value}.`
    );
  };

  const handlePhoneVisibilityToggle = () => {
    const newValue = !showPhoneNumber;

    setShowPhoneNumber(newValue);

    showSuccess(
      newValue
        ? "Phone number visibility enabled."
        : "Phone number visibility disabled."
    );
  };

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem("token");

    window.location.href = "/";
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}

      <div style={styles.header}>
        <h1 style={styles.title}>Settings</h1>

        <p style={styles.subtitle}>
          Manage your Alrides preferences and account
          settings
        </p>
      </div>

      {/* SUCCESS MESSAGE */}

      {success && (
        <div style={styles.successBox}>
          <FiCheck size={18} />

          <span>{success}</span>
        </div>
      )}

      {/* NOTIFICATIONS */}

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionIcon}>
            <FiBell size={21} />
          </div>

          <div>
            <h2 style={styles.sectionTitle}>
              Notifications
            </h2>

            <p style={styles.sectionDescription}>
              Choose which notifications you want to
              receive.
            </p>
          </div>
        </div>

        <SettingRow
          title="Push Notifications"
          description="Receive notifications from Alrides."
          enabled={notifications}
          onToggle={handleNotificationToggle}
        />

        <SettingRow
          title="Booking Notifications"
          description="Get updates about your ride and rental bookings."
          enabled={bookingNotifications}
          onToggle={handleBookingNotificationToggle}
          disabled={!notifications}
        />

        <SettingRow
          title="Ride Notifications"
          description="Receive updates about rides you have posted or joined."
          enabled={rideNotifications}
          onToggle={handleRideNotificationToggle}
          disabled={!notifications}
        />
      </section>

      {/* PRIVACY */}

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionIcon}>
            <FiShield size={21} />
          </div>

          <div>
            <h2 style={styles.sectionTitle}>
              Privacy & Security
            </h2>

            <p style={styles.sectionDescription}>
              Control your privacy and account visibility.
            </p>
          </div>
        </div>

        <SettingRow
          title="Show Phone Number"
          description="Allow other users involved in your rides or bookings to contact you."
          enabled={showPhoneNumber}
          onToggle={handlePhoneVisibilityToggle}
        />

        <div style={styles.navigationRow}>
          <div style={styles.navigationText}>
            <strong style={styles.rowTitle}>
              Account Security
            </strong>

            <span style={styles.rowDescription}>
              Your account uses phone OTP authentication
              and JWT security.
            </span>
          </div>

          <FiChevronRight
            size={20}
            color="#9ca3af"
          />
        </div>
      </section>

      {/* LANGUAGE */}

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionIcon}>
            <FiGlobe size={21} />
          </div>

          <div>
            <h2 style={styles.sectionTitle}>
              Language
            </h2>

            <p style={styles.sectionDescription}>
              Choose your preferred application language.
            </p>
          </div>
        </div>

        <div style={styles.languageRow}>
          <div style={styles.navigationText}>
            <strong style={styles.rowTitle}>
              App Language
            </strong>

            <span style={styles.rowDescription}>
              Select the language used by Alrides.
            </span>
          </div>

          <select
            value={language}
            onChange={handleLanguageChange}
            style={styles.languageSelect}
          >
            <option value="English">
              English
            </option>

            <option value="Hindi">
              Hindi
            </option>

            <option value="Telugu">
              Telugu
            </option>

            <option value="Tamil">
              Tamil
            </option>

            <option value="Kannada">
              Kannada
            </option>
          </select>
        </div>
      </section>

      {/* APP PREFERENCES */}

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionIcon}>
            <FiSettings size={21} />
          </div>

          <div>
            <h2 style={styles.sectionTitle}>
              App Preferences
            </h2>

            <p style={styles.sectionDescription}>
              Manage how Alrides behaves on your device.
            </p>
          </div>
        </div>

        <div style={styles.navigationRow}>
          <div style={styles.navigationText}>
            <strong style={styles.rowTitle}>
              Ride Preferences
            </strong>

            <span style={styles.rowDescription}>
              Your ride and vehicle preferences can be
              configured here.
            </span>
          </div>

          <FiChevronRight
            size={20}
            color="#9ca3af"
          />
        </div>

        <div style={styles.navigationRow}>
          <div style={styles.navigationText}>
            <strong style={styles.rowTitle}>
              Data Usage
            </strong>

            <span style={styles.rowDescription}>
              Manage how the application uses network data.
            </span>
          </div>

          <FiChevronRight
            size={20}
            color="#9ca3af"
          />
        </div>
      </section>

      {/* HELP */}

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionIcon}>
            <FiHelpCircle size={21} />
          </div>

          <div>
            <h2 style={styles.sectionTitle}>
              Help & Support
            </h2>

            <p style={styles.sectionDescription}>
              Need help? Find answers or contact Alrides
              support.
            </p>
          </div>
        </div>

        <div
          style={styles.clickableRow}
          onClick={() =>
            showSuccess(
              "Help Center will be available soon."
            )
          }
        >
          <div style={styles.navigationText}>
            <strong style={styles.rowTitle}>
              Help Center
            </strong>

            <span style={styles.rowDescription}>
              Find answers to common questions.
            </span>
          </div>

          <FiChevronRight
            size={20}
            color="#9ca3af"
          />
        </div>

        <div
          style={styles.clickableRow}
          onClick={() =>
            showSuccess(
              "Contact Support will be available soon."
            )
          }
        >
          <div style={styles.navigationText}>
            <strong style={styles.rowTitle}>
              Contact Support
            </strong>

            <span style={styles.rowDescription}>
              Contact the Alrides support team.
            </span>
          </div>

          <FiChevronRight
            size={20}
            color="#9ca3af"
          />
        </div>
      </section>

      {/* ABOUT */}

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionIcon}>
            <FiInfo size={21} />
          </div>

          <div>
            <h2 style={styles.sectionTitle}>
              About Alrides
            </h2>

            <p style={styles.sectionDescription}>
              Information about the Alrides application.
            </p>
          </div>
        </div>

        <div style={styles.infoRow}>
          <span style={styles.rowTitle}>
            App Name
          </span>

          <span style={styles.infoValue}>
            Alrides
          </span>
        </div>

        <div style={styles.infoRow}>
          <span style={styles.rowTitle}>
            Version
          </span>

          <span style={styles.infoValue}>
            1.0.0
          </span>
        </div>

        <div
          style={styles.clickableRow}
          onClick={() =>
            showSuccess(
              "Terms & Conditions will be available soon."
            )
          }
        >
          <div style={styles.navigationText}>
            <strong style={styles.rowTitle}>
              Terms & Conditions
            </strong>

            <span style={styles.rowDescription}>
              Review the terms for using Alrides.
            </span>
          </div>

          <FiChevronRight
            size={20}
            color="#9ca3af"
          />
        </div>

        <div
          style={styles.clickableRow}
          onClick={() =>
            showSuccess(
              "Privacy Policy will be available soon."
            )
          }
        >
          <div style={styles.navigationText}>
            <strong style={styles.rowTitle}>
              Privacy Policy
            </strong>

            <span style={styles.rowDescription}>
              Learn how Alrides handles your information.
            </span>
          </div>

          <FiChevronRight
            size={20}
            color="#9ca3af"
          />
        </div>
      </section>

      {/* LOGOUT */}

      <section style={styles.logoutSection}>
        <button
          type="button"
          onClick={handleLogout}
          style={styles.logoutButton}
        >
          <FiLogOut size={19} />

          <span>Logout</span>
        </button>
      </section>
    </div>
  );
};

const SettingRow = ({
  title,
  description,
  enabled,
  onToggle,
  disabled = false,
}) => {
  return (
    <div
      style={{
        ...styles.settingRow,
        ...(disabled
          ? styles.disabledRow
          : {}),
      }}
    >
      <div style={styles.navigationText}>
        <strong style={styles.rowTitle}>
          {title}
        </strong>

        <span style={styles.rowDescription}>
          {description}
        </span>
      </div>

      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-label={`Toggle ${title}`}
        style={{
          ...styles.toggle,
          ...(enabled
            ? styles.toggleEnabled
            : styles.toggleDisabled),
          ...(disabled
            ? styles.toggleDisabledRow
            : {}),
        }}
      >
        <span
          style={{
            ...styles.toggleCircle,
            ...(enabled
              ? styles.toggleCircleEnabled
              : styles.toggleCircleDisabled),
          }}
        />
      </button>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
    padding: "30px",
    boxSizing: "border-box",
  },

  header: {
    marginBottom: "25px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "700",
    color: "#1f2937",
  },

  subtitle: {
    marginTop: "8px",
    color: "#6b7280",
    fontSize: "15px",
  },

  successBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "20px",
    padding: "12px 16px",
    borderRadius: "8px",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#15803d",
    fontSize: "14px",
    fontWeight: "500",
  },

  section: {
    background: "#ffffff",
    borderRadius: "16px",
    marginBottom: "20px",
    padding: "24px",
    boxShadow:
      "0 4px 18px rgba(0, 0, 0, 0.06)",
    border: "1px solid #f1f5f9",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    marginBottom: "10px",
  },

  sectionIcon: {
    width: "42px",
    height: "42px",
    minWidth: "42px",
    borderRadius: "10px",
    background: "#eef2ff",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent:
