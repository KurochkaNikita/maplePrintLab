import type { HTMLAttributes } from "react";

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
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        className="mt-0.5 h-5 w-5 shrink-0 text-amber-deep"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
}

export default FormError;
