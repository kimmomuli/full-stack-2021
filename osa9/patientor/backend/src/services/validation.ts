import { Gender, Diagnose, HealthCheckRating } from "../types/types";

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (gender: any): gender is Gender => {
  return Object.values(Gender).includes(gender);
};

const parseString = (text: unknown): string => {
  if (!text || !isString(text)) {
    throw new Error('Incorrect or missing field');
  }
  return text;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing field');
  }
  return date;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing field: gender');
  }
  return gender;
};

const isArrayOfStrings = (arr: unknown): arr is Array<string> => {
  return Array.isArray(arr) && arr.every(item => isString(item));
};

const parseDiagnosisCodes = (codes: unknown): Array<Diagnose['code']> => {
  if (!codes || typeof codes !== 'object' || !('diagnosisCodes' in codes)) {
    return [] as Array<Diagnose['code']>;;
  }
  if (!isArrayOfStrings(codes)) {
    throw new Error('Incorrect field: diagnosisCodes');
  }

  return codes as Array<Diagnose['code']>;
};

const isHealthCheckRating = (rating: any): rating is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(rating);
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (!rating || !isHealthCheckRating(rating)) {
    throw new Error('Incorrect or missing field: healthCheckRating');
  }
  return rating;
};

interface Discharge {
  date: string;
  criteria: string;
}

const isDischarge = (discharge: any): discharge is Discharge => {
  return isDate(discharge.data) && isString(discharge.criteria);
};

const parseDischarge = (discharge: unknown): Discharge => {
  if (!discharge || typeof discharge !== 'object' || !isDischarge(discharge)) {
    throw new Error('Incorrect or missing field: discharge');
  }
  return discharge;
};

interface SickLeave {
  startDate: string;
  endDate: string;
}

const isSickLeave = (sickLeave: any): sickLeave is SickLeave => {
  return isDate(sickLeave.startDate) && isString(sickLeave.endDate);
};

const parseSickLeave = (sickLeave: unknown): SickLeave => {
  if (!sickLeave || typeof sickLeave !== 'object' || !isSickLeave(sickLeave)) {
    throw new Error('Incorrect or missing field: sickLeave');
  }
  return sickLeave;
};

export {
  parseString,
  parseDate,
  parseGender,
  parseDiagnosisCodes,
  parseHealthCheckRating,
  parseDischarge,
  parseSickLeave
};