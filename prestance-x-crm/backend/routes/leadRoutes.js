const express = require('express');
const { body } = require('express-validator');
const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
} = require('../controllers/leadController');
const { getNotesForLead, addNote } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validateMiddleware');

const router = express.Router();

const PRODUCTS = ['Shirts', 'Pants', 'Cardigans', 'Jackets', 'Ties', 'Shoes'];
const SOURCES = ['WhatsApp', 'Facebook', 'Instagram', 'Website', 'Referral', 'Walk-in'];
const STATUSES = ['New', 'Contacted', 'Converted'];

const leadValidationRules = [
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Email must be valid'),
  body('interested_product').isIn(PRODUCTS).withMessage(`Product must be one of: ${PRODUCTS.join(', ')}`),
  body('lead_source').optional().isIn(SOURCES).withMessage(`Source must be one of: ${SOURCES.join(', ')}`),
  body('status').optional().isIn(STATUSES).withMessage(`Status must be one of: ${STATUSES.join(', ')}`),
];

// All lead routes require authentication
router.use(protect);

router.get('/', getLeads);
router.get('/:id', getLeadById);

router.post('/', leadValidationRules, validate, createLead);
router.put('/:id', leadValidationRules, validate, updateLead);

router.patch(
  '/:id/status',
  [body('status').isIn(STATUSES).withMessage(`Status must be one of: ${STATUSES.join(', ')}`)],
  validate,
  updateLeadStatus
);

// Delete leads: Admin only
router.delete('/:id', authorize('admin'), deleteLead);

// Nested notes routes: /api/leads/:leadId/notes
router.get('/:leadId/notes', getNotesForLead);
router.post(
  '/:leadId/notes',
  [body('content').trim().notEmpty().withMessage('Note content is required')],
  validate,
  addNote
);

module.exports = router;
