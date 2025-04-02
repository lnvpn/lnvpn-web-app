import { Badge } from "@/components/ui/badge";
import { countryRegionMap } from "@/data/countryNames";
import { getCountryCodeFromSlug } from "@/utils/esimUtils";
import Link from "next/link";

interface RegionalBadgesProps {
  slug: string;
}

export default function RegionalBadges({ slug }: RegionalBadgesProps) {
  const countryCode = getCountryCodeFromSlug(slug);
  if (!countryCode) return null;

  const regions = countryRegionMap[countryCode] || [];
  if (regions.length === 0) return null;

  return (
    <div className="flex flex-wrap  gap-2 my-4">
      {regions.map((region) => (
        <Link
          key={region}
          href={`/esim/data-plans/${region.toLowerCase().replace(/\s+/g, "-")}`}
          className="hover:opacity-80 transition-opacity"
        >
          <Badge variant="default">{region} Package </Badge>
        </Link>
      ))}
    </div>
  );
}
