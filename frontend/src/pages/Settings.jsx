import React, { useEffect, useState } from "react";
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

import api from "../api/axios";

const Settings = () => {

  // =========================
  // SETTINGS STATE
  // =========================

  const [notifications, setNotifications] = useState(true);

  const [bookingNotifications, setBookingNotifications] =
    useState(true);

  const [rideNotifications, setRideNotifications] =
    useState(true);

  const [language, setLanguage] = useState("English");

  // =========================
  // UI STATE
  // =========================

  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // =========================
  // SUCCESS MESSAGE
  // =========================

  const showSuccess = (message) => {
    setSuccess(message);

    setTimeout(() => {
      setSuccess("");
    }, 2500);
  };

  // =========================
  // LOAD SETTINGS
  // =========================

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await api.get("/user/settings");

      const data = response.data;

      setNotifications(
        data.notificationsEnabled ?? true
      );

      setBookingNotifications(
        data.bookingNotificationsEnabled ?? true
      );

      setRideNotifications(
        data.rideNotificationsEnabled ?? true
      );

      setLanguage(
        data.language || "English"
      );

    } catch (err) {

      console.error(
        "Failed to load settings:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to load your settings."
      );

    } finally {

      setLoading(false);

    }
  };

  // =========================
  // SAVE SETTINGS
  // =========================

  const saveSettings = async ({
    notificationsEnabled = notifications,
    bookingNotificationsEnabled = bookingNotifications,
    rideNotificationsEnabled = rideNotifications,
    selectedLanguage = language,
    successMessage = "Settings updated successfully.",
  }) => {

    try {

      setSaving(true);
      setError("");

      await api.put(
        "/user/settings",
        {
          notificationsEnabled,
          bookingNotificationsEnabled,
          rideNotificationsEnabled,
          language: selectedLanguage,
        }
      );

      showSuccess(successMessage);

    } catch (err) {

      console.error(
        "Failed to save settings:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to save your settings."
      );

      // Reload saved values from backend
      await loadSettings();

    } finally {

      setSaving(false);

    }
  };

  // =========================
  // MASTER NOTIFICATION
  // =========================

  const handleNotificationToggle = async () => {

    const newValue = !notifications;

    setNotifications(newValue);

    if (!newValue) {

      setBookingNotifications(false);
      setRideNotifications(false);

      await saveSettings({
        notificationsEnabled: false,
        bookingNotificationsEnabled: false,
        rideNotificationsEnabled: false,
        selectedLanguage: language,
        successMessage:
          "Notifications disabled.",
      });

    } else {

      await saveSettings({
        notificationsEnabled: true,
        bookingNotificationsEnabled:
          bookingNotifications,
        rideNotificationsEnabled:
          rideNotifications,
        selectedLanguage: language,
        successMessage:
          "Notifications enabled.",
      });

    }
  };

  // =========================
  // BOOKING NOTIFICATIONS
  // =========================

  const handleBookingNotificationToggle =
    async () => {

      if (!notifications) {
        return;
      }

      const newValue =
        !bookingNotifications;

      setBookingNotifications(newValue);

      await saveSettings({
        notificationsEnabled: notifications,
        bookingNotificationsEnabled: newValue,
        rideNotificationsEnabled:
          rideNotifications,
        selectedLanguage: language,
        successMessage:
          newValue
            ? "Booking notifications enabled."
            : "Booking notifications disabled.",
      });

    };

  // =========================
  // RIDE NOTIFICATIONS
  // =========================

  const handleRideNotificationToggle =
    async () => {

      if (!notifications) {
        return;
      }

      const newValue =
        !rideNotifications;

      setRideNotifications(newValue);

      await saveSettings({
        notificationsEnabled: notifications,
        bookingNotificationsEnabled:
          bookingNotifications,
        rideNotificationsEnabled: newValue,
        selectedLanguage: language,
        successMessage:
          newValue
            ? "Ride notifications enabled."
            : "Ride notifications disabled.",
      });

    };

  // =========================
  // LANGUAGE
  // =========================

  const handleLanguageChange = async (
    event
  ) => {

    const value = event.target.value;

    setLanguage(value);

    await saveSettings({
      notificationsEnabled: notifications,
      bookingNotificationsEnabled:
        bookingNotifications,
      rideNotificationsEnabled:
        rideNotifications,
      selectedLanguage: value,
      successMessage:
        `Language changed to ${value}.`,
    });

  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    const confirmed =
      window.confirm(
        "Are you sure you want to logout?"
      );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem("token");

    window.location.href = "/";

  };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div style={styles.container}>

        <div style={styles.loadingBox}>

          <div style={styles.loadingText}>
            Loading your settings...
          </div>

        </div>

      </div>

    );

  }

  // =========================
  // RETURN
  // =========================

  return (

    <div style={styles.container}>

      {/* =========================
          HEADER
      ========================= */}

      <div style={styles.header}>

        <h1 style={styles.title}>
          Settings
        </h1>

        <p style={styles.subtitle}>
          Manage your Alrides preferences
          and account settings.
        </p>

      </div>


      {/* =========================
          SUCCESS MESSAGE
      ========================= */}

      {success && (

        <div style={styles.successBox}>

          <FiCheck size={18} />

          <span>
            {success}
          </span>

        </div>

      )}


      {/* =========================
          ERROR MESSAGE
      ========================= */}

      {error && (

        <div style={styles.errorBox}>

          <span>
            {error}
          </span>

        </div>

      )}


      {/* =========================
          SAVING MESSAGE
      ========================= */}

      {saving && (

        <div style={styles.savingBox}>
          Saving settings...
        </div>

      )}


      {/* =========================
          NOTIFICATIONS
      ========================= */}

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
              Choose which notifications
              you want to receive.
            </p>

          </div>

        </div>


        <SettingRow
          title="Push Notifications"
          description="Receive notifications from Alrides."
          enabled={notifications}
          onToggle={
            handleNotificationToggle
          }
          disabled={saving}
        />


        <SettingRow
          title="Booking Notifications"
          description="Get updates about your ride and rental bookings."
          enabled={bookingNotifications}
          onToggle={
            handleBookingNotificationToggle
          }
          disabled={
            !notifications || saving
          }
        />


        <SettingRow
          title="Ride Notifications"
          description="Receive updates about rides you have posted or joined."
          enabled={rideNotifications}
          onToggle={
            handleRideNotificationToggle
          }
          disabled={
            !notifications || saving
          }
        />

      </section>


      {/* =========================
          PRIVACY & SECURITY
      ========================= */}

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
              Information about your
              account security.
            </p>

          </div>

        </div>


        <div style={styles.navigationRow}>

          <div style={styles.navigationText}>

            <strong style={styles.rowTitle}>
              Account Security
            </strong>

            <span style={styles.rowDescription}>
              Your account uses phone OTP
              authentication and JWT security.
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
              Phone Verification
            </strong>

            <span style={styles.rowDescription}>
              Your phone number is used to
              securely authenticate your account.
            </span>

          </div>

          <span style={styles.verifiedBadge}>
            Verified
          </span>

        </div>

      </section>


      {/* =========================
          LANGUAGE
      ========================= */}

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
              Choose your preferred
              application language.
            </p>

          </div>

        </div>


        <div style={styles.languageRow}>

          <div style={styles.navigationText}>

            <strong style={styles.rowTitle}>
              App Language
            </strong>

            <span style={styles.rowDescription}>
              Select the language used
              by Alrides.
            </span>

          </div>


          <select
            value={language}
            onChange={
              handleLanguageChange
            }
            disabled={saving}
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


      {/* =========================
          APP PREFERENCES
      ========================= */}

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
              Manage your Alrides
              application preferences.
            </p>

          </div>

        </div>


        <div
          style={styles.clickableRow}
          onClick={() =>
            showSuccess(
              "Ride preferences will be available soon."
            )
          }
        >

          <div style={styles.navigationText}>

            <strong style={styles.rowTitle}>
              Ride Preferences
            </strong>

            <span style={styles.rowDescription}>
              Configure your preferred
              ride options.
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
              "Data usage settings will be available soon."
            )
          }
        >

          <div style={styles.navigationText}>

            <strong style={styles.rowTitle}>
              Data Usage
            </strong>

            <span style={styles.rowDescription}>
              Manage how the application
              uses network data.
            </span>

          </div>

          <FiChevronRight
            size={20}
            color="#9ca3af"
          />

        </div>

      </section>


      {/* =========================
          HELP & SUPPORT
      ========================= */}

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
              Need help? Find answers or
              contact Alrides support.
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
              Find answers to common
              questions.
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
              Contact the Alrides
              support team.
            </span>

          </div>

          <FiChevronRight
            size={20}
            color="#9ca3af"
          />

        </div>

      </section>


      {/* =========================
          ABOUT ALRIDES
      ========================= */}

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
              Information about the
              Alrides application.
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
              Review the terms for using
              Alrides.
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
              Learn how Alrides handles
              your information.
            </span>

          </div>

          <FiChevronRight
            size={20}
            color="#9ca3af"
          />

        </div>

      </section>


      {/* =========================
          ACCOUNT
      ========================= */}

      <section style={styles.dangerSection}>

        <div style={styles.sectionHeader}>

          <div style={styles.dangerIcon}>
            ⚠️
          </div>

          <div>

            <h2 style={styles.dangerTitle}>
              Account
            </h2>

            <p style={styles.sectionDescription}>
              Manage your Alrides account.
            </p>

          </div>

        </div>


        <div style={styles.deleteRow}>

          <div style={styles.navigationText}>

            <strong style={styles.deleteTitle}>
              Delete Account
            </strong>

            <span style={styles.rowDescription}>
              Permanently delete your Alrides
              account and associated data.
            </span>

          </div>


          <button
            type="button"
            onClick={() =>
              showSuccess(
                "Account deletion will be available soon."
              )
            }
            style={styles.deleteButton}
          >
            Delete Account
          </button>

        </div>

      </section>


      {/* =========================
          LOGOUT
      ========================= */}

      <section style={styles.logoutSection}>

        <button
          type="button"
          onClick={handleLogout}
          style={styles.logoutButton}
        >

          <FiLogOut size={19} />

          <span>
            Logout
          </span>

        </button>

      </section>

    </div>

  );
};


// ======================================================
// SETTING ROW COMPONENT
// ======================================================

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


// ======================================================
// STYLES
// ======================================================

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
    lineHeight: "1.6",
  },

  loadingBox: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center",
    boxShadow:
      "0 4px 18px rgba(0, 0, 0, 0.06)",
  },

  loadingText: {
    color: "#6b7280",
    fontSize: "15px",
  },

  savingBox: {
    marginBottom: "15px",
    padding: "10px 14px",
    borderRadius: "8px",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    color: "#1d4ed8",
    fontSize: "14px",
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

  errorBox: {
    marginBottom: "20px",
    padding: "12px 16px",
    borderRadius: "8px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
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
    justifyContent: "center",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
    color: "#1f2937",
  },

  sectionDescription: {
    margin: "5px 0 0",
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  settingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    padding: "18px 0",
    borderTop: "1px solid #f1f5f9",
  },

  disabledRow: {
    opacity: 0.5,
  },

  navigationRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    padding: "18px 0",
    borderTop: "1px solid #f1f5f9",
  },

  clickableRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    padding: "18px 0",
    borderTop: "1px solid #f1f5f9",
    cursor: "pointer",
  },

  navigationText: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    flex: 1,
  },

  rowTitle: {
    color: "#1f2937",
    fontSize: "15px",
    fontWeight: "600",
  },

  rowDescription: {
    color: "#6b7280",
    fontSize: "13px",
    lineHeight: "1.5",
  },

  toggle: {
    position: "relative",
    width: "48px",
    height: "26px",
    minWidth: "48px",
    border: "none",
    borderRadius: "20px",
    padding: 0,
    cursor: "pointer",
    transition: "0.2s",
  },

  toggleEnabled: {
    background: "#4f46e5",
  },

  toggleDisabled: {
    background: "#d1d5db",
  },

  toggleDisabledRow: {
    cursor: "not-allowed",
  },

  toggleCircle: {
    position: "absolute",
    top: "3px",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "#ffffff",
    transition: "0.2s",
    boxShadow:
      "0 1px 3px rgba(0, 0, 0, 0.2)",
  },

  toggleCircleEnabled: {
    left: "25px",
  },

  toggleCircleDisabled: {
    left: "3px",
  },

  languageRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    paddingTop: "18px",
    borderTop: "1px solid #f1f5f9",
  },

  languageSelect: {
    padding: "9px 35px 9px 12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#1f2937",
    fontSize: "14px",
    cursor: "pointer",
    outline: "none",
  },

  verifiedBadge: {
    padding: "5px 10px",
    borderRadius: "20px",
    background: "#dcfce7",
    color: "#15803d",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  infoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 0",
    borderTop: "1px solid #f1f5f9",
  },

  infoValue: {
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: "500",
  },

  dangerSection: {
    background: "#ffffff",
    borderRadius: "16px",
    marginBottom: "20px",
    padding: "24px",
    border: "1px solid #fecaca",
    boxShadow:
      "0 4px 18px rgba(0, 0, 0, 0.04)",
  },

  dangerIcon: {
    width: "42px",
    height: "42px",
    minWidth: "42px",
    borderRadius: "10px",
    background: "#fef2f2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  dangerTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
    color: "#991b1b",
  },

  deleteRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    paddingTop: "18px",
    borderTop: "1px solid #fee2e2",
  },

  deleteTitle: {
    color: "#b91c1c",
    fontSize: "15px",
    fontWeight: "600",
  },

  deleteButton: {
    border: "none",
    borderRadius: "8px",
    padding: "10px 15px",
    background: "#dc2626",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  logoutSection: {
    display: "flex",
    justifyContent: "center",
    padding: "5px 0 30px",
  },

  logoutButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
    maxWidth: "300px",
    padding: "13px 20px",
    borderRadius: "10px",
    border: "1px solid #fecaca",
    background: "#ffffff",
    color: "#dc2626",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.2s",
  },

};

export default Settings;