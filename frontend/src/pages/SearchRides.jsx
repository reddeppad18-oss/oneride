import { useState } from "react";
import { searchRides } from "../services/rideService.js";
import { createBooking } from "../services/bookingService.js";

function SearchRides() {
  const [searchData, setSearchData] = useState({
    source: "",
    destination: "",
    travelDate: "",
    availableSeats: "",
    maxPrice: "",
  });

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSearchData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await searchRides(searchData);

      console.log("Search Response:", response);

      setRides(response.content || []);

      if (!response.content || response.content.length === 0) {
        setMessage("No rides found.");
      }
    } catch (error) {
      console.error("Search Error:", error);
      setMessage("Unable to search rides.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <h1>Search Rides</h1>

        <p className="page-description">
          Find available rides based on your journey.
        </p>

        <form onSubmit={handleSearch}>
          <div className="form-grid">

            <div className="form-group">
              <label htmlFor="source">Source</label>
              <input
                id="source"
                type="text"
                name="source"
                placeholder="Enter source"
                value={searchData.source}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="destination">Destination</label>
              <input
                id="destination"
                type="text"
                name="destination"
                placeholder="Enter destination"
                value={searchData.destination}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="travelDate">Travel Date</label>
              <input
                id="travelDate"
                type="date"
                name="travelDate"
                value={searchData.travelDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="availableSeats">Required Seats</label>
              <input
                id="availableSeats"
                type="number"
                name="availableSeats"
                min="1"
                value={searchData.availableSeats}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="maxPrice">Maximum Price</label>
              <input
                id="maxPrice"
                type="number"
                name="maxPrice"
                min="1"
                value={searchData.maxPrice}
                onChange={handleChange}
              />
            </div>

          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search Rides"}
          </button>
        </form>
      </div>

      <div className="results-container">

        {message && (
          <p className="search-message">{message}</p>
        )}

        {rides.map((ride) => (
          <div key={ride.id} className="ride-card">

            <h2>
              {ride.source} → {ride.destination}
            </h2>

            <p>
              <strong>Date:</strong> {ride.travelDate}
            </p>

            <p>
              <strong>Time:</strong> {ride.travelTime}
            </p>

            <p>
              <strong>Seats:</strong> {ride.availableSeats}
            </p>

            <p>
              <strong>Price:</strong> ₹{ride.pricePerSeat}
            </p>

            <p>
              <strong>Vehicle:</strong> {ride.vehicleType}
            </p>

            <p>
              <strong>Name:</strong> {ride.vehicleName}
            </p>

            <p>
              <strong>Number:</strong> {ride.vehicleNumber}
            </p>

            <p>
              <strong>Status:</strong> {ride.status}
            </p>

            {ride.description && (
              <p>
                <strong>Description:</strong> {ride.description}
              </p>
            )}
            <button
             className="primary-button"
             onClick={() => handleBookRide(ride.id)}
            >
             Book Ride
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}
const handleBookRide = async (rideId) => {
  const seats = prompt("How many seats do you want to book?", "1");

  if (!seats) {
    return;
  }

  try {
    const response = await createBooking(
      rideId,
      Number(seats)
    );

    alert(
      `Booking successful!\n\nBooking ID: ${response.bookingId}\nStatus: ${response.bookingStatus}`
    );

  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Booking failed."
    );
  }
};

export default SearchRides;