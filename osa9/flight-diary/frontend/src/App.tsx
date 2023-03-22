import axios from "axios";
import React, { useEffect, useState } from "react";
import NewDiaryEntryForm, { DiaryEntry } from "./diaryFrom";

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

type HeaderProps = {
  name: string;
};

type DiariesProps = {
  diaries: DiaryEntry[];
}
type DiaryProps = {
  diary: DiaryEntry;
}

const Header: React.FC<HeaderProps> = ({ name }) => {
  return <h2>{name}</h2>;
};

const Diary: React.FC<DiaryProps> = ({ diary }) => {
  return (
    <>
      <Header name={diary.date}/>
      <p>visiblity: {diary.visibility}</p>
      <p>weather: {diary.weather}</p>
    </>
  );
};

const Content: React.FC<DiariesProps> = ({ diaries }) => {
  return (
    <>
      {diaries.map((diary) => (
        <Diary key={diary.id} diary={diary}/>
      ))}
    </>
  );
};

type ErrorMessage = {
  errortext: string;
}

const ErrorHeader: React.FC<ErrorMessage> = ({ errortext }) => {
  return (
    <>
      <h2 style={{ color: 'red' }}>{errortext}</h2>
    </>
  );
};
const App: React.FC = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const todo = async () => {
      const response = await axios.get('http://localhost:3000/api/diaries');
      console.log(response);
      setDiaries(response.data);
    };
    todo();
  }, []);

  return (
    <>
      {error && <ErrorHeader errortext={error}/>}
      <Header name={'Add new entry'}/>
      <NewDiaryEntryForm diaries={diaries} setDiaries={setDiaries} setError={setError}/>
      <Header name={'Diary entries'}/>
      <Content diaries={diaries}/>
    </>
  );
};

export default App;