import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchRentals } from "../services/rentalService.js";

function RentalVehicles() {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!location.trim()) {
      setErrorMessage("Please enter a location.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setSearched(true);

      const response = await searchRentals(location.trim());

      console.log("Rental search response:", response);

      setRentals(response);
    } catch (error) {
      console.error("Rental search error:", error);

      setRentals([]);

      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to search rental vehicles."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">

      {/* Header */}
      <div className="form-card">

        <h1>Rental Vehicles</h1>

        <p className="page-description">
          Search for vehicles available for rental
          or post your own vehicle for rental.
        </p>

        {/* Post Vehicle Button */}
        <button
          type="button"
          className="primary-button"
          onClick={() => navigate("/post-rental-vehicle")}
          style={{ marginBottom: "20px" }}
        >
          Post Vehicle for Rental
        </button>

        <hr />

        {/* Search Section */}
        <h2>Search Rental Vehicles</h2>

        <form onSubmit={handleSearch}>

          <div className="form-group">

            <label htmlFor="location">
              Location
            </label>

            <input
              id="location"
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={(event) =>
                setLocation(event.target.value)
              }
            />

          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Searching..."
              : "Search Rentals"}
          </button>

        </form>

        {errorMessage && (
          <p className="error-message">
            {errorMessage}
          </p>
        )}

      </div>


      {/* No Results */}
      {searched &&
        !loading &&
        rentals.length === 0 &&
        !errorMessage && (
          <div className="form-card">

            <h3>
              No rental vehicles found.
            </h3>

            <p>
              No vehicles are currently available
              at this location.
            </p>

          </div>
        )}


      {/* Rental Results */}
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
                <strong>Vehicle Type:</strong>{" "}
                {rental.vehicleType}
              </p>

              <p>
                <strong>Registration Number:</strong>{" "}
                {rental.registrationNumber}
              </p>

              <p>
                <strong>Seats:</strong>{" "}
                {rental.seats}
              </p>

              <p>
                <strong>Price Per Day:</strong>{" "}
                ₹{rental.pricePerDay}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {rental.location}
              </p>

              <p>
                <strong>Owner:</strong>{" "}
                {rental.ownerName}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {rental.status}
              </p>

              {rental.description && (
                <p>
                  <strong>Description:</strong>{" "}
                  {rental.description}
                </p>
              )}
              <button
  type="button"
  className="primary-button"
  onClick={() =>
    navigate(`/rental-booking/${rental.id}`)
  }
  disabled={rental.status !== "AVAILABLE"}
>
  {rental.status === "AVAILABLE"
    ? "Book Vehicle"
    : "Vehicle Unavailable"}
</button>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default RentalVehicles;