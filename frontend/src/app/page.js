import Link from 'next/link';
import { FiFileText, FiBookmark, FiArrowRight, FiStar, FiSearch, FiTag } from 'react-icons/fi';

export default function Home() {
    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="text-center py-16 md:py-24">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm mb-6">
                    <FiStar className="w-4 h-4 mr-2" />
                    Your Personal Knowledge Hub
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    Organize Your
                    <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent"> Notes </span>
                    &
                    <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent"> Bookmarks</span>
                </h1>

                <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10">
                    A beautiful, modern app to save your thoughts and favorite links.
                    Search instantly, organize with tags, and access everything from anywhere.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/login" className="btn-primary flex items-center space-x-2 group">
                        <FiArrowRight className="w-5 h-5" />
                        <span>Login to Get Started</span>
                    </Link>
                    <Link href="/register" className="btn-secondary flex items-center space-x-2 group">
                        <span>Create Account</span>
                        <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="glass-card p-6 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
                            <FiFileText className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Rich Notes</h3>
                        <p className="text-white/60">
                            Create and organize notes with titles, content, and tags for easy retrieval.
                        </p>
                    </div>

                    <div className="glass-card p-6 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
                            <FiBookmark className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Smart Bookmarks</h3>
                        <p className="text-white/60">
                            Save URLs with auto-fetched titles, descriptions, and keep them organized.
                        </p>
                    </div>

                    <div className="glass-card p-6 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
                            <FiSearch className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Instant Search</h3>
                        <p className="text-white/60">
                            Find anything instantly with powerful search and tag filtering.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
