import { useNavigate } from "react-router-dom";

function MyActivity() {
  const navigate = useNavigate();

  return (
    <div className="page-container">

      <div className="form-card">

        <h1>My Activity</h1>

        <p className="page-description">
          View and manage all your activities
          in One Ride.
        </p>

      </div>


      <div className="form-card">

        <h2>Ride Activity</h2>

        <p>
          Manage your ride sharing activities.
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "15px",
          }}
        >

          <button
            type="button"
            className="primary-button"
            onClick={() =>
              navigate("/my-bookings")
            }
          >
            My Ride Bookings
          </button>


          <button
            type="button"
            className="primary-button"
            onClick={() =>
              navigate("/my-rides")
            }
          >
            My Posted Rides
          </button>

        </div>

      </div>


      <div className="form-card">

        <h2>Rental Activity</h2>

        <p>
          Manage your vehicle rental activities.
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "15px",
          }}
        >

          <button
            type="button"
            className="primary-button"
            onClick={() =>
              navigate("/rental-booking-history")
            }
          >
            Rental Booking History
          </button>


          <button
            type="button"
            className="primary-button"
            onClick={() =>
              navigate("/my-rentals")
            }
          >
            My Rental Vehicles
          </button>

        </div>

      </div>

    </div>
  );
}

export default MyActivity;