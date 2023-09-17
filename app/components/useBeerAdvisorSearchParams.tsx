import { useSearchParams } from "@remix-run/react";

export type OrderBy = "name_desc" | "name_asc";

export default function useBeerAdvisorSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentOrderBy = (searchParams.get("order_by") ||
    "name_desc") as OrderBy;

  const updateOrderBy = (newOrderBy: OrderBy) => {
    setSearchParams({
      order_by: newOrderBy,
    });
  };

  return { currentOrderBy, updateOrderBy } as const;
}
