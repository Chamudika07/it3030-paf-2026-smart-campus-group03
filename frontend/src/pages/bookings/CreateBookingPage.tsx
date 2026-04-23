import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, FormField, PageHeader } from "../../components/ui";
import { checkBookingAvailability, createBooking } from "../../api/bookingApi";
import { fetchResources } from "../../api/resourceApi";
import type { Resource } from "../../types/resource";

export function CreateBookingPage() {
  const navigate = useNavigate();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    resourceId: "",
    startDate: "",
    endDate: "",
    purpose: "",
    expectedAttendees: 1,
  });

  useEffect(() => {
    async function loadResources() {
      setLoadingResources(true);
      try {
        const data = await fetchResources();
        setResources(data.filter((r) => r.active));
      } catch (err) {
        setError("Could not load resources for booking.");
      } finally {
        setLoadingResources(false);
      }
    }
    loadResources();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "expectedAttendees" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const now = new Date();
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (start < now) {
      setError("Booking start time cannot be in the past.");
      setSubmitting(false);
      return;
    }

    if (end <= start) {
      setError("End time must be after the start time.");
      setSubmitting(false);
      return;
    }

    const selectedResource = resources.find(
      (r) => r.id === Number(formData.resourceId),
    );
    if (
      selectedResource &&
      formData.expectedAttendees > selectedResource.capacity
    ) {
      setError(
        `Expected attendees (${formData.expectedAttendees}) exceeds resource capacity (${selectedResource.capacity}).`,
      );
      setSubmitting(false);
      return;
    }

    try {
      const availability = await checkBookingAvailability(
        Number(formData.resourceId),
        formData.startDate,
        formData.endDate,
      );
      if (!availability.available) {
        setError(
          availability.message ||
            "The selected time slot is not available for this resource.",
        );
        setSubmitting(false);
        return;
      }

      await createBooking({
        ...formData,
        resourceId: Number(formData.resourceId),
      });
      navigate("/bookings");
    } catch (err: any) {
      if (err.response?.data?.validationErrors) {
        const errors = Object.values(err.response.data.validationErrors).join(
          " | ",
        );
        setError(errors);
      } else {
        setError(err.response?.data?.message || "Failed to create booking.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Bookings"
        title="New Booking Request"
        description="Reserve a facility or asset for your needs."
        actions={
          <Link to="/bookings">
            <Button variant="secondary">Cancel</Button>
          </Link>
        }
      />

      <Card as="form" onSubmit={handleSubmit}>
        {error && (
          <div
            className="mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="space-y-6">
          <FormField label="Resource">
            <select
              id="resourceId"
              name="resourceId"
              value={formData.resourceId}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
            >
              <option value="">Select a resource</option>
              {resources.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.category} - Cap: {r.capacity})
                </option>
              ))}
            </select>
            {loadingResources && (
              <p className="mt-1 text-xs text-slate-500">
                Loading resources...
              </p>
            )}
          </FormField>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField label="Start Date & Time">
              <input
                type="datetime-local"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              />
            </FormField>
            <FormField label="End Date & Time">
              <input
                type="datetime-local"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              />
            </FormField>
          </div>

          <FormField label="Purpose">
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              rows={4}
              required
              placeholder="Why do you need this resource?"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
            />
          </FormField>

          <FormField label="Expected Attendees">
            <input
              type="number"
              id="expectedAttendees"
              name="expectedAttendees"
              value={formData.expectedAttendees}
              onChange={handleChange}
              min={1}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
            />
          </FormField>

          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
