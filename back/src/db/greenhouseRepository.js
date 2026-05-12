const pool = require('./pool');

async function insertMeasurement(data) {
  const query = `
    INSERT INTO greenhouse_measurements
    (entity, temperature, air_humidity, soil_moisture, light, wind, reservoir, pump, fan, vents, ts)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING id
  `;

  const values = [
    data.entity,
    data.temperature,
    data.airHumidity,
    data.soilMoisture,
    data.light,
    data.wind,
    data.reservoir,
    data.pump,
    data.fan,
    data.vents,
    data.ts
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

async function getLatest() {
  const result = await pool.query(
    `SELECT * FROM greenhouse_measurements ORDER BY ts DESC LIMIT 1`
  );
  return result.rows[0] || null;
}

async function getHistory(limit = 200) {
  const result = await pool.query(
    `SELECT * FROM greenhouse_measurements ORDER BY ts DESC LIMIT $1`,
    [limit]
  );
  return result.rows;
}

module.exports = {
  insertMeasurement,
  getLatest,
  getHistory
};