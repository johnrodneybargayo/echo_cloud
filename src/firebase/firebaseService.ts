// src/firebase/firebaseService.ts
import { ref, set, get, update, remove, push } from "firebase/database";
import { db } from './firebaseConfig';
import { Word } from '../types/word';
import { Question } from '../types/question';

// Add or update a word for a specific question in the Realtime Database
export const addWord = async (word: string, questionId: string): Promise<void> => {
  try {
    const wordRef = ref(db, `words/${questionId}/${word}`);
    const snapshot = await get(wordRef);

    if (snapshot.exists()) {
      const wordData = snapshot.val();
      const updatedCount = wordData.count + 1;
      await update(wordRef, { count: updatedCount });
      console.log(`Updated word count for "${word}" in question ${questionId} to ${updatedCount}`);
    } else {
      await set(wordRef, { word, count: 1 });
      console.log(`Added new word "${word}" with count 1 for question ${questionId}`);
    }
  } catch (error) {
    console.error('Error adding/updating word:', error);
    throw new Error('Failed to add/update word');
  }
};

// Fetch all words for a specific question from Realtime Database
export const getWords = async (questionId: string): Promise<Word[]> => {
  try {
    const dbRef = ref(db, `words/${questionId}`);
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const wordsObject = snapshot.val();
      return Object.values(wordsObject) as Word[];
    } else {
      console.log(`No words found for question ${questionId}`);
      return [];
    }
  } catch (error) {
    console.error("Error getting words:", error);
    throw new Error('Failed to fetch words');
  }
};

// Add a question to Firebase with a unique ID
export const addQuestion = async (question: Omit<Question, 'id'>): Promise<void> => {
  try {
    const questionsRef = ref(db, 'questions');
    const newQuestionRef = push(questionsRef);
    await set(newQuestionRef, { ...question, id: newQuestionRef.key });
    console.log(`Added question with ID ${newQuestionRef.key}`);
  } catch (error) {
    console.error('Error adding question:', error);
    throw new Error('Failed to add question');
  }
};

// Fetch all questions from Realtime Database
export const getQuestions = async (): Promise<Question[]> => {
  try {
    const dbRef = ref(db, 'questions');
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const questionsObject = snapshot.val();
      return Object.keys(questionsObject).map((key) => ({
        ...questionsObject[key],
        id: key,
      })) as Question[];
    } else {
      console.log("No questions found");
      return [];
    }
  } catch (error) {
    console.error("Error getting questions:", error);
    throw new Error('Failed to fetch questions');
  }
};

// Delete a question by ID from the Realtime Database
export const deleteQuestion = async (questionId: string): Promise<void> => {
  try {
    const questionRef = ref(db, `questions/${questionId}`);
    await remove(questionRef);
    console.log(`Deleted question with ID ${questionId}`);

    // Optionally, remove associated words
    const wordsRef = ref(db, `words/${questionId}`);
    await remove(wordsRef);
    console.log(`Deleted words for question ID ${questionId}`);
  } catch (error) {
    console.error('Error deleting question:', error);
    throw new Error('Failed to delete question');
  }
};
