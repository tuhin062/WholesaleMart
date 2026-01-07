import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Product } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";

// Define simpler props since we don't have Select/Textarea components fully ready in atomic form yet
// actually we do have Input. We can use standard textarea for description.

interface ProductFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (product: Omit<Product, 'id'> | Product) => Promise<void>;
    initialData?: Product | null;
    existingSkus?: string[];
}

export function ProductForm({ open, onOpenChange, onSubmit, initialData, existingSkus = [] }: ProductFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Product>>({
        sku: '',
        name: '',
        category: '',
        price: 0,
        stock: 0,
        description: '',
        status: 'active'
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                sku: '',
                name: '',
                category: '',
                price: 0,
                stock: 0,
                description: '',
                status: 'active'
            });
        }
    }, [initialData, open]);

    const [categoryOpen, setCategoryOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [skuOpen, setSkuOpen] = useState(false);

    // Reset dropdown states when dialog opens/closes to prevent stale open states
    useEffect(() => {
        if (!open) {
            setCategoryOpen(false);
            setStatusOpen(false);
            setSkuOpen(false);
        }
    }, [open]);

    const categoryOptions = ["Grains", "Spices", "Oils", "Nuts", "Sweeteners", "Pulses", "Snacks", "Beverages"];
    const statusOptions = [
        { value: 'active', label: 'Active (Visible to Customers)', color: 'bg-emerald-500' },
        { value: 'inactive', label: 'Inactive (Hidden from Customers)', color: 'bg-slate-400' }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData as any);
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            alert('Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[95vh] bg-white text-gray-900 border-none shadow-2xl p-0 flex flex-col rounded-xl overflow-hidden">
                <DialogHeader className="px-8 py-5 border-b bg-gray-50/80 sticky top-0 z-[100] shrink-0">
                    <DialogTitle className="text-xl font-extrabold text-gray-900 tracking-tight">
                        {initialData ? 'Edit Wholesale Product' : 'Create New Listing'}
                    </DialogTitle>
                    <DialogDescription className="text-gray-500 text-xs font-medium mt-1">
                        {initialData ? `Modifying inventory item: ${initialData.sku}` : 'List a new item for your retail network.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
                    <form onSubmit={handleSubmit} id="product-form" className="space-y-6 pb-20">
                        {/* SKU Section */}
                        <div className="space-y-2.5 relative z-[60]">
                            <Label htmlFor="sku" className="text-sm font-bold text-gray-800 uppercase tracking-wider">Product SKU</Label>
                            <div className="flex gap-3 relative">
                                <div className="flex-1 relative">
                                    <Input
                                        id="sku"
                                        value={formData.sku}
                                        onChange={(e) => {
                                            setFormData({ ...formData, sku: e.target.value });
                                            setSkuOpen(true);
                                        }}
                                        onClick={() => setSkuOpen(true)}
                                        onBlur={() => setTimeout(() => setSkuOpen(false), 200)}
                                        className="w-full h-12 bg-white border-2 border-gray-100 focus:border-indigo-600 focus:ring-0 shadow-sm transition-all text-sm font-medium rounded-lg placeholder:text-gray-300"
                                        placeholder="e.g. WM-BAS-9021"
                                        autoComplete="off"
                                        required
                                    />
                                    {skuOpen && existingSkus.length > 0 && (
                                        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-48 overflow-auto z-[70] py-2 animate-in fade-in slide-in-from-top-2">
                                            {existingSkus.filter(s => s.toLowerCase().includes((formData.sku || '').toLowerCase())).map((sku) => (
                                                <div
                                                    key={sku}
                                                    className="px-4 py-2.5 cursor-pointer hover:bg-indigo-50 text-xs font-semibold text-gray-700 transition-colors flex items-center justify-between"
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        setFormData({ ...formData, sku });
                                                        setSkuOpen(false);
                                                    }}
                                                >
                                                    <span>{sku}</span>
                                                    <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full uppercase">Used</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-12 w-12 border-2 border-gray-100 hover:bg-gray-50 text-indigo-600 font-bold shadow-sm rounded-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                                    title="Auto-generate"
                                    onClick={() => {
                                        if (!formData.name) {
                                            alert("Please enter a product name first.");
                                            return;
                                        }
                                        const prefix = formData.name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
                                        const random = Math.floor(1000 + Math.random() * 9000);
                                        setFormData({ ...formData, sku: `WM-${prefix}-${random}` });
                                    }}
                                >
                                    <span className="text-xl">↺</span>
                                </Button>
                            </div>
                        </div>

                        {/* Name */}
                        <div className="space-y-2.5">
                            <Label htmlFor="name" className="text-sm font-bold text-gray-800 uppercase tracking-wider">Product Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full h-12 bg-white border-2 border-gray-100 focus:border-indigo-600 focus:ring-0 shadow-sm text-sm font-medium rounded-lg"
                                placeholder="e.g. Premium White Rice 10kg"
                                required
                            />
                        </div>

                        {/* Category Searchable Select */}
                        <div className="space-y-2.5 relative z-[50]">
                            <Label htmlFor="category" className="text-sm font-bold text-gray-800 uppercase tracking-wider">Category</Label>
                            <div className="relative">
                                <Input
                                    id="category"
                                    value={formData.category}
                                    onChange={(e) => {
                                        setFormData({ ...formData, category: e.target.value });
                                        setCategoryOpen(true);
                                    }}
                                    onClick={() => setCategoryOpen(true)}
                                    onBlur={() => setTimeout(() => setCategoryOpen(false), 200)}
                                    className="w-full h-12 bg-white border-2 border-gray-100 focus:border-indigo-600 focus:ring-0 shadow-sm text-sm font-medium rounded-lg"
                                    placeholder="Select or type category..."
                                    autoComplete="off"
                                    required
                                />
                                {categoryOpen && (
                                    <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-48 overflow-auto z-[55] py-2 animate-in fade-in slide-in-from-top-2">
                                        {categoryOptions.filter(opt => opt.toLowerCase().includes((formData.category || '').toLowerCase())).map((opt) => (
                                            <div
                                                key={opt}
                                                className="px-4 py-2.5 cursor-pointer hover:bg-indigo-50 text-xs font-semibold text-gray-700 transition-colors"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    setFormData({ ...formData, category: opt });
                                                    setCategoryOpen(false);
                                                }}
                                            >
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2.5">
                                <Label htmlFor="price" className="text-sm font-bold text-gray-800 uppercase tracking-wider">Unit Price (₹)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                    className="w-full h-12 bg-white border-2 border-gray-100 focus:border-indigo-600 focus:ring-0 shadow-sm text-sm font-bold rounded-lg text-indigo-700"
                                    required
                                />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="stock" className="text-sm font-bold text-gray-800 uppercase tracking-wider">Stock Level</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                    className="w-full h-12 bg-white border-2 border-gray-100 focus:border-indigo-600 focus:ring-0 shadow-sm text-sm font-bold rounded-lg"
                                    required
                                />
                            </div>
                        </div>

                        {/* Custom Status Dropdown */}
                        <div className="space-y-2.5 relative z-[40]">
                            <Label className="text-sm font-bold text-gray-800 uppercase tracking-wider">Market Visibility</Label>
                            <div className="relative">
                                <div
                                    onClick={() => setStatusOpen(!statusOpen)}
                                    className="w-full h-12 bg-white border-2 border-gray-100 rounded-lg shadow-sm flex items-center justify-between px-4 cursor-pointer hover:border-indigo-200 transition-all select-none"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2.5 w-2.5 rounded-full ${formData.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-400'}`} />
                                        <span className="text-sm font-semibold capitalize text-gray-700">
                                            {formData.status === 'active' ? 'Active & Visible' : 'Inactive & Private'}
                                        </span>
                                    </div>
                                    <svg className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${statusOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>

                                {statusOpen && (
                                    <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-[45] animate-in fade-in slide-in-from-top-2">
                                        {statusOptions.map((opt) => (
                                            <div
                                                key={opt.value}
                                                className="px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                                onClick={() => {
                                                    setFormData({ ...formData, status: opt.value as 'active' | 'inactive' });
                                                    setStatusOpen(false);
                                                }}
                                            >
                                                <div className={`h-2.5 w-2.5 rounded-full ${opt.color}`} />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-800">{opt.value === 'active' ? 'Active' : 'Inactive'}</span>
                                                    <span className="text-[10px] text-gray-400 font-medium">{opt.label.split('(')[1].replace(')', '')}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                <DialogFooter className="px-8 py-5 bg-gray-50 border-t flex justify-end gap-3 mt-0 shrink-0">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="px-5 h-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100 font-bold text-sm">
                        Discard
                    </Button>
                    <Button
                        type="submit"
                        form="product-form"
                        disabled={loading}
                        className="px-6 h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md"
                    >
                        {loading ? 'Saving...' : (initialData ? 'Update Item' : 'Create Listing')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
