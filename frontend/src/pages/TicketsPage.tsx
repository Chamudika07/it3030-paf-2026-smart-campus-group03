import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTickets } from "../api/ticketApi";
import { TicketBadge } from "../components/tickets/TicketBadge";
import { Badge } from "../components/ui/Badge";
import { buttonStyles } from "../components/ui/Button";
import { DataTable } from "../components/ui/DataTable";
import { PageHeader } from "../components/ui/PageHeader";
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
    <section className="space-y-6">
      <PageHeader
        eyebrow="Member 3 ownership"
        title="Maintenance Tickets"
        description="Track incident reports, assignments, image evidence, and comment history in one operational queue."
        actions={
          <>
            <Badge tone="orange">{tickets.length} open records</Badge>
            <Link to="/tickets/new" className={buttonStyles("primary")}>
              Create Ticket
            </Link>
          </>
        }
      />

      {loading && (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white px-6 py-5 text-sm text-[#334155] shadow-md shadow-slate-200/50">
          Loading tickets...
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-sm text-rose-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <DataTable
          columns={["Title", "Category", "Priority", "Status", "Assigned To", "Created", "Action"]}
        >
          {tickets.length === 0 ? (
            <tr>
              <td className="px-6 py-10 text-sm text-[#94A3B8]" colSpan={7}>
                No tickets created yet.
              </td>
            </tr>
          ) : (
            tickets.map((ticket, index) => (
              <tr
                key={ticket.id}
                className={`transition hover:bg-[#DBEAFE]/35 ${index % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}`}
              >
                <td className="px-6 py-4 text-sm font-semibold text-[#0F172A]">{ticket.title}</td>
                <td className="px-6 py-4 text-sm text-[#334155]">{ticket.category}</td>
                <td className="px-6 py-4">
                  <TicketBadge value={ticket.priority} kind="priority" />
                </td>
                <td className="px-6 py-4">
                  <TicketBadge value={ticket.status} kind="status" />
                </td>
                <td className="px-6 py-4 text-sm text-[#334155]">
                  {ticket.assignedTechnician?.name || "Unassigned"}
                </td>
                <td className="px-6 py-4 text-sm text-[#334155]">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <Link
                    to={`/tickets/${ticket.id}`}
                    className="font-semibold text-[#2563EB] transition hover:text-[#1D4ED8]"
                  >
                    View details
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
