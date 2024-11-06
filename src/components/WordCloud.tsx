import React, { useEffect, useRef, useState } from 'react';
import WordCloud from 'wordcloud';
import { Word } from '../types/word';
import { useNavigate } from 'react-router-dom';
import './WordCloud.css';
import Loader from './loader/Loader'; // Import the Loader component

interface WordCloudProps {
  words: Word[];
  questions: { id: string; text: string; type: 'wordCloud' | 'scaleMeter' }[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
}

const WordCloudComponent: React.FC<WordCloudProps> = ({
  words,
  questions,
  currentQuestionIndex,
  setCurrentQuestionIndex,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const questionText = questions[currentQuestionIndex]?.text || '';

  useEffect(() => {
    const canvas = canvasRef.current;

    const getColor = (index: number) => {
      const colors = ['#2C3E50', '#2980B9', '#27AE60', '#F39C12', '#E74C3C', '#8E44AD', '#D35400'];
      return colors[index % colors.length]; // Cycle through the colors
    };

    if (canvas && words.length > 0) {
      const wordArray: [string, number][] = words.map((word) => [word.word, word.count]);
      WordCloud(canvas, {
        list: wordArray,
        color: (word: string) => getColor(words.findIndex(w => w.word === word)),
        gridSize: Math.round(12 * (canvas.width / 800)),
        weightFactor: (size: number) => Math.max(size * (canvas.width / 800), 20),
        fontFamily: 'Arial, sans-serif',
        rotateRatio: 0.5,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        minSize: 12,
        scale: 'log',
      });
    }
  }, [words]);

  const handleNextButtonClick = () => {
    setIsAnimating(true);
    setIsLoading(true);
    
    let nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= questions.length) nextIndex = 0;

    const nextQuestionId = questions[nextIndex].id;
    setCurrentQuestionIndex(nextIndex);

    setTimeout(() => {
      navigate(`/enter/${nextQuestionId}`, {
        state: {
          questions,
          currentQuestionIndex: nextIndex,
        },
      });
      setIsAnimating(false);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="word-cloud-wrapper">
      <h2 className="question-text">{questionText}</h2>
      {isLoading && <Loader />}
      {!isLoading && words.length === 0 && (
        <div className="no-words-container">
          <h3>No words available. Please input words to see them in the cloud.</h3>
        </div>
      )}
      {!isLoading && words.length > 0 && (
        <canvas ref={canvasRef} className={`word-cloud-canvas ${isAnimating ? 'animate' : ''}`}></canvas>
      )}
      <button className="navigate-btn" onClick={handleNextButtonClick}>
        Next
      </button>
    </div>
  );
};

export default WordCloudComponent;
