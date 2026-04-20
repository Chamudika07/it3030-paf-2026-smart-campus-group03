interface ResourceStatusBadgeProps {
  active: boolean;
}

export function ResourceStatusBadge({ active }: ResourceStatusBadgeProps) {
  const statusClass = active ? "badge-active" : "badge-inactive";
  const statusText = active ? "Active" : "Out of Service";
  
  return (
    <span className={`badge ${statusClass}`} title={statusText}>
      {statusText}
    </span>
  );
}
