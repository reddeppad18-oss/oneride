import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Users,
  IndianRupee,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  MessageCircle,
  Clock,
  Send,
} from "lucide-react";

import {
  getProviderRideRequests,
  respondToRideRequest,
} from "../services/rideRequestService";

const ProviderRideRequests = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const [counterValues, setCounterValues] = useState({});

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   * =========================
   * LOAD PROVIDER REQUESTS
   * =========================
   */

  const loadRequests = async (showRefresh = false) => {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getProviderRideRequests();

      setRequests(Array.isArray(data) ? data : []);
    } catch (requestError) {
      console.error(
        "Failed to load provider ride requests:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Failed to load ride requests."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  /*
   * =========================
   * COUNTER INPUT
   * =========================
   */

  const handleCounterChange = (
    responseId,
    value
  ) => {
    setCounterValues((previous) => ({
      ...previous,
      [responseId]: value,
    }));

    setError("");
    setSuccess("");
  };

  /*
   * =========================
   * PROVIDER ACTION
   * =========================
   */

  const handleAction = async (
    responseId,
    action
  ) => {
    setError("");
    setSuccess("");

    let counterOffer = null;

    if (action === "COUNTER") {
      const value =
        counterValues[responseId];

      if (
        value === undefined ||
        value === "" ||
        Number(value) <= 0
      ) {
        setError(
          "Please enter a valid counter-offer amount."
        );
        return;
      }

      counterOffer = Number(value);
    }

    try {
      setActionLoading(
        `${responseId}-${action}`
      );

      await respondToRideRequest(
        responseId,
        action,
        counterOffer
      );

      if (action === "ACCEPT") {
        setSuccess(
          "Ride request accepted successfully."
        );
      } else if (action === "REJECT") {
        setSuccess(
          "Ride request rejected."
        );
      } else {
        setSuccess(
          "Counter-offer sent successfully."
        );
      }

      /*
       * Reload requests so the provider sees
       * the latest status immediately.
       */

      await loadRequests(true);

    } catch (actionError) {
      console.error(
        "Failed to respond to ride request:",
        actionError
      );

      setError(
        actionError.response?.data?.message ||
          actionError.message ||
          "Failed to process the ride request."
      );
    } finally {
      setActionLoading(null);
    }
  };

  /*
   * =========================
   * STATUS HELPERS
   * =========================
   */

  const getStatusClass = (status) => {
    switch (
      String(status || "").toUpperCase()
    ) {
      case "ACCEPTED":
        return "status-success";

      case "REJECTED":
      case "CANCELLED":
        return "status-danger";

      case "COUNTER_OFFERED":
        return "status-warning";

      case "SEARCHING":
      case "PENDING":
      default:
        return "status-pending";
    }
  };

  const getStatusIcon = (status) => {
    switch (
      String(status || "").toUpperCase()
    ) {
      case "ACCEPTED":
        return <CheckCircle size={16} />;

      case "REJECTED":
      case "CANCELLED":
        return <XCircle size={16} />;

      case "COUNTER_OFFERED":
        return <MessageCircle size={16} />;

      default:
        return <Clock size={16} />;
    }
  };

  const formatStatus = (status) => {
    if (!status) {
      return "Unknown";
    }

    return String(status)
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  /*
   * =========================
   * RENDER
   * =========================
   */

  return (
    <div className="page-container">

      {/* =========================
          HEADER
      ========================= */}

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
          <h1>Ride Requests</h1>

          <p>
            Nearby customers looking for a ride
            will appear here.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() => loadRequests(true)}
          disabled={refreshing}
        >
          {refreshing ? (
            <>
              <Loader2
                size={18}
                className="spin"
              />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw size={18} />
              Refresh
            </>
          )}
        </button>

      </div>

      {/* =========================
          MESSAGES
      ========================= */}

      {error && (
        <div className="error-message">
          <XCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="success-message">
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      {/* =========================
          LOADING
      ========================= */}

      {loading ? (
        <div className="loading-state">

          <Loader2
            size={32}
            className="spin"
          />

          <p>
            Looking for nearby ride requests...
          </p>

        </div>
      ) : requests.length === 0 ? (
        <div className="empty-state">

          <MapPin size={42} />

          <h2>No Ride Requests</h2>

          <p>
            There are currently no nearby ride
            requests available for you.
          </p>

          <button
            type="button"
            className="secondary-button"
            onClick={() => loadRequests(true)}
          >
            <RefreshCw size={18} />
            Check Again
          </button>

        </div>
      ) : (
        <div className="cards-grid">

          {requests.map((item) => {

            /*
             * The provider endpoint returns RequestResponseDto.
             */

            const responseId =
              item.responseId;

            const status =
              String(
                item.status || "PENDING"
              ).toUpperCase();

            const requestId =
              item.requestId;

            const isPending =
              status === "PENDING";

            return (
              <div
                className="form-card provider-request-card"
                key={responseId}
              >

                {/* =========================
                    HEADER
                ========================= */}

                <div className="card-header">

                  <div>

                    <h2>
                      Ride Request #{requestId}
                    </h2>

                    <span className="request-date">
                      Customer:{" "}
                      {item.customerName ||
                        "Customer"}
                    </span>

                  </div>

                  <div
                    className={`status-badge ${getStatusClass(
                      status
                    )}`}
                  >
                    {getStatusIcon(status)}

                    {formatStatus(status)}
                  </div>

                </div>

                {/* =========================
                    ROUTE
                ========================= */}

                <div className="route-section">

                  <div className="route-point">

                    <span className="route-dot pickup-dot" />

                    <div>

                      <small>
                        Pickup
                      </small>

                      <strong>
                        {item.pickupAddress ||
                          "Pickup location"}
                      </strong>

                    </div>

                  </div>

                  <div className="route-line" />

                  <div className="route-point">

                    <span className="route-dot destination-dot" />

                    <div>

                      <small>
                        Destination
                      </small>

                      <strong>
                        {item.destinationAddress ||
                          "Destination"}
                      </strong>

                    </div>

                  </div>

                </div>

                {/* =========================
                    CUSTOMER DETAILS
                ========================= */}

                <div className="request-details">

                  <div className="detail-item">

                    <Users size={18} />

                    <div>

                      <small>
                        Seats
                      </small>

                      <strong>
                        {item.requestedSeats}
                      </strong>

                    </div>

                  </div>

                  <div className="detail-item">

                    <IndianRupee size={18} />

                    <div>

                      <small>
                        Offered Price
                      </small>

                      <strong>
                        ₹
                        {Number(
                          item.offeredPrice || 0
                        ).toFixed(2)}
                      </strong>

                    </div>

                  </div>

                </div>

                {/* =========================
                    PROVIDER ACTIONS
                ========================= */}

                {isPending && (
                  <div className="provider-actions">

                    {/* ACCEPT */}

                    <button
                      type="button"
                      className="primary-button"
                      disabled={
                        actionLoading !== null
                      }
                      onClick={() =>
                        handleAction(
                          responseId,
                          "ACCEPT"
                        )
                      }
                    >
                      {actionLoading ===
                      `${responseId}-ACCEPT` ? (
                        <>
                          <Loader2
                            size={16}
                            className="spin"
                          />
                          Accepting...
                        </>
                      ) : (
                        <>
                          <CheckCircle
                            size={16}
                          />
                          Accept
                        </>
                      )}
                    </button>

                    {/* REJECT */}

                    <button
                      type="button"
                      className="danger-button"
                      disabled={
                        actionLoading !== null
                      }
                      onClick={() =>
                        handleAction(
                          responseId,
                          "REJECT"
                        )
                      }
                    >
                      {actionLoading ===
                      `${responseId}-REJECT` ? (
                        <>
                          <Loader2
                            size={16}
                            className="spin"
                          />
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <XCircle
                            size={16}
                          />
                          Reject
                        </>
                      )}
                    </button>

                    {/* COUNTER */}

                    {item.negotiable !==
                      false && (
                      <div className="counter-offer-box">

                        <label>
                          <IndianRupee
                            size={16}
                          />
                          Counter Offer
                        </label>

                        <div className="counter-input-row">

                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="Enter amount"
                            value={
                              counterValues[
                                responseId
                              ] || ""
                            }
                            onChange={(event) =>
                              handleCounterChange(
                                responseId,
                                event.target.value
                              )
                            }
                          />

                          <button
                            type="button"
                            className="secondary-button"
                            disabled={
                              actionLoading !==
                              null
                            }
                            onClick={() =>
                              handleAction(
                                responseId,
                                "COUNTER"
                              )
                            }
                          >
                            {actionLoading ===
                            `${responseId}-COUNTER` ? (
                              <>
                                <Loader2
                                  size={16}
                                  className="spin"
                                />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send
                                  size={16}
                                />
                                Send Counter
                              </>
                            )}
                          </button>

                        </div>

                      </div>
                    )}

                  </div>
                )}

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default ProviderRideRequests;
