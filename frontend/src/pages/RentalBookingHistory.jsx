import { useEffect, useState } from "react";

import {
  getMyRentalBookings,
  cancelRentalBooking,
} from "../services/rentalBookingService.js";


function RentalBookingHistory() {

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");


  // =====================================================
  // LOAD RENTAL BOOKING HISTORY
  // =====================================================

  const loadBookingHistory = async () => {

    try {

      setLoading(true);

      setErrorMessage("");


      const response =
        await getMyRentalBookings();


      console.log(
        "Rental booking history:",
        response
      );


      setBookings(
        Array.isArray(response)
          ? response
          : []
      );

    } catch (error) {

      console.error(
        "Error loading rental booking history:",
        error
      );


      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        "Unable to load rental booking history."
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // LOAD WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {

    loadBookingHistory();

  }, []);


  // =====================================================
  // CANCEL RENTAL BOOKING
  // =====================================================

  const handleCancelBooking = async (
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


      // Reload the booking list
      await loadBookingHistory();

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
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {

    switch (
      status?.toUpperCase()
    ) {

      case "COMPLETED":
        return "rental-status-completed";

      case "CONFIRMED":
        return "rental-status-confirmed";

      case "CANCELLED":
        return "rental-status-cancelled";

      case "REJECTED":
        return "rental-status-rejected";

      case "PENDING":
        return "rental-status-pending";

      default:
        return "";
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
            Loading rental booking history...
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


      {/* ================================================
          PAGE HEADER
      ================================================= */}

      <div className="form-card">

        <h1>
          Rental Booking History
        </h1>

        <p className="page-description">

          View all your rental vehicle bookings
          and their current status.

        </p>

      </div>


      {/* ================================================
          ERROR MESSAGE
      ================================================= */}

      {errorMessage && (

        <div className="form-card">

          <p className="error-message">

            {errorMessage}

          </p>

        </div>
      )}


      {/* ================================================
          NO BOOKINGS
      ================================================= */}

      {!errorMessage &&
        bookings.length === 0 && (

        <div className="form-card">

          <h3>
            No rental booking history found.
          </h3>

          <p>

            Your rental bookings will appear here.

          </p>

        </div>
      )}


      {/* ================================================
          BOOKINGS
      ================================================= */}

      {bookings.length > 0 && (

        <div className="rental-booking-history-list">

          {bookings.map((booking) => {

            const status =
              booking.bookingStatus?.toUpperCase();


            return (

              <div
                key={booking.bookingId}
                className="rental-history-card"
              >


                {/* ======================================
                    VEHICLE
                ====================================== */}

                <h2>

                  {booking.brand}{" "}

                  {booking.model}

                </h2>


                {/* ======================================
                    VEHICLE TYPE
                ====================================== */}

                <p>

                  <strong>
                    Vehicle Type:
                  </strong>{" "}

                  {booking.vehicleType}

                </p>


                {/* ======================================
                    OWNER
                ====================================== */}

                <p>

                  <strong>
                    Owner:
                  </strong>{" "}

                  {booking.ownerName}

                </p>


                {/* ======================================
                    START DATE
                ====================================== */}

                <p>

                  <strong>
                    Start Date:
                  </strong>{" "}

                  {booking.startDate}

                </p>


                {/* ======================================
                    END DATE
                ====================================== */}

                <p>

                  <strong>
                    End Date:
                  </strong>{" "}

                  {booking.endDate}

                </p>


                {/* ======================================
                    TOTAL DAYS
                ====================================== */}

                <p>

                  <strong>
                    Total Days:
                  </strong>{" "}

                  {booking.totalDays}

                </p>


                {/* ======================================
                    TOTAL AMOUNT
                ====================================== */}

                <p>

                  <strong>
                    Total Amount:
                  </strong>{" "}

                  ₹{booking.totalAmount}

                </p>


                {/* ======================================
                    STATUS
                ====================================== */}

                <p>

                  <strong>
                    Status:
                  </strong>{" "}

                  <span
                    className={
                      `rental-booking-status ${getStatusClass(status)}`
                    }
                  >

                    {status}

                  </span>

                </p>


                {/* ======================================
                    CUSTOMER ACTIONS
                ====================================== */}

                {status === "PENDING" && (

                  <div className="rental-history-actions">

                    <button
                      type="button"
                      className="cancel-booking-button"
                      onClick={() =>
                        handleCancelBooking(
                          booking.bookingId
                        )
                      }
                    >

                      Cancel Booking

                    </button>

                  </div>

                )}


                {/* ======================================
                    CONFIRMED
                ====================================== */}

                {status === "CONFIRMED" && (

                  <div className="rental-history-actions">

                    <span className="booking-info">

                      Booking Confirmed

                    </span>

                  </div>

                )}


                {/* ======================================
                    CANCELLED
                ====================================== */}

                {status === "CANCELLED" && (

                  <div className="rental-history-actions">

                    <span className="booking-info">

                      Booking Cancelled

                    </span>

                  </div>

                )}


                {/* ======================================
                    REJECTED
                ====================================== */}

                {status === "REJECTED" && (

                  <div className="rental-history-actions">

                    <span className="booking-info">

                      Booking Rejected

                    </span>

                  </div>

                )}


                {/* ======================================
                    COMPLETED
                ====================================== */}

                {status === "COMPLETED" && (

                  <div className="rental-history-actions">

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


export default RentalBookingHistory;