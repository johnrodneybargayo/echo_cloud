import React, { useEffect, useRef } from 'react';
import WordCloud from 'wordcloud';
import { Word } from '../types/word';
import { useNavigate } from 'react-router-dom';
import './WordCloud.css';

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && words.length > 0) {
      const wordArray: [string, number][] = words.map((word) => [word.word, word.count]);
      WordCloud(canvas, {
        list: wordArray,
        gridSize: Math.round(12 * (canvas.width / 800)),
        weightFactor: (size: number) => Math.max(size * (canvas.width / 800), 12),
        fontFamily: 'Arial, sans-serif',
        color: () => '#2C3E50',
        rotateRatio: 0.5,
        backgroundColor: 'rgba(255, 255, 255, 1)',
      });
    }
  }, [words]);

  const handleNextButtonClick = () => {
    let nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= questions.length) nextIndex = 0; // Loop to the start if end is reached

    const nextQuestionId = questions[nextIndex].id;
    setCurrentQuestionIndex(nextIndex);
    navigate(`/enter/${nextQuestionId}`, {
      state: {
        questions,
        currentQuestionIndex: nextIndex,
      },
    });
  };

  return (
    <div className="word-cloud-wrapper">
      <canvas ref={canvasRef} className="word-cloud-canvas"></canvas>
      <button className="navigate-btn" onClick={handleNextButtonClick}>
        Next
      </button>
    </div>
  );
};

export default WordCloudComponent;
