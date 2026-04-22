import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  addTicketComment,
  deleteTicketComment,
  updateTicketComment
} from "../../api/ticketApi";
import type { Ticket, TicketComment } from "../../types/ticket";

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
    <section className="panel stack">
      <div className="section-heading">
        <h3>Comments</h3>
        <span>{ticket.comments.length} total</span>
      </div>

      <form className="stack" onSubmit={handleCreateComment}>
        <textarea
          className="field-textarea"
          rows={4}
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
          placeholder="Share an update, ask a question, or add technical notes."
        />
        <div className="form-actions">
          <button type="submit" disabled={busy}>
            {busy ? "Saving..." : "Add Comment"}
          </button>
        </div>
      </form>

      {error && <div className="error-panel panel-inline">{error}</div>}

      <div className="stack">
        {sortedComments.length === 0 && (
          <div className="empty-state">No comments yet. Start the discussion from here.</div>
        )}

        {sortedComments.map((comment) => {
          const isEditing = editingCommentId === comment.id;
          return (
            <article key={comment.id} className="comment-card">
              <div className="comment-header">
                <div>
                  <strong>{comment.author.name}</strong>
                  <p>
                    {comment.author.role} • {new Date(comment.updatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="comment-actions">
                  {comment.editableByCurrentUser && !isEditing && (
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => {
                        setEditingCommentId(comment.id);
                        setEditingContent(comment.content);
                      }}
                    >
                      Edit
                    </button>
                  )}
                  {comment.deletableByCurrentUser && (
                    <button
                      type="button"
                      className="button-secondary danger-button"
                      onClick={() => handleDeleteComment(comment.id)}
                      disabled={busy}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="stack">
                  <textarea
                    className="field-textarea"
                    rows={4}
                    value={editingContent}
                    onChange={(event) => setEditingContent(event.target.value)}
                  />
                  <div className="comment-actions">
                    <button type="button" onClick={() => handleSaveEdit(comment)} disabled={busy}>
                      Save
                    </button>
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => {
                        setEditingCommentId(null);
                        setEditingContent("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="comment-body">{comment.content}</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
