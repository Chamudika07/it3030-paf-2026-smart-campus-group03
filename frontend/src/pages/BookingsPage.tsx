import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBookings } from "../api/bookingApi";
import { BookingBadge } from "../components/bookings/BookingBadge";
import { Badge } from "../components/ui/Badge";
import { Button, buttonStyles } from "../components/ui/Button";
import { DataTable } from "../components/ui/DataTable";
import { PageHeader } from "../components/ui/PageHeader";
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
      } catch (requestError) {
        setError("Could not load bookings. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, []);

  const displayedBookings =
    filterMode === "MY_BOOKINGS" && user
      ? bookings.filter((booking) => booking.userName === user.name)
      : bookings;

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Member 2 ownership"
        title="Bookings"
        description="Manage requests for lecture halls, labs, and equipment with approval status tracking."
        actions={
          <>
            <Badge tone="orange">{displayedBookings.length} visible</Badge>
            <Link to="/bookings/new" className={buttonStyles("primary")}>
              New Booking
            </Link>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant={filterMode === "ALL" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setFilterMode("ALL")}
        >
          All Bookings
        </Button>
        <Button
          variant={filterMode === "MY_BOOKINGS" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setFilterMode("MY_BOOKINGS")}
        >
          My Bookings
        </Button>
      </div>

      {loading && (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white px-6 py-5 text-sm text-[#334155] shadow-md shadow-slate-200/50">
          Loading bookings...
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-sm text-rose-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <DataTable columns={["Resource", "Requested By", "Start Date", "End Date", "Status", "Action"]}>
          {displayedBookings.length === 0 ? (
            <tr>
              <td className="px-6 py-10 text-sm text-[#94A3B8]" colSpan={6}>
                No bookings found.
              </td>
            </tr>
          ) : (
            displayedBookings.map((booking, index) => (
              <tr
                key={booking.id}
                className={`transition hover:bg-[#DBEAFE]/35 ${index % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}`}
              >
                <td className="px-6 py-4 text-sm font-semibold text-[#0F172A]">
                  {booking.resourceName}
                </td>
                <td className="px-6 py-4 text-sm text-[#334155]">{booking.userName}</td>
                <td className="px-6 py-4 text-sm text-[#334155]">
                  {new Date(booking.startDate).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-[#334155]">
                  {new Date(booking.endDate).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <BookingBadge status={booking.status} />
                </td>
                <td className="px-6 py-4 text-sm">
                  <Link
                    to={`/bookings/${booking.id}`}
                    className="font-semibold text-[#2563EB] transition hover:text-[#1D4ED8]"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))
          )}
        </DataTable>
      )}
    </section>
  );
}
