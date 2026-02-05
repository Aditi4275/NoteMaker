/**
 * Note Controller
 * Handles CRUD operations for notes
 */

const store = require('../data/store');
const { generateId } = require('../utils/helpers');
const { ApiError } = require('../middleware/errorHandler');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Create a new note
 * @route   POST /api/notes
 * @access  Public
 */
const createNote = asyncHandler(async (req, res) => {
    const { title, content, tags, isFavorite } = req.body;

    const note = {
        _id: generateId(),
        title: title.trim(),
        content: content.trim(),
        tags: Array.isArray(tags) ? tags.map(t => t.toLowerCase().trim()) : [],
        isFavorite: Boolean(isFavorite),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    store.notes.unshift(note);

    res.status(201).json({
        success: true,
        data: note
    });
});

/**
 * @desc    Get all notes with optional filtering
 * @route   GET /api/notes
 * @access  Public
 */
const getNotes = asyncHandler(async (req, res) => {
    const { q, tags, favorite } = req.query;
    let results = [...store.notes];

    // Search by query text
    if (q) {
        const query = q.toLowerCase();
        results = results.filter(note =>
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query)
        );
    }

    // Filter by tags
    if (tags) {
        const tagArray = tags.split(',').map(t => t.trim().toLowerCase());
        results = results.filter(note =>
            note.tags.some(t => tagArray.includes(t.toLowerCase()))
        );
    }

    // Filter by favorites
    if (favorite === 'true') {
        results = results.filter(note => note.isFavorite);
    }

    res.status(200).json({
        success: true,
        count: results.length,
        data: results
    });
});

/**
 * @desc    Get single note by ID
 * @route   GET /api/notes/:id
 * @access  Public
 */
const getNoteById = asyncHandler(async (req, res) => {
    const note = store.notes.find(n => n._id === req.params.id);

    if (!note) {
        throw ApiError.notFound('Note not found');
    }

    res.status(200).json({
        success: true,
        data: note
    });
});

/**
 * @desc    Update note
 * @route   PUT /api/notes/:id
 * @access  Public
 */
const updateNote = asyncHandler(async (req, res) => {
    const index = store.notes.findIndex(n => n._id === req.params.id);

    if (index === -1) {
        throw ApiError.notFound('Note not found');
    }

    const { title, content, tags, isFavorite } = req.body;
    const existingNote = store.notes[index];

    store.notes[index] = {
        ...existingNote,
        title: title !== undefined ? title.trim() : existingNote.title,
        content: content !== undefined ? content.trim() : existingNote.content,
        tags: tags !== undefined ? tags.map(t => t.toLowerCase().trim()) : existingNote.tags,
        isFavorite: isFavorite !== undefined ? Boolean(isFavorite) : existingNote.isFavorite,
        updatedAt: new Date().toISOString()
    };

    res.status(200).json({
        success: true,
        data: store.notes[index]
    });
});

/**
 * @desc    Delete note
 * @route   DELETE /api/notes/:id
 * @access  Public
 */
const deleteNote = asyncHandler(async (req, res) => {
    const index = store.notes.findIndex(n => n._id === req.params.id);

    if (index === -1) {
        throw ApiError.notFound('Note not found');
    }

    store.notes.splice(index, 1);

    res.status(200).json({
        success: true,
        message: 'Note deleted successfully'
    });
});

module.exports = {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote
};
