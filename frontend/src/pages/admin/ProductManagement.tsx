import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Plus, Search, Edit, Trash2, Package, Eye, EyeOff } from 'lucide-react';
import { Product } from '@/types';
import { productService } from '@/services/api';
import { ProductForm } from '@/components/ProductForm';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

export default function ProductManagement() {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await productService.getAdmin();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCreateOrUpdate = async (productData: Omit<Product, 'id'> | Product) => {
        try {
            if (editingProduct) {
                await productService.update(editingProduct.id, productData);
            } else {
                await productService.create(productData);
            }
            fetchProducts();
            setIsDialogOpen(false);
            setEditingProduct(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await productService.delete(id);
            fetchProducts();
        } catch (error) {
            console.error(error);
        }
    };

    const openAddDialog = () => {
        setEditingProduct(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (product: Product) => {
        setEditingProduct(product);
        setIsDialogOpen(true);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
    );

    const handleToggleStatus = async (product: Product) => {
        const newStatus = product.status === 'active' ? 'inactive' : 'active';
        try {
            await productService.updateStatus(product.id, newStatus);
            fetchProducts();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-8 p-2">
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Product Catalog</h1>
                    <p className="text-slate-500 font-medium">Manage your wholesale inventory and pricing.</p>
                </div>
                <Button onClick={openAddDialog} className="rounded-2xl h-11 px-6 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    <Plus className="mr-2 h-5 w-5" /> Add New Product
                </Button>
            </div>

            <Card className="p-4 border-none shadow-sm rounded-3xl bg-white flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder="Search by name, SKU or category..."
                        className="pl-12 h-12 border-slate-100 bg-slate-50/50 focus:bg-white rounded-2xl transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="w-[120px] px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">SKU</TableHead>
                            <TableHead className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Details</TableHead>
                            <TableHead className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Price</TableHead>
                            <TableHead className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Inventory</TableHead>
                            <TableHead className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</TableHead>
                            <TableHead className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <TableRow key={i} className="animate-pulse">
                                    <TableCell colSpan={6} className="h-20 px-6"><div className="h-10 bg-slate-50 rounded-xl w-full" /></TableCell>
                                </TableRow>
                            ))
                        ) : filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-20">
                                    <div className="flex flex-col items-center gap-3 text-slate-300">
                                        <Package className="h-12 w-12 opacity-20" />
                                        <p className="font-bold text-lg">No products found</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts.map((product) => (
                                <TableRow key={product.id} className="hover:bg-slate-50/50 transition-colors border-slate-50 group">
                                    <TableCell className="px-6 font-mono text-xs text-slate-400">{product.sku}</TableCell>
                                    <TableCell className="px-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">{product.name}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.category}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 text-center">
                                        <span className="font-black text-slate-900">₹{product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <div className="flex flex-col items-center">
                                            <div className={cn(
                                                "px-3 py-1 rounded-full text-xs font-black",
                                                product.stock < 10 ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-700"
                                            )}>
                                                {product.stock} units
                                            </div>
                                            {product.stock < 10 && (
                                                <span className="text-[9px] font-black text-rose-500 uppercase mt-1 animate-pulse">Low Stock</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => handleToggleStatus(product)}
                                                className={cn(
                                                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 transition-all active:scale-95",
                                                    product.status === 'active'
                                                        ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                                        : "bg-slate-100 border-slate-200 text-slate-400"
                                                )}
                                            >
                                                <div className={cn("h-2 w-2 rounded-full", product.status === 'active' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300")} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{product.status}</span>
                                                {product.status === 'active' ? <Eye className="h-3 w-3 ml-1" /> : <EyeOff className="h-3 w-3 ml-1" />}
                                            </button>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 text-right">
                                        <div className="flex justify-end gap-2 group-hover:scale-105 transition-transform duration-300">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-9 w-9 rounded-xl border-slate-100 bg-slate-50 text-slate-400 hover:text-primary hover:bg-white hover:border-primary/20 shadow-sm transition-all"
                                                onClick={() => openEditDialog(product)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-9 w-9 rounded-xl border-slate-100 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 shadow-sm transition-all"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            <ProductForm
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={handleCreateOrUpdate}
                initialData={editingProduct}
                existingSkus={products.map(p => p.sku)}
            />
        </div>
    );
}
