const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');

// @route  GET /api/users
// @access Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await UserModel.findAll();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/users/:id
// @access Private/Admin
const getUserById = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @route  POST /api/users
// @access Private/Admin
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await UserModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'A user with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserModel.create({ name, email, password: hashedPassword, role });
    res.status(201).json({ success: true, message: 'User created successfully', data: user });
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/users/:id
// @access Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const { name, email, role, is_active } = req.body;

    const existingUser = await UserModel.findById(req.params.id);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent admin from locking themselves out
    if (Number(req.params.id) === req.user.id && (role !== 'admin' || is_active === 0 || is_active === false)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot demote or deactivate your own account',
      });
    }

    const updated = await UserModel.update(req.params.id, {
      name: name ?? existingUser.name,
      email: email ?? existingUser.email,
      role: role ?? existingUser.role,
      is_active: is_active !== undefined ? is_active : existingUser.is_active,
    });

    res.status(200).json({ success: true, message: 'User updated successfully', data: updated });
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/users/:id/password
// @access Private/Admin
const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await UserModel.updatePassword(req.params.id, hashedPassword);
    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};

// @route  DELETE /api/users/:id
// @access Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    if (Number(req.params.id) === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }
    const deleted = await UserModel.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, resetPassword, deleteUser };
