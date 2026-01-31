import { AlertTriangle } from 'lucide-react';

export function SafetyWarning() {
    return (
        <div className="mt-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex gap-4 items-start backdrop-blur-md">
            <div className="bg-red-500/20 p-2 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-200" />
            </div>
            <div>
                <h3 className="text-red-100 font-bold mb-1">Safety Warning</h3>
                <p className="text-red-200/80 text-sm leading-relaxed">
                    Conditions in Central Chile can change rapidly. Always check local authorities and never paddle alone in offshore winds.
                </p>
            </div>
        </div>
    );
}
