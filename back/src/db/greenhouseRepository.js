// src/db/greenhouseRepository.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function insertMeasurement(data) {
  return await prisma.measurement.create({
    data: {
      entity: data.entity,
      temperature: data.temperature,
      airHumidity: data.airHumidity, // Mappe vers air_humidity [cite: 2]
      soilMoisture: data.soilMoisture,
      light: data.light,
      wind: data.wind, // [cite: 3]
      reservoir: data.reservoir,
      pump: data.pump, // [cite: 4]
      fan: data.fan, // [cite: 5]
      vents: data.vents,
      ts: data.ts ? new Date(data.ts) : new Date() // [cite: 6]
    }
  });
}

async function getLatest() {
  return await prisma.measurement.findFirst({
    orderBy: { ts: 'desc' }
  });
}

async function getHistory(limit = 200) {
  return await prisma.measurement.findMany({
    take: limit,
    orderBy: { ts: 'desc' }
  });
}

module.exports = { insertMeasurement, getLatest, getHistory };