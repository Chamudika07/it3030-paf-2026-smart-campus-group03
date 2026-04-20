import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { assignTechnician, updateTicketStatus } from "../../api/ticketApi";
import { formatTicketText } from "./ticketAppearance";
import { TicketBadge } from "./TicketBadge";
import { ticketStatusOptions, type Ticket, type TicketStatus } from "../../types/ticket";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { FormField } from "../ui/FormField";

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

  const inputClassName =
    "w-full rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-[#DBEAFE] disabled:bg-slate-50 disabled:text-[#94A3B8]";

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
      <Card as="section" className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#94A3B8]">
              Operations Controls
            </p>
            <h3 className="mt-2 text-lg font-semibold text-[#0F172A]">Operations Controls</h3>
          </div>
          <TicketBadge value={ticket.status} kind="status" />
        </div>
        <p className="max-w-2xl text-sm leading-6 text-[#334155]">
          Only admins can assign a technician. Admins and the assigned technician can move the
          ticket through its workflow.
        </p>
      </Card>
    );
  }

  return (
    <Card as="section" className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#94A3B8]">
            Operations Controls
          </p>
          <h3 className="mt-2 text-lg font-semibold text-[#0F172A]">Operations Controls</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#334155]">
            Keep assignment details and ticket workflow updates in one structured workspace.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="orange">Priority workflow</Badge>
          <TicketBadge value={ticket.status} kind="status" />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <form
          className="space-y-5 rounded-2xl border border-[#E2E8F0] bg-slate-50 p-5"
          onSubmit={handleAssign}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h4 className="text-base font-semibold text-[#0F172A]">Assignment Details</h4>
              <p className="mt-1 text-sm leading-6 text-[#334155]">
                Capture the technician owner clearly so the team can see who is responsible.
              </p>
            </div>
            <Badge tone={canAssign ? "blue" : "neutral"}>
              {canAssign ? "Editable" : "View only"}
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Technician ID">
              <input
                className={inputClassName}
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
            </FormField>
            <FormField label="Technician Name">
              <input
                className={inputClassName}
                value={assignForm.technicianName}
                onChange={(event) =>
                  setAssignForm((current) => ({ ...current, technicianName: event.target.value }))
                }
                placeholder="Alex Fernando"
                disabled={!canAssign || busy}
              />
            </FormField>
            <FormField
              label="Technician Email"
              hint="Use a campus email when available so communication stays consistent."
              className="md:col-span-2"
            >
              <input
                className={inputClassName}
                type="email"
                value={assignForm.technicianEmail}
                onChange={(event) =>
                  setAssignForm((current) => ({ ...current, technicianEmail: event.target.value }))
                }
                placeholder="technician@campus.edu"
                disabled={!canAssign || busy}
              />
            </FormField>
          </div>

          {canAssign && (
            <div className="flex">
              <Button type="submit" className="w-full sm:w-auto" disabled={busy}>
                {busy ? "Saving..." : "Save Technician Assignment"}
              </Button>
            </div>
          )}
        </form>

        <form
          className="space-y-5 rounded-2xl border border-[#E2E8F0] bg-slate-50 p-5"
          onSubmit={handleStatusUpdate}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h4 className="text-base font-semibold text-[#0F172A]">Workflow Update</h4>
              <p className="mt-1 text-sm leading-6 text-[#334155]">
                Update the ticket stage and record a clear outcome before closing or rejecting it.
              </p>
            </div>
            <Badge tone={canUpdateStatus ? "orange" : "neutral"}>
              {canUpdateStatus ? "Editable" : "View only"}
            </Badge>
          </div>

          <div className="grid gap-4">
            <FormField label="Status">
              <select
                className={inputClassName}
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
            </FormField>

            <div className="rounded-2xl bg-[#FFEDD5] p-4">
              <p className="text-sm font-semibold text-[#EA580C]">Workflow guidance</p>
              <p className="mt-1 text-sm leading-6 text-[#9A3412]">
                Add resolution notes for resolved tickets and a rejection reason when work cannot
                proceed.
              </p>
            </div>

            <FormField label="Resolution Notes">
              <textarea
                className={inputClassName}
                rows={4}
                value={resolutionNotes}
                onChange={(event) => setResolutionNotes(event.target.value)}
                placeholder="Explain what was fixed, replaced, or verified."
                disabled={!canUpdateStatus || busy}
              />
            </FormField>

            <FormField label="Rejection Reason">
              <textarea
                className={inputClassName}
                rows={4}
                value={rejectionReason}
                onChange={(event) => setRejectionReason(event.target.value)}
                placeholder="Explain why this request was rejected or cannot continue."
                disabled={!canUpdateStatus || busy}
              />
            </FormField>
          </div>

          {canUpdateStatus && (
            <div className="flex">
              <Button type="submit" variant="accent" className="w-full sm:w-auto" disabled={busy}>
                {busy ? "Updating..." : "Save Workflow Update"}
              </Button>
            </div>
          )}
        </form>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}
    </Card>
  );
}
