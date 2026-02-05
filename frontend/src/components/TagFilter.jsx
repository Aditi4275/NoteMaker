'use client';

export default function TagFilter({ tags, selectedTags, onTagToggle }) {
    if (!tags || tags.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
                <button
                    key={tag}
                    onClick={() => onTagToggle(tag)}
                    className={selectedTags.includes(tag) ? 'tag-chip-active' : 'tag-chip'}
                >
                    {tag}
                </button>
            ))}
        </div>
    );
}
