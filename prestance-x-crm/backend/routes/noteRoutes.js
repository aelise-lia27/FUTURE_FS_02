const express = require('express');
const { deleteNote } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

// Only Admin can delete notes
router.delete('/:id', authorize('admin'), deleteNote);

module.exports = router;
