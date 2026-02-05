/**
 * Bookmark Controller
 * Handles CRUD operations for bookmarks
 */

const store = require('../data/store');
const { generateId } = require('../utils/helpers');
const { ApiError } = require('../middleware/errorHandler');
const asyncHandler = require('../middleware/asyncHandler');
const fetchMetadata = require('../utils/fetchMetadata');

/**
 * @desc    Create a new bookmark
 * @route   POST /api/bookmarks
 * @access  Public
 */
const createBookmark = asyncHandler(async (req, res) => {
    let { url, title, description, tags, isFavorite } = req.body;

    // Auto-fetch title if not provided
    if (!title || title.trim() === '') {
        title = await fetchMetadata(url) || url;
    }

    const bookmark = {
        _id: generateId(),
        url: url.trim(),
        title: title.trim(),
        description: description ? description.trim() : '',
        tags: Array.isArray(tags) ? tags.map(t => t.toLowerCase().trim()) : [],
        isFavorite: Boolean(isFavorite),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    store.bookmarks.unshift(bookmark);

    res.status(201).json({
        success: true,
        data: bookmark
    });
});

/**
 * @desc    Get all bookmarks with optional filtering
 * @route   GET /api/bookmarks
 * @access  Public
 */
const getBookmarks = asyncHandler(async (req, res) => {
    const { q, tags, favorite } = req.query;
    let results = [...store.bookmarks];

    // Search by query text
    if (q) {
        const query = q.toLowerCase();
        results = results.filter(bookmark =>
            bookmark.title.toLowerCase().includes(query) ||
            bookmark.description.toLowerCase().includes(query) ||
            bookmark.url.toLowerCase().includes(query)
        );
    }

    // Filter by tags
    if (tags) {
        const tagArray = tags.split(',').map(t => t.trim().toLowerCase());
        results = results.filter(bookmark =>
            bookmark.tags.some(t => tagArray.includes(t.toLowerCase()))
        );
    }

    // Filter by favorites
    if (favorite === 'true') {
        results = results.filter(bookmark => bookmark.isFavorite);
    }

    res.status(200).json({
        success: true,
        count: results.length,
        data: results
    });
});

/**
 * @desc    Get single bookmark by ID
 * @route   GET /api/bookmarks/:id
 * @access  Public
 */
const getBookmarkById = asyncHandler(async (req, res) => {
    const bookmark = store.bookmarks.find(b => b._id === req.params.id);

    if (!bookmark) {
        throw ApiError.notFound('Bookmark not found');
    }

    res.status(200).json({
        success: true,
        data: bookmark
    });
});

/**
 * @desc    Update bookmark
 * @route   PUT /api/bookmarks/:id
 * @access  Public
 */
const updateBookmark = asyncHandler(async (req, res) => {
    const index = store.bookmarks.findIndex(b => b._id === req.params.id);

    if (index === -1) {
        throw ApiError.notFound('Bookmark not found');
    }

    const { url, title, description, tags, isFavorite } = req.body;
    const existingBookmark = store.bookmarks[index];

    store.bookmarks[index] = {
        ...existingBookmark,
        url: url !== undefined ? url.trim() : existingBookmark.url,
        title: title !== undefined ? title.trim() : existingBookmark.title,
        description: description !== undefined ? description.trim() : existingBookmark.description,
        tags: tags !== undefined ? tags.map(t => t.toLowerCase().trim()) : existingBookmark.tags,
        isFavorite: isFavorite !== undefined ? Boolean(isFavorite) : existingBookmark.isFavorite,
        updatedAt: new Date().toISOString()
    };

    res.status(200).json({
        success: true,
        data: store.bookmarks[index]
    });
});

/**
 * @desc    Delete bookmark
 * @route   DELETE /api/bookmarks/:id
 * @access  Public
 */
const deleteBookmark = asyncHandler(async (req, res) => {
    const index = store.bookmarks.findIndex(b => b._id === req.params.id);

    if (index === -1) {
        throw ApiError.notFound('Bookmark not found');
    }

    store.bookmarks.splice(index, 1);

    res.status(200).json({
        success: true,
        message: 'Bookmark deleted successfully'
    });
});

module.exports = {
    createBookmark,
    getBookmarks,
    getBookmarkById,
    updateBookmark,
    deleteBookmark
};
