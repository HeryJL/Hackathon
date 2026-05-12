const repo = require('../db/greenhouseRepository');

module.exports = {
  ingestMeasurement: (data) => repo.insertMeasurement(data),
  latest: () => repo.getLatest(),
  history: (limit) => repo.getHistory(limit)
};