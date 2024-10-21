import React, { useEffect, useRef, useState } from 'react';
import WordCloud from 'wordcloud';
import { Word } from '../types/word';
import { useNavigate } from 'react-router-dom';
import './WordCloud.css';

interface WordCloudProps {
  words: Word[];
}

// New readable color palette
const readableColorPalette = [
  '#2B2B2B', // Dark Gray
  '#333333', // Almost Black
  '#4A4A4A', // Mid-tone Gray
  '#6B6B6B', // Lighter Gray
  '#C74C4C', // Dark Red
  '#005F73', // Dark Cyan
  '#0A9396', // Muted Teal
  '#BB3E03', // Dark Orange
  '#E9D8A6', // Light Beige
  '#370617', // Dark Burgundy
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

      if (colorsChanged) {
        setWordColors(updatedColors); // Only update state if the colors changed
      }

      const wordArray = words.map((word) => [
        word.word,
        word.count,
      ]);

      WordCloud(canvas, {
        list: wordArray,
        gridSize: 10,
        weightFactor: (size: number) => Math.max(size * 5, 18),
        fontFamily: 'Arial, sans-serif',
        color: (word: string) => updatedColors[word],
        rotateRatio: 0.5,
        rotationSteps: 2,
        backgroundColor: 'transparent',
        drawOutOfBound: false,
        shuffle: true,
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
      {/* Remove this title if it's a duplicate */}
      <h1 className="title">Echo Cloud</h1>
      <div className="word-cloud-container">
        <canvas ref={canvasRef} width={800} height={600} className="word-cloud-canvas"></canvas>
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
