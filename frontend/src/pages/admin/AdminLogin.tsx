import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { authService } from '@/services/api';

export default function AdminLogin() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await authService.login(email, password);
            // Ideally backend returns full user object, but for now we decode or use what we returned
            // Since backend currently returns {"access_token": "...", "token_type": "bearer"}
            // We need to infer user data from token or just mock it for admin since we know who it is if login succeeds
            login({
                id: '1',
                email: email,
                name: 'Admin User',
                role: 'admin',
                token: data.access_token
            }, data.access_token);
        } catch (error) {
            alert('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden glass transition-all duration-500 hover:shadow-primary/10">
            <CardHeader className="space-y-1 p-8 text-center bg-white/5 border-b border-white/5">
                <CardTitle className="text-3xl font-black text-white tracking-tight">Admin Portal</CardTitle>
                <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Security Clearance Required</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6 p-8">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@wholesalemart.com"
                            className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:bg-white/10 focus:ring-primary/20 h-12 rounded-2xl transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-400">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            className="bg-white/5 border-white/10 text-white focus:bg-white/10 focus:ring-primary/20 h-12 rounded-2xl transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </CardContent>
                <CardFooter className="p-8 pt-0">
                    <Button type="submit" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Enter Dashboard'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
