import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from './ui/Button';
import { ShoppingCart, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();

    return (
        <nav className="sticky top-0 z-50 w-full bg-slate-950 text-white shadow-2xl border-b border-white/5">
            <div className="container flex h-20 items-center justify-between px-6">
                <Link to="/customer/catalog" className="flex items-center gap-4 group">
                    <div className="h-10 w-10 rounded-xl bg-primary shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center transition-transform group-hover:rotate-6">
                        <ShoppingCart className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black tracking-tighter leading-none">WholesaleMart</h1>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground/40 mt-1 uppercase">Retailer Hub</span>
                    </div>
                </Link>

                <div className="flex items-center gap-6">
                    <nav className="hidden md:flex items-center gap-2 mr-4">
                        <Link to="/customer/catalog" className="px-4 py-2 rounded-lg text-sm font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all active:scale-95">Browse Catalog</Link>
                        <Link to="/customer/orders" className="px-4 py-2 rounded-lg text-sm font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all active:scale-95">My Orders</Link>
                    </nav>

                    <Link to="/customer/cart">
                        <Button variant="ghost" size="icon" className="relative h-12 w-12 rounded-2xl hover:bg-white/10 text-white transition-all hover:scale-110">
                            <ShoppingCart className="h-6 w-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-black text-white flex items-center justify-center shadow-lg shadow-primary/40 animate-in zoom-in">
                                    {cartCount}
                                </span>
                            )}
                        </Button>
                    </Link>

                    <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-bold text-white leading-none">
                                {user?.phone ? `+91 ${user.phone.replace(/^\+91\s?/, '')}` : (user?.name || 'Customer')}
                            </span>
                            <span className="text-[11px] font-medium text-emerald-400 mt-1 tracking-tight">Retail Partner</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={logout} className="h-10 w-10 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 transition-all">
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
