import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../api/axios.js";

function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await api.get(
          `/user/public/${userId}`
        );

        console.log("Public Profile:", response.data);

        setProfile(response.data);
      } catch (error) {
        console.error(
          "Error loading public profile:",
          error
        );

        setErrorMessage(
          error.response?.data?.message ||
          "Unable to load user profile."
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadProfile();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="form-card">
          <h2>Loading profile...</h2>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="page-container">
        <div className="form-card">
          <h1>Profile</h1>

          <p className="error-message">
            {errorMessage}
          </p>

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate(-1)}
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="page-container">
        <div className="form-card">
          <h2>Profile not found.</h2>

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate(-1)}
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">

      {/* =========================
          BACK BUTTON
      ========================= */}

      <div style={{ marginBottom: "15px" }}>
        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate(-1)}
        >
          ← Go Back
        </button>
      </div>


      {/* =========================
          PROFILE CARD
      ========================= */}

      <div className="form-card">

        <div
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >

          {/* PROFILE PHOTO */}

          {profile.profilePhotoUrl ? (
            <img
              src={profile.profilePhotoUrl}
              alt={`${profile.fullName || "User"} profile`}
              style={{
                width: "130px",
                height: "130px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid #eee",
              }}
            />
          ) : (
            <div
              style={{
                width: "130px",
                height: "130px",
                borderRadius: "50%",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f0f0f0",
                fontSize: "50px",
              }}
            >
              👤
            </div>
          )}

          <h1 style={{ marginTop: "15px" }}>
            {profile.fullName || "Alrides User"}
          </h1>

          {profile.verified && (
            <p
              style={{
                color: "green",
                fontWeight: "600",
              }}
            >
              ✓ Verified User
            </p>
          )}

        </div>


        {/* =========================
            RATING
        ========================= */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "25px",
            padding: "15px",
            borderRadius: "10px",
            backgroundColor: "#f8f8f8",
          }}
        >
          <h2 style={{ margin: "0 0 5px 0" }}>
            ⭐{" "}
            {profile.averageRating
              ? Number(profile.averageRating).toFixed(1)
              : "0.0"}
          </h2>

          <p style={{ margin: 0 }}>
            {profile.totalRatings || 0}{" "}
            {profile.totalRatings === 1
              ? "rating"
              : "ratings"}
          </p>
        </div>


        {/* =========================
            PROFILE DETAILS
        ========================= */}

        <div>

          <p>
            <strong>📍 City:</strong>{" "}
            {profile.city || "Not provided"}
          </p>

          <p>
            <strong>📱 Phone:</strong>{" "}
            {profile.phoneNumber || "Not provided"}
          </p>

          <p>
            <strong>👤 Role:</strong>{" "}
            {profile.role || "User"}
          </p>

        </div>


        {/* =========================
            ABOUT ME
        ========================= */}

        <div style={{ marginTop: "25px" }}>

          <h3>About Me</h3>

          <p>
            {profile.aboutMe ||
              "This user has not added an introduction yet."}
          </p>

        </div>


        {/* =========================
            LANGUAGES
        ========================= */}

        <div style={{ marginTop: "25px" }}>

          <h3>Languages</h3>

          {profile.languages &&
          profile.languages.length > 0 ? (
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              {profile.languages.map(
                (language, index) => (
                  <span
                    key={`${language}-${index}`}
                    style={{
                      padding: "7px 12px",
                      borderRadius: "20px",
                      backgroundColor: "#f0f0f0",
                    }}
                  >
                    {language}
                  </span>
                )
              )}
            </div>
          ) : (
            <p>
              No languages have been added.
            </p>
          )}

        </div>

      </div>

    </div>
  );
}

export default UserProfile;
