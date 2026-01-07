import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { CheckCircle, Package, Truck, Clock, ArrowRight, CornerDownRight } from 'lucide-react';
import { orderService } from '@/services/api';
import { Order } from '@/types';
import { cn } from '@/lib/utils';

export default function OrderTracking() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getAll();
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 p-4 pt-12">
                <div className="h-10 w-48 bg-slate-200 rounded-lg animate-pulse" />
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white rounded-3xl animate-pulse" />)}
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="max-w-4xl mx-auto py-32 text-center bg-white rounded-[2.5rem] mt-12 shadow-sm border border-slate-50">
                <Package className="mx-auto h-16 w-16 text-slate-100 mb-4" />
                <h3 className="text-xl font-bold text-slate-900">No orders found</h3>
                <p className="text-slate-400 font-medium">Your procurement history will appear here.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-24 px-4 pt-8">
            <div className="space-y-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Purchase History</h1>
                <p className="text-slate-500 font-medium">Tracking {orders.length} active and past procurements.</p>
            </div>

            <div className="space-y-6">
                {orders.map((order) => (
                    <Card key={order.id} className="group border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2.5rem] bg-white overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className={cn(
                                        "h-16 w-16 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm border",
                                        getStatusStyles(order.status)
                                    )}>
                                        {order.status === 'delivered' ? <CheckCircle className="h-8 w-8" /> :
                                            order.status === 'shipped' ? <Truck className="h-8 w-8" /> :
                                                <Clock className="h-8 w-8" />}
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-black uppercase tracking-widest text-primary">#{order.readableId || order.id.slice(0, 8)}</span>
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                getStatusStyles(order.status)
                                            )}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900">
                                            {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </h3>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 md:text-right border-t md:border-t-0 pt-6 md:pt-0">
                                    <div>
                                        <p className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-1">Total Amount</p>
                                        <div className="flex items-baseline gap-1">
                                            <p className="text-2xl font-black text-slate-900">₹{order.total.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                        <ArrowRight className="h-6 w-6" />
                                    </div>
                                </div>
                            </div>

                            {/* Expandable/Subtle Item Preview */}
                            <div className="bg-slate-50/50 px-8 py-6 border-t border-slate-50 flex flex-wrap gap-4">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-slate-100 shadow-sm">
                                        <CornerDownRight className="h-3 w-3 text-slate-400" />
                                        <span className="text-xs font-bold text-slate-600 truncate max-w-[150px]">
                                            {item.quantity}x {item.productName || 'Product'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
