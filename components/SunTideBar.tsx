import { Sunrise, Sunset, Waves } from 'lucide-react';

export function SunTideBar() {
    // Mock data for now, ideal would be to fetch this
    return (
        <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/10">
                <Sunrise className="text-yellow-300 w-6 h-6 mb-2" />
                <span className="text-white/60 text-xs uppercase tracking-wider">Sunrise</span>
                <span className="text-white font-semibold">07:22 AM</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/10">
                <Sunset className="text-orange-400 w-6 h-6 mb-2" />
                <span className="text-white/60 text-xs uppercase tracking-wider">Sunset</span>
                <span className="text-white font-semibold">05:48 PM</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/10">
                <Waves className="text-blue-300 w-6 h-6 mb-2" />
                <span className="text-white/60 text-xs uppercase tracking-wider">Low Tide</span>
                <span className="text-white font-semibold">10:14 AM</span>
            </div>
        </div>
    );
}
