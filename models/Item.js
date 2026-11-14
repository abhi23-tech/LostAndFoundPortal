const mongoose = require('mongoose');

// Embedded sub-document: a claim lives INSIDE the item document (no JOIN needed)
const claimSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  contact: { type: String, required: true, trim: true },
  message: { type: String, trim: true }
}, { timestamps: { createdAt: true, updatedAt: false } });

const itemSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true, maxlength: 80 },
  description: { type: String, trim: true, maxlength: 400 },
  type:        { type: String, enum: ['lost', 'found'], required: true },
  category:    { type: String, enum: ['Electronics', 'Books & Notes', 'ID & Cards', 'Clothing', 'Keys', 'Bags', 'Other'], default: 'Other' },
  location:    { type: String, required: true, trim: true },
  date:        { type: Date, default: Date.now },
  contactName: { type: String, required: true, trim: true },
  contact:     { type: String, required: true, trim: true },
  status:      { type: String, enum: ['open', 'pending', 'returned'], default: 'open' },
  claims:      [claimSchema]
}, { timestamps: true });

// Compound index to speed up the main list query (filter + newest first)
itemSchema.index({ type: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Item', itemSchema);
