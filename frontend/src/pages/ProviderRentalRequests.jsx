
import { useEffect, useState } from "react";

import {
  getProviderRentalRequests,
  respondToRentalRequest,
} from "../services/rentalRequestService.js";

import {
  getMyRentals,
} from "../services/rentalService.js";

function ProviderRentalRequests() {
  const [requests, setRequests] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [selectedListings, setSelectedListings] = useState({});
  const [counterOffers, setCounterOffers] = useState({});
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [requestData, rentalData] = await Promise.all([
        getProviderRentalRequests(),
        getMyRentals(),
      ]);

      setRequests(Array.isArray(requestData) ? requestData : []);
      setRentals(Array.isArray(rentalData) ? rentalData : []);
    } catch (error) {
      console.error("Unable to load provider rental requests:", error);

      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        "Unable to load rental requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAccept = async (request) => {
    const responseId = request.responseId;
    const rentalListingId = selectedListings[responseId];

    if (!rentalListingId) {
      alert("Please select a rental vehicle before accepting.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to accept this rental request?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(responseId);
      setErrorMessage("");
      setSuccessMessage("");

      await respondToRentalRequest(
        responseId,
        "ACCEPT",
        null,
        Number(rentalListingId)
      );

      setSuccessMessage("Rental request accepted successfully.");
      await loadData();
    } catch (error) {
      console.error("Accept rental request failed:", error);

      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        "Unable to accept this rental request."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (responseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this rental request?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(responseId);
      setErrorMessage("");
      setSuccessMessage("");

      await respondToRentalRequest(responseId, "REJECT");

      setSuccessMessage("Rental request rejected.");
      await loadData();
    } catch (error) {
      console.error("Reject rental request failed:", error);

      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        "Unable to reject this rental request."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleCounterOffer = async (request) => {
    const responseId = request.responseId;
    const amount = Number(counterOffers[responseId]);

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Enter a valid counter-offer greater than zero.");
      return;
    }

    const confirmed = window.confirm(
      `Send a counter-offer of ₹${amount}?`
    );

    if (!confirmed) return;

    try {
      setProcessingId(responseId);
      setErrorMessage("");
      setSuccessMessage("");

      await respondToRentalRequest(
        responseId,
        "COUNTER",
        amount
      );

      setSuccessMessage("Counter-offer sent successfully.");
      await loadData();
    } catch (error) {
      console.error("Counter-offer failed:", error);

      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        "Unable to send counter-offer."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "status-pending";
      case "ACCEPTED":
        return "status-confirmed";
      case "REJECTED":
        return "status-cancelled";
      case "COUNTER_OFFERED":
        return "status-pending";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="form-card">
          <h2>Loading rental requests...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-card">
        <h1>Provider Rental Requests</h1>
        <p className="page-description">
          View nearby rental requests and respond to customers.
        </p>

        <button
          type="button"
          className="secondary-button"
          onClick={loadData}
        >
          Refresh Requests
        </button>
      </div>

      {errorMessage && (
        <div className="form-card">
          <p className="error-message">{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="form-card">
          <p>{successMessage}</p>
        </div>
      )}

      {!errorMessage && requests.length === 0 && (
        <div className="form-card">
          <h3>No rental requests available</h3>
          <p>
            New matching requests from nearby customers will appear here.
          </p>
        </div>
      )}

      {requests.length > 0 && (
        <div className="ride-list">
          {requests.map((request) => {
            const matchingRentals = rentals.filter(
              (rental) =>
                rental.vehicleType?.toLowerCase() ===
                  request.vehicleType?.toLowerCase() &&
                rental.status === "AVAILABLE"
            );

            const isPending = request.status === "PENDING";
            const isProcessing =
              processingId === request.responseId;

            return (
              <div className="ride-card" key={request.responseId}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <h2>Rental Request #{request.requestId}</h2>

                  <span className={getStatusClass(request.status)}>
                    {request.status}
                  </span>
                </div>

                <p>
                  <strong>Customer:</strong>{" "}
                  {request.customerName || "Customer"}
                </p>

                <p>
                  <strong>Vehicle Type:</strong>{" "}
                  {request.vehicleType}
                </p>

                <p>
                  <strong>Pickup Location:</strong>{" "}
                  {request.pickupAddress}
                </p>

                <p>
                  <strong>Rental Start:</strong>{" "}
                  {formatDate(request.startDate)}
                </p>

                <p>
                  <strong>Rental End:</strong>{" "}
                  {formatDate(request.endDate)}
                </p>

                <p>
                  <strong>Passengers:</strong>{" "}
                  {request.passengers ?? "Not specified"}
                </p>

                <p>
                  <strong>Customer Budget:</strong>{" "}
                  ₹{request.offeredPrice}
                </p>

                <p>
                  <strong>Negotiable:</strong>{" "}
                  {request.negotiable ? "Yes" : "No"}
                </p>

                {request.description && (
                  <p>
                    <strong>Description:</strong>{" "}
                    {request.description}
                  </p>
                )}

                {request.counterOffer != null && (
                  <p>
                    <strong>Your Counter-offer:</strong>{" "}
                    ₹{request.counterOffer}
                  </p>
                )}

                {request.finalPrice != null && (
                  <p>
                    <strong>Final Price:</strong>{" "}
                    ₹{request.finalPrice}
                  </p>
                )}

                {isPending && (
                  <>
                    <div style={{ marginTop: "18px" }}>
                      <label>
                        <strong>Select your rental vehicle</strong>
                      </label>

                      <select
                        value={
                          selectedListings[request.responseId] || ""
                        }
                        onChange={(event) =>
                          setSelectedListings((previous) => ({
                            ...previous,
                            [request.responseId]: event.target.value,
                          }))
                        }
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "12px",
                          marginTop: "8px",
                          borderRadius: "8px",
                        }}
                      >
                        <option value="">
                          Select an available vehicle
                        </option>

                        {matchingRentals.map((rental) => (
                          <option
                            key={rental.id}
                            value={rental.id}
                          >
                            {rental.brand} {rental.model} —{" "}
                            {rental.registrationNumber} — ₹
                            {rental.pricePerDay}/day
                          </option>
                        ))}
                      </select>

                      {matchingRentals.length === 0 && (
                        <p className="error-message">
                          No available vehicle of this type is currently
                          listed in your account.
                        </p>
                      )}
                    </div>

                    <div style={{ marginTop: "18px" }}>
                      <label>
                        <strong>Counter-offer amount (₹)</strong>
                      </label>

                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={counterOffers[request.responseId] || ""}
                        onChange={(event) =>
                          setCounterOffers((previous) => ({
                            ...previous,
                            [request.responseId]: event.target.value,
                          }))
                        }
                        placeholder="Enter your proposed price"
                        disabled={!request.negotiable}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "12px",
                          marginTop: "8px",
                          borderRadius: "8px",
                        }}
                      />

                      {!request.negotiable && (
                        <p>
                          This customer has disabled negotiation.
                        </p>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginTop: "18px",
                      }}
                    >
                      <button
                        type="button"
                        className="primary-button"
                        disabled={
                          isProcessing ||
                          matchingRentals.length === 0
                        }
                        onClick={() => handleAccept(request)}
                      >
                        {isProcessing ? "Processing..." : "Accept Request"}
                      </button>

                      <button
                        type="button"
                        className="primary-button"
                        disabled={
                          isProcessing || !request.negotiable
                        }
                        onClick={() => handleCounterOffer(request)}
                      >
                        Send Counter-offer
                      </button>

                      <button
                        type="button"
                        className="secondary-button"
                        disabled={isProcessing}
                        onClick={() =>
                          handleReject(request.responseId)
                        }
                      >
                        Reject
                      </button>
                    </div>
                  </>
                )}

                {!isPending && (
                  <p>
                    This request has already been responded to.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProviderRentalRequests;
