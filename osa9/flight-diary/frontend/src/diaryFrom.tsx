import axios from 'axios';
import { useState } from 'react';

export enum Weather {
  Sunny = 'sunny',
  Rainy = 'rainy',
  Cloudy = 'cloudy',
  Stormy = 'stormy',
  Windy = 'windy',
}

export enum Visibility {
  Great = 'great',
  Good = 'good',
  Ok = 'ok',
  Poor = 'poor',
}

export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment: string;
}

export type NewDiaryEntry = Omit<DiaryEntry, 'id'>;

export type NonSensitiveDiaryEntry = Omit<DiaryEntry, 'comment'>;

interface FormProps {
  diaries: DiaryEntry[];
  setDiaries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const NewDiaryEntryForm: React.FC<FormProps> = ({ diaries, setDiaries, setError }: FormProps) => {
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState(Weather.Sunny);
  const [visibility, setVisibility] = useState(Visibility.Great);
  const [comment, setComment] = useState('');

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    try {
      const newDiary = await axios.post<DiaryEntry>('http://localhost:3000/api/diaries', { date, weather, visibility, comment });
      setDiaries([...diaries, newDiary.data]);
      setDate('');
      setWeather(Weather.Sunny);
      setVisibility(Visibility.Great);
      setComment('');
      setError(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Date:
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <br />
        <label>
          Weather:
          <br />
          {Object.values(Weather).map((value) => (
            <label key={value}>
              <input
                type="radio"
                value={value}
                checked={weather === value}
                onChange={(event) => setWeather(event.target.value as Weather)}
              />
              {value}
            </label>
          ))}
        </label>
        <br />
        <label>
          Visibility:
          <br />
          {Object.values(Visibility).map((value) => (
            <label key={value}>
              <input
                type="radio"
                value={value}
                checked={visibility === value}
                onChange={(event) => setVisibility(event.target.value as Visibility)}
              />
              {value}
            </label>
          ))}
        </label>
        <br />
        <label>
          Comment:
          <textarea value={comment} onChange={(event) => setComment(event.target.value)} />
        </label>
        <br />
        <button type="submit">Add Diary Entry</button>
      </form>
    </div>
  );
};

export default NewDiaryEntryForm;
