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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-[#0F172A]">{title}</h3>
      </div>
      {!hasPreviewFiles && !hasAttachments && (
        <div className="rounded-2xl border border-dashed border-[#E2E8F0] bg-slate-50 px-4 py-6 text-sm text-[#94A3B8]">
          No images attached yet.
        </div>
      )}

      {hasPreviewFiles && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {previews?.map((preview) => (
            <article
              key={preview.id}
              className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm shadow-slate-200/50"
            >
              <img
                src={preview.src}
                alt={preview.name}
                className="h-44 w-full bg-slate-100 object-cover"
              />
              <div className="p-4">
                <p className="truncate text-sm font-medium text-[#334155]">{preview.name}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      {hasAttachments && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {attachments?.map((attachment) => (
            <a
              key={attachment.id}
              className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm shadow-slate-200/50 transition duration-200 hover:-translate-y-1 hover:shadow-md"
              href={attachment.previewUrl}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={attachment.previewUrl}
                alt={attachment.originalFileName}
                className="h-44 w-full bg-slate-100 object-cover"
              />
              <div className="space-y-1 p-4">
                <p className="truncate text-sm font-medium text-[#334155]">
                  {attachment.originalFileName}
                </p>
                <p className="text-xs text-[#94A3B8]">Open preview</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
