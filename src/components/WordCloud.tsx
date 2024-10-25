import React, { useEffect, useRef, useState } from 'react';
import WordCloud from 'wordcloud';
import { Word } from '../types/word';
import { useNavigate } from 'react-router-dom';
import './WordCloud.css';

interface WordCloudProps {
  words: Word[];
}

const readableColorPalette = [
  '#2B2B2B', '#333333', '#4A4A4A', '#6B6B6B', '#C74C4C', 
  '#005F73', '#0A9396', '#BB3E03', '#E9D8A6', '#370617'
];

const WordCloudComponent: React.FC<WordCloudProps> = ({ words }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wordColors, setWordColors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (canvasRef.current && words.length > 0) {
      const canvas = canvasRef.current;
      const updatedColors = { ...wordColors };
      let colorsChanged = false;

      words.forEach((word) => {
        if (!updatedColors[word.word]) {
          updatedColors[word.word] = readableColorPalette[Math.floor(Math.random() * readableColorPalette.length)];
          colorsChanged = true;
        }
      });

      if (colorsChanged) setWordColors(updatedColors);

      // Sort words by count to ensure larger words come first
      const sortedWords = words.sort((a, b) => b.count - a.count);

      const wordArray = sortedWords.map((word) => [word.word, word.count]);

      WordCloud(canvas, {
        list: wordArray,
        gridSize: 12,
        weightFactor: (size: number) => Math.max(size * 8, 20), // Adjust size multiplier if necessary
        fontFamily: 'Arial, sans-serif',
        color: (word: string) => updatedColors[word],
        rotateRatio: 0.5, // Allows some words to rotate
        rotationSteps: 2,
        backgroundColor: 'rgba(240, 240, 240, 0.7)', // Slightly off-white background
        drawOutOfBound: false,
        shuffle: false, // Keep larger words more centered
        origin: [canvas.width / 2, canvas.height / 2], // Start placing words from the center
        rotate: (item: [string, number]) => {
          // Larger words (based on count > 30) will not rotate, remaining horizontal
          return item[1] > 30 ? 0 : (Math.random() > 0.5 ? 90 : 0); // Smaller words can rotate randomly
        },
        click: (item: [string, number]) => {
          console.log(`You clicked on ${item[0]}`);
        },
        hover: (item: [string, number] | null, dimension: { x: number, y: number }, event: MouseEvent) => {
          canvas.title = item ? `Word: ${item[0]}` : '';
        },
      });
    }
  }, [words, wordColors]);

  const handleButtonClick = () => {
    navigate('/happiness-scale');
  };

  return (
    <div className="word-cloud-wrapper">
      <div className="word-cloud-container">
        <canvas ref={canvasRef} width={1800} height={600} className="word-cloud-canvas"></canvas>
      </div>
      <div className="button-container">
        <button className="navigate-btn" onClick={handleButtonClick}>
          Next
        </button>
      </div>
    </div>
  );
};

export default WordCloudComponent;
