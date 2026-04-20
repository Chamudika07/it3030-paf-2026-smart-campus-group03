import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { assignTechnician, updateTicketStatus } from "../../api/ticketApi";
import { formatTicketText } from "./ticketAppearance";
import { TicketBadge } from "./TicketBadge";
import { ticketStatusOptions, type Ticket, type TicketStatus } from "../../types/ticket";

type TechnicianUpdatePanelProps = {
  ticket: Ticket;
  onTicketUpdated: (ticket: Ticket) => void;
};

export function TechnicianUpdatePanel({ ticket, onTicketUpdated }: TechnicianUpdatePanelProps) {
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
  const canAssign = ticket.assignAllowed;
  const canUpdateStatus = ticket.statusUpdateAllowed;

  useEffect(() => {
    setAssignForm({
      technicianIdentifier: ticket.assignedTechnician?.identifier ?? "",
      technicianName: ticket.assignedTechnician?.name ?? "",
      technicianEmail: ticket.assignedTechnician?.email ?? ""
    });
    setStatus(ticket.status);
    setResolutionNotes(ticket.resolutionNotes ?? "");
    setRejectionReason(ticket.rejectionReason ?? "");
  }, [ticket]);

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
    if (!canAssign) {
      return;
    }

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
    if (!canUpdateStatus) {
      return;
    }

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

  if (!canAssign && !canUpdateStatus) {
    return (
      <section className="panel stack technician-panel">
        <div className="technician-panel-header">
          <div>
            <p className="eyebrow">Operations Controls</p>
            <h3>Technician Actions</h3>
          </div>
          <TicketBadge value={ticket.status} kind="status" />
        </div>
        <p className="muted-text technician-panel-intro">
          Only admins can assign a technician. Admins and the assigned technician can move the
          ticket through its workflow.
        </p>
      </section>
    );
  }

  return (
    <section className="panel stack technician-panel">
      <div className="technician-panel-header">
        <div>
          <p className="eyebrow">Operations Controls</p>
          <h3>Technician Actions</h3>
          <p className="muted-text technician-panel-intro">
            Keep assignment details and ticket workflow updates in one structured workspace.
          </p>
        </div>
        <TicketBadge value={ticket.status} kind="status" />
      </div>

      <div className="stack technician-control-stack">
        <form className="stack form-section-card" onSubmit={handleAssign}>
          <div className="form-section-header">
            <div>
              <h4>Assignment Details</h4>
              <p className="section-copy">
                Capture the technician owner clearly so the team can see who is responsible.
              </p>
            </div>
            <span className={`mini-status-chip ${canAssign ? "chip-ready" : "chip-locked"}`}>
              {canAssign ? "Editable" : "View only"}
            </span>
          </div>

          <div className="technician-form-grid">
            <label className="field-group">
              <span>Technician ID</span>
              <div className="field-surface">
                <input
                  value={assignForm.technicianIdentifier}
                  onChange={(event) =>
                    setAssignForm((current) => ({
                      ...current,
                      technicianIdentifier: event.target.value
                    }))
                  }
                  placeholder="EMP-204"
                  disabled={!canAssign || busy}
                />
              </div>
            </label>
            <label className="field-group">
              <span>Technician Name</span>
              <div className="field-surface">
                <input
                  value={assignForm.technicianName}
                  onChange={(event) =>
                    setAssignForm((current) => ({ ...current, technicianName: event.target.value }))
                  }
                  placeholder="Alex Fernando"
                  disabled={!canAssign || busy}
                />
              </div>
            </label>
            <label className="field-group field-group-wide">
              <span>Technician Email</span>
              <div className="field-surface">
                <input
                  type="email"
                  value={assignForm.technicianEmail}
                  onChange={(event) =>
                    setAssignForm((current) => ({ ...current, technicianEmail: event.target.value }))
                  }
                  placeholder="technician@campus.edu"
                  disabled={!canAssign || busy}
                />
              </div>
              <small className="field-note">
                Use a campus email when available so communication stays consistent.
              </small>
            </label>
          </div>

          {canAssign && (
            <div className="technician-actions-row">
              <button type="submit" className="button-block" disabled={busy}>
                {busy ? "Saving..." : "Save Technician Assignment"}
              </button>
            </div>
          )}
        </form>

        <form className="stack form-section-card" onSubmit={handleStatusUpdate}>
          <div className="form-section-header">
            <div>
              <h4>Workflow Update</h4>
              <p className="section-copy">
                Update the ticket stage and record a clear outcome before closing or rejecting it.
              </p>
            </div>
            <span className={`mini-status-chip ${canUpdateStatus ? "chip-ready" : "chip-locked"}`}>
              {canUpdateStatus ? "Editable" : "View only"}
            </span>
          </div>

          <div className="technician-form-grid">
            <label className="field-group">
              <span>Status</span>
              <div className="field-surface">
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value as TicketStatus)}
                  disabled={!canUpdateStatus || busy}
                >
                  {allowedStatusOptions.map((option) => (
                    <option key={option} value={option}>
                      {formatTicketText(option)}
                    </option>
                  ))}
                </select>
              </div>
            </label>
            <div className="field-hint">
              <p className="field-hint-title">Workflow guidance</p>
              <p className="field-hint-copy">
                Add resolution notes for resolved tickets and a rejection reason when work cannot
                proceed.
              </p>
            </div>
            <label className="field-group field-group-wide">
              <span>Resolution Notes</span>
              <div className="field-surface">
                <textarea
                  className="field-textarea"
                  rows={4}
                  value={resolutionNotes}
                  onChange={(event) => setResolutionNotes(event.target.value)}
                  placeholder="Explain what was fixed, replaced, or verified."
                  disabled={!canUpdateStatus || busy}
                />
              </div>
            </label>
            <label className="field-group field-group-wide">
              <span>Rejection Reason</span>
              <div className="field-surface">
                <textarea
                  className="field-textarea"
                  rows={4}
                  value={rejectionReason}
                  onChange={(event) => setRejectionReason(event.target.value)}
                  placeholder="Explain why this request was rejected or cannot continue."
                  disabled={!canUpdateStatus || busy}
                />
              </div>
            </label>
          </div>

          {canUpdateStatus && (
            <div className="technician-actions-row">
              <button type="submit" className="button-block" disabled={busy}>
                {busy ? "Updating..." : "Save Workflow Update"}
              </button>
            </div>
          )}
        </form>
      </div>

      {error && <div className="error-panel panel-inline">{error}</div>}
    </section>
  );
}
