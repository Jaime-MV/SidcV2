import { useState, useCallback } from 'react';
import {
    FileText, Download, RefreshCw, AlertTriangle, Calendar,
    TrendingUp, DollarSign, Package, Users, ShoppingCart,
    BarChart3, PieChart, Truck, Tag, CheckCircle2,
    Clock, XCircle, ChevronDown, ChevronUp, Filter, Layers
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart as RPieChart, Pie, Cell,
    Area, AreaChart
} from 'recharts';
import { Header } from '../components/layout/Header';
import { StatCard } from '../components/ui/StatCard';
import { reportsApi, type ReporteGeneral, type FiltrosReporte } from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// Chart capture uses native SVG serialization — no html2canvas needed

const fmt = (n: number) => new Intl.NumberFormat('es-SV', { style: 'currency', currency: 'USD' }).format(n);
const fmtN = (n: number) => new Intl.NumberFormat('es-SV').format(n);
const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

// ─── Helpers para semanas ISO ─────────────────────────────
function getWeeksInYear(year: number): { value: string; label: string }[] {
    const weeks: { value: string; label: string }[] = [];
    for (let w = 1; w <= 52; w++) {
        weeks.push({ value: `${year}-W${String(w).padStart(2, '0')}`, label: `Semana ${w}` });
    }
    return weeks;
}

export default function ReportesPage() {
    const [data, setData] = useState<ReporteGeneral | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatingPdf, setGeneratingPdf] = useState(false);

    // ─── Filtros ───────────────────────────────────────────
    const [selectedDias, setSelectedDias] = useState<string[]>([]);
    const [selectedSemanas, setSelectedSemanas] = useState<string[]>([]);
    const [selectedAnios, setSelectedAnios] = useState<number[]>([]);
    const [showFilters, setShowFilters] = useState(true);

    // Temp inputs
    const [diaInput, setDiaInput] = useState('');
    const [semanaYear, setSemanaYear] = useState(new Date().getFullYear());

    const currentYear = new Date().getFullYear();
    const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
    const availableWeeks = getWeeksInYear(semanaYear);

    const addDia = () => {
        if (diaInput && !selectedDias.includes(diaInput)) {
            setSelectedDias([...selectedDias, diaInput]);
            setDiaInput('');
        }
    };

    const removeDia = (d: string) => setSelectedDias(selectedDias.filter(x => x !== d));

    const toggleSemana = (w: string) => {
        setSelectedSemanas(prev => prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w]);
    };

    const toggleAnio = (y: number) => {
        setSelectedAnios(prev => prev.includes(y) ? prev.filter(x => x !== y) : [...prev, y]);
    };

    const clearFilters = () => {
        setSelectedDias([]);
        setSelectedSemanas([]);
        setSelectedAnios([]);
    };

    const hasFilters = selectedDias.length > 0 || selectedSemanas.length > 0 || selectedAnios.length > 0;

    // ─── Generar Reporte ──────────────────────────────────
    const generateReport = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const filtros: FiltrosReporte = {};
            if (selectedDias.length) filtros.dias = selectedDias;
            if (selectedSemanas.length) filtros.semanas = selectedSemanas;
            if (selectedAnios.length) filtros.anios = selectedAnios;
            const result = await reportsApi.getReporteGeneral(filtros);
            setData(result);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error al generar reporte');
        } finally { setLoading(false); }
    }, [selectedDias, selectedSemanas, selectedAnios]);

    // ─── PDF con gráficos dibujados nativamente ────────────
    const generatePDF = useCallback(() => {
        if (!data) return;
        setGeneratingPdf(true);
        try {
            const doc = new jsPDF('p', 'mm', 'letter');
            const pageW = doc.internal.pageSize.getWidth();
            const pageH = doc.internal.pageSize.getHeight();
            const M = 14; // margin
            let y = 20;

            // ── Helpers ─────────────────────────────────────
            const ensureSpace = (need: number) => {
                if (y + need > pageH - 18) { doc.addPage(); y = 20; }
            };

            const sectionHeader = (title: string, rgb: [number, number, number]) => {
                ensureSpace(16);
                y += 3;
                doc.setFillColor(...rgb);
                doc.roundedRect(M, y - 3, pageW - M * 2, 9, 1.5, 1.5, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(9.5); doc.setFont('helvetica', 'bold');
                doc.text(title, M + 4, y + 3);
                doc.setTextColor(30, 41, 59);
                y += 12;
            };

            const metricBox = (label: string, value: string, x: number, w: number, accent?: [number, number, number]) => {
                ensureSpace(16);
                doc.setFillColor(248, 250, 252);
                doc.roundedRect(x, y, w, 14, 1.5, 1.5, 'F');
                if (accent) { doc.setFillColor(...accent); doc.roundedRect(x, y, 2, 14, 1, 1, 'F'); }
                doc.setFontSize(6); doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 116, 139);
                doc.text(label, x + 5, y + 4.5);
                doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(15, 23, 42);
                doc.text(value, x + 5, y + 11.5);
            };

            // ── Gráfico de línea (Ventas Diarias) ────────────
            const drawLineChart = (
                items: { fecha: string; total: number }[],
                x: number, cy: number, w: number, h: number,
                color: [number, number, number]
            ) => {
                if (items.length === 0) return;
                const pad = { l: 18, r: 4, t: 6, b: 14 };
                const cw = w - pad.l - pad.r;
                const ch = h - pad.t - pad.b;
                const maxVal = Math.max(...items.map(d => d.total), 1);

                // Background & border
                doc.setFillColor(250, 251, 253);
                doc.roundedRect(x, cy, w, h, 2, 2, 'F');
                doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.3);
                doc.roundedRect(x, cy, w, h, 2, 2, 'S');

                // Grid lines (5 horizontal)
                doc.setDrawColor(241, 245, 249); doc.setLineWidth(0.2);
                for (let g = 0; g <= 4; g++) {
                    const gy = cy + pad.t + ch - (g / 4) * ch;
                    doc.line(x + pad.l, gy, x + pad.l + cw, gy);
                    // Y-axis label
                    doc.setFontSize(5); doc.setTextColor(148, 163, 184);
                    const val = (maxVal * g / 4);
                    const lbl = val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val.toFixed(0)}`;
                    doc.text(lbl, x + pad.l - 1, gy + 1.2, { align: 'right' });
                }

                // Area fill (gradient simulation with light rect)
                const points = items.map((d, i) => ({
                    px: x + pad.l + (i / (items.length - 1 || 1)) * cw,
                    py: cy + pad.t + ch - (d.total / maxVal) * ch,
                }));
                if (points.length > 1) {
                    const lightColor: [number, number, number] = [
                        Math.round((color[0] + 5 * 255) / 6),
                        Math.round((color[1] + 5 * 255) / 6),
                        Math.round((color[2] + 5 * 255) / 6),
                    ];
                    doc.setFillColor(...lightColor);

                    const areaPath: [number, number][] = [
                        [points[0].px, cy + pad.t + ch],
                        ...points.map(p => [p.px, p.py] as [number, number]),
                        [points[points.length - 1].px, cy + pad.t + ch],
                    ];

                    const startX = areaPath[0][0];
                    const startY = areaPath[0][1];
                    const lineCoords = areaPath.slice(1).map((p, idx) => {
                        const prev = idx === 0 ? areaPath[0] : areaPath[idx];
                        return [p[0] - prev[0], p[1] - prev[1]];
                    });

                    doc.lines(lineCoords, startX, startY, [1, 1], 'F', true);
                }

                // Line
                doc.setDrawColor(...color); doc.setLineWidth(0.8);
                for (let i = 1; i < points.length; i++) {
                    doc.line(points[i - 1].px, points[i - 1].py, points[i].px, points[i].py);
                }

                // Dots + X labels
                const step = Math.max(1, Math.floor(items.length / 6));
                items.forEach((d, i) => {
                    if (i % step === 0 || i === items.length - 1) {
                        doc.setFillColor(...color);
                        doc.circle(points[i].px, points[i].py, 0.9, 'F');
                        doc.setFontSize(4.5); doc.setTextColor(148, 163, 184);
                        const lbl = d.fecha.slice(5); // MM-DD
                        doc.text(lbl, points[i].px, cy + pad.t + ch + 5, { align: 'center' });
                    }
                });
            };

            // ── Gráfico de barras horizontal (Top Productos) ─
            const drawHBarChart = (
                items: { nombre: string; ingresos: number }[],
                x: number, cy: number, w: number, h: number,
                color: [number, number, number]
            ) => {
                const rows = items.slice(0, 8);
                if (rows.length === 0) return;
                const pad = { l: 42, r: 30, t: 5, b: 5 };
                const cw = w - pad.l - pad.r;
                const rowH = (h - pad.t - pad.b) / rows.length;
                const maxVal = Math.max(...rows.map(r => r.ingresos), 1);

                doc.setFillColor(250, 251, 253);
                doc.roundedRect(x, cy, w, h, 2, 2, 'F');
                doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.3);
                doc.roundedRect(x, cy, w, h, 2, 2, 'S');

                rows.forEach((row, i) => {
                    const barY = cy + pad.t + i * rowH + rowH * 0.2;
                    const barH = rowH * 0.6;
                    const barW = (row.ingresos / maxVal) * cw;
                    const shade = i % 2 === 0 ? color : [color[0] + 20, color[1] + 20, color[2] + 20] as [number, number, number];

                    // Label (left)
                    doc.setFontSize(5); doc.setTextColor(71, 85, 105);
                    const name = row.nombre.length > 16 ? row.nombre.slice(0, 14) + '…' : row.nombre;
                    doc.text(name, x + pad.l - 2, barY + barH / 2 + 1.5, { align: 'right' });

                    // Bar
                    doc.setFillColor(...shade);
                    doc.roundedRect(x + pad.l, barY, Math.max(barW, 1), barH, 0.8, 0.8, 'F');

                    // Value (right)
                    doc.setFontSize(5); doc.setTextColor(30, 41, 59);
                    doc.text(fmt(row.ingresos), x + pad.l + barW + 2, barY + barH / 2 + 1.5);
                });
            };

            // ── Gráfico de barras vertical (Vendedores) ───────
            const drawVBarChart = (
                items: { nombre: string; totalVentas: number }[],
                x: number, cy: number, w: number, h: number
            ) => {
                const cols = items.slice(0, 8);
                if (cols.length === 0) return;
                const pad = { l: 16, r: 4, t: 5, b: 16 };
                const cw = w - pad.l - pad.r;
                const ch = h - pad.t - pad.b;
                const colW = cw / cols.length;
                const maxVal = Math.max(...cols.map(c => c.totalVentas), 1);
                const barW = colW * 0.6;
                const colors: [number, number, number][] = [
                    [59, 130, 246], [6, 182, 212], [16, 185, 129],
                    [139, 92, 246], [245, 158, 11], [239, 68, 68],
                    [236, 72, 153], [34, 197, 94],
                ];

                doc.setFillColor(250, 251, 253);
                doc.roundedRect(x, cy, w, h, 2, 2, 'F');
                doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.3);
                doc.roundedRect(x, cy, w, h, 2, 2, 'S');

                // Grid
                doc.setDrawColor(241, 245, 249); doc.setLineWidth(0.2);
                for (let g = 1; g <= 4; g++) {
                    const gy = cy + pad.t + ch - (g / 4) * ch;
                    doc.line(x + pad.l, gy, x + pad.l + cw, gy);
                }

                cols.forEach((col, i) => {
                    const bh = (col.totalVentas / maxVal) * ch;
                    const bx = x + pad.l + i * colW + (colW - barW) / 2;
                    const by = cy + pad.t + ch - bh;
                    const c = colors[i % colors.length];

                    doc.setFillColor(...c);
                    doc.roundedRect(bx, by, barW, bh, 1, 1, 'F');

                    // X label
                    doc.setFontSize(4.5); doc.setTextColor(100, 116, 139);
                    const name = col.nombre.split(' ')[0]; // first name only
                    doc.text(name, bx + barW / 2, cy + pad.t + ch + 5, { align: 'center' });

                    // Value on top
                    doc.setFontSize(4); doc.setTextColor(30, 41, 59);
                    const val = col.totalVentas >= 1000 ? `$${(col.totalVentas / 1000).toFixed(1)}k` : `$${col.totalVentas.toFixed(0)}`;
                    doc.text(val, bx + barW / 2, by - 1, { align: 'center' });
                });

                // Y axis label
                doc.setFontSize(5); doc.setTextColor(148, 163, 184);
                const maxLabel = maxVal >= 1000 ? `$${(maxVal / 1000).toFixed(0)}k` : `$${maxVal.toFixed(0)}`;
                doc.text(maxLabel, x + pad.l - 1, cy + pad.t + 3, { align: 'right' });
            };

            // ── Gráfico de pastel (Categorías) ───────────────
            const drawPieChart = (
                items: { categoria: string; ingresos: number; color?: string }[],
                x: number, cy: number, w: number, h: number
            ) => {
                if (items.length === 0) return;
                const total = items.reduce((s, d) => s + d.ingresos, 0);
                if (total === 0) return;
                const pieCx = x + w * 0.38;
                const pieCy = cy + h / 2;
                const r = Math.min(h, w * 0.5) / 2 - 4;
                const innerR = r * 0.45;
                const palette: [number, number, number][] = [
                    [59, 130, 246], [16, 185, 129], [245, 158, 11],
                    [239, 68, 68], [139, 92, 246], [236, 72, 153],
                    [6, 182, 212], [132, 204, 22],
                ];

                doc.setFillColor(250, 251, 253);
                doc.roundedRect(x, cy, w, h, 2, 2, 'F');
                doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.3);
                doc.roundedRect(x, cy, w, h, 2, 2, 'S');

                let startAngle = -Math.PI / 2;
                items.slice(0, 8).forEach((item, i) => {
                    const slice = (item.ingresos / total) * 2 * Math.PI;
                    const endAngle = startAngle + slice;
                    const midAngle = startAngle + slice / 2;
                    const c = palette[i % palette.length];

                    // Draw slice as polygon replacing custom method with jsPDF lines
                    const steps = Math.max(6, Math.floor(slice * 10));
                    const pts: [number, number][] = [[pieCx, pieCy]];
                    for (let s = 0; s <= steps; s++) {
                        const a = startAngle + (s / steps) * slice;
                        pts.push([pieCx + r * Math.cos(a), pieCy + r * Math.sin(a)]);
                    }
                    doc.setFillColor(...c);
                    const startX = pts[0][0];
                    const startY = pts[0][1];
                    const lineCoords = pts.slice(1).map((p, idx) => {
                        const prev = idx === 0 ? pts[0] : pts[idx];
                        return [p[0] - prev[0], p[1] - prev[1]];
                    });
                    doc.lines(lineCoords, startX, startY, [1, 1], 'F', true);

                    // Inner circle (donut hole) — white mask
                    doc.setFillColor(250, 251, 253);
                    doc.circle(pieCx, pieCy, innerR, 'F');

                    // Label on slice
                    if (slice > 0.3) {
                        const lx = pieCx + (r * 0.72) * Math.cos(midAngle);
                        const ly = pieCy + (r * 0.72) * Math.sin(midAngle);
                        const pct = ((item.ingresos / total) * 100).toFixed(0) + '%';
                        doc.setFontSize(5); doc.setTextColor(255, 255, 255);
                        doc.text(pct, lx, ly + 1.5, { align: 'center' });
                    }

                    startAngle = endAngle;
                });

                // Legend (right side)
                const legendX = x + w * 0.65;
                let legendY = cy + 6;
                items.slice(0, 8).forEach((item, i) => {
                    const c = palette[i % palette.length];
                    doc.setFillColor(...c);
                    doc.roundedRect(legendX, legendY, 3, 3, 0.5, 0.5, 'F');
                    doc.setFontSize(5); doc.setTextColor(51, 65, 85);
                    const lbl = item.categoria.length > 14 ? item.categoria.slice(0, 12) + '…' : item.categoria;
                    doc.text(lbl, legendX + 5, legendY + 2.5);
                    legendY += 6;
                });
            };

            // ════════════════════════════════════════════════
            // PORTADA
            // ════════════════════════════════════════════════
            doc.setFillColor(15, 23, 42);
            doc.rect(0, 0, pageW, 88, 'F');
            doc.setFillColor(59, 130, 246);
            doc.rect(0, 84, pageW, 4, 'F');
            doc.setFillColor(245, 158, 11);
            doc.rect(M, 78, 38, 1.5, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(30); doc.setFont('helvetica', 'bold');
            doc.text('SIDC', M + 2, 35);
            doc.setFontSize(9.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(148, 163, 184);
            doc.text('Sistema Integrado de Distribución Comercial', M + 2, 44);
            doc.setFontSize(18); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
            doc.text('Reporte Ejecutivo de Análisis', M + 2, 60);
            doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(148, 163, 184);
            doc.text(`Generado: ${new Date(data.meta.generadoEn).toLocaleString('es-SV')}`, M + 2, 72);

            // Info card
            y = 96;
            doc.setFillColor(248, 250, 252); doc.roundedRect(M, y, pageW - M * 2, 28, 3, 3, 'F');
            doc.setDrawColor(226, 232, 240); doc.roundedRect(M, y, pageW - M * 2, 28, 3, 3, 'S');
            doc.setFontSize(7); doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 116, 139);
            doc.text('Período analizado:', M + 5, y + 8); doc.text('Filtros aplicados:', M + 5, y + 16); doc.text('Tipo:', M + 5, y + 24);
            doc.setFont('helvetica', 'bold'); doc.setTextColor(15, 23, 42);
            doc.text(data.meta.periodoDescripcion, M + 44, y + 8);
            const filtrosDesc = [
                data.meta.filtros.dias?.length ? `${data.meta.filtros.dias.length} días` : '',
                data.meta.filtros.semanas?.length ? `${data.meta.filtros.semanas.length} semanas` : '',
                data.meta.filtros.anios?.length ? `Años: ${data.meta.filtros.anios.join(', ')}` : '',
            ].filter(Boolean).join(', ') || 'Sin filtros — análisis histórico completo';
            doc.text(filtrosDesc, M + 44, y + 16);
            doc.text('Reporte completo con gráficos vectoriales y tablas', M + 44, y + 24);
            y += 36;

            // ════════ RESUMEN EJECUTIVO ════════
            sectionHeader('RESUMEN EJECUTIVO', [15, 23, 42]);
            const cw3 = (pageW - M * 2 - 6) / 3;
            metricBox('Ventas Brutas', fmt(data.resumenVentas.totalBruto), M, cw3, [59, 130, 246]);
            metricBox('Ventas Netas', fmt(data.resumenVentas.totalNeto), M + cw3 + 3, cw3, [16, 185, 129]);
            metricBox('Devoluciones', fmt(data.devoluciones.montoTotal), M + (cw3 + 3) * 2, cw3, [239, 68, 68]);
            y += 17;
            metricBox('Promedio/Venta', fmt(data.resumenVentas.promedioVenta), M, cw3);
            metricBox('Venta Máxima', fmt(data.resumenVentas.ventaMaxima), M + cw3 + 3, cw3);
            metricBox('Tasa Completación', `${data.resumenVentas.tasaCompletacion}%`, M + (cw3 + 3) * 2, cw3, [139, 92, 246]);
            y += 17;
            metricBox('Total Ventas', `${fmtN(data.resumenVentas.cantidadVentas)} ops`, M, cw3);
            metricBox('Completadas', fmtN(data.resumenVentas.completadas), M + cw3 + 3, cw3, [16, 185, 129]);
            metricBox('Anuladas/Pendientes', `${fmtN(data.resumenVentas.anuladas)} / ${fmtN(data.resumenVentas.pendientes)}`, M + (cw3 + 3) * 2, cw3, [245, 158, 11]);
            y += 22;

            // ════════ GRÁFICO: VENTAS DIARIAS ════════
            if (data.ventasDiarias.length > 0) {
                sectionHeader('TENDENCIA DE VENTAS DIARIAS', [59, 130, 246]);
                ensureSpace(58);
                drawLineChart(data.ventasDiarias, M, y, pageW - M * 2, 55, [59, 130, 246]);
                y += 60;
            }

            // ════════ GRÁFICOS 2-EN-1: CATEGORÍAS + VENDEDORES ════════
            const hasCateg = data.ventasPorCategoria.length > 0;
            const hasVend = data.ventasPorVendedor.length > 0;
            if (hasCateg || hasVend) {
                sectionHeader('DISTRIBUCIÓN POR CATEGORÍA Y RENDIMIENTO POR VENDEDOR', [139, 92, 246]);
                const halfW = (pageW - M * 2 - 4) / 2;
                ensureSpace(58);
                if (hasCateg) drawPieChart(data.ventasPorCategoria, M, y, halfW, 54);
                if (hasVend) drawVBarChart(data.ventasPorVendedor, M + halfW + 4, y, halfW, 54);
                y += 60;
            }

            // ════════ GRÁFICO: TOP PRODUCTOS ════════
            if (data.topProductos.length > 0) {
                sectionHeader('TOP PRODUCTOS POR INGRESOS', [139, 92, 246]);
                const barH = Math.min(10 + data.topProductos.slice(0, 8).length * 8, 72);
                ensureSpace(barH + 4);
                drawHBarChart(data.topProductos.map(p => ({ nombre: p.nombre, ingresos: p.ingresos })), M, y, pageW - M * 2, barH, [139, 92, 246]);
                y += barH + 6;
            }

            // ════════ FACTURACIÓN Y COBRANZA ════════
            sectionHeader('FACTURACIÓN Y COBRANZA', [16, 185, 129]);
            const cw2 = (pageW - M * 2 - 4) / 2;
            metricBox('Total Facturas', fmtN(data.facturacion.totalFacturas), M, cw2, [59, 130, 246]);
            metricBox('Tasa Cobranza', `${data.facturacion.tasaCobranza}%`, M + cw2 + 4, cw2, [16, 185, 129]);
            y += 18;

            autoTable(doc, {
                startY: y, margin: { left: M, right: M },
                head: [['Estado Factura', 'Cantidad', 'Monto']],
                body: [
                    ['Pagadas', String(data.facturacion.pagadas.count), fmt(data.facturacion.pagadas.monto)],
                    ['Pendientes', String(data.facturacion.pendientes.count), fmt(data.facturacion.pendientes.monto)],
                    ['Vencidas', String(data.facturacion.vencidas.count), fmt(data.facturacion.vencidas.monto)],
                ],
                theme: 'striped',
                headStyles: { fillColor: [16, 185, 129], textColor: 255, fontSize: 8, fontStyle: 'bold' },
                bodyStyles: { fontSize: 8 }, alternateRowStyles: { fillColor: [240, 253, 244] },
                columnStyles: { 1: { halign: 'center' }, 2: { halign: 'right', fontStyle: 'bold' } },
            });
            y = (doc as any).lastAutoTable.finalY + 4;

            autoTable(doc, {
                startY: y, margin: { left: M, right: M },
                head: [['Estado Cobro', 'Cantidad', 'Monto']],
                body: [
                    ['Cobrados', String(data.cobros.cobrados.count), fmt(data.cobros.cobrados.monto)],
                    ['Pendientes', String(data.cobros.pendientes.count), fmt(data.cobros.pendientes.monto)],
                    ['Vencidos', String(data.cobros.vencidos.count), fmt(data.cobros.vencidos.monto)],
                ],
                theme: 'striped',
                headStyles: { fillColor: [245, 158, 11], textColor: 255, fontSize: 8, fontStyle: 'bold' },
                bodyStyles: { fontSize: 8 }, alternateRowStyles: { fillColor: [255, 251, 235] },
                columnStyles: { 1: { halign: 'center' }, 2: { halign: 'right', fontStyle: 'bold' } },
            });
            y = (doc as any).lastAutoTable.finalY + 6;

            // ════════ TOP PRODUCTOS (tabla) ════════
            if (data.topProductos.length > 0) {
                sectionHeader('TOP PRODUCTOS — DETALLE', [139, 92, 246]);
                autoTable(doc, {
                    startY: y, margin: { left: M, right: M },
                    head: [['#', 'Producto', 'Categoría', 'Unidades', 'Ingresos']],
                    body: data.topProductos.map((p, i) => [
                        String(i + 1), p.nombre, p.categoria,
                        fmtN(p.unidadesVendidas), fmt(p.ingresos),
                    ]),
                    theme: 'striped',
                    headStyles: { fillColor: [139, 92, 246], textColor: 255, fontSize: 7.5, fontStyle: 'bold' },
                    bodyStyles: { fontSize: 7 }, alternateRowStyles: { fillColor: [245, 243, 255] },
                    columnStyles: { 0: { cellWidth: 8, halign: 'center' }, 3: { halign: 'right' }, 4: { halign: 'right', fontStyle: 'bold' } },
                });
                y = (doc as any).lastAutoTable.finalY + 6;
            }

            // ════════ TOP CLIENTES ════════
            if (data.topClientes.length > 0) {
                sectionHeader('TOP CLIENTES', [236, 72, 153]);
                autoTable(doc, {
                    startY: y, margin: { left: M, right: M },
                    head: [['#', 'Cliente', 'Tipo', 'Compras', 'Total']],
                    body: data.topClientes.map((c, i) => [
                        String(i + 1), c.nombre, c.tipo, fmtN(c.cantidadCompras), fmt(c.totalCompras),
                    ]),
                    theme: 'striped',
                    headStyles: { fillColor: [236, 72, 153], textColor: 255, fontSize: 7.5, fontStyle: 'bold' },
                    bodyStyles: { fontSize: 7 }, alternateRowStyles: { fillColor: [253, 242, 248] },
                    columnStyles: { 0: { cellWidth: 8, halign: 'center' }, 3: { halign: 'right' }, 4: { halign: 'right', fontStyle: 'bold' } },
                });
                y = (doc as any).lastAutoTable.finalY + 6;
            }

            // ════════ ESTADO OPERACIONAL ════════
            sectionHeader('ESTADO OPERACIONAL', [100, 116, 139]);
            metricBox('Productos', fmtN(data.inventario.totalProductos), M, cw3);
            metricBox('Lotes Activos', fmtN(data.inventario.lotesActivos), M + cw3 + 3, cw3, [16, 185, 129]);
            metricBox('Próx. Vencer', fmtN(data.inventario.lotesProxVencer), M + (cw3 + 3) * 2, cw3, [245, 158, 11]);
            y += 17;
            metricBox('Clientes Activos', fmtN(data.clientes.activos), M, cw3, [59, 130, 246]);
            metricBox('Saldo Crédito', fmt(data.clientes.saldoCreditoTotal), M + cw3 + 3, cw3);
            metricBox('Promos Activas', fmtN(data.promociones.activas), M + (cw3 + 3) * 2, cw3, [236, 72, 153]);
            y += 20;

            // ════════ PIE DE PÁGINA ════════
            const totalPages = doc.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setDrawColor(59, 130, 246); doc.setLineWidth(0.4);
                doc.line(M, pageH - 13, pageW - M, pageH - 13);
                doc.setFontSize(6); doc.setFont('helvetica', 'normal'); doc.setTextColor(148, 163, 184);
                doc.text('SIDC — Sistema Integrado de Distribución Comercial', M, pageH - 8);
                doc.text(`Generado el ${new Date().toLocaleString('es-SV')}`, M, pageH - 4.5);
                doc.setFont('helvetica', 'bold'); doc.setTextColor(59, 130, 246);
                doc.text(`${i} / ${totalPages}`, pageW - M, pageH - 6.5, { align: 'right' });
                if (i > 1) {
                    doc.setFillColor(59, 130, 246);
                    doc.roundedRect(pageW - M - 16, 8, 16, 5.5, 1, 1, 'F');
                    doc.setTextColor(255, 255, 255); doc.setFontSize(5.5);
                    doc.text(`Pág. ${i}`, pageW - M - 14.5, 12.2);
                }
            }

            const filename = `SIDC_Reporte_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(filename);
        } catch (err) {
            console.error('Error generando PDF:', err);
            alert('Error al generar el PDF. Revisa la consola.');
        } finally {
            setGeneratingPdf(false);
        }
    }, [data]);

    // ═══════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════
    return (
        <div className="flex flex-col h-full">
            <Header title="Reportes y Análisis" subtitle="Genera reportes completos con análisis de datos y exporta a PDF" onRefresh={data ? generateReport : undefined} />
            <div className="flex-1 p-6 space-y-5 overflow-y-auto">

                {/* ════════════════════════════════════════════
                    PANEL DE FILTROS
                    ════════════════════════════════════════════ */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors rounded-xl"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Filter className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-sm font-semibold text-gray-900">Filtros de Período</h3>
                                <p className="text-xs text-gray-500">
                                    {hasFilters
                                        ? `${selectedDias.length} días, ${selectedSemanas.length} semanas, ${selectedAnios.length} años seleccionados`
                                        : 'Sin filtros — se analizarán todos los datos'}
                                </p>
                            </div>
                        </div>
                        {showFilters ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>

                    {showFilters && (
                        <div className="px-5 pb-5 space-y-5 border-t border-gray-100 pt-4">

                            {/* DÍAS */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2">
                                    <Calendar className="w-3.5 h-3.5 text-blue-500" /> Días específicos
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="date"
                                        value={diaInput}
                                        onChange={e => setDiaInput(e.target.value)}
                                        className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none border border-gray-200 focus:border-blue-400 transition-colors"
                                    />
                                    <button
                                        onClick={addDia}
                                        disabled={!diaInput}
                                        className="bg-blue-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Agregar
                                    </button>
                                </div>
                                {selectedDias.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {selectedDias.map(d => (
                                            <span key={d} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                                {new Date(d + 'T12:00:00').toLocaleDateString('es-SV', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                <button onClick={() => removeDia(d)} className="text-blue-500 hover:text-blue-800">×</button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* SEMANAS */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2">
                                    <Layers className="w-3.5 h-3.5 text-emerald-500" /> Semanas específicas
                                </label>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs text-gray-500">Año:</span>
                                    <select
                                        value={semanaYear}
                                        onChange={e => setSemanaYear(parseInt(e.target.value))}
                                        className="bg-gray-100 rounded-lg px-2 py-1.5 text-xs outline-none border border-gray-200"
                                    >
                                        {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-13 gap-1.5 max-h-32 overflow-y-auto p-1">
                                    {availableWeeks.map(w => (
                                        <button
                                            key={w.value}
                                            onClick={() => toggleSemana(w.value)}
                                            className={`text-xs px-1.5 py-1.5 rounded-md transition-all font-medium ${selectedSemanas.includes(w.value)
                                                ? 'bg-emerald-600 text-white shadow-sm'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            S{w.value.split('-W')[1]}
                                        </button>
                                    ))}
                                </div>
                                {selectedSemanas.length > 0 && (
                                    <p className="text-xs text-emerald-600 mt-1.5 font-medium">{selectedSemanas.length} semanas seleccionadas</p>
                                )}
                            </div>

                            {/* AÑOS */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2">
                                    <BarChart3 className="w-3.5 h-3.5 text-violet-500" /> Años
                                </label>
                                <div className="flex gap-2">
                                    {availableYears.map(y => (
                                        <button
                                            key={y}
                                            onClick={() => toggleAnio(y)}
                                            className={`text-sm px-4 py-2 rounded-lg transition-all font-medium ${selectedAnios.includes(y)
                                                ? 'bg-violet-600 text-white shadow-sm'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {y}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* BOTONES DE ACCIÓN */}
                            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                                <button
                                    onClick={generateReport}
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-all shadow-sm"
                                >
                                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
                                    Generar Reporte
                                </button>
                                {hasFilters && (
                                    <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                                        Limpiar filtros
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* LOADING */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <RefreshCw className="w-10 h-10 text-blue-500 animate-spin mb-3" />
                        <p className="text-gray-500 text-sm">Analizando datos...</p>
                    </div>
                )}

                {/* ERROR */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                        <p className="text-red-700 font-medium mb-1">{error}</p>
                        <button onClick={generateReport} className="mt-3 bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700">Reintentar</button>
                    </div>
                )}

                {/* ════════════════════════════════════════════
                    RESULTADOS DEL REPORTE
                    ════════════════════════════════════════════ */}
                {data && !loading && (
                    <>
                        {/* Header del reporte + botón PDF */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Resultado del Análisis</h2>
                                <p className="text-xs text-gray-500">{data.meta.periodoDescripcion} — Generado {new Date(data.meta.generadoEn).toLocaleString('es-SV')}</p>
                            </div>
                            <button
                                onClick={generatePDF}
                                disabled={generatingPdf}
                                className="flex items-center gap-2 bg-red-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-all shadow-sm"
                            >
                                {generatingPdf ? <><RefreshCw className="w-4 h-4 animate-spin" /> Capturando gráficos...</> : <><Download className="w-4 h-4" /> Descargar PDF</>}
                            </button>
                        </div>

                        {/* STAT CARDS */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard title="Ventas Netas" value={fmt(data.resumenVentas.totalNeto)} subtitle={`${fmtN(data.resumenVentas.completadas)} completadas`} icon={ShoppingCart} iconColor="text-blue-600" iconBg="bg-blue-100" />
                            <StatCard title="Facturación" value={fmt(data.facturacion.pagadas.monto)} subtitle={`${data.facturacion.tasaCobranza}% cobranza`} icon={FileText} iconColor="text-emerald-600" iconBg="bg-emerald-100" />
                            <StatCard title="Devoluciones" value={fmt(data.devoluciones.montoTotal)} subtitle={`${fmtN(data.devoluciones.cantidad)} devoluciones (${data.devoluciones.tasaDevolucion}%)`} icon={TrendingUp} iconColor="text-amber-600" iconBg="bg-amber-100" />
                            <StatCard
                                title="Cobros Vencidos"
                                value={fmt(data.cobros.vencidos.monto)}
                                subtitle={`${fmtN(data.cobros.vencidos.count)} cobros`}
                                icon={XCircle}
                                iconColor="text-red-600"
                                iconBg="bg-red-100"
                                alert={data.cobros.vencidos.count > 0}
                            />
                        </div>

                        {/* GRÁFICOS ROW 1 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Serie Temporal */}
                            {data.ventasDiarias.length > 0 && (
                                <div id="chart-ventas-diarias" className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                                    <h3 className="font-medium text-gray-900 mb-4 text-sm flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-blue-500" /> Ventas Diarias
                                    </h3>
                                    <ResponsiveContainer width="100%" height={220}>
                                        <AreaChart data={data.ventasDiarias}>
                                            <defs>
                                                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                            <XAxis dataKey="fecha" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                                            <Tooltip formatter={(v: any) => [fmt(Number(v ?? 0)), 'Ventas']} contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                            <Area type="monotone" dataKey="total" stroke="#3b82f6" fill="url(#colorVentas)" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            )}

                            {/* Ventas por Categoría - Pie */}
                            {data.ventasPorCategoria.length > 0 && (
                                <div id="chart-categorias" className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                                    <h3 className="font-medium text-gray-900 mb-4 text-sm flex items-center gap-2">
                                        <PieChart className="w-4 h-4 text-amber-500" /> Ventas por Categoría
                                    </h3>
                                    <ResponsiveContainer width="100%" height={220}>
                                        <RPieChart>
                                            <Pie
                                                data={data.ventasPorCategoria}
                                                dataKey="ingresos"
                                                nameKey="categoria"
                                                cx="50%" cy="50%"
                                                outerRadius={75}
                                                innerRadius={40}
                                                paddingAngle={3}
                                                label={({ categoria, percent }: any) => `${categoria} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                                                labelLine={false}
                                            >
                                                {data.ventasPorCategoria.map((entry, i) => (
                                                    <Cell key={i} fill={entry.color || PIE_COLORS[i % PIE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(v: any) => [fmt(Number(v ?? 0)), 'Ingresos']} />
                                        </RPieChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>

                        {/* GRÁFICOS ROW 2 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Top Productos - Bar */}
                            {data.topProductos.length > 0 && (
                                <div id="chart-productos" className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                                    <h3 className="font-medium text-gray-900 mb-4 text-sm flex items-center gap-2">
                                        <Package className="w-4 h-4 text-violet-500" /> Top Productos por Ingresos
                                    </h3>
                                    <ResponsiveContainer width="100%" height={220}>
                                        <BarChart data={data.topProductos.slice(0, 7)} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                            <XAxis type="number" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                                            <YAxis type="category" dataKey="nombre" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} width={100} />
                                            <Tooltip formatter={(v: any) => [fmt(Number(v ?? 0)), 'Ingresos']} contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                            <Bar dataKey="ingresos" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}

                            {/* Ventas por Vendedor - Bar */}
                            {data.ventasPorVendedor.length > 0 && (
                                <div id="chart-vendedores" className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                                    <h3 className="font-medium text-gray-900 mb-4 text-sm flex items-center gap-2">
                                        <Truck className="w-4 h-4 text-cyan-500" /> Rendimiento por Vendedor
                                    </h3>
                                    <ResponsiveContainer width="100%" height={220}>
                                        <BarChart data={data.ventasPorVendedor}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                            <XAxis dataKey="nombre" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                                            <Tooltip formatter={(v: any) => [fmt(Number(v ?? 0)), 'Ventas']} contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                            <Bar dataKey="totalVentas" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )
                            }
                        </div >

                        {/* TABLAS DETALLADAS */}
                        < div className="grid grid-cols-1 lg:grid-cols-2 gap-4" >

                            {/* Facturación detalle */}
                            < div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5" >
                                <h3 className="font-medium text-gray-900 mb-3 text-sm flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-emerald-500" /> Detalle Facturación
                                </h3>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left text-xs text-gray-400 pb-2 font-medium">Estado</th>
                                            <th className="text-right text-xs text-gray-400 pb-2 font-medium">Cantidad</th>
                                            <th className="text-right text-xs text-gray-400 pb-2 font-medium">Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-50">
                                            <td className="py-2 flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /><span className="text-xs">Pagadas</span></td>
                                            <td className="py-2 text-xs text-right">{fmtN(data.facturacion.pagadas.count)}</td>
                                            <td className="py-2 text-xs text-right font-medium text-green-700">{fmt(data.facturacion.pagadas.monto)}</td>
                                        </tr>
                                        <tr className="border-b border-gray-50">
                                            <td className="py-2 flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-amber-500" /><span className="text-xs">Pendientes</span></td>
                                            <td className="py-2 text-xs text-right">{fmtN(data.facturacion.pendientes.count)}</td>
                                            <td className="py-2 text-xs text-right font-medium text-amber-700">{fmt(data.facturacion.pendientes.monto)}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 flex items-center gap-2"><XCircle className="w-3.5 h-3.5 text-red-500" /><span className="text-xs">Vencidas</span></td>
                                            <td className="py-2 text-xs text-right">{fmtN(data.facturacion.vencidas.count)}</td>
                                            <td className="py-2 text-xs text-right font-medium text-red-700">{fmt(data.facturacion.vencidas.monto)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div >

                            {/* Cobros detalle */}
                            < div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5" >
                                <h3 className="font-medium text-gray-900 mb-3 text-sm flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-green-500" /> Detalle Cobros
                                </h3>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left text-xs text-gray-400 pb-2 font-medium">Estado</th>
                                            <th className="text-right text-xs text-gray-400 pb-2 font-medium">Cantidad</th>
                                            <th className="text-right text-xs text-gray-400 pb-2 font-medium">Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-50">
                                            <td className="py-2 flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /><span className="text-xs">Cobrados</span></td>
                                            <td className="py-2 text-xs text-right">{fmtN(data.cobros.cobrados.count)}</td>
                                            <td className="py-2 text-xs text-right font-medium text-green-700">{fmt(data.cobros.cobrados.monto)}</td>
                                        </tr>
                                        <tr className="border-b border-gray-50">
                                            <td className="py-2 flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-amber-500" /><span className="text-xs">Pendientes</span></td>
                                            <td className="py-2 text-xs text-right">{fmtN(data.cobros.pendientes.count)}</td>
                                            <td className="py-2 text-xs text-right font-medium text-amber-700">{fmt(data.cobros.pendientes.monto)}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 flex items-center gap-2"><XCircle className="w-3.5 h-3.5 text-red-500" /><span className="text-xs">Vencidos</span></td>
                                            <td className="py-2 text-xs text-right">{fmtN(data.cobros.vencidos.count)}</td>
                                            <td className="py-2 text-xs text-right font-medium text-red-700">{fmt(data.cobros.vencidos.monto)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div >
                        </div >

                        {/* RESUMEN CARDS — Inventario / Clientes / Promos */}
                        < div className="grid grid-cols-1 md:grid-cols-3 gap-4" >
                            {/* Inventario */}
                            < div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5" >
                                <h3 className="font-medium text-gray-900 mb-3 text-sm flex items-center gap-2">
                                    <Package className="w-4 h-4 text-lime-500" /> Inventario
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs"><span className="text-gray-500">Total Productos</span><span className="font-semibold">{fmtN(data.inventario.totalProductos)}</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-gray-500">Lotes Activos</span><span className="font-semibold text-green-600">{fmtN(data.inventario.lotesActivos)}</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-gray-500">Próximos a Vencer</span><span className="font-semibold text-amber-600">{fmtN(data.inventario.lotesProxVencer)}</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-gray-500">Vencidos</span><span className="font-semibold text-red-600">{fmtN(data.inventario.lotesVencidos)}</span></div>
                                </div>
                            </div >

                            {/* Clientes */}
                            < div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5" >
                                <h3 className="font-medium text-gray-900 mb-3 text-sm flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-500" /> Clientes
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs"><span className="text-gray-500">Activos</span><span className="font-semibold text-green-600">{fmtN(data.clientes.activos)}</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-gray-500">Bloqueados</span><span className="font-semibold text-red-600">{fmtN(data.clientes.bloqueados)}</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-gray-500">Suspendidos</span><span className="font-semibold text-amber-600">{fmtN(data.clientes.suspendidos)}</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-gray-500">Saldo Crédito</span><span className="font-semibold">{fmt(data.clientes.saldoCreditoTotal)}</span></div>
                                </div>
                            </div >

                            {/* Promociones */}
                            < div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5" >
                                <h3 className="font-medium text-gray-900 mb-3 text-sm flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-pink-500" /> Promociones
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs"><span className="text-gray-500">Activas</span><span className="font-semibold text-green-600">{fmtN(data.promociones.activas)}</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-gray-500">Próximas</span><span className="font-semibold text-blue-600">{fmtN(data.promociones.proximas)}</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-gray-500">Expiradas</span><span className="font-semibold text-gray-500">{fmtN(data.promociones.expiradas)}</span></div>
                                </div>
                            </div >
                        </div >

                        {/* TOP CLIENTES TABLE */}
                        {
                            data.topClientes.length > 0 && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                                    <h3 className="font-medium text-gray-900 mb-3 text-sm flex items-center gap-2">
                                        <Users className="w-4 h-4 text-pink-500" /> Top 10 Clientes
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-100">
                                                    <th className="text-left text-xs text-gray-400 pb-2 font-medium">#</th>
                                                    <th className="text-left text-xs text-gray-400 pb-2 font-medium">Cliente</th>
                                                    <th className="text-center text-xs text-gray-400 pb-2 font-medium">Tipo</th>
                                                    <th className="text-right text-xs text-gray-400 pb-2 font-medium">Compras</th>
                                                    <th className="text-right text-xs text-gray-400 pb-2 font-medium">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.topClientes.map((c, i) => (
                                                    <tr key={c.clienteId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                        <td className="py-2 text-xs text-gray-400">{i + 1}</td>
                                                        <td className="py-2 text-xs text-gray-700 font-medium">{c.nombre}</td>
                                                        <td className="py-2 text-xs text-gray-500 text-center">{c.tipo}</td>
                                                        <td className="py-2 text-xs text-gray-700 text-right">{fmtN(c.cantidadCompras)}</td>
                                                        <td className="py-2 text-xs text-gray-900 font-semibold text-right">{fmt(c.totalCompras)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                        }
                    </>
                )}

                {/* ESTADO INICIAL */}
                {
                    !data && !loading && !error && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-4">
                                <BarChart3 className="w-8 h-8 text-blue-500" />
                            </div>
                            <h2 className="text-gray-700 mb-2 text-xl font-semibold">Genera tu primer reporte</h2>
                            <p className="text-gray-400 text-sm max-w-md">
                                Selecciona los filtros de período que necesites (días, semanas, años) y presiona
                                "Generar Reporte" para obtener un análisis completo de datos con opción de descarga en PDF.
                            </p>
                            <button
                                onClick={generateReport}
                                className="mt-6 flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                            >
                                <BarChart3 className="w-4 h-4" />
                                Generar Reporte Completo
                            </button>
                        </div>
                    )
                }
            </div >
        </div >
    );
}
