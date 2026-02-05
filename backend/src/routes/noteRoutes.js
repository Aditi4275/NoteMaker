/**
 * Note Routes
 */

const express = require('express');
const router = express.Router();
const {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote
} = require('../controllers/noteController');
const {
    createNoteRules,
    updateNoteRules,
    idParamRules
} = require('../validators/noteValidator');
const { protect } = require('../middleware/auth');

// All note routes require authentication
router.use(protect);

router.route('/')
    .get(getNotes)
    .post(createNoteRules, createNote);

router.route('/:id')
    .get(idParamRules, getNoteById)
    .put(updateNoteRules, updateNote)
    .delete(idParamRules, deleteNote);

module.exports = router;

