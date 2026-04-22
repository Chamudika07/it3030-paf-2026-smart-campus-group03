import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBookings } from "../api/bookingApi";
import { BookingBadge } from "../components/bookings/BookingBadge";
import { useAuth } from "../hooks/useAuth";
import type { Booking } from "../types/booking";

export function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filterMode, setFilterMode] = useState<"ALL" | "MY_BOOKINGS">("ALL");

  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await fetchBookings();
        setBookings(data);
      } catch (err) {
        setError("Could not load bookings. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, []);

  const displayedBookings =
    filterMode === "MY_BOOKINGS" && user
      ? bookings.filter((b) => b.userName === user.name) // Using name as simplified userId matching for now
      : bookings;

  return (
    <section className="stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Member 2 ownership</p>
          <h2>Bookings</h2>
          <p className="muted-text">
            Manage requests for lecture halls, labs, and equipment.
          </p>
        </div>
        <Link to="/bookings/new" className="button-link">
          New Booking
        </Link>
      </div>

      <div
        className="panel"
        style={{ display: "flex", gap: "1rem", alignItems: "center" }}
      >
        <button
          className={
            filterMode === "ALL" ? "button" : "button button-secondary"
          }
          onClick={() => setFilterMode("ALL")}
        >
          All Bookings
        </button>
        <button
          className={
            filterMode === "MY_BOOKINGS" ? "button" : "button button-secondary"
          }
          onClick={() => setFilterMode("MY_BOOKINGS")}
        >
          My Bookings
        </button>
      </div>

      {loading && <div className="panel">Loading bookings...</div>}
      {error && <div className="panel error-panel">{error}</div>}

      {!loading && !error && (
        <div className="panel">
          <table className="table">
            <thead>
              <tr>
                <th>Resource</th>
                <th>Requested By</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {displayedBookings.length === 0 ? (
                <tr>
                  <td colSpan={6}>No bookings found.</td>
                </tr>
              ) : (
                displayedBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.resourceName}</td>
                    <td>{booking.userName}</td>
                    <td>{new Date(booking.startDate).toLocaleString()}</td>
                    <td>{new Date(booking.endDate).toLocaleString()}</td>
                    <td>
                      <BookingBadge status={booking.status} />
                    </td>
                    <td>
                      <Link
                        to={`/bookings/${booking.id}`}
                        className="table-link"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
