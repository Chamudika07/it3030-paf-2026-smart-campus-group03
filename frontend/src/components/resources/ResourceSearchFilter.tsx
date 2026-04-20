import { useState } from "react";
import type { ResourceCategory } from "../../types/resource";
import type { SearchFilters } from "../../api/resourceApi";

interface ResourceSearchFilterProps {
  onSearch: (filters: SearchFilters) => void;
}

export function ResourceSearchFilter({ onSearch }: ResourceSearchFilterProps) {
  const [filters, setFilters] = useState<SearchFilters>({});

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({});
    onSearch({});
  };

  return (
    <div className="search-filter">
      <input
        type="text"
        placeholder="Search by name or code..."
        value={filters.query || ""}
        onChange={(e) => setFilters({ ...filters, query: e.target.value })}
        className="search-input"
      />

      <select
        value={filters.category || ""}
        onChange={(e) =>
          setFilters({
            ...filters,
            category: (e.target.value as ResourceCategory) || undefined,
          })
        }
        className="filter-select"
      >
        <option value="">All Categories</option>
        <option value="LECTURE_HALL">Lecture Hall</option>
        <option value="LAB">Lab</option>
        <option value="MEETING_ROOM">Meeting Room</option>
        <option value="EQUIPMENT">Equipment</option>
      </select>

      <input
        type="text"
        placeholder="Location..."
        value={filters.location || ""}
        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        className="filter-input"
      />

      <input
        type="number"
        placeholder="Min Capacity"
        value={filters.minCapacity || ""}
        onChange={(e) =>
          setFilters({
            ...filters,
            minCapacity: e.target.value ? Number(e.target.value) : undefined,
          })
        }
        className="filter-input"
      />

      <select
        value={
          filters.active === undefined
            ? ""
            : filters.active
              ? "true"
              : "false"
        }
        onChange={(e) => {
          if (e.target.value === "") {
            setFilters({ ...filters, active: undefined });
          } else {
            setFilters({ ...filters, active: e.target.value === "true" });
          }
        }}
        className="filter-select"
      >
        <option value="">All Statuses</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>

      <button onClick={handleSearch} className="btn btn-primary">
        Search
      </button>
      <button onClick={handleClear} className="btn btn-secondary">
        Clear
      </button>
    </div>
  );
}
