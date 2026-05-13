// src/services/greenhouseService.js
import { insertMeasurement, getLatest, getHistory } from '../db/greenhouseRepository.js';

export const ingestMeasurement = async (data) => {
  await insertMeasurement(data);
};

export const getLatestMeasurement = async () => {
  return await getLatest();
};

export const getMeasurementsHistory = async (limit) => {
  return await getHistory(limit);
};