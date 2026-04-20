import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchTicketById } from "../../api/ticketApi";
import { AttachmentPreviewGrid } from "../../components/tickets/AttachmentPreviewGrid";
import { CommentSection } from "../../components/tickets/CommentSection";
import { TechnicianUpdatePanel } from "../../components/tickets/TechnicianUpdatePanel";
import { TicketBadge } from "../../components/tickets/TicketBadge";
import type { Ticket } from "../../types/ticket";

export function TicketDetailsPage() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTicket() {
      if (!ticketId) {
        setError("Ticket id is missing.");
        setLoading(false);
        return;
      }

      try {
        const ticketData = await fetchTicketById(Number(ticketId));
        setTicket(ticketData);
      } catch (requestError) {
        setError("Ticket details could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    void loadTicket();
  }, [ticketId]);

  if (loading) {
    return <section className="panel">Loading ticket details...</section>;
  }

  if (error || !ticket) {
    return <section className="panel error-panel">{error || "Ticket not found."}</section>;
  }

  return (
    <section className="stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Member 3 ownership</p>
          <h2>{ticket.title}</h2>
          <p className="muted-text">
            Created by {ticket.createdBy.name} on {new Date(ticket.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="header-actions">
          <TicketBadge value={ticket.priority} kind="priority" />
          <TicketBadge value={ticket.status} kind="status" />
          <Link to="/tickets/new" className="button-link">
            New Ticket
          </Link>
        </div>
      </div>

      <div className="ticket-layout">
        <section className="panel stack">
          <div className="detail-grid">
            <div>
              <p className="detail-label">Category</p>
              <strong>{ticket.category}</strong>
            </div>
            <div>
              <p className="detail-label">Preferred Contact</p>
              <strong>{ticket.preferredContact}</strong>
            </div>
            <div>
              <p className="detail-label">Location</p>
              <strong>{ticket.locationText || "Not provided"}</strong>
            </div>
            <div>
              <p className="detail-label">Resource</p>
              <strong>{ticket.resourceName || "No linked resource"}</strong>
            </div>
            <div>
              <p className="detail-label">Assigned Technician</p>
              <strong>{ticket.assignedTechnician?.name || "Not assigned yet"}</strong>
            </div>
          </div>

          <div>
            <p className="detail-label">Description</p>
            <p className="ticket-description">{ticket.description}</p>
          </div>

          {ticket.resolutionNotes && (
            <div className="info-callout resolved-callout">
              <p className="detail-label">Resolution Notes</p>
              <p>{ticket.resolutionNotes}</p>
            </div>
          )}

          {ticket.rejectionReason && (
            <div className="info-callout rejected-callout">
              <p className="detail-label">Rejection Reason</p>
              <p>{ticket.rejectionReason}</p>
            </div>
          )}

          <AttachmentPreviewGrid attachments={ticket.attachments} />
        </section>

        <div className="stack">
          <TechnicianUpdatePanel ticket={ticket} onTicketUpdated={setTicket} />
          <CommentSection ticket={ticket} onTicketUpdated={setTicket} />
        </div>
      </div>
    </section>
  );
}
