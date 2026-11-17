
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Navigation,
  Search,
  Users,
  IndianRupee,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  CalendarDays,
  CarFront,
} from "lucide-react";

import { createRentalRequest } from "../services/rentalRequestService";

const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const RentalRequest = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vehicleType: "",
    customVehicleType: "",
    pickupAddress: "",
    pickupLatitude: null,
    pickupLongitude: null,
    startDate: "",
    endDate: "",
    passengers: 1,
    description: "",
    offeredPrice: "",
    negotiable: true,
  });

  const [locationLoading, setLocationLoading] = useState(false);
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [locationMessage, setLocationMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess("");

    if (name === "pickupAddress") {
      setFormData((previous) => ({
        ...previous,
        pickupAddress: value,
        pickupLatitude: null,
        pickupLongitude: null,
      }));

      setLocationMessage("");
    }

    if (name === "startDate") {
      setFormData((previous) => ({
        ...previous,
        startDate: value,
        endDate:
          previous.endDate && previous.endDate < value
            ? ""
            : previous.endDate,
      }));
    }
  };

  // Detect current location
  const getCurrentLocation = () => {
    setError("");
    setLocationMessage("");
    setLocationLoading(true);

    if (!navigator.geolocation) {
      setLocationLoading(false);
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setFormData((previous) => ({
          ...previous,
          pickupLatitude: latitude,
          pickupLongitude: longitude,
        }));

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );

          if (response.ok) {
            const data = await response.json();

            if (data.display_name) {
              setFormData((previous) => ({
                ...previous,
                pickupAddress: data.display_name,
              }));

              setLocationMessage(
                "Current pickup location detected successfully."
              );
            } else {
              setLocationMessage(
                "Coordinates detected. Please enter your address."
              );
            }
          } else {
            setLocationMessage(
              "Coordinates detected. Please enter your address."
            );
          }
        } catch (locationError) {
          console.error("Reverse geocoding failed:", locationError);

          setLocationMessage(
            "Coordinates detected. Please enter your address."
          );
        } finally {
          setLocationLoading(false);
        }
      },
      (locationError) => {
        setLocationLoading(false);

        if (locationError.code === locationError.PERMISSION_DENIED) {
          setError("Location permission denied. Please allow location access.");
        } else if (
          locationError.code === locationError.POSITION_UNAVAILABLE
        ) {
          setError("Your current location is unavailable. Please try again.");
        } else if (locationError.code === locationError.TIMEOUT) {
          setError("Location request timed out. Please try again.");
        } else {
          setError("Unable to detect your location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000,
      }
    );
  };

  // Find coordinates using the entered address
  const findPickupLocation = async () => {
    const address = formData.pickupAddress.trim();

    if (!address) {
      setError("Please enter your pickup address first.");
      return;
    }

    setError("");
    setLocationMessage("");
    setSearchingLocation(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(
          address
        )}`
      );

      if (!response.ok) {
        throw new Error("Location search failed.");
      }

      const results = await response.json();

      if (!results || results.length === 0) {
        throw new Error("Pickup location could not be found.");
      }

      const latitude = Number(results[0].lat);
      const longitude = Number(results[0].lon);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        throw new Error("Invalid location coordinates.");
      }

      setFormData((previous) => ({
        ...previous,
        pickupLatitude: latitude,
        pickupLongitude: longitude,
      }));

      setLocationMessage(
        `Pickup location found: ${results[0].display_name}`
      );
    } catch (locationError) {
      console.error("Pickup location search failed:", locationError);
      setError(locationError.message || "Unable to find pickup location.");
    } finally {
      setSearchingLocation(false);
    }
  };

  // Validate request
  const validateForm = () => {
    if (!formData.vehicleType) {
      setError("Please select a vehicle type.");
      return false;
    }

    if (
      formData.vehicleType === "OTHER" &&
      !formData.customVehicleType.trim()
    ) {
      setError("Please enter your required vehicle type.");
      return false;
    }

    if (!formData.pickupAddress.trim()) {
      setError("Please enter your pickup address.");
      return false;
    }

    if (
      formData.pickupLatitude === null ||
      formData.pickupLongitude === null
    ) {
      setError("Please find or detect your pickup location.");
      return false;
    }

    if (!formData.startDate || !formData.endDate) {
      setError("Please select your rental start and end dates.");
      return false;
    }

    if (formData.startDate < getToday()) {
      setError("Rental start date cannot be in the past.");
      return false;
    }

    if (formData.endDate < formData.startDate) {
      setError("End date cannot be before the start date.");
      return false;
    }

    const passengers = Number(formData.passengers);

    if (!Number.isInteger(passengers) || passengers < 1) {
      setError("Passengers must be at least 1.");
      return false;
    }

    const price = Number(formData.offeredPrice);

    if (!Number.isFinite(price) || price <= 0) {
      setError("Please enter an offered price greater than zero.");
      return false;
    }

    if (formData.description.length > 500) {
      setError("Description cannot exceed 500 characters.");
      return false;
    }

    return true;
  };

  // Submit rental request
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const requestData = {
        vehicleType:
          formData.vehicleType === "OTHER"
            ? formData.customVehicleType.trim()
            : formData.vehicleType,

        pickupAddress: formData.pickupAddress.trim(),

        pickupLatitude: Number(formData.pickupLatitude),

        pickupLongitude: Number(formData.pickupLongitude),

        startDate: formData.startDate,

        endDate: formData.endDate,

        passengers: Number(formData.passengers),

        description: formData.description.trim(),

        offeredPrice: Number(formData.offeredPrice),

        negotiable: Boolean(formData.negotiable),
      };

      console.log("Creating rental request:", requestData);

      await createRentalRequest(requestData);

      setSuccess(
        "Rental request submitted successfully! We are searching for nearby rental providers."
      );

      setTimeout(() => {
        navigate("/my-rental-requests");
      }, 1500);
    } catch (requestError) {
      console.error("Rental request failed:", requestError);

      setError(
        requestError.response?.data?.message ||
          requestError.response?.data?.error ||
          requestError.message ||
          "Unable to submit rental request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div>
          <h1>Request a Rental Vehicle</h1>
          <p>
            Tell us what vehicle you need. Nearby rental providers
            can respond with their offers.
          </p>
        </div>
      </div>

      <div className="form-card">
        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="success-message">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* VEHICLE DETAILS */}
          <div className="form-section">
            <h2>
              <CarFront size={20} />
              Vehicle Requirements
            </h2>

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
                <option value="">Select vehicle type</option>
                <option value="CAR">Car</option>
                <option value="BIKE">Bike</option>
                <option value="BUS">Bus</option>
                <option value="VAN">Van</option>
                <option value="CONTAINER">Container</option>
                <option value="AUTO">Auto</option>
                <option value="PICKUP_TRUCK">Pickup Truck</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {formData.vehicleType === "OTHER" && (
              <div className="form-group">
                <label htmlFor="customVehicleType">
                  Enter Vehicle Type
                </label>

                <input
                  id="customVehicleType"
                  name="customVehicleType"
                  type="text"
                  value={formData.customVehicleType}
                  onChange={handleChange}
                  placeholder="Example: Tractor, JCB, Hitachi"
                  maxLength="100"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="passengers">
                Number of Passengers
              </label>

              <div className="input-with-icon">
                <Users size={18} />

                <input
                  id="passengers"
                  name="passengers"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.passengers}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* PICKUP LOCATION */}
          <div className="form-section">
            <h2>
              <MapPin size={20} />
              Pickup Location
            </h2>

            <div className="form-group">
              <label htmlFor="pickupAddress">
                Pickup Address
              </label>

              <textarea
                id="pickupAddress"
                name="pickupAddress"
                rows="3"
                maxLength="300"
                value={formData.pickupAddress}
                onChange={handleChange}
                placeholder="Enter your pickup address"
                required
              />
            </div>

            <div className="form-grid">
              <button
                type="button"
                className="secondary-button"
                onClick={getCurrentLocation}
                disabled={locationLoading}
              >
                {locationLoading ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <Navigation size={18} />
                    Use My Location
                  </>
                )}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={findPickupLocation}
                disabled={
                  searchingLocation ||
                  !formData.pickupAddress.trim()
                }
              >
                {searchingLocation ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    Finding...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Find Address
                  </>
                )}
              </button>
            </div>

            {locationMessage && (
              <div className="location-success">
                <CheckCircle size={18} />
                <span>{locationMessage}</span>
              </div>
            )}

            {formData.pickupLatitude !== null &&
              formData.pickupLongitude !== null && (
                <div className="coordinates-info">
                  <small>
                    Coordinates detected:
                    <br />
                    {formData.pickupLatitude.toFixed(6)},{" "}
                    {formData.pickupLongitude.toFixed(6)}
                  </small>
                </div>
              )}
          </div>

          {/* RENTAL DATES */}
          <div className="form-section">
            <h2>
              <CalendarDays size={20} />
              Rental Period
            </h2>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="startDate">
                  Start Date
                </label>

                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  min={getToday()}
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">
                  End Date
                </label>

                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  min={formData.startDate || getToday()}
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* PRICE */}
          <div className="form-section">
            <h2>
              <IndianRupee size={20} />
              Budget and Offer
            </h2>

            <div className="form-group">
              <label htmlFor="offeredPrice">
                Your Total Offered Price (₹)
              </label>

              <div className="input-with-icon">
                <IndianRupee size={18} />

                <input
                  id="offeredPrice"
                  name="offeredPrice"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.offeredPrice}
                  onChange={handleChange}
                  placeholder="Enter your total rental budget"
                  required
                />
              </div>

              <small>
                Enter your total offer for the selected rental period.
              </small>
            </div>

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="negotiable"
                  checked={formData.negotiable}
                  onChange={handleChange}
                />

                <span>My offered price is negotiable</span>
              </label>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="form-section">
            <h2>Additional Requirements</h2>

            <div className="form-group">
              <label htmlFor="description">
                Description (Optional)
              </label>

              <textarea
                id="description"
                name="description"
                rows="4"
                maxLength="500"
                value={formData.description}
                onChange={handleChange}
                placeholder="Mention any additional requirements..."
              />

              <small>
                {formData.description.length}/500 characters
              </small>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="primary-button"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="spin" />
                Sending Rental Request...
              </>
            ) : (
              <>
                <Search size={18} />
                Find Nearby Rental Providers
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RentalRequest;
