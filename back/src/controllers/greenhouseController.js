import { getLatestMeasurement, getMeasurementsHistory } from '../services/greenhouseService.js';

export async function getLatest(req, res) {
  try {
    const data = await getLatestMeasurement();
    res.json(data || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getHistory(req, res) {
  try {
    const limit = parseInt(req.query.limit || '200', 10);
    const data = await getMeasurementsHistory(limit);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}