import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createTicket } from "../../api/ticketApi";
import { fetchResources } from "../../api/resourceApi";
import { AttachmentPreviewGrid } from "../../components/tickets/AttachmentPreviewGrid";
import {
  ticketCategoryOptions,
  ticketPriorityOptions,
  type CreateTicketPayload,
  type TicketCategory,
  type TicketPriority
} from "../../types/ticket";
import type { Resource } from "../../types/resource";

type FormState = {
  title: string;
  category: TicketCategory;
  description: string;
  priority: TicketPriority;
  preferredContact: string;
  locationText: string;
  resourceId: string;
};

const initialForm: FormState = {
  title: "",
  category: "FACILITY",
  description: "",
  priority: "MEDIUM",
  preferredContact: "",
  locationText: "",
  resourceId: ""
};

export function CreateTicketPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialForm);
  const [resources, setResources] = useState<Resource[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const resourceData = await fetchResources();
        setResources(resourceData);
      } finally {
        setLoadingResources(false);
      }
    })();
  }, []);

  const previews = useMemo(
    () =>
      files.map((file) => ({
        id: `${file.name}-${file.lastModified}`,
        name: file.name,
        src: URL.createObjectURL(file)
      })),
    [files]
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.src));
    };
  }, [previews]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.preferredContact.trim()) {
      setError("Please complete the required fields before submitting.");
      return;
    }

    if (files.length > 3) {
      setError("You can upload up to 3 images only.");
      return;
    }

    const payload: CreateTicketPayload = {
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim(),
      priority: form.priority,
      preferredContact: form.preferredContact.trim(),
      locationText: form.locationText.trim(),
      resourceId: form.resourceId ? Number(form.resourceId) : undefined
    };

    setSubmitting(true);
    setError("");
    try {
      const createdTicket = await createTicket(payload, files);
      navigate(`/tickets/${createdTicket.id}`);
    } catch (requestError) {
      setError("Ticket creation failed. Please check your data and backend server.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Member 3 ownership</p>
          <h2>Create Ticket</h2>
          <p className="muted-text">
            Report a maintenance issue with enough context for the operations team to act fast.
          </p>
        </div>
      </div>

      <form className="panel stack" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="field-group">
            <span>Title</span>
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Air conditioner leaking in Lab 2"
            />
          </label>
          <label className="field-group">
            <span>Category</span>
            <select
              value={form.category}
              onChange={(event) =>
                setForm((current) => ({ ...current, category: event.target.value as TicketCategory }))
              }
            >
              {ticketCategoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category.replace("_", " ")}
                </option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span>Priority</span>
            <select
              value={form.priority}
              onChange={(event) =>
                setForm((current) => ({ ...current, priority: event.target.value as TicketPriority }))
              }
            >
              {ticketPriorityOptions.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </label>
          <label className="field-group field-group-wide">
            <span>Description</span>
            <textarea
              className="field-textarea"
              rows={6}
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="Describe the issue, impact, and anything already tried."
            />
          </label>
          <label className="field-group">
            <span>Preferred Contact</span>
            <input
              value={form.preferredContact}
              onChange={(event) =>
                setForm((current) => ({ ...current, preferredContact: event.target.value }))
              }
              placeholder="0771234567 or your campus email"
            />
          </label>
          <label className="field-group">
            <span>Location</span>
            <input
              value={form.locationText}
              onChange={(event) =>
                setForm((current) => ({ ...current, locationText: event.target.value }))
              }
              placeholder="Engineering Building, Floor 2, Lab 4"
            />
          </label>
          <label className="field-group">
            <span>Resource Reference</span>
            <select
              value={form.resourceId}
              onChange={(event) => setForm((current) => ({ ...current, resourceId: event.target.value }))}
              disabled={loadingResources}
            >
              <option value="">No linked resource</option>
              {resources.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.code} - {resource.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span>Images</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              multiple
              onChange={(event) => setFiles(Array.from(event.target.files ?? []).slice(0, 3))}
            />
            <small>Upload up to 3 images.</small>
          </label>
        </div>

        <AttachmentPreviewGrid previews={previews} title="Image Preview" />

        {error && <div className="error-panel panel-inline">{error}</div>}

        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Ticket"}
          </button>
        </div>
      </form>
    </section>
  );
}
