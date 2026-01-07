import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
    DollarSign,
    Package,
    ShoppingCart,
    Users,
    TrendingUp,
    AlertCircle,
    ArrowUpRight,
    Clock,
    CheckCircle
} from "lucide-react";
import { dashboardService } from '@/services/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export default function DashboardOverview() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await dashboardService.getStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse p-8">
                <div className="h-10 w-48 bg-slate-200 rounded-lg mb-8" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    const kpis = [
        {
            title: "Total Revenue",
            value: `₹${stats?.kpis.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            trend: "+12.5% from last month"
        },
        {
            title: "Pending Orders",
            value: stats?.kpis.pendingOrders,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50",
            trend: "Needs immediate attention"
        },
        {
            title: "Active Products",
            value: stats?.kpis.activeProducts,
            icon: Package,
            color: "text-blue-600",
            bg: "bg-blue-50",
            trend: "Catalog is healthy"
        },
        {
            title: "Total Customers",
            value: stats?.kpis.totalCustomers,
            icon: Users,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            trend: "Expanding reach"
        }
    ];

    return (
        <div className="space-y-8 p-2">
            <div className="flex flex-col gap-1">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500 font-medium font-sans">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            {/* KPI Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi, i) => (
                    <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl bg-white overflow-hidden group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-6">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">{kpi.title}</CardTitle>
                            <div className={cn("p-3 rounded-2xl transition-all duration-300 group-hover:scale-110", kpi.bg)}>
                                <kpi.icon className={cn("h-5 w-5", kpi.color)} />
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <div className="text-3xl font-black text-slate-900 tabular-nums mb-1">{kpi.value}</div>
                            <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3 text-emerald-500" />
                                {kpi.trend}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Revenue Trend Chart Placeholder */}
                <Card className="col-span-4 border-none shadow-sm rounded-3xl bg-white p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <CardTitle className="text-xl font-bold text-slate-900">Revenue Trend</CardTitle>
                            <p className="text-sm text-slate-400">Daily earnings over the last 7 days</p>
                        </div>
                        <Link to="/admin/orders">
                            <Button variant="ghost" className="text-primary text-xs font-bold hover:bg-primary/5">
                                View Full Report <ArrowUpRight className="ml-1 h-3 w-3" />
                            </Button>
                        </Link>
                    </div>

                    <div className="flex items-end justify-between h-48 gap-2">
                        {stats?.revenueTrend.map((day: any, i: number) => {
                            const maxRev = Math.max(...stats.revenueTrend.map((d: any) => d.revenue)) || 1;
                            const height = (day.revenue / maxRev) * 100;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div
                                        className="w-full bg-slate-100 rounded-lg relative overflow-hidden group-hover:bg-primary/10 transition-colors"
                                        style={{ height: '100%' }}
                                    >
                                        <div
                                            className="absolute bottom-0 w-full bg-primary/20 group-hover:bg-primary transition-all duration-500 rounded-t-lg"
                                            style={{ height: `${height}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{day.date}</span>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Recent Activity / Low Stock */}
                <Card className="col-span-3 border-none shadow-sm rounded-3xl bg-white p-6">
                    <CardTitle className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        Inventory Alerts
                        {stats?.kpis.lowStockCount > 0 && (
                            <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                        )}
                    </CardTitle>
                    <div className="space-y-6">
                        {stats?.lowStockItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-50 rounded-2xl">
                                <CheckCircle className="h-10 w-10 text-emerald-500/20 mb-3" />
                                <p className="text-sm font-bold text-slate-400 tracking-tight">All products are healthy</p>
                            </div>
                        ) : (
                            stats?.lowStockItems.slice(0, 4).map((item: any) => (
                                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center">
                                            <AlertCircle className="h-5 w-5 text-rose-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 line-clamp-1">{item.name}</p>
                                            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Only {item.stock} Left</p>
                                        </div>
                                    </div>
                                    <Link to="/admin/products">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-white shadow-sm">
                                            <ArrowUpRight className="h-4 w-4 text-slate-400" />
                                        </Button>
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>

            {/* Recent Orders List */}
            <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-slate-900">Recent Transactions</CardTitle>
                    <Link to="/admin/orders">
                        <Button variant="outline" className="rounded-xl border-slate-100 font-bold text-xs h-9 px-4">
                            Manage All Orders
                        </Button>
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {stats?.recentOrders.map((order: any) => (
                                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-primary text-sm tracking-tight">
                                        #{order.readableId || order.id.slice(0, 8)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-slate-900">{order.customer}</span>
                                    </td>
                                    <td className="px-6 py-4 font-black text-slate-900 text-sm">
                                        ₹{order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={cn(
                                            "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black tracking-widest uppercase border",
                                            order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                order.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                    order.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                                        'bg-slate-50 text-slate-700 border-slate-100'
                                        )}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
