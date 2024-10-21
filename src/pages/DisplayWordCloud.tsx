import React from 'react';
import WordCloudComponent from '../components/WordCloud';
import { useWords } from '../hooks/useWords';


const DisplayWordCloud: React.FC = () => {
  const { words, loading } = useWords();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="wordcloud-container">
      <WordCloudComponent words={words} />
    </div>
  );
};

export default DisplayWordCloud;
