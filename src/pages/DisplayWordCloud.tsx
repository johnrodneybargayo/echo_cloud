// src/pages/DisplayWordCloud.tsx
import React from 'react';
import WordCloudComponent from '../components/WordCloud';
import { useWords } from '../hooks/useWords';

const DisplayWordCloud = () => {
  const { words, loading } = useWords();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Echo Cloud</h1>
      <WordCloudComponent words={words} />
    </div>
  );
};

export default DisplayWordCloud;
