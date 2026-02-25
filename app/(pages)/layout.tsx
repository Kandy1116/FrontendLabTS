'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/src/components/Sidebar';
import Header from '@/src/components/Header';
import './layout.css';

export default function PagesLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const showLayout = pathname !== '/' && !pathname.includes('/choose-plan');

    if (!showLayout) {
        return <>{children}</>;
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="layout">
            <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
            <div className="main-content">
                <Header toggleSidebar={toggleSidebar} />
                <main className="page-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
