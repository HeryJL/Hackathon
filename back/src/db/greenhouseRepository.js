// src/db/greenhouseRepository.js
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export async function insertMeasurement(data) {
  return await prisma.measurement.create({
    data: {
      entity: data.entity,
      temperature: data.temperature,
      airHumidity: data.airHumidity,
      soilMoisture: data.soilMoisture,
      light: data.light,
      wind: data.wind,
      reservoir: data.reservoir,
      pump: data.pump,
      fan: data.fan,
      vents: data.vents,
      ts: data.ts ? new Date(data.ts) : new Date()
    }
  });
}

export  async function getLatest() {
  return await prisma.measurement.findFirst({
    orderBy: { ts: 'desc' }
  });
}

export async function getHistory(limit = 200) {
  return await prisma.measurement.findMany({
    take: limit,
    orderBy: { ts: 'desc' }
  });
}

