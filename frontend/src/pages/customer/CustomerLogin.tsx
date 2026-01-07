import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { authService } from '@/services/api';

export default function CustomerLogin() {
    const { login } = useAuth();
    const [phone, setPhone] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.sendOtp(phone);
            setShowOtp(true);
        } catch (error) {
            alert('Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await authService.verifyOtp(phone, otp);
            // Decode token manually or just mock user object for now since we have a valid token
            // In a real app we'd decode the JWT to get role/id
            login({
                id: '2', // extracted from token ideally
                email: '',
                name: 'Retail Partner',
                phone: phone, // Explicitly saving phone
                role: 'customer',
                token: data.access_token
            }, data.access_token);
        } catch (error) {
            alert('Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden glass transition-all duration-500">
            <CardHeader className="p-8 text-center bg-white/5 border-b border-white/5">
                <CardTitle className="text-3xl font-black text-white tracking-tight">Retailer Access</CardTitle>
                <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">B2B Partner Ecosystem</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
                {!showOtp ? (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-slate-400">Registered Phone</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+91 98765 43210"
                                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:bg-white/10 focus:ring-primary/20 h-12 rounded-2xl transition-all"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all" disabled={loading}>
                            {loading ? 'Transmitting...' : 'Request Access Code'}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="otp" className="text-xs font-black uppercase tracking-widest text-slate-400">Verification Code</Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="000 000"
                                    className="bg-white/5 border-white/10 text-white text-center text-2xl font-black tracking-[0.5em] focus:bg-white/10 focus:ring-primary/20 h-16 rounded-2xl transition-all"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={6}
                                    required
                                />
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 text-center">
                                    Secure code sent to {phone}
                                </p>
                            </div>
                        </div>
                        <Button type="submit" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all" disabled={loading}>
                            {loading ? 'Authenticating...' : 'Enter Wholesale Hub'}
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full text-slate-500 hover:text-white hover:bg-white/5 font-bold rounded-xl"
                            size="sm"
                            onClick={() => setShowOtp(false)}
                            type="button"
                        >
                            Change Phone Number
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
