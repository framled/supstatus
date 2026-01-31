
import { clsx } from "clsx";
import { SuitabilityResult } from "@/lib/types";

export function SuitabilityBadge({ result }: { result: SuitabilityResult }) {
    const colorClass =
        result.color === 'green' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
            result.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                'bg-red-500/20 text-red-300 border-red-500/30';

    return (
        <div className={clsx("px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-2 border", colorClass)}>
            {result.level}
        </div>
    );
}
