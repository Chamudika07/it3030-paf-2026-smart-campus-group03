import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTickets } from "../api/ticketApi";
import { TicketBadge } from "../components/tickets/TicketBadge";
import type { TicketSummary } from "../types/ticket";

export function TicketsPage() {
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTickets() {
      try {
        const ticketData = await fetchTickets();
        setTickets(ticketData);
      } catch (requestError) {
        setError("Could not load tickets. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    }

    void loadTickets();
  }, []);

  return (
    <section className="stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Member 3 ownership</p>
          <h2>Maintenance Tickets</h2>
          <p className="muted-text">
            Track incident reports, assignments, images, and comment history in one place.
          </p>
        </div>
        <Link to="/tickets/new" className="button-link">
          Create Ticket
        </Link>
      </div>

      {loading && <div className="panel">Loading tickets...</div>}
      {error && <div className="panel error-panel">{error}</div>}

      {!loading && !error && (
        <div className="panel">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Created</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={7}>No tickets created yet.</td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>{ticket.title}</td>
                    <td>{ticket.category}</td>
                    <td>
                      <TicketBadge value={ticket.priority} kind="priority" />
                    </td>
                    <td>
                      <TicketBadge value={ticket.status} kind="status" />
                    </td>
                    <td>{ticket.assignedTechnician?.name || "Unassigned"}</td>
                    <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/tickets/${ticket.id}`} className="table-link">
                        View
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
