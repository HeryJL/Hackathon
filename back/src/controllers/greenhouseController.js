const service = require('../services/greenhouseService');

async function getLatest(req, res) {
  const data = await service.latest();
  res.json(data || {});
}

async function getHistory(req, res) {
  const limit = parseInt(req.query.limit || '200', 10);
  const data = await service.history(limit);
  res.json(data);
}

module.exports = {
  getLatest,
  getHistory
};