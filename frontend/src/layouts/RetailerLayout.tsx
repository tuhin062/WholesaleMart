import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

export default function RetailerLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-muted/20">
            <Navbar />
            <main className="flex-1 container py-6">
                <Outlet />
            </main>
        </div>
    );
}
