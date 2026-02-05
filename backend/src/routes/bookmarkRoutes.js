/**
 * Bookmark Routes
 */

const express = require('express');
const router = express.Router();
const {
    createBookmark,
    getBookmarks,
    getBookmarkById,
    updateBookmark,
    deleteBookmark
} = require('../controllers/bookmarkController');
const {
    createBookmarkRules,
    updateBookmarkRules,
    idParamRules
} = require('../validators/bookmarkValidator');
const { protect } = require('../middleware/auth');

// All bookmark routes require authentication
router.use(protect);

router.route('/')
    .get(getBookmarks)
    .post(createBookmarkRules, createBookmark);

router.route('/:id')
    .get(idParamRules, getBookmarkById)
    .put(updateBookmarkRules, updateBookmark)
    .delete(idParamRules, deleteBookmark);

module.exports = router;

