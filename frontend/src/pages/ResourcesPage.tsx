import { useEffect, useState } from "react";
import { fetchResources } from "../api/resourceApi";
import { Badge } from "../components/ui/Badge";
import { DataTable } from "../components/ui/DataTable";
import { PageHeader } from "../components/ui/PageHeader";
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
    <section className="space-y-6">
      <PageHeader
        eyebrow="Member 1 ownership"
        title="Resources"
        description="Track campus labs, equipment, meeting rooms, and operational availability from one searchable table."
        actions={<Badge tone="orange">{resources.length} listed</Badge>}
      />

      {loading && (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white px-6 py-5 text-sm text-[#334155] shadow-md shadow-slate-200/50">
          Loading resources...
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-sm text-rose-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <DataTable columns={["Code", "Name", "Category", "Location", "Capacity", "Status"]}>
          {resources.length === 0 ? (
            <tr>
              <td className="px-6 py-10 text-sm text-[#94A3B8]" colSpan={6}>
                No resources yet. Add your first resource from the backend API.
              </td>
            </tr>
          ) : (
            resources.map((resource, index) => (
              <tr
                key={resource.id}
                className={index % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}
              >
                <td className="px-6 py-4 text-sm font-semibold text-[#0F172A]">{resource.code}</td>
                <td className="px-6 py-4 text-sm text-[#334155]">{resource.name}</td>
                <td className="px-6 py-4 text-sm text-[#334155]">{resource.category}</td>
                <td className="px-6 py-4 text-sm text-[#334155]">{resource.location}</td>
                <td className="px-6 py-4 text-sm text-[#334155]">{resource.capacity}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={[
                      "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                      resource.active ? "bg-[#DBEAFE] text-[#1D4ED8]" : "bg-slate-100 text-[#334155]"
                    ].join(" ")}
                  >
                    {resource.active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </DataTable>
      )}
    </section>
  );
}
