const db = require('../config/db');

const LeadModel = {
  async findAll({ status, lead_source, interested_product, search, page = 1, limit = 20 } = {}) {
    let query = `
      SELECT l.*, u.name AS assigned_to_name, c.name AS created_by_name
      FROM leads l
      LEFT JOIN users u ON l.assigned_to = u.id
      LEFT JOIN users c ON l.created_by = c.id
      WHERE 1 = 1
    `;
    const params = [];

    if (status) {
      query += ' AND l.status = ?';
      params.push(status);
    }
    if (lead_source) {
      query += ' AND l.lead_source = ?';
      params.push(lead_source);
    }
    if (interested_product) {
      query += ' AND l.interested_product = ?';
      params.push(interested_product);
    }
    if (search) {
      query += ` AND (l.first_name LIKE ? OR l.last_name LIKE ? OR l.phone LIKE ? OR l.email LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    query += ' ORDER BY l.created_at DESC';

    const safeLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
    const safePage = Math.max(parseInt(page) || 1, 1);
    const offset = (safePage - 1) * safeLimit;
    query += ` LIMIT ${safeLimit} OFFSET ${offset}`;

    const [rows] = await db.query(query, params);

    // Count total (for pagination)
    let countQuery = 'SELECT COUNT(*) AS total FROM leads l WHERE 1 = 1';
    const countParams = [];
    if (status) {
      countQuery += ' AND l.status = ?';
      countParams.push(status);
    }
    if (lead_source) {
      countQuery += ' AND l.lead_source = ?';
      countParams.push(lead_source);
    }
    if (interested_product) {
      countQuery += ' AND l.interested_product = ?';
      countParams.push(interested_product);
    }
    if (search) {
      countQuery += ' AND (l.first_name LIKE ? OR l.last_name LIKE ? OR l.phone LIKE ? OR l.email LIKE ?)';
      const s = `%${search}%`;
      countParams.push(s, s, s, s);
    }
    const [countRows] = await db.query(countQuery, countParams);

    return {
      data: rows,
      pagination: {
        total: countRows[0].total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(countRows[0].total / safeLimit),
      },
    };
  },

  async findById(id) {
    const [rows] = await db.query(
      `SELECT l.*, u.name AS assigned_to_name, c.name AS created_by_name
       FROM leads l
       LEFT JOIN users u ON l.assigned_to = u.id
       LEFT JOIN users c ON l.created_by = c.id
       WHERE l.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async create(data) {
    const {
      first_name,
      last_name,
      phone,
      email,
      city,
      interested_product,
      message,
      lead_source,
      status,
      assigned_to,
      created_by,
    } = data;

    const [result] = await db.query(
      `INSERT INTO leads
        (first_name, last_name, phone, email, city, interested_product, message, lead_source, status, assigned_to, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        first_name,
        last_name,
        phone,
        email || null,
        city || null,
        interested_product,
        message || null,
        lead_source || 'Website',
        status || 'New',
        assigned_to || null,
        created_by || null,
      ]
    );
    return this.findById(result.insertId);
  },

  async update(id, data) {
    const {
      first_name,
      last_name,
      phone,
      email,
      city,
      interested_product,
      message,
      lead_source,
      status,
      assigned_to,
    } = data;

    const [result] = await db.query(
      `UPDATE leads SET
        first_name = ?, last_name = ?, phone = ?, email = ?, city = ?,
        interested_product = ?, message = ?, lead_source = ?, status = ?, assigned_to = ?
       WHERE id = ?`,
      [
        first_name,
        last_name,
        phone,
        email || null,
        city || null,
        interested_product,
        message || null,
        lead_source,
        status,
        assigned_to || null,
        id,
      ]
    );
    if (result.affectedRows === 0) return null;
    return this.findById(id);
  },

  async updateStatus(id, status) {
    const [result] = await db.query('UPDATE leads SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) return null;
    return this.findById(id);
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM leads WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  async getStats() {
    const [[totals]] = await db.query(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'New' THEN 1 ELSE 0 END) AS new_leads,
        SUM(CASE WHEN status = 'Contacted' THEN 1 ELSE 0 END) AS contacted_leads,
        SUM(CASE WHEN status = 'Converted' THEN 1 ELSE 0 END) AS converted_leads
      FROM leads
    `);

    const [recent] = await db.query(`
      SELECT id, first_name, last_name, phone, interested_product, status, lead_source, created_at
      FROM leads
      ORDER BY created_at DESC
      LIMIT 5
    `);

    const [bySource] = await db.query(`
      SELECT lead_source, COUNT(*) AS count
      FROM leads
      GROUP BY lead_source
    `);

    const [byProduct] = await db.query(`
      SELECT interested_product, COUNT(*) AS count
      FROM leads
      GROUP BY interested_product
    `);

    return {
      total: Number(totals.total) || 0,
      new: Number(totals.new_leads) || 0,
      contacted: Number(totals.contacted_leads) || 0,
      converted: Number(totals.converted_leads) || 0,
      recentLeads: recent,
      bySource,
      byProduct,
    };
  },
};

module.exports = LeadModel;
