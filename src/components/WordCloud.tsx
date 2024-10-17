import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Word } from '../types/word';
import './WordCloud.css'; // Import CSS for animations

interface WordCloudProps {
  words: Word[];
}

interface PositionedWord extends Word {
  x: number;
  y: number;
  color: string;
  size: number;
  width: number;
  height: number;
}

const WordCloudComponent: React.FC<WordCloudProps> = ({ words }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wordColors = useRef<{ [key: string]: string }>({}); // Use useRef for color persistence
  const [positionedWords, setPositionedWords] = useState<PositionedWord[]>([]);

  // Function to generate and store a color for each word
  const getColorForWord = useCallback((word: string) => {
    if (!wordColors.current[word]) {
      const newColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
      wordColors.current[word] = newColor; // Store in useRef (no re-render)
    }
    return wordColors.current[word];
  }, []);

  // Helper function to detect overlapping
  const isOverlapping = useCallback(
    (x: number, y: number, width: number, height: number) => {
      return positionedWords.some((word) => {
        const overlapX = x < word.x + word.width && x + width > word.x;
        const overlapY = y < word.y + word.height && y + height > word.y;
        return overlapX && overlapY;
      });
    },
    [positionedWords]
  );

  // Grid-based placement with collision detection
  const placeWords = useCallback(
    (context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
      const padding = 10;
      const newWords: PositionedWord[] = [];
      let rowHeight = 0;
      let x = padding;
      let y = padding;

      words.forEach((word) => {
        const size = 20 + word.count * 5;
        context.font = `${size}px Arial`;
        const width = context.measureText(word.word).width;
        const height = size;

        // Move to a new row if needed
        if (x + width > canvasWidth - padding) {
          x = padding;
          y += rowHeight + padding;
          rowHeight = 0;
        }

        // Ensure words do not overlap
        if (isOverlapping(x, y, width, height)) {
          x += padding;
          if (x + width > canvasWidth - padding) {
            x = padding;
            y += rowHeight + padding;
            rowHeight = 0;
          }
        }

        newWords.push({
          ...word,
          x,
          y: y + height,
          color: getColorForWord(word.word),
          size,
          width,
          height,
        });

        x += width + padding;
        rowHeight = Math.max(rowHeight, height);
      });

      return newWords;
    },
    [words, isOverlapping, getColorForWord]
  );

  useEffect(() => {
    if (canvasRef.current && words.length > 0) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        console.error('Failed to acquire 2D context');
        return;
      }

      // Clear the canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Arrange words in a grid without overlapping
      const arrangedWords = placeWords(context, canvas.width, canvas.height);

      // Draw each word
      arrangedWords.forEach((word) => {
        context.font = `${word.size}px Arial`;
        context.fillStyle = word.color;
        context.fillText(word.word, word.x, word.y);
      });

      // Only set positionedWords if the words have changed to avoid unnecessary re-renders
      if (JSON.stringify(positionedWords) !== JSON.stringify(arrangedWords)) {
        setPositionedWords(arrangedWords); // Only update positionedWords once
      }
    }
  }, [words, placeWords, positionedWords]);

  return <canvas ref={canvasRef} width={800} height={800} className="word-cloud-canvas" />;
};

export default WordCloudComponent;
