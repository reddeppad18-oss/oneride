```jsx
import { useEffect, useState } from "react";
import api from "../api/axios";

function MyProfile() {

  const [profile, setProfile] = useState(null);

  const [languages, setLanguages] = useState([]);

  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  // ----------------------------------------
  // Load profile and languages
  // ----------------------------------------

  useEffect(() => {

    const loadData = async () => {

      try {

        setLoading(true);

        setError("");

        // Get current user profile
        const profileResponse =
          await api.get("/user/me");

        setProfile(profileResponse.data);

        // Set already selected languages
        setSelectedLanguages(
          profileResponse.data.languages || []
        );

        // Get available languages
        const languageResponse =
          await api.get("/languages");

        setLanguages(languageResponse.data);

      } catch (err) {

        console.error(
          "Failed to load profile:",
          err
        );

        setError(
          "Failed to load profile. Please try again."
        );

      } finally {

        setLoading(false);
      }
    };

    loadData();

  }, []);

  // ----------------------------------------
  // Handle input changes
  // ----------------------------------------

  const handleChange = (event) => {

    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

  };

  // ----------------------------------------
  // Handle language selection
  // ----------------------------------------

  const handleLanguageChange = (event) => {

    const selectedOptions =
      Array.from(event.target.selectedOptions);

    const selectedNames =
      selectedOptions.map(
        (option) => option.value
      );

    setSelectedLanguages(selectedNames);

  };

  // ----------------------------------------
  // Save profile
  // ----------------------------------------

  const handleSave = async (event) => {

    event.preventDefault();

    try {

      setSaving(true);

      setMessage("");

      setError("");

      const requestData = {

        fullName: profile.fullName,

        city: profile.city,

        aboutMe: profile.aboutMe,

        languages: selectedLanguages,

      };

      await api.put(
        "/user/profile",
        requestData
      );

      // Update local profile
      setProfile((previous) => ({
        ...previous,
        languages: selectedLanguages,
      }));

      setMessage(
        "Profile updated successfully!"
      );

    } catch (err) {

      console.error(
        "Failed to update profile:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to update profile. Please try again."
      );

    } finally {

      setSaving(false);
    }
  };

  // ----------------------------------------
  // Loading state
  // ----------------------------------------

  if (loading) {

    return (
      <div style={styles.container}>

        <div style={styles.loading}>
          Loading profile...
        </div>

      </div>
    );
  }

  // ----------------------------------------
  // Error state
  // ----------------------------------------

  if (!profile) {

    return (
      <div style={styles.container}>

        <div style={styles.error}>
          {error || "Profile not found."}
        </div>

      </div>
    );
  }

  // ----------------------------------------
  // User ID formatting
  // ----------------------------------------

  const alridesUserId =
    `ALR-${String(profile.id).padStart(6, "0")}`;

  return (

    <div style={styles.container}>

      <div style={styles.card}>

        {/* -------------------------------- */}
        {/* Header */}
        {/* -------------------------------- */}

        <div style={styles.header}>

          <div style={styles.avatar}>

            {profile.fullName
              ? profile.fullName
                  .charAt(0)
                  .toUpperCase()
              : "U"}

          </div>

          <div>

            <h1 style={styles.title}>
              My Profile
            </h1>

            <p style={styles.subtitle}>
              Manage your Alrides profile
            </p>

          </div>

        </div>

        {/* -------------------------------- */}
        {/* Messages */}
        {/* -------------------------------- */}

        {message && (
          <div style={styles.success}>
            {message}
          </div>
        )}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {/* -------------------------------- */}
        {/* Profile Form */}
        {/* -------------------------------- */}

        <form onSubmit={handleSave}>

          {/* Full Name */}

          <div style={styles.formGroup}>

            <label style={styles.label}>
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={profile.fullName || ""}
              onChange={handleChange}
              placeholder="Enter your full name"
              style={styles.input}
              required
            />

          </div>

          {/* Phone Number */}

          <div style={styles.formGroup}>

            <label style={styles.label}>
              Phone Number
            </label>

            <input
              type="text"
              value={profile.phoneNumber || ""}
              style={{
                ...styles.input,
                ...styles.readOnly,
              }}
              readOnly
            />

            <small style={styles.helpText}>
              Phone number cannot be changed.
            </small>

          </div>

          {/* Alrides User ID */}

          <div style={styles.formGroup}>

            <label style={styles.label}>
              Alrides User ID
            </label>

            <input
              type="text"
              value={alridesUserId}
              style={{
                ...styles.input,
                ...styles.readOnly,
              }}
              readOnly
            />

            <small style={styles.helpText}>
              Your unique Alrides user ID.
            </small>

          </div>

          {/* Role */}

          <div style={styles.formGroup}>

            <label style={styles.label}>
              Role
            </label>

            <input
              type="text"
              value={profile.role || ""}
              style={{
                ...styles.input,
                ...styles.readOnly,
              }}
              readOnly
            />

          </div>

          {/* City */}

          <div style={styles.formGroup}>

            <label style={styles.label}>
              City
            </label>

            <input
              type="text"
              name="city"
              value={profile.city || ""}
              onChange={handleChange}
              placeholder="Enter your city"
              style={styles.input}
            />

          </div>

          {/* Languages */}

          <div style={styles.formGroup}>

            <label style={styles.label}>
              Languages Spoken
            </label>

            <select
              multiple
              value={selectedLanguages}
              onChange={handleLanguageChange}
              style={styles.multiSelect}
            >

              {languages.map((language) => (

                <option
                  key={language.id}
                  value={language.name}
                >
                  {language.name}
                </option>

              ))}

            </select>

            <small style={styles.helpText}>
              Hold Ctrl and select multiple languages.
            </small>

          </div>

          {/* Selected Languages Preview */}

          {selectedLanguages.length > 0 && (

            <div style={styles.selectedSection}>

              <div style={styles.selectedTitle}>
                Selected Languages
              </div>

              <div style={styles.languageContainer}>

                {selectedLanguages.map(
                  (language) => (

                    <span
                      key={language}
                      style={styles.languageBadge}
                    >
                      {language}
                    </span>

                  )
                )}

              </div>

            </div>

          )}

          {/* About Me */}

          <div style={styles.formGroup}>

            <label style={styles.label}>
              About Me
            </label>

            <textarea
              name="aboutMe"
              value={profile.aboutMe || ""}
              onChange={handleChange}
              placeholder="Tell other Alrides users something about yourself..."
              maxLength={500}
              rows={5}
              style={styles.textarea}
            />

            <small style={styles.helpText}>
              Maximum 500 characters.
            </small>

          </div>

          {/* Rating */}

          <div style={styles.ratingCard}>

            <div>

              <div style={styles.ratingTitle}>
                Your Rating
              </div>

              <div style={styles.ratingValue}>
                ⭐{" "}
                {profile.averageRating
                  ? profile.averageRating.toFixed(1)
                  : "0.0"}
              </div>

            </div>

            <div style={styles.ratingCount}>

              {profile.totalRatings || 0}{" "}
              ratings

            </div>

          </div>

          {/* Save Button */}

          <button
            type="submit"
            disabled={saving}
            style={{
              ...styles.button,
              ...(saving
                ? styles.buttonDisabled
                : {}),
            }}
          >

            {saving
              ? "Saving..."
              : "Save Profile"}

          </button>

        </form>

      </div>

    </div>
  );
}

// ========================================
// Styles
// ========================================

const styles = {

  container: {
    minHeight: "100vh",
    padding: "30px",
    backgroundColor: "#f5f7fb",
  },

  card: {
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "30px",
    boxShadow:
      "0 4px 20px rgba(0, 0, 0, 0.08)",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    marginBottom: "30px",
  },

  avatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "bold",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    color: "#1f2937",
  },

  subtitle: {
    marginTop: "6px",
    marginBottom: 0,
    color: "#6b7280",
  },

  formGroup: {
    marginBottom: "22px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#374151",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
  },

  readOnly: {
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    cursor: "not-allowed",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    resize: "vertical",
    fontFamily: "inherit",
  },

  multiSelect: {
    width: "100%",
    minHeight: "180px",
    padding: "8px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    backgroundColor: "#ffffff",
  },

  helpText: {
    display: "block",
    marginTop: "6px",
    color: "#6b7280",
    fontSize: "13px",
  },

  selectedSection: {
    marginBottom: "22px",
    padding: "15px",
    backgroundColor: "#f9fafb",
    borderRadius: "10px",
  },

  selectedTitle: {
    fontWeight: "600",
    marginBottom: "10px",
    color: "#374151",
  },

  languageContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  languageBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
    fontSize: "13px",
    fontWeight: "600",
  },

  ratingCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px",
    marginBottom: "25px",
    backgroundColor: "#f9fafb",
    borderRadius: "10px",
  },

  ratingTitle: {
    color: "#6b7280",
    fontSize: "14px",
    marginBottom: "5px",
  },

  ratingValue: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#111827",
  },

  ratingCount: {
    color: "#6b7280",
    fontSize: "14px",
  },

  button: {
    width: "100%",
    padding: "13px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  success: {
    marginBottom: "20px",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#dcfce7",
    color: "#166534",
  },

  error: {
    marginBottom: "20px",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },

  loading: {
    textAlign: "center",
    padding: "50px",
    color: "#6b7280",
    fontSize: "18px",
  },
};

export default MyProfile;
```
