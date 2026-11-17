
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
  FiMonitor,
  FiSun,
  FiMoon,
} from "react-icons/fi";

import api from "../api/axios";

// ======================================================
// THEME UTILITIES
// ======================================================

const THEME_KEY = "alrides-theme";

const getSavedTheme = () => {
  const savedTheme = localStorage.getItem(THEME_KEY);

  return ["light", "dark", "system"].includes(savedTheme)
    ? savedTheme
    : "system";
};

const applyGlobalTheme = (selectedTheme) => {
  const root = document.documentElement;

  root.setAttribute("data-theme", selectedTheme);

  root.style.colorScheme =
    selectedTheme === "dark"
      ? "dark"
      : selectedTheme === "light"
      ? "light"
      : "light dark";
};

// ======================================================
// SETTINGS COMPONENT
// ======================================================

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [bookingNotifications, setBookingNotifications] = useState(true);
  const [rideNotifications, setRideNotifications] = useState(true);
  const [language, setLanguage] = useState("English");

  const [theme, setTheme] = useState(getSavedTheme);

  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ======================================================
  // SUCCESS MESSAGE
  // ======================================================

  const showSuccess = (message) => {
    setSuccess(message);

    setTimeout(() => {
      setSuccess("");
    }, 2500);
  };

  // ======================================================
  // APPLY THEME
  // ======================================================

  const applyTheme = (selectedTheme) => {
    if (!["light", "dark", "system"].includes(selectedTheme)) {
      return;
    }

    setTheme(selectedTheme);

    localStorage.setItem(THEME_KEY, selectedTheme);

    applyGlobalTheme(selectedTheme);

    const themeName =
      selectedTheme === "system"
        ? "System"
        : selectedTheme === "light"
        ? "Light"
        : "Dark";

    showSuccess(`${themeName} mode enabled.`);
  };

  // ======================================================
  // INITIALIZE THEME
  // ======================================================

  useEffect(() => {
    const savedTheme = getSavedTheme();

    setTheme(savedTheme);
    applyGlobalTheme(savedTheme);
  }, []);

  // ======================================================
  // LOAD SETTINGS
  // ======================================================

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/user/settings");
      const data = response.data;

      setNotifications(data.notificationsEnabled ?? true);
      setBookingNotifications(
        data.bookingNotificationsEnabled ?? true
      );
      setRideNotifications(
        data.rideNotificationsEnabled ?? true
      );
      setLanguage(data.language || "English");
    } catch (err) {
      console.error("Failed to load settings:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load your settings."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // SAVE SETTINGS
  // ======================================================

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

      await api.put("/user/settings", {
        notificationsEnabled,
        bookingNotificationsEnabled,
        rideNotificationsEnabled,
        language: selectedLanguage,
      });

      showSuccess(successMessage);
    } catch (err) {
      console.error("Failed to save settings:", err);

      setError(
        err.response?.data?.message ||
        "Unable to save your settings."
      );

      await loadSettings();
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // MASTER NOTIFICATION
  // ======================================================

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
        successMessage: "Notifications disabled.",
      });
    } else {
      await saveSettings({
        notificationsEnabled: true,
        bookingNotificationsEnabled: bookingNotifications,
        rideNotificationsEnabled: rideNotifications,
        selectedLanguage: language,
        successMessage: "Notifications enabled.",
      });
    }
  };

  // ======================================================
  // BOOKING NOTIFICATIONS
  // ======================================================

  const handleBookingNotificationToggle = async () => {
    if (!notifications) return;

    const newValue = !bookingNotifications;

    setBookingNotifications(newValue);

    await saveSettings({
      notificationsEnabled: notifications,
      bookingNotificationsEnabled: newValue,
      rideNotificationsEnabled: rideNotifications,
      selectedLanguage: language,
      successMessage: newValue
        ? "Booking notifications enabled."
        : "Booking notifications disabled.",
    });
  };

  // ======================================================
  // RIDE NOTIFICATIONS
  // ======================================================

  const handleRideNotificationToggle = async () => {
    if (!notifications) return;

    const newValue = !rideNotifications;

    setRideNotifications(newValue);

    await saveSettings({
      notificationsEnabled: notifications,
      bookingNotificationsEnabled: bookingNotifications,
      rideNotificationsEnabled: newValue,
      selectedLanguage: language,
      successMessage: newValue
        ? "Ride notifications enabled."
        : "Ride notifications disabled.",
    });
  };

  // ======================================================
  // LANGUAGE
  // ======================================================

  const handleLanguageChange = async (event) => {
    const value = event.target.value;

    setLanguage(value);

    await saveSettings({
      notificationsEnabled: notifications,
      bookingNotificationsEnabled: bookingNotifications,
      rideNotificationsEnabled: rideNotifications,
      selectedLanguage: value,
      successMessage: `Language changed to ${value}.`,
    });
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) return;

    localStorage.removeItem("token");

    window.location.href = "/";
  };

  // ======================================================
  // LOADING
  // ======================================================

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

  // ======================================================
  // MAIN UI
  // ======================================================

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Settings</h1>
        <p style={styles.subtitle}>
          Manage your Alridez preferences and account settings.
        </p>
      </div>

      {success && (
        <div style={styles.successBox}>
          <FiCheck size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div style={styles.errorBox}>
          <span>{error}</span>
        </div>
      )}

      {saving && (
        <div style={styles.savingBox}>
          Saving settings...
        </div>
      )}

      {/* NOTIFICATIONS */}

      <section style={styles.section}>
        <SectionHeader
          icon={<FiBell size={21} />}
          title="Notifications"
          description="Choose which notifications you want to receive."
        />

        <SettingRow
          title="Push Notifications"
          description="Receive notifications from Alridez."
          enabled={notifications}
          onToggle={handleNotificationToggle}
          disabled={saving}
        />

        <SettingRow
          title="Booking Notifications"
          description="Get updates about your ride and rental bookings."
          enabled={bookingNotifications}
          onToggle={handleBookingNotificationToggle}
          disabled={!notifications || saving}
        />

        <SettingRow
          title="Ride Notifications"
          description="Receive updates about rides you have posted or joined."
          enabled={rideNotifications}
          onToggle={handleRideNotificationToggle}
          disabled={!notifications || saving}
        />
      </section>

      {/* APPEARANCE */}

      <section style={styles.section}>
        <SectionHeader
          icon={<FiSettings size={21} />}
          title="Appearance"
          description="Choose how Alridez looks on your device."
        />

        <div style={styles.themeContainer}>
          <ThemeOption
            selected={theme === "system"}
            icon={<FiMonitor size={20} />}
            title="System"
            description="Follow your device theme"
            onClick={() => applyTheme("system")}
          />

          <ThemeOption
            selected={theme === "light"}
            icon={<FiSun size={20} />}
            title="Light"
            description="Always use light mode"
            onClick={() => applyTheme("light")}
          />

          <ThemeOption
            selected={theme === "dark"}
            icon={<FiMoon size={20} />}
            title="Dark"
            description="Always use dark mode"
            onClick={() => applyTheme("dark")}
          />
        </div>
      </section>

      {/* PRIVACY & SECURITY */}

      <section style={styles.section}>
        <SectionHeader
          icon={<FiShield size={21} />}
          title="Privacy & Security"
          description="Information about your account security."
        />

        <NavigationRow
          title="Account Security"
          description="Your account uses phone OTP authentication and JWT security."
        />

        <div style={styles.navigationRow}>
          <div style={styles.navigationText}>
            <strong style={styles.rowTitle}>
              Phone Verification
            </strong>
            <span style={styles.rowDescription}>
              Your phone number is used to securely authenticate your account.
            </span>
          </div>
          <span style={styles.verifiedBadge}>Verified</span>
        </div>
      </section>

      {/* LANGUAGE */}

      <section style={styles.section}>
        <SectionHeader
          icon={<FiGlobe size={21} />}
          title="Language"
          description="Choose your preferred application language."
        />

        <div style={styles.languageRow}>
          <div style={styles.navigationText}>
            <strong style={styles.rowTitle}>App Language</strong>
            <span style={styles.rowDescription}>
              Select the language used by Alridez.
            </span>
          </div>

          <select
            value={language}
            onChange={handleLanguageChange}
            disabled={saving}
            style={styles.languageSelect}
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Telugu">Telugu</option>
            <option value="Tamil">Tamil</option>
            <option value="Kannada">Kannada</option>
          </select>
        </div>
      </section>

      {/* APP PREFERENCES */}

      <section style={styles.section}>
        <SectionHeader
          icon={<FiSettings size={21} />}
          title="App Preferences"
          description="Manage your Alridez application preferences."
        />

        <ClickableRow
          title="Ride Preferences"
          description="Configure your preferred ride options."
          onClick={() =>
            showSuccess("Ride preferences will be available soon.")
          }
        />

        <ClickableRow
          title="Data Usage"
          description="Manage how the application uses network data."
          onClick={() =>
            showSuccess("Data usage settings will be available soon.")
          }
        />
      </section>

      {/* HELP & SUPPORT */}

      <section style={styles.section}>
        <SectionHeader
          icon={<FiHelpCircle size={21} />}
          title="Help & Support"
          description="Need help? Find answers or contact Alridez support."
        />

        <ClickableRow
          title="Help Center"
          description="Find answers to common questions."
          onClick={() =>
            showSuccess("Help Center will be available soon.")
          }
        />

        <ClickableRow
          title="Contact Support"
          description="Contact the Alridez support team."
          onClick={() =>
            showSuccess("Contact Support will be available soon.")
          }
        />
      </section>

      {/* ABOUT */}

      <section style={styles.section}>
        <SectionHeader
          icon={<FiInfo size={21} />}
          title="About Alridez"
          description="Information about the Alridez application."
        />

        <div style={styles.infoRow}>
          <span style={styles.rowTitle}>App Name</span>
          <span style={styles.infoValue}>Alridez</span>
        </div>

        <div style={styles.infoRow}>
          <span style={styles.rowTitle}>Version</span>
          <span style={styles.infoValue}>1.0.0</span>
        </div>

        <ClickableRow
          title="Terms & Conditions"
          description="Review the terms for using Alridez."
          onClick={() =>
            showSuccess("Terms & Conditions will be available soon.")
          }
        />

        <ClickableRow
          title="Privacy Policy"
          description="Learn how Alridez handles your information."
          onClick={() =>
            showSuccess("Privacy Policy will be available soon.")
          }
        />
      </section>

      {/* ACCOUNT */}

      <section style={styles.dangerSection}>
        <SectionHeader
          icon={<span>⚠️</span>}
          title="Account"
          description="Manage your Alridez account."
          danger
        />

        <div style={styles.deleteRow}>
          <div style={styles.navigationText}>
            <strong style={styles.deleteTitle}>Delete Account</strong>
            <span style={styles.rowDescription}>
              Permanently delete your Alridez account and associated data.
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              showSuccess("Account deletion will be available soon.")
            }
            style={styles.deleteButton}
          >
            Delete Account
          </button>
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

// ======================================================
// REUSABLE COMPONENTS
// ======================================================

const SectionHeader = ({
  icon,
  title,
  description,
  danger = false,
}) => (
  <div style={styles.sectionHeader}>
    <div style={danger ? styles.dangerIcon : styles.sectionIcon}>
      {icon}
    </div>

    <div>
      <h2 style={danger ? styles.dangerTitle : styles.sectionTitle}>
        {title}
      </h2>
      <p style={styles.sectionDescription}>{description}</p>
    </div>
  </div>
);

const SettingRow = ({
  title,
  description,
  enabled,
  onToggle,
  disabled = false,
}) => (
  <div
    style={{
      ...styles.settingRow,
      ...(disabled ? styles.disabledRow : {}),
    }}
  >
    <div style={styles.navigationText}>
      <strong style={styles.rowTitle}>{title}</strong>
      <span style={styles.rowDescription}>{description}</span>
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
        ...(disabled ? styles.toggleDisabledRow : {}),
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

const ThemeOption = ({
  selected,
  icon,
  title,
  description,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      ...styles.themeOption,
      ...(selected ? styles.themeOptionSelected : {}),
    }}
    aria-pressed={selected}
  >
    <div
      style={{
        ...styles.themeIcon,
        ...(selected ? styles.themeIconSelected : {}),
      }}
    >
      {icon}
    </div>

    <div style={styles.themeText}>
      <strong style={styles.rowTitle}>{title}</strong>
      <span style={styles.rowDescription}>{description}</span>
    </div>

    <div style={styles.themeCheck}>
      {selected && <FiCheck size={18} />}
    </div>
  </button>
);

const NavigationRow = ({ title, description }) => (
  <div style={styles.navigationRow}>
    <div style={styles.navigationText}>
      <strong style={styles.rowTitle}>{title}</strong>
      <span style={styles.rowDescription}>{description}</span>
    </div>
    <FiChevronRight
      size={20}
      color="var(--settings-secondary)"
    />
  </div>
);

const ClickableRow = ({ title, description, onClick }) => (
  <div style={styles.clickableRow} onClick={onClick}>
    <div style={styles.navigationText}>
      <strong style={styles.rowTitle}>{title}</strong>
      <span style={styles.rowDescription}>{description}</span>
    </div>
    <FiChevronRight
      size={20}
      color="var(--settings-secondary)"
    />
  </div>
);

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
    color: "var(--settings-text)",
  },

  header: {
    marginBottom: "25px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "700",
    color: "var(--settings-text)",
  },

  subtitle: {
    marginTop: "8px",
    color: "var(--settings-secondary)",
    fontSize: "15px",
    lineHeight: "1.6",
  },

  loadingBox: {
    background: "var(--settings-card)",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center",
    boxShadow: "0 4px 18px var(--settings-shadow)",
  },

  loadingText: {
    color: "var(--settings-secondary)",
    fontSize: "15px",
  },

  savingBox: {
    marginBottom: "15px",
    padding: "10px 14px",
    borderRadius: "8px",
    background: "var(--settings-info-bg)",
    border: "1px solid var(--settings-info-border)",
    color: "var(--settings-info-text)",
    fontSize: "14px",
  },

  successBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "20px",
    padding: "12px 16px",
    borderRadius: "8px",
    background: "var(--settings-success-bg)",
    border: "1px solid var(--settings-success-border)",
    color: "var(--settings-success-text)",
    fontSize: "14px",
    fontWeight: "500",
  },

  errorBox: {
    marginBottom: "20px",
    padding: "12px 16px",
    borderRadius: "8px",
    background: "var(--settings-error-bg)",
    border: "1px solid var(--settings-error-border)",
    color: "var(--settings-error-text)",
    fontSize: "14px",
    fontWeight: "500",
  },

  section: {
    background: "var(--settings-card)",
    borderRadius: "16px",
    marginBottom: "20px",
    padding: "24px",
    boxShadow: "0 4px 18px var(--settings-shadow)",
    border: "1px solid var(--settings-border)",
    transition: "background-color 0.25s ease, border-color 0.25s ease",
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
    background: "var(--settings-icon-bg)",
    color: "var(--settings-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
    color: "var(--settings-text)",
  },

  sectionDescription: {
    margin: "5px 0 0",
    color: "var(--settings-secondary)",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  settingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    padding: "18px 0",
    borderTop: "1px solid var(--settings-border)",
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
    borderTop: "1px solid var(--settings-border)",
  },

  clickableRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    padding: "18px 0",
    borderTop: "1px solid var(--settings-border)",
    cursor: "pointer",
  },

  navigationText: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    flex: 1,
  },

  rowTitle: {
    color: "var(--settings-text)",
    fontSize: "15px",
    fontWeight: "600",
  },

  rowDescription: {
    color: "var(--settings-secondary)",
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
    background: "#9ca3af",
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
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
  },

  toggleCircleEnabled: {
    left: "25px",
  },

  toggleCircleDisabled: {
    left: "3px",
  },

  themeContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "15px",
  },

  themeOption: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid var(--settings-border)",
    background: "var(--settings-theme-option-bg)",
    color: "var(--settings-text)",
    textAlign: "left",
    cursor: "pointer",
    transition: "background-color 0.2s ease, border-color 0.2s ease",
  },

  themeOptionSelected: {
    border: "1px solid var(--settings-primary)",
    background: "var(--settings-theme-selected-bg)",
  },

  themeIcon: {
    width: "42px",
    height: "42px",
    minWidth: "42px",
    borderRadius: "10px",
    background: "var(--settings-icon-bg)",
    color: "var(--settings-secondary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  themeIconSelected: {
    color: "var(--settings-primary)",
  },

  themeText: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: 1,
  },

  themeCheck: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    color: "var(--settings-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  languageRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    paddingTop: "18px",
    borderTop: "1px solid var(--settings-border)",
  },

  languageSelect: {
    padding: "9px 35px 9px 12px",
    borderRadius: "8px",
    border: "1px solid var(--settings-input-border)",
    background: "var(--settings-input-bg)",
    color: "var(--settings-text)",
    fontSize: "14px",
    cursor: "pointer",
    outline: "none",
  },

  verifiedBadge: {
    padding: "5px 10px",
    borderRadius: "20px",
    background: "var(--settings-success-bg)",
    color: "var(--settings-success-text)",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  infoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 0",
    borderTop: "1px solid var(--settings-border)",
  },

  infoValue: {
    color: "var(--settings-secondary)",
    fontSize: "14px",
    fontWeight: "500",
  },

  dangerSection: {
    background: "var(--settings-card)",
    borderRadius: "16px",
    marginBottom: "20px",
    padding: "24px",
    border: "1px solid var(--settings-danger-border)",
    boxShadow: "0 4px 18px var(--settings-shadow)",
  },

  dangerIcon: {
    width: "42px",
    height: "42px",
    minWidth: "42px",
    borderRadius: "10px",
    background: "var(--settings-danger-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  dangerTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
    color: "var(--settings-danger)",
  },

  deleteRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    paddingTop: "18px",
    borderTop: "1px solid var(--settings-danger-border)",
  },

  deleteTitle: {
    color: "var(--settings-danger)",
    fontSize: "15px",
    fontWeight: "600",
  },

  deleteButton: {
    border: "none",
    borderRadius: "8px",
    padding: "10px 15px",
    background: "var(--settings-danger)",
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
    border: "1px solid var(--settings-danger-border)",
    background: "var(--settings-card)",
    color: "var(--settings-danger)",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.2s",
  },
};

export default Settings;
