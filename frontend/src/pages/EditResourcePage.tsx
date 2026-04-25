import { useState, useMemo, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchResourceById, updateResource } from "../api/resourceApi";
import { BackButton } from "../components/common/BackButton";
import type { ResourceCategory } from "../types/resource";

type FormState = {
  code: string; // read-only
  location: string;
  category: ResourceCategory;
  name: string;
  capacity: string;
  active: boolean;
};

type FormErrors = {
  [K in keyof FormState]?: string;
};

// Location options
const locationOptions = [
  { label: "New Building", value: "NEW_BUILDING" },
  { label: "Main Building", value: "MAIN_BUILDING" },
  { label: "Engineering Building", value: "ENGINEERING_BUILDING" },
  { label: "Business Building", value: "BUSINESS_BUILDING" },
  { label: "Villom Angels", value: "VILLOM_ANGELS" }
];

// Resource category options
const resourceCategoryOptions: { label: string; value: ResourceCategory }[] = [
  { label: "Lecture Hall", value: "LECTURE_HALL" },
  { label: "Lab", value: "LAB" },
  { label: "Meeting Room", value: "MEETING_ROOM" },
  { label: "Equipment", value: "EQUIPMENT" }
];

// Resource codes mapping by location and category
const resourceCodesByLocationAndCategory: Record<string, Record<ResourceCategory, string[]>> = {
  NEW_BUILDING: {
    LECTURE_HALL: ["A301", "A501", "A502", "A503", "A504"],
    LAB: ["A401", "A601", "A602", "A603", "A604"],
    MEETING_ROOM: ["A101", "A102", "A103"],
    EQUIPMENT: ["PROJ-001", "PROJ-002", "SCANNER-001"]
  },
  MAIN_BUILDING: {
    LECTURE_HALL: ["F301", "F501", "F502", "F503", "F504"],
    LAB: ["F301", "F501", "F502", "F503", "F504"],
    MEETING_ROOM: ["F101", "F102", "F103"],
    EQUIPMENT: ["PROJ-003", "PROJ-004", "SCANNER-002"]
  },
  ENGINEERING_BUILDING: {
    LECTURE_HALL: ["E301", "E501", "E502", "E503"],
    LAB: ["E401", "E601", "E602", "E603"],
    MEETING_ROOM: ["E101", "E102"],
    EQUIPMENT: ["PROJ-005", "PROJ-006"]
  },
  BUSINESS_BUILDING: {
    LECTURE_HALL: ["B301", "B501", "B502"],
    LAB: ["B401", "B601", "B602"],
    MEETING_ROOM: ["B101", "B102", "B103"],
    EQUIPMENT: ["PROJ-007", "SCANNER-003"]
  },
  VILLOM_ANGELS: {
    LECTURE_HALL: ["V301", "V501", "V502", "V503"],
    LAB: ["V401", "V601", "V602"],
    MEETING_ROOM: ["V101", "V102"],
    EQUIPMENT: ["PROJ-008", "SCANNER-004"]
  }
};

const initialForm: FormState = {
  code: "",
  location: "",
  category: "LECTURE_HALL",
  name: "",
  capacity: "",
  active: true
};

export function EditResourcePage() {
  const navigate = useNavigate();
  const { resourceId } = useParams<{ resourceId: string }>();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(true);
  const [originalCode, setOriginalCode] = useState("");

  // Load resource data on mount
  useEffect(() => {
    async function loadResource() {
      if (!resourceId) {
        setServerError("Resource ID is missing");
        setLoading(false);
        return;
      }

      try {
        const resource = await fetchResourceById(Number(resourceId));
        setForm({
          code: resource.code,
          location: resource.location,
          category: resource.category,
          name: resource.name,
          capacity: String(resource.capacity),
          active: resource.active
        });
        setOriginalCode(resource.code);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load resource";
        setServerError(`Could not load resource: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    }

    loadResource();
  }, [resourceId]);

  // Get available codes based on selected location and category
  const availableCodes = useMemo(() => {
    if (!form.location) return [];
    return resourceCodesByLocationAndCategory[form.location]?.[form.category] || [];
  }, [form.location, form.category]);

  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    // Location validation
    if (!form.location) {
      newErrors.location = "Location is required";
    }

    // Category validation
    if (!form.category) {
      newErrors.category = "Category is required";
    }

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Resource name is required";
    } else if (form.name.trim().length > 255) {
      newErrors.name = "Resource name must be 255 characters or less";
    }

    // Capacity validation
    if (!form.capacity.trim()) {
      newErrors.capacity = "Capacity is required";
    } else {
      const capacityNum = Number(form.capacity);
      if (isNaN(capacityNum)) {
        newErrors.capacity = "Capacity must be a valid number";
      } else if (capacityNum < 1) {
        newErrors.capacity = "Capacity must be at least 1";
      } else if (capacityNum > 10000) {
        newErrors.capacity = "Capacity cannot exceed 10000";
      } else if (!Number.isInteger(capacityNum)) {
        newErrors.capacity = "Capacity must be a whole number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleInputChange(field: keyof FormState, value: string | boolean) {
    setForm((prev) => ({
      ...prev,
      [field]: typeof value === "boolean" ? value : value
    }));
    // Clear error for this field when user starts typing (only for string fields)
    if (typeof value === "string" && errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined
      }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError("");

    if (!validateForm()) {
      return;
    }

    if (!resourceId) {
      setServerError("Resource ID is missing");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        location: form.location,
        capacity: Number(form.capacity),
        active: form.active
      };

      await updateResource(Number(resourceId), payload);
      navigate(`/resources`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update resource";
      setServerError(`Resource update failed: ${errorMessage}. Please check your data and try again.`);
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <section className="stack">
        <div className="page-header">
          <div>
            <p className="eyebrow">Member 1 ownership</p>
            <h2>Edit Resource</h2>
            <p className="muted-text">Loading resource data...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Member 1 ownership</p>
          <h2>Edit Resource</h2>
          <p className="muted-text">Update campus facility or asset details</p>
        </div>
        <BackButton label="← Back" fallbackPath="/resources" />
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="stack">
          {serverError && (
            <div className="error-message" role="alert">
              {serverError}
            </div>
          )}

          {/* Resource Code Field - Read Only */}
          <div className="form-group">
            <label htmlFor="code">
              Resource Code
            </label>
            <div className="read-only-field">
              {form.code}
            </div>
            <p className="help-text">Resource code cannot be changed</p>
          </div>

          {/* Location Field */}
          <div className="form-group">
            <label htmlFor="location">
              Location <span className="required">*</span>
            </label>
            <select
              id="location"
              value={form.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className={errors.location ? "input-error" : ""}
              disabled={submitting}
            >
              <option value="">Select a location...</option>
              {locationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.location && <p className="field-error">{errors.location}</p>}
          </div>

          {/* Category Field */}
          <div className="form-group">
            <label htmlFor="category">
              Category <span className="required">*</span>
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => handleInputChange("category", e.target.value as ResourceCategory)}
              className={errors.category ? "input-error" : ""}
              disabled={submitting || !form.location}
            >
              {resourceCategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.category && <p className="field-error">{errors.category}</p>}
            {!form.location && <p className="help-text">Select a location first</p>}
          </div>

          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="name">
              Resource Name <span className="required">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Main Lecture Hall"
              className={errors.name ? "input-error" : ""}
              disabled={submitting}
            />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          {/* Capacity Field */}
          <div className="form-group">
            <label htmlFor="capacity">
              Capacity <span className="required">*</span>
            </label>
            <input
              id="capacity"
              type="number"
              value={form.capacity}
              onChange={(e) => handleInputChange("capacity", e.target.value)}
              placeholder="e.g., 50"
              min="1"
              max="10000"
              className={errors.capacity ? "input-error" : ""}
              disabled={submitting}
            />
            {errors.capacity && <p className="field-error">{errors.capacity}</p>}
            <p className="help-text">Must be between 1 and 10,000</p>
          </div>

          {/* Status Field */}
          <div className="form-group">
            <label htmlFor="active" className="checkbox-label">
              <input
                id="active"
                type="checkbox"
                checked={form.active}
                onChange={(e) => handleInputChange("active", e.target.checked)}
                disabled={submitting}
                className="checkbox-input"
              />
              <span>Active</span>
            </label>
            <p className="help-text">Uncheck to disable this resource</p>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={submitting}
              className="button-link"
            >
              {submitting ? "Updating..." : "Update Resource"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/resources")}
              disabled={submitting}
              className="button-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .form-container {
          max-width: 600px;
          margin: 2rem 0;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 600;
          font-size: 0.95rem;
        }

        .required {
          color: #e74c3c;
          font-weight: 700;
        }

        .form-group input,
        .form-group select {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.95rem;
          font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s;
          background-color: white;
        }

        .form-group select {
          cursor: pointer;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-group input:disabled,
        .form-group select:disabled {
          background-color: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .input-error {
          border-color: #e74c3c !important;
          background-color: #fff5f5;
        }

        .field-error {
          color: #e74c3c;
          font-size: 0.875rem;
          margin: 0;
          font-weight: 500;
        }

        .help-text {
          color: #6b7280;
          font-size: 0.875rem;
          margin: 0;
        }

        .error-message {
          padding: 1rem;
          background-color: #fee;
          border: 1px solid #fcc;
          border-radius: 0.375rem;
          color: #c33;
          font-weight: 500;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }



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

        .read-only-field {
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          background-color: #f9fafb;
          color: #374151;
          font-weight: 500;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 400;
          cursor: pointer;
        }

        .checkbox-input {
          width: 1.25rem;
          height: 1.25rem;
          cursor: pointer;
        }

        .checkbox-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
}
