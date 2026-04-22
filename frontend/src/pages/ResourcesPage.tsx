import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
        <div className="topbar-actions">
          <Link to="/resources/codes" className="button-secondary">📋 Browse Codes</Link>
          <Link to="/resources/new" className="button-link">+ Create Resource</Link>
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
                      <ResourceStatusBadge active={resource.active} size="sm" />
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


    </section>
  );
}

