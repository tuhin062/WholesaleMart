import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, ShoppingCart, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const { pathname } = useLocation();
    const { logout } = useAuth();

    const routes = [
        {
            label: 'Dashboard',
            icon: LayoutDashboard,
            href: '/admin/dashboard',
            active: pathname === '/admin/dashboard',
        },
        {
            label: 'Product Catalog',
            icon: Package,
            href: '/admin/products',
            active: pathname === '/admin/products',
        },
        {
            label: 'Order Management',
            icon: ShoppingCart,
            href: '/admin/orders',
            active: pathname === '/admin/orders',
        },
    ];

    return (
        <div className={cn("h-full flex flex-col bg-slate-950 text-white shadow-2xl border-r border-white/5", className)}>
            <div className="p-8">
                <div className="flex items-center gap-4 mb-10 pb-8 border-b border-white/10">
                    <div className="h-12 w-12 rounded-2xl bg-primary shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center justify-center">
                        <Package className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-black tracking-tighter text-white leading-none">
                            WholesaleMart
                        </h2>
                        <span className="text-[12px] font-black tracking-[0.1em] text-primary-foreground/40 mt-1">Admin</span>
                    </div>
                </div>

                <nav className="space-y-2">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            to={route.href}
                            className={cn(
                                "flex items-center rounded-2xl px-4 py-3 text-sm font-bold transition-all group relative overflow-hidden",
                                route.active
                                    ? "bg-primary text-white shadow-xl shadow-primary/30"
                                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                            )}
                        >
                            <route.icon className={cn(
                                "mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                                route.active ? "text-white" : "text-slate-500 group-hover:text-primary"
                            )} />
                            {route.label}
                            {route.active && (
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/20" />
                            )}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-white/5">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                    onClick={logout}
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    <span className="font-medium">Logout Admin</span>
                </Button>
            </div>
        </div>
    );
}
