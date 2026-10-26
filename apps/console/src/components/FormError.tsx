import type { HTMLAttributes } from "react";
import AlertCircleIcon from "@/icons/alert-circle.svg";

export interface FormErrorProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  message?: string | null;
}

export function FormError({
  id,
  message,
  className = "",
  ...props
}: FormErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      id={id}
      role="alert"
      className={`flex items-start gap-2.5 rounded-lg border-2 border-amber-deep bg-amber/10 px-3.5 py-3 text-sm font-medium text-charcoal ${className}`.trim()}
      {...props}
    >
      <AlertCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-deep" />
      <span>{message}</span>
    </div>
  );
}

export default FormError;
