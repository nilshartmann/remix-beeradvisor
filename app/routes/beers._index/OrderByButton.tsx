import useBeerAdvisorSearchParams, {
  OrderBy,
} from "~/components/useBeerAdvisorSearchParams";
import Button from "~/components/Button";

type OrderByButtonProps = {
  orderBy: OrderBy;
};

export default function OrderByButton({ orderBy }: OrderByButtonProps) {
  const { currentOrderBy, updateOrderBy } = useBeerAdvisorSearchParams();

  const label = orderBy === "name_asc" ? "desc" : "asc";

  return (
    <Button
      disabled={currentOrderBy === orderBy}
      onClick={() => updateOrderBy(orderBy)}
    >
      Order by name {label}
    </Button>
  );
}
