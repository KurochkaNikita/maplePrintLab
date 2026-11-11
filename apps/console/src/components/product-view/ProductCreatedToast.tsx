"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/components/LocaleProvider";
import { useToast } from "@/hooks/useToast";

/** Announces "Product created" once after the redirect from the create form, then drops `?created=1` so a reload stays quiet. */
export function ProductCreatedToast({ productId }: { productId: number }) {
  const { notify } = useToast();
  const router = useRouter();
  const message = useT().pages.products.view.created;

  useEffect(() => {
    notify("success", message);
    router.replace(`/products/${productId}`, { scroll: false });
  }, [notify, router, message, productId]);

  return null;
}

export default ProductCreatedToast;
