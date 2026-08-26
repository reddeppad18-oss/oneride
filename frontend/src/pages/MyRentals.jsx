import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMyRentals,
  updateRentalStatus,
  deleteRental,
} from "../services/rentalService.js";

function MyRentals() {

  const navigate = useNavigate();

  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadMyRentals = async () => {

    try {

      setLoading(true);
      setErrorMessage("");

      const response =
        await getMyRentals();

      console.log(
        "My rentals:",
        response
      );

      setRentals(response);

    } catch (error) {

      console.error(
        "Error loading my rentals:",
        error
      );

      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        "Unable to load your rental vehicles."
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    loadMyRentals();
  }, []);

  // =========================
  // CHANGE STATUS
  // =========================

  const handleStatusChange = async (
    rentalId,
    currentStatus
  ) => {

    try {

      const newStatus =
        currentStatus === "AVAILABLE"
          ? "UNAVAILABLE"
          : "AVAILABLE";

      await updateRentalStatus(
        rentalId,
        newStatus
      );

      alert(
        `Rental vehicle status changed to ${newStatus}.`
      );

      await loadMyRentals();

    } catch (error) {

      console.error(
        "Error updating rental status:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Unable to update rental status."
      );

    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (
    rentalId
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this rental vehicle?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await deleteRental(rentalId);

      alert(
        "Rental vehicle deleted successfully."
      );

      await loadMyRentals();

    } catch (error) {

      console.error(
        "Error deleting rental:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Unable to delete rental vehicle."
      );

    }
  };

  if (loading) {

    return (
      <div className="page-container">

        <div className="form-card">

          <h2>
            Loading your rental vehicles...
          </h2>

        </div>

      </div>
    );
  }

  return (
    <div className="page-container">

      {/* HEADER */}

      <div className="form-card">

        <h1>
          My Rental Vehicles
        </h1>

        <p className="page-description">
          Manage your rental vehicles and
          customer booking requests.
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

      {/* NO RENTALS */}

      {!errorMessage &&
        rentals.length === 0 && (

        <div className="form-card">

          <h3>
            You haven't posted any rental
            vehicles yet.
          </h3>

          <p>
            Post a vehicle to start offering
            it for rental.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() =>
              navigate(
                "/post-rental-vehicle"
              )
            }
          >
            Post Vehicle for Rental
          </button>

        </div>
      )}

      {/* RENTALS */}

      {rentals.length > 0 && (

        <div className="ride-list">

          {rentals.map((rental) => (

            <div
              key={rental.id}
              className="ride-card"
            >

              <h2>
                {rental.brand} {rental.model}
              </h2>

              <p>
                <strong>
                  Vehicle Type:
                </strong>{" "}
                {rental.vehicleType}
              </p>

              <p>
                <strong>
                  Registration Number:
                </strong>{" "}
                {rental.registrationNumber}
              </p>

              <p>
                <strong>
                  Seats:
                </strong>{" "}
                {rental.seats}
              </p>

              <p>
                <strong>
                  Price Per Day:
                </strong>{" "}
                ₹{rental.pricePerDay}
              </p>

              <p>
                <strong>
                  Location:
                </strong>{" "}
                {rental.location}
              </p>

              <p>
                <strong>
                  Status:
                </strong>{" "}
                {rental.status}
              </p>

              {rental.description && (
                <p>
                  <strong>
                    Description:
                  </strong>{" "}
                  {rental.description}
                </p>
              )}

              {/* ACTIONS */}

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "15px",
                  flexWrap: "wrap",
                }}
              >

                {/* BOOKING REQUESTS */}

                <button
                  type="button"
                  className="primary-button"
                  onClick={() =>
                    navigate(
                      `/rental-booking-requests/${rental.id}`
                    )
                  }
                >
                  Booking Requests
                </button>

                {/* AVAILABILITY */}

                <button
                  type="button"
                  className="primary-button"
                  onClick={() =>
                    handleStatusChange(
                      rental.id,
                      rental.status
                    )
                  }
                >
                  {rental.status === "AVAILABLE"
                    ? "Make Unavailable"
                    : "Make Available"}
                </button>

                {/* DELETE */}

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    handleDelete(rental.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default MyRentals;