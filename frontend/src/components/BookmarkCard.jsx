'use client';

import { FiStar, FiEdit2, FiTrash2, FiExternalLink, FiClock } from 'react-icons/fi';

export default function BookmarkCard({ bookmark, onEdit, onDelete, onToggleFavorite }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getDomain = (url) => {
        try {
            const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
            return urlObj.hostname.replace('www.', '');
        } catch {
            return url;
        }
    };

    return (
        <div className="glass-card-hover p-5 group">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white truncate pr-4">
                        {bookmark.title || bookmark.url}
                    </h3>
                    <a
                        href={bookmark.url.startsWith('http') ? bookmark.url : `https://${bookmark.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary-400 hover:text-primary-300 text-sm mt-1 transition-colors group/link"
                    >
                        <span className="truncate">{getDomain(bookmark.url)}</span>
                        <FiExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                </div>
                <button
                    onClick={() => onToggleFavorite(bookmark)}
                    className={`favorite-btn flex-shrink-0 ${bookmark.isFavorite ? 'favorite-btn-active' : 'text-white/30'}`}
                >
                    <FiStar className={`w-5 h-5 ${bookmark.isFavorite ? 'fill-current' : ''}`} />
                </button>
            </div>

            {bookmark.description && (
                <p className="text-white/60 text-sm line-clamp-2 mb-4">
                    {bookmark.description}
                </p>
            )}

            {bookmark.tags && bookmark.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                    {bookmark.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag-chip text-xs">
                            {tag}
                        </span>
                    ))}
                    {bookmark.tags.length > 3 && (
                        <span className="text-xs text-white/40">+{bookmark.tags.length - 3} more</span>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div className="flex items-center text-white/40 text-xs">
                    <FiClock className="w-3 h-3 mr-1" />
                    {formatDate(bookmark.createdAt)}
                </div>

                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(bookmark)}
                        className="p-2 rounded-lg text-white/50 hover:text-primary-400 hover:bg-primary-500/10 transition-all"
                    >
                        <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(bookmark)}
                        className="p-2 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <FiTrash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
