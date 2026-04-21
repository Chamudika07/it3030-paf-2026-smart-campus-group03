import { useEffect, useState } from "react";
import { fetchResources } from "../api/resourceApi";
import { BackButton } from "../components/common/BackButton";
import type { Resource, ResourceCategory } from "../types/resource";

export function ResourceCodeBrowser() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ResourceCategory | "">("");

  const categories: { label: string; value: ResourceCategory }[] = [
    { label: "Lecture Hall", value: "LECTURE_HALL" },
    { label: "Lab", value: "LAB" },
    { label: "Meeting Room", value: "MEETING_ROOM" },
    { label: "Equipment", value: "EQUIPMENT" }
  ];

  useEffect(() => {
    const loadResources = async () => {
      try {
        const data = await fetchResources();
        setResources(data);
        setFilteredResources(data);
      } catch (err) {
        setError("Failed to load resources");
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  useEffect(() => {
    let filtered = resources;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.code.toLowerCase().includes(query) ||
          r.name.toLowerCase().includes(query) ||
          r.location.toLowerCase().includes(query)
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((r) => r.category === categoryFilter);
    }

    setFilteredResources(filtered);
  }, [searchQuery, categoryFilter, resources]);

  const getCategoryLabel = (category: ResourceCategory): string => {
    return categories.find((c) => c.value === category)?.label || category;
  };

  return (
    <section className="stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Reference</p>
          <h2>Resource Codes</h2>
          <p className="muted-text">Browse and search all available resource codes</p>
        </div>
        <BackButton label="← Back" fallbackPath="/resources" />
      </div>

      {/* Filters */}
      <div className="filter-section">
        <input
          type="text"
          placeholder="Search by code, name, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-field"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter((e.target.value as ResourceCategory) || "")}
          className="category-filter"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      {loading && <div className="loading-state">Loading resources...</div>}
      {error && <div className="error-state">{error}</div>}

      {!loading && !error && filteredResources.length === 0 && (
        <div className="empty-state">
          <p>No resources match your search criteria.</p>
        </div>
      )}

      {!loading && !error && filteredResources.length > 0 && (
        <div className="resource-list-container">
          <div className="result-info">
            Showing {filteredResources.length} of {resources.length} resources
          </div>

          <div className="resource-grid">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="resource-card">
                <div className="resource-code-badge">{resource.code}</div>
                <div className="resource-details">
                  <h3 className="resource-name">{resource.name}</h3>
                  <p className="resource-category">{getCategoryLabel(resource.category)}</p>
                  <p className="resource-location">📍 {resource.location}</p>
                  <div className="resource-capacity">
                    <span className="capacity-icon">👥</span>
                    <span>{resource.capacity} person(s)</span>
                  </div>
                </div>
                <div className="resource-status">
                  <span className={`badge ${resource.active ? "badge-active" : "badge-inactive"}`}>
                    {resource.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .stack {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
          margin-bottom: 1rem;
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

        .filter-section {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          padding: 1rem;
          background-color: #f9fafb;
          border-radius: 0.5rem;
        }

        .search-field {
          flex: 1;
          min-width: 250px;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.95rem;
          font-family: inherit;
        }

        .search-field:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .category-filter {
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.95rem;
          font-family: inherit;
          background-color: white;
          cursor: pointer;
          min-width: 180px;
        }

        .category-filter:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .loading-state,
        .error-state,
        .empty-state {
          padding: 2rem;
          text-align: center;
          background-color: #f9fafb;
          border-radius: 0.5rem;
          color: #6b7280;
          font-weight: 500;
        }

        .error-state {
          background-color: #fee;
          color: #c33;
          border: 1px solid #fcc;
        }

        .resource-list-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .result-info {
          font-size: 0.875rem;
          color: #6b7280;
          padding: 0 0.5rem;
        }

        .resource-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1rem;
        }

        .resource-card {
          padding: 1.25rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          background: white;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .resource-card:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .resource-code-badge {
          display: inline-block;
          padding: 0.5rem 0.75rem;
          background-color: #3b82f6;
          color: white;
          border-radius: 0.25rem;
          font-weight: 700;
          font-size: 0.875rem;
          width: fit-content;
        }

        .resource-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .resource-name {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 700;
          color: #1f2937;
        }

        .resource-category {
          margin: 0;
          font-size: 0.875rem;
          color: #7c3aed;
          font-weight: 600;
        }

        .resource-location {
          margin: 0;
          font-size: 0.9rem;
          color: #6b7280;
        }

        .resource-capacity {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #6b7280;
        }

        .capacity-icon {
          font-size: 1rem;
        }

        .resource-status {
          display: flex;
          justify-content: flex-end;
        }

        .badge {
          display: inline-block;
          padding: 0.375rem 0.75rem;
          border-radius: 0.25rem;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .badge-active {
          background-color: #d1fae5;
          color: #065f46;
        }

        .badge-inactive {
          background-color: #fee2e2;
          color: #991b1b;
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
      `}</style>
    </section>
  );
}
