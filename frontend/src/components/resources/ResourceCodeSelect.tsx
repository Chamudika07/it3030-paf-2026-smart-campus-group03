import { useEffect, useState } from "react";
import { fetchResources } from "../../api/resourceApi";
import type { Resource } from "../../types/resource";

interface ResourceCodeSelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  showName?: boolean;
  className?: string;
  error?: string;
}

export function ResourceCodeSelect({
  value,
  onChange,
  placeholder = "Select a resource",
  label,
  required = false,
  disabled = false,
  showName = true,
  className = "",
  error
}: ResourceCodeSelectProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const loadResources = async () => {
      try {
        setLoading(true);
        const data = await fetchResources();
        setResources(data);
        setFetchError("");
      } catch (err) {
        setFetchError("Failed to load resources");
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  return (
    <div className="resource-code-select-wrapper">
      {label && (
        <label>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
        disabled={disabled || loading || resources.length === 0}
        className={`resource-code-select ${className} ${error ? "select-error" : ""}`}
      >
        <option value="">{placeholder}</option>
        {loading && <option disabled>Loading resources...</option>}
        {!loading && resources.length === 0 && (
          <option disabled>{fetchError || "No resources available"}</option>
        )}
        {!loading &&
          resources.map((resource) => (
            <option key={resource.id} value={resource.id}>
              {showName
                ? `${resource.code} - ${resource.name}`
                : resource.code}
            </option>
          ))}
      </select>
      {error && <p className="select-error-message">{error}</p>}
      {fetchError && !loading && (
        <p className="select-fetch-error">{fetchError}</p>
      )}

      <style>{`
        .resource-code-select-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .resource-code-select-wrapper label {
          font-weight: 600;
          font-size: 0.95rem;
          color: #1f2937;
        }

        .required {
          color: #e74c3c;
          font-weight: 700;
          margin-left: 0.25rem;
        }

        .resource-code-select {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.95rem;
          font-family: inherit;
          background-color: white;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .resource-code-select:hover:not(:disabled) {
          border-color: #9ca3af;
        }

        .resource-code-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .resource-code-select:disabled {
          background-color: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .select-error {
          border-color: #e74c3c !important;
          background-color: #fff5f5;
        }

        .select-error-message {
          color: #e74c3c;
          font-size: 0.875rem;
          margin: 0;
          font-weight: 500;
        }

        .select-fetch-error {
          color: #f97316;
          font-size: 0.875rem;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
