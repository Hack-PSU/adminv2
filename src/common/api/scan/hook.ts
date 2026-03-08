import { useQuery } from "@tanstack/react-query";
import { getAllScans } from "./provider";
import { ScanEntity } from "./entity";

export const scanQueryKeys = {
  all: (hackathonId?: string) => ["scans", hackathonId] as const,
};

export function useAllScans(hackathonId?: string) {
  return useQuery<ScanEntity[]>({
    queryKey: scanQueryKeys.all(hackathonId),
    queryFn: () => getAllScans(hackathonId),
  });
}
