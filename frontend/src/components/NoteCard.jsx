'use client';

import { FiStar, FiEdit2, FiTrash2, FiClock } from 'react-icons/fi';

export default function NoteCard({ note, onEdit, onDelete, onToggleFavorite }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="glass-card-hover p-5 group">
            <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-white truncate pr-4 flex-1">
                    {note.title}
                </h3>
                <button
                    onClick={() => onToggleFavorite(note)}
                    className={`favorite-btn ${note.isFavorite ? 'favorite-btn-active' : 'text-white/30'}`}
                >
                    <FiStar className={`w-5 h-5 ${note.isFavorite ? 'fill-current' : ''}`} />
                </button>
            </div>

            <p className="text-white/60 text-sm line-clamp-3 mb-4">
                {note.content}
            </p>

            {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                    {note.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag-chip text-xs">
                            {tag}
                        </span>
                    ))}
                    {note.tags.length > 3 && (
                        <span className="text-xs text-white/40">+{note.tags.length - 3} more</span>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div className="flex items-center text-white/40 text-xs">
                    <FiClock className="w-3 h-3 mr-1" />
                    {formatDate(note.createdAt)}
                </div>

                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(note)}
                        className="p-2 rounded-lg text-white/50 hover:text-primary-400 hover:bg-primary-500/10 transition-all"
                    >
                        <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(note)}
                        className="p-2 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <FiTrash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
