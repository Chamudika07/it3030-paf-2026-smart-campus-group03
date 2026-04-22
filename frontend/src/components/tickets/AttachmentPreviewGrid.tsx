import type { TicketAttachment } from "../../types/ticket";

type PreviewFile = {
  id: string;
  name: string;
  src: string;
};

type AttachmentPreviewGridProps = {
  previews?: PreviewFile[];
  attachments?: TicketAttachment[];
  title?: string;
};

export function AttachmentPreviewGrid({
  previews,
  attachments,
  title = "Attachments"
}: AttachmentPreviewGridProps) {
  const hasPreviewFiles = Boolean(previews && previews.length > 0);
  const hasAttachments = Boolean(attachments && attachments.length > 0);

  return (
    <div className="stack">
      <div className="section-heading">
        <h3>{title}</h3>
      </div>
      {!hasPreviewFiles && !hasAttachments && <div className="empty-state">No images attached yet.</div>}

      {hasPreviewFiles && (
        <div className="attachment-grid">
          {previews?.map((preview) => (
            <article key={preview.id} className="attachment-card">
              <img src={preview.src} alt={preview.name} className="attachment-thumb" />
              <p>{preview.name}</p>
            </article>
          ))}
        </div>
      )}

      {hasAttachments && (
        <div className="attachment-grid">
          {attachments?.map((attachment) => (
            <a
              key={attachment.id}
              className="attachment-card"
              href={attachment.previewUrl}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={attachment.previewUrl}
                alt={attachment.originalFileName}
                className="attachment-thumb"
              />
              <p>{attachment.originalFileName}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
