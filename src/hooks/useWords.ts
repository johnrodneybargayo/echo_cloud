import { useState, useEffect } from 'react';
import { getWords, addWord } from '../firebase/firebaseService';
import { Word } from '../types/word';

export const useWords = (questionId: string) => {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!questionId) return; // Exit if questionId is not provided

    const fetchWords = async () => {
      try {
        const fetchedWords = await getWords(questionId);
        console.log("Fetched Words:", fetchedWords); // Debugging
        setWords(fetchedWords);
      } catch (error) {
        console.error("Error fetching words:", error);
        setError('Failed to fetch words. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchWords();

    const intervalId = setInterval(fetchWords, 2000); // Poll every 2 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [questionId]);

  const submitWord = async (newWord: string) => {
    try {
      await addWord(newWord, questionId);
    } catch (error) {
      console.error("Error submitting word:", error);
      setError('Failed to submit the word. Please try again.');
    }
  };

  return { words, loading, error, submitWord };
};
