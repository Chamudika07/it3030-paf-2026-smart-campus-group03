import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchTicketById } from "../../api/ticketApi";
import { AttachmentPreviewGrid } from "../../components/tickets/AttachmentPreviewGrid";
import { CommentSection } from "../../components/tickets/CommentSection";
import { TechnicianUpdatePanel } from "../../components/tickets/TechnicianUpdatePanel";
import { TicketBadge } from "../../components/tickets/TicketBadge";
import { buttonStyles } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
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
    return (
      <section className="rounded-2xl border border-[#E2E8F0] bg-white px-6 py-5 text-sm text-[#334155] shadow-md shadow-slate-200/50">
        Loading ticket details...
      </section>
    );
  }

  if (error || !ticket) {
    return (
      <section className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-sm text-rose-700">
        {error || "Ticket not found."}
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Member 3 ownership"
        title={ticket.title}
        description={`Created by ${ticket.createdBy.name} on ${new Date(ticket.createdAt).toLocaleString()}`}
        actions={
          <>
            <TicketBadge value={ticket.priority} kind="priority" />
            <TicketBadge value={ticket.status} kind="status" />
            <Link to="/tickets/new" className={buttonStyles("primary")}>
              New Ticket
            </Link>
          </>
        }
      />

      <Card as="section" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-[#F8FAFC] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
              Category
            </p>
            <strong className="mt-2 block text-base text-[#0F172A]">{ticket.category}</strong>
          </div>
          <div className="rounded-2xl bg-[#F8FAFC] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
              Preferred Contact
            </p>
            <strong className="mt-2 block text-base text-[#0F172A]">{ticket.preferredContact}</strong>
          </div>
          <div className="rounded-2xl bg-[#F8FAFC] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
              Location
            </p>
            <strong className="mt-2 block text-base text-[#0F172A]">
              {ticket.locationText || "Not provided"}
            </strong>
          </div>
          <div className="rounded-2xl bg-[#F8FAFC] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
              Resource
            </p>
            <strong className="mt-2 block text-base text-[#0F172A]">
              {ticket.resourceName || "No linked resource"}
            </strong>
          </div>
          <div className="rounded-2xl bg-[#F8FAFC] p-4 md:col-span-2 xl:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
              Assigned Technician
            </p>
            <strong className="mt-2 block text-base text-[#0F172A]">
              {ticket.assignedTechnician?.name || "Not assigned yet"}
            </strong>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
            Description
          </p>
          <p className="whitespace-pre-wrap text-sm leading-7 text-[#334155]">{ticket.description}</p>
        </div>

        {ticket.resolutionNotes && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Resolution Notes
            </p>
            <p className="mt-2 text-sm leading-6 text-emerald-800">{ticket.resolutionNotes}</p>
          </div>
        )}

        {ticket.rejectionReason && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
              Rejection Reason
            </p>
            <p className="mt-2 text-sm leading-6 text-rose-800">{ticket.rejectionReason}</p>
          </div>
        )}

        <AttachmentPreviewGrid attachments={ticket.attachments} />
      </Card>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
        <TechnicianUpdatePanel ticket={ticket} onTicketUpdated={setTicket} />
        <CommentSection ticket={ticket} onTicketUpdated={setTicket} />
      </div>
    </section>
  );
}
