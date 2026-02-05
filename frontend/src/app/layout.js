import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
    title: 'NoteMark - Notes & Bookmarks Manager',
    description: 'A beautiful app to save and organize your notes and bookmarks',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="font-sans antialiased">
                <AuthProvider>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: 'rgba(30, 41, 59, 0.95)',
                                color: '#fff',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#6366f1',
                                    secondary: '#fff',
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#fff',
                                },
                            },
                        }}
                    />
                    <Navbar />
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {children}
                    </main>
                </AuthProvider>
            </body>
        </html>
    );
}
