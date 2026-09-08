function Dashboard() {

  return (

    <>

      <header className="dashboard-header">

        <div>

          <h1>
            Welcome to Alrides
          </h1>

          <p>
            Find a ride, share a ride,
            or rent a vehicle.
          </p>

        </div>

      </header>


      <section className="dashboard-cards">


        {/* =========================
            POST RIDE
        ========================= */}

        <div className="dashboard-card">

          <div className="card-icon">
            🚗
          </div>

          <h3>
            Post a Ride
          </h3>

          <p>
            Share your journey and allow
            other users to book available
            seats.
          </p>

          <a
            href="/post-ride"
            className="dashboard-card-button"
          >
            Post Ride
          </a>

        </div>


        {/* =========================
            SEARCH RIDES
        ========================= */}

        <div className="dashboard-card">

          <div className="card-icon">
            🔍
          </div>

          <h3>
            Search Rides
          </h3>

          <p>
            Search for rides based on your
            source, destination, and travel
            date.
          </p>

          <a
            href="/search-rides"
            className="dashboard-card-button"
          >
            Search Rides
          </a>

        </div>


        {/* =========================
            MY RIDES
        ========================= */}

        <div className="dashboard-card">

          <div className="card-icon">
            📋
          </div>

          <h3>
            My Posted Rides
          </h3>

          <p>
            View your posted rides and
            manage passenger booking
            requests.
          </p>

          <a
            href="/my-rides"
            className="dashboard-card-button"
          >
            Manage Rides
          </a>

        </div>


        {/* =========================
            RENTAL VEHICLES
        ========================= */}

        <div className="dashboard-card">

          <div className="card-icon">
            🚙
          </div>

          <h3>
            Rental Vehicles
          </h3>

          <p>
            Find available rental vehicles
            or post your own vehicle.
          </p>

          <a
            href="/rental-vehicles"
            className="dashboard-card-button"
          >
            View Vehicles
          </a>

        </div>


        {/* =========================
            MY RENTALS
        ========================= */}

        <div className="dashboard-card">

          <div className="card-icon">
            🔑
          </div>

          <h3>
            My Rental Vehicles
          </h3>

          <p>
            Manage your rental vehicles
            and customer booking requests.
          </p>

          <a
            href="/my-rentals"
            className="dashboard-card-button"
          >
            Manage Rentals
          </a>

        </div>


      </section>

    </>

  );

}

export default Dashboard;