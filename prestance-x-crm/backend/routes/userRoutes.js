const express = require('express');
const { body } = require('express-validator');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  resetPassword,
  deleteUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validateMiddleware');

const router = express.Router();

// All user-management routes are Admin-only
router.use(protect, authorize('admin'));

router.get('/', getUsers);
router.get('/:id', getUserById);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['admin', 'commercial']).withMessage('Role must be admin or commercial'),
  ],
  validate,
  createUser
);

router.put(
  '/:id',
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('A valid email is required'),
    body('role').optional().isIn(['admin', 'commercial']).withMessage('Role must be admin or commercial'),
  ],
  validate,
  updateUser
);

router.put(
  '/:id/password',
  [body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')],
  validate,
  resetPassword
);

router.delete('/:id', deleteUser);

module.exports = router;
