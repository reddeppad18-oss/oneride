import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createRentalBooking } from "../services/rentalBookingService.js";

function RentalBooking() {
  const { rentalId } = useParams();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    if (!startDate || !endDate) {
      setErrorMessage(
        "Please select both start and end dates."
      );
      return;
    }

    if (endDate < startDate) {
      setErrorMessage(
        "End date cannot be before start date."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await createRentalBooking(
        Number(rentalId),
        startDate,
        endDate
      );

      console.log(
        "Rental booking response:",
        response
      );

      setMessage(
        "Rental booking request created successfully."
      );

      setStartDate("");
      setEndDate("");

    } catch (error) {
      console.error(
        "Rental booking error:",
        error
      );

      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to create rental booking."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">

      <div className="form-card">

        <h1>Book Rental Vehicle</h1>

        <p className="page-description">
          Select the dates for which you want
          to rent this vehicle.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label htmlFor="startDate">
              Start Date
            </label>

            <input
              id="startDate"
              type="date"
              value={startDate}
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              onChange={(event) =>
                setStartDate(event.target.value)
              }
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="endDate">
              End Date
            </label>

            <input
              id="endDate"
              type="date"
              min={
                startDate ||
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              value={endDate}
              onChange={(event) =>
                setEndDate(event.target.value)
              }
              required
            />

          </div>


          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Booking..."
              : "Book Vehicle"}
          </button>


          {message && (
            <p className="success-message">
              {message}
            </p>
          )}


          {errorMessage && (
            <p className="error-message">
              {errorMessage}
            </p>
          )}

        </form>


        <button
          type="button"
          className="secondary-button"
          style={{ marginTop: "15px" }}
          onClick={() =>
            navigate("/rental-vehicles")
          }
        >
          Back to Rental Vehicles
        </button>

      </div>

    </div>
  );
}

export default RentalBooking;