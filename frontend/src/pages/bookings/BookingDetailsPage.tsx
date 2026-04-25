import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchBookingById, updateBookingStatus } from "../../api/bookingApi";
import { BookingBadge } from "../../components/bookings/BookingBadge";
import { useAuth } from "../../hooks/useAuth";
import type { Booking } from "../../types/booking";

export function BookingDetailsPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const isAdmin = user?.role === "ADMIN";
  const isOwner = user?.name === booking?.userName; // Simple role-check substitute for now

  useEffect(() => {
    async function loadBooking() {
      try {
        const found = await fetchBookingById(Number(bookingId));
        if (found) {
          setBooking(found);
        } else {
          setError("Booking not found.");
        }
      } catch (err) {
        setError("Could not load booking details.");
      } finally {
        setLoading(false);
      }
    }
    if (bookingId) {
      loadBooking();
    }
  }, [bookingId]);

  const handleAction = async (
    status: "APPROVED" | "REJECTED" | "CANCELLED",
  ) => {
    if (!booking) return;
    if (status === "REJECTED" && !rejectionReason.trim() && isAdmin) {
      setActionError("Please provide a reason for rejection.");
      return;
    }

    setActionError("");
    setActionSuccess("");
    try {
      await updateBookingStatus(
        booking.id,
        status,
        status === "REJECTED" ? rejectionReason : undefined,
      );
      setBooking({
        ...booking,
        status,
        rejectionReason:
          status === "REJECTED" ? rejectionReason : booking.rejectionReason,
      });
      setActionSuccess(`Booking effectively ${status.toLowerCase()}.`);
      if (status !== "REJECTED") setRejectionReason("");
    } catch (err: any) {
      if (err.response?.data?.validationErrors) {
        const errors = Object.values(err.response.data.validationErrors).join(
          " | ",
        );
        setActionError(errors);
      } else {
        setActionError(
          err.response?.data?.message ||
            `Failed to change status to ${status}.`,
        );
      }
    }
  };

  if (loading) return <div className="panel">Loading booking details...</div>;
  if (error) return <div className="panel error-panel">{error}</div>;
  if (!booking)
    return <div className="panel error-panel">No booking found.</div>;

  return (
    <section className="stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Booking #{booking.id}</p>
          <h2>{booking.resourceName}</h2>
          <BookingBadge status={booking.status} />
        </div>
        <Link to="/bookings" className="button button-secondary">
          Back to List
        </Link>
      </div>

      {actionError && <div className="panel error-panel">{actionError}</div>}
      {actionSuccess && (
        <div
          className="panel success-panel"
          style={{
            backgroundColor: "#e6fffa",
            color: "#006644",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          {actionSuccess}
        </div>
      )}

      <div className="panel">
        <h3>Details</h3>
        <dl
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <dt style={{ fontWeight: "bold" }}>Requested By</dt>
          <dd>{booking.userName}</dd>

          <dt style={{ fontWeight: "bold" }}>Created At</dt>
          <dd>{new Date(booking.createdAt).toLocaleString()}</dd>

          <dt style={{ fontWeight: "bold" }}>Start Time</dt>
          <dd>{new Date(booking.startDate).toLocaleString()}</dd>

          <dt style={{ fontWeight: "bold" }}>End Time</dt>
          <dd>{new Date(booking.endDate).toLocaleString()}</dd>

          <dt style={{ fontWeight: "bold" }}>Expected Attendees</dt>
          <dd>{booking.expectedAttendees}</dd>

          <dt style={{ fontWeight: "bold" }}>Purpose</dt>
          <dd style={{ whiteSpace: "pre-wrap" }}>{booking.purpose}</dd>

          {booking.rejectionReason && (
            <>
              <dt style={{ fontWeight: "bold", color: "#d93025" }}>
                Rejection Reason
              </dt>
              <dd style={{ color: "#d93025" }}>{booking.rejectionReason}</dd>
            </>
          )}
        </dl>
      </div>

      {booking.status === "PENDING" && isAdmin && (
        <div className="panel">
          <h3>Admin Controls</h3>
          <p className="muted-text">
            Review the booking constraints and overlaps carefully.
          </p>

          <div className="form-group" style={{ marginTop: "1rem" }}>
            <label htmlFor="rejectionReason">Reason (if rejecting)</label>
            <input
              type="text"
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Conflict with another scheduled event"
            />
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button
              className="button"
              style={{ backgroundColor: "#00875a" }}
              onClick={() => handleAction("APPROVED")}
            >
              Approve Request
            </button>
            <button
              className="button button-secondary"
              style={{ color: "#d93025", borderColor: "#d93025" }}
              onClick={() => handleAction("REJECTED")}
            >
              Reject Request
            </button>
          </div>
        </div>
      )}

      {booking.status === "APPROVED" && (isOwner || isAdmin) && (
        <div className="panel">
          <h3>Manage Booking</h3>
          <button
            className="button button-secondary"
            style={{
              color: "#d93025",
              borderColor: "#d93025",
              marginTop: "1rem",
            }}
            onClick={() => handleAction("CANCELLED")}
          >
            Cancel Booking
          </button>
        </div>
      )}

      {booking.status === "PENDING" && isOwner && !isAdmin && (
        <div className="panel">
          <h3>Manage Booking</h3>
          <button
            className="button button-secondary"
            style={{
              color: "#d93025",
              borderColor: "#d93025",
              marginTop: "1rem",
            }}
            onClick={() => handleAction("CANCELLED")}
          >
            Withdraw Request
          </button>
        </div>
      )}
    </section>
  );
}
