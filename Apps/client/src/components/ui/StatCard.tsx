import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    iconColor: string;
    iconBg: string;
    trend?: number;
    trendLabel?: string;
    alert?: boolean;
}

export function StatCard({ title, value, subtitle, icon: Icon, iconColor, iconBg, trend, trendLabel, alert }: StatCardProps) {
    const isPositive = trend !== undefined && trend >= 0;
    return (
        <div className={`bg-white rounded-xl p-5 shadow-sm border transition-shadow hover:shadow-md ${alert ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
                    {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
                    {trend !== undefined && (
                        <div className={`flex items-center gap-1 mt-2 text-xs ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            <span>{isPositive ? '+' : ''}{trend}% {trendLabel}</span>
                        </div>
                    )}
                </div>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
            </div>
        </div>
    );
}
