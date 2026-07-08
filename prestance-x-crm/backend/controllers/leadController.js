const LeadModel = require('../models/leadModel');
const NoteModel = require('../models/noteModel');

// @route  GET /api/leads
// @access Private (admin, commercial)
const getLeads = async (req, res, next) => {
  try {
    const { status, lead_source, interested_product, search, page, limit } = req.query;
    const result = await LeadModel.findAll({ status, lead_source, interested_product, search, page, limit });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/leads/:id
// @access Private (admin, commercial)
const getLeadById = async (req, res, next) => {
  try {
    const lead = await LeadModel.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    const notes = await NoteModel.findByLeadId(req.params.id);
    res.status(200).json({ success: true, data: { ...lead, notes } });
  } catch (error) {
    next(error);
  }
};

// @route  POST /api/leads
// @access Private (admin, commercial)
// This endpoint is intentionally designed to also support a future public
// "website contact form" integration (see README) by keeping validation on
// core fields only and defaulting lead_source to 'Website'.
const createLead = async (req, res, next) => {
  try {
    const lead = await LeadModel.create({ ...req.body, created_by: req.user?.id || null });
    res.status(201).json({ success: true, message: 'Lead created successfully', data: lead });
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/leads/:id
// @access Private (admin, commercial)
const updateLead = async (req, res, next) => {
  try {
    const existing = await LeadModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    const updated = await LeadModel.update(req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Lead updated successfully', data: updated });
  } catch (error) {
    next(error);
  }
};

// @route  PATCH /api/leads/:id/status
// @access Private (admin, commercial)
const updateLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const updated = await LeadModel.updateStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.status(200).json({ success: true, message: 'Lead status updated', data: updated });
  } catch (error) {
    next(error);
  }
};

// @route  DELETE /api/leads/:id
// @access Private/Admin only
const deleteLead = async (req, res, next) => {
  try {
    const deleted = await LeadModel.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLeads, getLeadById, createLead, updateLead, updateLeadStatus, deleteLead };
