import React from 'react';

interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDescription {
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartDescription {
  backroundMaterial: string;
  kind: "background"
}

interface CoursePartSpecial extends CoursePartDescription {
  requirements: string[];
  kind: "special";
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;


const courseParts: CoursePart[] = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is an awesome course part",
    kind: "basic"
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3,
    kind: "group"
  },
  {
    name: "Basics of type Narrowing",
    exerciseCount: 7,
    description: "How to go from unknown to string",
    kind: "basic"
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    backroundMaterial: "https://type-level-typescript.com/template-literal-types",
    kind: "background"
  },
  {
    name: "TypeScript in frontend",
    exerciseCount: 10,
    description: "a hard part",
    kind: "basic",
  },
  {
    name: "Backend development",
    exerciseCount: 21,
    description: "Typing the backend",
    requirements: ["nodejs", "jest"],
    kind: "special"
  }
];

type HeaderProps = {
  name: string;
};

type ContentProps = {
  courseParts: CoursePart[];
};

type TotalProps = {
  courseParts: CoursePart[];
};

type PartProps = {
  part: CoursePart;
}

const Header: React.FC<HeaderProps> = ({ name }) => {
  return <h1>{name}</h1>;
};

const Part: React.FC<PartProps> = ({ part }) => {
  switch (part.kind) {
    case "basic":
      return (
        <>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p>{part.description}</p>
        </>
      );
    case "group":
      return (
        <>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p>project exercises {part.groupProjectCount}</p>
        </>
      );
    case "background":
      return (
        <>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p>{part.description}</p>
          <p>background material: {part.backroundMaterial}</p>
        </>
      );
    case "special":
      return (
        <>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p>{part.description}</p>
          <p>required skills: {part.requirements.join(', ')}</p>
        </>
      );
    default:
      return null;
  }
};

const Content: React.FC<ContentProps> = ({ courseParts }) => {
  return (
    <>
      {courseParts.map((part) => (
        <Part key={part.name} part={part} />
      ))}
    </>
  );
};

const Total: React.FC<TotalProps> = ({ courseParts }) => {
  const total = courseParts.reduce(
    (sum, part) => sum + part.exerciseCount,
    0
  );
  return <p>Number of exercises {total}</p>;
};

const App: React.FC = () => {
  const courseName = 'Half Stack application development';
  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

export default App;