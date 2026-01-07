import { Sidebar } from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar - Fixed width, full height */}
            <Sidebar className="hidden md:flex w-72 flex-shrink-0" />

            {/* Main Content - Flex 1, scrollable */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="h-16 border-b px-8 flex items-center md:hidden flex-shrink-0 bg-white shadow-sm">
                    <span className="font-black text-primary">WholesaleMart</span>
                </header>
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
