interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (exerciseHours: number[], target: number): Result => {
  const periodLength = exerciseHours.length;
  const trainingDays = exerciseHours.filter(hours => hours > 0).length;
  const totalHours = exerciseHours.reduce((acc, curr) => acc + curr, 0);
  const average = totalHours / periodLength;
  const success = average >= target;
  const rating = success 
    ? 3 
    : average >= (target - 1) 
      ? 2 
      : 1;
  const ratingDescription = rating === 3 ? 'great job!' :
                             rating === 2 ? 'not too bad but could be better' :
                                           'you need to do better';
  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

const parseExerciseArguments = (
  args: string[]
): { 
  target: number,
  hours: number[]
} => {
  if (args.length < 4) throw new Error('Not enough arguments');
  const [target, ...hours] = args.slice(2).map(Number);
  if (isNaN(target) || hours.some(isNaN)) {
    throw new Error('Provided values were not numbers!');
  }
  return {
    target,
    hours
  };
};

try {
  const { target, hours } = parseExerciseArguments(process.argv);
  console.log(calculateExercises(hours, target));
} catch (e) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  console.log('Error:', e.message);
}

export { calculateExercises };

// console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));