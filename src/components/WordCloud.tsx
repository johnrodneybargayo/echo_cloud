import React, { useEffect, useRef, useState, useCallback } from 'react';
import WordCloud from 'wordcloud';
import { Word } from '../types/word';
import { useNavigate } from 'react-router-dom';
import './WordCloud.css';

interface WordCloudProps {
  words: Word[];
}

// New vibrant and darker color palette for better readability on white background
const readableColorPalette = [
  '#1B263B', '#2C3E50', '#6C3483', '#2980B9', '#D35400', 
  '#1E8449', '#B03A2E', '#8E44AD', '#F39C12', '#27AE60', 
  '#2ECC71', '#E74C3C', '#34495E', '#7D3C98', '#F1C40F',
  '#F39C12', '#D35400', '#E67E22', '#3498DB', '#9B59B6',
];

const WordCloudComponent: React.FC<WordCloudProps> = ({ words }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wordColors, setWordColors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  // Function to adjust canvas size based on screen size
  const adjustCanvasSize = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Set canvas width and height dynamically based on window width
      const width = window.innerWidth > 768 ? 800 : window.innerWidth - 30; // 30px padding for mobile
      const height = window.innerWidth > 768 ? 400 : window.innerHeight * 0.6; // 60% of viewport height for mobile
      canvas.width = width;
      canvas.height = height;
    }
  };

  const animateWordCloud = useCallback((canvas: HTMLCanvasElement, wordArray: [string, number][], updatedColors: { [key: string]: string }) => {
    WordCloud(canvas, {
      list: wordArray,
      gridSize: 12,
      weightFactor: (size: number) => Math.max(size * 8, window.innerWidth > 768 ? 20 : 10), // Adjust size multiplier based on screen size
      fontFamily: 'Arial, sans-serif',
      color: (word: string) => updatedColors[word], // Use vibrant darker colors
      rotateRatio: 0.5, // Allows some words to rotate
      rotationSteps: 2,
      backgroundColor: 'rgba(255, 255, 255, 1)', // White background
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
  }, []);

  useEffect(() => {
    adjustCanvasSize(); // Adjust canvas size when the component mounts

    const handleResize = () => {
      adjustCanvasSize(); // Adjust canvas size on window resize
    };

    window.addEventListener('resize', handleResize);

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
      const wordArray: [string, number][] = sortedWords.map((word) => [word.word, word.count]);

      // Call animateWordCloud here with proper arguments
      animateWordCloud(canvas, wordArray, updatedColors); // Start the animation
    }

    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup event listener on component unmount
    };
  }, [words, wordColors, animateWordCloud]);

  const handleButtonClick = () => {
    navigate('/happiness-scale');
  };

  return (
    <div className="word-cloud-wrapper">
      <div className="word-cloud-container">
        <canvas ref={canvasRef} className="word-cloud-canvas"></canvas>
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
