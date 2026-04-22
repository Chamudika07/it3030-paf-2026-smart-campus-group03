import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  addTicketComment,
  deleteTicketComment,
  updateTicketComment
} from "../../api/ticketApi";
import type { Ticket, TicketComment } from "../../types/ticket";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

type CommentSectionProps = {
  ticket: Ticket;
  onTicketUpdated: (ticket: Ticket) => void;
};

export function CommentSection({ ticket, onTicketUpdated }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const sortedComments = useMemo(
    () =>
      [...ticket.comments].sort(
        (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
      ),
    [ticket.comments]
  );

  async function handleCreateComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newComment.trim()) {
      setError("Please enter a comment before posting.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const createdComment = await addTicketComment(ticket.id, { content: newComment.trim() });
      onTicketUpdated({ ...ticket, comments: [...ticket.comments, createdComment] });
      setNewComment("");
    } catch (requestError) {
      setError("Comment could not be saved. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveEdit(comment: TicketComment) {
    if (!editingContent.trim()) {
      setError("Comment content cannot be empty.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const updatedComment = await updateTicketComment(comment.id, { content: editingContent.trim() });
      onTicketUpdated({
        ...ticket,
        comments: ticket.comments.map((item) => (item.id === comment.id ? updatedComment : item))
      });
      setEditingCommentId(null);
      setEditingContent("");
    } catch (requestError) {
      setError("Comment update failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteComment(commentId: number) {
    setBusy(true);
    setError("");
    try {
      await deleteTicketComment(commentId);
      onTicketUpdated({
        ...ticket,
        comments: ticket.comments.filter((comment) => comment.id !== commentId)
      });
    } catch (requestError) {
      setError("Comment deletion failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card as="section" className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#0F172A]">Comments</h3>
          <p className="text-sm text-[#94A3B8]">
            Capture discussion, troubleshooting notes, and updates.
          </p>
        </div>
        <div className="rounded-full bg-[#FFEDD5] px-3 py-1 text-xs font-semibold text-[#EA580C]">
          {ticket.comments.length} total
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleCreateComment}>
        <textarea
          className="min-h-32 w-full rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-[#DBEAFE]"
          rows={4}
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
          placeholder="Share an update, ask a question, or add technical notes."
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={busy}>
            {busy ? "Saving..." : "Add Comment"}
          </Button>
        </div>
      </form>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {sortedComments.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#E2E8F0] bg-slate-50 px-4 py-6 text-sm text-[#94A3B8]">
            No comments yet. Start the discussion from here.
          </div>
        )}

        {sortedComments.map((comment) => {
          const isEditing = editingCommentId === comment.id;
          return (
            <article
              key={comment.id}
              className="space-y-4 rounded-2xl border border-[#E2E8F0] bg-slate-50 p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <strong className="text-sm font-semibold text-[#0F172A]">{comment.author.name}</strong>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#94A3B8]">
                    {comment.author.role} • {new Date(comment.updatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {comment.editableByCurrentUser && !isEditing && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setEditingCommentId(comment.id);
                        setEditingContent(comment.content);
                      }}
                    >
                      Edit
                    </Button>
                  )}
                  {comment.deletableByCurrentUser && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="text-rose-700 hover:bg-rose-50"
                      onClick={() => handleDeleteComment(comment.id)}
                      disabled={busy}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <textarea
                    className="min-h-28 w-full rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-[#DBEAFE]"
                    rows={4}
                    value={editingContent}
                    onChange={(event) => setEditingContent(event.target.value)}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" size="sm" onClick={() => handleSaveEdit(comment)} disabled={busy}>
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setEditingCommentId(null);
                        setEditingContent("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-6 text-[#334155]">{comment.content}</p>
              )}
            </article>
          );
        })}
      </div>
    </Card>
  );
}
