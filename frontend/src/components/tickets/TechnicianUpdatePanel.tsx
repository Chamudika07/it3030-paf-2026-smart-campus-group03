import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { assignTechnician, updateTicketStatus } from "../../api/ticketApi";
import {
  formatTicketText
} from "./ticketAppearance";
import { TicketBadge } from "./TicketBadge";
import { ticketStatusOptions, type Ticket, type TicketStatus } from "../../types/ticket";

type TechnicianUpdatePanelProps = {
  ticket: Ticket;
  canManage: boolean;
  onTicketUpdated: (ticket: Ticket) => void;
};

export function TechnicianUpdatePanel({
  ticket,
  canManage,
  onTicketUpdated
}: TechnicianUpdatePanelProps) {
  const [assignForm, setAssignForm] = useState({
    technicianIdentifier: ticket.assignedTechnician?.identifier ?? "",
    technicianName: ticket.assignedTechnician?.name ?? "",
    technicianEmail: ticket.assignedTechnician?.email ?? ""
  });
  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [resolutionNotes, setResolutionNotes] = useState(ticket.resolutionNotes ?? "");
  const [rejectionReason, setRejectionReason] = useState(ticket.rejectionReason ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const allowedStatusOptions = useMemo(() => {
    switch (ticket.status) {
      case "OPEN":
        return ["OPEN", "IN_PROGRESS", "REJECTED"] as TicketStatus[];
      case "IN_PROGRESS":
        return ["IN_PROGRESS", "RESOLVED", "REJECTED"] as TicketStatus[];
      case "RESOLVED":
        return ["RESOLVED", "IN_PROGRESS", "CLOSED"] as TicketStatus[];
      case "CLOSED":
        return ["CLOSED"] as TicketStatus[];
      case "REJECTED":
        return ["REJECTED"] as TicketStatus[];
      default:
        return ticketStatusOptions;
    }
  }, [ticket.status]);

  async function handleAssign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!assignForm.technicianIdentifier.trim() || !assignForm.technicianName.trim()) {
      setError("Technician identifier and name are required.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const updatedTicket = await assignTechnician(ticket.id, {
        technicianIdentifier: assignForm.technicianIdentifier.trim(),
        technicianName: assignForm.technicianName.trim(),
        technicianEmail: assignForm.technicianEmail.trim()
      });
      onTicketUpdated(updatedTicket);
    } catch (requestError) {
      setError("Technician assignment failed. Make sure you are logged in as an admin.");
    } finally {
      setBusy(false);
    }
  }

  async function handleStatusUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const updatedTicket = await updateTicketStatus(ticket.id, {
        status,
        resolutionNotes: resolutionNotes.trim(),
        rejectionReason: rejectionReason.trim()
      });
      onTicketUpdated(updatedTicket);
    } catch (requestError) {
      setError("Status update failed. Check the workflow rule and required notes.");
    } finally {
      setBusy(false);
    }
  }

  if (!canManage) {
    return (
      <section className="panel stack">
        <div className="section-heading">
          <h3>Technician Actions</h3>
        </div>
        <p className="muted-text">
          Only admins can assign a technician. Admins and the assigned technician can move the
          ticket through its workflow.
        </p>
      </section>
    );
  }

  return (
    <section className="panel stack">
      <div className="section-heading">
        <h3>Technician Actions</h3>
        <TicketBadge value={ticket.status} kind="status" />
      </div>

      <form className="stack" onSubmit={handleAssign}>
        <div className="form-grid">
          <label className="field-group">
            <span>Technician ID</span>
            <input
              value={assignForm.technicianIdentifier}
              onChange={(event) =>
                setAssignForm((current) => ({
                  ...current,
                  technicianIdentifier: event.target.value
                }))
              }
            />
          </label>
          <label className="field-group">
            <span>Technician Name</span>
            <input
              value={assignForm.technicianName}
              onChange={(event) =>
                setAssignForm((current) => ({ ...current, technicianName: event.target.value }))
              }
            />
          </label>
          <label className="field-group">
            <span>Technician Email</span>
            <input
              type="email"
              value={assignForm.technicianEmail}
              onChange={(event) =>
                setAssignForm((current) => ({ ...current, technicianEmail: event.target.value }))
              }
            />
          </label>
        </div>
        <div className="form-actions">
          <button type="submit" disabled={busy}>
            {busy ? "Saving..." : "Assign Technician"}
          </button>
        </div>
      </form>

      <form className="stack" onSubmit={handleStatusUpdate}>
        <div className="form-grid">
          <label className="field-group">
            <span>Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value as TicketStatus)}>
              {allowedStatusOptions.map((option) => (
                <option key={option} value={option}>
                  {formatTicketText(option)}
                </option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span>Resolution Notes</span>
            <textarea
              className="field-textarea"
              rows={4}
              value={resolutionNotes}
              onChange={(event) => setResolutionNotes(event.target.value)}
              placeholder="Required when the ticket is resolved."
            />
          </label>
          <label className="field-group">
            <span>Rejection Reason</span>
            <textarea
              className="field-textarea"
              rows={4}
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              placeholder="Required when the ticket is rejected."
            />
          </label>
        </div>
        <div className="form-actions">
          <button type="submit" disabled={busy}>
            {busy ? "Updating..." : "Update Status"}
          </button>
        </div>
      </form>

      {error && <div className="error-panel panel-inline">{error}</div>}
    </section>
  );
}
