import { AlertTriangle } from 'lucide-react';

export function SafetyWarning() {
    return (
        <div className="mt-8 glass-panel rounded-2xl p-6 flex gap-6 items-center">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
                <AlertTriangle className="w-6 h-6 text-primary" />
            </div>
            <div>
                <h3 className="text-white font-bold mb-1">Safety First</h3>
                <p className="text-cream/60 text-sm leading-relaxed">
                    Conditions in Central Chile can change rapidly. Always check local authorities and never paddle alone in offshore winds.
                </p>
            </div>
        </div>
    );
}
