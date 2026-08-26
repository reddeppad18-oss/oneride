import { useEffect, useState } from "react";
import {
  getMyBookings,
  cancelBooking,
} from "../services/bookingService.js";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getMyBookings();

      console.log("My bookings:", data);

      setBookings(data);
    } catch (error) {
      console.error("Error loading bookings:", error);

      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to load your bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await cancelBooking(bookingId);

      alert("Booking cancelled successfully.");

      await loadBookings();
    } catch (error) {
      console.error(
        "Error cancelling booking:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to cancel booking."
      );
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="form-card">
          <h2>Loading your bookings...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">

      {/* PAGE HEADING */}

      <div className="form-card">
        <h1>My Bookings</h1>

        <p className="page-description">
          View and manage the rides you have booked.
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


      {/* NO BOOKINGS */}

      {!errorMessage && bookings.length === 0 && (
        <div className="form-card">

          <h3>No bookings found.</h3>

          <p>
            Your ride bookings will appear here.
          </p>

        </div>
      )}


      {/* BOOKINGS */}

      {bookings.length > 0 && (
        <div className="my-bookings-list">

          {bookings.map((booking) => (
            <div
              key={booking.bookingId}
              className="my-booking-card"
            >

              {/* SOURCE */}

              <div className="booking-row">
                <strong>Source :</strong>

                <span>
                  {booking.source}
                </span>
              </div>


              {/* DESTINATION */}

              <div className="booking-row">
                <strong>Destination :</strong>

                <span>
                  {booking.destination}
                </span>
              </div>


              {/* TRAVEL DATE */}

              <div className="booking-row">
                <strong>Travel Date :</strong>

                <span>
                  {booking.travelDate}
                </span>
              </div>


              {/* TRAVEL TIME */}

              <div className="booking-row">
                <strong>Travel Time :</strong>

                <span>
                  {booking.travelTime}
                </span>
              </div>


              {/* SEATS */}

              <div className="booking-row">
                <strong>Seats Booked :</strong>

                <span>
                  {booking.seatsBooked}
                </span>
              </div>


              {/* PRICE */}

              <div className="booking-row">
                <strong>Price Per Seat :</strong>

                <span>
                  ₹{booking.pricePerSeat}
                </span>
              </div>


              {/* TOTAL */}

              <div className="booking-row">
                <strong>Total Amount :</strong>

                <span>
                  ₹{booking.totalAmount}
                </span>
              </div>


              {/* STATUS */}

              <div className="booking-row">
                <strong>Status :</strong>

                <span
                  className={`booking-status ${String(
                    booking.bookingStatus
                  ).toLowerCase()}`}
                >
                  {booking.bookingStatus}
                </span>
              </div>


              {/* CANCEL BUTTON */}

              {booking.bookingStatus === "PENDING" && (
                <div className="booking-action">

                  <button
                    type="button"
                    className="secondary-button cancel-booking-button"
                    onClick={() =>
                      handleCancel(
                        booking.bookingId
                      )
                    }
                  >
                    Cancel Booking
                  </button>

                </div>
              )}

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default MyBookings;