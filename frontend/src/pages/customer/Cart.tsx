import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Trash2, ArrowRight, ShoppingBag, Plus, Minus } from 'lucide-react';

export default function Cart() {
    const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

    const handleQuantityChange = (id: string, current: number, delta: number) => {
        const next = Math.max(1, current + delta);
        updateQuantity(id, next);
    };

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="h-24 w-24 bg-slate-50 flex items-center justify-center rounded-full text-slate-300">
                    <ShoppingBag className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900">Your cart is empty</h2>
                    <p className="text-slate-500 font-medium">Add products from the catalog to get started</p>
                </div>
                <Link to="/customer/catalog">
                    <Button className="h-12 px-8 rounded-xl font-bold uppercase tracking-wide">
                        Browse Catalog
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-24 pt-8 px-4">
            <h1 className="text-3xl font-bold text-slate-900">Shopping Cart <span className="text-slate-400 font-medium text-lg ml-2">({cartCount} items)</span></h1>

            <div className="grid gap-8 lg:grid-cols-3 items-start">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        {/* Header */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:grid">
                            <div className="col-span-6 pl-2">Product</div>
                            <div className="col-span-2 text-center">Price</div>
                            <div className="col-span-3 text-center">Quantity</div>
                            <div className="col-span-1 text-center"></div>
                        </div>

                        {/* Items */}
                        <div className="divide-y divide-slate-100">
                            {cart.map((item) => (
                                <div key={item.product.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center hover:bg-slate-50/30 transition-colors">
                                    <div className="col-span-6 flex items-center gap-4">
                                        <div className="h-16 w-16 bg-slate-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                                            📦
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">{item.product.category}</p>
                                            <h3 className="font-bold text-slate-900 leading-tight">{item.product.name}</h3>
                                            <p className="text-xs text-slate-400 font-medium mt-1">{item.product.sku}</p>
                                        </div>
                                    </div>

                                    <div className="col-span-2 text-left md:text-center font-bold text-slate-700">
                                        <span className="md:hidden text-xs text-slate-400 mr-2">Price:</span>
                                        ₹{item.product.price.toFixed(2)}
                                    </div>

                                    <div className="col-span-3 flex justify-start md:justify-center">
                                        <div className="flex items-center bg-slate-100 rounded-lg h-10 w-28">
                                            <button
                                                onClick={() => handleQuantityChange(item.product.id, item.quantity, -1)}
                                                className="w-9 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 rounded-l-lg transition-colors"
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <div className="flex-1 text-center font-bold text-sm text-slate-900 border-x border-slate-200">
                                                {item.quantity}
                                            </div>
                                            <button
                                                onClick={() => handleQuantityChange(item.product.id, item.quantity, 1)}
                                                className="w-9 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 rounded-r-lg transition-colors"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-span-1 flex justify-end md:justify-center">
                                        <button
                                            onClick={() => removeFromCart(item.product.id)}
                                            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all"
                                            title="Remove Item"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:sticky lg:top-32">
                    <Card className="border-none shadow-xl rounded-3xl bg-slate-900 text-white overflow-hidden">
                        <CardContent className="p-8 space-y-6">
                            <h2 className="text-xl font-bold tracking-tight">Order Summary</h2>

                            <div className="space-y-3">
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

                            <Link to="/customer/checkout" className="block pt-2">
                                <Button className="w-full h-14 rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                    Proceed to Checkout <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
