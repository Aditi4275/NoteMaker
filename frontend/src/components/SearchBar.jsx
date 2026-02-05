'use client';

import { FiSearch, FiX } from 'react-icons/fi';

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
    return (
        <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="input-field pl-12 pr-10"
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                    <FiX className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}
