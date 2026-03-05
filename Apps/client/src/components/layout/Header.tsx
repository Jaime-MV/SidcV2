import { Bell, Search, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
    title: string;
    subtitle?: string;
    onRefresh?: () => void;
}

export function Header({ title, subtitle, onRefresh }: HeaderProps) {
    const [refreshing, setRefreshing] = useState(false);
    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
        onRefresh?.();
    };
    const today = new Date().toLocaleDateString('es-SV', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 flex-shrink-0">
            <div>
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                {subtitle && <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-52">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Buscar..." className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full" />
                </div>
                <button onClick={handleRefresh} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors" title="Actualizar">
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
                <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="hidden lg:flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-gray-400">📅</span>
                    <span className="capitalize">{today}</span>
                </div>
            </div>
        </header>
    );
}
