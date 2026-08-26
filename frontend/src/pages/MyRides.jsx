import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

function MyRides() {
  const navigate = useNavigate();

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadMyRides = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "JWT token not found. Please login again."
        );
      }

      const response = await api.get("/rides/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(
        "My posted rides:",
        response.data
      );

      setRides(response.data);

    } catch (error) {

      console.error(
        "Error loading my rides:",
        error
      );

      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        "Unable to load your posted rides."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyRides();
  }, []);

  if (loading) {
    return (
      <div className="page-container">

        <div className="form-card">

          <h2>
            Loading your posted rides...
          </h2>

        </div>

      </div>
    );
  }

  return (
    <div className="page-container">

      <div className="form-card">

        <h1>My Posted Rides</h1>

        <p className="page-description">
          View and manage the rides you have
          posted.
        </p>

      </div>

      {/* ERROR */}

      {errorMessage && (
        <div className="form-card">

          <p className="error-message">
            {errorMessage}
          </p>

        </div>
      )}

      {/* NO RIDES */}

      {!errorMessage &&
        rides.length === 0 && (
          <div className="form-card">

            <h3>
              No rides posted yet.
            </h3>

            <p>
              Post a ride and allow other
              users to book available seats.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                navigate("/post-ride")
              }
            >
              Post a Ride
            </button>

          </div>
        )}

      {/* RIDES */}

      {rides.length > 0 && (
        <div className="my-rides-list">

          {rides.map((ride) => (

            <div
              key={ride.id}
              className="my-ride-card"
            >

              <div className="ride-row">
                <strong>Route :</strong>

                <span>
                  {ride.source} → {ride.destination}
                </span>
              </div>

              <div className="ride-row">
                <strong>Travel Date :</strong>

                <span>
                  {ride.travelDate}
                </span>
              </div>

              <div className="ride-row">
                <strong>Travel Time :</strong>

                <span>
                  {ride.travelTime}
                </span>
              </div>

              <div className="ride-row">
                <strong>Available Seats :</strong>

                <span>
                  {ride.availableSeats}
                </span>
              </div>

              <div className="ride-row">
                <strong>Price Per Seat :</strong>

                <span>
                  ₹{ride.pricePerSeat}
                </span>
              </div>

              <div className="ride-row">
                <strong>Vehicle Type :</strong>

                <span>
                  {ride.vehicleType}
                </span>
              </div>

              <div className="ride-row">
                <strong>Vehicle :</strong>

                <span>
                  {ride.vehicleName}
                </span>
              </div>

              <div className="ride-row">
                <strong>
                  Registration Number :
                </strong>

                <span>
                  {ride.vehicleNumber}
                </span>
              </div>

              <div className="ride-row">
                <strong>Status :</strong>

                <span>
                  {ride.status}
                </span>
              </div>

              {ride.description && (
                <div className="ride-row">

                  <strong>
                    Description :
                  </strong>

                  <span>
                    {ride.description}
                  </span>

                </div>
              )}

              {/* BOOKING REQUEST BUTTON */}

              <div className="ride-action">

                <button
                  type="button"
                  className="primary-button"
                  onClick={() =>
                    navigate(
                      `/ride-bookings/${ride.id}`
                    )
                  }
                >
                  View Booking Requests
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default MyRides;