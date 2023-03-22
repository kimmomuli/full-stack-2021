import { v1 as uuid } from 'uuid';
import { Patient, Entry } from '../types/types';
import { parseString, parseDate, parseGender, parseDiagnosisCodes, parseHealthCheckRating, parseDischarge, parseSickLeave } from './validation';
import patients from './../../data/patients';

const getPatients = () => {
  const patientData = patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
  return patientData;
};

const getPatient = (id: string) => {
  const patient = patients.find(patient => patient.id === id);
  return patient;
};

const addNewPatient = (name: unknown, dateOfBirth: unknown, ssn: unknown, gender: unknown, occupation: unknown): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    name: parseString(name),
    dateOfBirth: parseDate(dateOfBirth),
    ssn: parseString(ssn),
    gender: parseGender(gender),
    occupation: parseString(occupation),
    entries: []
  };

  patients.push(newPatient);
  return newPatient;
};

interface Discharge {
  date: unknown;
  criteria: unknown;
}

const addEntry = async (
  patientId: string,
  {
    type,
    description,
    date,
    specialist,
    diagnosisCodes,
    healthCheckRating,
    employerName,
    sickLeave,
    discharge
  } : { 
    type: unknown,
    description: unknown,
    date: unknown,
    specialist: unknown,
    diagnosisCodes?: unknown;
    healthCheckRating?: unknown;
    employerName?: unknown;
    sickLeave?: unknown;
    discharge?: Discharge; 
  }
) => {
  const patient = await getPatient(patientId);
  if (!patient) {
    throw new Error(`Patient with id ${patientId} not found`);
  }

  if (!type || !description || !date || !specialist) {
    throw new Error('Missing required fields');
  }

  let entry: Entry;
  switch (type) {
    case 'HealthCheck':
      if (!healthCheckRating) {
        throw new Error('Missing required fields');
      }
      entry = { 
        id: uuid(),
        type: "HealthCheck",
        description: parseString(description),
        date: parseDate(date),
        specialist: parseString(specialist),
        diagnosisCodes: parseDiagnosisCodes(diagnosisCodes),
        healthCheckRating: parseHealthCheckRating(healthCheckRating)
      };
      break;
    case 'Hospital':
      if (!discharge || !discharge.date || !discharge.criteria) {
        throw new Error('Missing required fields');
      }
      entry = {
        id: uuid(),
        type: 'Hospital',
        description: parseString(description),
        date: parseDate(date),
        specialist: parseString(specialist),
        diagnosisCodes: parseDiagnosisCodes(diagnosisCodes),
        discharge: parseDischarge(discharge)
      };
      break;
    case 'OccupationalHealthcare':
      if (!employerName) {
        throw new Error('Missing required fields');
      }
      entry = {
        id: uuid(),
        type: 'OccupationalHealthcare',
        description: parseString(description),
        date: parseDate(date),
        specialist: parseString(specialist),
        diagnosisCodes: parseDiagnosisCodes(diagnosisCodes),
        employerName: parseString(employerName),
        sickLeave: parseSickLeave(sickLeave)
      };
      break;
    default:
      throw new Error('Invalid entry type');
  }

  patient.entries.push(entry);
  return entry;
};

export default { addNewPatient, getPatients, getPatient, addEntry };