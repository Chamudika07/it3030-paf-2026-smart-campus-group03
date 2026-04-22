import { useEffect, useState } from "react";
import { fetchResources } from "../api/resourceApi";
import type { Resource } from "../types/resource";

export function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <section className="stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Member 1 ownership</p>
          <h2>Resources</h2>
        </div>
      </div>

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
              </tr>
            </thead>
            <tbody>
              {resources.length === 0 ? (
                <tr>
                  <td colSpan={6}>No resources yet. Add your first resource from the backend API.</td>
                </tr>
              ) : (
                resources.map((resource) => (
                  <tr key={resource.id}>
                    <td>{resource.code}</td>
                    <td>{resource.name}</td>
                    <td>{resource.category}</td>
                    <td>{resource.location}</td>
                    <td>{resource.capacity}</td>
                    <td>{resource.active ? "Active" : "Inactive"}</td>
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

