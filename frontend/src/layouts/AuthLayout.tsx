import { Outlet, Link } from "react-router-dom";
import { Package } from "lucide-react";
import authBg from "@/assets/auth-bg.png";

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={authBg}
                    alt="Background"
                    className="w-full h-full object-cover opacity-40 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/80 to-transparent" />
            </div>

            <div className="relative z-10 w-full max-w-6xl px-6 grid lg:grid-cols-2 gap-12 items-center">
                {/* Branding Side */}
                <div className="hidden lg:flex flex-col text-white space-y-8">
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="h-14 w-14 rounded-2xl bg-primary shadow-[0_0_40px_rgba(37,99,235,0.4)] flex items-center justify-center transition-transform group-hover:rotate-6">
                            <Package className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter">WholesaleMart</h1>
                    </Link>

                    <div className="space-y-6">
                        <h2 className="text-5xl font-extrabold tracking-tight leading-tight">
                            The next generation of <span className="text-primary italic">B2B Wholesale</span> ordering.
                        </h2>
                        <p className="text-slate-400 text-xl font-medium max-w-md">
                            Experience a seamless, data-driven platform designed for modern retailers and suppliers.
                        </p>
                    </div>

                    <div className="pt-8 border-t border-white/10 w-fit">
                        <blockquote className="space-y-4">
                            <p className="text-lg text-slate-300 italic max-w-sm">
                                &ldquo;This platform has revolutionized how we manage our wholesale orders. Efficient, fast, and reliable.&rdquo;
                            </p>
                            <footer className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-slate-800 border border-white/10" />
                                <div>
                                    <p className="font-bold text-white">Sofia Davis</p>
                                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest">Retail Director</p>
                                </div>
                            </footer>
                        </blockquote>
                    </div>
                </div>

                {/* Form Side */}
                <div className="flex justify-center lg:justify-end">
                    <div className="w-full max-w-md">
                        <Outlet />
                    </div>
                </div>
            </div>

            {/* Bottom Accent */}
            <div className="absolute bottom-10 left-10 hidden lg:block">
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">© 2026 WholesaleMart Professional</p>
            </div>
        </div>
    );
}
