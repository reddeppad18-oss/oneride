import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getBookingsForRental,
  confirmRentalBooking,
  rejectRentalBooking,
  completeRentalBooking,
} from "../services/rentalBookingService.js";

function RentalBookingRequests() {

  const { rentalId } = useParams();

  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadBookings = async () => {

    try {

      setLoading(true);
      setErrorMessage("");

      const response =
        await getBookingsForRental(
          rentalId
        );

      console.log(
        "Rental booking requests:",
        response
      );

      setBookings(response);

    } catch (error) {

      console.error(
        "Error loading rental booking requests:",
        error
      );

      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        "Unable to load booking requests."
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    loadBookings();
  }, [rentalId]);

  // =========================
  // ACCEPT
  // =========================

  const handleConfirm = async (
    bookingId
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to accept this rental booking?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await confirmRentalBooking(
        bookingId
      );

      alert(
        "Rental booking accepted successfully."
      );

      await loadBookings();

    } catch (error) {

      console.error(
        "Error confirming rental booking:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Unable to confirm rental booking."
      );

    }
  };

  // =========================
  // REJECT
  // =========================

  const handleReject = async (
    bookingId
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to reject this rental booking?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await rejectRentalBooking(
        bookingId
      );

      alert(
        "Rental booking rejected successfully."
      );

      await loadBookings();

    } catch (error) {

      console.error(
        "Error rejecting rental booking:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Unable to reject rental booking."
      );

    }
  };

  // =========================
  // COMPLETE
  // =========================

  const handleComplete = async (
    bookingId
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to mark this rental as completed?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await completeRentalBooking(
        bookingId
      );

      alert(
        "Rental booking completed successfully."
      );

      await loadBookings();

    } catch (error) {

      console.error(
        "Error completing rental booking:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Unable to complete rental booking."
      );

    }
  };

  if (loading) {

    return (
      <div className="page-container">

        <div className="form-card">

          <h2>
            Loading rental booking requests...
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
          Rental Booking Requests
        </h1>

        <p className="page-description">
          Review and manage booking requests
          for this rental vehicle.
        </p>

        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Back to Dashboard
        </button>

      </div>

      {/* ERROR */}

      {errorMessage && (
        <div className="form-card">

          <p className="error-message">
            {errorMessage}
          </p>

        </div>
      )}

      {/* NO BOOKINGS */}

      {!errorMessage &&
        bookings.length === 0 && (

        <div className="form-card">

          <h3>
            No booking requests found.
          </h3>

          <p>
            Customer booking requests for
            this vehicle will appear here.
          </p>

        </div>
      )}

      {/* BOOKINGS */}

      {bookings.length > 0 && (

        <div className="ride-list">

          {bookings.map((booking) => (

            <div
              key={booking.bookingId}
              className="ride-card"
            >

              <h2>
                {booking.brand}{" "}
                {booking.model}
              </h2>

              <p>
                <strong>
                  Booking ID:
                </strong>{" "}
                {booking.bookingId}
              </p>

              <p>
                <strong>
                  Customer:
                </strong>{" "}
                {booking.customerName}
              </p>

              <p>
                <strong>
                  Vehicle Type:
                </strong>{" "}
                {booking.vehicleType}
              </p>

              <p>
                <strong>
                  Start Date:
                </strong>{" "}
                {booking.startDate}
              </p>

              <p>
                <strong>
                  End Date:
                </strong>{" "}
                {booking.endDate}
              </p>

              <p>
                <strong>
                  Total Days:
                </strong>{" "}
                {booking.totalDays}
              </p>

              <p>
                <strong>
                  Total Amount:
                </strong>{" "}
                ₹{booking.totalAmount}
              </p>

              <p>
                <strong>
                  Status:
                </strong>{" "}
                {booking.bookingStatus}
              </p>

              {/* PENDING */}

              {booking.bookingStatus ===
                "PENDING" && (

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "15px",
                    flexWrap: "wrap",
                  }}
                >

                  <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                      handleConfirm(
                        booking.bookingId
                      )
                    }
                  >
                    Accept
                  </button>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      handleReject(
                        booking.bookingId
                      )
                    }
                  >
                    Reject
                  </button>

                </div>
              )}

              {/* CONFIRMED */}

              {booking.bookingStatus ===
                "CONFIRMED" && (

                <div
                  style={{
                    marginTop: "15px",
                  }}
                >

                  <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                      handleComplete(
                        booking.bookingId
                      )
                    }
                  >
                    Complete Rental
                  </button>

                </div>
              )}

              {/* COMPLETED */}

              {booking.bookingStatus ===
                "COMPLETED" && (

                <p className="success-message">
                  Rental Completed
                </p>

              )}

              {/* REJECTED */}

              {booking.bookingStatus ===
                "REJECTED" && (

                <p className="error-message">
                  Rental Booking Rejected
                </p>

              )}

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default RentalBookingRequests;