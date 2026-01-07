import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent } from '@/components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { orderService } from '@/services/api';
import { ShieldCheck, MapPin, CreditCard, ArrowRight, CornerDownRight } from 'lucide-react';

export default function Checkout() {
    const { cart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const orderItems = cart.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity
            }));

            await orderService.create(orderItems);

            clearCart();
            navigate('/customer/orders');
        } catch (error) {
            console.error("Order failed", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-24 pt-8 px-4">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
                <p className="text-slate-500 font-medium">Complete your order details below.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3 items-start">
                <div className="lg:col-span-2 space-y-8">
                    {/* Shipping Section */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                            <MapPin className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-bold text-slate-900">Shipping Address</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-slate-500">First Name</Label>
                                <Input className="h-11 bg-slate-50 border-slate-200 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-slate-500">Last Name</Label>
                                <Input className="h-11 bg-slate-50 border-slate-200 rounded-xl" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-slate-500">Address line 1</Label>
                            <Input className="h-11 bg-slate-50 border-slate-200 rounded-xl" placeholder="123 Market Street" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-slate-500">City</Label>
                                <Input className="h-11 bg-slate-50 border-slate-200 rounded-xl" placeholder="New York" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-slate-500">Zip Code</Label>
                                <Input className="h-11 bg-slate-50 border-slate-200 rounded-xl" placeholder="10001" />
                            </div>
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-bold text-slate-900">Payment Method</h2>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900">Credit Account</p>
                                <p className="text-xs font-medium text-slate-500">Net-30 Terms applied</p>
                            </div>
                            <div className="h-5 w-5 rounded-full border-[5px] border-primary bg-white" />
                        </div>
                    </div>
                </div>

                <div className="lg:sticky lg:top-32">
                    <Card className="border-none shadow-xl rounded-3xl bg-slate-900 text-white overflow-hidden">
                        <CardContent className="p-8 space-y-6">
                            <h2 className="text-xl font-bold tracking-tight">Order Summary</h2>

                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start text-sm py-2 border-b border-white/10 last:border-0">
                                        <div className="text-slate-300">
                                            <span className="font-bold text-white">{item.quantity}x</span> {item.product.name}
                                        </div>
                                        <span className="font-bold tabular-nums">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-white/10">
                                <div className="flex justify-between items-center text-slate-300">
                                    <span className="text-sm font-medium">Subtotal</span>
                                    <span className="font-bold tracking-wide">₹{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-300">
                                    <span className="text-sm font-medium">Shipping</span>
                                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider bg-emerald-400/10 px-2 py-1 rounded">Free</span>
                                </div>
                                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="text-2xl font-black tracking-tight text-primary">₹{cartTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <Button
                                className="w-full h-14 rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
