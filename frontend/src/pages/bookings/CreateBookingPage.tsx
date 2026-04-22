import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createBooking } from "../../api/bookingApi";
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

    try {
      await createBooking({
        ...formData,
        resourceId: Number(formData.resourceId),
      });
      navigate("/bookings");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Bookings</p>
          <h2>New Booking Request</h2>
          <p className="muted-text">
            Reserve a facility or asset for your needs.
          </p>
        </div>
        <Link to="/bookings" className="button button-secondary">
          Cancel
        </Link>
      </div>

      <div className="panel">
        {error && (
          <div className="error-panel" style={{ marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-stack">
          <div className="form-group">
            <label htmlFor="resourceId">Resource</label>
            <select
              id="resourceId"
              name="resourceId"
              value={formData.resourceId}
              onChange={handleChange}
              required
            >
              <option value="">Select a resource</option>
              {resources.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.category} - Cap: {r.capacity})
                </option>
              ))}
            </select>
            {loadingResources && <small>Loading resources...</small>}
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date & Time</label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date & Time</label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="purpose">Purpose</label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              rows={4}
              required
              placeholder="Why do you need this resource?"
            />
          </div>

          <div className="form-group">
            <label htmlFor="expectedAttendees">Expected Attendees</label>
            <input
              type="number"
              id="expectedAttendees"
              name="expectedAttendees"
              value={formData.expectedAttendees}
              onChange={handleChange}
              min={1}
              required
            />
          </div>

          <button type="submit" className="button" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </section>
  );
}
