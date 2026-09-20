import React, { useEffect, useRef, useState } from "react";
import {
  FiCamera,
  FiEdit2,
  FiMapPin,
  FiPhone,
  FiUser,
  FiStar,
  FiTrash2,
  FiX,
  FiCheck,
} from "react-icons/fi";

import api from "../api/axios";

const MyProfile = () => {
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [languages, setLanguages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [deletingPhoto, setDeletingPhoto] = useState(false);

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    city: "",
    aboutMe: "",
    languages: [],
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --------------------------------------------------
  // Load profile
  // --------------------------------------------------

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/user/me");

      setProfile(response.data);

      setForm({
        fullName: response.data.fullName || "",
        city: response.data.city || "",
        aboutMe: response.data.aboutMe || "",
        languages: response.data.languages || [],
      });
    } catch (err) {
      console.error("Failed to load profile:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setError(
          "Your session is no longer valid. Please log in again."
        );
      } else {
        setError("Failed to load profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Load available languages
  // --------------------------------------------------

  const loadLanguages = async () => {
    try {
      const response = await api.get("/languages");
      setLanguages(response.data || []);
    } catch (err) {
      console.error("Failed to load languages:", err);
    }
  };

  useEffect(() => {
    loadProfile();
    loadLanguages();
  }, []);

  // --------------------------------------------------
  // Form changes
  // --------------------------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Language selection
  // --------------------------------------------------

  const toggleLanguage = (languageName) => {
    setForm((previous) => {
      const exists = previous.languages.includes(languageName);

      return {
        ...previous,
        languages: exists
          ? previous.languages.filter(
              (language) => language !== languageName
            )
          : [...previous.languages, languageName],
      };
    });
  };

  // --------------------------------------------------
  // Start editing
  // --------------------------------------------------

  const handleEdit = () => {
    setError("");
    setSuccess("");

    setForm({
      fullName: profile?.fullName || "",
      city: profile?.city || "",
      aboutMe: profile?.aboutMe || "",
      languages: profile?.languages || [],
    });

    setEditing(true);
  };

  // --------------------------------------------------
  // Cancel editing
  // --------------------------------------------------

  const handleCancel = () => {
    setForm({
      fullName: profile?.fullName || "",
      city: profile?.city || "",
      aboutMe: profile?.aboutMe || "",
      languages: profile?.languages || [],
    });

    setEditing(false);
    setError("");
    setSuccess("");
  };

  // --------------------------------------------------
  // Save profile
  // --------------------------------------------------

  const handleSave = async () => {
    if (!form.fullName.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.put("/user/profile", {
        fullName: form.fullName.trim(),
        city: form.city.trim(),
        aboutMe: form.aboutMe.trim(),
        languages: form.languages,
      });

      await loadProfile();

      setEditing(false);
      setSuccess("Profile updated successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);

      const message =
        err.response?.data?.message ||
        "Failed to update profile. Please try again.";

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Open file picker
  // --------------------------------------------------

  const handleChoosePhoto = () => {
    if (!editing) {
      return;
    }

    fileInputRef.current?.click();
  };

  // --------------------------------------------------
  // Upload profile photo
  // --------------------------------------------------

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    event.target.value = "";

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile photo must be less than 5 MB.");
      return;
    }

    try {
      setUploadingPhoto(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("file", file);

      await api.post(
        "/user/profile/photo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await loadProfile();

      setSuccess("Profile photo updated successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Failed to upload profile photo:", err);

      const message =
        err.response?.data?.message ||
        "Failed to upload profile photo. Please try again.";

      setError(message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // --------------------------------------------------
  // Delete profile photo
  // --------------------------------------------------

  const handleDeletePhoto = async () => {
    if (!profile?.profilePhotoUrl) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to remove your profile photo?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingPhoto(true);
      setError("");
      setSuccess("");

      await api.delete("/user/profile/photo");

      await loadProfile();

      setSuccess("Profile photo removed successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Failed to delete profile photo:", err);

      const message =
        err.response?.data?.message ||
        "Failed to remove profile photo. Please try again.";

      setError(message);
    } finally {
      setDeletingPhoto(false);
    }
  };

  // --------------------------------------------------
  // Generate Alrides User ID
  // --------------------------------------------------

  const getAlridesUserId = () => {
    if (!profile?.id) {
      return "ALR-000000";
    }

    return `ALR-${String(profile.id).padStart(6, "0")}`;
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Error without profile
  // --------------------------------------------------

  if (!profile) {
    return (
      <div style={styles.page}>
        <div style={styles.errorCard}>
          <h2>Unable to load profile</h2>

          <p>{error || "Something went wrong."}</p>

          <button
            type="button"
            style={styles.primaryButton}
            onClick={loadProfile}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Main UI
  // --------------------------------------------------

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>My Profile</h1>

            <p style={styles.subtitle}>
              Manage your Alrides profile information
            </p>
          </div>

          {!editing ? (
            <button
              type="button"
              style={styles.editButton}
              onClick={handleEdit}
            >
              <FiEdit2 size={17} />
              Edit Profile
            </button>
          ) : (
            <div style={styles.actionGroup}>
              <button
                type="button"
                style={styles.cancelButton}
                onClick={handleCancel}
                disabled={saving}
              >
                <FiX size={17} />
                Cancel
              </button>

              <button
                type="button"
                style={styles.saveButton}
                onClick={handleSave}
                disabled={saving}
              >
                <FiCheck size={17} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* Messages */}

        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        {success && (
          <div style={styles.successMessage}>
            {success}
          </div>
        )}

        {/* Profile card */}

        <div style={styles.card}>

          {/* Profile photo */}

          <div style={styles.photoSection}>

            <div style={styles.photoWrapper}>

              {profile.profilePhotoUrl ? (
                <img
                  src={profile.profilePhotoUrl}
                  alt="Profile"
                  style={styles.profileImage}
                />
              ) : (
                <div style={styles.profilePlaceholder}>
                  <FiUser size={58} />
                </div>
              )}

              {editing && (
                <button
                  type="button"
                  style={styles.cameraButton}
                  onClick={handleChoosePhoto}
                  disabled={uploadingPhoto || deletingPhoto}
                  title="Change profile photo"
                >
                  <FiCamera size={18} />
                </button>
              )}
            </div>

            {editing && (
              <div style={styles.photoActions}>

                <button
                  type="button"
                  style={styles.photoButton}
                  onClick={handleChoosePhoto}
                  disabled={uploadingPhoto || deletingPhoto}
                >
                  <FiCamera size={16} />

                  {uploadingPhoto
                    ? "Uploading..."
                    : profile.profilePhotoUrl
                    ? "Change Photo"
                    : "Add Photo"}
                </button>

                {profile.profilePhotoUrl && (
                  <button
                    type="button"
                    style={styles.removePhotoButton}
                    onClick={handleDeletePhoto}
                    disabled={uploadingPhoto || deletingPhoto}
                  >
                    <FiTrash2 size={16} />

                    {deletingPhoto
                      ? "Removing..."
                      : "Remove Photo"}
                  </button>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />

            <p style={styles.photoHint}>
              {editing
                ? "JPG, PNG or other image formats. Maximum 5 MB."
                : "Profile photo"}
            </p>
          </div>

          {/* User information */}

          <div style={styles.infoGrid}>

            {/* Name */}

            <div style={styles.field}>
              <label style={styles.label}>
                <FiUser size={16} />
                Full Name
              </label>

              {editing ? (
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  maxLength={100}
                  style={styles.input}
                  placeholder="Enter your name"
                />
              ) : (
                <div style={styles.value}>
                  {profile.fullName || "Not provided"}
                </div>
              )}
            </div>

            {/* Phone */}

            <div style={styles.field}>
              <label style={styles.label}>
                <FiPhone size={16} />
                Phone Number
              </label>

              <div style={styles.readOnlyValue}>
                {profile.phoneNumber || "Not available"}
              </div>

              <span style={styles.readOnlyHint}>
                Phone number cannot be changed
              </span>
            </div>

            {/* Alrides User ID */}

            <div style={styles.field}>
              <label style={styles.label}>
                <FiUser size={16} />
                Alrides User ID
              </label>

              <div style={styles.readOnlyValue}>
                {getAlridesUserId()}
              </div>

              <span style={styles.readOnlyHint}>
                Automatically generated
              </span>
            </div>

            {/* Rating */}

            <div style={styles.field}>
              <label style={styles.label}>
                <FiStar size={16} />
                Rating
              </label>

              <div style={styles.ratingValue}>
                <FiStar
                  size={19}
                  fill="currentColor"
                />

                <strong>
                  {profile.averageRating
                    ? Number(profile.averageRating).toFixed(1)
                    : "0.0"}
                </strong>

                <span>
                  ({profile.totalRatings || 0} ratings)
                </span>
              </div>
            </div>

            {/* City */}

            <div style={styles.field}>
              <label style={styles.label}>
                <FiMapPin size={16} />
                City
              </label>

              {editing ? (
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  maxLength={100}
                  style={styles.input}
                  placeholder="Enter your city"
                />
              ) : (
                <div style={styles.value}>
                  {profile.city || "Not provided"}
                </div>
              )}
            </div>

            {/* Languages */}

            <div style={styles.field}>
              <label style={styles.label}>
                Languages Spoken
              </label>

              {editing ? (
                <div style={styles.languageContainer}>
                  {languages.length === 0 ? (
                    <p style={styles.noLanguages}>
                      No languages available.
                    </p>
                  ) : (
                    languages.map((language) => {
                      const selected =
                        form.languages.includes(language.name);

                      return (
                        <button
                          type="button"
                          key={language.id}
                          onClick={() =>
                            toggleLanguage(language.name)
                          }
                          style={{
                            ...styles.languageButton,
                            ...(selected
                              ? styles.languageButtonSelected
                              : {}),
                          }}
                        >
                          {selected && (
                            <FiCheck size={14} />
                          )}

                          {language.name}
                        </button>
                      );
                    })
                  )}
                </div>
              ) : (
                <div style={styles.languageDisplay}>
                  {profile.languages &&
                  profile.languages.length > 0 ? (
                    profile.languages.map((language) => (
                      <span
                        key={language}
                        style={styles.languageTag}
                      >
                        {language}
                      </span>
                    ))
                  ) : (
                    <span style={styles.emptyText}>
                      No languages added
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* About Me */}

            <div
              style={{
                ...styles.field,
                gridColumn: "1 / -1",
              }}
            >
              <label style={styles.label}>
                About Me
              </label>

              {editing ? (
                <textarea
                  name="aboutMe"
                  value={form.aboutMe}
                  onChange={handleChange}
                  maxLength={500}
                  rows={5}
                  style={styles.textarea}
                  placeholder="Tell other Alrides users a little about yourself..."
                />
              ) : (
                <div style={styles.aboutValue}>
                  {profile.aboutMe ||
                    "No information added yet."}
                </div>
              )}

              {editing && (
                <div style={styles.characterCount}>
                  {form.aboutMe.length}/500
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom actions */}

        {editing && (
          <div style={styles.bottomActions}>
            <button
              type="button"
              style={styles.cancelButtonLarge}
              onClick={handleCancel}
              disabled={saving}
            >
              <FiX size={17} />
              Cancel
            </button>

            <button
              type="button"
              style={styles.saveButtonLarge}
              onClick={handleSave}
              disabled={saving}
            >
              <FiCheck size={17} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


// ======================================================
// Theme-aware Styles
// ======================================================

const styles = {

  /* ====================================================
     PAGE
  ==================================================== */

  page: {
    minHeight: "100%",
    padding: "24px",
    background: "var(--app-bg)",
    color: "var(--app-text)",
    boxSizing: "border-box",
    transition:
      "background-color 0.25s ease, color 0.25s ease",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  /* ====================================================
     HEADER
  ==================================================== */

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: 700,
    color: "var(--app-heading)",
  },

  subtitle: {
    margin: "6px 0 0",
    color: "var(--app-secondary)",
    fontSize: "15px",
  },

  /* ====================================================
     BUTTONS
  ==================================================== */

  editButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "none",
    borderRadius: "10px",
    padding: "12px 18px",
    background: "var(--app-primary)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },

  actionGroup: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },

  cancelButton: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    border:
      "1px solid var(--app-border)",
    borderRadius: "10px",
    padding: "11px 16px",
    background: "var(--app-card)",
    color: "var(--app-text)",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },

  saveButton: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    border: "none",
    borderRadius: "10px",
    padding: "12px 17px",
    background: "var(--app-success)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },

  /* ====================================================
     PROFILE CARD
  ==================================================== */

  card: {
    background: "var(--app-card)",
    borderRadius: "18px",
    padding: "30px",
    boxShadow:
      "0 5px 20px var(--app-shadow)",
    color: "var(--app-text)",
    transition:
      "background-color 0.25s ease, color 0.25s ease",
  },

  /* ====================================================
     PHOTO
  ==================================================== */

  photoSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: "30px",
    marginBottom: "30px",
    borderBottom:
      "1px solid var(--app-border)",
  },

  photoWrapper: {
    position: "relative",
    width: "130px",
    height: "130px",
  },

  profileImage: {
    width: "130px",
    height: "130px",
    borderRadius: "50%",
    objectFit: "cover",
    border:
      "4px solid var(--app-card)",
    boxShadow:
      "0 4px 15px var(--app-shadow-strong)",
  },

  profilePlaceholder: {
    width: "130px",
    height: "130px",
    borderRadius: "50%",
    background:
      "var(--settings-icon-bg)",
    color:
      "var(--settings-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border:
      "4px solid var(--app-card)",
    boxShadow:
      "0 4px 15px var(--app-shadow-strong)",
  },

  cameraButton: {
    position: "absolute",
    right: "2px",
    bottom: "2px",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border:
      "3px solid var(--app-card)",
    background: "var(--app-primary)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  photoActions: {
    display: "flex",
    gap: "10px",
    marginTop: "16px",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  photoButton: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    border:
      "1px solid var(--app-primary)",
    borderRadius: "9px",
    padding: "9px 14px",
    background:
      "var(--settings-info-bg)",
    color: "var(--app-primary)",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },

  removePhotoButton: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    border:
      "1px solid var(--settings-danger-border)",
    borderRadius: "9px",
    padding: "9px 14px",
    background:
      "var(--settings-danger-bg)",
    color: "var(--settings-danger)",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },

  photoHint: {
    margin: "10px 0 0",
    color: "var(--app-secondary)",
    fontSize: "12px",
    textAlign: "center",
  },

  /* ====================================================
     INFORMATION GRID
  ==================================================== */

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "24px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "var(--app-text)",
    fontSize: "13px",
    fontWeight: 600,
  },

  /* ====================================================
     INPUTS
  ==================================================== */

  input: {
    width: "100%",
    boxSizing: "border-box",
    border:
      "1px solid var(--app-input-border)",
    borderRadius: "9px",
    padding: "12px 13px",
    fontSize: "14px",
    color: "var(--app-text)",
    outline: "none",
    background:
      "var(--app-input-bg)",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    border:
      "1px solid var(--app-input-border)",
    borderRadius: "9px",
    padding: "12px 13px",
    fontSize: "14px",
    color: "var(--app-text)",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    background:
      "var(--app-input-bg)",
  },

  /* ====================================================
     VALUES
  ==================================================== */

  value: {
    minHeight: "20px",
    padding: "12px 13px",
    borderRadius: "9px",
    background:
      "var(--app-hover)",
    color: "var(--app-text)",
    fontSize: "14px",
  },

  readOnlyValue: {
    padding: "12px 13px",
    borderRadius: "9px",
    background:
      "var(--app-hover)",
    color: "var(--app-text)",
    fontSize: "14px",
    border:
      "1px solid var(--app-border)",
  },

  readOnlyHint: {
    color: "var(--app-secondary)",
    fontSize: "11px",
  },

  /* ====================================================
     RATING
  ==================================================== */

  ratingValue: {
    minHeight: "20px",
    padding: "12px 13px",
    borderRadius: "9px",
    background:
      "var(--settings-info-bg)",
    color:
      "var(--settings-primary)",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    border:
      "1px solid var(--settings-info-border)",
  },

  /* ====================================================
     LANGUAGES
  ==================================================== */

  languageContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    padding: "4px 0",
  },

  languageButton: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    border:
      "1px solid var(--app-border)",
    borderRadius: "20px",
    padding: "8px 13px",
    background:
      "var(--app-card)",
    color: "var(--app-text)",
    fontSize: "13px",
    cursor: "pointer",
  },

  languageButtonSelected: {
    border:
      "1px solid var(--settings-primary)",
    background:
      "var(--settings-theme-selected-bg)",
    color:
      "var(--settings-primary)",
    fontWeight: 600,
  },

  languageDisplay: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    minHeight: "42px",
    alignItems: "center",
  },

  languageTag: {
    borderRadius: "20px",
    padding: "7px 12px",
    background:
      "var(--settings-theme-selected-bg)",
    color:
      "var(--settings-primary)",
    fontSize: "13px",
    fontWeight: 500,
  },

  emptyText: {
    color: "var(--app-secondary)",
    fontSize: "14px",
  },

  noLanguages: {
    color: "var(--app-secondary)",
    fontSize: "13px",
  },

  /* ====================================================
     ABOUT ME
  ==================================================== */

  aboutValue: {
    padding: "13px",
    borderRadius: "9px",
    background:
      "var(--app-hover)",
    color: "var(--app-text)",
    fontSize: "14px",
    lineHeight: 1.6,
    minHeight: "60px",
    border:
      "1px solid var(--app-border)",
  },

  characterCount: {
    alignSelf: "flex-end",
    color: "var(--app-secondary)",
    fontSize: "11px",
  },

  /* ====================================================
     MESSAGES
  ==================================================== */

  errorMessage: {
    marginBottom: "18px",
    padding: "12px 15px",
    borderRadius: "9px",
    background:
      "var(--settings-error-bg)",
    border:
      "1px solid var(--settings-error-border)",
    color:
      "var(--settings-error-text)",
    fontSize: "14px",
  },

  successMessage: {
    marginBottom: "18px",
    padding: "12px 15px",
    borderRadius: "9px",
    background:
      "var(--settings-success-bg)",
    border:
      "1px solid var(--settings-success-border)",
    color:
      "var(--settings-success-text)",
    fontSize: "14px",
  },

  /* ====================================================
     BOTTOM ACTIONS
  ==================================================== */

  bottomActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  },

  cancelButtonLarge: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    border:
      "1px solid var(--app-border)",
    borderRadius: "10px",
    padding: "12px 18px",
    background:
      "var(--app-card)",
    color: "var(--app-text)",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },

  saveButtonLarge: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    border: "none",
    borderRadius: "10px",
    padding: "12px 18px",
    background:
      "var(--app-success)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },

  /* ====================================================
     LOADING
  ==================================================== */

  loadingContainer: {
    minHeight: "400px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "var(--app-secondary)",
  },

  spinner: {
    width: "35px",
    height: "35px",
    border:
      "4px solid var(--app-border)",
    borderTop:
      "4px solid var(--app-primary)",
    borderRadius: "50%",
    animation:
      "spin 1s linear infinite",
    marginBottom: "15px",
  },

  /* ====================================================
     ERROR CARD
  ==================================================== */

  errorCard: {
    maxWidth: "500px",
    margin: "80px auto",
    padding: "35px",
    background:
      "var(--app-card)",
    color:
      "var(--app-text)",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow:
      "0 5px 20px var(--app-shadow)",
    border:
      "1px solid var(--app-border)",
  },

  primaryButton: {
    border: "none",
    borderRadius: "9px",
    padding: "11px 18px",
    background:
      "var(--app-primary)",
    color: "#ffffff",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default MyProfile;
