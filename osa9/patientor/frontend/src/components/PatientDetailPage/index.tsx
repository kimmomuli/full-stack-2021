import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import patientService from "../../services/patients";
import diagnosisService from "../../services/diagnosis";
import { Gender, Patient, Diagnosis, Entry, HealthCheckEntry, OccupationalHealthcareEntry, HospitalEntry } from '../../types';
import { Person, Female, Male, MedicalServices, Favorite, Work, LocalHospital } from '@mui/icons-material';

const HospitalEntryComponenet: React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
  return (
    <div style={{ border: '1px solid black', borderRadius: '10px', padding: '5px', marginBottom: '10px' }}>
      <p>{entry.date} <LocalHospital/></p>
      <p>{entry.description}</p>
      <p>
        discharge: {entry.discharge.date}
        <br />
        criteria: {entry.discharge.criteria}
      </p>
      <p>diagnose by {entry.specialist}</p>
    </div>
  );
};

const HealthCheckEntryComponenet: React.FC<{ entry: HealthCheckEntry }> = ({ entry }) => {
  return (
    <div style={{ border: '1px solid black', borderRadius: '10px', padding: '5px', marginBottom: '10px' }}>
      <p>{entry.date} <MedicalServices/></p>
      <p>{entry.description}</p>
      {entry.healthCheckRating === 0 
        ? <Favorite style={{ color: 'green' }} /> 
        : entry.healthCheckRating === 1
          ? <Favorite style={{ color: 'yellow' }} /> 
          :entry.healthCheckRating === 2
            ? <Favorite style={{ color: 'orange' }} /> 
            : <Favorite style={{ color: 'black' }} /> 
        }
      <p>diagnose by {entry.specialist}</p>
    </div>
  );
};

const OccupationalHealthcareEntryComponenet: React.FC<{ entry: OccupationalHealthcareEntry }> = ({ entry }) => {
  return (
    <div style={{ border: '1px solid black', borderRadius: '10px', padding: '5px', marginBottom: '10px' }}>
      <p>{entry.date} <Work/></p>
      <p>{entry.description}</p>
      <p>diagnose by {entry.specialist}</p>
    </div>
  );
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryComponenet entry={entry}/>;
    case "HealthCheck":
      return <HealthCheckEntryComponenet entry={entry}/>;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntryComponenet entry={entry}/>;
    default:
      return <>{entry}</>;
  }
};

const PatientDetailPage: React.FC = () => {
  const id = useParams().id;

  const [patient, setPatient] = useState<Patient>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>();

  useEffect(() => {
    const getPatient = async () => {
      if (id) {
        const p = await patientService.getPatientById(id);
        if (p) {
          setPatient(p);
        }
      };
    };
    getPatient();
  }, [id])

  useEffect(() => {
    const getDiagnosis = async () => {
      const d = await diagnosisService.getAll();
      if (d) {
        setDiagnoses(d);
      }
    };
    getDiagnosis();
  }, []);

  if (!patient) {
    return null;
  }

  const genderIcon = patient.gender === Gender.Male ? <Male /> :
  patient.gender === Gender.Female ? <Female /> : <Person />;

  return (
    <>
      <div>
        <h2>{patient.name}{genderIcon}</h2>
      </div>
      <p>
        ssh: {patient.ssn}
        <br />
        occupation: {patient.occupation}
      </p>
      {patient.entries.length > 0 ? <h3>entries</h3> : null}
      <div>{patient.entries.map((e) => <EntryDetails key={e.id} entry={e} />)}</div>
    </>
  );
};

export default PatientDetailPage;

