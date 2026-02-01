import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export function SafetyWarning() {
    const { t } = useLanguage();

    return (
        <div className="mt-8 glass-panel rounded-2xl p-6 flex gap-6 items-center">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
                <AlertTriangle className="w-6 h-6 text-primary" />
            </div>
            <div>
                <h3 className="text-white font-bold mb-1">{t.safety.title}</h3>
                <p className="text-cream/60 text-sm leading-relaxed">
                    {t.safety.message}
                    <span className="block mt-1 text-cream/80 font-medium">{t.safety.vest}</span>
                </p>
            </div>
        </div>
    );
}
