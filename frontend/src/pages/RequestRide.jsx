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
} from "lucide-react";

import { createRideRequest } from "../services/rideRequestService";

const RequestRide = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pickupAddress: "",
    pickupLatitude: null,
    pickupLongitude: null,
    destinationAddress: "",
    destinationLatitude: null,
    destinationLongitude: null,
    requestedSeats: 1,
    offeredPrice: "",
    negotiable: true,
  });

  const [locationLoading, setLocationLoading] = useState(false);
  const [destinationLoading, setDestinationLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [locationMessage, setLocationMessage] = useState("");
  const [destinationMessage, setDestinationMessage] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   * =========================
   * HANDLE INPUT
   * =========================
   */

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");

    if (name === "destinationAddress") {
      setFormData((previous) => ({
        ...previous,
        destinationAddress: value,
        destinationLatitude: null,
        destinationLongitude: null,
      }));

      setDestinationMessage("");
    }
  };

  /*
   * =========================
   * GET CURRENT LOCATION
   * =========================
   */

  const getCurrentLocation = () => {
    setError("");
    setLocationMessage("");
    setLocationLoading(true);

    if (!navigator.geolocation) {
      setLocationLoading(false);
      setError(
        "Geolocation is not supported by your browser. Please use a supported browser."
      );
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

        /*
         * Try to convert current coordinates into a readable address.
         * If reverse geocoding fails, the user can still manually enter
         * the pickup address.
         */

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );

          if (response.ok) {
            const data = await response.json();

            if (data.display_name) {
              setFormData((previous) => ({
                ...previous,
                pickupAddress: data.display_name,
              }));

              setLocationMessage("Current location detected successfully.");
            } else {
              setLocationMessage(
                "Location detected. Please enter your pickup address."
              );
            }
          } else {
            setLocationMessage(
              "Location detected. Please enter your pickup address."
            );
          }
        } catch (geocodingError) {
          console.error("Reverse geocoding failed:", geocodingError);

          setLocationMessage(
            "Location detected. Please enter your pickup address."
          );
        } finally {
          setLocationLoading(false);
        }
      },
      (geolocationError) => {
        setLocationLoading(false);

        let message =
          "Unable to get your current location. Please allow location access.";

        if (geolocationError.code === geolocationError.PERMISSION_DENIED) {
          message =
            "Location permission was denied. Please allow location access in your browser settings.";
        } else if (
          geolocationError.code === geolocationError.POSITION_UNAVAILABLE
        ) {
          message =
            "Your current location is unavailable. Please try again.";
        } else if (
          geolocationError.code === geolocationError.TIMEOUT
        ) {
          message =
            "Location request timed out. Please try again.";
        }

        setError(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000,
      }
    );
  };

  /*
   * =========================
   * GEOCODE DESTINATION
   * =========================
   */

  const geocodeDestination = async () => {
    const address = formData.destinationAddress.trim();

    if (!address) {
      setError("Please enter a destination address.");
      return;
    }

    setError("");
    setDestinationMessage("");
    setDestinationLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&addressdetails=1&q=${encodeURIComponent(
          address
        )}`
      );

      if (!response.ok) {
        throw new Error("Destination search failed.");
      }

      const results = await response.json();

      if (!results || results.length === 0) {
        setFormData((previous) => ({
          ...previous,
          destinationLatitude: null,
          destinationLongitude: null,
        }));

        setDestinationMessage("");
        setError(
          "Destination could not be found. Please enter a more specific address or place."
        );
        return;
      }

      const destination = results[0];

      const latitude = Number(destination.lat);
      const longitude = Number(destination.lon);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        throw new Error("Invalid destination coordinates.");
      }

      setFormData((previous) => ({
        ...previous,
        destinationAddress:
          previous.destinationAddress.trim(),
        destinationLatitude: latitude,
        destinationLongitude: longitude,
      }));

      setDestinationMessage(
        `Destination found: ${destination.display_name}`
      );
    } catch (geocodingError) {
      console.error(
        "Destination geocoding failed:",
        geocodingError
      );

      setError(
        "Unable to find the destination right now. Please try again."
      );
    } finally {
      setDestinationLoading(false);
    }
  };

  /*
   * =========================
   * VALIDATION
   * =========================
   */

  const validateForm = () => {
    if (!formData.pickupAddress.trim()) {
      setError("Please enter your pickup address.");
      return false;
    }

    if (
      formData.pickupLatitude === null ||
      formData.pickupLongitude === null
    ) {
      setError(
        "Please detect your pickup location before submitting the request."
      );
      return false;
    }

    if (!formData.destinationAddress.trim()) {
      setError("Please enter your destination.");
      return false;
    }

    if (
      formData.destinationLatitude === null ||
      formData.destinationLongitude === null
    ) {
      setError(
        "Please find the destination location before submitting the request."
      );
      return false;
    }

    const seats = Number(formData.requestedSeats);

    if (!Number.isInteger(seats) || seats < 1) {
      setError("Requested seats must be at least 1.");
      return false;
    }

    const price = Number(formData.offeredPrice);

    if (!Number.isFinite(price) || price < 0) {
      setError("Please enter a valid offered price.");
      return false;
    }

    return true;
  };

  /*
   * =========================
   * SUBMIT REQUEST
   * =========================
   */

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
        pickupAddress: formData.pickupAddress.trim(),

        pickupLatitude: Number(formData.pickupLatitude),

        pickupLongitude: Number(formData.pickupLongitude),

        destinationAddress:
          formData.destinationAddress.trim(),

        destinationLatitude:
          Number(formData.destinationLatitude),

        destinationLongitude:
          Number(formData.destinationLongitude),

        requestedSeats:
          Number(formData.requestedSeats),

        offeredPrice:
          Number(formData.offeredPrice),

        negotiable:
          Boolean(formData.negotiable),
      };

      console.log("Creating ride request:", requestData);

      const response = await createRideRequest(requestData);

      console.log("Ride request created:", response);

      setSuccess(
        "Ride request created successfully. We are searching for nearby providers."
      );

      /*
       * Give the user a moment to see the success message.
       */

      setTimeout(() => {
        navigate("/my-ride-requests");
      }, 1500);
    } catch (requestError) {
      console.error(
        "Failed to create ride request:",
        requestError
      );

      const backendMessage =
        requestError.response?.data?.message;

      setError(
        backendMessage ||
          requestError.message ||
          "Failed to create ride request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * =========================
   * RENDER
   * =========================
   */

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
          <h1>Request a Ride</h1>
          <p>
            Tell us where you want to go and nearby ride providers
            can respond to your request.
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

          {/* =========================
              PICKUP LOCATION
          ========================= */}

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
                value={formData.pickupAddress}
                onChange={handleChange}
                placeholder="Enter your pickup address"
                rows="3"
                required
              />

            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={getCurrentLocation}
              disabled={locationLoading}
            >
              {locationLoading ? (
                <>
                  <Loader2
                    size={18}
                    className="spin"
                  />
                  Detecting location...
                </>
              ) : (
                <>
                  <Navigation size={18} />
                  Use My Current Location
                </>
              )}
            </button>

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

          {/* =========================
              DESTINATION
          ========================= */}

          <div className="form-section">

            <h2>
              <MapPin size={20} />
              Destination
            </h2>

            <div className="form-group">

              <label htmlFor="destinationAddress">
                Destination Address
              </label>

              <textarea
                id="destinationAddress"
                name="destinationAddress"
                value={formData.destinationAddress}
                onChange={handleChange}
                placeholder="Example: Tirupati Railway Station"
                rows="3"
                required
              />

            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={geocodeDestination}
              disabled={
                destinationLoading ||
                !formData.destinationAddress.trim()
              }
            >
              {destinationLoading ? (
                <>
                  <Loader2
                    size={18}
                    className="spin"
                  />
                  Finding destination...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Find Destination
                </>
              )}
            </button>

            {destinationMessage && (
              <div className="location-success">
                <CheckCircle size={18} />
                <span>{destinationMessage}</span>
              </div>
            )}

            {formData.destinationLatitude !== null &&
              formData.destinationLongitude !== null && (
                <div className="coordinates-info">
                  <small>
                    Destination coordinates:
                    <br />
                    {formData.destinationLatitude.toFixed(6)},{" "}
                    {formData.destinationLongitude.toFixed(6)}
                  </small>
                </div>
              )}

          </div>

          {/* =========================
              RIDE DETAILS
          ========================= */}

          <div className="form-section">

            <h2>
              <Users size={20} />
              Ride Details
            </h2>

            <div className="form-group">

              <label htmlFor="requestedSeats">
                Number of Seats
              </label>

              <input
                id="requestedSeats"
                name="requestedSeats"
                type="number"
                min="1"
                step="1"
                value={formData.requestedSeats}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label htmlFor="offeredPrice">
                Offered Price
              </label>

              <div className="input-with-icon">
                <IndianRupee size={18} />

                <input
                  id="offeredPrice"
                  name="offeredPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.offeredPrice}
                  onChange={handleChange}
                  placeholder="Enter your offered price"
                  required
                />
              </div>

            </div>

            <div className="checkbox-group">

              <label>
                <input
                  type="checkbox"
                  name="negotiable"
                  checked={formData.negotiable}
                  onChange={handleChange}
                />

                <span>
                  Price is negotiable
                </span>
              </label>

            </div>

          </div>

          {/* =========================
              SUBMIT
          ========================= */}

          <button
            type="submit"
            className="primary-button"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2
                  size={18}
                  className="spin"
                />
                Sending Request...
              </>
            ) : (
              <>
                <Search size={18} />
                Find Nearby Ride Providers
              </>
            )}
          </button>

        </form>

      </div>

    </div>
  );
};

export default RequestRide;