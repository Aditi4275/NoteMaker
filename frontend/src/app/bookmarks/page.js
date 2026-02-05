'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FiPlus, FiBookmark, FiStar } from 'react-icons/fi';
import { bookmarksApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import BookmarkCard from '@/components/BookmarkCard';
import SearchBar from '@/components/SearchBar';
import TagFilter from '@/components/TagFilter';
import Modal from '@/components/Modal';

export default function BookmarksPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [showFavorites, setShowFavorites] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBookmark, setEditingBookmark] = useState(null);
    const [formData, setFormData] = useState({
        url: '',
        title: '',
        description: '',
        tags: '',
    });

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    // Fetch bookmarks
    const fetchBookmarks = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const params = {};
            if (searchQuery) params.q = searchQuery;
            if (selectedTags.length > 0) params.tags = selectedTags.join(',');
            if (showFavorites) params.favorite = 'true';

            const response = await bookmarksApi.getAll(params);
            setBookmarks(response.data.data || []);
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
            if (error.response?.status !== 401) {
                toast.error('Failed to fetch bookmarks');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchBookmarks();
        }
    }, [searchQuery, selectedTags, showFavorites, user]);

    // Get all unique tags
    const allTags = useMemo(() => {
        const tagSet = new Set();
        bookmarks.forEach(bookmark => {
            bookmark.tags?.forEach(tag => tagSet.add(tag));
        });
        return Array.from(tagSet).sort();
    }, [bookmarks]);

    // Handle tag toggle
    const handleTagToggle = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    // Open modal for create
    const handleCreate = () => {
        setEditingBookmark(null);
        setFormData({ url: '', title: '', description: '', tags: '' });
        setIsModalOpen(true);
    };

    // Open modal for edit
    const handleEdit = (bookmark) => {
        setEditingBookmark(bookmark);
        setFormData({
            url: bookmark.url,
            title: bookmark.title || '',
            description: bookmark.description || '',
            tags: bookmark.tags?.join(', ') || '',
        });
        setIsModalOpen(true);
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.url.trim()) {
            toast.error('URL is required');
            return;
        }

        const bookmarkData = {
            url: formData.url.trim(),
            title: formData.title.trim(),
            description: formData.description.trim(),
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        };

        try {
            if (editingBookmark) {
                await bookmarksApi.update(editingBookmark._id, bookmarkData);
                toast.success('Bookmark updated successfully');
            } else {
                await bookmarksApi.create(bookmarkData);
                toast.success('Bookmark created successfully');
            }
            setIsModalOpen(false);
            fetchBookmarks();
        } catch (error) {
            console.error('Error saving bookmark:', error);
            toast.error(error.response?.data?.message || 'Failed to save bookmark');
        }
    };

    // Handle delete
    const handleDelete = async (bookmark) => {
        if (!confirm('Are you sure you want to delete this bookmark?')) return;

        try {
            await bookmarksApi.delete(bookmark._id);
            toast.success('Bookmark deleted successfully');
            fetchBookmarks();
        } catch (error) {
            console.error('Error deleting bookmark:', error);
            toast.error('Failed to delete bookmark');
        }
    };

    // Handle toggle favorite
    const handleToggleFavorite = async (bookmark) => {
        try {
            await bookmarksApi.update(bookmark._id, { isFavorite: !bookmark.isFavorite });
            fetchBookmarks();
        } catch (error) {
            console.error('Error updating favorite:', error);
            toast.error('Failed to update favorite');
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <FiBookmark className="text-primary-400" />
                        My Bookmarks
                    </h1>
                    <p className="text-white/60 mt-1">
                        {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''} saved
                    </p>
                </div>
                <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
                    <FiPlus className="w-5 h-5" />
                    New Bookmark
                </button>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Search bookmarks..."
                        />
                    </div>
                    <button
                        onClick={() => setShowFavorites(!showFavorites)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${showFavorites
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                            }`}
                    >
                        <FiStar className={showFavorites ? 'fill-current' : ''} />
                        Favorites
                    </button>
                </div>

                {allTags.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <TagFilter
                            tags={allTags}
                            selectedTags={selectedTags}
                            onTagToggle={handleTagToggle}
                        />
                    </div>
                )}
            </div>

            {/* Bookmarks Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
                </div>
            ) : bookmarks.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <FiBookmark className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No bookmarks found</h3>
                    <p className="text-white/60 mb-6">
                        {searchQuery || selectedTags.length > 0 || showFavorites
                            ? 'Try adjusting your filters'
                            : 'Save your first bookmark to get started'}
                    </p>
                    {!searchQuery && selectedTags.length === 0 && !showFavorites && (
                        <button onClick={handleCreate} className="btn-primary">
                            Add Bookmark
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bookmarks.map(bookmark => (
                        <BookmarkCard
                            key={bookmark._id}
                            bookmark={bookmark}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingBookmark ? 'Edit Bookmark' : 'Add Bookmark'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            URL *
                        </label>
                        <input
                            type="text"
                            value={formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            placeholder="https://example.com"
                            className="input-field"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Title (auto-fetched if empty)
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Leave empty to auto-fetch"
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Add a description..."
                            rows={3}
                            className="textarea-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Tags (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="dev, tools, reference"
                            className="input-field"
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-primary flex-1">
                            {editingBookmark ? 'Update Bookmark' : 'Add Bookmark'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
