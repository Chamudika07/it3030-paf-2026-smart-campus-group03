import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createTicket } from "../../api/ticketApi";
import { fetchResources } from "../../api/resourceApi";
import { BackButton } from "../../components/common/BackButton";
import { AttachmentPreviewGrid } from "../../components/tickets/AttachmentPreviewGrid";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { FormField } from "../../components/ui/FormField";
import { PageHeader } from "../../components/ui/PageHeader";
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

  const inputClassName =
    "w-full rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-[#DBEAFE] disabled:bg-slate-50 disabled:text-[#94A3B8]";

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
    <section className="space-y-6">
      <PageHeader
        eyebrow="Member 3 ownership"
        title="Create Ticket"
        description="Report a maintenance issue with enough context for the operations team to act fast."
        actions={<BackButton label="← Back" fallbackPath="/tickets" />}
      />

      <Card as="form" className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Title">
            <input
              className={inputClassName}
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Air conditioner leaking in Lab 2"
            />
          </FormField>
          <FormField label="Category">
            <select
              className={inputClassName}
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
          </FormField>
          <FormField label="Priority">
            <select
              className={inputClassName}
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
          </FormField>
          <FormField
            label="Preferred Contact"
            hint="Use a phone number or campus email so the team can reach you quickly."
          >
            <input
              className={inputClassName}
              value={form.preferredContact}
              onChange={(event) =>
                setForm((current) => ({ ...current, preferredContact: event.target.value }))
              }
              placeholder="0771234567 or your campus email"
            />
          </FormField>
          <FormField label="Description" className="md:col-span-2">
            <textarea
              className={inputClassName}
              rows={6}
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="Describe the issue, impact, and anything already tried."
            />
          </FormField>
          <FormField label="Location">
            <input
              className={inputClassName}
              value={form.locationText}
              onChange={(event) =>
                setForm((current) => ({ ...current, locationText: event.target.value }))
              }
              placeholder="Engineering Building, Floor 2, Lab 4"
            />
          </FormField>
          <FormField label="Resource Reference">
            <select
              className={inputClassName}
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
          </FormField>
          <FormField label="Images" hint="Upload up to 3 image files.">
            <input
              className={inputClassName}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              multiple
              onChange={(event) => setFiles(Array.from(event.target.files ?? []).slice(0, 3))}
            />
          </FormField>
        </div>

        <AttachmentPreviewGrid previews={previews} title="Image Preview" />

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Ticket"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate("/tickets")}>
            Cancel
          </Button>
        </div>
      </Card>
    </section>
  );
}
