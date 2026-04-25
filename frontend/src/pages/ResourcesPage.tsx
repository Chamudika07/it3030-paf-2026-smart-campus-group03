import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchResources, searchResources as searchResourcesApi } from "../api/resourceApi";
import { ResourceSearchFilter } from "../components/resources/ResourceSearchFilter";
import { ResourceStatusBadge } from "../components/resources/ResourceStatusBadge";
import { Badge } from "../components/ui/Badge";
import { DataTable } from "../components/ui/DataTable";
import { PageHeader } from "../components/ui/PageHeader";
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
    <section className="space-y-6">
      <PageHeader
        eyebrow="Member 1 ownership"
        title="Resources"
        description="Manage campus facilities and assets with search, status visibility, and quick access to resource details."
        actions={
          <>
            <Badge tone="orange">{resources.length} listed</Badge>
            <Link to="/resources/new" className="button-link">
              + Create
            </Link>
          </>
        }
      />

      <ResourceSearchFilter onSearch={handleSearch} />

      {loading && (
        <div className="panel">Loading resources...</div>
      )}
      {error && <div className="panel error-panel">{error}</div>}

      {!loading && !error && (
        <DataTable columns={["Code", "Name", "Category", "Location", "Capacity", "Status", "Actions"]}>
          <>
              {resources.length === 0 ? (
                <tr>
                  <td className="px-6 py-10 text-sm text-[#94A3B8]" colSpan={7}>
                    {hasSearched
                      ? "No resources match your search."
                      : "No resources yet. Add your first resource from the backend API."}
                  </td>
                </tr>
              ) : (
                resources.map((resource, index) => (
                  <tr key={resource.id}>
                    <td className={index % 2 === 0 ? "bg-white px-6 py-4 text-sm font-semibold text-[#0F172A]" : "bg-[#F8FAFC] px-6 py-4 text-sm font-semibold text-[#0F172A]"}>
                      {resource.code}
                    </td>
                    <td className={index % 2 === 0 ? "bg-white px-6 py-4 text-sm text-[#334155]" : "bg-[#F8FAFC] px-6 py-4 text-sm text-[#334155]"}>
                      {resource.name}
                    </td>
                    <td className={index % 2 === 0 ? "bg-white px-6 py-4 text-sm text-[#334155]" : "bg-[#F8FAFC] px-6 py-4 text-sm text-[#334155]"}>
                      {resource.category}
                    </td>
                    <td className={index % 2 === 0 ? "bg-white px-6 py-4 text-sm text-[#334155]" : "bg-[#F8FAFC] px-6 py-4 text-sm text-[#334155]"}>
                      {resource.location}
                    </td>
                    <td className={index % 2 === 0 ? "bg-white px-6 py-4 text-sm text-[#334155]" : "bg-[#F8FAFC] px-6 py-4 text-sm text-[#334155]"}>
                      {resource.capacity}
                    </td>
                    <td className={index % 2 === 0 ? "bg-white px-6 py-4 text-sm" : "bg-[#F8FAFC] px-6 py-4 text-sm"}>
                      <ResourceStatusBadge active={resource.active} size="sm" />
                    </td>
                    <td className={index % 2 === 0 ? "bg-white px-6 py-4 text-sm" : "bg-[#F8FAFC] px-6 py-4 text-sm"}>
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
          </>
        </DataTable>
      )}

    </section>
  );
}
