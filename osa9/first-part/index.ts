import expresss from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './pruitCalculator';
const app = expresss();
app.use(expresss.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight)) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const bmiResult = calculateBmi(height, weight);

  return res.json({ weight, height, bmi: bmiResult });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;
  
  if (!daily_exercises || !target) {
    return res.status(400).json({ error: 'parameters missing' });
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  if (!Array.isArray(daily_exercises) || isNaN(target)) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const exerciseHours = daily_exercises.map(Number);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = calculateExercises(exerciseHours, target);

  return res.json(result);
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});