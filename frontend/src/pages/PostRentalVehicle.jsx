import { useState } from "react";
import { createRental } from "../services/rentalService.js";

function PostRentalVehicle() {
  const [formData, setFormData] = useState({
    vehicleType: "",
    customVehicleType: "",
    brand: "",
    vehicleModel: "",
    vehicleNumber: "",
    seats: "",
    pricePerDay: "",
    location: "",
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
      const rentalData = {
        vehicleType:
          formData.vehicleType === "OTHER"
            ? formData.customVehicleType
            : formData.vehicleType,

        brand: formData.brand,
        vehicleModel: formData.vehicleModel,
        vehicleNumber: formData.vehicleNumber,
        seats: Number(formData.seats),
        pricePerDay: Number(formData.pricePerDay),
        location: formData.location,
        description: formData.description,
      };

      console.log("Creating rental:", rentalData);

      const response = await createRental(rentalData);

      console.log(
        "Create rental response:",
        response
      );

      setMessage(
        "Rental vehicle posted successfully."
      );

      setFormData({
        vehicleType: "",
        customVehicleType: "",
        brand: "",
        vehicleModel: "",
        vehicleNumber: "",
        seats: "",
        pricePerDay: "",
        location: "",
        description: "",
      });

    } catch (error) {
      console.error(
        "Create rental error:",
        error
      );

      if (error.response?.data?.message) {
        setErrorMessage(
          error.response.data.message
        );
      } else if (error.response?.data) {
        setErrorMessage(
          JSON.stringify(error.response.data)
        );
      } else {
        setErrorMessage(
          error.message ||
            "Unable to post rental vehicle."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">

      <div className="form-card">

        <h1>Post Vehicle for Rental</h1>

        <p className="page-description">
          List your vehicle and allow other users
          to rent it.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

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
                  value={
                    formData.customVehicleType
                  }
                  onChange={handleChange}
                  required
                />

              </div>
            )}

            {/* Brand */}
            <div className="form-group">

              <label htmlFor="brand">
                Brand
              </label>

              <input
                id="brand"
                type="text"
                name="brand"
                placeholder="Example: Honda"
                value={formData.brand}
                onChange={handleChange}
                required
              />

            </div>

            {/* Model */}
            <div className="form-group">

              <label htmlFor="vehicleModel">
                Vehicle Model
              </label>

              <input
                id="vehicleModel"
                type="text"
                name="vehicleModel"
                placeholder="Example: City"
                value={formData.vehicleModel}
                onChange={handleChange}
                required
              />

            </div>

            {/* Registration Number */}
            <div className="form-group">

              <label htmlFor="vehicleNumber">
                Registration Number
              </label>

              <input
                id="vehicleNumber"
                type="text"
                name="vehicleNumber"
                placeholder="Example: KA01AB1234"
                value={formData.vehicleNumber}
                onChange={handleChange}
                required
              />

            </div>

            {/* Seats */}
            <div className="form-group">

              <label htmlFor="seats">
                Number of Seats
              </label>

              <input
                id="seats"
                type="number"
                name="seats"
                min="1"
                placeholder="Enter number of seats"
                value={formData.seats}
                onChange={handleChange}
                required
              />

            </div>

            {/* Price */}
            <div className="form-group">

              <label htmlFor="pricePerDay">
                Price Per Day
              </label>

              <input
                id="pricePerDay"
                type="number"
                name="pricePerDay"
                min="1"
                step="0.01"
                placeholder="Enter price per day"
                value={formData.pricePerDay}
                onChange={handleChange}
                required
              />

            </div>

            {/* Location */}
            <div className="form-group">

              <label htmlFor="location">
                Location
              </label>

              <input
                id="location"
                type="text"
                name="location"
                placeholder="Example: Bangalore"
                value={formData.location}
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
              placeholder="Add additional details about the vehicle"
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
              ? "Posting Vehicle..."
              : "Post Vehicle"}
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

export default PostRentalVehicle;