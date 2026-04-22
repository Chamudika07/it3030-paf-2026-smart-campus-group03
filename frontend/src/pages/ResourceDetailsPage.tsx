import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchResourceById, deleteResource } from "../api/resourceApi";
import { BackButton } from "../components/common/BackButton";
import type { Resource, ResourceCategory } from "../types/resource";

const locationLabels: Record<string, string> = {
  NEW_BUILDING: "New Building",
  MAIN_BUILDING: "Main Building",
  ENGINEERING_BUILDING: "Engineering Building",
  BUSINESS_BUILDING: "Business Building",
  VILLOM_ANGELS: "Villom Angels"
};

const categoryLabels: Record<ResourceCategory, string> = {
  LECTURE_HALL: "Lecture Hall",
  LAB: "Lab",
  MEETING_ROOM: "Meeting Room",
  EQUIPMENT: "Equipment"
};

export function ResourceDetailsPage() {
  const navigate = useNavigate();
  const { resourceId } = useParams<{ resourceId: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    async function loadResource() {
      if (!resourceId) {
        setError("Resource ID is missing");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchResourceById(Number(resourceId));
        setResource(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load resource";
        setError(`Could not load resource: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    }

    loadResource();
  }, [resourceId]);

  const handleDelete = async () => {
    if (!resource) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete the resource "${resource.name}" (${resource.code})? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(true);
    setDeleteError("");

    try {
      await deleteResource(resource.id);
      navigate("/resources");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete resource";
      setDeleteError(`Delete failed: ${errorMessage}`);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <section className="stack">
        <div className="page-header">
          <div>
            <p className="eyebrow">Member 1 ownership</p>
            <h2>Resource Details</h2>
            <p className="muted-text">Loading resource information...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !resource) {
    return (
      <section className="stack">
        <div className="page-header">
          <div>
            <p className="eyebrow">Member 1 ownership</p>
            <h2>Resource Details</h2>
            <p className="muted-text">Error loading resource</p>
          </div>
          <BackButton label="← Back" fallbackPath="/resources" />
        </div>
        <div className="panel error-panel">
          {error || "Resource not found"}
        </div>
      </section>
    );
  }

  return (
    <section className="stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Member 1 ownership</p>
          <h2>{resource.name}</h2>
          <p className="muted-text">{resource.code}</p>
        </div>
        <div className="header-actions">
          <button
            onClick={() => navigate(`/resources/${resource.id}/edit`)}
            className="action-button edit-button"
          >
            ✏️ Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="action-button delete-button"
          >
            {deleting ? "Deleting..." : "🗑️ Delete"}
          </button>
          <BackButton label="← Back" fallbackPath="/resources" />
        </div>
      </div>

      {deleteError && (
        <div className="panel error-panel">
          {deleteError}
        </div>
      )}

      <div className="panel">
        <div className="details-grid">
          {/* Code */}
          <div className="detail-item">
            <label className="detail-label">Resource Code</label>
            <p className="detail-value code-badge">{resource.code}</p>
          </div>

          {/* Category */}
          <div className="detail-item">
            <label className="detail-label">Category</label>
            <p className="detail-value">{categoryLabels[resource.category]}</p>
          </div>

          {/* Location */}
          <div className="detail-item">
            <label className="detail-label">Location</label>
            <p className="detail-value">{locationLabels[resource.location] || resource.location}</p>
          </div>

          {/* Capacity */}
          <div className="detail-item">
            <label className="detail-label">Capacity</label>
            <p className="detail-value">👥 {resource.capacity} person(s)</p>
          </div>

          {/* Status */}
          <div className="detail-item">
            <label className="detail-label">Status</label>
            <p className="detail-value">
              <span className={`status-badge ${resource.active ? "status-active" : "status-inactive"}`}>
                {resource.active ? "Active" : "Inactive"}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="panel info-panel">
        <h3 className="info-title">About this resource</h3>
        <p className="info-text">
          This resource is available for booking and scheduling. Contact the operations team for any maintenance requests or issues.
        </p>
      </div>

      <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
          margin-bottom: 1rem;
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: flex-end;
          align-items: center;
        }

        .action-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .edit-button {
          background-color: #3b82f6;
          color: white;
        }

        .edit-button:hover {
          background-color: #2563eb;
        }

        .delete-button {
          background-color: #ef4444;
          color: white;
        }

        .delete-button:hover:not(:disabled) {
          background-color: #dc2626;
        }

        .delete-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .back-button {
          padding: 0.75rem 1.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.95rem;
          font-weight: 600;
          background-color: #f9fafb;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          height: fit-content;
        }

        .back-button:hover {
          background-color: #e5e7eb;
          border-color: #9ca3af;
        }

        .back-button:active {
          background-color: #d1d5db;
        }

        .panel {
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          background-color: white;
        }

        .error-panel {
          background-color: #fee;
          border-color: #fcc;
          color: #c33;
          font-weight: 500;
        }

        .info-panel {
          background-color: #f0f9ff;
          border-color: #bfdbfe;
        }

        .info-title {
          margin: 0 0 0.75rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: #1e40af;
        }

        .info-text {
          margin: 0;
          color: #1e3a8a;
          line-height: 1.5;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .detail-label {
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #6b7280;
        }

        .detail-value {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 500;
          color: #1f2937;
        }

        .code-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background-color: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-family: "Courier New", monospace;
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
        }

        .status-badge {
          display: inline-block;
          padding: 0.375rem 0.75rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .status-active {
          background-color: #d1fae5;
          color: #065f46;
        }

        .status-inactive {
          background-color: #fee2e2;
          color: #991b1b;
        }

        .stack {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .eyebrow {
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 0.5rem 0;
        }

        .page-header h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .muted-text {
          color: #6b7280;
          margin: 0;
        }
      `}</style>
    </section>
  );
}
