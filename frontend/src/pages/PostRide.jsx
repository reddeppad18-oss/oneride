import { useState } from "react";
import { createRide } from "../services/rideService.js";

function PostRide() {
const [formData, setFormData] = useState({
source: "",
destination: "",
travelDate: "",
travelTime: "",
availableSeats: "",
pricePerSeat: "",
vehicleType: "",
brand: "",
registrationNumber: "",
description: "",
});

const [message, setMessage] = useState("");
const [errorMessage, setErrorMessage] = useState("");
const [loading, setLoading] = useState(false);

const handleChange = (event) => {
const { name, value } = event.target;

setFormData((previousData) => ({
  ...previousData,
  [name]: value,
}));

};

const handleSubmit = async (event) => {
event.preventDefault();

setMessage("");
setErrorMessage("");
setLoading(true);

try {
  const rideData = {
    ...formData,
    availableSeats: Number(formData.availableSeats),
    pricePerSeat: Number(formData.pricePerSeat),
  };

  const response = await createRide(rideData);

  console.log("Create ride response:", response);

  setMessage(
    response.message || "Ride created successfully."
  );

  setFormData({
    source: "",
    destination: "",
    travelDate: "",
    travelTime: "",
    availableSeats: "",
    pricePerSeat: "",
    vehicleType: "",
    brand: "",
    registrationNumber: "",
    description: "",
  });

} catch (error) {
  console.error("Create ride error:", error);

  if (error.response?.data?.message) {
    setErrorMessage(error.response.data.message);
  } else if (error.response?.data) {
    setErrorMessage(
      JSON.stringify(error.response.data)
    );
  } else {
    setErrorMessage(
      error.message ||
      "Unable to create the ride."
    );
  }

} finally {
  setLoading(false);
}


};

return ( <div className="page-container"> <div className="form-card">

    <h1>Post a Ride</h1>

    <p className="page-description">
      Share your journey and allow other users
      to book available seats.
    </p>

    <form onSubmit={handleSubmit}>

      <div className="form-grid">

        <div className="form-group">
          <label>Source</label>

          <input
            type="text"
            name="source"
            placeholder="Enter source"
            value={formData.source}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Destination</label>

          <input
            type="text"
            name="destination"
            placeholder="Enter destination"
            value={formData.destination}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Travel Date</label>

          <input
            type="date"
            name="travelDate"
            value={formData.travelDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Travel Time</label>

          <input
            type="time"
            name="travelTime"
            value={formData.travelTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Available Seats</label>

          <input
            type="number"
            name="availableSeats"
            placeholder="Enter available seats"
            min="1"
            value={formData.availableSeats}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Price per Seat</label>

          <input
            type="number"
            name="pricePerSeat"
            placeholder="Enter price"
            min="1"
            step="0.01"
            value={formData.pricePerSeat}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Vehicle Type</label>

          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            required
          >
            <option value="">
              Select vehicle type
            </option>

            <option value="BIKE">
              Bike
            </option>

            <option value="CAR">
              Car
            </option>

            <option value="VAN">
              Van
            </option>

            <option value="BUS">
              Bus
            </option>
          </select>
        </div>

        <div className="form-group">
          <label>Vehicle Brand</label>

          <input
            type="text"
            name="brand"
            placeholder="Example: Honda, Toyota"
            value={formData.brand}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Registration Number</label>

          <input
            type="text"
            name="registrationNumber"
            placeholder="Enter vehicle number"
            value={formData.registrationNumber}
            onChange={handleChange}
            required
          />
        </div>

      </div>

      <div className="form-group">
        
        <label>
          Description (Optional)
        </label>
    
        <textarea
          name="description"
          placeholder="Add additional ride details"
          rows="4"
          maxLength="500"
          value={formData.description}
          onChange={handleChange}
        />
        
      </div>

      <button
        type="submit"
        className="primary-button"
        disabled={loading}
      >
        {loading
          ? "Creating Ride..."
          : "Post Ride"}
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

  </div>
</div>
);
}

export default PostRide;
