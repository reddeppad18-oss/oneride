import { useEffect, useState } from "react";

import {
  getMyRentalBookings,
  cancelRentalBooking,
} from "../services/rentalBookingService.js";


function MyRentalBookings() {

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");


  // =====================================================
  // LOAD BOOKINGS
  // =====================================================

  const loadBookings = async () => {

    try {

      setLoading(true);

      setErrorMessage("");


      const response =
        await getMyRentalBookings();


      console.log(
        "My rental bookings:",
        response
      );


      setBookings(
        Array.isArray(response)
          ? response
          : []
      );

    } catch (error) {

      console.error(
        "Error loading rental bookings:",
        error
      );


      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        "Unable to load your rental bookings."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadBookings();

  }, []);


  // =====================================================
  // CANCEL BOOKING
  // =====================================================

  const handleCancel = async (
    bookingId
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this rental booking?"
      );


    if (!confirmed) {
      return;
    }


    try {

      await cancelRentalBooking(
        bookingId
      );


      alert(
        "Rental booking cancelled successfully."
      );


      await loadBookings();

    } catch (error) {

      console.error(
        "Error cancelling rental booking:",
        error
      );


      alert(
        error.response?.data?.message ||
        error.message ||
        "Unable to cancel rental booking."
      );
    }
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="page-container">

        <div className="form-card">

          <h2>
            Loading your rental bookings...
          </h2>

        </div>

      </div>
    );
  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="page-container">

      <div className="form-card">

        <h1>
          My Rental Bookings
        </h1>

        <p className="page-description">
          View and manage your rental vehicle
          bookings.
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

      {!errorMessage &&
        bookings.length === 0 && (

        <div className="form-card">

          <h3>
            No rental bookings found.
          </h3>

          <p>
            You haven't booked any rental
            vehicles yet.
          </p>

        </div>
      )}


      {/* BOOKINGS */}

      {bookings.length > 0 && (

        <div className="my-rental-bookings-list">

          {bookings.map((booking) => {

            const status =
              booking.bookingStatus
                ?.toUpperCase();


            return (

              <div
                key={booking.bookingId}
                className="my-rental-booking-card"
              >

                <h2>
                  {booking.brand}{" "}
                  {booking.model}
                </h2>


                <p>
                  <strong>
                    Vehicle Type :
                  </strong>{" "}
                  {booking.vehicleType}
                </p>


                <p>
                  <strong>
                    Owner :
                  </strong>{" "}
                  {booking.ownerName}
                </p>


                <p>
                  <strong>
                    Start Date :
                  </strong>{" "}
                  {booking.startDate}
                </p>


                <p>
                  <strong>
                    End Date :
                  </strong>{" "}
                  {booking.endDate}
                </p>


                <p>
                  <strong>
                    Total Days :
                  </strong>{" "}
                  {booking.totalDays}
                </p>


                <p>
                  <strong>
                    Total Amount :
                  </strong>{" "}
                  ₹{booking.totalAmount}
                </p>


                <p>
                  <strong>
                    Status :
                  </strong>{" "}

                  <span
                    className={
                      `rental-booking-status ${status?.toLowerCase()}`
                    }
                  >
                    {status}
                  </span>
                </p>


                {/* ACTION SECTION */}

                {status === "PENDING" && (

                  <div className="rental-booking-actions">

                    <button
                      type="button"
                      className="cancel-booking-button"
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


                {status === "CONFIRMED" && (

                  <div className="rental-booking-actions">

                    <span className="booking-info">
                      Booking Confirmed
                    </span>

                  </div>

                )}


                {status === "CANCELLED" && (

                  <div className="rental-booking-actions">

                    <span className="booking-info">
                      Booking Cancelled
                    </span>

                  </div>

                )}


                {status === "REJECTED" && (

                  <div className="rental-booking-actions">

                    <span className="booking-info">
                      Booking Rejected
                    </span>

                  </div>

                )}


                {status === "COMPLETED" && (

                  <div className="rental-booking-actions">

                    <span className="booking-info">
                      Rental Completed
                    </span>

                  </div>

                )}

              </div>

            );
          })}

        </div>
      )}

    </div>
  );
}


export default MyRentalBookings;