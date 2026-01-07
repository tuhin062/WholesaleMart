import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { CheckCircle, XCircle, Clock, Truck, Search, ArrowUpRight, ShoppingBag } from 'lucide-react';
import { Order } from '@/types';
import { orderService } from '@/services/api';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

export default function OrderManagement() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await orderService.getAll();
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await orderService.updateStatus(id, status);
            fetchOrders();
            if (selectedOrder && selectedOrder.id === id) {
                setSelectedOrder(prev => prev ? { ...prev, status: status as any } : null);
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    // Filtering Logic (Improved for robustness)
    const filteredOrders = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return orders.filter(order => {
            const matchesSearch = !query ||
                order.id.toLowerCase().includes(query) ||
                (order.readableId && order.readableId.toString().includes(query)) ||
                (order.customerPhone && order.customerPhone.toLowerCase().includes(query)) ||
                (order.items && order.items.some(item => item.productName.toLowerCase().includes(query)));

            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [orders, searchQuery, statusFilter]);

    const getStatusStyles = (status: Order['status']) => {
        switch (status) {
            case 'pending': return 'bg-amber-100/50 text-amber-700 border-amber-200';
            case 'processing': return 'bg-sky-100/50 text-sky-700 border-sky-200';
            case 'shipped': return 'bg-indigo-100/50 text-indigo-700 border-indigo-200';
            case 'delivered': return 'bg-emerald-100/50 text-emerald-700 border-emerald-200';
            case 'cancelled': return 'bg-rose-100/50 text-rose-700 border-rose-200';
            default: return 'bg-slate-100/50 text-slate-700 border-slate-200';
        }
    };

    const getStatusIcon = (status: Order['status']) => {
        switch (status) {
            case 'pending': return <Clock className="h-3.5 w-3.5" />;
            case 'processing': return <Clock className="h-3.5 w-3.5" />;
            case 'shipped': return <Truck className="h-3.5 w-3.5" />;
            case 'delivered': return <CheckCircle className="h-3.5 w-3.5" />;
            case 'cancelled': return <XCircle className="h-3.5 w-3.5" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-8 p-2">
            <div className="flex flex-col gap-1 text-left">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Order Management</h1>
                <p className="text-slate-500 font-bold font-sans">Monitor transactions and fulfillment across the platform.</p>
            </div>

            {/* Filters & Actions */}
            <Card className="border-none shadow-sm rounded-3xl bg-white p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search by ID, Phone or Name..."
                        className="pl-12 h-12 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-primary/10 rounded-2xl transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex bg-slate-100/80 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto scrollbar-hide">
                    {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                statusFilter === status
                                    ? "bg-white text-primary shadow-lg shadow-black/5"
                                    : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </Card>

            {/* Orders Table */}
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-slate-100 hover:bg-transparent">
                            <TableHead className="w-[120px] px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</TableHead>
                            <TableHead className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</TableHead>
                            <TableHead className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Placed</TableHead>
                            <TableHead className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</TableHead>
                            <TableHead className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Current Status</TableHead>
                            <TableHead className="text-right px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest h-12">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <TableRow key={i} className="animate-pulse">
                                    <TableCell colSpan={6} className="h-20 px-6"><div className="h-10 bg-slate-50 rounded-xl w-full" /></TableCell>
                                </TableRow>
                            ))
                        ) : filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-32 text-slate-300">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="p-6 rounded-full bg-slate-50 mb-2">
                                            <ShoppingBag className="h-12 w-12 opacity-20" />
                                        </div>
                                        <p className="font-black text-xl text-slate-400">No results found</p>
                                        <p className="text-sm font-bold text-slate-300">Try adjusting your search or filters</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredOrders.map((order) => (
                            <TableRow key={order.id} className="group hover:bg-slate-50/50 transition-colors border-slate-50 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                <TableCell className="px-6 font-black text-primary text-sm tracking-tight">
                                    #{order.readableId || order.id.slice(0, 8)}
                                </TableCell>
                                <TableCell className="px-6">
                                    <div className="flex flex-col">
                                        <span className="font-extrabold text-slate-900 group-hover:text-primary transition-colors">{order.customerPhone || 'Direct App User'}</span>
                                        <span className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase font-black opacity-50">ID: {order.userId.slice(0, 8)}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 text-slate-600 font-bold text-sm">
                                    {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </TableCell>
                                <TableCell className="px-6 font-black text-slate-900 text-sm">
                                    ₹{order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell className="px-6">
                                    <div className="flex justify-center">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black tracking-widest uppercase border transition-all shadow-sm bg-white",
                                            getStatusStyles(order.status)
                                        )}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right px-6" onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm" className="h-10 w-10 p-0 border-slate-100 bg-slate-50 text-slate-400 hover:text-primary hover:bg-white hover:border-primary/20 rounded-xl transition-all">
                                                <ArrowUpRight className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-none">
                                            <DropdownMenuItem className="cursor-pointer font-bold rounded-xl" onClick={() => setSelectedOrder(order)}>View Full Details</DropdownMenuItem>
                                            <div className="h-px bg-slate-50 my-2" />
                                            <DropdownMenuItem className="cursor-pointer text-sky-600 font-bold rounded-xl" onClick={() => handleStatusUpdate(order.id, 'processing')}>Mark Processing</DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer text-indigo-600 font-bold rounded-xl" onClick={() => handleStatusUpdate(order.id, 'shipped')}>Mark Shipped</DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer text-emerald-600 font-bold rounded-xl" onClick={() => handleStatusUpdate(order.id, 'delivered')}>Mark Delivered</DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer text-rose-600 font-bold rounded-xl" onClick={() => handleStatusUpdate(order.id, 'cancelled')}>Cancel Order</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {/* Order Detail Overlay (Refined for Premium UI) */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setSelectedOrder(null)}>
                    <div
                        className="bg-white rounded-[2rem] shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-8 border-b-2 border-slate-50 flex justify-between items-start bg-slate-50/30">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Order #{selectedOrder.readableId || selectedOrder.id.slice(0, 8)}</h2>
                                <p className="text-sm font-bold text-slate-400 capitalize">Placed on {new Date(selectedOrder.createdAt).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="rounded-full h-10 w-10 p-0 hover:bg-slate-100" onClick={() => setSelectedOrder(null)}>
                                <XCircle className="h-6 w-6 text-slate-300 group-hover:text-slate-500" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
                            {/* Summary Grid */}
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</p>
                                    <span className={cn(
                                        "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-black tracking-widest uppercase border bg-white shadow-sm",
                                        getStatusStyles(selectedOrder.status)
                                    )}>
                                        {getStatusIcon(selectedOrder.status)}
                                        {selectedOrder.status}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Customer Contact</p>
                                    <p className="text-lg font-black text-slate-900">{selectedOrder.customerPhone || 'N/A'}</p>
                                    <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase font-bold">ID: {selectedOrder.userId}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total</p>
                                    <p className="text-3xl font-black text-primary tracking-tighter">₹{selectedOrder.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                    Items Breakdown
                                    <span className="h-0.5 flex-1 bg-slate-50" />
                                </h3>
                                <div className="rounded-3xl border-2 border-slate-50 overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-slate-50/50">
                                            <TableRow className="hover:bg-transparent border-slate-50">
                                                <TableHead className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Name</TableHead>
                                                <TableHead className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Qty</TableHead>
                                                <TableHead className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Unit Price</TableHead>
                                                <TableHead className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Subtotal</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="divide-y divide-slate-50">
                                            {selectedOrder.items.map((item, idx) => (
                                                <TableRow key={idx} className="border-none hover:bg-slate-50/30 transition-colors">
                                                    <TableCell className="px-6 py-4 font-bold text-slate-900 text-sm">{item.productName}</TableCell>
                                                    <TableCell className="px-6 py-4 text-center">
                                                        <span className="bg-slate-100/50 px-3 py-1 rounded-xl text-xs font-black text-slate-600">x {item.quantity}</span>
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 text-center text-sm font-bold text-slate-400">₹{item.price.toFixed(2)}</TableCell>
                                                    <TableCell className="px-6 py-4 text-right font-black text-sm text-slate-900">
                                                        ₹{(item.quantity * item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>

                        {/* Footer Controls */}
                        <div className="p-8 border-t-2 border-slate-50 bg-slate-50/30 flex flex-wrap gap-3 justify-end">
                            {selectedOrder.status === 'pending' && (
                                <Button className="bg-sky-600 hover:bg-sky-700 h-12 px-8 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-sky-500/20" onClick={() => handleStatusUpdate(selectedOrder.id, 'processing')}>
                                    Accept & Start Processing
                                </Button>
                            )}
                            {selectedOrder.status === 'processing' && (
                                <Button className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-500/20" onClick={() => handleStatusUpdate(selectedOrder.id, 'shipped')}>
                                    Dispatch Shipment
                                </Button>
                            )}
                            {['shipped'].includes(selectedOrder.status) && (
                                <Button className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-500/20" onClick={() => handleStatusUpdate(selectedOrder.id, 'delivered')}>
                                    Confirm Delivery
                                </Button>
                            )}
                            <Button variant="outline" className="text-slate-500 h-12 px-8 rounded-2xl border-slate-200 font-bold hover:bg-white transition-all" onClick={() => setSelectedOrder(null)}>Close View</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
