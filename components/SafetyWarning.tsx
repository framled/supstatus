import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import clsx from 'clsx';

export function SafetyWarning() {
    const { t } = useLanguage();

    return (
        <div className="mt-8 glass-morphism rounded-2xl p-6 flex gap-6 items-center border border-white/20">
            <div className="w-12 h-12 rounded-xl bg-sunset-orange/10 flex items-center justify-center border border-sunset-orange/20 shrink-0">
                <AlertTriangle className="w-6 h-6 text-sunset-orange" />
            </div>
            <div>
                <h3 className="text-white font-bold mb-1">{t.safety.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                    {t.safety.message}
                    <span className="block mt-1 text-white/80 font-medium">{t.safety.vest}</span>
                </p>
            </div>
        </div>
    );
}
