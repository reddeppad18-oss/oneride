import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <>
      <header className="dashboard-header">
        <div>
          <h1>Welcome to Alridez</h1>

          <p>
            Find a ride, share a ride, or rent a vehicle.
          </p>
        </div>
      </header>

      <section className="dashboard-cards">

        {/* POST RIDE */}
        <div className="dashboard-card">
          <div className="card-icon">🚗</div>

          <h3>Post a Ride</h3>

          <p>
            Share your journey and allow other users
            to book available seats.
          </p>

          <Link
            to="/post-ride"
            className="dashboard-card-button"
          >
            Post Ride
          </Link>
        </div>

        {/* SEARCH RIDES */}
        <div className="dashboard-card">
          <div className="card-icon">🔍</div>

          <h3>Search Rides</h3>

          <p>
            Find rides by source, destination,
            and travel date.
          </p>

          <Link
            to="/search-rides"
            className="dashboard-card-button"
          >
            Search Rides
          </Link>
        </div>

        {/* MY POSTED RIDES */}
        <div className="dashboard-card">
          <div className="card-icon">📋</div>

          <h3>My Posted Rides</h3>

          <p>
            View your posted rides and manage
            passenger bookings.
          </p>

          <Link
            to="/my-rides"
            className="dashboard-card-button"
          >
            Manage Rides
          </Link>
        </div>

        {/* MY RIDE REQUESTS */}
        <div className="dashboard-card">
          <div className="card-icon">🛣️</div>

          <h3>My Ride Requests</h3>

          <p>
            View the ride requests you have submitted
            and track their progress.
          </p>

          <Link
            to="/my-ride-requests"
            className="dashboard-card-button"
          >
            View My Requests
          </Link>
        </div>

        {/* PROVIDER RIDE REQUESTS */}
        <div className="dashboard-card">
          <div className="card-icon">🤝</div>

          <h3>Provider Ride Requests</h3>

          <p>
            Review incoming ride requests and respond
            to eligible customer requests.
          </p>

          <Link
            to="/provider-ride-requests"
            className="dashboard-card-button"
          >
            Manage Requests
          </Link>
        </div>

        {/* SEARCH RENTAL VEHICLES */}
        <div className="dashboard-card">
          <div className="card-icon">🚙</div>

          <h3>Rental Vehicles</h3>

          <p>
            Explore available vehicles for your
            personal or business needs.
          </p>

          <Link
            to="/rental-vehicles"
            className="dashboard-card-button"
          >
            View Vehicles
          </Link>
        </div>

        {/* POST RENTAL VEHICLE */}
        <div className="dashboard-card">
          <div className="card-icon">🔑</div>

          <h3>Post a Rental Vehicle</h3>

          <p>
            List your vehicle and make it available
            for other users to rent.
          </p>

          <Link
            to="/post-rental-vehicle"
            className="dashboard-card-button"
          >
            Post Vehicle
          </Link>
        </div>

        {/* MY RENTALS */}
        <div className="dashboard-card">
          <div className="card-icon">🚘</div>

          <h3>My Rental Vehicles</h3>

          <p>
            Manage your listed vehicles and access
            their existing booking management pages.
          </p>

          <Link
            to="/my-rentals"
            className="dashboard-card-button"
          >
            Manage Rentals
          </Link>
        </div>

        {/* MY BOOKINGS */}
        <div className="dashboard-card">
          <div className="card-icon">📅</div>

          <h3>My Bookings</h3>

          <p>
            Review your ride bookings and their
            current booking status.
          </p>

          <Link
            to="/my-bookings"
            className="dashboard-card-button"
          >
            View Bookings
          </Link>
        </div>

        {/* RENTAL BOOKING HISTORY */}
        <div className="dashboard-card">
          <div className="card-icon">🧾</div>

          <h3>Rental Booking History</h3>

          <p>
            Review your previous and current
            rental booking records.
          </p>

          <Link
            to="/rental-booking-history"
            className="dashboard-card-button"
          >
            View Rental History
          </Link>
        </div>

        {/* NOTIFICATIONS */}
        <div className="dashboard-card">
          <div className="card-icon">🔔</div>

          <h3>Notifications</h3>

          <p>
            Check booking updates, request responses,
            and other account notifications.
          </p>

          <Link
            to="/notifications"
            className="dashboard-card-button"
          >
            View Notifications
          </Link>
        </div>

        {/* SETTINGS */}
        <div className="dashboard-card">
          <div className="card-icon">⚙️</div>

          <h3>Settings</h3>

          <p>
            Manage your Alridez preferences,
            notifications, and account settings.
          </p>

          <Link
            to="/settings"
            className="dashboard-card-button"
          >
            Open Settings
          </Link>
        </div>

      </section>
    </>
  );
}

export default Dashboard;
