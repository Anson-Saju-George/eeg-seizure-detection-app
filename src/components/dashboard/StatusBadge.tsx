import { Badge } from "@/components/ui/badge";

export function StatusBadge({
  status,
}: {
  status: "NORMAL" | "WARNING" | "HIGH RISK";
}) {
  const tone =
    status === "HIGH RISK" ? "danger" : status === "WARNING" ? "warning" : "success";

  return <Badge tone={tone}>{status}</Badge>;
}
