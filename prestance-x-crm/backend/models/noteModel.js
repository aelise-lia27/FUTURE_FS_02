const db = require('../config/db');

const NoteModel = {
  async findByLeadId(leadId) {
    const [rows] = await db.query(
      `SELECT n.*, u.name AS author_name
       FROM notes n
       LEFT JOIN users u ON n.author_id = u.id
       WHERE n.lead_id = ?
       ORDER BY n.created_at DESC`,
      [leadId]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(
      `SELECT n.*, u.name AS author_name FROM notes n LEFT JOIN users u ON n.author_id = u.id WHERE n.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async create({ lead_id, author_id, content }) {
    const [result] = await db.query(
      'INSERT INTO notes (lead_id, author_id, content) VALUES (?, ?, ?)',
      [lead_id, author_id || null, content]
    );
    return this.findById(result.insertId);
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM notes WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = NoteModel;
