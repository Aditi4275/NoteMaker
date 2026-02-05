'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FiPlus, FiFileText, FiStar } from 'react-icons/fi';
import { notesApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import NoteCard from '@/components/NoteCard';
import SearchBar from '@/components/SearchBar';
import TagFilter from '@/components/TagFilter';
import Modal from '@/components/Modal';

export default function NotesPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [showFavorites, setShowFavorites] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
    });

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    // Fetch notes
    const fetchNotes = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const params = {};
            if (searchQuery) params.q = searchQuery;
            if (selectedTags.length > 0) params.tags = selectedTags.join(',');
            if (showFavorites) params.favorite = 'true';

            const response = await notesApi.getAll(params);
            setNotes(response.data.data || []);
        } catch (error) {
            console.error('Error fetching notes:', error);
            if (error.response?.status !== 401) {
                toast.error('Failed to fetch notes');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotes();
        }
    }, [searchQuery, selectedTags, showFavorites, user]);

    // Get all unique tags
    const allTags = useMemo(() => {
        const tagSet = new Set();
        notes.forEach(note => {
            note.tags?.forEach(tag => tagSet.add(tag));
        });
        return Array.from(tagSet).sort();
    }, [notes]);

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
        setEditingNote(null);
        setFormData({ title: '', content: '', tags: '' });
        setIsModalOpen(true);
    };

    // Open modal for edit
    const handleEdit = (note) => {
        setEditingNote(note);
        setFormData({
            title: note.title,
            content: note.content,
            tags: note.tags?.join(', ') || '',
        });
        setIsModalOpen(true);
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.content.trim()) {
            toast.error('Title and content are required');
            return;
        }

        const noteData = {
            title: formData.title.trim(),
            content: formData.content.trim(),
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        };

        try {
            if (editingNote) {
                await notesApi.update(editingNote._id, noteData);
                toast.success('Note updated successfully');
            } else {
                await notesApi.create(noteData);
                toast.success('Note created successfully');
            }
            setIsModalOpen(false);
            fetchNotes();
        } catch (error) {
            console.error('Error saving note:', error);
            toast.error(error.response?.data?.message || 'Failed to save note');
        }
    };

    // Handle delete
    const handleDelete = async (note) => {
        if (!confirm('Are you sure you want to delete this note?')) return;

        try {
            await notesApi.delete(note._id);
            toast.success('Note deleted successfully');
            fetchNotes();
        } catch (error) {
            console.error('Error deleting note:', error);
            toast.error('Failed to delete note');
        }
    };

    // Handle toggle favorite
    const handleToggleFavorite = async (note) => {
        try {
            await notesApi.update(note._id, { isFavorite: !note.isFavorite });
            fetchNotes();
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
                        <FiFileText className="text-primary-400" />
                        My Notes
                    </h1>
                    <p className="text-white/60 mt-1">
                        {notes.length} note{notes.length !== 1 ? 's' : ''} saved
                    </p>
                </div>
                <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
                    <FiPlus className="w-5 h-5" />
                    New Note
                </button>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Search notes..."
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

            {/* Notes Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
                </div>
            ) : notes.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <FiFileText className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No notes found</h3>
                    <p className="text-white/60 mb-6">
                        {searchQuery || selectedTags.length > 0 || showFavorites
                            ? 'Try adjusting your filters'
                            : 'Create your first note to get started'}
                    </p>
                    {!searchQuery && selectedTags.length === 0 && !showFavorites && (
                        <button onClick={handleCreate} className="btn-primary">
                            Create Note
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notes.map(note => (
                        <NoteCard
                            key={note._id}
                            note={note}
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
                title={editingNote ? 'Edit Note' : 'Create Note'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Note title"
                            className="input-field"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Content
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Write your note..."
                            rows={5}
                            className="textarea-field"
                            required
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
                            placeholder="work, personal, ideas"
                            className="input-field"
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-primary flex-1">
                            {editingNote ? 'Update Note' : 'Create Note'}
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
