const service = require('../services/greenhouseService');

async function getLatest(req, res) {
  try {
    const data = await service.latest();
    res.json(data || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getHistory(req, res) {
  try {
    const limit = parseInt(req.query.limit || '200', 10);
    const data = await service.history(limit);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getLatest, getHistory };