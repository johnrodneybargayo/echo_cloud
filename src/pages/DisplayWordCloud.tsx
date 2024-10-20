import React from 'react';
import WordCloudComponent from '../components/WordCloud';
import { useWords } from '../hooks/useWords';
import './DisplayWordCloud.css';

const DisplayWordCloud: React.FC = () => {
  const { words, loading } = useWords();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="wordcloud-container">
      <h1>Echo Cloud</h1>
      <WordCloudComponent words={words} />
    </div>
  );
};

export default DisplayWordCloud;
