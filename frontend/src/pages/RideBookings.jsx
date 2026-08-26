import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getBookingsForRide,
  confirmBooking,
  rejectBooking,
} from "../services/bookingService.js";

function RideBookings() {

  const { rideId } = useParams();

  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadBookings = async () => {

    try {

      setLoading(true);
      setErrorMessage("");

      const data =
        await getBookingsForRide(rideId);

      console.log(
        "Ride bookings:",
        data
      );

      setBookings(data);

    } catch (error) {

      console.error(
        "Error loading bookings:",
        error
      );

      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        "Unable to load bookings."
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    loadBookings();
  }, [rideId]);

  // =========================
  // ACCEPT
  // =========================

  const handleConfirm = async (bookingId) => {

    const confirmed = window.confirm(
      "Are you sure you want to accept this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {

      await confirmBooking(bookingId);

      alert(
        "Booking accepted successfully."
      );

      await loadBookings();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Unable to accept booking."
      );

    }
  };

  // =========================
  // REJECT
  // =========================

  const handleReject = async (bookingId) => {

    const confirmed = window.confirm(
      "Are you sure you want to reject this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {

      await rejectBooking(bookingId);

      alert(
        "Booking rejected successfully."
      );

      await loadBookings();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Unable to reject booking."
      );

    }
  };

  if (loading) {

    return (
      <div className="page-container">

        <div className="form-card">

          <h2>
            Loading booking requests...
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
          Ride Booking Requests
        </h1>

        <p className="page-description">
          Review passenger requests for
          this ride.
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
              Passenger booking requests
              will appear here.
            </p>

          </div>
        )}

      {/* BOOKINGS */}

      {bookings.length > 0 && (

        <div className="booking-list">

          {bookings.map((booking) => (

            <div
              key={booking.bookingId}
              className="booking-card"
            >

              <h2>
                Booking #{booking.bookingId}
              </h2>

              <div className="booking-row">

                <strong>
                  Passenger :
                </strong>

                <span>
                  {booking.passengerName}
                </span>

              </div>

              <div className="booking-row">

                <strong>
                  Source :
                </strong>

                <span>
                  {booking.source}
                </span>

              </div>

              <div className="booking-row">

                <strong>
                  Destination :
                </strong>

                <span>
                  {booking.destination}
                </span>

              </div>

              <div className="booking-row">

                <strong>
                  Travel Date :
                </strong>

                <span>
                  {booking.travelDate}
                </span>

              </div>

              <div className="booking-row">

                <strong>
                  Travel Time :
                </strong>

                <span>
                  {booking.travelTime}
                </span>

              </div>

              <div className="booking-row">

                <strong>
                  Seats Requested :
                </strong>

                <span>
                  {booking.seatsBooked}
                </span>

              </div>

              <div className="booking-row">

                <strong>
                  Price Per Seat :
                </strong>

                <span>
                  ₹{booking.pricePerSeat}
                </span>

              </div>

              <div className="booking-row">

                <strong>
                  Total Amount :
                </strong>

                <span>
                  ₹{booking.totalAmount}
                </span>

              </div>

              <div className="booking-row">

                <strong>
                  Status :
                </strong>

                <span>
                  {booking.bookingStatus}
                </span>

              </div>

              {/* ACTIONS */}

              {booking.bookingStatus ===
                "PENDING" && (

                <div className="booking-actions">

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

              {booking.bookingStatus ===
                "CONFIRMED" && (

                <p className="success-message">
                  Booking Accepted
                </p>

              )}

              {booking.bookingStatus ===
                "REJECTED" && (

                <p className="error-message">
                  Booking Rejected
                </p>

              )}

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default RideBookings;