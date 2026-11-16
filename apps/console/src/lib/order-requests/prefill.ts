import type { OrderRequestRecord, ProductSaleOption } from "@maple-print-lab/db";
import type { OrderFormValues } from "@/lib/finance/types";
import { emptyOrderValues } from "@/lib/finance/form-values";

/** Order form values for a request: one line per requested product with its price (as quoted then) and our cost, who asked in the note. */
export function orderValuesFromRequest(request: OrderRequestRecord, products: ProductSaleOption[], today: string): OrderFormValues {
  return {
    ...emptyOrderValues(today),
    note: `${request.firstName} ${request.lastName} <${request.email}>${request.message ? `\n${request.message}` : ""}`,
    items: request.items.map((item) => {
      const product = item.productId === null ? undefined : products.find((p) => p.id === item.productId);
      return {
        productId: product ? String(product.id) : "",
        description: item.productTitle,
        quantity: String(item.quantity),
        unitPrice: item.productPrice ?? product?.price ?? "",
        unitCost: product?.cost ?? "",
      };
    }),
  };
}
