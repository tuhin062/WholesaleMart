import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Building2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Landing() {
    return (
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                    WholesaleMart
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    The premium B2B platform for modern wholesale trading.
                    Streamlined for reliability and speed.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 w-full max-w-3xl px-4">
                <Card className="hover:border-primary/50 transition-colors cursor-pointer group relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <CardHeader>
                        <Building2 className="w-12 h-12 mb-2 text-primary mx-auto" />
                        <CardTitle className="text-xl">Admin / Wholesaler</CardTitle>
                        <CardDescription>Manage inventory, orders, and customers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link to="/admin/login">
                            <Button className="w-full group-hover:bg-primary group-hover:text-white">
                                Login as Admin <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:border-primary/50 transition-colors cursor-pointer group relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <CardHeader>
                        <ShoppingBag className="w-12 h-12 mb-2 text-primary mx-auto" />
                        <CardTitle className="text-xl">Retailer / Customer</CardTitle>
                        <CardDescription>Browse catalog, place orders, and track deliveries.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link to="/customer/login">
                            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                                Login as Retailer <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            <div className="text-sm text-gray-500 pt-8">
                Trusted by over 500+ businesses globally.
            </div>
        </div>
    );
}
