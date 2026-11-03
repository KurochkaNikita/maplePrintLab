import type { ReactNode } from "react";
import IconButton from "@/components/IconButton";
import TrashIcon from "@/icons/trash.svg";

export interface RepeatableItemProps {
  /** Unique id prefix; names the group through its title. */
  id: string;
  title: string;
  /** Accessible name of the delete button, e.g. "Remove question 2". */
  removeLabel: string;
  onRemove: () => void;
  /** Layout of the fields under the header; one column by default. */
  bodyClassName?: string;
  children: ReactNode;
}

/** One row of a list the admin can grow: a title with a red delete icon on the right, fields below. Renders an `<li>`. */
export function RepeatableItem({
  id,
  title,
  removeLabel,
  onRemove,
  bodyClassName = "",
  children,
}: RepeatableItemProps) {
  const titleId = `${id}-title`;

  return (
    <li
      role="group"
      aria-labelledby={titleId}
      className="border-t border-line pt-4 first:border-t-0 first:pt-0"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 id={titleId} className="text-sm font-semibold text-charcoal">
          {title}
        </h3>
        <IconButton icon={TrashIcon} tone="danger" label={removeLabel} className="-mr-2" onClick={onRemove} />
      </div>
      <div className={`mt-2 grid gap-4 ${bodyClassName}`.trim()}>{children}</div>
    </li>
  );
}

export default RepeatableItem;
