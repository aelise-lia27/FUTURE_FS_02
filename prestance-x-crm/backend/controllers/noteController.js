const NoteModel = require('../models/noteModel');
const LeadModel = require('../models/leadModel');

// @route  GET /api/leads/:leadId/notes
// @access Private (admin, commercial)
const getNotesForLead = async (req, res, next) => {
  try {
    const lead = await LeadModel.findById(req.params.leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    const notes = await NoteModel.findByLeadId(req.params.leadId);
    res.status(200).json({ success: true, data: notes });
  } catch (error) {
    next(error);
  }
};

// @route  POST /api/leads/:leadId/notes
// @access Private (admin, commercial)
const addNote = async (req, res, next) => {
  try {
    const lead = await LeadModel.findById(req.params.leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    const note = await NoteModel.create({
      lead_id: req.params.leadId,
      author_id: req.user.id,
      content: req.body.content,
    });
    res.status(201).json({ success: true, message: 'Note added successfully', data: note });
  } catch (error) {
    next(error);
  }
};

// @route  DELETE /api/notes/:id
// @access Private/Admin only
const deleteNote = async (req, res, next) => {
  try {
    const deleted = await NoteModel.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.status(200).json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotesForLead, addNote, deleteNote };
