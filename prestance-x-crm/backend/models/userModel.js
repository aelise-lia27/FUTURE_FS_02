const db = require('../config/db');

const SAFE_FIELDS = 'id, name, email, role, is_active, created_at, updated_at';

const UserModel = {
  async findAll() {
    const [rows] = await db.query(
      `SELECT ${SAFE_FIELDS} FROM users ORDER BY created_at DESC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(
      `SELECT ${SAFE_FIELDS} FROM users WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async create({ name, email, password, role }) {
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role || 'commercial']
    );
    return this.findById(result.insertId);
  },

  async update(id, { name, email, role, is_active }) {
    const [result] = await db.query(
      'UPDATE users SET name = ?, email = ?, role = ?, is_active = ? WHERE id = ?',
      [name, email, role, is_active, id]
    );
    if (result.affectedRows === 0) return null;
    return this.findById(id);
  },

  async updatePassword(id, hashedPassword) {
    const [result] = await db.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = UserModel;
