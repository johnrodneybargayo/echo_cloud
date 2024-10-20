import React, { useEffect, useRef } from 'react';
import WordCloud from 'wordcloud';
import { Word } from '../types/word';
import './WordCloud.css';

interface WordCloudProps {
  words: Word[];
}

const WordCloudComponent: React.FC<WordCloudProps> = ({ words }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && words.length > 0) {
      const canvas = canvasRef.current;

      const wordArray = words.map((word) => [
        word.word,
        word.count, // The size of the word is determined by its count
      ]);

      WordCloud(canvas, {
        list: wordArray,
        gridSize: 10,
        weightFactor: (size: number) => size * 5, // Add number type for size
        fontFamily: 'Arial, sans-serif',
        color: () => `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color for each word
        rotateRatio: 0.5, // Rotate 50% of the words
        rotationSteps: 2, // Limit the angles
        backgroundColor: 'transparent', // Transparent background
        drawOutOfBound: false, // Prevent words from being drawn out of bounds
        shuffle: true, // Shuffle word positions for randomness
        click: (item: [string, number]) => { // Type for the word item clicked
          console.log(`You clicked on ${item[0]}`);
        },
        hover: (item: [string, number] | null, dimension: { x: number, y: number }, event: MouseEvent) => { 
          // Type for hover with item, dimension, and event
          canvas.title = item ? `Word: ${item[0]}` : '';
        },
      });
    }
  }, [words]);

  return (
    <div className="word-cloud-container">
      <canvas ref={canvasRef} width={800} height={600} className="word-cloud-canvas"></canvas>
    </div>
  );
};

export default WordCloudComponent;
