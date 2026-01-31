
import { clsx } from "clsx";
import { SuitabilityLevel } from "@/lib/types";

export function SuitabilityBadge({ level }: { level: SuitabilityLevel }) {
    const colorClass =
        level === 'Junior' ? 'bg-[#4ADE80] text-black shadow-[0_0_8px_rgba(74,222,128,0.6)]' :
            level === 'Intermediate' ? 'bg-[#FACC15] text-black shadow-[0_0_8px_rgba(250,204,21,0.6)]' :
                'bg-[#F43F5E] text-white shadow-[0_0_8px_rgba(244,63,94,0.6)]';

    return (
        <div className={clsx("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-2", colorClass)}>
            {level}
        </div>
    );
}
