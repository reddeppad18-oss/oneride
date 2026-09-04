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

  return (
    <div className="page-container">
      <div className="form-card">

        <h1>Post a Ride</h1>

        <p className="page-description">
          Share your journey and allow other users
          to book available seats.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* Source */}
            <div className="form-group">
              <label htmlFor="source">
                Source
              </label>

              <input
                id="source"
                type="text"
                name="source"
                placeholder="Enter source"
                value={formData.source}
                onChange={handleChange}
                required
              />
            </div>

            {/* Destination */}
            <div className="form-group">
              <label htmlFor="destination">
                Destination
              </label>

              <input
                id="destination"
                type="text"
                name="destination"
                placeholder="Enter destination"
                value={formData.destination}
                onChange={handleChange}
                required
              />
            </div>

            {/* Travel Date */}
            <div className="form-group">
              <label htmlFor="travelDate">
                Travel Date
              </label>

              <input
                id="travelDate"
                type="date"
                name="travelDate"
                value={formData.travelDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Travel Time */}
            <div className="form-group">
              <label htmlFor="travelTime">
                Travel Time
              </label>

              <input
                id="travelTime"
                type="time"
                name="travelTime"
                value={formData.travelTime}
                onChange={handleChange}
                required
              />
            </div>

            {/* Available Seats */}
            <div className="form-group">
              <label htmlFor="availableSeats">
                Available Seats
              </label>

              <input
                id="availableSeats"
                type="number"
                name="availableSeats"
                placeholder="Enter available seats"
                min="1"
                value={formData.availableSeats}
                onChange={handleChange}
                required
              />
            </div>

            {/* Price Per Seat */}
            <div className="form-group">
              <label htmlFor="pricePerSeat">
                Price per Seat
              </label>

              <input
                id="pricePerSeat"
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

            {/* Vehicle Type */}
            <div className="form-group">
              <label htmlFor="vehicleType">
                Vehicle Type
              </label>

              <select
                id="vehicleType"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select vehicle type
                </option>

                <option value="CAR">
                  Car
                </option>

                <option value="BIKE">
                  Bike
                </option>

                <option value="BUS">
                  Bus
                </option>

                <option value="VAN">
                  Van
                </option>

                <option value="CONTAINER">
                  Container
                </option>

                <option value="AUTO">
                  Auto
                </option>

                <option value="PICKUP_TRUCK">
                  Pickup Truck
                </option>

                <option value="OTHER">
                  Other
                </option>
              </select>
            </div>

            {/* Custom Vehicle Name */}
            {formData.vehicleType === "OTHER" && (
              <div className="form-group">
                <label htmlFor="customVehicleType">
                  Enter Vehicle Name
                </label>

                <input
                  id="customVehicleType"
                  type="text"
                  name="customVehicleType"
                  placeholder="Example: Tractor, Tempo Traveller"
                  value={formData.customVehicleType || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {/* Vehicle Brand */}
            <div className="form-group">
              <label htmlFor="brand">
                Vehicle Brand
              </label>

              <input
                id="brand"
                type="text"
                name="brand"
                placeholder="Example: Honda, Toyota"
                value={formData.brand}
                onChange={handleChange}
                required
              />
            </div>

            {/* Registration Number */}
            <div className="form-group">
              <label htmlFor="registrationNumber">
                Registration Number
              </label>

              <input
                id="registrationNumber"
                type="text"
                name="registrationNumber"
                placeholder="Enter vehicle number"
                value={formData.registrationNumber}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          {/* Description */}
          <div className="form-group">

            <label htmlFor="description">
              Description (Optional)
            </label>

            <textarea
              id="description"
              name="description"
              placeholder="Add additional ride details"
              rows="4"
              maxLength="500"
              value={formData.description}
              onChange={handleChange}
            />

          </div>

          {/* Submit */}
          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Creating Ride..."
              : "Post Ride"}
          </button>

          {/* Success */}
          {message && (
            <p className="success-message">
              {message}
            </p>
          )}

          {/* Error */}
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