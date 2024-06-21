import { cn } from "@/lib/utility/UtilityFunctions";

interface SpinnerProps {
  className?: string;
  height?: string;
  width?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className, height, width }) => (
  <div className={className}>
    <div
      className={cn(
        `${height || "h-32"} ${width || "h-32"} animate-spin rounded-full border-b-2 border-t-2 border-gray-900`,
      )}
    ></div>
  </div>
);

export default Spinner;
