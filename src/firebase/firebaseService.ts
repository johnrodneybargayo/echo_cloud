// src/firebase/firebaseService.ts
import { ref, set, get, update } from "firebase/database";
import { db } from './firebaseConfig';
import { Word } from '../types/word';

// Add or update a word in the Realtime Database
export const addWord = async (word: string) => {
  try {
    const wordRef = ref(db, 'words/' + word);
    const snapshot = await get(wordRef);

    if (snapshot.exists()) {
      const wordData = snapshot.val();
      const updatedCount = wordData.count + 1;
      await update(wordRef, { count: updatedCount });
    } else {
      await set(wordRef, { word, count: 1 });
    }
  } catch (error) {
    console.error('Error adding/updating word:', error);
  }
};

// Fetch all words from Realtime Database
export const getWords = async (): Promise<Word[]> => {
  try {
    const dbRef = ref(db, 'words');
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const wordsObject = snapshot.val();
      return Object.values(wordsObject) as Word[];
    } else {
      console.log("No words found");
      return [];
    }
  } catch (error) {
    console.error("Error getting words:", error);
    return [];
  }
};
