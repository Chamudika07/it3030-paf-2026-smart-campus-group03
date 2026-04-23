import { useNavigate } from "react-router-dom";

type BackButtonProps = {
  label?: string;
  fallbackPath?: string | number;
};

export function BackButton({ label = "← Back", fallbackPath = -1 }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof fallbackPath === "string") {
      navigate(fallbackPath);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <button onClick={handleClick} className="button-secondary">
      {label}
    </button>
  );
}
