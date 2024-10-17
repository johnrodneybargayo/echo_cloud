// src/hooks/useWords.ts
import { useState, useEffect } from 'react';
import { getWords, addWord } from '../firebase/firebaseService';
import { Word } from '../types/word';

export const useWords = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWords = async () => {
      const fetchedWords = await getWords();
      console.log("Fetched Words:", fetchedWords); // Debugging
      setWords(fetchedWords);
      setLoading(false);
    };

    fetchWords();
    const intervalId = setInterval(fetchWords, 2000); // Poll every 2 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const submitWord = async (newWord: string) => {
    await addWord(newWord);
  };

  return { words, loading, submitWord };
};
