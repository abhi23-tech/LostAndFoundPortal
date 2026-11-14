require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Item = require('./models/Item');
const seed = require('./seed');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const wrap = fn => (req, res) => fn(req, res).catch(e => res.status(e.name === 'ValidationError' || e.name === 'CastError' ? 400 : 500).json({ error: e.message }));

// CREATE item
app.post('/api/items', wrap(async (req, res) => {
  const { claims, status, ...data } = req.body;          // clients cannot set these directly
  res.status(201).json(await Item.create(data));
}));

// READ list: search + filters
app.get('/api/items', wrap(async (req, res) => {
  const { q, type, category, status, sort: sortBy } = req.query;
  const f = {};
  if (type) f.type = type;
  if (category) f.category = category;
  if (status) f.status = status;
  if (q) {
    const rx = new RegExp(escapeRegex(q), 'i');
    f.$or = [{ title: rx }, { description: rx }, { location: rx }];
  }
  let sortQuery = { createdAt: -1 };
  if (sortBy === 'oldest') sortQuery = { createdAt: 1 };
  else if (sortBy === 'date_desc') sortQuery = { date: -1 };
  else if (sortBy === 'date_asc') sortQuery = { date: 1 };
  else if (sortBy === 'title') sortQuery = { title: 1 };
  res.json(await Item.find(f).sort(sortQuery));
}));

// READ one
app.get('/api/items/:id', wrap(async (req, res) => {
  const item = await Item.findById(req.params.id);
  item ? res.json(item) : res.status(404).json({ error: 'Item not found' });
}));

// UPDATE status (open / pending / returned)
app.patch('/api/items/:id/status', wrap(async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
  item ? res.json(item) : res.status(404).json({ error: 'Item not found' });
}));

// UPDATE: push an embedded claim ($push) and mark item as pending
app.post('/api/items/:id/claims', wrap(async (req, res) => {
  const item = await Item.findByIdAndUpdate(
    req.params.id,
    { $push: { claims: req.body }, $set: { status: 'pending' } },
    { new: true, runValidators: true });
  item ? res.status(201).json(item) : res.status(404).json({ error: 'Item not found' });
}));

// DELETE
app.delete('/api/items/:id', wrap(async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  item ? res.json({ message: 'Deleted' }) : res.status(404).json({ error: 'Item not found' });
}));

// AGGREGATION: dashboard numbers in one pipeline using $facet
app.get('/api/stats', wrap(async (_req, res) => {
  const [r] = await Item.aggregate([{
    $facet: {
      byType:     [{ $group: { _id: '$type', n: { $sum: 1 } } }],
      byStatus:   [{ $group: { _id: '$status', n: { $sum: 1 } } }],
      byCategory: [{ $group: { _id: '$category', n: { $sum: 1 } } }, { $sort: { n: -1 } }],
      hotspots:   [{ $group: { _id: '$location', n: { $sum: 1 } } }, { $sort: { n: -1 } }, { $limit: 3 }]
    }
  }]);
  res.json(r);
}));

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await seed();
    app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
  })
  .catch(e => { console.error('MongoDB connection failed:', e.message); process.exit(1); });
