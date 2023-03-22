import express from 'express';
import patientService from '../services/patientService';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const patientData = await patientService.getPatient(id);
  if (patientData) {
    res.json(patientData);
  } else {
    res.status(404).send('Patient not found');
  }
});

router.get('/', async (_req, res) => {
  const patientData = await patientService.getPatients();
  res.json(patientData);
});


router.post('/', async (req, res) => {
  try {
    const { name, dateOfBirth, ssn, gender, occupation } = req.body;
    const newPatient = patientService.addNewPatient(name, dateOfBirth, ssn, gender, occupation);
    res.json(newPatient);
  } catch (error) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});


router.post('/:id/entries', async (req, res) => {
  try {
    const id = req.params.id;
    const { type, description, date, specialist, diagnosisCodes, healthCheckRating, employerName, sickLeave, discharge } = req.body;

    const newEntry = await patientService.addEntry(id, { type, description, date, specialist, diagnosisCodes, healthCheckRating, employerName, sickLeave, discharge });

    res.json(newEntry);
  } catch (error) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;