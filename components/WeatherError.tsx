import { AlertCircle, RefreshCw } from "lucide-react";

interface WeatherErrorProps {
    message: string;
    onRetry: () => void;
}

export function WeatherError({ message, onRetry }: WeatherErrorProps) {
    return (
        <div className="w-full h-[400px] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="glass-panel rounded-3xl p-8 max-w-md flex flex-col items-center gap-6 border-white/10 shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-2">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                </div>

                <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-bold text-foreground">Connection Issue</h3>
                    <p className="text-cream/70 text-lg leading-relaxed">
                        {message}
                    </p>
                </div>

                <button
                    onClick={onRetry}
                    className="group flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 active:bg-white/5 border border-white/10 rounded-xl transition-all duration-200 text-foreground font-medium mt-2"
                >
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    <span>Try Again</span>
                </button>
            </div>
        </div>
    );
}
