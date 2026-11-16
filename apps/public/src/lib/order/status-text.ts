import { fill } from "@/lib/order/format";
import type { OrderLabels } from "@/lib/order/types";
import type { OrderRequestState } from "@/hooks/useOrderRequest";

type StatusTextInput = Pick<OrderRequestState, "status" | "errors" | "fieldErrorCount"> & {
  labels: OrderLabels;
  supportEmail: string;
};

/**
 * One message for everything that is not a single field: sending, a problem with the pieces, the spam check,
 * a failure, or "some fields need attention". Empty when there is nothing to say.
 */
export function orderStatusText({ status, errors, fieldErrorCount, labels, supportEmail }: StatusTextInput): string {
  if (status === "sending") return labels.sending;
  if (errors.items) return labels.errors[errors.items as keyof OrderLabels["errors"]] ?? labels.errors.noItems;
  if (errors.form) return errors.form === "captcha" ? labels.captcha : fill(labels.failed, { email: supportEmail });
  if (fieldErrorCount > 0) return labels.errorSummary;
  return "";
}
