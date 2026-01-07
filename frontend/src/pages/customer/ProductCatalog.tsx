import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Search, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import { productService } from '@/services/api';
import groceryHero from '@/assets/grocery-hero.png';

export default function ProductCatalog() {
    const { addToCart } = useCart();
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getPublic();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const updateQuantity = (id: string, delta: number) => {
        setQuantities(prev => {
            const current = prev[id] || 1;
            const next = Math.max(1, current + delta);
            return { ...prev, [id]: next };
        });
    };

    const handleAddToCart = (product: Product) => {
        const qty = quantities[product.id] || 1;
        addToCart(product, qty);
        // Reset to 1 after adding? Or keep it? Keeping it is usually better UX.
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 pb-24">
            {/* Premium Hero Section */}
            <div className="relative h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl group mx-2 bg-slate-900">
                <img
                    src={groceryHero}
                    alt="Premium Products"
                    className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center px-12 space-y-6">
                    <div className="space-y-2">
                        <span className="text-emerald-400 font-black uppercase tracking-[0.4em] text-xs">Quality Staples</span>
                        <h1 className="text-5xl font-black text-white tracking-tighter max-w-xl leading-[1.1]">
                            The World's Finest <span className="text-emerald-400 italic">Grocery</span> Supplies.
                        </h1>
                        <p className="text-slate-300 text-lg font-medium max-w-md">
                            Direct from the source. Uncompromising quality for your business.
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Inventory</h2>
                    <p className="text-sm font-medium text-slate-500">Showing {filteredProducts.length} verified products</p>
                </div>

                <div className="relative w-full md:w-[400px] group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search rice, dal, spices..."
                        className="pl-12 h-14 bg-white border border-slate-200 shadow-sm rounded-2xl focus:ring-primary/20 transition-all font-bold text-slate-900 placeholder:font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-[400px] bg-white rounded-[2rem] animate-pulse" />
                    ))}
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-32 bg-white rounded-[2.5rem] mx-4 shadow-sm border border-slate-100">
                    <ShoppingBag className="mx-auto h-16 w-16 text-slate-200 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900">No products found</h3>
                    <p className="text-slate-400 font-medium">Try adjusting your search filters</p>
                </div>
            ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4">
                    {filteredProducts.map((product) => (
                        <Card key={product.id} className="group border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 rounded-[2rem] bg-white overflow-hidden flex flex-col h-full hover:-translate-y-1">
                            <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
                                <div className="absolute inset-0 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                                    📦
                                </div>
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm border border-slate-200">
                                        {product.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-3 gap-4">
                                    <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                        {product.name}
                                    </h3>
                                    <div className="text-lg font-black text-slate-900 tabular-nums whitespace-nowrap">
                                        ₹{product.price?.toFixed(2)}
                                    </div>
                                </div>

                                <p className="text-xs font-medium text-slate-500 line-clamp-2 mb-6 flex-1">
                                    {product.description}
                                </p>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center bg-slate-100 rounded-xl p-1 h-12">
                                        <button
                                            onClick={() => updateQuantity(product.id, -1)}
                                            className="w-8 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                                        >
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <div className="w-8 text-center font-black text-sm text-slate-900">
                                            {quantities[product.id] || 1}
                                        </div>
                                        <button
                                            onClick={() => updateQuantity(product.id, 1)}
                                            className="w-8 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                    <Button
                                        onClick={() => handleAddToCart(product)}
                                        className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/10 hover:shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        Add <span className="hidden sm:inline">to Hub</span> <ArrowRight className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
