import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchResources, searchResources as searchResourcesApi } from "../api/resourceApi";
import { ResourceSearchFilter } from "../components/resources/ResourceSearchFilter";
import { ResourceStatusBadge } from "../components/resources/ResourceStatusBadge";
import type { Resource } from "../types/resource";
import type { SearchFilters } from "../api/resourceApi";

export function ResourcesPage() {
  const navigate = useNavigate();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    async function loadResources() {
      try {
        const data = await fetchResources();
        setResources(data);
      } catch (err) {
        setError("Could not load resources. Start the backend and database first.");
      } finally {
        setLoading(false);
      }
    }

    loadResources();
  }, []);

  const handleSearch = async (filters: SearchFilters) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const data = await searchResourcesApi(filters);
      setResources(data);
      setError("");
    } catch (err) {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Member 1 ownership</p>
          <h2>Resources</h2>
          <p className="muted-text">Manage campus facilities and assets</p>
        </div>
        <div className="header-buttons">
          <button
            onClick={() => navigate("/resources/codes")}
            className="button button-secondary"
            style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}
          >
            📋 Browse Codes
          </button>
          <button
            onClick={() => navigate("/resources/new")}
            className="button button-primary"
            style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}
          >
            + Create Resource
          </button>
        </div>
      </div>

      <ResourceSearchFilter onSearch={handleSearch} />

      {loading && <div className="panel">Loading resources...</div>}
      {error && <div className="panel error-panel">{error}</div>}

      {!loading && !error && (
        <div className="panel">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    {hasSearched
                      ? "No resources match your search."
                      : "No resources yet. Add your first resource from the backend API."}
                  </td>
                </tr>
              ) : (
                resources.map((resource) => (
                  <tr key={resource.id}>
                    <td>{resource.code}</td>
                    <td>{resource.name}</td>
                    <td>{resource.category}</td>
                    <td>{resource.location}</td>
                    <td>{resource.capacity}</td>
                    <td>
                      <ResourceStatusBadge active={resource.active} />
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => navigate(`/resources/${resource.id}`)}
                          className="action-button view-button"
                          title="View resource details"
                        >
                          👁️ View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
          margin-bottom: 1rem;
        }

        .header-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .button-primary {
          background-color: #3b82f6;
          color: white;
        }

        .button-primary:hover {
          background-color: #2563eb;
        }

        .button-secondary {
          background-color: #e5e7eb;
          color: #1f2937;
        }

        .button-secondary:hover {
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
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th {
          text-align: left;
          padding: 1rem;
          border-bottom: 2px solid #e5e7eb;
          font-weight: 600;
          background-color: #f9fafb;
        }

        .table td {
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .table tbody tr:hover {
          background-color: #f9fafb;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .action-button {
          padding: 0.5rem 0.75rem;
          border: none;
          border-radius: 0.25rem;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .view-button {
          background-color: #3b82f6;
          color: white;
        }

        .view-button:hover {
          background-color: #2563eb;
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

        .delete-button:hover {
          background-color: #dc2626;
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

